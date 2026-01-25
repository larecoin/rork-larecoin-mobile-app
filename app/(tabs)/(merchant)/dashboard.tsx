import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock,
  QrCode,
  Package,
  ChevronRight,
  Bell,
  Wallet,
  Link,
  Check,
  MapPin,
  Store,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Megaphone,
  Percent,
  AlertCircle,
  Eye,
  Menu,
  Globe
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import ModeToggle from '@/components/ModeToggle';
import StatCard from '@/components/StatCard';
import OrderCard from '@/components/OrderCard';
import NavMenuModal from '@/components/NavMenuModal';

export default function MerchantDashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { 
    merchantProfile, 
    merchantStats, 
    merchantOrders, 
    completeOrder,
    wallets,
    linkedMerchantWallet,
    linkWalletToMerchant
  } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showWalletLinkModal, setShowWalletLinkModal] = React.useState(false);
  const [showNavMenu, setShowNavMenu] = React.useState(false);
  const [balanceVisible, setBalanceVisible] = React.useState(true);

  const pendingOrders = merchantOrders.filter(o => o.status === 'pending');
  const lowStockCount = 3;
  const activeCustomers = 127;

  const quickActions = [
    { id: 'payment', icon: QrCode, label: 'Quick Pay', color: Colors.primary, onPress: () => router.push('/(tabs)/(merchant)/payment') },
    { id: 'catalog', icon: Package, label: 'Catalog', color: '#9B59B6', onPress: () => router.push('/(tabs)/(merchant)/catalog') },
    { id: 'orders', icon: ShoppingBag, label: 'Orders', color: Colors.accent, onPress: () => router.push('/(tabs)/(merchant)/orders') },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: '#3498DB' },
  ];

  const merchantTools = [
    { id: 'qr-shop', icon: Globe, label: 'QR Shop', desc: 'Generate shop QR', color: '#1ABC9C' },
    { id: 'locations', icon: MapPin, label: 'Locations', desc: '2 active', color: '#E74C3C' },
    { id: 'discounts', icon: Percent, label: 'Discounts', desc: '3 active promos', color: '#F39C12' },
    { id: 'invoices', icon: FileText, label: 'Invoices', desc: 'Create & manage', color: '#9B59B6' },
    { id: 'customers', icon: Users, label: 'Customers', desc: '127 total', color: '#3498DB' },
    { id: 'payouts', icon: CreditCard, label: 'Payouts', desc: 'Auto-settle', color: '#2ECC71' },
    { id: 'ads', icon: Megaphone, label: 'Ad Manager', desc: 'Promote store', color: '#E67E22' },
    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Store config', color: '#95A5A6' },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowNavMenu(true)}
          >
            <Menu size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Merchant Portal</Text>
            <Text style={styles.businessName}>{merchantProfile.name}</Text>
          </View>
          <ModeToggle />
        </View>

        <View style={styles.businessProfileCard}>
          <View style={styles.businessProfileHeader}>
            <View style={styles.storeIconWrapper}>
              <Store size={24} color={Colors.primary} />
            </View>
            <View style={styles.businessProfileInfo}>
              <Text style={styles.businessProfileName}>{merchantProfile.name}</Text>
              <View style={styles.verifiedBadge}>
                <Check size={10} color={Colors.background} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Settings size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.businessProfileStats}>
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatValue}>{activeCustomers}</Text>
              <Text style={styles.profileStatLabel}>Customers</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatValue}>4.8</Text>
              <Text style={styles.profileStatLabel}>Rating</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStatItem}>
              <Text style={styles.profileStatValue}>2</Text>
              <Text style={styles.profileStatLabel}>Locations</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.linkedWalletCard}
          onPress={() => setShowWalletLinkModal(true)}
        >
          <View style={styles.linkedWalletIcon}>
            <Wallet size={18} color={linkedMerchantWallet ? Colors.accent : Colors.textSecondary} />
          </View>
          <View style={styles.linkedWalletInfo}>
            <Text style={styles.linkedWalletLabel}>Receiving Wallet</Text>
            {linkedMerchantWallet ? (
              <Text style={styles.linkedWalletName}>{linkedMerchantWallet.label}</Text>
            ) : (
              <Text style={styles.linkedWalletEmpty}>No wallet linked</Text>
            )}
          </View>
          <Link size={16} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <View>
              <Text style={styles.revenueLabel}>Today&apos;s Revenue</Text>
              <Text style={styles.revenueAmount}>
                {balanceVisible 
                  ? `$${merchantStats.todayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  : '••••••'
                }
              </Text>
            </View>
            <View style={styles.revenueActions}>
              <TouchableOpacity 
                style={styles.revenueActionBtn}
                onPress={() => setBalanceVisible(!balanceVisible)}
              >
                <Eye size={16} color="#0D3B54" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationBadge}>
                <Bell size={18} color="#0D3B54" />
                {pendingOrders.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pendingOrders.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.revenueChange}>
            <TrendingUp size={14} color="#1ABC9C" />
            <Text style={styles.revenueChangeText}>+12.5% vs yesterday</Text>
          </View>
          <View style={styles.revenueBreakdown}>
            <View style={styles.revenueBreakdownItem}>
              <Text style={styles.breakdownLabel}>LARE Received</Text>
              <Text style={styles.breakdownValue}>{balanceVisible ? '2,450 LARE' : '••••'}</Text>
            </View>
            <View style={styles.revenueBreakdownDivider} />
            <View style={styles.revenueBreakdownItem}>
              <Text style={styles.breakdownLabel}>LUSD Received</Text>
              <Text style={styles.breakdownValue}>{balanceVisible ? '890 LUSD' : '••••'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity 
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIconWrapper, { backgroundColor: action.color + '20' }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {lowStockCount > 0 && (
          <TouchableOpacity style={styles.alertCard}>
            <View style={styles.alertIconWrapper}>
              <AlertCircle size={20} color={Colors.warning} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Low Stock Alert</Text>
              <Text style={styles.alertDesc}>{lowStockCount} products need restocking</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}

        <View style={styles.statsRow}>
          <StatCard 
            icon={DollarSign}
            label="This Week"
            value={`$${merchantStats.weekRevenue.toLocaleString()}`}
            color={Colors.primary}
          />
          <View style={{ width: 12 }} />
          <StatCard 
            icon={ShoppingBag}
            label="Total Orders"
            value={merchantStats.totalOrders.toString()}
            subValue={`${merchantStats.pendingOrders} pending`}
            color={Colors.accent}
          />
        </View>

        {pendingOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Clock size={18} color={Colors.warning} />
                <Text style={styles.sectionTitle}>Pending Orders</Text>
              </View>
              <TouchableOpacity 
                style={styles.viewAll}
                onPress={() => router.push('/(tabs)/(merchant)/orders')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {pendingOrders.slice(0, 2).map(order => (
              <OrderCard 
                key={order.id} 
                order={order}
                onComplete={() => completeOrder(order.id)}
              />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Merchant Tools</Text>
          </View>
          <View style={styles.toolsGrid}>
            {merchantTools.map(tool => (
              <TouchableOpacity key={tool.id} style={styles.toolCard}>
                <View style={[styles.toolIconWrapper, { backgroundColor: tool.color + '15' }]}>
                  <tool.icon size={20} color={tool.color} />
                </View>
                <Text style={styles.toolLabel}>{tool.label}</Text>
                <Text style={styles.toolDesc}>{tool.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Products</Text>
          </View>
          <View style={styles.topProductCard}>
            <View style={styles.topProductRank}>
              <Text style={styles.rankNumber}>1</Text>
            </View>
            <View style={styles.topProductInfo}>
              <Text style={styles.topProductName}>{merchantStats.topProduct}</Text>
              <Text style={styles.topProductSales}>42 sold today</Text>
            </View>
            <Text style={styles.topProductRevenue}>$189.00</Text>
          </View>
          <View style={[styles.topProductCard, { marginTop: 8 }]}>
            <View style={[styles.topProductRank, { backgroundColor: Colors.textSecondary + '20' }]}>
              <Text style={[styles.rankNumber, { color: Colors.textSecondary }]}>2</Text>
            </View>
            <View style={styles.topProductInfo}>
              <Text style={styles.topProductName}>Espresso Shot</Text>
              <Text style={styles.topProductSales}>38 sold today</Text>
            </View>
            <Text style={styles.topProductRevenue}>$114.00</Text>
          </View>
          <View style={[styles.topProductCard, { marginTop: 8 }]}>
            <View style={[styles.topProductRank, { backgroundColor: '#CD7F32' + '20' }]}>
              <Text style={[styles.rankNumber, { color: '#CD7F32' }]}>3</Text>
            </View>
            <View style={styles.topProductInfo}>
              <Text style={styles.topProductName}>Croissant</Text>
              <Text style={styles.topProductSales}>29 sold today</Text>
            </View>
            <Text style={styles.topProductRevenue}>$87.00</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.qrShopBanner}>
          <View style={styles.qrShopContent}>
            <View style={styles.qrShopIconWrapper}>
              <QrCode size={28} color={Colors.background} />
            </View>
            <View style={styles.qrShopInfo}>
              <Text style={styles.qrShopTitle}>Your QR Shop is Live!</Text>
              <Text style={styles.qrShopDesc}>Customers can scan to browse & order</Text>
            </View>
          </View>
          <View style={styles.qrShopActions}>
            <TouchableOpacity style={styles.qrShopBtn}>
              <Text style={styles.qrShopBtnText}>View Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrShopBtnSecondary}>
              <Text style={styles.qrShopBtnSecondaryText}>Share QR</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <NavMenuModal visible={showNavMenu} onClose={() => setShowNavMenu(false)} />

      {showWalletLinkModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Link Receiving Wallet</Text>
            <Text style={styles.modalSubtitle}>Select which wallet receives merchant payments</Text>
            
            <View style={styles.walletList}>
              {wallets.map(wallet => (
                <TouchableOpacity 
                  key={wallet.id}
                  style={[
                    styles.walletOption,
                    merchantProfile.linkedWalletId === wallet.id && styles.walletOptionActive
                  ]}
                  onPress={() => {
                    linkWalletToMerchant(wallet.id);
                    setShowWalletLinkModal(false);
                  }}
                >
                  <View style={[
                    styles.walletOptionIcon,
                    merchantProfile.linkedWalletId === wallet.id && styles.walletOptionIconActive
                  ]}>
                    <Wallet size={16} color={merchantProfile.linkedWalletId === wallet.id ? Colors.background : Colors.textSecondary} />
                  </View>
                  <View style={styles.walletOptionInfo}>
                    <Text style={styles.walletOptionName}>{wallet.label}</Text>
                    <Text style={styles.walletOptionAddress}>{wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}</Text>
                  </View>
                  {merchantProfile.linkedWalletId === wallet.id && (
                    <Check size={18} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => setShowWalletLinkModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  businessProfileCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  businessProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  businessProfileInfo: {
    flex: 1,
  },
  businessProfileName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
  },
  editProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessProfileStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  profileStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  revenueCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#B5E5F5',
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  revenueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  revenueActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(13,59,84,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueLabel: {
    fontSize: 13,
    color: '#1A5276',
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D3B54',
    marginBottom: 8,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(13,59,84,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 12,
  },
  revenueChangeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1ABC9C',
  },
  revenueBreakdown: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,59,84,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  revenueBreakdownItem: {
    flex: 1,
    alignItems: 'center',
  },
  revenueBreakdownDivider: {
    width: 1,
    backgroundColor: 'rgba(13,59,84,0.2)',
    marginHorizontal: 8,
  },
  breakdownLabel: {
    fontSize: 10,
    color: '#1A5276',
    marginBottom: 3,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D3B54',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  quickActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.warning + '15',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  alertIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  alertDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  topProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  topProductRank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  topProductSales: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  topProductRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  toolIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  toolLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  toolDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  qrShopBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  qrShopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrShopIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  qrShopInfo: {
    flex: 1,
  },
  qrShopTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.background,
    marginBottom: 4,
  },
  qrShopDesc: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
  },
  qrShopActions: {
    flexDirection: 'row',
    gap: 10,
  },
  qrShopBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  qrShopBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  qrShopBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  qrShopBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  linkedWalletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  linkedWalletIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedWalletInfo: {
    flex: 1,
  },
  linkedWalletLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  linkedWalletName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  linkedWalletEmpty: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
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
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  walletList: {
    gap: 8,
    marginBottom: 16,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.background,
    borderRadius: 14,
    gap: 12,
  },
  walletOptionActive: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  walletOptionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletOptionIconActive: {
    backgroundColor: Colors.accent,
  },
  walletOptionInfo: {
    flex: 1,
  },
  walletOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  walletOptionAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  modalCloseBtn: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
