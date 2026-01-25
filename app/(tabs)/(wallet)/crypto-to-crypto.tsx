import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowDownUp, ChevronDown, Zap, Clock, Shield, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  price: number;
  icon: string;
}

export default function CryptoToCryptoScreen() {
  const { colors } = useApp();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>({
    symbol: 'ETH',
    name: 'Ethereum',
    balance: 2.45,
    price: 2340.50,
    icon: '⟠',
  });
  const [toToken, setToToken] = useState<Token>({
    symbol: 'SOL',
    name: 'Solana',
    balance: 0,
    price: 98.75,
    icon: '◎',
  });

  const exchangeRate = fromToken.price / toToken.price;
  const estimatedGas = 0.0012;
  const slippage = 0.5;

  const popularPairs = [
    { from: 'BTC', to: 'ETH', change: '+2.4%' },
    { from: 'ETH', to: 'SOL', change: '+5.1%' },
    { from: 'BNB', to: 'MATIC', change: '-1.2%' },
    { from: 'AVAX', to: 'ARB', change: '+3.8%' },
  ];

  const recentSwaps = [
    { from: 'ETH', to: 'BTC', amount: '0.5 ETH', time: '2 min ago', status: 'completed' },
    { from: 'SOL', to: 'USDC', amount: '10 SOL', time: '1 hour ago', status: 'completed' },
    { from: 'MATIC', to: 'ETH', amount: '500 MATIC', time: '3 hours ago', status: 'completed' },
  ];

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const calculateToAmount = (value: string) => {
    setFromAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const result = parseFloat(value) * exchangeRate;
      setToAmount(result.toFixed(6));
    } else {
      setToAmount('');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.swapCard, { backgroundColor: colors.surface }]}>
        <View style={styles.tokenSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>From</Text>
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.tokenSelector}>
              <Text style={styles.tokenIcon}>{fromToken.icon}</Text>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{fromToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={fromAmount}
              onChangeText={calculateToAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
              Balance: {fromToken.balance} {fromToken.symbol}
            </Text>
            <TouchableOpacity onPress={() => calculateToAmount(fromToken.balance.toString())}>
              <Text style={[styles.maxBtn, { color: colors.primary }]}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.swapButton, { backgroundColor: colors.primary }]} onPress={handleSwapTokens}>
          <ArrowDownUp size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.tokenSection}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>To</Text>
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.tokenSelector}>
              <Text style={styles.tokenIcon}>{toToken.icon}</Text>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{toToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={toAmount}
              editable={false}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
            Balance: {toToken.balance} {toToken.symbol}
          </Text>
        </View>

        <View style={[styles.rateInfo, { backgroundColor: colors.background }]}>
          <View style={styles.rateRow}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Exchange Rate</Text>
            <Text style={[styles.rateValue, { color: colors.text }]}>
              1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}
            </Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Est. Gas Fee</Text>
            <Text style={[styles.rateValue, { color: colors.text }]}>{estimatedGas} ETH</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>Slippage</Text>
            <Text style={[styles.rateValue, { color: colors.text }]}>{slippage}%</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.executeBtn, { backgroundColor: colors.primary }]}>
          <Zap size={18} color="#FFFFFF" />
          <Text style={styles.executeBtnText}>Swap Tokens</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Pairs</Text>
        <View style={styles.pairsGrid}>
          {popularPairs.map((pair, index) => (
            <TouchableOpacity key={index} style={[styles.pairCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.pairText, { color: colors.text }]}>{pair.from}/{pair.to}</Text>
              <Text style={[styles.pairChange, { color: pair.change.startsWith('+') ? '#10B981' : '#EF4444' }]}>
                {pair.change}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Swaps</Text>
        </View>
        {recentSwaps.map((swap, index) => (
          <View key={index} style={[styles.swapItem, { backgroundColor: colors.surface }]}>
            <View style={styles.swapInfo}>
              <Text style={[styles.swapPair, { color: colors.text }]}>{swap.from} → {swap.to}</Text>
              <Text style={[styles.swapAmount, { color: colors.textSecondary }]}>{swap.amount}</Text>
            </View>
            <View style={styles.swapMeta}>
              <Text style={[styles.swapTime, { color: colors.textSecondary }]}>{swap.time}</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                <Text style={[styles.statusText, { color: '#10B981' }]}>{swap.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Shield size={20} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Secure Swaps</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            All swaps are executed through audited smart contracts with MEV protection.
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
  swapCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  tokenSection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  tokenInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  tokenIcon: {
    fontSize: 24,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'right' as const,
    paddingLeft: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  balanceText: {
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  maxBtn: {
    fontSize: 12,
    fontWeight: '600' as const,
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
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateLabel: {
    fontSize: 13,
  },
  rateValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  executeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  executeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  pairsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pairCard: {
    width: '48%',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pairText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  pairChange: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  swapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  swapInfo: {
    gap: 4,
  },
  swapPair: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  swapAmount: {
    fontSize: 12,
  },
  swapMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  swapTime: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500' as const,
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
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
