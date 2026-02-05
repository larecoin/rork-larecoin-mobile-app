import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

export type VerificationStep = 'idle' | 'biometric' | 'sms_send' | 'sms_verify' | 'success' | 'failed';

interface VerificationState {
  step: VerificationStep;
  isVerifying: boolean;
  phoneNumber: string;
  is2FAEnabled: boolean;
  isBiometricAvailable: boolean;
  lastVerifiedAt: number | null;
}

interface PendingTransaction {
  type: string;
  amount: number;
  token: string;
  to?: string;
  description?: string;
}

const STORAGE_KEYS = {
  PHONE_NUMBER: 'txn_verify_phone',
  TWO_FA_ENABLED: 'txn_2fa_enabled',
  BIOMETRIC_ENABLED: 'txn_biometric_enabled',
} as const;

async function secureSet(key: string, value: string) {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (e) {
    console.log('[TxnVerify] secureSet error:', e);
  }
}

async function secureGet(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  } catch (e) {
    console.log('[TxnVerify] secureGet error:', e);
    return null;
  }
}

function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export const [TransactionVerificationProvider, useTransactionVerification] = createContextHook(() => {
  const [state, setState] = useState<VerificationState>({
    step: 'idle',
    isVerifying: false,
    phoneNumber: '',
    is2FAEnabled: false,
    isBiometricAvailable: false,
    lastVerifiedAt: null,
  });

  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const resolveRef = useRef<((success: boolean) => void) | null>(null);

  useEffect(() => {
    const init = async () => {
      console.log('[TxnVerify] Initializing...');
      const [phone, twoFAEnabled] = await Promise.all([
        secureGet(STORAGE_KEYS.PHONE_NUMBER),
        AsyncStorage.getItem(STORAGE_KEYS.TWO_FA_ENABLED),
      ]);

      let biometricAvailable = false;
      if (Platform.OS !== 'web') {
        try {
          const LocalAuth = await import('expo-local-authentication');
          const compatible = await LocalAuth.hasHardwareAsync();
          const enrolled = await LocalAuth.isEnrolledAsync();
          biometricAvailable = compatible && enrolled;
        } catch (e) {
          console.log('[TxnVerify] Biometric check error:', e);
        }
      }

      setState(prev => ({
        ...prev,
        phoneNumber: phone || '',
        is2FAEnabled: twoFAEnabled === 'true',
        isBiometricAvailable: biometricAvailable,
      }));
      console.log('[TxnVerify] Initialized, biometric:', biometricAvailable, '2FA:', twoFAEnabled === 'true');
    };
    init();
  }, []);

  const setPhoneNumber = useCallback(async (phone: string) => {
    await secureSet(STORAGE_KEYS.PHONE_NUMBER, phone);
    setState(prev => ({ ...prev, phoneNumber: phone }));
    console.log('[TxnVerify] Phone number set:', phone.slice(0, 4) + '****');
  }, []);

  const enable2FA = useCallback(async (phone: string) => {
    await secureSet(STORAGE_KEYS.PHONE_NUMBER, phone);
    await AsyncStorage.setItem(STORAGE_KEYS.TWO_FA_ENABLED, 'true');
    setState(prev => ({ ...prev, is2FAEnabled: true, phoneNumber: phone }));
    console.log('[TxnVerify] 2FA enabled');
  }, []);

  const disable2FA = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.TWO_FA_ENABLED, 'false');
    setState(prev => ({ ...prev, is2FAEnabled: false }));
    console.log('[TxnVerify] 2FA disabled');
  }, []);

  const performBiometric = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      console.log('[TxnVerify] Web: biometric simulated success');
      return true;
    }
    try {
      const LocalAuth = await import('expo-local-authentication');
      const result = await LocalAuth.authenticateAsync({
        promptMessage: 'Verify your identity to proceed',
        fallbackLabel: 'Use PIN instead',
        disableDeviceFallback: false,
      });
      console.log('[TxnVerify] Biometric result:', result.success);
      return result.success;
    } catch (e) {
      console.log('[TxnVerify] Biometric error:', e);
      return false;
    }
  }, []);

  const sendSMSOTP = useCallback(async (): Promise<boolean> => {
    if (!state.phoneNumber) {
      console.log('[TxnVerify] No phone number configured');
      return false;
    }
    const otp = generateOTP();
    setGeneratedOTP(otp);
    setOtpExpiry(Date.now() + 5 * 60 * 1000);

    console.log('[TxnVerify] SMS OTP sent to', state.phoneNumber.slice(0, 4) + '****', '| OTP:', otp);
    Alert.alert('OTP Sent', `A 6-digit code has been sent to ${state.phoneNumber.slice(0, 4)}****${state.phoneNumber.slice(-2)}.\n\n(Demo OTP: ${otp})`);
    return true;
  }, [state.phoneNumber]);

  const verifySMSOTP = useCallback((inputOTP: string): boolean => {
    if (Date.now() > otpExpiry) {
      console.log('[TxnVerify] OTP expired');
      return false;
    }
    const valid = inputOTP === generatedOTP;
    console.log('[TxnVerify] OTP verification:', valid);
    return valid;
  }, [generatedOTP, otpExpiry]);

  const verifyTransaction = useCallback((transaction: PendingTransaction): Promise<boolean> => {
    console.log('[TxnVerify] Starting verification for:', transaction.type, transaction.amount, transaction.token);
    setPendingTransaction(transaction);
    setState(prev => ({ ...prev, step: 'biometric', isVerifying: true }));

    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const completeBiometricStep = useCallback(async () => {
    setState(prev => ({ ...prev, step: 'biometric' }));
    const success = await performBiometric();
    if (!success) {
      setState(prev => ({ ...prev, step: 'failed', isVerifying: false }));
      resolveRef.current?.(false);
      resolveRef.current = null;
      return;
    }

    if (state.is2FAEnabled && state.phoneNumber) {
      setState(prev => ({ ...prev, step: 'sms_send' }));
      const sent = await sendSMSOTP();
      if (sent) {
        setState(prev => ({ ...prev, step: 'sms_verify' }));
      } else {
        setState(prev => ({ ...prev, step: 'failed', isVerifying: false }));
        resolveRef.current?.(false);
        resolveRef.current = null;
      }
    } else {
      setState(prev => ({ ...prev, step: 'success', isVerifying: false, lastVerifiedAt: Date.now() }));
      resolveRef.current?.(true);
      resolveRef.current = null;
    }
  }, [performBiometric, state.is2FAEnabled, state.phoneNumber, sendSMSOTP]);

  const completeOTPStep = useCallback((otp: string) => {
    const valid = verifySMSOTP(otp);
    if (valid) {
      setState(prev => ({ ...prev, step: 'success', isVerifying: false, lastVerifiedAt: Date.now() }));
      resolveRef.current?.(true);
    } else {
      setState(prev => ({ ...prev, step: 'failed', isVerifying: false }));
      resolveRef.current?.(false);
    }
    resolveRef.current = null;
  }, [verifySMSOTP]);

  const resendOTP = useCallback(async () => {
    await sendSMSOTP();
  }, [sendSMSOTP]);

  const cancelVerification = useCallback(() => {
    console.log('[TxnVerify] Verification cancelled');
    setState(prev => ({ ...prev, step: 'idle', isVerifying: false }));
    setPendingTransaction(null);
    resolveRef.current?.(false);
    resolveRef.current = null;
  }, []);

  const resetVerification = useCallback(() => {
    setState(prev => ({ ...prev, step: 'idle', isVerifying: false }));
    setPendingTransaction(null);
  }, []);

  return {
    ...state,
    pendingTransaction,
    verifyTransaction,
    completeBiometricStep,
    completeOTPStep,
    resendOTP,
    cancelVerification,
    resetVerification,
    setPhoneNumber,
    enable2FA,
    disable2FA,
  };
});
