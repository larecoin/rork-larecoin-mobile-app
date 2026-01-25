import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { RefreshCw, TrendingUp, TrendingDown, Clock, Info, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function PerpetualsScreen() {
  const { colors } = useApp();
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState(10);

  const currentPrice = 42150.00;
  const fundingRate = 0.0125;
  const nextFunding = '04:32:15';

  const pairs = [
    { symbol: 'BTC-PERP', price: 42150.00, change: 2.45, volume: '$2.4B', fundingRate: 0.0125 },
    { symbol: 'ETH-PERP', price: 2340.50, change: 3.12, volume: '$1.8B', fundingRate: 0.0089 },
    { symbol: 'SOL-PERP', price: 98.75, change: -1.45, volume: '$890M', fundingRate: -0.0045 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.fundingCard, { backgroundColor: colors.surface }]}>
        <View style={styles.fundingHeader}>
          <RefreshCw size={18} color={colors.primary} />
          <Text style={[styles.fundingTitle, { color: colors.text }]}>Perpetual Swaps</Text>
        </View>
        <View style={styles.fundingInfo}>
          <View style={styles.fundingItem}>
            <Text style={[styles.fundingLabel, { color: colors.textSecondary }]}>Funding Rate</Text>
            <Text style={[styles.fundingValue, { color: fundingRate >= 0 ? '#10B981' : '#EF4444' }]}>
              {fundingRate >= 0 ? '+' : ''}{(fundingRate * 100).toFixed(4)}%
            </Text>
          </View>
          <View style={styles.fundingItem}>
            <Text style={[styles.fundingLabel, { color: colors.textSecondary }]}>Next Funding</Text>
            <View style={styles.countdownRow}>
              <Clock size={14} color={colors.primary} />
              <Text style={[styles.fundingValue, { color: colors.text }]}>{nextFunding}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.fundingNote, { backgroundColor: colors.background }]}>
          <Info size={14} color={colors.textSecondary} />
          <Text style={[styles.fundingNoteText, { color: colors.textSecondary }]}>
            {fundingRate >= 0 ? 'Longs pay shorts' : 'Shorts pay longs'} every 8 hours
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Perpetual Markets</Text>
        {pairs.map(pair => (
          <TouchableOpacity key={pair.symbol} style={[styles.pairCard, { backgroundColor: colors.surface }]}>
            <View style={styles.pairInfo}>
              <Text style={[styles.pairSymbol, { color: colors.text }]}>{pair.symbol}</Text>
              <Text style={[styles.pairVolume, { color: colors.textSecondary }]}>Vol: {pair.volume}</Text>
            </View>
            <View style={styles.pairPricing}>
              <Text style={[styles.pairPrice, { color: colors.text }]}>${pair.price.toLocaleString()}</Text>
              <View style={styles.pairMeta}>
                <Text style={[styles.pairChange, { color: pair.change >= 0 ? '#10B981' : '#EF4444' }]}>
                  {pair.change >= 0 ? '+' : ''}{pair.change}%
                </Text>
                <Text style={[styles.pairFunding, { color: pair.fundingRate >= 0 ? '#10B981' : '#EF4444' }]}>
                  {(pair.fundingRate * 100).toFixed(3)}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.tradingPanel, { backgroundColor: colors.surface }]}>
        <View style={styles.panelHeader}>
          <TouchableOpacity style={styles.pairSelector}>
            <Text style={[styles.selectedPair, { color: colors.text }]}>BTC-PERP</Text>
            <ChevronDown size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.panelPrice, { color: colors.text }]}>${currentPrice.toLocaleString()}</Text>
        </View>

        <View style={styles.positionToggle}>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'long' && { backgroundColor: '#10B981' }]}
            onPress={() => setPosition('long')}
          >
            <TrendingUp size={16} color={position === 'long' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'long' ? '#FFFFFF' : colors.textSecondary }]}>Long</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'short' && { backgroundColor: '#EF4444' }]}
            onPress={() => setPosition('short')}
          >
            <TrendingDown size={16} color={position === 'short' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'short' ? '#FFFFFF' : colors.textSecondary }]}>Short</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.leverageSection}>
          <Text style={[styles.leverageLabel, { color: colors.text }]}>Leverage: {leverage}x</Text>
          <View style={styles.leverageSlider}>
            {[1, 5, 10, 25, 50, 100].map(lev => (
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

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Size (USDT)</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Position Value</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>$0.00</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Est. Liquidation</Text>
            <Text style={[styles.infoValue, { color: '#EF4444' }]}>$0.00</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Funding (8h)</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>$0.00</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: position === 'long' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.submitBtnText}>Open {position === 'long' ? 'Long' : 'Short'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fundingCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  fundingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  fundingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  fundingItem: {
    alignItems: 'center',
    gap: 4,
  },
  fundingLabel: {
    fontSize: 11,
  },
  fundingValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fundingNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  fundingNoteText: {
    fontSize: 12,
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
  pairCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  pairInfo: {
    gap: 4,
  },
  pairSymbol: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  pairVolume: {
    fontSize: 11,
  },
  pairPricing: {
    alignItems: 'flex-end',
  },
  pairPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  pairMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  pairChange: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  pairFunding: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  tradingPanel: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pairSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedPair: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  panelPrice: {
    fontSize: 18,
    fontWeight: '600' as const,
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
    gap: 6,
  },
  leverageBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  leverageBtnText: {
    fontSize: 12,
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
  infoCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
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
});
