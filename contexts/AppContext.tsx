import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';
import { tokens, Token } from '@/constants/tokens';
import { transactions, Transaction } from '@/mocks/transactions';
import { products, orders, Product, Order, merchantStats } from '@/mocks/products';
import { lightTheme, darkTheme, ThemeMode } from '@/constants/colors';

export type AppMode = 'wallet' | 'merchant';

export interface Wallet {
  id: string;
  label: string;
  address: string;
  createdAt: Date;
  isDefault: boolean;
  parentId?: string | null;
  isSubWallet?: boolean;
}

export type MerchantType = 'business' | 'charity';

export interface MerchantProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  linkedWalletId: string | null;
  type: MerchantType;
  isActive: boolean;
}

export interface CharityGrant {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: Date;
  txHash: string;
  nftCertificateId?: string;
}

export interface CharityStats {
  totalDonations: number;
  totalDonors: number;
  countriesReached: number;
  monthlyRecurring: number;
  topDonors: { name: string; amount: number }[];
}

const generateWalletAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

const defaultWallet: Wallet = {
  id: '1',
  label: 'Main Wallet',
  address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
  createdAt: new Date(),
  isDefault: true,
  parentId: null,
  isSubWallet: false,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [mode, setMode] = useState<AppMode>('wallet');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [userTokens, setUserTokens] = useState<Token[]>(tokens);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>(transactions);
  const [merchantProducts, setMerchantProducts] = useState<Product[]>(products);
  const [merchantOrders, setMerchantOrders] = useState<Order[]>(orders);
  const [wallets, setWallets] = useState<Wallet[]>([defaultWallet]);
  const [activeWalletId, setActiveWalletId] = useState<string>('1');
  const [merchantProfiles, setMerchantProfiles] = useState<MerchantProfile[]>([
    {
      id: '1',
      name: 'Larecoin Café',
      category: 'Food & Beverage',
      description: 'Premium coffee and pastries, accepting crypto payments',
      linkedWalletId: '1',
      type: 'business',
      isActive: true,
    },
  ]);
  const [activeMerchantId, setActiveMerchantId] = useState<string>('1');
  const [charityGrants, setCharityGrants] = useState<CharityGrant[]>([
    { id: '1', donorName: 'Anonymous Whale', amount: 5000, currency: 'USDC', date: new Date('2025-01-20'), txHash: '0xabc123...', nftCertificateId: 'NFT-001' },
    { id: '2', donorName: 'CryptoPhilanthropy DAO', amount: 10000, currency: 'SOL', date: new Date('2025-01-18'), txHash: '0xdef456...', nftCertificateId: 'NFT-002' },
    { id: '3', donorName: 'John D.', amount: 250, currency: 'LARE', date: new Date('2025-01-15'), txHash: '0xghi789...', nftCertificateId: 'NFT-003' },
  ]);
  const [charityStats] = useState<CharityStats>({
    totalDonations: 45250,
    totalDonors: 312,
    countriesReached: 47,
    monthlyRecurring: 2800,
    topDonors: [
      { name: 'CryptoPhilanthropy DAO', amount: 10000 },
      { name: 'Anonymous Whale', amount: 5000 },
      { name: 'GreenFuture Fund', amount: 3500 },
    ],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('appMode');
        if (savedMode === 'wallet' || savedMode === 'merchant') {
          setMode(savedMode);
        }
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeMode(savedTheme);
        }
        const savedWallets = await AsyncStorage.getItem('wallets');
        if (savedWallets) {
          const parsed = JSON.parse(savedWallets);
          setWallets(parsed.map((w: Wallet) => ({ ...w, createdAt: new Date(w.createdAt) })));
        }
        const savedActiveWallet = await AsyncStorage.getItem('activeWalletId');
        if (savedActiveWallet) {
          setActiveWalletId(savedActiveWallet);
        }
        const savedProfiles = await AsyncStorage.getItem('merchantProfiles');
        if (savedProfiles) {
          setMerchantProfiles(JSON.parse(savedProfiles));
        }
        const savedActiveMerchant = await AsyncStorage.getItem('activeMerchantId');
        if (savedActiveMerchant) {
          setActiveMerchantId(savedActiveMerchant);
        }
      } catch (error) {
        console.log('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const switchMode = useCallback(async (newMode: AppMode) => {
    console.log('Switching mode to:', newMode);
    setMode(newMode);
    try {
      await AsyncStorage.setItem('appMode', newMode);
    } catch (error) {
      console.log('Error saving app mode:', error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    console.log('Switching theme to:', newTheme);
    setThemeMode(newTheme);
    try {
      await AsyncStorage.setItem('themeMode', newTheme);
    } catch (error) {
      console.log('Error saving theme mode:', error);
    }
  }, [themeMode]);

  const colors = themeMode === 'light' ? lightTheme : darkTheme;

  const getTotalBalance = useCallback(() => {
    return userTokens.reduce((total, token) => total + (token.balance * token.usdValue), 0);
  }, [userTokens]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setUserTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const completeOrder = useCallback((orderId: string) => {
    setMerchantOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      )
    );
  }, []);

  const createWallet = useCallback(async (label: string) => {
    const newWallet: Wallet = {
      id: Date.now().toString(),
      label,
      address: generateWalletAddress(),
      createdAt: new Date(),
      isDefault: wallets.length === 0,
      parentId: null,
      isSubWallet: false,
    };
    const updated = [...wallets, newWallet];
    setWallets(updated);
    try {
      await AsyncStorage.setItem('wallets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving wallets:', error);
    }
    return newWallet;
  }, [wallets]);

  const createSubWallet = useCallback(async (label: string, parentId: string) => {
    const parentWallet = wallets.find(w => w.id === parentId);
    if (!parentWallet || parentWallet.isSubWallet) {
      console.log('Cannot create sub-wallet: invalid parent');
      return null;
    }
    const newSubWallet: Wallet = {
      id: Date.now().toString(),
      label,
      address: generateWalletAddress(),
      createdAt: new Date(),
      isDefault: false,
      parentId,
      isSubWallet: true,
    };
    const updated = [...wallets, newSubWallet];
    setWallets(updated);
    try {
      await AsyncStorage.setItem('wallets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error saving sub-wallet:', error);
    }
    return newSubWallet;
  }, [wallets]);

  const getSubWallets = useCallback((parentId: string) => {
    return wallets.filter(w => w.parentId === parentId);
  }, [wallets]);

  const getMainWallets = useCallback(() => {
    return wallets.filter(w => !w.isSubWallet);
  }, [wallets]);

  const updateWalletLabel = useCallback(async (walletId: string, newLabel: string) => {
    const updated = wallets.map(w => 
      w.id === walletId ? { ...w, label: newLabel } : w
    );
    setWallets(updated);
    try {
      await AsyncStorage.setItem('wallets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error updating wallet:', error);
    }
  }, [wallets]);

  const deleteWallet = useCallback(async (walletId: string) => {
    const walletToDelete = wallets.find(w => w.id === walletId);
    if (!walletToDelete) return;
    
    const mainWallets = wallets.filter(w => !w.isSubWallet);
    if (!walletToDelete.isSubWallet && mainWallets.length <= 1) return;
    
    let updated = wallets.filter(w => w.id !== walletId);
    if (!walletToDelete.isSubWallet) {
      updated = updated.filter(w => w.parentId !== walletId);
    }
    
    if (activeWalletId === walletId || wallets.find(w => w.id === activeWalletId)?.parentId === walletId) {
      const newActiveWallet = updated.find(w => !w.isSubWallet) || updated[0];
      setActiveWalletId(newActiveWallet.id);
      await AsyncStorage.setItem('activeWalletId', newActiveWallet.id);
    }
    setWallets(updated);
    try {
      await AsyncStorage.setItem('wallets', JSON.stringify(updated));
    } catch (error) {
      console.log('Error deleting wallet:', error);
    }
  }, [wallets, activeWalletId]);

  const switchActiveWallet = useCallback(async (walletId: string) => {
    setActiveWalletId(walletId);
    try {
      await AsyncStorage.setItem('activeWalletId', walletId);
    } catch (error) {
      console.log('Error switching wallet:', error);
    }
  }, []);

  const linkWalletToMerchant = useCallback(async (walletId: string | null) => {
    const updated = merchantProfiles.map(p => 
      p.id === activeMerchantId ? { ...p, linkedWalletId: walletId } : p
    );
    setMerchantProfiles(updated);
    try {
      await AsyncStorage.setItem('merchantProfiles', JSON.stringify(updated));
    } catch (error) {
      console.log('Error linking wallet:', error);
    }
  }, [merchantProfiles, activeMerchantId]);

  const addMerchantProfile = useCallback(async (profile: Omit<MerchantProfile, 'id' | 'isActive'>) => {
    const newProfile: MerchantProfile = {
      ...profile,
      id: Date.now().toString(),
      isActive: false,
    };
    const updated = [...merchantProfiles, newProfile];
    setMerchantProfiles(updated);
    try {
      await AsyncStorage.setItem('merchantProfiles', JSON.stringify(updated));
    } catch (error) {
      console.log('Error adding merchant profile:', error);
    }
    return newProfile;
  }, [merchantProfiles]);

  const switchMerchantProfile = useCallback(async (profileId: string) => {
    const updated = merchantProfiles.map(p => ({
      ...p,
      isActive: p.id === profileId,
    }));
    setMerchantProfiles(updated);
    setActiveMerchantId(profileId);
    try {
      await AsyncStorage.setItem('merchantProfiles', JSON.stringify(updated));
      await AsyncStorage.setItem('activeMerchantId', profileId);
    } catch (error) {
      console.log('Error switching merchant profile:', error);
    }
  }, [merchantProfiles]);

  const activeWallet = wallets.find(w => w.id === activeWalletId) || wallets[0];
  const activeMerchantProfile = merchantProfiles.find(p => p.id === activeMerchantId) || merchantProfiles[0];
  const isCharityMode = activeMerchantProfile?.type === 'charity';
  const linkedMerchantWallet = wallets.find(w => w.id === activeMerchantProfile?.linkedWalletId);

  return {
    mode,
    switchMode,
    themeMode,
    toggleTheme,
    colors,
    isLoading,
    userTokens,
    userTransactions,
    getTotalBalance,
    addTransaction,
    merchantProducts,
    merchantOrders,
    merchantProfile: activeMerchantProfile,
    merchantProfiles,
    activeMerchantId,
    isCharityMode,
    merchantStats,
    charityStats,
    charityGrants,
    completeOrder,
    addMerchantProfile,
    switchMerchantProfile,
    wallets,
    activeWallet,
    activeWalletId,
    createWallet,
    createSubWallet,
    getSubWallets,
    getMainWallets,
    updateWalletLabel,
    deleteWallet,
    switchActiveWallet,
    linkWalletToMerchant,
    linkedMerchantWallet,
  };
});
