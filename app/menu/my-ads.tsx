import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Eye, MousePointer, DollarSign, Plus, ChevronRight, Pause, Play, 
  Trash2, Edit3, TrendingUp, BarChart3, Clock, Target, X, 
  Calendar, Zap, Award, Filter, MoreVertical
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Ad {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'ended' | 'pending';
  views: number;
  clicks: number;
  conversions: number;
  spent: number;
  budget: number;
  ctr: number;
  startDate: string;
  endDate: string;
  category: string;
  image: string;
}

const mockAds: Ad[] = [
  { 
    id: '1', 
    title: 'NFT Collection Launch', 
    description: 'Exclusive digital art collection featuring rare collectibles',
    status: 'active', 
    views: 12500, 
    clicks: 450, 
    conversions: 32,
    spent: 125, 
    budget: 500,
    ctr: 3.6,
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    category: 'Digital Art',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200'
  },
  { 
    id: '2', 
    title: 'Trading Course Promo', 
    description: 'Learn advanced trading strategies from expert traders',
    status: 'paused', 
    views: 8900, 
    clicks: 320, 
    conversions: 18,
    spent: 89, 
    budget: 200,
    ctr: 3.6,
    startDate: '2025-01-10',
    endDate: '2025-01-30',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200'
  },
  { 
    id: '3', 
    title: 'DeFi Platform Ad', 
    description: 'Earn up to 12% APY on your crypto holdings',
    status: 'active', 
    views: 5600, 
    clicks: 180, 
    conversions: 12,
    spent: 56, 
    budget: 300,
    ctr: 3.2,
    startDate: '2025-01-20',
    endDate: '2025-02-20',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200'
  },
  { 
    id: '4', 
    title: 'Crypto Merch Store', 
    description: 'Premium quality crypto-themed apparel and accessories',
    status: 'ended', 
    views: 15200, 
    clicks: 890, 
    conversions: 65,
    spent: 200, 
    budget: 200,
    ctr: 5.9,
    startDate: '2024-12-01',
    endDate: '2025-01-01',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200'
  },
];

export default function MyAdsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalSpent = ads.reduce((sum, ad) => sum + ad.spent, 0);
  const totalConversions = ads.reduce((sum, ad) => sum + ad.conversions, 0);
  const avgCtr = totalClicks > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  const filteredAds = filterStatus === 'all' 
    ? ads 
    : ads.filter(ad => ad.status === filterStatus);

  const toggleAdStatus = (adId: string) => {
    setAds(prev => prev.map(ad => {
      if (ad.id === adId) {
        const newStatus = ad.status === 'active' ? 'paused' : 'active';
        return { ...ad, status: newStatus };
      }
      return ad;
    }));
  };

  const deleteAd = (adId: string) => {
    Alert.alert(
      'Delete Ad',
      'Are you sure you want to delete this ad? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAds(prev => prev.filter(ad => ad.id !== adId));
            setShowDetailsModal(false);
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'paused': return colors.warning;
      case 'ended': return colors.textTertiary;
      case 'pending': return colors.primary;
      default: return colors.textTertiary;
    }
  };

  const renderAdDetailsModal = () => {
    if (!selectedAd) return null;

    return (
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Ad Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.adDetailCard, { backgroundColor: colors.surface }]}>
              <View style={styles.adDetailHeader}>
                <Text style={[styles.adDetailTitle, { color: colors.text }]}>{selectedAd.title}</Text>
                <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedAd.status) + '20' }]}>
                  <Text style={[styles.statusTextLarge, { color: getStatusColor(selectedAd.status) }]}>
                    {selectedAd.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.adDetailDesc, { color: colors.textSecondary }]}>
                {selectedAd.description}
              </Text>
              <View style={styles.adDetailMeta}>
                <View style={styles.adDetailMetaItem}>
                  <Calendar size={14} color={colors.textTertiary} />
                  <Text style={[styles.adDetailMetaText, { color: colors.textTertiary }]}>
                    {selectedAd.startDate} - {selectedAd.endDate}
                  </Text>
                </View>
                <View style={styles.adDetailMetaItem}>
                  <Target size={14} color={colors.textTertiary} />
                  <Text style={[styles.adDetailMetaText, { color: colors.textTertiary }]}>
                    {selectedAd.category}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailStatsGrid}>
              <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                <Eye size={20} color={colors.primary} />
                <Text style={[styles.detailStatValue, { color: colors.text }]}>
                  {selectedAd.views.toLocaleString()}
                </Text>
                <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Impressions</Text>
              </View>
              <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                <MousePointer size={20} color={colors.success} />
                <Text style={[styles.detailStatValue, { color: colors.text }]}>
                  {selectedAd.clicks.toLocaleString()}
                </Text>
                <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Clicks</Text>
              </View>
              <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                <TrendingUp size={20} color="#8B5CF6" />
                <Text style={[styles.detailStatValue, { color: colors.text }]}>
                  {selectedAd.ctr}%
                </Text>
                <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>CTR</Text>
              </View>
              <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                <Award size={20} color="#EC4899" />
                <Text style={[styles.detailStatValue, { color: colors.text }]}>
                  {selectedAd.conversions}
                </Text>
                <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Conversions</Text>
              </View>
            </View>

            <View style={[styles.budgetCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.budgetTitle, { color: colors.text }]}>Budget</Text>
              <View style={styles.budgetRow}>
                <View>
                  <Text style={[styles.budgetSpent, { color: colors.text }]}>
                    ${selectedAd.spent.toFixed(2)}
                  </Text>
                  <Text style={[styles.budgetLabel, { color: colors.textTertiary }]}>Spent</Text>
                </View>
                <View style={styles.budgetProgress}>
                  <View style={[styles.budgetProgressBg, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.budgetProgressFill, 
                        { 
                          backgroundColor: colors.primary,
                          width: `${Math.min((selectedAd.spent / selectedAd.budget) * 100, 100)}%`
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.budgetPercent, { color: colors.textSecondary }]}>
                    {((selectedAd.spent / selectedAd.budget) * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.budgetTotal, { color: colors.text }]}>
                    ${selectedAd.budget.toFixed(2)}
                  </Text>
                  <Text style={[styles.budgetLabel, { color: colors.textTertiary }]}>Budget</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              {selectedAd.status !== 'ended' && (
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                  onPress={() => toggleAdStatus(selectedAd.id)}
                >
                  {selectedAd.status === 'active' ? (
                    <>
                      <Pause size={20} color={colors.warning} />
                      <Text style={[styles.actionBtnText, { color: colors.text }]}>Pause Ad</Text>
                    </>
                  ) : (
                    <>
                      <Play size={20} color={colors.success} />
                      <Text style={[styles.actionBtnText, { color: colors.text }]}>Resume Ad</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                onPress={() => {
                  setShowDetailsModal(false);
                  router.push('/menu/post-ad');
                }}
              >
                <Edit3 size={20} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.text }]}>Edit Ad</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: colors.error + '15' }]}
                onPress={() => deleteAd(selectedAd.id)}
              >
                <Trash2 size={20} color={colors.error} />
                <Text style={[styles.actionBtnText, { color: colors.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.boostBtn, { backgroundColor: colors.primary }]}
            >
              <Zap size={20} color="#FFF" />
              <Text style={styles.boostBtnText}>Boost This Ad</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Ad Manager' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Eye size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Impressions</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MousePointer size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {totalClicks >= 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : totalClicks}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Clicks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <DollarSign size={20} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>${totalSpent}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Spent</Text>
          </View>
        </View>

        <View style={styles.secondaryStats}>
          <View style={[styles.secondaryStat, { backgroundColor: colors.surface }]}>
            <TrendingUp size={16} color="#8B5CF6" />
            <Text style={[styles.secondaryStatValue, { color: colors.text }]}>{avgCtr}%</Text>
            <Text style={[styles.secondaryStatLabel, { color: colors.textTertiary }]}>Avg CTR</Text>
          </View>
          <View style={[styles.secondaryStat, { backgroundColor: colors.surface }]}>
            <Award size={16} color="#EC4899" />
            <Text style={[styles.secondaryStatValue, { color: colors.text }]}>{totalConversions}</Text>
            <Text style={[styles.secondaryStatLabel, { color: colors.textTertiary }]}>Conversions</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.newAdButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/menu/post-ad')}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.newAdText}>Create New Ad</Text>
        </TouchableOpacity>

        <View style={styles.filterRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Campaigns</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabs}>
              {['all', 'active', 'paused', 'ended'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterTab,
                    { backgroundColor: filterStatus === status ? colors.primary : colors.surface }
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text style={[
                    styles.filterTabText,
                    { color: filterStatus === status ? '#FFF' : colors.textSecondary }
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          {filteredAds.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <BarChart3 size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No ads found</Text>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {filterStatus === 'all' 
                  ? 'Create your first ad to start reaching customers'
                  : `No ${filterStatus} ads at the moment`}
              </Text>
            </View>
          ) : (
            filteredAds.map((ad) => (
              <TouchableOpacity
                key={ad.id}
                style={[styles.adCard, { backgroundColor: colors.surface }]}
                onPress={() => {
                  setSelectedAd(ad);
                  setShowDetailsModal(true);
                }}
              >
                <View style={styles.adHeader}>
                  <View style={styles.adInfo}>
                    <Text style={[styles.adTitle, { color: colors.text }]}>{ad.title}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(ad.status) + '20' }
                    ]}>
                      {ad.status === 'active' ? (
                        <Play size={10} color={getStatusColor(ad.status)} fill={getStatusColor(ad.status)} />
                      ) : ad.status === 'paused' ? (
                        <Pause size={10} color={getStatusColor(ad.status)} />
                      ) : (
                        <Clock size={10} color={getStatusColor(ad.status)} />
                      )}
                      <Text style={[styles.statusText, { color: getStatusColor(ad.status) }]}>
                        {ad.status}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.moreBtn}
                    onPress={() => {
                      setSelectedAd(ad);
                      setShowDetailsModal(true);
                    }}
                  >
                    <MoreVertical size={18} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.adStats, { borderTopColor: colors.border }]}>
                  <View style={styles.adStat}>
                    <Text style={[styles.adStatLabel, { color: colors.textTertiary }]}>Views</Text>
                    <Text style={[styles.adStatValue, { color: colors.text }]}>{ad.views.toLocaleString()}</Text>
                  </View>
                  <View style={styles.adStat}>
                    <Text style={[styles.adStatLabel, { color: colors.textTertiary }]}>Clicks</Text>
                    <Text style={[styles.adStatValue, { color: colors.text }]}>{ad.clicks}</Text>
                  </View>
                  <View style={styles.adStat}>
                    <Text style={[styles.adStatLabel, { color: colors.textTertiary }]}>CTR</Text>
                    <Text style={[styles.adStatValue, { color: colors.text }]}>{ad.ctr}%</Text>
                  </View>
                  <View style={styles.adStat}>
                    <Text style={[styles.adStatLabel, { color: colors.textTertiary }]}>Spent</Text>
                    <Text style={[styles.adStatValue, { color: colors.text }]}>${ad.spent}</Text>
                  </View>
                </View>
                <View style={[styles.adBudgetBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.adBudgetFill, 
                      { 
                        backgroundColor: colors.primary,
                        width: `${Math.min((ad.spent / ad.budget) * 100, 100)}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.adBudgetText, { color: colors.textTertiary }]}>
                  ${ad.spent} of ${ad.budget} budget used
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {renderAdDetailsModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' as const, marginTop: 8 },
  statLabel: { fontSize: 11, marginTop: 4 },
  secondaryStats: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  secondaryStat: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, gap: 8 },
  secondaryStatValue: { fontSize: 16, fontWeight: '700' as const },
  secondaryStatLabel: { fontSize: 12 },
  newAdButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, gap: 8 },
  newAdText: { color: '#FFF', fontSize: 15, fontWeight: '600' as const },
  filterRow: { paddingHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, marginBottom: 12 },
  filterTabs: { flexDirection: 'row', gap: 8 },
  filterTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterTabText: { fontSize: 13, fontWeight: '600' as const },
  section: { paddingHorizontal: 16 },
  adCard: { borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  adHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  adInfo: { flex: 1 },
  adTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  moreBtn: { padding: 4 },
  adStats: { flexDirection: 'row', borderTopWidth: 1, padding: 12 },
  adStat: { flex: 1, alignItems: 'center' },
  adStatLabel: { fontSize: 10, marginBottom: 2 },
  adStatValue: { fontSize: 14, fontWeight: '600' as const },
  adBudgetBar: { height: 4, marginHorizontal: 12, borderRadius: 2, marginTop: 4 },
  adBudgetFill: { height: '100%', borderRadius: 2 },
  adBudgetText: { fontSize: 11, paddingHorizontal: 12, paddingVertical: 8 },
  emptyState: { padding: 40, borderRadius: 16, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600' as const, marginTop: 16 },
  emptyText: { fontSize: 14, textAlign: 'center' as const, marginTop: 8 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' as const },
  adDetailCard: { margin: 16, padding: 16, borderRadius: 16 },
  adDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  adDetailTitle: { fontSize: 20, fontWeight: '700' as const, flex: 1, marginRight: 12 },
  statusBadgeLarge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusTextLarge: { fontSize: 12, fontWeight: '700' as const },
  adDetailDesc: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  adDetailMeta: { flexDirection: 'row', gap: 16 },
  adDetailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  adDetailMetaText: { fontSize: 12 },
  detailStatsGrid: { flexDirection: 'row', flexWrap: 'wrap' as const, paddingHorizontal: 12, gap: 8 },
  detailStatCard: { width: '48%', padding: 16, borderRadius: 12, alignItems: 'center' },
  detailStatValue: { fontSize: 24, fontWeight: '700' as const, marginTop: 8 },
  detailStatLabel: { fontSize: 12, marginTop: 4 },
  budgetCard: { margin: 16, padding: 16, borderRadius: 16 },
  budgetTitle: { fontSize: 16, fontWeight: '600' as const, marginBottom: 12 },
  budgetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  budgetSpent: { fontSize: 18, fontWeight: '700' as const },
  budgetLabel: { fontSize: 11, marginTop: 2 },
  budgetProgress: { flex: 1, marginHorizontal: 16 },
  budgetProgressBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  budgetProgressFill: { height: '100%', borderRadius: 4 },
  budgetPercent: { fontSize: 11, textAlign: 'center' as const, marginTop: 4 },
  budgetTotal: { fontSize: 18, fontWeight: '700' as const },
  actionButtons: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  actionBtnText: { fontSize: 13, fontWeight: '600' as const },
  boostBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, paddingVertical: 16, borderRadius: 12, gap: 8 },
  boostBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
});
