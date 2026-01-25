import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Building2, Wallet, ChevronDown, ChevronRight, Check, Info, ShieldCheck, Zap } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: typeof CreditCard;
  fee: string;
  time: string;
  color: string;
}

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
  price: number;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%', time: 'Instant', color: '#3498DB' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%', time: '1-3 days', color: '#27AE60' },
  { id: 'wallet', name: 'Wallet Balance (LUSD)', icon: Wallet, fee: '0%', time: 'Instant', color: '#D4AF37' },
];

const cryptoOptions: CryptoOption[] = [
  { id: 'lare', symbol: 'LARE', name: 'LareCoin', price: 1.25, icon: '🪙' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, icon: '₿' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2650.00, icon: 'Ξ' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, icon: '💵' },
  { id: 'lusd', symbol: 'LUSD', name: 'Lare USD', price: 1.00, icon: '💎' },
];

export default function BuyCrypto() {
  const router = useRouter();
  const { colors } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentMethods[0]);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const fee = selectedPayment.id === 'wallet' ? 0 : numericAmount * (parseFloat(selectedPayment.fee) / 100);
  const totalCost = numericAmount + fee;
  const cryptoAmount = numericAmount / selectedCrypto.price;

  const quickAmounts = [50, 100, 250, 500, 1000];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>I want to buy</Text>
        
        <TouchableOpacity 
          style={[styles.cryptoSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowCryptoSelector(!showCryptoSelector)}
        >
          <View style={styles.cryptoInfo}>
            <Text style={styles.cryptoIcon}>{selectedCrypto.icon}</Text>
            <View>
              <Text style={[styles.cryptoSymbol, { color: colors.text }]}>{selectedCrypto.symbol}</Text>
              <Text style={[styles.cryptoName, { color: colors.textSecondary }]}>{selectedCrypto.name}</Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showCryptoSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {cryptoOptions.map(crypto => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.dropdownItem,
                  selectedCrypto.id === crypto.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoSelector(false);
                }}
              >
                <Text style={styles.cryptoIcon}>{crypto.icon}</Text>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{crypto.symbol}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>{crypto.name}</Text>
                </View>
                <Text style={[styles.dropdownItemPrice, { color: colors.textSecondary }]}>${crypto.price.toLocaleString()}</Text>
                {selectedCrypto.id === crypto.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Amount (USD)</Text>
        
        <View style={[styles.amountInputContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map(quickAmount => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountBtn,
                { backgroundColor: colors.background },
                amount === quickAmount.toString() && { backgroundColor: colors.primary }
              ]}
              onPress={() => setAmount(quickAmount.toString())}
            >
              <Text style={[
                styles.quickAmountText,
                { color: colors.textSecondary },
                amount === quickAmount.toString() && { color: colors.background }
              ]}>
                ${quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {numericAmount > 0 && (
          <View style={[styles.receiveBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.receiveLabel, { color: colors.textSecondary }]}>You will receive approximately</Text>
            <Text style={[styles.receiveAmount, { color: colors.text }]}>
              {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method</Text>
        
        <TouchableOpacity 
          style={[styles.paymentSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowPaymentSelector(!showPaymentSelector)}
        >
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIcon, { backgroundColor: selectedPayment.color + '20' }]}>
              <selectedPayment.icon size={20} color={selectedPayment.color} />
            </View>
            <View>
              <Text style={[styles.paymentName, { color: colors.text }]}>{selectedPayment.name}</Text>
              <Text style={[styles.paymentDetails, { color: colors.textSecondary }]}>
                Fee: {selectedPayment.fee} • {selectedPayment.time}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showPaymentSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.dropdownItem,
                  selectedPayment.id === method.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedPayment(method);
                  setShowPaymentSelector(false);
                }}
              >
                <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                  <method.icon size={18} color={method.color} />
                </View>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{method.name}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    Fee: {method.fee} • {method.time}
                  </Text>
                </View>
                {selectedPayment.id === method.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${numericAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Fee ({selectedPayment.fee})</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${fee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>${totalCost.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
          <ShieldCheck size={20} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Secure & encrypted transactions</Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
          <Zap size={20} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Instant delivery to your wallet</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.buyButton,
          { backgroundColor: colors.primary },
          numericAmount <= 0 && styles.buyButtonDisabled
        ]}
        disabled={numericAmount <= 0}
      >
        <Text style={[styles.buyButtonText, { color: colors.background }]}>
          Buy {selectedCrypto.symbol}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cryptoIcon: {
    fontSize: 28,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  cryptoName: {
    fontSize: 13,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  dropdownItemInfo: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  dropdownItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownItemPrice: {
    fontSize: 13,
    marginRight: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700' as const,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  receiveBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  receiveLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  receiveAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  paymentDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 16,
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
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  infoSection: {
    marginHorizontal: 16,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
  },
  buyButton: {
    margin: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
