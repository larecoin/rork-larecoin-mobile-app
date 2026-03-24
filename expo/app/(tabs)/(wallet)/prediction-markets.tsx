import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Target, Clock, Users, TrendingUp, ChevronRight, Info, Calendar } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Market {
  id: string;
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  endDate: string;
  liquidity: string;
  resolved: boolean;
}

export default function PredictionMarketsScreen() {
  const { colors } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['All', 'Crypto', 'Politics', 'Sports', 'Tech', 'Finance'];

  const markets: Market[] = [
    { id: '1', question: 'Will BTC reach $50,000 by March 2025?', category: 'Crypto', yesPrice: 0.65, noPrice: 0.35, volume: '$2.4M', endDate: 'Mar 31, 2025', liquidity: '$450K', resolved: false },
    { id: '2', question: 'Will ETH flip BTC in market cap by 2026?', category: 'Crypto', yesPrice: 0.15, noPrice: 0.85, volume: '$890K', endDate: 'Dec 31, 2026', liquidity: '$120K', resolved: false },
    { id: '3', question: 'Will Apple release AR glasses in 2025?', category: 'Tech', yesPrice: 0.42, noPrice: 0.58, volume: '$1.2M', endDate: 'Dec 31, 2025', liquidity: '$280K', resolved: false },
    { id: '4', question: 'Will Fed cut rates below 4% by June 2025?', category: 'Finance', yesPrice: 0.72, noPrice: 0.28, volume: '$3.8M', endDate: 'Jun 30, 2025', liquidity: '$650K', resolved: false },
  ];

  const filteredMarkets = selectedCategory === 'all' 
    ? markets 
    : markets.filter(m => m.category.toLowerCase() === selectedCategory);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Target size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Prediction Markets</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            <Text>Trade on real-world event outcomes</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>156</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Markets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>$12.5M</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Volume</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>8,420</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Traders</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        <View style={styles.categoryList}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                { backgroundColor: colors.surface },
                selectedCategory === cat.toLowerCase() && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedCategory(cat.toLowerCase())}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === cat.toLowerCase() ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.marketList}>
        {filteredMarkets.map(market => (
          <TouchableOpacity key={market.id} style={[styles.marketCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '15' }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>{market.category}</Text>
            </View>
            
            <Text style={[styles.marketQuestion, { color: colors.text }]}>{market.question}</Text>
            
            <View style={styles.priceRow}>
              <View style={[styles.priceBox, { backgroundColor: '#10B98115' }]}>
                <Text style={[styles.priceLabel, { color: '#10B981' }]}>Yes</Text>
                <Text style={[styles.priceValue, { color: '#10B981' }]}>{(market.yesPrice * 100).toFixed(0)}¢</Text>
              </View>
              <View style={[styles.priceBox, { backgroundColor: '#EF444415' }]}>
                <Text style={[styles.priceLabel, { color: '#EF4444' }]}>No</Text>
                <Text style={[styles.priceValue, { color: '#EF4444' }]}>{(market.noPrice * 100).toFixed(0)}¢</Text>
              </View>
            </View>

            <View style={styles.marketMeta}>
              <View style={styles.metaItem}>
                <TrendingUp size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{market.volume}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{market.endDate}</Text>
              </View>
            </View>

            <View style={styles.marketActions}>
              <TouchableOpacity style={[styles.tradeBtn, { backgroundColor: '#10B981' }]}>
                <Text style={styles.tradeBtnText}>Buy Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tradeBtn, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.tradeBtnText}>Buy No</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How It Works</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Buy shares in outcomes you believe will happen. Shares pay $1 if correct, $0 if wrong. Trade anytime before resolution.
          </Text>
        </View>
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
  categoryScroll: {
    marginBottom: 16,
  },
  categoryList: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  marketList: {
    paddingHorizontal: 16,
  },
  marketCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  marketQuestion: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  marketMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  marketActions: {
    flexDirection: 'row',
    gap: 10,
  },
  tradeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  tradeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
