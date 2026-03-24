import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Megaphone, Plus, Eye, MousePointer, DollarSign, 
  BarChart3, Calendar, Filter, ChevronRight, Pause, Play, Edit2, Trash2,
  Store, Star, MapPin, CheckCircle, Globe, Settings, ExternalLink
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface BusinessListing {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  status: 'active' | 'pending' | 'inactive';
}

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
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [ads] = useState<Ad[]>(mockAds);
  
  const [businessListing] = useState<BusinessListing | null>({
    id: '1',
    name: 'Crypto Coffee Shop',
    category: 'Food & Beverage',
    address: '123 Blockchain Ave, Miami, FL',
    rating: 4.8,
    reviewCount: 124,
    isVerified: true,
    status: 'active',
  });

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
        {/* My Business Listing Section */}
        <View style={styles.businessListingSection}>
          <View style={styles.businessListingHeader}>
            <View style={styles.businessListingTitleRow}>
              <Globe size={20} color={Colors.primary} />
              <Text style={styles.businessListingSectionTitle}>My Business Listing</Text>
            </View>
            <Text style={styles.businessListingSubtitle}>Global Crypto Merchant Directory</Text>
          </View>

          {businessListing ? (
            <View style={styles.businessCard}>
              <View style={styles.businessCardHeader}>
                <View style={styles.businessIconContainer}>
                  <Store size={24} color={Colors.primary} />
                </View>
                <View style={styles.businessInfo}>
                  <View style={styles.businessNameRow}>
                    <Text style={styles.businessName}>{businessListing.name}</Text>
                    {businessListing.isVerified && (
                      <CheckCircle size={16} color={Colors.accent} />
                    )}
                  </View>
                  <Text style={styles.businessCategory}>{businessListing.category}</Text>
                  <View style={styles.businessLocationRow}>
                    <MapPin size={12} color={Colors.textSecondary} />
                    <Text style={styles.businessAddress}>{businessListing.address}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.businessStatsRow}>
                <View style={styles.businessStatItem}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{businessListing.rating}</Text>
                  </View>
                  <Text style={styles.businessStatLabel}>Rating</Text>
                </View>
                <View style={styles.businessStatDivider} />
                <View style={styles.businessStatItem}>
                  <Text style={styles.businessStatValue}>{businessListing.reviewCount}</Text>
                  <Text style={styles.businessStatLabel}>Reviews</Text>
                </View>
                <View style={styles.businessStatDivider} />
                <View style={styles.businessStatItem}>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: businessListing.status === 'active' ? Colors.accent : Colors.warning }
                  ]} />
                  <Text style={styles.businessStatLabel}>
                    {businessListing.status.charAt(0).toUpperCase() + businessListing.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.businessActions}>
                <TouchableOpacity 
                  style={styles.businessActionBtn}
                  onPress={() => router.push('/menu/business-listings')}
                >
                  <Settings size={16} color={Colors.text} />
                  <Text style={styles.businessActionText}>Manage Listing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.businessActionBtnPrimary}>
                  <ExternalLink size={16} color={Colors.background} />
                  <Text style={styles.businessActionTextPrimary}>View in Directory</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noListingCard}>
              <View style={styles.noListingIcon}>
                <Store size={32} color={Colors.textSecondary} />
              </View>
              <Text style={styles.noListingTitle}>No Business Listing Yet</Text>
              <Text style={styles.noListingText}>
                <Text>Add your business to the global crypto merchant directory and reach thousands of crypto users worldwide.</Text>
              </Text>
              <TouchableOpacity 
                style={styles.addListingBtn}
                onPress={() => router.push('/menu/business-listings')}
              >
                <Plus size={18} color={Colors.background} />
                <Text style={styles.addListingBtnText}>Add Business Listing</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

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
  businessListingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  businessListingHeader: {
    marginBottom: 12,
  },
  businessListingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  businessListingSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  businessListingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 28,
  },
  businessCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  businessCardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  businessIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  businessInfo: {
    flex: 1,
  },
  businessNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  businessName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  businessCategory: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  businessLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessAddress: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  businessStatsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    alignItems: 'center',
  },
  businessStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  businessStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  businessStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  businessStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  businessActions: {
    flexDirection: 'row',
    gap: 10,
  },
  businessActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  businessActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  businessActionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  businessActionTextPrimary: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
  noListingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  noListingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  noListingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  noListingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  addListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  addListingBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
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
