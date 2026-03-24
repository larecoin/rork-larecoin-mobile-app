import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Droplets, Plus, Minus, TrendingUp, Clock, Shield, ChevronRight, Percent, Coins } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Pool {
  id: string;
  token0: string;
  token1: string;
  tvl: string;
  apr: number;
  volume24h: string;
  myLiquidity: number;
  rewards: number;
}

export default function LiquidityMiningScreen() {
  const { colors } = useApp();
  const [activeTab, setActiveTab] = useState<'pools' | 'my-positions'>('pools');
  const [showAddModal, setShowAddModal] = useState(false);

  const pools: Pool[] = [
    { id: '1', token0: 'ETH', token1: 'USDC', tvl: '$45.2M', apr: 24.5, volume24h: '$8.2M', myLiquidity: 2500, rewards: 12.5 },
    { id: '2', token0: 'BTC', token1: 'ETH', tvl: '$32.1M', apr: 18.2, volume24h: '$5.4M', myLiquidity: 0, rewards: 0 },
    { id: '3', token0: 'LARE', token1: 'USDT', tvl: '$12.8M', apr: 45.8, volume24h: '$2.1M', myLiquidity: 1000, rewards: 8.2 },
    { id: '4', token0: 'SOL', token1: 'USDC', tvl: '$28.5M', apr: 22.1, volume24h: '$4.8M', myLiquidity: 0, rewards: 0 },
  ];

  const myPositions = pools.filter(p => p.myLiquidity > 0);
  const totalRewards = myPositions.reduce((sum, p) => sum + p.rewards, 0);
  const totalLiquidity = myPositions.reduce((sum, p) => sum + p.myLiquidity, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>My Liquidity</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${totalLiquidity.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Pending Rewards</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>${totalRewards.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.claimBtn, { backgroundColor: colors.primary }]}>
          <Coins size={16} color="#FFFFFF" />
          <Text style={styles.claimBtnText}>Claim All Rewards</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pools' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('pools')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'pools' ? '#FFFFFF' : colors.textSecondary }]}>All Pools</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my-positions' && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab('my-positions')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'my-positions' ? '#FFFFFF' : colors.textSecondary }]}>My Positions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.poolsList}>
        {(activeTab === 'pools' ? pools : myPositions).map(pool => (
          <View key={pool.id} style={[styles.poolCard, { backgroundColor: colors.surface }]}>
            <View style={styles.poolHeader}>
              <View style={styles.poolPair}>
                <View style={[styles.tokenBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.tokenBadgeText, { color: colors.primary }]}>{pool.token0}</Text>
                </View>
                <View style={[styles.tokenBadge, { backgroundColor: '#10B98120' }]}>
                  <Text style={[styles.tokenBadgeText, { color: '#10B981' }]}>{pool.token1}</Text>
                </View>
              </View>
              <View style={[styles.aprBadge, { backgroundColor: '#10B98115' }]}>
                <Percent size={12} color="#10B981" />
                <Text style={[styles.aprText, { color: '#10B981' }]}>{pool.apr}% APR</Text>
              </View>
            </View>

            <View style={styles.poolStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TVL</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{pool.tvl}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{pool.volume24h}</Text>
              </View>
              {pool.myLiquidity > 0 && (
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>My Share</Text>
                  <Text style={[styles.statValue, { color: colors.primary }]}>${pool.myLiquidity}</Text>
                </View>
              )}
            </View>

            {pool.myLiquidity > 0 && (
              <View style={[styles.rewardsRow, { backgroundColor: colors.background }]}>
                <View style={styles.rewardsInfo}>
                  <Coins size={14} color="#F59E0B" />
                  <Text style={[styles.rewardsText, { color: colors.text }]}>
                    Pending: <Text style={{ color: '#F59E0B' }}>${pool.rewards}</Text>
                  </Text>
                </View>
                <TouchableOpacity style={[styles.harvestBtn, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.harvestBtnText}>Harvest</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.poolActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Add</Text>
              </TouchableOpacity>
              {pool.myLiquidity > 0 && (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.background }]}>
                  <Minus size={16} color={colors.text} />
                  <Text style={[styles.actionBtnTextSecondary, { color: colors.text }]}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
        <View style={styles.infoHeader}>
          <Shield size={18} color={colors.primary} />
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Liquidity Mining Works</Text>
        </View>
        <View style={styles.infoSteps}>
          <View style={styles.infoStep}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Deposit token pairs into liquidity pools</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Earn trading fees from swaps in the pool</Text>
          </View>
          <View style={styles.infoStep}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: colors.textSecondary }]}>Receive additional reward tokens as incentives</Text>
          </View>
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
  summaryCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
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
    fontSize: 22,
    fontWeight: '700' as const,
  },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  claimBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  poolsList: {
    paddingHorizontal: 16,
  },
  poolCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  poolPair: {
    flexDirection: 'row',
    gap: 8,
  },
  tokenBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tokenBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  aprBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  aprText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  poolStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  statItem: {
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  rewardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  rewardsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardsText: {
    fontSize: 13,
  },
  harvestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  harvestBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  poolActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  actionBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoSection: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  infoSteps: {
    gap: 12,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
