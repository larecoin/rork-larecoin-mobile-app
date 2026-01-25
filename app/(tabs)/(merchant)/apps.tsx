import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Grid3X3, Download, Star, ExternalLink, Check, 
  Calculator, FileText, BarChart3, MessageSquare, Bell, Shield, Truck, CreditCard, DollarSign
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface App {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  installed: boolean;
  rating: number;
  category: string;
}

const availableApps: App[] = [
  { id: '1', name: 'Inventory Pro', description: 'Advanced inventory management', icon: Grid3X3, color: Colors.primary, installed: true, rating: 4.8, category: 'Operations' },
  { id: '2', name: 'Invoice Generator', description: 'Create professional invoices', icon: FileText, color: '#9B59B6', installed: true, rating: 4.6, category: 'Finance' },
  { id: '3', name: 'Analytics Plus', description: 'Deep business insights', icon: BarChart3, color: '#3498DB', installed: false, rating: 4.9, category: 'Analytics' },
  { id: '4', name: 'Customer Chat', description: 'Live chat with customers', icon: MessageSquare, color: Colors.accent, installed: true, rating: 4.7, category: 'Communication' },
  { id: '5', name: 'Smart Notifications', description: 'Automated alerts & reminders', icon: Bell, color: '#E74C3C', installed: false, rating: 4.5, category: 'Automation' },
  { id: '6', name: 'Fraud Shield', description: 'Payment fraud detection', icon: Shield, color: '#F39C12', installed: false, rating: 4.8, category: 'Security' },
  { id: '7', name: 'Shipping Manager', description: 'Track & manage deliveries', icon: Truck, color: '#1ABC9C', installed: true, rating: 4.4, category: 'Logistics' },
  { id: '8', name: 'Tax Calculator', description: 'Automated tax calculations', icon: Calculator, color: '#95A5A6', installed: false, rating: 4.3, category: 'Finance' },
  { id: '9', name: 'CashMatrix', description: 'Smart cash flow & payment matrix', icon: DollarSign, color: '#27AE60', installed: true, rating: 4.9, category: 'Finance' },
];

export default function MyAppsScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [apps, setApps] = useState<App[]>(availableApps);
  const [activeTab, setActiveTab] = useState<'installed' | 'discover'>('installed');

  const installedApps = apps.filter(app => app.installed);
  const discoverApps = apps.filter(app => !app.installed);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const toggleInstall = (appId: string) => {
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, installed: !app.installed } : app
    ));
  };

  const renderApp = (app: App) => (
    <View key={app.id} style={styles.appCard}>
      <View style={[styles.appIcon, { backgroundColor: app.color + '20' }]}>
        <app.icon size={24} color={app.color} />
      </View>
      <View style={styles.appInfo}>
        <Text style={styles.appName}>{app.name}</Text>
        <Text style={styles.appDesc}>{app.description}</Text>
        <View style={styles.appMeta}>
          <View style={styles.appRating}>
            <Star size={12} color="#F39C12" fill="#F39C12" />
            <Text style={styles.appRatingText}>{app.rating}</Text>
          </View>
          <Text style={styles.appCategory}>{app.category}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.appActionBtn,
          app.installed && styles.appActionBtnInstalled
        ]}
        onPress={() => toggleInstall(app.id)}
      >
        {app.installed ? (
          <>
            <Check size={16} color={Colors.accent} />
            <Text style={styles.appActionTextInstalled}>Installed</Text>
          </>
        ) : (
          <>
            <Download size={16} color={Colors.background} />
            <Text style={styles.appActionText}>Install</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Apps</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'installed' && styles.tabActive]}
          onPress={() => setActiveTab('installed')}
        >
          <Text style={[styles.tabText, activeTab === 'installed' && styles.tabTextActive]}>
            Installed ({installedApps.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discover' && styles.tabActive]}
          onPress={() => setActiveTab('discover')}
        >
          <Text style={[styles.tabText, activeTab === 'discover' && styles.tabTextActive]}>
            Discover
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.content}
      >
        {activeTab === 'installed' ? (
          <>
            {installedApps.length > 0 ? (
              installedApps.map(renderApp)
            ) : (
              <View style={styles.emptyState}>
                <Grid3X3 size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Apps Installed</Text>
                <Text style={styles.emptyDesc}>Browse the Discover tab to find useful apps</Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.discoverTitle}>Recommended for You</Text>
            {discoverApps.map(renderApp)}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  discoverTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  appDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  appMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  appCategory: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  appActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  appActionBtnInstalled: {
    backgroundColor: Colors.accent + '20',
  },
  appActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
  appActionTextInstalled: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
