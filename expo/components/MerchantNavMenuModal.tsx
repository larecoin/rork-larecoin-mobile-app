import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  X, QrCode, CreditCard, DollarSign, Package, Utensils, ShoppingBag, Truck,
  FileText, Receipt, Bell, Plus, Image, ChevronRight, History, Shield,
  Wallet, PiggyBank, Coins, ArrowLeftRight, Lock, Search, Edit, Boxes,
  FolderTree, Upload, Users, Plug, Heart, Wand2, BarChart3, TrendingUp,
  UserCheck, Download, Gift, Megaphone, Settings, User, CheckCircle, 
  Sliders, HelpCircle, MessageSquare, Link, Send, Scale, BookOpen,
  Store, ClipboardList, Calculator, Banknote, RefreshCw, Layers,
  ScanBarcode, UtensilsCrossed, Coffee, MapPin, CreditCard as CardIcon,
  LayoutGrid, ListChecks, FileSpreadsheet, PieChart
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface MerchantNavMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  desc?: string;
}

const merchantMenuSections: MenuSection[] = [
  {
    title: 'Point of Sale',
    items: [
      { id: 'scan-qr-pos', label: 'Scan QR Code', icon: QrCode, desc: 'Customer scans to access POS' },
      { id: 'payment-options', label: 'Payment Options', icon: CreditCard, desc: 'Custom price, Menu, Barcode' },
      { id: 'quick-pay', label: 'Quick Pay Option', icon: DollarSign, desc: 'Enter amount, customer details' },
      { id: 'inventory-checkout', label: 'Inventory Option', icon: Package, desc: 'Search items, barcode scanner' },
      { id: 'dine-in', label: 'Dine In Options', icon: Utensils, desc: 'Table management, crypto pay' },
      { id: 'take-out', label: 'Take Out Option', icon: ShoppingBag, desc: 'Takeout orders with crypto' },
      { id: 'delivery', label: 'Delivery Option', icon: Truck, desc: 'Delivery services, crypto pay' },
      { id: 'checkout-form', label: 'Checkout Form | Pay', icon: FileText, desc: 'Name, Phone, Email, Crypto' },
      { id: 'confirm-receipts', label: 'Confirm | Receipts', icon: Receipt, desc: 'NFT receipt, blockchain proof' },
    ],
  },
  {
    title: 'Quick Actions',
    items: [
      { id: 'start-new-payment', label: 'Start New Payment', icon: Plus, desc: 'Begin new transaction' },
      { id: 'add-inventory-item', label: 'Add Inventory Item', icon: Package, desc: 'Add product to inventory' },
      { id: 'view-nft-receipts', label: 'View NFT Receipts', icon: Image, desc: 'Blockchain-stored receipts' },
      { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Payments, lucky draws' },
    ],
  },
  {
    title: 'POS Pages',
    items: [
      { id: 'quick-pay-page', label: 'Quick Pay Page', icon: DollarSign },
      { id: 'shop-menu-page', label: 'Shop Menu Page', icon: LayoutGrid, desc: 'Pre-set products/services' },
      { id: 'barcode-qr-scan', label: 'Barcode/QR Scan Page', icon: ScanBarcode },
      { id: 'inventory-checkout-page', label: 'Inventory Checkout Page', icon: ClipboardList },
      { id: 'dine-in-page', label: 'Dine-In Page', icon: UtensilsCrossed, desc: 'Table selector, order builder' },
      { id: 'take-out-page', label: 'Take-Out Page', icon: Coffee },
      { id: 'delivery-page', label: 'Delivery Page', icon: MapPin, desc: 'Address input, tracking' },
      { id: 'wallet-connect-page', label: 'Wallet Connect & Payment', icon: Wallet },
      { id: 'checkout-form-page', label: 'Checkout Form Page', icon: FileText },
      { id: 'confirm-receipt-page', label: 'Confirm & Receipt Page', icon: Receipt, desc: 'NFT generation, SMS/email' },
    ],
  },
  {
    title: 'Transactions',
    items: [
      { id: 'transaction-history', label: 'Transaction History', icon: History, desc: 'With NFT receipt links' },
      { id: 'dispute-proof', label: 'Dispute/Proof Page', icon: Shield, desc: 'Chargeback protection' },
      { id: 'payouts-withdrawals', label: 'Payouts/Withdrawals', icon: Banknote, desc: 'LUSD, fiat, prepaid cards' },
      { id: 'tax-accounting', label: 'Tax & Accounting Reports', icon: Calculator, desc: 'Automated, tax-free emphasis' },
      { id: 'swaps', label: 'Swaps', icon: RefreshCw, desc: 'LARE ↔ 100+ cryptos' },
    ],
  },
  {
    title: 'Wallet',
    items: [
      { id: 'linked-wallet', label: 'Linked Wallet + Sub-Wallets', icon: Wallet },
      { id: 'staking', label: 'Staking', icon: Coins, desc: 'Daily rewards from volume' },
      { id: 'yield-farming', label: 'Yield Farming/Liquidity', icon: PiggyBank },
      { id: 'cross-chain-bridge', label: 'Cross-Chain Bridge', icon: Layers },
      { id: 'wallet-security', label: 'Security', icon: Lock, desc: '2FA, alerts' },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { id: 'inventory-list', label: 'Inventory List/Search', icon: Search },
      { id: 'add-edit-item', label: 'Add/Edit Item', icon: Edit, desc: 'Photos, videos, barcode, tax' },
      { id: 'stock-management', label: 'Stock Management', icon: Boxes },
      { id: 'categories', label: 'Categories', icon: FolderTree },
      { id: 'import-export', label: 'Import/Export', icon: Upload },
    ],
  },
  {
    title: 'Business',
    items: [
      { id: 'reseller-program', label: 'Reseller Program', icon: Users },
      { id: 'integrations', label: 'Integrations', icon: Plug, desc: 'Shopify, WooCommerce, API' },
      { id: 'charitable-grants', label: 'Charitable Grants', icon: Heart },
      { id: 'onboarding-wizard', label: 'Onboarding Wizard', icon: Wand2 },
    ],
  },
  {
    title: 'Analytics/Reports',
    items: [
      { id: 'sales-trends', label: 'Sales Trends', icon: TrendingUp },
      { id: 'fee-savings', label: 'Fee Savings Tracker', icon: PieChart },
      { id: 'customer-insights', label: 'Customer Insights', icon: UserCheck },
      { id: 'exports', label: 'Exports', icon: Download },
    ],
  },
  {
    title: 'Marketing/Tools',
    items: [
      { id: 'loyalty-nfts', label: 'Loyalty NFTs', icon: Gift },
      { id: 'programmable-rewards', label: 'Programmable Rewards', icon: Coins },
      { id: 'advertising-tools', label: 'Advertising Tools', icon: Megaphone },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'merchant-profile', label: 'Profile', icon: User },
      { id: 'verification', label: 'Verification', icon: CheckCircle, desc: 'Optional KYC' },
      { id: 'preferences', label: 'Preferences', icon: Sliders, desc: 'Auto-LUSD conversion' },
      { id: 'notification-settings', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
      { id: 'contact-support', label: 'Contact', icon: MessageSquare, desc: 'Chat/Ticket' },
      { id: 'community-links', label: 'Community Links', icon: Link },
      { id: 'feedback', label: 'Feedback', icon: Send },
      { id: 'legal', label: 'Legal', icon: Scale },
    ],
  },
];

export default function MerchantNavMenuModal({ visible, onClose }: MerchantNavMenuModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();

  const handleMenuPress = (id: string) => {
    console.log('Merchant menu pressed:', id);
    onClose();
    
    const routes: Record<string, string> = {
      'scan-qr-pos': '/menu/scan-qr',
      'payment-options': '/(tabs)/(merchant)/payment',
      'quick-pay': '/(tabs)/(merchant)/payment',
      'inventory-checkout': '/(tabs)/(merchant)/inventory',
      'dine-in': '/(tabs)/(merchant)/payment',
      'take-out': '/(tabs)/(merchant)/payment',
      'delivery': '/(tabs)/(merchant)/payment',
      'checkout-form': '/(tabs)/(merchant)/payment',
      'confirm-receipts': '/(tabs)/(merchant)/receipts',
      'start-new-payment': '/(tabs)/(merchant)/payment',
      'add-inventory-item': '/(tabs)/(merchant)/inventory',
      'view-nft-receipts': '/(tabs)/(merchant)/receipts',
      'notifications': '/(tabs)/(merchant)/dashboard',
      'quick-pay-page': '/(tabs)/(merchant)/payment',
      'shop-menu-page': '/(tabs)/(merchant)/catalog',
      'barcode-qr-scan': '/menu/scan-qr',
      'inventory-checkout-page': '/(tabs)/(merchant)/inventory',
      'dine-in-page': '/(tabs)/(merchant)/payment',
      'take-out-page': '/(tabs)/(merchant)/payment',
      'delivery-page': '/(tabs)/(merchant)/payment',
      'wallet-connect-page': '/(tabs)/(merchant)/dashboard',
      'checkout-form-page': '/(tabs)/(merchant)/payment',
      'confirm-receipt-page': '/(tabs)/(merchant)/receipts',
      'transaction-history': '/(tabs)/(merchant)/merchantorders',
      'dispute-proof': '/(tabs)/(merchant)/receipts',
      'payouts-withdrawals': '/(tabs)/(merchant)/bill-pay',
      'tax-accounting': '/(tabs)/(merchant)/statements-reports',
      'swaps': '/(tabs)/(wallet)/swap',
      'linked-wallet': '/(tabs)/(merchant)/dashboard',
      'staking': '/menu/staking-rewards',
      'yield-farming': '/(tabs)/(wallet)/borrow-lend',
      'cross-chain-bridge': '/(tabs)/(wallet)/swap',
      'wallet-security': '/menu/security-center',
      'inventory-list': '/(tabs)/(merchant)/inventory',
      'add-edit-item': '/(tabs)/(merchant)/inventory',
      'stock-management': '/(tabs)/(merchant)/inventory',
      'categories': '/(tabs)/(merchant)/catalog',
      'import-export': '/(tabs)/(merchant)/inventory',
      'reseller-program': '/menu/reseller-program',
      'integrations': '/menu/apis-hooks',
      'charitable-grants': '/(tabs)/(merchant)/dashboard',
      'onboarding-wizard': '/(tabs)/(merchant)/dashboard',
      'sales-trends': '/(tabs)/(merchant)/statements-reports',
      'fee-savings': '/(tabs)/(merchant)/statements-reports',
      'customer-insights': '/(tabs)/(merchant)/statements-reports',
      'exports': '/(tabs)/(merchant)/statements-reports',
      'loyalty-nfts': '/(tabs)/(merchant)/gift-certificates',
      'programmable-rewards': '/(tabs)/(merchant)/gift-certificates',
      'advertising-tools': '/(tabs)/(merchant)/ads',
      'merchant-profile': '/(tabs)/settings',
      'verification': '/menu/account-settings',
      'preferences': '/(tabs)/settings',
      'notification-settings': '/menu/account-settings',
      'faq': '/menu/helpdesk',
      'contact-support': '/menu/customer-service',
      'community-links': '/menu/social-spaces',
      'feedback': '/menu/customer-service',
      'legal': '/menu/helpdesk',
    };
    
    const route = routes[id];
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.merchantIcon, { backgroundColor: colors.primary + '15' }]}>
              <Store size={20} color={colors.primary} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Merchant Menu</Text>
          </View>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.surface }]} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {merchantMenuSections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{section.title}</Text>
              <View style={[styles.sectionItems, { backgroundColor: colors.surface }]}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      { borderBottomColor: colors.border },
                      itemIndex === section.items.length - 1 && styles.menuItemLast,
                    ]}
                    onPress={() => handleMenuPress(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                        <item.icon size={18} color={colors.primary} />
                      </View>
                      <View style={styles.menuItemText}>
                        <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                        {item.desc && (
                          <Text style={[styles.menuItemDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                            {item.desc}
                          </Text>
                        )}
                      </View>
                    </View>
                    <ChevronRight size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  merchantIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionItems: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  menuItemDesc: {
    fontSize: 11,
    marginTop: 2,
  },
});
