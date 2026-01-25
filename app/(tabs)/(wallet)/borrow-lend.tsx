import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { HandCoins, TrendingUp, TrendingDown, Percent, Shield, Info, AlertTriangle, DollarSign, Clock, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LendingPool {
  id: string;
  token: string;
  supplyApy: number;
  borrowApy: number;
  totalSupply: string;
  totalBorrowed: string;
  utilization: number;
  yourSupply: number;
  yourBorrow: number;
  collateralFactor: number;
}

interface Position {
  id: string;
  type: 'supply' | 'borrow';
  token: string;
  amount: number;
  apy: number;
  value: number;
}

const lendingPools: LendingPool[] = [
  { id: '1', token: 'LARE', supplyApy: 5.2, borrowApy: 8.5, totalSupply: '$12.4M', totalBorrowed: '$8.2M', utilization: 66, yourSupply: 5000, yourBorrow: 0, collateralFactor: 75 },
  { id: '2', token: 'LUSD', supplyApy: 8.5, borrowApy: 12.0, totalSupply: '$24.8M', totalBorrowed: '$18.6M', utilization: 75, yourSupply: 2000, yourBorrow: 1000, collateralFactor: 85 },
  { id: '3', token: 'ETH', supplyApy: 3.2, borrowApy: 5.8, totalSupply: '$45.2M', totalBorrowed: '$28.4M', utilization: 63, yourSupply: 0, yourBorrow: 0, collateralFactor: 80 },
  { id: '4', token: 'USDC', supplyApy: 6.8, borrowApy: 9.5, totalSupply: '$38.9M', totalBorrowed: '$31.2M', utilization: 80, yourSupply: 0, yourBorrow: 0, collateralFactor: 90 },
];

export default function BorrowLendScreen() {
  const [activeTab, setActiveTab] = useState<'lend' | 'borrow' | 'positions'>('lend');
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null);
  const [amount, setAmount] = useState('');

  const totalSupplied = lendingPools.reduce((sum, p) => sum + p.yourSupply, 0);
  const totalBorrowed = lendingPools.reduce((sum, p) => sum + p.yourBorrow, 0);
  const healthFactor = totalBorrowed > 0 ? ((totalSupplied * 0.75) / totalBorrowed).toFixed(2) : '∞';

  const myPositions: Position[] = lendingPools
    .filter(p => p.yourSupply > 0 || p.yourBorrow > 0)
    .flatMap(p => {
      const positions: Position[] = [];
      if (p.yourSupply > 0) {
        positions.push({ id: `${p.id}-supply`, type: 'supply', token: p.token, amount: p.yourSupply, apy: p.supplyApy, value: p.yourSupply });
      }
      if (p.yourBorrow > 0) {
        positions.push({ id: `${p.id}-borrow`, type: 'borrow', token: p.token, amount: p.yourBorrow, apy: p.borrowApy, value: p.yourBorrow });
      }
      return positions;
    });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <HandCoins size={32} color="#8E44AD" />
        </View>
        <Text style={styles.title}>Borrow & Lend</Text>
        <Text style={styles.subtitle}>Supply assets to earn interest or borrow against collateral</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#2ECC71" />
          <Text style={styles.statLabel}>Total Supplied</Text>
          <Text style={styles.statValue}>${totalSupplied.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingDown size={20} color="#E74C3C" />
          <Text style={styles.statLabel}>Total Borrowed</Text>
          <Text style={styles.statValue}>${totalBorrowed.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.healthSection}>
        <View style={styles.healthHeader}>
          <Shield size={18} color={parseFloat(healthFactor) > 1.5 ? '#2ECC71' : '#F39C12'} />
          <Text style={styles.healthLabel}>Health Factor</Text>
        </View>
        <Text style={[styles.healthValue, { color: parseFloat(healthFactor) > 1.5 ? '#2ECC71' : '#F39C12' }]}>
          {healthFactor}
        </Text>
        <View style={styles.healthBar}>
          <View style={[styles.healthFill, { 
            width: healthFactor === '∞' ? '100%' : `${Math.min(parseFloat(healthFactor) * 50, 100)}%`,
            backgroundColor: parseFloat(healthFactor) > 1.5 ? '#2ECC71' : '#F39C12'
          }]} />
        </View>
        <Text style={styles.healthDesc}>
          {healthFactor === '∞' ? 'No active borrows' : parseFloat(healthFactor) > 1.5 ? 'Safe' : 'At risk of liquidation'}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lend' && styles.tabActive]}
          onPress={() => setActiveTab('lend')}
        >
          <TrendingUp size={18} color={activeTab === 'lend' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'lend' && styles.tabTextActive]}>Lend</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'borrow' && styles.tabActive]}
          onPress={() => setActiveTab('borrow')}
        >
          <TrendingDown size={18} color={activeTab === 'borrow' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'borrow' && styles.tabTextActive]}>Borrow</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'positions' && styles.tabActive]}
          onPress={() => setActiveTab('positions')}
        >
          <DollarSign size={18} color={activeTab === 'positions' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'positions' && styles.tabTextActive]}>Positions</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'positions' ? (
        <View style={styles.positionsList}>
          {myPositions.length === 0 ? (
            <View style={styles.emptyState}>
              <HandCoins size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No active positions</Text>
              <Text style={styles.emptySubtext}>Supply or borrow assets to get started</Text>
            </View>
          ) : (
            myPositions.map(position => (
              <View key={position.id} style={styles.positionCard}>
                <View style={[styles.positionIcon, { backgroundColor: position.type === 'supply' ? '#2ECC7120' : '#E74C3C20' }]}>
                  {position.type === 'supply' ? (
                    <TrendingUp size={20} color="#2ECC71" />
                  ) : (
                    <TrendingDown size={20} color="#E74C3C" />
                  )}
                </View>
                <View style={styles.positionInfo}>
                  <Text style={styles.positionToken}>{position.token}</Text>
                  <Text style={styles.positionType}>
                    {position.type === 'supply' ? 'Supplied' : 'Borrowed'}
                  </Text>
                </View>
                <View style={styles.positionValues}>
                  <Text style={styles.positionAmount}>{position.amount.toLocaleString()} {position.token}</Text>
                  <Text style={[styles.positionApy, { color: position.type === 'supply' ? '#2ECC71' : '#E74C3C' }]}>
                    {position.type === 'supply' ? '+' : '-'}{position.apy}% APY
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      ) : (
        <View style={styles.poolsList}>
          {lendingPools.map(pool => (
            <View key={pool.id} style={styles.poolCard}>
              <View style={styles.poolHeader}>
                <View style={styles.poolTokenInfo}>
                  <View style={styles.poolIcon}>
                    <Text style={styles.poolIconText}>{pool.token.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.poolToken}>{pool.token}</Text>
                    <Text style={styles.poolCollateral}>Collateral: {pool.collateralFactor}%</Text>
                  </View>
                </View>
                <View style={styles.apyBadge}>
                  <Percent size={12} color={activeTab === 'lend' ? '#2ECC71' : '#E74C3C'} />
                  <Text style={[styles.apyText, { color: activeTab === 'lend' ? '#2ECC71' : '#E74C3C' }]}>
                    {activeTab === 'lend' ? pool.supplyApy : pool.borrowApy}% APY
                  </Text>
                </View>
              </View>

              <View style={styles.poolStats}>
                <View style={styles.poolStatItem}>
                  <Text style={styles.poolStatLabel}>Total {activeTab === 'lend' ? 'Supply' : 'Available'}</Text>
                  <Text style={styles.poolStatValue}>
                    {activeTab === 'lend' ? pool.totalSupply : pool.totalSupply}
                  </Text>
                </View>
                <View style={styles.poolStatItem}>
                  <Text style={styles.poolStatLabel}>Utilization</Text>
                  <Text style={styles.poolStatValue}>{pool.utilization}%</Text>
                </View>
              </View>

              {((activeTab === 'lend' && pool.yourSupply > 0) || (activeTab === 'borrow' && pool.yourBorrow > 0)) && (
                <View style={styles.yourPosition}>
                  <Text style={styles.yourPositionLabel}>
                    Your {activeTab === 'lend' ? 'Supply' : 'Borrow'}
                  </Text>
                  <Text style={styles.yourPositionValue}>
                    {(activeTab === 'lend' ? pool.yourSupply : pool.yourBorrow).toLocaleString()} {pool.token}
                  </Text>
                </View>
              )}

              <View style={styles.poolActions}>
                <TouchableOpacity style={[styles.actionBtn, activeTab === 'borrow' && styles.actionBtnBorrow]}>
                  <Text style={styles.actionBtnText}>
                    {activeTab === 'lend' ? 'Supply' : 'Borrow'}
                  </Text>
                </TouchableOpacity>
                {((activeTab === 'lend' && pool.yourSupply > 0) || (activeTab === 'borrow' && pool.yourBorrow > 0)) && (
                  <TouchableOpacity style={styles.withdrawBtn}>
                    <Text style={styles.withdrawBtnText}>
                      {activeTab === 'lend' ? 'Withdraw' : 'Repay'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.warningSection}>
        <AlertTriangle size={18} color="#F39C12" />
        <Text style={styles.warningText}>
          Borrowing carries liquidation risk. If your health factor drops below 1, your collateral may be liquidated.
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>How It Works</Text>
        </View>
        <Text style={styles.infoText}>
          <Text style={{ fontWeight: '600' as const }}>Lending:</Text> Supply assets to earn interest. Your supplied assets serve as collateral.{'\n\n'}
          <Text style={{ fontWeight: '600' as const }}>Borrowing:</Text> Borrow against your supplied collateral. Interest accrues over time.{'\n\n'}
          <Text style={{ fontWeight: '600' as const }}>Health Factor:</Text> Keep it above 1 to avoid liquidation. Higher is safer.
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
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#8E44AD20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  healthSection: {
    marginHorizontal: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  healthValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  healthBar: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    marginBottom: 8,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
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
    gap: 6,
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
  poolTokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  poolIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poolIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  poolToken: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  poolCollateral: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  apyText: {
    fontSize: 14,
    fontWeight: '700',
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
  yourPosition: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yourPositionLabel: {
    fontSize: 13,
    color: Colors.primary,
  },
  yourPositionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  poolActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  actionBtnBorrow: {
    backgroundColor: '#E74C3C',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.background,
  },
  withdrawBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  withdrawBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  positionsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyState: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
  },
  positionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionInfo: {
    flex: 1,
  },
  positionToken: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  positionType: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  positionValues: {
    alignItems: 'flex-end',
  },
  positionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  positionApy: {
    fontSize: 13,
    fontWeight: '600',
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 20,
    padding: 16,
    backgroundColor: '#F39C1210',
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#F39C12',
    lineHeight: 20,
  },
  infoSection: {
    marginHorizontal: 20,
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
