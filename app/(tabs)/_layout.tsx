import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Wallet, TrendingUp, BookOpen, Gift, ShoppingBag, User,
  LayoutDashboard, Megaphone, Store, Grid3X3, Users, ClipboardList,
  Newspaper, Receipt, Calendar
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

function CustomTabBar() {
  const { mode, colors } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const walletTabs = [
    { name: '(wallet)', title: 'Wallet', icon: Wallet, route: '/' },
    { name: 'newsfeed', title: 'Feed', icon: Newspaper, route: '/newsfeed' },
    { name: 'calendar', title: 'Calendar', icon: Calendar, route: '/calendar' },
    { name: 'earn', title: 'Earn', icon: Gift, route: '/earn' },
    { name: 'shop', title: 'Shop', icon: ShoppingBag, route: '/shop' },
    { name: 'profile', title: 'Profile', icon: User, route: '/profile' },
  ];

  const merchantTabs = [
    { name: '(merchant)', title: 'Portal', icon: LayoutDashboard, route: '/(merchant)/dashboard' },
    { name: 'myshop', title: 'My Shop', icon: Store, route: '/(merchant)/myshop' },
    { name: 'ads', title: 'Ad Manager', icon: Megaphone, route: '/(merchant)/ads' },
    { name: 'merchantorders', title: 'Orders', icon: ClipboardList, route: '/(merchant)/merchantorders' },
    { name: 'receipts', title: 'Receipts', icon: Receipt, route: '/(merchant)/receipts' },
    { name: 'apps', title: 'My Apps', icon: Grid3X3, route: '/(merchant)/apps' },
  ];

  const tabs = mode === 'merchant' ? merchantTabs : walletTabs;

  const isActive = (route: string) => {
    if (route === '/') return pathname === '/' || pathname.startsWith('/(wallet)');
    if (route.startsWith('/(merchant)')) {
      return pathname.includes(route.replace('/(merchant)', ''));
    }
    return pathname === route || pathname.startsWith(route);
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom || 10, backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }]}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => router.push(tab.route as any)}
          >
            <tab.icon size={22} color={active ? colors.primary : colors.textTertiary} />
            <Text style={[styles.tabLabel, { color: active ? colors.primary : colors.textTertiary }]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { mode } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={() => <CustomTabBar />}
    >
      <Tabs.Screen name="(wallet)" />
      <Tabs.Screen name="newsfeed" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="(merchant)" />
      <Tabs.Screen name="markets" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="earn" />
      <Tabs.Screen name="shop" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    marginTop: 4,
  },
});
