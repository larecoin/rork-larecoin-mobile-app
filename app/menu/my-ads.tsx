import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, Eye, MousePointer, DollarSign, Plus, ChevronRight, Pause, Play } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const ads = [
  { id: '1', title: 'NFT Collection Launch', status: 'active', views: 12500, clicks: 450, spent: '$125', budget: '$500' },
  { id: '2', title: 'Trading Course Promo', status: 'paused', views: 8900, clicks: 320, spent: '$89', budget: '$200' },
  { id: '3', title: 'DeFi Platform Ad', status: 'active', views: 5600, clicks: 180, spent: '$56', budget: '$300' },
];

export default function MyAdsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Ads' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Eye size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>27K</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Views</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MousePointer size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>950</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Clicks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <DollarSign size={20} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>$270</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Spent</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.newAdButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.newAdText}>Create New Ad</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Campaigns</Text>
          {ads.map((ad) => (
            <TouchableOpacity
              key={ad.id}
              style={[styles.adCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.adHeader}>
                <View style={styles.adInfo}>
                  <Text style={[styles.adTitle, { color: colors.text }]}>{ad.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: ad.status === 'active' ? colors.success + '20' : colors.warning + '20' }
                  ]}>
                    {ad.status === 'active' ? (
                      <Play size={10} color={colors.success} fill={colors.success} />
                    ) : (
                      <Pause size={10} color={colors.warning} />
                    )}
                    <Text style={[
                      styles.statusText,
                      { color: ad.status === 'active' ? colors.success : colors.warning }
                    ]}>
                      {ad.status}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
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
                  <Text style={[styles.adStatLabel, { color: colors.textTertiary }]}>Spent</Text>
                  <Text style={[styles.adStatValue, { color: colors.text }]}>{ad.spent}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  newAdButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, gap: 8 },
  newAdText: { color: '#FFF', fontSize: 15, fontWeight: '600' as const },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  adCard: { borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  adHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  adInfo: { flex: 1 },
  adTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' },
  adStats: { flexDirection: 'row', borderTopWidth: 1, padding: 12 },
  adStat: { flex: 1, alignItems: 'center' },
  adStatLabel: { fontSize: 10, marginBottom: 2 },
  adStatValue: { fontSize: 14, fontWeight: '600' as const },
});
