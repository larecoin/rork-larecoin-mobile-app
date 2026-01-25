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
}

interface MerchantProfile {
  name: string;
  category: string;
  description: string;
  linkedWalletId: string | null;
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
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile>({
    name: 'Larecoin Café',
    category: 'Food & Beverage',
    description: 'Premium coffee and pastries, accepting crypto payments',
    linkedWalletId: '1',
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
        const savedProfile = await AsyncStorage.getItem('merchantProfile');
        if (savedProfile) {
          setMerchantProfile(JSON.parse(savedProfile));
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
    if (wallets.length <= 1) return;
    const updated = wallets.filter(w => w.id !== walletId);
    if (activeWalletId === walletId) {
      setActiveWalletId(updated[0].id);
      await AsyncStorage.setItem('activeWalletId', updated[0].id);
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
    const updated = { ...merchantProfile, linkedWalletId: walletId };
    setMerchantProfile(updated);
    try {
      await AsyncStorage.setItem('merchantProfile', JSON.stringify(updated));
    } catch (error) {
      console.log('Error linking wallet:', error);
    }
  }, [merchantProfile]);

  const activeWallet = wallets.find(w => w.id === activeWalletId) || wallets[0];
  const linkedMerchantWallet = wallets.find(w => w.id === merchantProfile.linkedWalletId);

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
    merchantProfile,
    merchantStats,
    completeOrder,
    wallets,
    activeWallet,
    activeWalletId,
    createWallet,
    updateWalletLabel,
    deleteWallet,
    switchActiveWallet,
    linkWalletToMerchant,
    linkedMerchantWallet,
  };
});
