import React, { useMemo } from 'react';

interface LinkedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
  lusdLimit: number;
  spentThisMonth: number;
  status: 'active' | 'frozen' | 'pending';
}
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Eye, EyeOff, ChevronRight, Plus, ChevronDown, Image, Coins, Droplets, Wallet, Check, Trash2, Edit3, Menu, Search, ArrowLeftRight, Clover, Receipt, GitBranch, Users, ShoppingCart, DollarSign, ShieldCheck, HandCoins, Send, FileText, CreditCard, Lock, Smartphone, Bell, AlertCircle, Shield, Settings } from 'lucide-react-native';
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
  const [assetTab, setAssetTab] = React.useState<'assets' | 'nfts' | 'receipts'>('assets');
  const [linkedCards, setLinkedCards] = React.useState<LinkedCard[]>([
    {
      id: '1',
      cardNumber: '**** **** **** 4521',
      cardHolder: 'JOHN DOE',
      expiryDate: '12/27',
      cardType: 'visa',
      isDefault: true,
      lusdLimit: 5000,
      spentThisMonth: 1247.50,
      status: 'active',
    },
  ]);
  const [showAddCardModal, setShowAddCardModal] = React.useState(false);
  const [cardNumberVisible, setCardNumberVisible] = React.useState<Record<string, boolean>>({});
  const [newCardData, setNewCardData] = React.useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

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

  const handleAddCard = () => {
    if (!newCardData.cardNumber || !newCardData.cardHolder || !newCardData.expiryDate || !newCardData.cvv) {
      return;
    }
    const maskedNumber = '**** **** **** ' + newCardData.cardNumber.slice(-4);
    const card: LinkedCard = {
      id: Date.now().toString(),
      cardNumber: maskedNumber,
      cardHolder: newCardData.cardHolder.toUpperCase(),
      expiryDate: newCardData.expiryDate,
      cardType: 'visa',
      isDefault: linkedCards.length === 0,
      lusdLimit: 2500,
      spentThisMonth: 0,
      status: 'pending',
    };
    setLinkedCards([...linkedCards, card]);
    setNewCardData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    setShowAddCardModal(false);
  };

  const handleRemoveCard = (cardId: string) => {
    setLinkedCards(linkedCards.filter(c => c.id !== cardId));
  };

  const handleSetDefaultCard = (cardId: string) => {
    setLinkedCards(linkedCards.map(c => ({ ...c, isDefault: c.id === cardId })));
  };

  const toggleCardVisibility = (cardId: string) => {
    setCardNumberVisible(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'amex': return '#006FCF';
      default: return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'frozen': return '#F59E0B';
      case 'pending': return '#6366F1';
      default: return colors.textSecondary;
    }
  };

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
            <TouchableOpacity onPress={() => router.push('/menu/account-settings')}>
              <Settings size={20} color={balanceCardTextSecondary} />
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
            onPress={() => router.push('/(tabs)/(wallet)/buy')}
            variant="primary"
          />
          <ActionButton 
            icon={DollarSign} 
            label="Sell" 
            onPress={() => router.push('/(tabs)/(wallet)/sell')}
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
            onPress={() => router.push('/(tabs)/(wallet)/swap')}
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

        {/* Card Manager Section */}
        <View style={styles.cardManagerSection}>
          <View style={[styles.cardManagerHeader, { backgroundColor: colors.primary }]}>
            <View style={styles.cardManagerHeaderContent}>
              <View>
                <Text style={styles.cardManagerLabel}>LUSD Debit Card</Text>
                <Text style={styles.cardManagerBalance}>${lusdBalance.toLocaleString()}</Text>
                <Text style={styles.cardManagerSubtext}>Available for card spending</Text>
              </View>
              <View style={[styles.cardManagerBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <CreditCard size={20} color="#FFFFFF" />
              </View>
            </View>
          </View>

          <View style={[styles.cardManagerInfo, { backgroundColor: colors.surface }]}>
            <AlertCircle size={18} color={colors.primary} />
            <Text style={[styles.cardManagerInfoText, { color: colors.textSecondary }]}>
              Link a debit card to spend your LUSD balance anywhere Visa/Mastercard is accepted.
            </Text>
          </View>

          <View style={styles.linkedCardsSection}>
            <View style={styles.linkedCardsHeader}>
              <Text style={[styles.linkedCardsTitle, { color: colors.text }]}>Linked Cards</Text>
              <TouchableOpacity 
                style={[styles.addCardBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowAddCardModal(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addCardBtnText}>Add Card</Text>
              </TouchableOpacity>
            </View>

            {linkedCards.length === 0 ? (
              <View style={[styles.noCardsState, { backgroundColor: colors.surface }]}>
                <CreditCard size={40} color={colors.textTertiary} />
                <Text style={[styles.noCardsTitle, { color: colors.text }]}>No Cards Linked</Text>
                <Text style={[styles.noCardsSubtitle, { color: colors.textSecondary }]}>Add a debit card to start spending</Text>
              </View>
            ) : (
              linkedCards.map(card => (
                <View key={card.id} style={[styles.linkedCardItem, { backgroundColor: colors.surface }]}>
                  <View style={[styles.linkedCardVisual, { backgroundColor: getCardTypeColor(card.cardType) }]}>
                    <View style={styles.linkedCardVisualTop}>
                      <Text style={styles.linkedCardType}>{card.cardType.toUpperCase()}</Text>
                      {card.isDefault && (
                        <View style={styles.linkedCardDefaultBadge}>
                          <Check size={10} color="#FFFFFF" />
                          <Text style={styles.linkedCardDefaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.linkedCardNumberRow}>
                      <Text style={styles.linkedCardNumber}>
                        {cardNumberVisible[card.id] ? '4521 8745 3698 4521' : card.cardNumber}
                      </Text>
                      <TouchableOpacity onPress={() => toggleCardVisibility(card.id)}>
                        {cardNumberVisible[card.id] ? (
                          <EyeOff size={16} color="rgba(255,255,255,0.8)" />
                        ) : (
                          <Eye size={16} color="rgba(255,255,255,0.8)" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.linkedCardBottom}>
                      <View>
                        <Text style={styles.linkedCardBottomLabel}>HOLDER</Text>
                        <Text style={styles.linkedCardBottomValue}>{card.cardHolder}</Text>
                      </View>
                      <View>
                        <Text style={styles.linkedCardBottomLabel}>EXPIRES</Text>
                        <Text style={styles.linkedCardBottomValue}>{card.expiryDate}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.linkedCardDetails}>
                    <View style={styles.linkedCardDetailRow}>
                      <Text style={[styles.linkedCardDetailLabel, { color: colors.textSecondary }]}>Status</Text>
                      <View style={[styles.linkedCardStatusBadge, { backgroundColor: getStatusColor(card.status) + '20' }]}>
                        <View style={[styles.linkedCardStatusDot, { backgroundColor: getStatusColor(card.status) }]} />
                        <Text style={[styles.linkedCardStatusText, { color: getStatusColor(card.status) }]}>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.linkedCardDetailRow}>
                      <Text style={[styles.linkedCardDetailLabel, { color: colors.textSecondary }]}>Monthly Limit</Text>
                      <Text style={[styles.linkedCardDetailValue, { color: colors.text }]}>${card.lusdLimit.toLocaleString()}</Text>
                    </View>
                    <View style={styles.linkedCardDetailRow}>
                      <Text style={[styles.linkedCardDetailLabel, { color: colors.textSecondary }]}>Spent</Text>
                      <Text style={[styles.linkedCardDetailValue, { color: colors.text }]}>${card.spentThisMonth.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.linkedCardSpendingBar, { backgroundColor: colors.border }]}>
                      <View 
                        style={[
                          styles.linkedCardSpendingProgress, 
                          { backgroundColor: colors.primary, width: `${(card.spentThisMonth / card.lusdLimit) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.linkedCardRemaining, { color: colors.textSecondary }]}>
                      ${(card.lusdLimit - card.spentThisMonth).toLocaleString()} remaining
                    </Text>
                  </View>

                  <View style={[styles.linkedCardActions, { borderTopColor: colors.border }]}>
                    {!card.isDefault && (
                      <TouchableOpacity 
                        style={styles.linkedCardActionBtn}
                        onPress={() => handleSetDefaultCard(card.id)}
                      >
                        <Check size={14} color={colors.primary} />
                        <Text style={[styles.linkedCardActionText, { color: colors.primary }]}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.linkedCardActionBtn}
                      onPress={() => handleRemoveCard(card.id)}
                    >
                      <Trash2 size={14} color={colors.error} />
                      <Text style={[styles.linkedCardActionText, { color: colors.error }]}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.cardSettingsSection}>
            <Text style={[styles.cardSettingsTitle, { color: colors.text }]}>Card Settings</Text>
            <View style={[styles.cardSettingsCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={styles.cardSettingItem}>
                <View style={[styles.cardSettingIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Lock size={16} color={colors.primary} />
                </View>
                <View style={styles.cardSettingContent}>
                  <Text style={[styles.cardSettingTitle, { color: colors.text }]}>Transaction Limits</Text>
                  <Text style={[styles.cardSettingSubtitle, { color: colors.textSecondary }]}>Daily and per-transaction limits</Text>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
              <View style={[styles.cardSettingDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity style={styles.cardSettingItem}>
                <View style={[styles.cardSettingIcon, { backgroundColor: '#10B981' + '20' }]}>
                  <Shield size={16} color="#10B981" />
                </View>
                <View style={styles.cardSettingContent}>
                  <Text style={[styles.cardSettingTitle, { color: colors.text }]}>Security</Text>
                  <Text style={[styles.cardSettingSubtitle, { color: colors.textSecondary }]}>PIN, freeze card, fraud alerts</Text>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
              <View style={[styles.cardSettingDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity style={styles.cardSettingItem}>
                <View style={[styles.cardSettingIcon, { backgroundColor: '#6366F1' + '20' }]}>
                  <Smartphone size={16} color="#6366F1" />
                </View>
                <View style={styles.cardSettingContent}>
                  <Text style={[styles.cardSettingTitle, { color: colors.text }]}>Virtual Card</Text>
                  <Text style={[styles.cardSettingSubtitle, { color: colors.textSecondary }]}>Generate for online purchases</Text>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{assetTab === 'assets' ? 'Assets' : assetTab === 'nfts' ? 'NFTs' : 'NFT Receipts'}</Text>
              <View style={[styles.assetNftToggle, { backgroundColor: colors.surface }]}>
                <TouchableOpacity 
                  style={[styles.toggleOption, assetTab === 'assets' && { backgroundColor: colors.primary }]}
                  onPress={() => setAssetTab('assets')}
                >
                  <Wallet size={14} color={assetTab === 'assets' ? colors.background : colors.textSecondary} />
                  <Text style={[styles.toggleOptionText, { color: assetTab === 'assets' ? colors.background : colors.textSecondary }]}>Assets</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleOption, assetTab === 'nfts' && { backgroundColor: colors.primary }]}
                  onPress={() => setAssetTab('nfts')}
                >
                  <Image size={14} color={assetTab === 'nfts' ? colors.background : colors.textSecondary} />
                  <Text style={[styles.toggleOptionText, { color: assetTab === 'nfts' ? colors.background : colors.textSecondary }]}>NFTs</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleOption, assetTab === 'receipts' && { backgroundColor: colors.primary }]}
                  onPress={() => setAssetTab('receipts')}
                >
                  <FileText size={14} color={assetTab === 'receipts' ? colors.background : colors.textSecondary} />
                  <Text style={[styles.toggleOptionText, { color: assetTab === 'receipts' ? colors.background : colors.textSecondary }]}>Receipts</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{assetTab === 'assets' ? `${userTokens.length} tokens` : assetTab === 'nfts' ? '0 NFTs' : '0 Receipts'}</Text>
          </View>
          {assetTab === 'assets' ? (
            userTokens.map(token => (
              <TokenCard key={token.id} token={token} />
            ))
          ) : assetTab === 'nfts' ? (
            <View style={[styles.emptyNfts, { backgroundColor: colors.surface }]}>
              <Image size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyNftsText, { color: colors.text }]}>No NFTs yet</Text>
              <Text style={[styles.emptyNftsSubtext, { color: colors.textSecondary }]}>Your NFT collection will appear here</Text>
            </View>
          ) : (
            <View style={[styles.emptyNfts, { backgroundColor: colors.surface }]}>
              <FileText size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyNftsText, { color: colors.text }]}>No NFT Receipts</Text>
              <Text style={[styles.emptyNftsSubtext, { color: colors.textSecondary }]}>Your transaction receipts as NFTs will appear here</Text>
            </View>
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

      {showAddCardModal && (
        <View style={styles.addCardModalOverlay}>
          <View style={[styles.addCardModalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.addCardModalTitle, { color: colors.text }]}>Link Debit Card</Text>
            <Text style={[styles.addCardModalSubtitle, { color: colors.textSecondary }]}>
              Enter your debit card details to link with LUSD
            </Text>

            <View style={styles.addCardInputGroup}>
              <Text style={[styles.addCardInputLabel, { color: colors.textSecondary }]}>Card Number</Text>
              <TextInput
                style={[styles.addCardInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textTertiary}
                value={newCardData.cardNumber}
                onChangeText={(text) => setNewCardData({ ...newCardData, cardNumber: text })}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.addCardInputGroup}>
              <Text style={[styles.addCardInputLabel, { color: colors.textSecondary }]}>Card Holder Name</Text>
              <TextInput
                style={[styles.addCardInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="JOHN DOE"
                placeholderTextColor={colors.textTertiary}
                value={newCardData.cardHolder}
                onChangeText={(text) => setNewCardData({ ...newCardData, cardHolder: text })}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.addCardInputRow}>
              <View style={[styles.addCardInputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.addCardInputLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                <TextInput
                  style={[styles.addCardInput, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textTertiary}
                  value={newCardData.expiryDate}
                  onChangeText={(text) => setNewCardData({ ...newCardData, expiryDate: text })}
                  maxLength={5}
                />
              </View>
              <View style={[styles.addCardInputGroup, { flex: 1 }]}>
                <Text style={[styles.addCardInputLabel, { color: colors.textSecondary }]}>CVV</Text>
                <TextInput
                  style={[styles.addCardInput, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder="***"
                  placeholderTextColor={colors.textTertiary}
                  value={newCardData.cvv}
                  onChangeText={(text) => setNewCardData({ ...newCardData, cvv: text })}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={[styles.addCardSecurityNote, { backgroundColor: colors.background }]}>
              <Shield size={14} color={colors.primary} />
              <Text style={[styles.addCardSecurityText, { color: colors.textSecondary }]}>
                Your card details are encrypted and securely stored
              </Text>
            </View>

            <View style={styles.addCardModalActions}>
              <TouchableOpacity 
                style={[styles.addCardCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowAddCardModal(false);
                  setNewCardData({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
                }}
              >
                <Text style={[styles.addCardCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.addCardConfirmBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddCard}
              >
                <Text style={styles.addCardConfirmText}>Link Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  cardManagerSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  cardManagerHeader: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  cardManagerHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardManagerLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 4,
  },
  cardManagerBalance: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  cardManagerSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  cardManagerBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardManagerInfo: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardManagerInfoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  linkedCardsSection: {
    marginBottom: 16,
  },
  linkedCardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkedCardsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addCardBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  noCardsState: {
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
  },
  noCardsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  noCardsSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  linkedCardItem: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  linkedCardVisual: {
    padding: 16,
  },
  linkedCardVisualTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkedCardType: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  linkedCardDefaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  linkedCardDefaultText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600' as const,
  },
  linkedCardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  linkedCardNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
  },
  linkedCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkedCardBottomLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    marginBottom: 2,
  },
  linkedCardBottomValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  linkedCardDetails: {
    padding: 14,
  },
  linkedCardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkedCardDetailLabel: {
    fontSize: 13,
  },
  linkedCardDetailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  linkedCardStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  linkedCardStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  linkedCardStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  linkedCardSpendingBar: {
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  linkedCardSpendingProgress: {
    height: '100%',
    borderRadius: 2.5,
  },
  linkedCardRemaining: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'right' as const,
  },
  linkedCardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 10,
    gap: 14,
    justifyContent: 'flex-end',
  },
  linkedCardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkedCardActionText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  cardSettingsSection: {
    marginTop: 8,
  },
  cardSettingsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  cardSettingsCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  cardSettingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSettingContent: {
    flex: 1,
  },
  cardSettingTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  cardSettingSubtitle: {
    fontSize: 12,
  },
  cardSettingDivider: {
    height: 1,
    marginLeft: 62,
  },
  addCardModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  addCardModalContent: {
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 380,
  },
  addCardModalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 6,
  },
  addCardModalSubtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  addCardInputGroup: {
    marginBottom: 14,
  },
  addCardInputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 6,
  },
  addCardInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  addCardInputRow: {
    flexDirection: 'row',
  },
  addCardSecurityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
    marginBottom: 18,
  },
  addCardSecurityText: {
    flex: 1,
    fontSize: 11,
  },
  addCardModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  addCardCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addCardCancelText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  addCardConfirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addCardConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
