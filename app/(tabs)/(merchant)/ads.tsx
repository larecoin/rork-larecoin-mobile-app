import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Megaphone, Plus, Eye, MousePointer, DollarSign, 
  BarChart3, Calendar, Filter, ChevronRight, Pause, Play, Edit2, Trash2
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Ad {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'ended';
  impressions: number;
  clicks: number;
  spent: number;
  budget: number;
  startDate: string;
  endDate: string;
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Summer Sale Campaign',
    status: 'active',
    impressions: 12450,
    clicks: 345,
    spent: 125.50,
    budget: 500,
    startDate: '2025-01-15',
    endDate: '2025-02-15',
  },
  {
    id: '2',
    title: 'New Product Launch',
    status: 'active',
    impressions: 8320,
    clicks: 198,
    spent: 89.00,
    budget: 300,
    startDate: '2025-01-20',
    endDate: '2025-01-30',
  },
  {
    id: '3',
    title: 'Holiday Special',
    status: 'paused',
    impressions: 5670,
    clicks: 124,
    spent: 45.00,
    budget: 200,
    startDate: '2025-01-01',
    endDate: '2025-01-10',
  },
];

export default function AdManagerScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [ads] = useState<Ad[]>(mockAds);

  const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: Ad['status']) => {
    switch (status) {
      case 'active': return Colors.accent;
      case 'paused': return Colors.warning;
      case 'ended': return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ad Manager</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Plus size={20} color={Colors.background} />
          <Text style={styles.createBtnText}>New Ad</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <DollarSign size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Eye size={18} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>{(totalImpressions / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Impressions</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#9B59B6' + '20' }]}>
              <MousePointer size={18} color="#9B59B6" />
            </View>
            <Text style={styles.statValue}>{totalClicks}</Text>
            <Text style={styles.statLabel}>Clicks</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={16} color={Colors.textSecondary} />
            <Text style={styles.filterText}>All Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Calendar size={16} color={Colors.textSecondary} />
            <Text style={styles.filterText}>This Month</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Campaigns</Text>
          {ads.map(ad => (
            <View key={ad.id} style={styles.adCard}>
              <View style={styles.adHeader}>
                <View style={styles.adTitleRow}>
                  <Text style={styles.adTitle}>{ad.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ad.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(ad.status) }]}>
                      {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.adDates}>{ad.startDate} - {ad.endDate}</Text>
              </View>

              <View style={styles.adStats}>
                <View style={styles.adStatItem}>
                  <Text style={styles.adStatValue}>{ad.impressions.toLocaleString()}</Text>
                  <Text style={styles.adStatLabel}>Views</Text>
                </View>
                <View style={styles.adStatItem}>
                  <Text style={styles.adStatValue}>{ad.clicks}</Text>
                  <Text style={styles.adStatLabel}>Clicks</Text>
                </View>
                <View style={styles.adStatItem}>
                  <Text style={styles.adStatValue}>{((ad.clicks / ad.impressions) * 100).toFixed(1)}%</Text>
                  <Text style={styles.adStatLabel}>CTR</Text>
                </View>
                <View style={styles.adStatItem}>
                  <Text style={styles.adStatValue}>${ad.spent.toFixed(0)}</Text>
                  <Text style={styles.adStatLabel}>Spent</Text>
                </View>
              </View>

              <View style={styles.budgetBar}>
                <View style={[styles.budgetProgress, { width: `${(ad.spent / ad.budget) * 100}%` }]} />
              </View>
              <Text style={styles.budgetText}>${ad.spent.toFixed(2)} of ${ad.budget} budget</Text>

              <View style={styles.adActions}>
                <TouchableOpacity style={styles.adActionBtn}>
                  {ad.status === 'active' ? (
                    <Pause size={16} color={Colors.textSecondary} />
                  ) : (
                    <Play size={16} color={Colors.accent} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.adActionBtn}>
                  <Edit2 size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.adActionBtn}>
                  <BarChart3 size={16} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.adActionBtn}>
                  <Trash2 size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  adCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  adHeader: {
    marginBottom: 14,
  },
  adTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  adDates: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  adStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  adStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  adStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  adStatLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  budgetBar: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  budgetProgress: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  budgetText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  adActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  adActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
