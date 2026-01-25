import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Grid3X3, Play, Pause, Plus, TrendingUp, Settings, Info, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface GridBot {
  id: string;
  pair: string;
  type: 'long' | 'neutral' | 'short';
  status: 'running' | 'paused';
  invested: number;
  profit: number;
  profitPercent: number;
  grids: number;
  priceRange: string;
  runtime: string;
}

export default function GridBotsScreen() {
  const { colors } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const bots: GridBot[] = [
    { id: '1', pair: 'BTC/USDT', type: 'neutral', status: 'running', invested: 5000, profit: 245.80, profitPercent: 4.92, grids: 50, priceRange: '$40,000 - $45,000', runtime: '15 days' },
    { id: '2', pair: 'ETH/USDT', type: 'long', status: 'running', invested: 2500, profit: 89.50, profitPercent: 3.58, grids: 30, priceRange: '$2,200 - $2,600', runtime: '8 days' },
    { id: '3', pair: 'SOL/USDT', type: 'neutral', status: 'paused', invested: 1000, profit: -15.20, profitPercent: -1.52, grids: 25, priceRange: '$90 - $110', runtime: '3 days' },
  ];

  const totalInvested = bots.reduce((sum, b) => sum + b.invested, 0);
  const totalProfit = bots.reduce((sum, b) => sum + b.profit, 0);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'long': return '#10B981';
      case 'neutral': return '#3B82F6';
      case 'short': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Grid3X3 size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Grid Trading Bots</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Profit from market volatility with automated grid orders
          </Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Invested</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${totalInvested.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Profit</Text>
            <Text style={[styles.summaryValue, { color: totalProfit >= 0 ? '#10B981' : '#EF4444' }]}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Create New Bot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Bots</Text>
        {bots.map(bot => (
          <View key={bot.id} style={[styles.botCard, { backgroundColor: colors.surface }]}>
            <View style={styles.botHeader}>
              <View style={styles.botInfo}>
                <Text style={[styles.botPair, { color: colors.text }]}>{bot.pair}</Text>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(bot.type) + '20' }]}>
                  <Text style={[styles.typeText, { color: getTypeColor(bot.type) }]}>{bot.type}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.statusBtn, { backgroundColor: bot.status === 'running' ? '#10B98120' : '#F59E0B20' }]}>
                {bot.status === 'running' ? (
                  <Pause size={14} color="#10B981" />
                ) : (
                  <Play size={14} color="#F59E0B" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.botStats}>
              <View style={styles.botStat}>
                <Text style={[styles.botStatLabel, { color: colors.textSecondary }]}>Invested</Text>
                <Text style={[styles.botStatValue, { color: colors.text }]}>${bot.invested.toLocaleString()}</Text>
              </View>
              <View style={styles.botStat}>
                <Text style={[styles.botStatLabel, { color: colors.textSecondary }]}>Profit</Text>
                <Text style={[styles.botStatValue, { color: bot.profit >= 0 ? '#10B981' : '#EF4444' }]}>
                  {bot.profit >= 0 ? '+' : ''}${bot.profit.toFixed(2)} ({bot.profitPercent}%)
                </Text>
              </View>
            </View>

            <View style={[styles.botDetails, { backgroundColor: colors.background }]}>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Grids</Text>
                <Text style={[styles.botDetailValue, { color: colors.text }]}>{bot.grids}</Text>
              </View>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Range</Text>
                <Text style={[styles.botDetailValue, { color: colors.text }]}>{bot.priceRange}</Text>
              </View>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Runtime</Text>
                <Text style={[styles.botDetailValue, { color: colors.text }]}>{bot.runtime}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.manageBtn, { borderColor: colors.border }]}>
              <Settings size={16} color={colors.textSecondary} />
              <Text style={[styles.manageBtnText, { color: colors.text }]}>Manage Bot</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Grid Bots Work</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Grid bots place buy and sell orders at preset intervals within a price range. They profit from price oscillations by buying low and selling high repeatedly.
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
  summaryCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  botCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  botHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  botInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botPair: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  statusBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  botStat: {
    gap: 4,
  },
  botStatLabel: {
    fontSize: 11,
  },
  botStatValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  botDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  botDetailItem: {
    alignItems: 'center',
    gap: 4,
  },
  botDetailLabel: {
    fontSize: 10,
  },
  botDetailValue: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  manageBtnText: {
    fontSize: 13,
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
