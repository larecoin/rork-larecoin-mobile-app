import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, BarChart3, Settings, ChevronDown, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const tradingPairs = [
  { pair: 'BTC/USDT', price: '43,256.00', change: '+2.34%', volume: '1.2B', trending: 'up' },
  { pair: 'ETH/USDT', price: '2,567.50', change: '-1.12%', volume: '890M', trending: 'down' },
  { pair: 'LRC/USDT', price: '1.52', change: '+5.67%', volume: '45M', trending: 'up' },
];

const orderTypes = ['Market', 'Limit', 'Stop-Limit', 'OCO'];

export default function AdvancedTradingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [orderType, setOrderType] = useState('Limit');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Advanced Trading' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={[styles.pairSelector, { backgroundColor: colors.surface }]}>
          <View style={styles.pairInfo}>
            <Text style={[styles.pairName, { color: colors.text }]}>{selectedPair.pair}</Text>
            <Text style={[
              styles.pairChange,
              { color: selectedPair.trending === 'up' ? colors.success : colors.error }
            ]}>
              {selectedPair.change}
            </Text>
          </View>
          <Text style={[styles.pairPrice, { color: colors.text }]}>${selectedPair.price}</Text>
          <ChevronDown size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface }]}>
          <BarChart3 size={48} color={colors.textTertiary} />
          <Text style={[styles.chartText, { color: colors.textTertiary }]}>Trading Chart</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.orderTypeRow}>
            {orderTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.orderTypeButton,
                  { backgroundColor: orderType === type ? colors.primary : colors.surface }
                ]}
                onPress={() => setOrderType(type)}
              >
                <Text style={[
                  styles.orderTypeText,
                  { color: orderType === type ? '#FFF' : colors.text }
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buySellToggle}>
          <TouchableOpacity
            style={[
              styles.buySellButton,
              { backgroundColor: orderSide === 'buy' ? colors.success : colors.surface }
            ]}
            onPress={() => setOrderSide('buy')}
          >
            <TrendingUp size={18} color={orderSide === 'buy' ? '#FFF' : colors.text} />
            <Text style={[
              styles.buySellText,
              { color: orderSide === 'buy' ? '#FFF' : colors.text }
            ]}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buySellButton,
              { backgroundColor: orderSide === 'sell' ? colors.error : colors.surface }
            ]}
            onPress={() => setOrderSide('sell')}
          >
            <TrendingDown size={18} color={orderSide === 'sell' ? '#FFF' : colors.text} />
            <Text style={[
              styles.buySellText,
              { color: orderSide === 'sell' ? '#FFF' : colors.text }
            ]}>
              Sell
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.orderForm, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Price (USDT)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={price}
              onChangeText={setPrice}
              placeholder={selectedPair.price}
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Amount (BTC)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.percentButtons}>
            {['25%', '50%', '75%', '100%'].map((pct) => (
              <TouchableOpacity
                key={pct}
                style={[styles.percentButton, { backgroundColor: colors.background }]}
              >
                <Text style={[styles.percentText, { color: colors.text }]}>{pct}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.textTertiary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>0.00 USDT</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.placeOrderButton, 
            { backgroundColor: orderSide === 'buy' ? colors.success : colors.error }
          ]}
        >
          <Text style={styles.placeOrderText}>
            {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.pair.split('/')[0]}
          </Text>
        </TouchableOpacity>

        <View style={[styles.warningCard, { backgroundColor: colors.warning + '15' }]}>
          <AlertCircle size={20} color={colors.warning} />
          <Text style={[styles.warningText, { color: colors.warning }]}>
            Trading involves risk. Only trade with funds you can afford to lose.
          </Text>
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
  pairSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  pairChange: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  pairPrice: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  chartPlaceholder: {
    marginHorizontal: 16,
    height: 200,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    marginTop: 12,
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  orderTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderTypeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  buySellToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  buySellButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buySellText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  orderForm: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  percentButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  percentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  placeOrderButton: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  warningCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
