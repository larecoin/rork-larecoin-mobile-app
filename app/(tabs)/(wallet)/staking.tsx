import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Coins, TrendingUp, Clock, Lock, Gift, ChevronRight, Info, Percent } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  tvl: string;
  lockPeriod: string;
  minStake: number;
  yourStake: number;
  rewards: number;
}

const stakingPools: StakingPool[] = [
  { id: '1', name: 'LARE Flex', token: 'LARE', apy: 8.5, tvl: '$12.4M', lockPeriod: 'Flexible', minStake: 100, yourStake: 2500, rewards: 17.85 },
  { id: '2', name: 'LARE 30-Day', token: 'LARE', apy: 12.5, tvl: '$8.2M', lockPeriod: '30 Days', minStake: 500, yourStake: 0, rewards: 0 },
  { id: '3', name: 'LARE 90-Day', token: 'LARE', apy: 18.0, tvl: '$5.6M', lockPeriod: '90 Days', minStake: 1000, yourStake: 5000, rewards: 225.0 },
  { id: '4', name: 'LUSD Stable', token: 'LUSD', apy: 6.0, tvl: '$18.9M', lockPeriod: 'Flexible', minStake: 50, yourStake: 1000, rewards: 5.0 },
  { id: '5', name: 'ETH Staking', token: 'ETH', apy: 4.2, tvl: '$45.2M', lockPeriod: 'Flexible', minStake: 0.01, yourStake: 0, rewards: 0 },
];

export default function StakingScreen() {
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'pools' | 'mystakes'>('pools');

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.yourStake, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0);

  const myStakes = stakingPools.filter(pool => pool.yourStake > 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconWrapper}>
            <Lock size={20} color="#3498DB" />
          </View>
          <Text style={styles.statLabel}>Total Staked</Text>
          <Text style={styles.statValue}>${totalStaked.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: '#2ECC7120' }]}>
            <Gift size={20} color="#2ECC71" />
          </View>
          <Text style={styles.statLabel}>Total Rewards</Text>
          <Text style={[styles.statValue, { color: '#2ECC71' }]}>${totalRewards.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pools' && styles.tabActive]}
          onPress={() => setActiveTab('pools')}
        >
          <Coins size={18} color={activeTab === 'pools' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'pools' && styles.tabTextActive]}>All Pools</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'mystakes' && styles.tabActive]}
          onPress={() => setActiveTab('mystakes')}
        >
          <TrendingUp size={18} color={activeTab === 'mystakes' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'mystakes' && styles.tabTextActive]}>My Stakes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.poolsList}>
        {(activeTab === 'pools' ? stakingPools : myStakes).map(pool => (
          <TouchableOpacity 
            key={pool.id} 
            style={styles.poolCard}
            onPress={() => setSelectedPool(pool)}
          >
            <View style={styles.poolHeader}>
              <View style={styles.poolInfo}>
                <View style={styles.poolIconWrapper}>
                  <Coins size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.poolName}>{pool.name}</Text>
                  <Text style={styles.poolToken}>{pool.token}</Text>
                </View>
              </View>
              <View style={styles.apyBadge}>
                <Percent size={12} color="#2ECC71" />
                <Text style={styles.apyText}>{pool.apy}% APY</Text>
              </View>
            </View>
            
            <View style={styles.poolDetails}>
              <View style={styles.poolDetailItem}>
                <Clock size={14} color={Colors.textSecondary} />
                <Text style={styles.poolDetailText}>{pool.lockPeriod}</Text>
              </View>
              <View style={styles.poolDetailItem}>
                <TrendingUp size={14} color={Colors.textSecondary} />
                <Text style={styles.poolDetailText}>TVL: {pool.tvl}</Text>
              </View>
            </View>

            {pool.yourStake > 0 && (
              <View style={styles.yourStakeSection}>
                <View style={styles.yourStakeInfo}>
                  <Text style={styles.yourStakeLabel}>Your Stake</Text>
                  <Text style={styles.yourStakeValue}>{pool.yourStake.toLocaleString()} {pool.token}</Text>
                </View>
                <View style={styles.yourStakeInfo}>
                  <Text style={styles.yourStakeLabel}>Rewards</Text>
                  <Text style={[styles.yourStakeValue, { color: '#2ECC71' }]}>+{pool.rewards.toFixed(2)} {pool.token}</Text>
                </View>
              </View>
            )}

            <View style={styles.poolActions}>
              <TouchableOpacity style={styles.stakeBtn}>
                <Text style={styles.stakeBtnText}>Stake</Text>
              </TouchableOpacity>
              {pool.yourStake > 0 && (
                <TouchableOpacity style={styles.unstakeBtn}>
                  <Text style={styles.unstakeBtnText}>Unstake</Text>
                </TouchableOpacity>
              )}
              {pool.rewards > 0 && (
                <TouchableOpacity style={styles.claimBtn}>
                  <Text style={styles.claimBtnText}>Claim</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>Staking Information</Text>
        </View>
        <Text style={styles.infoText}>
          Stake your tokens to earn passive rewards. Longer lock periods offer higher APY rates. 
          Rewards are calculated and distributed daily. Unstaking during lock period may incur penalties.
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
  poolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  poolIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poolName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  poolToken: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2ECC7120',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  apyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2ECC71',
  },
  poolDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  poolDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  poolDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  yourStakeSection: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  yourStakeInfo: {
    alignItems: 'center',
  },
  yourStakeLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  yourStakeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  poolActions: {
    flexDirection: 'row',
    gap: 10,
  },
  stakeBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  stakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  unstakeBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  unstakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  claimBtn: {
    flex: 1,
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  claimBtnText: {
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
