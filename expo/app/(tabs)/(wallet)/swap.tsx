import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowDownUp, ChevronDown, Check, RefreshCw, Info, Zap, TrendingUp, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  balance: number;
  icon: string;
}

const availableTokens: Token[] = [
  { id: 'lare', symbol: 'LARE', name: 'LareCoin', price: 1.25, balance: 12450.75, icon: '🪙' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, balance: 0.0845, icon: '₿' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2650.00, balance: 2.5, icon: 'Ξ' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, balance: 1500.00, icon: '💵' },
  { id: 'lusd', symbol: 'LUSD', name: 'Lare USD', price: 1.00, balance: 5280.50, icon: '💎' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 315.00, balance: 5.2, icon: '🔶' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 98.50, balance: 15.0, icon: '◎' },
];

export default function SwapTokens() {
  const router = useRouter();
  const { colors } = useApp();
  const [fromToken, setFromToken] = useState<Token>(availableTokens[0]);
  const [toToken, setToToken] = useState<Token>(availableTokens[4]);
  const [fromAmount, setFromAmount] = useState('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [slippage, setSlippage] = useState('0.5');

  const numericFromAmount = parseFloat(fromAmount) || 0;
  const exchangeRate = fromToken.price / toToken.price;
  const toAmount = numericFromAmount * exchangeRate;
  const fee = numericFromAmount * 0.003;
  const feeUsd = fee * fromToken.price;
  const priceImpact = numericFromAmount > 1000 ? 0.15 : numericFromAmount > 500 ? 0.08 : 0.02;

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
  };

  const handleMaxAmount = () => {
    setFromAmount(fromToken.balance.toString());
  };

  const slippageOptions = ['0.1', '0.5', '1.0'];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.swapCard, { backgroundColor: colors.surface }]}>
        <View style={styles.tokenSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>From</Text>
            <TouchableOpacity onPress={handleMaxAmount}>
              <Text style={[styles.balanceText, { color: colors.primary }]}>
                Balance: {fromToken.balance.toLocaleString()} {fromToken.symbol}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
              style={styles.tokenSelector}
              onPress={() => setShowFromSelector(!showFromSelector)}
            >
              <Text style={styles.tokenIcon}>{fromToken.icon}</Text>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{fromToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.tokenInput, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
              textAlign="right"
            />
          </View>
          
          {numericFromAmount > 0 && (
            <Text style={[styles.valueText, { color: colors.textSecondary }]}>
              ≈ ${(numericFromAmount * fromToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
          )}

          {showFromSelector && (
            <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
              {availableTokens.filter(t => t.id !== toToken.id).map(token => (
                <TouchableOpacity
                  key={token.id}
                  style={[
                    styles.dropdownItem,
                    fromToken.id === token.id && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => {
                    setFromToken(token);
                    setShowFromSelector(false);
                  }}
                >
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                  <View style={styles.dropdownItemInfo}>
                    <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{token.symbol}</Text>
                    <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                      Balance: {token.balance.toLocaleString()}
                    </Text>
                  </View>
                  {fromToken.id === token.id && <Check size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.swapButton, { backgroundColor: colors.primary }]}
          onPress={handleSwapTokens}
        >
          <ArrowDownUp size={20} color={colors.background} />
        </TouchableOpacity>

        <View style={styles.tokenSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>To</Text>
            <Text style={[styles.balanceText, { color: colors.textSecondary }]}>
              Balance: {toToken.balance.toLocaleString()} {toToken.symbol}
            </Text>
          </View>
          
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
              style={styles.tokenSelector}
              onPress={() => setShowToSelector(!showToSelector)}
            >
              <Text style={styles.tokenIcon}>{toToken.icon}</Text>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{toToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.toAmount, { color: colors.text }]}>
              {toAmount > 0 ? toAmount.toFixed(6) : '0.00'}
            </Text>
          </View>
          
          {toAmount > 0 && (
            <Text style={[styles.valueText, { color: colors.textSecondary }]}>
              ≈ ${(toAmount * toToken.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
          )}

          {showToSelector && (
            <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
              {availableTokens.filter(t => t.id !== fromToken.id).map(token => (
                <TouchableOpacity
                  key={token.id}
                  style={[
                    styles.dropdownItem,
                    toToken.id === token.id && { backgroundColor: colors.primary + '20' }
                  ]}
                  onPress={() => {
                    setToToken(token);
                    setShowToSelector(false);
                  }}
                >
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                  <View style={styles.dropdownItemInfo}>
                    <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{token.symbol}</Text>
                    <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                      Balance: {token.balance.toLocaleString()}
                    </Text>
                  </View>
                  {toToken.id === token.id && <Check size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {numericFromAmount > 0 && (
        <View style={[styles.rateCard, { backgroundColor: colors.surface }]}>
          <View style={styles.rateHeader}>
            <View style={styles.rateInfo}>
              <RefreshCw size={16} color={colors.primary} />
              <Text style={[styles.rateText, { color: colors.text }]}>
                1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}
              </Text>
            </View>
            <TouchableOpacity>
              <RefreshCw size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.settingsHeader}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Slippage Tolerance</Text>
          <Info size={16} color={colors.textSecondary} />
        </View>
        
        <View style={styles.slippageOptions}>
          {slippageOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.slippageBtn,
                { backgroundColor: colors.background },
                slippage === option && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSlippage(option)}
            >
              <Text style={[
                styles.slippageBtnText,
                { color: colors.textSecondary },
                slippage === option && { color: colors.background }
              ]}>
                {option}%
              </Text>
            </TouchableOpacity>
          ))}
          <View style={[styles.slippageCustom, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.slippageInput, { color: colors.text }]}
              placeholder="Custom"
              placeholderTextColor={colors.textTertiary}
              value={!slippageOptions.includes(slippage) ? slippage : ''}
              onChangeText={(val) => setSlippage(val)}
              keyboardType="decimal-pad"
            />
            <Text style={[styles.slippagePercent, { color: colors.textSecondary }]}>%</Text>
          </View>
        </View>
      </View>

      {numericFromAmount > 0 && (
        <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.detailsTitle, { color: colors.text }]}>Swap Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Network Fee</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {fee.toFixed(6)} {fromToken.symbol} (≈${feeUsd.toFixed(2)})
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price Impact</Text>
            <Text style={[
              styles.detailValue, 
              { color: priceImpact > 0.1 ? colors.warning : colors.accent }
            ]}>
              {priceImpact.toFixed(2)}%
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Minimum Received</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {(toAmount * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Route</Text>
            <View style={styles.routeInfo}>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {fromToken.symbol} → {toToken.symbol}
              </Text>
              <Zap size={14} color={colors.primary} />
            </View>
          </View>
        </View>
      )}

      {numericFromAmount > fromToken.balance && (
        <View style={[styles.warningCard, { backgroundColor: colors.error + '15' }]}>
          <AlertCircle size={20} color={colors.error} />
          <Text style={[styles.warningText, { color: colors.error }]}>
            Insufficient {fromToken.symbol} balance
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.swapActionButton,
          { backgroundColor: colors.primary },
          (numericFromAmount <= 0 || numericFromAmount > fromToken.balance) && styles.swapActionButtonDisabled
        ]}
        disabled={numericFromAmount <= 0 || numericFromAmount > fromToken.balance}
      >
        <RefreshCw size={20} color={colors.background} />
        <Text style={[styles.swapActionButtonText, { color: colors.background }]}>
          Swap {fromToken.symbol} for {toToken.symbol}
        </Text>
      </TouchableOpacity>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <TrendingUp size={18} color={colors.accent} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Best Rate Guaranteed</Text>
          <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
            <Text>We automatically find the best exchange rate across multiple liquidity sources.</Text>
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
    padding: 16,
  },
  tokenSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  balanceText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  tokenInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenIcon: {
    fontSize: 26,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  tokenInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    marginLeft: 12,
  },
  toAmount: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    textAlign: 'right',
  },
  valueText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
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
  rateCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
  },
  rateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  settingsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  slippageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  slippageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  slippageBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  slippageCustom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  slippageInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  slippagePercent: {
    fontSize: 13,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  swapActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 14,
  },
  swapActionButtonDisabled: {
    opacity: 0.5,
  },
  swapActionButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});
