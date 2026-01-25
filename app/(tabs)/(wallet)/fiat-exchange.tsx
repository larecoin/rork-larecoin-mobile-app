import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { DollarSign, ArrowDownUp, CreditCard, Building2, ChevronDown, Shield, Clock, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function FiatExchangeScreen() {
  const { colors } = useApp();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', price: 42150.00 },
    { symbol: 'ETH', name: 'Ethereum', price: 2340.50 },
    { symbol: 'USDT', name: 'Tether', price: 1.00 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
  ];

  const fiatOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%' },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '1.0%' },
  ];

  const selectedCryptoData = cryptoOptions.find(c => c.symbol === selectedCrypto);
  const cryptoAmount = amount && selectedCryptoData ? (parseFloat(amount) / selectedCryptoData.price).toFixed(8) : '0.00000000';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.modeToggle, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.modeBtn, mode === 'buy' && { backgroundColor: '#10B981' }]}
          onPress={() => setMode('buy')}
        >
          <Text style={[styles.modeBtnText, { color: mode === 'buy' ? '#FFFFFF' : colors.textSecondary }]}>Buy Crypto</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeBtn, mode === 'sell' && { backgroundColor: '#EF4444' }]}
          onPress={() => setMode('sell')}
        >
          <Text style={[styles.modeBtnText, { color: mode === 'sell' ? '#FFFFFF' : colors.textSecondary }]}>Sell Crypto</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.exchangeCard, { backgroundColor: colors.surface }]}>
        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            {mode === 'buy' ? 'You Pay' : 'You Sell'}
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
            {mode === 'buy' ? (
              <>
                <TextInput
                  style={[styles.amountInput, { color: colors.text }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.currencySelector}>
                  <DollarSign size={18} color={colors.primary} />
                  <Text style={[styles.currencyText, { color: colors.text }]}>{selectedFiat}</Text>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={[styles.amountInput, { color: colors.text }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                />
                <TouchableOpacity style={styles.currencySelector}>
                  <Text style={[styles.currencyText, { color: colors.text }]}>{selectedCrypto}</Text>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.swapIconContainer}>
          <View style={[styles.swapIcon, { backgroundColor: colors.primary }]}>
            <ArrowDownUp size={18} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            {mode === 'buy' ? 'You Receive' : 'You Get'}
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
            {mode === 'buy' ? (
              <>
                <Text style={[styles.receiveAmount, { color: colors.text }]}>{cryptoAmount}</Text>
                <TouchableOpacity style={styles.currencySelector}>
                  <Text style={[styles.currencyText, { color: colors.text }]}>{selectedCrypto}</Text>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.receiveAmount, { color: colors.text }]}>
                  {amount && selectedCryptoData ? (parseFloat(amount) * selectedCryptoData.price).toFixed(2) : '0.00'}
                </Text>
                <TouchableOpacity style={styles.currencySelector}>
                  <DollarSign size={18} color={colors.primary} />
                  <Text style={[styles.currencyText, { color: colors.text }]}>{selectedFiat}</Text>
                  <ChevronDown size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={[styles.rateDisplay, { backgroundColor: colors.background }]}>
          <Text style={[styles.rateText, { color: colors.textSecondary }]}>
            1 {selectedCrypto} = ${selectedCryptoData?.price.toLocaleString() || '0.00'} {selectedFiat}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity 
            key={method.id}
            style={[
              styles.paymentOption, 
              { backgroundColor: colors.surface },
              paymentMethod === method.id && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '15' }]}>
              <method.icon size={20} color={colors.primary} />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
              <Text style={[styles.paymentFee, { color: colors.textSecondary }]}>Fee: {method.fee}</Text>
            </View>
            <View style={[
              styles.radioOuter, 
              { borderColor: paymentMethod === method.id ? colors.primary : colors.border }
            ]}>
              {paymentMethod === method.id && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Cryptocurrency</Text>
        <View style={styles.cryptoGrid}>
          {cryptoOptions.map(crypto => (
            <TouchableOpacity 
              key={crypto.symbol}
              style={[
                styles.cryptoOption, 
                { backgroundColor: colors.surface },
                selectedCrypto === crypto.symbol && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setSelectedCrypto(crypto.symbol)}
            >
              <Text style={[styles.cryptoSymbol, { color: colors.text }]}>{crypto.symbol}</Text>
              <Text style={[styles.cryptoPrice, { color: colors.textSecondary }]}>${crypto.price.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {amount || '0.00'} {mode === 'buy' ? selectedFiat : selectedCrypto}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Processing Fee</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {paymentMethod === 'card' ? '2.5%' : '1.0%'}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>You'll Receive</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>
            {mode === 'buy' ? `${cryptoAmount} ${selectedCrypto}` : `$${amount && selectedCryptoData ? (parseFloat(amount) * selectedCryptoData.price * 0.975).toFixed(2) : '0.00'} ${selectedFiat}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.continueBtn, { backgroundColor: colors.primary }]}>
        <Text style={styles.continueBtnText}>Continue to {mode === 'buy' ? 'Buy' : 'Sell'}</Text>
      </TouchableOpacity>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <AlertCircle size={18} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          Fiat transactions may take 1-3 business days to process depending on your payment method and bank.
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
  modeToggle: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 14,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  exchangeCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
  },
  inputSection: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  receiveAmount: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  swapIconContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateDisplay: {
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  rateText: {
    fontSize: 13,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  paymentFee: {
    fontSize: 12,
    marginTop: 2,
  },
  radioOuter: {
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
  cryptoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cryptoOption: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  cryptoPrice: {
    fontSize: 12,
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 6,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  continueBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
