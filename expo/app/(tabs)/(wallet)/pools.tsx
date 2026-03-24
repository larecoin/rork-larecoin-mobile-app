import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Droplets, TrendingUp, ArrowRightLeft, Plus, Minus, Info, Percent, DollarSign, Layers } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LiquidityPool {
  id: string;
  pair: string;
  token1: string;
  token2: string;
  apr: number;
  tvl: string;
  volume24h: string;
  fee: number;
  yourLiquidity: number;
  yourShare: number;
  earnedFees: number;
}

const liquidityPools: LiquidityPool[] = [
  { id: '1', pair: 'LARE/LUSD', token1: 'LARE', token2: 'LUSD', apr: 45.5, tvl: '$8.4M', volume24h: '$1.2M', fee: 0.3, yourLiquidity: 5000, yourShare: 0.06, earnedFees: 125.50 },
  { id: '2', pair: 'LARE/ETH', token1: 'LARE', token2: 'ETH', apr: 68.2, tvl: '$12.8M', volume24h: '$3.4M', fee: 0.3, yourLiquidity: 0, yourShare: 0, earnedFees: 0 },
  { id: '3', pair: 'LUSD/USDC', token1: 'LUSD', token2: 'USDC', apr: 12.4, tvl: '$24.5M', volume24h: '$5.8M', fee: 0.05, yourLiquidity: 2500, yourShare: 0.01, earnedFees: 18.75 },
  { id: '4', pair: 'ETH/USDC', token1: 'ETH', token2: 'USDC', apr: 24.8, tvl: '$45.2M', volume24h: '$12.4M', fee: 0.3, yourLiquidity: 0, yourShare: 0, earnedFees: 0 },
  { id: '5', pair: 'LARE/BTC', token1: 'LARE', token2: 'BTC', apr: 85.6, tvl: '$3.2M', volume24h: '$890K', fee: 0.3, yourLiquidity: 1000, yourShare: 0.03, earnedFees: 45.20 },
];

export default function PoolsScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const myPools = liquidityPools.filter(p => p.yourLiquidity > 0);
  const totalLiquidity = myPools.reduce((sum, p) => sum + p.yourLiquidity, 0);
  const totalEarned = myPools.reduce((sum, p) => sum + p.earnedFees, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconWrapper}>
            <Droplets size={20} color="#3498DB" />
          </View>
          <Text style={styles.statLabel}>Your Liquidity</Text>
          <Text style={styles.statValue}>${totalLiquidity.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: '#2ECC7120' }]}>
            <DollarSign size={20} color="#2ECC71" />
          </View>
          <Text style={styles.statLabel}>Earned Fees</Text>
          <Text style={[styles.statValue, { color: '#2ECC71' }]}>${totalEarned.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Layers size={18} color={activeTab === 'all' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Pools</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Droplets size={18} color={activeTab === 'my' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>My Positions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.poolsList}>
        {(activeTab === 'all' ? liquidityPools : myPools).map(pool => (
          <View key={pool.id} style={styles.poolCard}>
            <View style={styles.poolHeader}>
              <View style={styles.poolPair}>
                <View style={styles.tokenIcons}>
                  <View style={[styles.tokenIcon, { backgroundColor: Colors.primary + '30' }]}>
                    <Text style={styles.tokenIconText}>{pool.token1.charAt(0)}</Text>
                  </View>
                  <View style={[styles.tokenIcon, styles.tokenIconOverlap, { backgroundColor: '#9B59B630' }]}>
                    <Text style={styles.tokenIconText}>{pool.token2.charAt(0)}</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.pairName}>{pool.pair}</Text>
                  <Text style={styles.feeText}>{pool.fee}% fee</Text>
                </View>
              </View>
              <View style={styles.aprBadge}>
                <Percent size={12} color="#2ECC71" />
                <Text style={styles.aprText}>{pool.apr}% APR</Text>
              </View>
            </View>

            <View style={styles.poolStats}>
              <View style={styles.poolStatItem}>
                <Text style={styles.poolStatLabel}>TVL</Text>
                <Text style={styles.poolStatValue}>{pool.tvl}</Text>
              </View>
              <View style={styles.poolStatItem}>
                <Text style={styles.poolStatLabel}>24h Volume</Text>
                <Text style={styles.poolStatValue}>{pool.volume24h}</Text>
              </View>
            </View>

            {pool.yourLiquidity > 0 && (
              <View style={styles.positionInfo}>
                <View style={styles.positionRow}>
                  <Text style={styles.positionLabel}>Your Position</Text>
                  <Text style={styles.positionValue}>${pool.yourLiquidity.toLocaleString()}</Text>
                </View>
                <View style={styles.positionRow}>
                  <Text style={styles.positionLabel}>Pool Share</Text>
                  <Text style={styles.positionValue}>{pool.yourShare.toFixed(4)}%</Text>
                </View>
                <View style={styles.positionRow}>
                  <Text style={styles.positionLabel}>Earned Fees</Text>
                  <Text style={[styles.positionValue, { color: '#2ECC71' }]}>+${pool.earnedFees.toFixed(2)}</Text>
                </View>
              </View>
            )}

            <View style={styles.poolActions}>
              <TouchableOpacity style={styles.addLiquidityBtn}>
                <Plus size={18} color={Colors.background} />
                <Text style={styles.addLiquidityText}>Add</Text>
              </TouchableOpacity>
              {pool.yourLiquidity > 0 && (
                <>
                  <TouchableOpacity style={styles.removeLiquidityBtn}>
                    <Minus size={18} color={Colors.text} />
                    <Text style={styles.removeLiquidityText}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.claimBtn}>
                    <DollarSign size={18} color={Colors.background} />
                    <Text style={styles.claimText}>Claim</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>About Liquidity Pools</Text>
        </View>
        <Text style={styles.infoText}>
          Provide liquidity to earn trading fees. When you add liquidity, you receive LP tokens 
          representing your share of the pool. APR is calculated based on trading fees and may 
          vary. Be aware of impermanent loss risks.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3498DB20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
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
  poolsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  poolCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  poolPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenIcons: {
    flexDirection: 'row',
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenIconOverlap: {
    marginLeft: -12,
  },
  tokenIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  pairName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  feeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  aprBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2ECC7120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  aprText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2ECC71',
  },
  poolStats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  poolStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  poolStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  poolStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  positionInfo: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  positionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  positionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  poolActions: {
    flexDirection: 'row',
    gap: 10,
  },
  addLiquidityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  addLiquidityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  removeLiquidityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  removeLiquidityText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  claimBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  claimText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  infoSection: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
