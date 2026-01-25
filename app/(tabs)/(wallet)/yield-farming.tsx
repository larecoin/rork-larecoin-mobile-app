import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Leaf, TrendingUp, Clock, Shield, Zap, ChevronRight, AlertCircle, Coins, Lock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Farm {
  id: string;
  name: string;
  protocol: string;
  asset: string;
  tvl: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  lockPeriod: string;
  myDeposit: number;
  earned: number;
}

export default function YieldFarmingScreen() {
  const { colors } = useApp();
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const farms: Farm[] = [
    { id: '1', name: 'ETH-USDC LP', protocol: 'Uniswap', asset: 'LP Token', tvl: '$125M', apy: 18.5, risk: 'low', lockPeriod: 'None', myDeposit: 5000, earned: 125 },
    { id: '2', name: 'LARE Staking', protocol: 'Larecoin', asset: 'LARE', tvl: '$45M', apy: 45.2, risk: 'medium', lockPeriod: '30 days', myDeposit: 2500, earned: 89 },
    { id: '3', name: 'BTC-ETH LP', protocol: 'Curve', asset: 'LP Token', tvl: '$89M', apy: 12.8, risk: 'low', lockPeriod: 'None', myDeposit: 0, earned: 0 },
    { id: '4', name: 'SOL Yield', protocol: 'Marinade', asset: 'mSOL', tvl: '$234M', apy: 68.5, risk: 'high', lockPeriod: '7 days', myDeposit: 1000, earned: 45 },
    { id: '5', name: 'Stable Farm', protocol: 'Aave', asset: 'USDC', tvl: '$890M', apy: 8.2, risk: 'low', lockPeriod: 'None', myDeposit: 0, earned: 0 },
  ];

  const filteredFarms = selectedRisk === 'all' ? farms : farms.filter(f => f.risk === selectedRisk);
  const totalDeposited = farms.reduce((sum, f) => sum + f.myDeposit, 0);
  const totalEarned = farms.reduce((sum, f) => sum + f.earned, 0);

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
      <View style={[styles.portfolioCard, { backgroundColor: colors.surface }]}>
        <View style={styles.portfolioHeader}>
          <Leaf size={22} color={colors.primary} />
          <Text style={[styles.portfolioTitle, { color: colors.text }]}>My Yield Portfolio</Text>
        </View>
        <View style={styles.portfolioStats}>
          <View style={styles.portfolioStat}>
            <Text style={[styles.portfolioStatLabel, { color: colors.textSecondary }]}>Total Deposited</Text>
            <Text style={[styles.portfolioStatValue, { color: colors.text }]}>${totalDeposited.toLocaleString()}</Text>
          </View>
          <View style={[styles.portfolioDivider, { backgroundColor: colors.border }]} />
          <View style={styles.portfolioStat}>
            <Text style={[styles.portfolioStatLabel, { color: colors.textSecondary }]}>Total Earned</Text>
            <Text style={[styles.portfolioStatValue, { color: '#10B981' }]}>${totalEarned.toFixed(2)}</Text>
          </View>
        </View>
        <View style={[styles.apyHighlight, { backgroundColor: colors.primary + '15' }]}>
          <TrendingUp size={16} color={colors.primary} />
          <Text style={[styles.apyHighlightText, { color: colors.primary }]}>
            Average APY: 32.4%
          </Text>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={[styles.filterLabel, { color: colors.text }]}>Risk Level</Text>
        <View style={styles.filterOptions}>
          {(['all', 'low', 'medium', 'high'] as const).map(risk => (
            <TouchableOpacity
              key={risk}
              style={[
                styles.filterBtn,
                { backgroundColor: colors.surface },
                selectedRisk === risk && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedRisk(risk)}
            >
              <Text style={[
                styles.filterBtnText,
                { color: selectedRisk === risk ? '#FFFFFF' : colors.textSecondary }
              ]}>
                {risk.charAt(0).toUpperCase() + risk.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.farmsList}>
        {filteredFarms.map(farm => (
          <View key={farm.id} style={[styles.farmCard, { backgroundColor: colors.surface }]}>
            <View style={styles.farmHeader}>
              <View style={styles.farmInfo}>
                <Text style={[styles.farmName, { color: colors.text }]}>{farm.name}</Text>
                <Text style={[styles.farmProtocol, { color: colors.textSecondary }]}>{farm.protocol}</Text>
              </View>
              <View style={styles.farmApyContainer}>
                <Text style={[styles.farmApyLabel, { color: colors.textSecondary }]}>APY</Text>
                <Text style={[styles.farmApy, { color: '#10B981' }]}>{farm.apy}%</Text>
              </View>
            </View>

            <View style={styles.farmDetails}>
              <View style={styles.farmDetailItem}>
                <Text style={[styles.farmDetailLabel, { color: colors.textSecondary }]}>TVL</Text>
                <Text style={[styles.farmDetailValue, { color: colors.text }]}>{farm.tvl}</Text>
              </View>
              <View style={styles.farmDetailItem}>
                <Text style={[styles.farmDetailLabel, { color: colors.textSecondary }]}>Risk</Text>
                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(farm.risk) + '20' }]}>
                  <Text style={[styles.riskText, { color: getRiskColor(farm.risk) }]}>{farm.risk}</Text>
                </View>
              </View>
              <View style={styles.farmDetailItem}>
                <Text style={[styles.farmDetailLabel, { color: colors.textSecondary }]}>Lock</Text>
                <View style={styles.lockInfo}>
                  {farm.lockPeriod !== 'None' && <Lock size={12} color={colors.textSecondary} />}
                  <Text style={[styles.farmDetailValue, { color: colors.text }]}>{farm.lockPeriod}</Text>
                </View>
              </View>
            </View>

            {farm.myDeposit > 0 && (
              <View style={[styles.myPosition, { backgroundColor: colors.background }]}>
                <View style={styles.positionInfo}>
                  <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>My Deposit</Text>
                  <Text style={[styles.positionValue, { color: colors.text }]}>${farm.myDeposit}</Text>
                </View>
                <View style={styles.positionInfo}>
                  <Text style={[styles.positionLabel, { color: colors.textSecondary }]}>Earned</Text>
                  <Text style={[styles.positionValue, { color: '#10B981' }]}>${farm.earned}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={[styles.farmBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.farmBtnText}>{farm.myDeposit > 0 ? 'Manage Position' : 'Start Farming'}</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B' }]}>
        <AlertCircle size={20} color="#F59E0B" />
        <View style={styles.warningContent}>
          <Text style={[styles.warningTitle, { color: '#F59E0B' }]}>Risk Warning</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Yield farming involves risks including impermanent loss and smart contract vulnerabilities. Only invest what you can afford to lose.
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
  portfolioCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  portfolioTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  portfolioStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  portfolioStat: {
    flex: 1,
    alignItems: 'center',
  },
  portfolioDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  portfolioStatLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  portfolioStatValue: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  apyHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  apyHighlightText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  farmsList: {
    paddingHorizontal: 16,
  },
  farmCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  farmInfo: {
    gap: 4,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  farmProtocol: {
    fontSize: 12,
  },
  farmApyContainer: {
    alignItems: 'flex-end',
  },
  farmApyLabel: {
    fontSize: 11,
  },
  farmApy: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  farmDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  farmDetailItem: {
    gap: 4,
  },
  farmDetailLabel: {
    fontSize: 11,
  },
  farmDetailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  myPosition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  positionInfo: {
    alignItems: 'center',
    gap: 4,
  },
  positionLabel: {
    fontSize: 11,
  },
  positionValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  farmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  farmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  warningCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
