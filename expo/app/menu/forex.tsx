import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightLeft, ChevronDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
];

const exchangeRates = [
  { pair: 'EUR/USD', rate: '1.0856', change: '+0.23%', trending: 'up' },
  { pair: 'GBP/USD', rate: '1.2734', change: '-0.12%', trending: 'down' },
  { pair: 'USD/JPY', rate: '148.52', change: '+0.45%', trending: 'up' },
  { pair: 'USD/CHF', rate: '0.8823', change: '-0.08%', trending: 'down' },
];

export default function ForexScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [amount, setAmount] = useState('1000');

  const convertedAmount = (parseFloat(amount || '0') * 1.0856).toFixed(2);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Foreign Exchange' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.converterCard, { backgroundColor: colors.surface }]}>
          <View style={styles.currencyInput}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>From</Text>
            <TouchableOpacity style={[styles.currencySelector, { backgroundColor: colors.background }]}>
              <Text style={styles.currencyFlag}>{fromCurrency.flag}</Text>
              <Text style={[styles.currencyCode, { color: colors.text }]}>{fromCurrency.code}</Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <TouchableOpacity style={[styles.swapButton, { backgroundColor: colors.primary }]}>
            <ArrowRightLeft size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.currencyInput}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>To</Text>
            <TouchableOpacity style={[styles.currencySelector, { backgroundColor: colors.background }]}>
              <Text style={styles.currencyFlag}>{toCurrency.flag}</Text>
              <Text style={[styles.currencyCode, { color: colors.text }]}>{toCurrency.code}</Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            <Text style={[styles.convertedAmount, { color: colors.primary }]}>
              {toCurrency.symbol}{convertedAmount}
            </Text>
          </View>

          <View style={[styles.rateInfo, { borderTopColor: colors.border }]}>
            <View style={styles.rateRow}>
              <Text style={[styles.rateLabel, { color: colors.textTertiary }]}>Exchange Rate</Text>
              <View style={styles.rateValue}>
                <Text style={[styles.rateText, { color: colors.text }]}>1 {fromCurrency.code} = 1.0856 {toCurrency.code}</Text>
                <RefreshCw size={14} color={colors.primary} />
              </View>
            </View>
            <View style={styles.rateRow}>
              <Text style={[styles.rateLabel, { color: colors.textTertiary }]}>Fee</Text>
              <Text style={[styles.rateText, { color: colors.text }]}>$0.00 (No fees)</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.exchangeButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.exchangeButtonText}>Exchange Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Live Rates</Text>
          <View style={[styles.ratesCard, { backgroundColor: colors.surface }]}>
            {exchangeRates.map((rate, index) => (
              <View
                key={rate.pair}
                style={[
                  styles.rateItem,
                  { borderBottomColor: colors.border },
                  index === exchangeRates.length - 1 && styles.rateItemLast,
                ]}
              >
                <Text style={[styles.ratePair, { color: colors.text }]}>{rate.pair}</Text>
                <Text style={[styles.rateValue, { color: colors.text }]}>{rate.rate}</Text>
                <View style={styles.rateChange}>
                  {rate.trending === 'up' ? (
                    <TrendingUp size={14} color={colors.success} />
                  ) : (
                    <TrendingDown size={14} color={colors.error} />
                  )}
                  <Text style={[
                    styles.rateChangeText,
                    { color: rate.trending === 'up' ? colors.success : colors.error }
                  ]}>
                    {rate.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Quick Convert</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currencies.slice(1).map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[styles.quickCard, { backgroundColor: colors.surface }]}
              >
                <Text style={styles.quickFlag}>{currency.flag}</Text>
                <Text style={[styles.quickCode, { color: colors.text }]}>{currency.code}</Text>
                <Text style={[styles.quickName, { color: colors.textTertiary }]}>{currency.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  converterCard: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
  },
  currencyInput: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 10,
  },
  currencyFlag: {
    fontSize: 20,
  },
  currencyCode: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  convertedAmount: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  rateInfo: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
    gap: 8,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 13,
  },
  rateValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  exchangeButton: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  exchangeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
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
  ratesCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  rateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  rateItemLast: {
    borderBottomWidth: 0,
  },
  ratePair: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  rateChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 12,
  },
  rateChangeText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  quickCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  quickFlag: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickCode: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  quickName: {
    fontSize: 11,
  },
});
