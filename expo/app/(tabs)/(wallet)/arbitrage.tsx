import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Zap, TrendingUp, Clock, AlertTriangle, Bot, RefreshCw, ArrowRight, Shield, Settings } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface ArbitrageOpportunity {
  id: string;
  pair: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  estimatedProfit: number;
  volume: string;
  risk: 'low' | 'medium' | 'high';
}

export default function ArbitrageScreen() {
  const { colors } = useApp();
  const [autoMode, setAutoMode] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const opportunities: ArbitrageOpportunity[] = [
    { id: '1', pair: 'ETH/USDT', buyExchange: 'Binance', sellExchange: 'Coinbase', buyPrice: 2338.50, sellPrice: 2345.20, spread: 0.29, estimatedProfit: 12.5, volume: '$2.4M', risk: 'low' },
    { id: '2', pair: 'BTC/USDT', buyExchange: 'Kraken', sellExchange: 'Binance', buyPrice: 42100.00, sellPrice: 42180.00, spread: 0.19, estimatedProfit: 8.2, volume: '$5.8M', risk: 'low' },
    { id: '3', pair: 'SOL/USDT', buyExchange: 'Uniswap', sellExchange: 'FTX', buyPrice: 97.80, sellPrice: 99.10, spread: 1.33, estimatedProfit: 45.8, volume: '$890K', risk: 'medium' },
    { id: '4', pair: 'AVAX/USDT', buyExchange: 'Trader Joe', sellExchange: 'Binance', buyPrice: 35.20, sellPrice: 35.85, spread: 1.85, estimatedProfit: 22.4, volume: '$450K', risk: 'high' },
  ];

  const stats = {
    totalProfit: 1245.80,
    tradesExecuted: 48,
    successRate: 94.5,
    avgProfit: 25.95,
  };

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
        <View style={styles.headerTop}>
          <View style={styles.headerInfo}>
            <Zap size={22} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Arbitrage Scanner</Text>
          </View>
          <View style={styles.scanStatus}>
            {isScanning && <View style={[styles.scanDot, { backgroundColor: '#10B981' }]} />}
            <Text style={[styles.scanText, { color: isScanning ? '#10B981' : colors.textSecondary }]}>
              {isScanning ? 'Scanning' : 'Paused'}
            </Text>
          </View>
        </View>
        <View style={styles.autoModeRow}>
          <View style={styles.autoModeInfo}>
            <Bot size={18} color={colors.primary} />
            <View>
              <Text style={[styles.autoModeTitle, { color: colors.text }]}>Auto-Execute Mode</Text>
              <Text style={[styles.autoModeDesc, { color: colors.textSecondary }]}>Automatically execute profitable trades</Text>
            </View>
          </View>
          <Switch
            value={autoMode}
            onValueChange={setAutoMode}
            trackColor={{ false: colors.border, true: colors.primary + '60' }}
            thumbColor={autoMode ? colors.primary : colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Profit</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>${stats.totalProfit}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trades</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.tradesExecuted}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Success Rate</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>{stats.successRate}%</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Profit</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>${stats.avgProfit}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Opportunities</Text>
          <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: colors.surface }]}>
            <RefreshCw size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {opportunities.map(opp => (
          <View key={opp.id} style={[styles.oppCard, { backgroundColor: colors.surface }]}>
            <View style={styles.oppHeader}>
              <Text style={[styles.oppPair, { color: colors.text }]}>{opp.pair}</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(opp.risk) + '20' }]}>
                <Text style={[styles.riskText, { color: getRiskColor(opp.risk) }]}>{opp.risk} risk</Text>
              </View>
            </View>

            <View style={styles.exchangeFlow}>
              <View style={styles.exchangeInfo}>
                <Text style={[styles.exchangeLabel, { color: colors.textSecondary }]}>Buy</Text>
                <Text style={[styles.exchangeName, { color: colors.text }]}>{opp.buyExchange}</Text>
                <Text style={[styles.exchangePrice, { color: '#10B981' }]}>${opp.buyPrice.toFixed(2)}</Text>
              </View>
              <View style={[styles.flowArrow, { backgroundColor: colors.primary + '20' }]}>
                <ArrowRight size={16} color={colors.primary} />
              </View>
              <View style={styles.exchangeInfo}>
                <Text style={[styles.exchangeLabel, { color: colors.textSecondary }]}>Sell</Text>
                <Text style={[styles.exchangeName, { color: colors.text }]}>{opp.sellExchange}</Text>
                <Text style={[styles.exchangePrice, { color: '#EF4444' }]}>${opp.sellPrice.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.oppStats}>
              <View style={styles.oppStat}>
                <Text style={[styles.oppStatLabel, { color: colors.textSecondary }]}>Spread</Text>
                <Text style={[styles.oppStatValue, { color: colors.text }]}>{opp.spread}%</Text>
              </View>
              <View style={styles.oppStat}>
                <Text style={[styles.oppStatLabel, { color: colors.textSecondary }]}>Est. Profit</Text>
                <Text style={[styles.oppStatValue, { color: '#10B981' }]}>${opp.estimatedProfit}</Text>
              </View>
              <View style={styles.oppStat}>
                <Text style={[styles.oppStatLabel, { color: colors.textSecondary }]}>Volume</Text>
                <Text style={[styles.oppStatValue, { color: colors.text }]}>{opp.volume}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.executeBtn, { backgroundColor: colors.primary }]}>
              <Zap size={16} color="#FFFFFF" />
              <Text style={styles.executeBtnText}>Execute Trade</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.settingsHeader}>
          <Settings size={18} color={colors.primary} />
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Bot Settings</Text>
        </View>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Minimum Spread</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>0.15%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Max Trade Size</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>$5,000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Gas Limit</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>0.01 ETH</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B' }]}>
        <AlertTriangle size={20} color="#F59E0B" />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          <Text>Arbitrage trading involves execution risk. Prices may change before your trade completes.</Text>
        </Text>
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
    margin: 16,
    borderRadius: 20,
    padding: 18,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scanDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scanText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  autoModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoModeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  autoModeTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  autoModeDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oppCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  oppHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  oppPair: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  exchangeFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  exchangeInfo: {
    flex: 1,
    alignItems: 'center',
  },
  exchangeLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  exchangeName: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  exchangePrice: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  flowArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  oppStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 12,
  },
  oppStat: {
    alignItems: 'center',
  },
  oppStatLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  oppStatValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  executeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  executeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 14,
  },
  settingValue: {
    fontSize: 14,
  },
  warningCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
