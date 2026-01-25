import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Wallet, ChevronDown, Check, TrendingDown, Clock, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface WithdrawMethod {
  id: string;
  name: string;
  icon: typeof Building2;
  fee: string;
  time: string;
  color: string;
}

interface CryptoHolding {
  id: string;
  symbol: string;
  name: string;
  price: number;
  balance: number;
  icon: string;
}

const withdrawMethods: WithdrawMethod[] = [
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%', time: '1-3 days', color: '#27AE60' },
  { id: 'wallet', name: 'Convert to LUSD', icon: Wallet, fee: '0.1%', time: 'Instant', color: '#D4AF37' },
];

const cryptoHoldings: CryptoHolding[] = [
  { id: 'lare', symbol: 'LARE', name: 'LareCoin', price: 1.25, balance: 12450.75, icon: '🪙' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, balance: 0.0845, icon: '₿' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2650.00, balance: 2.5, icon: 'Ξ' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, balance: 1500.00, icon: '💵' },
  { id: 'lusd', symbol: 'LUSD', name: 'Lare USD', price: 1.00, balance: 5280.50, icon: '💎' },
];

export default function SellCrypto() {
  const router = useRouter();
  const { colors } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoHolding>(cryptoHoldings[0]);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawMethod>(withdrawMethods[0]);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [showWithdrawSelector, setShowWithdrawSelector] = useState(false);
  const [inputMode, setInputMode] = useState<'crypto' | 'usd'>('crypto');

  const numericAmount = parseFloat(amount) || 0;
  const cryptoAmount = inputMode === 'crypto' ? numericAmount : numericAmount / selectedCrypto.price;
  const usdAmount = inputMode === 'usd' ? numericAmount : numericAmount * selectedCrypto.price;
  const fee = usdAmount * (parseFloat(selectedWithdraw.fee) / 100);
  const totalReceive = usdAmount - fee;
  const maxAmount = inputMode === 'crypto' ? selectedCrypto.balance : selectedCrypto.balance * selectedCrypto.price;

  const percentages = [25, 50, 75, 100];

  const handlePercentage = (percent: number) => {
    const value = (maxAmount * percent) / 100;
    setAmount(value.toFixed(inputMode === 'crypto' ? 6 : 2));
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>I want to sell</Text>
        
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
          <View style={styles.cryptoBalance}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance</Text>
            <Text style={[styles.balanceValue, { color: colors.text }]}>{selectedCrypto.balance.toLocaleString()}</Text>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showCryptoSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {cryptoHoldings.map(crypto => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.dropdownItem,
                  selectedCrypto.id === crypto.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoSelector(false);
                  setAmount('');
                }}
              >
                <Text style={styles.cryptoIcon}>{crypto.icon}</Text>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{crypto.symbol}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    Balance: {crypto.balance.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.dropdownItemValue}>
                  <Text style={[styles.dropdownItemPrice, { color: colors.text }]}>
                    ${(crypto.balance * crypto.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    @ ${crypto.price.toLocaleString()}
                  </Text>
                </View>
                {selectedCrypto.id === crypto.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Amount</Text>
          <View style={[styles.modeToggle, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
              style={[styles.modeBtn, inputMode === 'crypto' && { backgroundColor: colors.primary }]}
              onPress={() => { setInputMode('crypto'); setAmount(''); }}
            >
              <Text style={[styles.modeBtnText, { color: inputMode === 'crypto' ? colors.background : colors.textSecondary }]}>
                {selectedCrypto.symbol}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeBtn, inputMode === 'usd' && { backgroundColor: colors.primary }]}
              onPress={() => { setInputMode('usd'); setAmount(''); }}
            >
              <Text style={[styles.modeBtnText, { color: inputMode === 'usd' ? colors.background : colors.textSecondary }]}>
                USD
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.amountInputContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>
            {inputMode === 'usd' ? '$' : selectedCrypto.icon}
          </Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.percentageRow}>
          {percentages.map(percent => (
            <TouchableOpacity
              key={percent}
              style={[styles.percentageBtn, { backgroundColor: colors.background }]}
              onPress={() => handlePercentage(percent)}
            >
              <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{percent}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {numericAmount > maxAmount && (
          <View style={[styles.warningBox, { backgroundColor: colors.error + '15' }]}>
            <AlertCircle size={16} color={colors.error} />
            <Text style={[styles.warningText, { color: colors.error }]}>Insufficient balance</Text>
          </View>
        )}

        {numericAmount > 0 && numericAmount <= maxAmount && (
          <View style={[styles.convertBox, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.convertRow}>
              <Text style={[styles.convertLabel, { color: colors.textSecondary }]}>Selling</Text>
              <Text style={[styles.convertValue, { color: colors.text }]}>
                {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
              </Text>
            </View>
            <View style={styles.convertRow}>
              <Text style={[styles.convertLabel, { color: colors.textSecondary }]}>@ Market Price</Text>
              <Text style={[styles.convertValue, { color: colors.text }]}>
                ${selectedCrypto.price.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Receive Funds Via</Text>
        
        <TouchableOpacity 
          style={[styles.paymentSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowWithdrawSelector(!showWithdrawSelector)}
        >
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIcon, { backgroundColor: selectedWithdraw.color + '20' }]}>
              <selectedWithdraw.icon size={20} color={selectedWithdraw.color} />
            </View>
            <View>
              <Text style={[styles.paymentName, { color: colors.text }]}>{selectedWithdraw.name}</Text>
              <Text style={[styles.paymentDetails, { color: colors.textSecondary }]}>
                Fee: {selectedWithdraw.fee} • {selectedWithdraw.time}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showWithdrawSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {withdrawMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.dropdownItem,
                  selectedWithdraw.id === method.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedWithdraw(method);
                  setShowWithdrawSelector(false);
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
                {selectedWithdraw.id === method.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Sale Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Sell Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Value at Market</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${usdAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Fee ({selectedWithdraw.fee})</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>-${fee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>You'll Receive</Text>
          <Text style={[styles.totalValue, { color: colors.accent }]}>${totalReceive.toFixed(2)}</Text>
        </View>

        <View style={[styles.timeInfo, { backgroundColor: colors.backgroundSecondary }]}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            Estimated arrival: {selectedWithdraw.time}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.sellButton,
          { backgroundColor: colors.error },
          (numericAmount <= 0 || numericAmount > maxAmount) && styles.sellButtonDisabled
        ]}
        disabled={numericAmount <= 0 || numericAmount > maxAmount}
      >
        <TrendingDown size={20} color="#FFFFFF" />
        <Text style={styles.sellButtonText}>
          Sell {selectedCrypto.symbol}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  cryptoBalance: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 11,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  dropdownItemValue: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  dropdownItemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  percentageRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  percentageBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  convertBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  convertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  convertLabel: {
    fontSize: 13,
  },
  convertValue: {
    fontSize: 13,
    fontWeight: '600' as const,
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
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 13,
  },
  sellButton: {
    margin: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sellButtonDisabled: {
    opacity: 0.5,
  },
  sellButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
