import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Building2, Smartphone, ChevronDown, ArrowRight, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const cryptoOptions = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'lrc', name: 'Larecoin', symbol: 'LRC', icon: 'L' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '$' },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%' },
  { id: 'apple', name: 'Apple Pay', icon: Smartphone, fee: '2.0%' },
];

export default function BuyCryptoScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [amount, setAmount] = useState('100');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[2]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);

  const quickAmounts = ['50', '100', '250', '500', '1000'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Buy Crypto' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>You Pay</Text>
          <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
            <View style={styles.inputRow}>
              <Text style={[styles.currency, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={[styles.currencyLabel, { color: colors.textTertiary }]}>USD</Text>
            </View>
            <View style={styles.quickAmounts}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.quickAmount,
                    { backgroundColor: amount === amt ? colors.primary : colors.background }
                  ]}
                  onPress={() => setAmount(amt)}
                >
                  <Text style={[
                    styles.quickAmountText,
                    { color: amount === amt ? '#FFF' : colors.text }
                  ]}>
                    ${amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <View style={[styles.arrowCircle, { backgroundColor: colors.surface }]}>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>You Receive</Text>
          <TouchableOpacity style={[styles.selectCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.cryptoIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.cryptoIconText, { color: colors.primary }]}>{selectedCrypto.icon}</Text>
            </View>
            <View style={styles.cryptoInfo}>
              <Text style={[styles.cryptoName, { color: colors.text }]}>{selectedCrypto.name}</Text>
              <Text style={[styles.cryptoSymbol, { color: colors.textTertiary }]}>{selectedCrypto.symbol}</Text>
            </View>
            <ChevronDown size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.receiveAmount, { backgroundColor: colors.surface, marginTop: 12 }]}>
            <Text style={[styles.receiveLabel, { color: colors.textTertiary }]}>≈</Text>
            <Text style={[styles.receiveValue, { color: colors.text }]}>
              {(parseFloat(amount || '0') / 1.5).toFixed(4)} {selectedCrypto.symbol}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Payment Method</Text>
          <View style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  { borderBottomColor: colors.border },
                  index === paymentMethods.length - 1 && styles.paymentOptionLast,
                  selectedPayment.id === method.id && { backgroundColor: colors.primary + '10' }
                ]}
                onPress={() => setSelectedPayment(method)}
              >
                <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '15' }]}>
                  <method.icon size={20} color={colors.primary} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
                  <Text style={[styles.paymentFee, { color: colors.textTertiary }]}>Fee: {method.fee}</Text>
                </View>
                <View style={[
                  styles.radio,
                  { borderColor: selectedPayment.id === method.id ? colors.primary : colors.border }
                ]}>
                  {selectedPayment.id === method.id && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${amount || '0'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Fee ({selectedPayment.fee})</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${(parseFloat(amount || '0') * parseFloat(selectedPayment.fee) / 100).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${(parseFloat(amount || '0') * (1 + parseFloat(selectedPayment.fee) / 100)).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.primary + '10' }]}>
          <Info size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Crypto will be credited to your wallet within 5-10 minutes after payment confirmation.
          </Text>
        </View>

        <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.buyButtonText}>Buy {selectedCrypto.symbol}</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputCard: {
    padding: 16,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 32,
    fontWeight: '300' as const,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600' as const,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  quickAmount: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  cryptoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cryptoIconText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  cryptoSymbol: {
    fontSize: 13,
  },
  receiveAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  receiveLabel: {
    fontSize: 18,
  },
  receiveValue: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  paymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  paymentOptionLast: {
    borderBottomWidth: 0,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  paymentFee: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  buyButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
