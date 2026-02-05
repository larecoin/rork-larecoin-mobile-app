import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Copy, Users, TrendingUp, Star, Shield, Search, Filter, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  roi30d: number;
  winRate: number;
  copiers: number;
  aum: string;
  maxDrawdown: number;
  verified: boolean;
  risk: 'low' | 'medium' | 'high';
}

export default function CopyTradingScreen() {
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'roi' | 'copiers' | 'winrate'>('roi');

  const traders: Trader[] = [
    { id: '1', name: 'CryptoMaster', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', roi30d: 45.2, winRate: 78, copiers: 1250, aum: '$2.4M', maxDrawdown: 12, verified: true, risk: 'medium' },
    { id: '2', name: 'SafeTrader', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', roi30d: 18.5, winRate: 85, copiers: 3420, aum: '$5.8M', maxDrawdown: 5, verified: true, risk: 'low' },
    { id: '3', name: 'AlphaHunter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', roi30d: 82.4, winRate: 62, copiers: 890, aum: '$1.2M', maxDrawdown: 28, verified: false, risk: 'high' },
    { id: '4', name: 'SwingKing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', roi30d: 32.8, winRate: 72, copiers: 2100, aum: '$3.5M', maxDrawdown: 15, verified: true, risk: 'medium' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Copy size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Copy Trading</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            <Text>Automatically replicate trades from top performers</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>$12.5M</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total AUM</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>8,450</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Copiers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>+28.5%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg. ROI</Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search traders..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.surface }]}>
          <Filter size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.sortSection}>
        <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort by:</Text>
        {(['roi', 'copiers', 'winrate'] as const).map(sort => (
          <TouchableOpacity
            key={sort}
            style={[styles.sortBtn, { backgroundColor: colors.surface }, sortBy === sort && { backgroundColor: colors.primary }]}
            onPress={() => setSortBy(sort)}
          >
            <Text style={[styles.sortBtnText, { color: sortBy === sort ? '#FFFFFF' : colors.textSecondary }]}>
              {sort === 'roi' ? 'ROI' : sort === 'copiers' ? 'Copiers' : 'Win Rate'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.traderList}>
        {traders.map(trader => (
          <TouchableOpacity key={trader.id} style={[styles.traderCard, { backgroundColor: colors.surface }]}>
            <View style={styles.traderHeader}>
              <Image source={{ uri: trader.avatar }} style={styles.traderAvatar} />
              <View style={styles.traderInfo}>
                <View style={styles.traderNameRow}>
                  <Text style={[styles.traderName, { color: colors.text }]}>{trader.name}</Text>
                  {trader.verified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.primary + '20' }]}>
                      <Shield size={10} color={colors.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.traderMeta}>
                  <Users size={12} color={colors.textSecondary} />
                  <Text style={[styles.copierCount, { color: colors.textSecondary }]}>{trader.copiers.toLocaleString()} copiers</Text>
                </View>
              </View>
              <View style={styles.traderRoi}>
                <Text style={[styles.roiValue, { color: trader.roi30d >= 0 ? '#10B981' : '#EF4444' }]}>
                  {trader.roi30d >= 0 ? '+' : ''}{trader.roi30d}%
                </Text>
                <Text style={[styles.roiLabel, { color: colors.textSecondary }]}>30d ROI</Text>
              </View>
            </View>

            <View style={styles.traderStats}>
              <View style={styles.traderStat}>
                <Text style={[styles.traderStatLabel, { color: colors.textSecondary }]}>Win Rate</Text>
                <Text style={[styles.traderStatValue, { color: colors.text }]}>{trader.winRate}%</Text>
              </View>
              <View style={styles.traderStat}>
                <Text style={[styles.traderStatLabel, { color: colors.textSecondary }]}>AUM</Text>
                <Text style={[styles.traderStatValue, { color: colors.text }]}>{trader.aum}</Text>
              </View>
              <View style={styles.traderStat}>
                <Text style={[styles.traderStatLabel, { color: colors.textSecondary }]}>Max DD</Text>
                <Text style={[styles.traderStatValue, { color: colors.text }]}>{trader.maxDrawdown}%</Text>
              </View>
              <View style={styles.traderStat}>
                <Text style={[styles.traderStatLabel, { color: colors.textSecondary }]}>Risk</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(trader.risk) + '20' }]}>
                  <Text style={[styles.riskText, { color: getRiskColor(trader.risk) }]}>{trader.risk}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={[styles.copyBtn, { backgroundColor: colors.primary }]}>
              <Copy size={16} color="#FFFFFF" />
              <Text style={styles.copyBtnText}>Copy Trader</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 13,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  traderList: {
    paddingHorizontal: 16,
  },
  traderCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  traderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  traderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  traderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  traderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  traderName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  traderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  copierCount: {
    fontSize: 12,
  },
  traderRoi: {
    alignItems: 'flex-end',
  },
  roiValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  roiLabel: {
    fontSize: 10,
  },
  traderStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  traderStat: {
    alignItems: 'center',
    gap: 4,
  },
  traderStatLabel: {
    fontSize: 10,
  },
  traderStatValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
