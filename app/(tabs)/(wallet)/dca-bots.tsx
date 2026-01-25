import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Bot, Plus, Calendar, TrendingUp, Clock, Settings, Info, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface DCABot {
  id: string;
  asset: string;
  frequency: string;
  amount: number;
  totalInvested: number;
  currentValue: number;
  avgPrice: number;
  status: 'active' | 'paused';
  nextBuy: string;
  purchases: number;
}

export default function DCABotsScreen() {
  const { colors } = useApp();

  const bots: DCABot[] = [
    { id: '1', asset: 'BTC', frequency: 'Weekly', amount: 100, totalInvested: 2400, currentValue: 2680, avgPrice: 38500, status: 'active', nextBuy: 'Jan 28', purchases: 24 },
    { id: '2', asset: 'ETH', frequency: 'Daily', amount: 25, totalInvested: 750, currentValue: 820, avgPrice: 2180, status: 'active', nextBuy: 'Tomorrow', purchases: 30 },
    { id: '3', asset: 'SOL', frequency: 'Monthly', amount: 200, totalInvested: 600, currentValue: 545, avgPrice: 85, status: 'paused', nextBuy: 'Feb 1', purchases: 3 },
  ];

  const totalInvested = bots.reduce((sum, b) => sum + b.totalInvested, 0);
  const totalValue = bots.reduce((sum, b) => sum + b.currentValue, 0);
  const totalProfit = totalValue - totalInvested;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Bot size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>DCA Bots</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Dollar-cost averaging made automatic
          </Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Invested</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${totalInvested.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Current Value</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${totalValue.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total P&L</Text>
            <Text style={[styles.summaryValue, { color: totalProfit >= 0 ? '#10B981' : '#EF4444' }]}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Active Bots</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{bots.filter(b => b.status === 'active').length}</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Create DCA Strategy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>My DCA Strategies</Text>
        {bots.map(bot => (
          <View key={bot.id} style={[styles.botCard, { backgroundColor: colors.surface }]}>
            <View style={styles.botHeader}>
              <View style={styles.botInfo}>
                <Text style={[styles.botAsset, { color: colors.text }]}>{bot.asset}</Text>
                <View style={[styles.frequencyBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Calendar size={10} color={colors.primary} />
                  <Text style={[styles.frequencyText, { color: colors.primary }]}>{bot.frequency}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: bot.status === 'active' ? '#10B98120' : '#F59E0B20' }]}>
                <View style={[styles.statusDot, { backgroundColor: bot.status === 'active' ? '#10B981' : '#F59E0B' }]} />
                <Text style={[styles.statusText, { color: bot.status === 'active' ? '#10B981' : '#F59E0B' }]}>
                  {bot.status}
                </Text>
              </View>
            </View>

            <View style={styles.botStats}>
              <View style={styles.botStatRow}>
                <View style={styles.botStat}>
                  <Text style={[styles.botStatLabel, { color: colors.textSecondary }]}>Per {bot.frequency.toLowerCase().replace('ly', '')}</Text>
                  <Text style={[styles.botStatValue, { color: colors.text }]}>${bot.amount}</Text>
                </View>
                <View style={styles.botStat}>
                  <Text style={[styles.botStatLabel, { color: colors.textSecondary }]}>Total Invested</Text>
                  <Text style={[styles.botStatValue, { color: colors.text }]}>${bot.totalInvested}</Text>
                </View>
                <View style={styles.botStat}>
                  <Text style={[styles.botStatLabel, { color: colors.textSecondary }]}>Current Value</Text>
                  <Text style={[styles.botStatValue, { color: bot.currentValue >= bot.totalInvested ? '#10B981' : '#EF4444' }]}>
                    ${bot.currentValue}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.botDetails, { backgroundColor: colors.background }]}>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Avg Price</Text>
                <Text style={[styles.botDetailValue, { color: colors.text }]}>${bot.avgPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Purchases</Text>
                <Text style={[styles.botDetailValue, { color: colors.text }]}>{bot.purchases}</Text>
              </View>
              <View style={styles.botDetailItem}>
                <Text style={[styles.botDetailLabel, { color: colors.textSecondary }]}>Next Buy</Text>
                <Text style={[styles.botDetailValue, { color: colors.primary }]}>{bot.nextBuy}</Text>
              </View>
            </View>

            <View style={styles.botActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: bot.status === 'active' ? '#F59E0B' : '#10B981' }]}>
                <Text style={styles.actionBtnText}>{bot.status === 'active' ? 'Pause' : 'Resume'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.background }]}>
                <Settings size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Benefits of DCA</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Reduces impact of volatility{'\n'}
            • Removes emotional decision-making{'\n'}
            • Builds position over time{'\n'}
            • Works best for long-term investing
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  summaryItem: {
    width: '50%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
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
  botAsset: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  frequencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  frequencyText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize' as const,
  },
  botStats: {
    marginBottom: 14,
  },
  botStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botStat: {
    gap: 4,
  },
  botStatLabel: {
    fontSize: 10,
  },
  botStatValue: {
    fontSize: 14,
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
    fontWeight: '600' as const,
  },
  botActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnText: {
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 20,
  },
});
