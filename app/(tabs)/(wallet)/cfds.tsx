import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { CircleDollarSign, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function CFDsScreen() {
  const { colors } = useApp();
  const [position, setPosition] = useState<'buy' | 'sell'>('buy');
  const [leverage, setLeverage] = useState(10);

  const instruments = [
    { symbol: 'BTC/USD', price: 42150.00, change: 2.45, spread: 12.50 },
    { symbol: 'ETH/USD', price: 2340.50, change: 3.12, spread: 2.80 },
    { symbol: 'Gold', price: 2045.80, change: 0.45, spread: 0.35 },
    { symbol: 'S&P 500', price: 4892.50, change: 0.82, spread: 0.50 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <CircleDollarSign size={22} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>CFD Trading</Text>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B' }]}>
        <AlertTriangle size={18} color="#F59E0B" />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          CFDs are complex instruments with high risk of losing money rapidly due to leverage. 76% of retail accounts lose money.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Instruments</Text>
        {instruments.map((inst, index) => (
          <TouchableOpacity key={index} style={[styles.instrumentCard, { backgroundColor: colors.surface }]}>
            <View style={styles.instrumentInfo}>
              <Text style={[styles.instrumentSymbol, { color: colors.text }]}>{inst.symbol}</Text>
              <Text style={[styles.instrumentSpread, { color: colors.textSecondary }]}>Spread: {inst.spread}</Text>
            </View>
            <View style={styles.instrumentPricing}>
              <Text style={[styles.instrumentPrice, { color: colors.text }]}>${inst.price.toLocaleString()}</Text>
              <Text style={[styles.instrumentChange, { color: inst.change >= 0 ? '#10B981' : '#EF4444' }]}>
                {inst.change >= 0 ? '+' : ''}{inst.change}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.tradingPanel, { backgroundColor: colors.surface }]}>
        <View style={styles.panelHeader}>
          <TouchableOpacity style={styles.instrumentSelector}>
            <Text style={[styles.selectedInstrument, { color: colors.text }]}>BTC/USD</Text>
            <ChevronDown size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.positionToggle}>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'buy' && { backgroundColor: '#10B981' }]}
            onPress={() => setPosition('buy')}
          >
            <TrendingUp size={16} color={position === 'buy' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'buy' ? '#FFFFFF' : colors.textSecondary }]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'sell' && { backgroundColor: '#EF4444' }]}
            onPress={() => setPosition('sell')}
          >
            <TrendingDown size={16} color={position === 'sell' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'sell' ? '#FFFFFF' : colors.textSecondary }]}>Sell</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount (USD)</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.leverageSection}>
          <Text style={[styles.leverageLabel, { color: colors.text }]}>Leverage: {leverage}x</Text>
          <View style={styles.leverageSlider}>
            {[5, 10, 20, 50, 100].map(lev => (
              <TouchableOpacity
                key={lev}
                style={[styles.leverageBtn, { backgroundColor: colors.background }, leverage === lev && { backgroundColor: colors.primary }]}
                onPress={() => setLeverage(lev)}
              >
                <Text style={[styles.leverageBtnText, { color: leverage === lev ? '#FFFFFF' : colors.textSecondary }]}>{lev}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Position Size</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>$0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Required Margin</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>$0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Spread Cost</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>$0.00</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: position === 'buy' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.submitBtnText}>{position === 'buy' ? 'Buy' : 'Sell'} BTC/USD</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>What are CFDs?</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Contracts for Difference (CFDs) allow you to speculate on price movements without owning the underlying asset. You can profit from both rising and falling markets.
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
    alignItems: 'center',
    gap: 10,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  warningCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  instrumentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  instrumentInfo: {
    gap: 4,
  },
  instrumentSymbol: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  instrumentSpread: {
    fontSize: 11,
  },
  instrumentPricing: {
    alignItems: 'flex-end',
  },
  instrumentPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  instrumentChange: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  tradingPanel: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  panelHeader: {
    marginBottom: 16,
  },
  instrumentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedInstrument: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  positionToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  positionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  positionBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
  },
  leverageSection: {
    marginBottom: 14,
  },
  leverageLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 10,
  },
  leverageSlider: {
    flexDirection: 'row',
    gap: 8,
  },
  leverageBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  leverageBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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
