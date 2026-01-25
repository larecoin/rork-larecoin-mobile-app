import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Eye, EyeOff, ChevronRight, Plus, ChevronDown, Image, Coins, Droplets, Wallet, Check, Trash2, Edit3, Menu, Search, ArrowLeftRight, Clover, Receipt, GitBranch, Users, ShoppingCart, DollarSign, ShieldCheck, HandCoins, Send } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import ModeToggle from '@/components/ModeToggle';
import TokenCard from '@/components/TokenCard';
import TransactionItem from '@/components/TransactionItem';
import ActionButton from '@/components/ActionButton';
import NavMenuModal from '@/components/NavMenuModal';

export default function WalletDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { 
    userTokens, 
    userTransactions, 
    getTotalBalance, 
    wallets, 
    activeWallet, 
    createWallet, 
    switchActiveWallet,
    deleteWallet,
    updateWalletLabel,
    colors,
    themeMode
  } = useApp();
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [showWalletPicker, setShowWalletPicker] = React.useState(false);
  const [showNewWalletModal, setShowNewWalletModal] = React.useState(false);
  const [newWalletName, setNewWalletName] = React.useState('');
  const [editingWalletId, setEditingWalletId] = React.useState<string | null>(null);
  const [editWalletName, setEditWalletName] = React.useState('');
  const [showNavMenu, setShowNavMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNFTs, setShowNFTs] = React.useState(false);

  const totalBalance = getTotalBalance();
  const recentTransactions = userTransactions.slice(0, 4);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleCreateWallet = async () => {
    if (newWalletName.trim()) {
      await createWallet(newWalletName.trim());
      setNewWalletName('');
      setShowNewWalletModal(false);
    }
  };

  const handleEditWallet = async () => {
    if (editingWalletId && editWalletName.trim()) {
      await updateWalletLabel(editingWalletId, editWalletName.trim());
      setEditingWalletId(null);
      setEditWalletName('');
    }
  };

  const featureButtonsRow1 = [
    { id: 'request-payment', icon: Send, label: 'Request Pay', color: '#16A085', onPress: () => router.push('/(tabs)/(wallet)/request-payment') },
    { id: 'staking', icon: Coins, label: 'Staking', color: '#F39C12', onPress: () => router.push('/(tabs)/(wallet)/staking') },
    { id: 'bonds', icon: Receipt, label: 'Bonds', color: '#1ABC9C', onPress: () => router.push('/(tabs)/(wallet)/bonds') },
    { id: 'pools', icon: Droplets, label: 'Pools', color: '#3498DB', onPress: () => router.push('/(tabs)/(wallet)/pools') },
    { id: 'lucky', icon: Clover, label: 'Lucky Draws', color: '#E74C3C', onPress: () => router.push('/(tabs)/(wallet)/lucky-draws') },
  ];

  const featureButtonsRow2 = [
    { id: 'kyc-aml', icon: ShieldCheck, label: 'KYC & AML', color: '#2980B9', onPress: () => router.push('/(tabs)/(wallet)/kyc-aml') },
    { id: 'bridge', icon: GitBranch, label: 'Bridge', color: '#9B59B6', onPress: () => router.push('/(tabs)/(wallet)/bridge') },
    { id: 'borrow-lend', icon: HandCoins, label: 'Borrow/Lend', color: '#8E44AD', onPress: () => router.push('/(tabs)/(wallet)/borrow-lend') },
    { id: 'dao', icon: Users, label: 'DAO', color: '#E67E22', onPress: () => router.push('/(tabs)/(wallet)/dao') },
    { id: 'transactions', icon: ArrowLeftRight, label: 'Transactions', color: '#2ECC71', onPress: () => router.push('/(tabs)/(wallet)/transactions') },
  ];

  const lareBalance = 12450.75;
  const lusdBalance = 5280.50;

  const isDark = themeMode === 'dark';
  const balanceCardBg = isDark ? '#1A3A4A' : '#B5E5F5';
  const balanceCardTextPrimary = isDark ? '#E8F6FA' : '#0D3B54';
  const balanceCardTextSecondary = isDark ? '#A8D4E6' : '#1A5276';

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.menuButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowNavMenu(true)}
          >
            <Menu size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.walletSelector}
            onPress={() => setShowWalletPicker(!showWalletPicker)}
          >
            <View style={[styles.walletIconBadge, { backgroundColor: colors.primary + '20' }]}>
              <Wallet size={14} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>Personal Wallet</Text>
              <Text style={[styles.walletLabel, { color: colors.text }]}>{activeWallet?.label || 'Main Wallet'}</Text>
            </View>
            <ChevronDown size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <ModeToggle />
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search tokens, transactions..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {showWalletPicker && (
          <View style={[styles.walletPickerDropdown, { backgroundColor: colors.surface }]}>
            {wallets.map(wallet => (
              <View key={wallet.id} style={styles.walletPickerItem}>
                <TouchableOpacity 
                  style={styles.walletPickerItemMain}
                  onPress={() => {
                    switchActiveWallet(wallet.id);
                    setShowWalletPicker(false);
                  }}
                >
                  <View style={[styles.walletPickerIcon, { backgroundColor: colors.background }, wallet.id === activeWallet?.id && { backgroundColor: colors.primary }]}>
                    <Wallet size={14} color={wallet.id === activeWallet?.id ? colors.background : colors.textSecondary} />
                  </View>
                  <View style={styles.walletPickerInfo}>
                    <Text style={[styles.walletPickerName, { color: colors.text }]}>{wallet.label}</Text>
                    <Text style={[styles.walletPickerAddress, { color: colors.textSecondary }]}>{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</Text>
                  </View>
                  {wallet.id === activeWallet?.id && (
                    <Check size={16} color={colors.accent} />
                  )}
                </TouchableOpacity>
                <View style={styles.walletPickerActions}>
                  <TouchableOpacity 
                    style={styles.walletActionBtn}
                    onPress={() => {
                      setEditingWalletId(wallet.id);
                      setEditWalletName(wallet.label);
                    }}
                  >
                    <Edit3 size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {wallets.length > 1 && (
                    <TouchableOpacity 
                      style={styles.walletActionBtn}
                      onPress={() => deleteWallet(wallet.id)}
                    >
                      <Trash2 size={14} color={colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity 
              style={[styles.addWalletBtn, { borderTopColor: colors.border }]}
              onPress={() => {
                setShowWalletPicker(false);
                setShowNewWalletModal(true);
              }}
            >
              <Plus size={18} color={colors.primary} />
              <Text style={[styles.addWalletText, { color: colors.primary }]}>Create New Wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.balanceCard, { backgroundColor: balanceCardBg }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: balanceCardTextSecondary }]}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              {balanceVisible ? (
                <Eye size={20} color={balanceCardTextSecondary} />
              ) : (
                <EyeOff size={20} color={balanceCardTextSecondary} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.balanceAmount, { color: balanceCardTextPrimary }]}>
            {balanceVisible 
              ? `${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '••••••'
            }
          </Text>
          <View style={[styles.balanceChange, { backgroundColor: balanceCardTextPrimary + '20' }]}>
            <Text style={[styles.changeText, { color: balanceCardTextPrimary }]}>+$247.50 (1.24%) today</Text>
          </View>
          <View style={[styles.tokenBalances, { backgroundColor: balanceCardTextPrimary + '15' }]}>
            <View style={styles.tokenBalanceItem}>
              <Text style={[styles.tokenBalanceLabel, { color: balanceCardTextSecondary }]}>LARE Balance</Text>
              <Text style={[styles.tokenBalanceValue, { color: balanceCardTextPrimary }]}>
                {balanceVisible ? `${lareBalance.toLocaleString()} LARE` : '••••••'}
              </Text>
            </View>
            <View style={[styles.tokenBalanceDivider, { backgroundColor: balanceCardTextPrimary + '20' }]} />
            <View style={styles.tokenBalanceItem}>
              <Text style={[styles.tokenBalanceLabel, { color: balanceCardTextSecondary }]}>LUSD Balance</Text>
              <Text style={[styles.tokenBalanceValue, { color: balanceCardTextPrimary }]}>
                {balanceVisible ? `${lusdBalance.toLocaleString()} LUSD` : '••••••'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton 
            icon={ShoppingCart} 
            label="Buy" 
            onPress={() => console.log('Buy')}
            variant="primary"
          />
          <ActionButton 
            icon={DollarSign} 
            label="Sell" 
            onPress={() => console.log('Sell')}
            variant="accent"
          />
          <ActionButton 
            icon={ArrowUpRight} 
            label="Send" 
            onPress={() => router.push('/(tabs)/(wallet)/send')}
            variant="secondary"
          />
          <ActionButton 
            icon={ArrowDownLeft} 
            label="Receive" 
            onPress={() => router.push('/(tabs)/(wallet)/receive')}
            variant="primary"
          />
          <ActionButton 
            icon={RefreshCw} 
            label="Swap" 
            onPress={() => console.log('Swap')}
            variant="accent"
          />
        </View>

        <View style={styles.featureButtonsContainer}>
          <View style={styles.featureButtonsRow}>
            {featureButtonsRow1.map(feature => (
              <TouchableOpacity 
                key={feature.id}
                style={styles.featureButton}
                onPress={feature.onPress}
              >
                <View style={[styles.featureIconWrapper, { backgroundColor: feature.color + '20' }]}>
                  <feature.icon size={20} color={feature.color} />
                </View>
                <Text style={[styles.featureLabel, { color: colors.text }]}>{feature.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.featureButtonsRow}>
            {featureButtonsRow2.map(feature => (
              <TouchableOpacity 
                key={feature.id}
                style={styles.featureButton}
                onPress={feature.onPress}
              >
                <View style={[styles.featureIconWrapper, { backgroundColor: feature.color + '20' }]}>
                  <feature.icon size={20} color={feature.color} />
                </View>
                <Text style={[styles.featureLabel, { color: colors.text }]}>{feature.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{showNFTs ? 'NFTs' : 'Assets'}</Text>
              <TouchableOpacity 
                style={[styles.assetNftToggle, { backgroundColor: colors.surface }]}
                onPress={() => setShowNFTs(!showNFTs)}
              >
                <View style={[styles.toggleOption, !showNFTs && { backgroundColor: colors.primary }]}>
                  <Wallet size={14} color={!showNFTs ? colors.background : colors.textSecondary} />
                  <Text style={[styles.toggleOptionText, { color: !showNFTs ? colors.background : colors.textSecondary }]}>Assets</Text>
                </View>
                <View style={[styles.toggleOption, showNFTs && { backgroundColor: colors.primary }]}>
                  <Image size={14} color={showNFTs ? colors.background : colors.textSecondary} />
                  <Text style={[styles.toggleOptionText, { color: showNFTs ? colors.background : colors.textSecondary }]}>NFTs</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{showNFTs ? '0 NFTs' : `${userTokens.length} tokens`}</Text>
          </View>
          {showNFTs ? (
            <View style={[styles.emptyNfts, { backgroundColor: colors.surface }]}>
              <Image size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyNftsText, { color: colors.text }]}>No NFTs yet</Text>
              <Text style={[styles.emptyNftsSubtext, { color: colors.textSecondary }]}>Your NFT collection will appear here</Text>
            </View>
          ) : (
            userTokens.map(token => (
              <TokenCard key={token.id} token={token} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity 
              style={styles.viewAll}
              onPress={() => router.push('/(tabs)/(wallet)/transactions')}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.transactionsList, { backgroundColor: colors.surface }]}>
            {recentTransactions.map(transaction => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {showNewWalletModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Wallet</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Wallet name (e.g., Savings, Trading)"
              placeholderTextColor={colors.textSecondary}
              value={newWalletName}
              onChangeText={setNewWalletName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowNewWalletModal(false);
                  setNewWalletName('');
                }}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }, !newWalletName.trim() && styles.modalConfirmBtnDisabled]}
                onPress={handleCreateWallet}
                disabled={!newWalletName.trim()}
              >
                <Text style={[styles.modalConfirmText, { color: colors.background }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {editingWalletId && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Rename Wallet</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="New wallet name"
              placeholderTextColor={colors.textSecondary}
              value={editWalletName}
              onChangeText={setEditWalletName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => {
                  setEditingWalletId(null);
                  setEditWalletName('');
                }}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }, !editWalletName.trim() && styles.modalConfirmBtnDisabled]}
                onPress={handleEditWallet}
                disabled={!editWalletName.trim()}
              >
                <Text style={[styles.modalConfirmText, { color: colors.background }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <NavMenuModal visible={showNavMenu} onClose={() => setShowNavMenu(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  walletSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 12,
    marginBottom: 2,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  walletPickerDropdown: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
  },
  walletPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
  },
  walletPickerItemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  walletPickerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletPickerInfo: {
    flex: 1,
  },
  walletPickerName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  walletPickerAddress: {
    fontSize: 11,
  },
  walletPickerActions: {
    flexDirection: 'row',
    gap: 4,
    paddingRight: 8,
  },
  walletActionBtn: {
    padding: 8,
  },
  addWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderTopWidth: 1,
    marginTop: 4,
  },
  addWalletText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  balanceChange: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tokenBalances: {
    flexDirection: 'row',
    marginTop: 16,
    borderRadius: 14,
    padding: 12,
  },
  tokenBalanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  tokenBalanceDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  tokenBalanceLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  tokenBalanceValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  sectionCount: {
    fontSize: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  assetNftToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleOptionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  emptyNfts: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyNftsText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  emptyNftsSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  transactionsList: {
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  featureButtonsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  featureButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureButton: {
    alignItems: 'center',
    width: '18%',
  },
  featureIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalConfirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmBtnDisabled: {
    opacity: 0.5,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
