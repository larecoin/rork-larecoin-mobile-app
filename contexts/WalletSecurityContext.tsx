import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  generateMnemonic,
  validateMnemonic,
  deriveKeysFromMnemonic,
  WalletKeys,
} from '@/services/walletCrypto';

export type WalletSetupStatus = 'none' | 'creating' | 'importing' | 'ready';
export type SecurityLevel = 'none' | 'pin' | 'biometric';

interface WalletSecurityState {
  setupStatus: WalletSetupStatus;
  isLocked: boolean;
  securityLevel: SecurityLevel;
  hasBackedUp: boolean;
  walletKeys: WalletKeys | null;
  isInitialized: boolean;
}

const STORAGE_KEYS = {
  SETUP_STATUS: 'wallet_setup_status',
  SECURITY_LEVEL: 'wallet_security_level',
  HAS_BACKED_UP: 'wallet_has_backed_up',
  PIN_HASH: 'wallet_pin_hash',
  MNEMONIC: 'wallet_mnemonic',
  PUBLIC_KEY: 'wallet_public_key',
  IS_LOCKED: 'wallet_is_locked',
} as const;

async function secureSet(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.log('[WalletSecurity] secureSet error:', e);
  }
}

async function secureGet(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.log('[WalletSecurity] secureGet error:', e);
    return null;
  }
}

async function secureDelete(key: string) {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (e) {
    console.log('[WalletSecurity] secureDelete error:', e);
  }
}

function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'pin_' + Math.abs(hash).toString(16);
}

export const [WalletSecurityProvider, useWalletSecurity] = createContextHook(() => {
  const [state, setState] = useState<WalletSecurityState>({
    setupStatus: 'none',
    isLocked: false,
    securityLevel: 'none',
    hasBackedUp: false,
    walletKeys: null,
    isInitialized: false,
  });
  const [tempMnemonic, setTempMnemonic] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      console.log('[WalletSecurity] Initializing...');
      try {
        const [setupStatus, securityLevel, hasBackedUp, mnemonic, publicKey] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SETUP_STATUS),
          AsyncStorage.getItem(STORAGE_KEYS.SECURITY_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.HAS_BACKED_UP),
          secureGet(STORAGE_KEYS.MNEMONIC),
          secureGet(STORAGE_KEYS.PUBLIC_KEY),
        ]);

        let walletKeys: WalletKeys | null = null;
        let status: WalletSetupStatus = 'none';

        if (mnemonic && publicKey) {
          walletKeys = deriveKeysFromMnemonic(mnemonic);
          status = 'ready';
        } else if (setupStatus === 'ready') {
          status = 'none';
        }

        const secLevel = (securityLevel as SecurityLevel) || 'none';
        const shouldLock = status === 'ready' && secLevel !== 'none';

        setState({
          setupStatus: status,
          isLocked: shouldLock,
          securityLevel: secLevel,
          hasBackedUp: hasBackedUp === 'true',
          walletKeys,
          isInitialized: true,
        });
        console.log('[WalletSecurity] Initialized, status:', status, 'locked:', shouldLock);
      } catch (e) {
        console.log('[WalletSecurity] Init error:', e);
        setState(prev => ({ ...prev, isInitialized: true }));
      }
    };
    init();
  }, []);

  const createNewWallet = useCallback(async (wordCount: 12 | 24 = 12): Promise<string> => {
    console.log('[WalletSecurity] Creating new wallet...');
    const mnemonic = generateMnemonic(wordCount);
    setTempMnemonic(mnemonic);
    setState(prev => ({ ...prev, setupStatus: 'creating' }));
    return mnemonic;
  }, []);

  const confirmWalletCreation = useCallback(async () => {
    if (!tempMnemonic) {
      console.log('[WalletSecurity] No temp mnemonic to confirm');
      return false;
    }
    const keys = deriveKeysFromMnemonic(tempMnemonic);
    await secureSet(STORAGE_KEYS.MNEMONIC, tempMnemonic);
    await secureSet(STORAGE_KEYS.PUBLIC_KEY, keys.publicKey);
    await AsyncStorage.setItem(STORAGE_KEYS.SETUP_STATUS, 'ready');

    setState(prev => ({
      ...prev,
      setupStatus: 'ready',
      walletKeys: keys,
      isLocked: false,
    }));
    setTempMnemonic(null);
    console.log('[WalletSecurity] Wallet created successfully');
    return true;
  }, [tempMnemonic]);

  const importWallet = useCallback(async (mnemonic: string): Promise<boolean> => {
    console.log('[WalletSecurity] Importing wallet...');
    if (!validateMnemonic(mnemonic)) {
      console.log('[WalletSecurity] Invalid mnemonic');
      return false;
    }
    const keys = deriveKeysFromMnemonic(mnemonic);
    await secureSet(STORAGE_KEYS.MNEMONIC, mnemonic);
    await secureSet(STORAGE_KEYS.PUBLIC_KEY, keys.publicKey);
    await AsyncStorage.setItem(STORAGE_KEYS.SETUP_STATUS, 'ready');
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_BACKED_UP, 'true');

    setState(prev => ({
      ...prev,
      setupStatus: 'ready',
      walletKeys: keys,
      hasBackedUp: true,
      isLocked: false,
    }));
    console.log('[WalletSecurity] Wallet imported successfully');
    return true;
  }, []);

  const setupPin = useCallback(async (pin: string) => {
    console.log('[WalletSecurity] Setting up PIN...');
    const hashed = hashPin(pin);
    await secureSet(STORAGE_KEYS.PIN_HASH, hashed);
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY_LEVEL, 'pin');
    setState(prev => ({ ...prev, securityLevel: 'pin' }));
    console.log('[WalletSecurity] PIN set successfully');
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    const storedHash = await secureGet(STORAGE_KEYS.PIN_HASH);
    const inputHash = hashPin(pin);
    const valid = storedHash === inputHash;
    if (valid) {
      setState(prev => ({ ...prev, isLocked: false }));
    }
    console.log('[WalletSecurity] PIN verify:', valid);
    return valid;
  }, []);

  const enableBiometric = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY_LEVEL, 'biometric');
    setState(prev => ({ ...prev, securityLevel: 'biometric' }));
    console.log('[WalletSecurity] Biometric enabled');
  }, []);

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      setState(prev => ({ ...prev, isLocked: false }));
      return true;
    }
    try {
      const LocalAuth = await import('expo-local-authentication');
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Unlock Wallet',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        setState(prev => ({ ...prev, isLocked: false }));
      }
      return result.success;
    } catch (e) {
      console.log('[WalletSecurity] Biometric error:', e);
      return false;
    }
  }, []);

  const lockWallet = useCallback(() => {
    if (state.securityLevel !== 'none') {
      setState(prev => ({ ...prev, isLocked: true }));
      console.log('[WalletSecurity] Wallet locked');
    }
  }, [state.securityLevel]);

  const markBackedUp = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_BACKED_UP, 'true');
    setState(prev => ({ ...prev, hasBackedUp: true }));
  }, []);

  const getMnemonic = useCallback(async (): Promise<string | null> => {
    return secureGet(STORAGE_KEYS.MNEMONIC);
  }, []);

  const resetWallet = useCallback(async () => {
    console.log('[WalletSecurity] Resetting wallet...');
    await Promise.all([
      secureDelete(STORAGE_KEYS.MNEMONIC),
      secureDelete(STORAGE_KEYS.PUBLIC_KEY),
      secureDelete(STORAGE_KEYS.PIN_HASH),
      AsyncStorage.removeItem(STORAGE_KEYS.SETUP_STATUS),
      AsyncStorage.removeItem(STORAGE_KEYS.SECURITY_LEVEL),
      AsyncStorage.removeItem(STORAGE_KEYS.HAS_BACKED_UP),
    ]);
    setState({
      setupStatus: 'none',
      isLocked: false,
      securityLevel: 'none',
      hasBackedUp: false,
      walletKeys: null,
      isInitialized: true,
    });
    setTempMnemonic(null);
  }, []);

  const removePin = useCallback(async () => {
    await secureDelete(STORAGE_KEYS.PIN_HASH);
    await AsyncStorage.setItem(STORAGE_KEYS.SECURITY_LEVEL, 'none');
    setState(prev => ({ ...prev, securityLevel: 'none', isLocked: false }));
  }, []);

  return {
    ...state,
    tempMnemonic,
    createNewWallet,
    confirmWalletCreation,
    importWallet,
    setupPin,
    verifyPin,
    enableBiometric,
    unlockWithBiometric,
    lockWallet,
    markBackedUp,
    getMnemonic,
    resetWallet,
    removePin,
  };
});
