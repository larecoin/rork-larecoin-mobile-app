import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { TrendingUp, TrendingDown, ArrowUpDown, ChevronDown, Info, BarChart2, Clock, Percent } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export default function SpotTradingScreen() {
  const { colors } = useApp();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [limitType, setLimitType] = useState<'limit' | 'market'>('limit');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('42,150.00');
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');

  const currentPrice = 42150.00;
  const priceChange = 2.45;
  const high24h = 42890.00;
  const low24h = 41200.00;
  const volume24h = '1.2B';

  const askOrders: OrderBookEntry[] = [
    { price: 42180.50, amount: 0.125, total: 5272.56 },
    { price: 42175.00, amount: 0.089, total: 3753.58 },
    { price: 42170.25, amount: 0.234, total: 9867.84 },
    { price: 42165.00, amount: 0.156, total: 6577.74 },
    { price: 42160.50, amount: 0.312, total: 13154.08 },
  ];

  const bidOrders: OrderBookEntry[] = [
    { price: 42150.00, amount: 0.198, total: 8345.70 },
    { price: 42145.50, amount: 0.267, total: 11252.85 },
    { price: 42140.00, amount: 0.145, total: 6110.30 },
    { price: 42135.25, amount: 0.423, total: 17823.21 },
    { price: 42130.00, amount: 0.089, total: 3749.57 },
  ];

  const recentTrades = [
    { price: 42150.00, amount: 0.045, time: '12:45:32', type: 'buy' },
    { price: 42148.50, amount: 0.123, time: '12:45:28', type: 'sell' },
    { price: 42151.00, amount: 0.067, time: '12:45:25', type: 'buy' },
    { price: 42149.25, amount: 0.089, time: '12:45:21', type: 'buy' },
    { price: 42147.00, amount: 0.234, time: '12:45:18', type: 'sell' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.pairHeader, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.pairSelector}>
          <Text style={[styles.pairName, { color: colors.text }]}>{selectedPair}</Text>
          <ChevronDown size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.priceInfo}>
          <Text style={[styles.currentPrice, { color: colors.text }]}>${currentPrice.toLocaleString()}</Text>
          <View style={[styles.changeTag, { backgroundColor: priceChange >= 0 ? '#10B98120' : '#EF444420' }]}>
            {priceChange >= 0 ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />}
            <Text style={[styles.changeText, { color: priceChange >= 0 ? '#10B981' : '#EF4444' }]}>
              {priceChange >= 0 ? '+' : ''}{priceChange}%
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h High</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>${high24h.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Low</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>${low24h.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Vol</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>${volume24h}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={[styles.orderBook, { backgroundColor: colors.surface }]}>
          <View style={styles.orderBookHeader}>
            <Text style={[styles.orderBookTitle, { color: colors.text }]}>Order Book</Text>
            <Percent size={16} color={colors.textSecondary} />
          </View>
          
          <View style={styles.orderBookLabels}>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>Price (USDT)</Text>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[styles.orderLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>

          {askOrders.reverse().map((order, index) => (
            <View key={`ask-${index}`} style={styles.orderRow}>
              <Text style={[styles.orderPrice, { color: '#EF4444' }]}>{order.price.toFixed(2)}</Text>
              <Text style={[styles.orderAmount, { color: colors.text }]}>{order.amount.toFixed(4)}</Text>
              <Text style={[styles.orderTotal, { color: colors.textSecondary }]}>{order.total.toFixed(2)}</Text>
            </View>
          ))}

          <View style={[styles.spreadRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.spreadPrice, { color: colors.text }]}>${currentPrice.toLocaleString()}</Text>
            <ArrowUpDown size={14} color={colors.textSecondary} />
          </View>

          {bidOrders.map((order, index) => (
            <View key={`bid-${index}`} style={styles.orderRow}>
              <Text style={[styles.orderPrice, { color: '#10B981' }]}>{order.price.toFixed(2)}</Text>
              <Text style={[styles.orderAmount, { color: colors.text }]}>{order.amount.toFixed(4)}</Text>
              <Text style={[styles.orderTotal, { color: colors.textSecondary }]}>{order.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.tradePanel, { backgroundColor: colors.surface }]}>
          <View style={styles.orderTypeToggle}>
            <TouchableOpacity 
              style={[styles.orderTypeBtn, orderType === 'buy' && { backgroundColor: '#10B981' }]}
              onPress={() => setOrderType('buy')}
            >
              <Text style={[styles.orderTypeBtnText, { color: orderType === 'buy' ? '#FFFFFF' : colors.textSecondary }]}>Buy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.orderTypeBtn, orderType === 'sell' && { backgroundColor: '#EF4444' }]}
              onPress={() => setOrderType('sell')}
            >
              <Text style={[styles.orderTypeBtnText, { color: orderType === 'sell' ? '#FFFFFF' : colors.textSecondary }]}>Sell</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.limitToggle, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
              style={[styles.limitBtn, limitType === 'limit' && { backgroundColor: colors.surface }]}
              onPress={() => setLimitType('limit')}
            >
              <Text style={[styles.limitBtnText, { color: limitType === 'limit' ? colors.text : colors.textSecondary }]}>Limit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.limitBtn, limitType === 'market' && { backgroundColor: colors.surface }]}
              onPress={() => setLimitType('market')}
            >
              <Text style={[styles.limitBtnText, { color: limitType === 'market' ? colors.text : colors.textSecondary }]}>Market</Text>
            </TouchableOpacity>
          </View>

          {limitType === 'limit' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Price</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                />
                <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>USDT</Text>
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>BTC</Text>
            </View>
          </View>

          <View style={styles.percentButtons}>
            {['25%', '50%', '75%', '100%'].map(pct => (
              <TouchableOpacity key={pct} style={[styles.percentBtn, { backgroundColor: colors.background }]}>
                <Text style={[styles.percentBtnText, { color: colors.textSecondary }]}>{pct}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>0.00 USDT</Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: orderType === 'buy' ? '#10B981' : '#EF4444' }]}
          >
            <Text style={styles.submitBtnText}>{orderType === 'buy' ? 'Buy BTC' : 'Sell BTC'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.recentTrades, { backgroundColor: colors.surface }]}>
        <View style={styles.recentTradesHeader}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.recentTradesTitle, { color: colors.text }]}>Recent Trades</Text>
        </View>
        {recentTrades.map((trade, index) => (
          <View key={index} style={styles.tradeRow}>
            <Text style={[styles.tradePrice, { color: trade.type === 'buy' ? '#10B981' : '#EF4444' }]}>
              {trade.price.toFixed(2)}
            </Text>
            <Text style={[styles.tradeAmount, { color: colors.text }]}>{trade.amount.toFixed(4)}</Text>
            <Text style={[styles.tradeTime, { color: colors.textSecondary }]}>{trade.time}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  pairSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pairName: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  changeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  mainContent: {
    padding: 16,
    gap: 12,
  },
  orderBook: {
    borderRadius: 16,
    padding: 14,
  },
  orderBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderBookTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  orderBookLabels: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  orderLabel: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right' as const,
  },
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  orderPrice: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'right' as const,
  },
  orderAmount: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right' as const,
  },
  orderTotal: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right' as const,
  },
  spreadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  spreadPrice: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  tradePanel: {
    borderRadius: 16,
    padding: 16,
  },
  orderTypeToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  orderTypeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderTypeBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  limitToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  limitBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  limitBtnText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputSuffix: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  percentButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  percentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  percentBtnText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  recentTrades: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
  },
  recentTradesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recentTradesTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  tradeRow: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  tradePrice: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  tradeAmount: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center' as const,
  },
  tradeTime: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right' as const,
  },
});
