import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  X, QrCode, CreditCard, Users, Compass, User, MessageSquare, FileText, Calendar,
  Contact, UserPlus, Heart, FolderOpen, Wand2, Gamepad2, Layout, Bug, Gift, Settings, LayoutDashboard,
  Image, Code, Globe, HardDrive, Package, Webhook, Store, ClipboardList,
  Megaphone, PlusCircle, List, Award, ChevronRight, Coins, Banknote, Clover, HandCoins,
  ShoppingCart, ClipboardCheck, Shield, HelpCircle, FileSpreadsheet, Gem, TrendingUp, Boxes,
  UserCircle, Headphones, Share2
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface NavMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const menuItems: MenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'app-settings', label: 'Settings', icon: Settings },
  { id: 'scan-qr', label: 'Scan QR', icon: QrCode },
  { id: 'shopping', label: 'Shop', icon: ShoppingCart },
  { id: 'wallet-nfts', label: 'My Wallet', icon: Image },
  { id: 'buy-crypto', label: 'Buy Crypto', icon: CreditCard },
  { id: 'explore', label: 'Explore & Discover', icon: Compass },
  { id: 'resume', label: 'My Resume/CV', icon: FileText },
  { id: 'follow', label: 'Follow & Connect', icon: UserPlus },
  { id: 'spaces', label: 'My Spaces', icon: Layout },
  { id: 'dating', label: 'Start Dating', icon: Heart },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'calendar', label: 'My Calendar', icon: Calendar },
  { id: 'contacts', label: 'My Contacts', icon: Contact },
  { id: 'referrals', label: 'Referrals', icon: Gift },
  { id: 'creator-tools', label: 'Creator Tools', icon: Wand2 },
  { id: 'apps-games', label: 'Apps & Games', icon: Gamepad2 },
  { id: 'business-listings', label: 'Business Listings', icon: List },
  { id: 'merchant-portal', label: 'My Shop', icon: Store },
  { id: 'pos', label: 'Point of Sale', icon: CreditCard },
  { id: 'post-ad', label: 'Post Ad', icon: PlusCircle },
  { id: 'ad-manager', label: 'Ad Manager', icon: Megaphone },
  { id: 'domains', label: 'Domains & Websites', icon: Globe },
  { id: 'media', label: 'Media & Files', icon: FolderOpen },
  { id: 'products-services', label: 'Products & Services', icon: Package },
  { id: 'apis-hooks', label: "API's & Hooks", icon: Webhook },
  { id: 'bug-bounty', label: 'Bug Bounty', icon: Bug },
  { id: 'reseller-program', label: 'Reseller Program', icon: Award },
];

export default function NavMenuModal({ visible, onClose }: NavMenuModalProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();

  const handleMenuPress = (id: string) => {
    console.log('Menu pressed:', id);
    onClose();
    
    const routes: Record<string, string> = {
      'account-settings': '/menu/account-settings',
      'app-settings': '/(tabs)/settings',
      'customer-service': '/menu/customer-service',
      'invite-friends': '/menu/invite-friends',
      'scan-qr': '/menu/scan-qr',
      'buy-crypto': '/menu/buy-crypto',
      'dashboard': '/(tabs)/(wallet)',
      'social-spaces': '/menu/social-spaces',
      'explore': '/menu/explore',
      'profile': '/(tabs)/profile',
      'messages': '/menu/messages',
      'resume': '/menu/resume',
      'calendar': '/(tabs)/calendar',
      'contacts': '/menu/contacts',
      'follow': '/menu/follow',
      'dating': '/menu/dating',
      'media': '/menu/media',
      'creator-tools': '/menu/creator-tools',
      'apps-games': '/menu/apps-games',
      'spaces': '/menu/spaces',
      'bug-bounty': '/menu/bug-bounty',
      'referrals': '/menu/referrals',
      'wallet-nfts': '/menu/wallet-nfts',
      'staking-rewards': '/menu/staking-rewards',
      'lusd-debit-card': '/menu/lusd-debit-card',
      'payment-methods': '/menu/payment-methods',
      'forex': '/menu/forex',
      'lucky-draw': '/menu/lucky-draw',
      'borrow-lend': '/(tabs)/(wallet)/borrow-lend',
      'shopping': '/(tabs)/shop',
      'my-orders': '/menu/my-orders',
      'escrow-manager': '/menu/escrow-manager',
      'advanced-trading': '/menu/advanced-trading',
      'security-center': '/menu/security-center',
      'helpdesk': '/menu/helpdesk',
      'tax-reports': '/menu/tax-reports',
      'tokenize-assets': '/menu/tokenize-assets',
      'assets-market': '/menu/assets-market',
      'my-tokenized-assets': '/menu/my-tokenized-assets',
      'developers': '/menu/developers',
      'domains': '/menu/domains',
      'file-storage': '/menu/file-storage',
      'products-services': '/menu/products-services',
      'apis-hooks': '/menu/apis-hooks',
      'merchant-portal': '/(tabs)/(merchant)/dashboard',
      'register-merchant': '/menu/register-merchant',
      'pos': '/menu/pos',
      'business-listings': '/menu/business-listings',
      'ad-manager': '/(tabs)/(merchant)/ads',
      'post-ad': '/menu/post-ad',
      'my-ads': '/menu/my-ads',
      'reseller-program': '/menu/reseller-program',
      'join-reseller': '/menu/join-reseller',
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.surface }]} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.section}>
            <View style={[styles.sectionItems, { backgroundColor: colors.surface }]}>
              {menuItems.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    { borderBottomColor: colors.border },
                    itemIndex === menuItems.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => handleMenuPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.iconWrapper, { backgroundColor: colors.iconColor + '15' }]}>
                      <item.icon size={20} color={colors.iconColor} />
                    </View>
                    <Text style={[styles.menuItemLabel, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  headerTitle: {
    fontSize: 24,
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
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
});
