import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Coins, TrendingUp, Clock, Gift, Lock, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const stakingPools = [
  { id: '1', name: 'LRC Staking', apy: '12.5%', staked: '5,000 LRC', rewards: '125 LRC', lockPeriod: '30 days', status: 'active' },
  { id: '2', name: 'ETH 2.0 Staking', apy: '4.2%', staked: '2.5 ETH', rewards: '0.08 ETH', lockPeriod: 'Flexible', status: 'active' },
  { id: '3', name: 'USDT Savings', apy: '8.0%', staked: '1,000 USDT', rewards: '20 USDT', lockPeriod: '7 days', status: 'pending' },
];

const rewardsHistory = [
  { id: '1', pool: 'LRC Staking', amount: '+25 LRC', date: 'Jan 24, 2026', value: '$37.50' },
  { id: '2', pool: 'ETH 2.0 Staking', amount: '+0.02 ETH', date: 'Jan 23, 2026', value: '$65.00' },
  { id: '3', pool: 'USDT Savings', amount: '+5 USDT', date: 'Jan 22, 2026', value: '$5.00' },
];

export default function StakingRewardsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Staking & Rewards' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Coins size={24} color="#FFF" />
              <Text style={styles.summaryLabel}>Total Staked</Text>
              <Text style={styles.summaryValue}>$12,500</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Gift size={24} color="#FFF" />
              <Text style={styles.summaryLabel}>Total Rewards</Text>
              <Text style={styles.summaryValue}>$547.50</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Active Stakes</Text>
          {stakingPools.map((pool) => (
            <TouchableOpacity
              key={pool.id}
              style={[styles.poolCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.poolHeader}>
                <View style={[styles.poolIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Coins size={20} color={colors.primary} />
                </View>
                <View style={styles.poolInfo}>
                  <Text style={[styles.poolName, { color: colors.text }]}>{pool.name}</Text>
                  <View style={styles.poolMeta}>
                    <View style={[styles.apyBadge, { backgroundColor: colors.success + '20' }]}>
                      <TrendingUp size={12} color={colors.success} />
                      <Text style={[styles.apyText, { color: colors.success }]}>{pool.apy} APY</Text>
                    </View>
                    <View style={styles.lockInfo}>
                      <Lock size={12} color={colors.textTertiary} />
                      <Text style={[styles.lockText, { color: colors.textTertiary }]}>{pool.lockPeriod}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </View>
              <View style={[styles.poolStats, { borderTopColor: colors.border }]}>
                <View style={styles.poolStat}>
                  <Text style={[styles.poolStatLabel, { color: colors.textTertiary }]}>Staked</Text>
                  <Text style={[styles.poolStatValue, { color: colors.text }]}>{pool.staked}</Text>
                </View>
                <View style={styles.poolStat}>
                  <Text style={[styles.poolStatLabel, { color: colors.textTertiary }]}>Rewards</Text>
                  <Text style={[styles.poolStatValue, { color: colors.success }]}>{pool.rewards}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.stakeButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.stakeButtonText}>Stake More</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Rewards History</Text>
          <View style={[styles.historyCard, { backgroundColor: colors.surface }]}>
            {rewardsHistory.map((reward, index) => (
              <View
                key={reward.id}
                style={[
                  styles.historyItem,
                  { borderBottomColor: colors.border },
                  index === rewardsHistory.length - 1 && styles.historyItemLast,
                ]}
              >
                <View style={[styles.historyIcon, { backgroundColor: colors.success + '15' }]}>
                  <Gift size={16} color={colors.success} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyPool, { color: colors.text }]}>{reward.pool}</Text>
                  <Text style={[styles.historyDate, { color: colors.textTertiary }]}>{reward.date}</Text>
                </View>
                <View style={styles.historyRight}>
                  <Text style={[styles.historyAmount, { color: colors.success }]}>{reward.amount}</Text>
                  <Text style={[styles.historyValue, { color: colors.textTertiary }]}>{reward.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  poolCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  poolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  poolInfo: {
    flex: 1,
  },
  poolName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  poolMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  apyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockText: {
    fontSize: 12,
  },
  poolStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 14,
  },
  poolStat: {
    flex: 1,
  },
  poolStatLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  poolStatValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  stakeButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  stakeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  historyCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  historyItemLast: {
    borderBottomWidth: 0,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyPool: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  historyValue: {
    fontSize: 12,
  },
});
