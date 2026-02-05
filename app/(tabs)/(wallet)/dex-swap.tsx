import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowDownUp, Settings, ChevronDown, Zap, Shield, RefreshCw, Droplets, AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function DexSwapScreen() {
  const { colors } = useApp();
  const [fromAmount, setFromAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [fromToken, setFromToken] = useState({ symbol: 'ETH', balance: 2.45 });
  const [toToken, setToToken] = useState({ symbol: 'USDC', balance: 1250.00 });

  const exchangeRate = 2340.50;
  const priceImpact = 0.12;
  const minimumReceived = fromAmount ? (parseFloat(fromAmount) * exchangeRate * (1 - parseFloat(slippage) / 100)).toFixed(2) : '0.00';

  const dexOptions = [
    { name: 'Uniswap V3', rate: 2340.50, gas: '0.0012 ETH' },
    { name: 'SushiSwap', rate: 2339.80, gas: '0.0014 ETH' },
    { name: '1inch', rate: 2341.20, gas: '0.0011 ETH' },
  ];

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <Droplets size={20} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>DEX Aggregator</Text>
        </View>
        <TouchableOpacity 
          style={[styles.settingsBtn, { backgroundColor: colors.background }]}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {showSettings && (
        <View style={[styles.settingsPanel, { backgroundColor: colors.surface }]}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>Slippage Tolerance</Text>
          <View style={styles.slippageOptions}>
            {['0.1', '0.5', '1.0'].map(value => (
              <TouchableOpacity 
                key={value}
                style={[styles.slippageBtn, { backgroundColor: colors.background }, slippage === value && { backgroundColor: colors.primary }]}
                onPress={() => setSlippage(value)}
              >
                <Text style={[styles.slippageBtnText, { color: slippage === value ? '#FFFFFF' : colors.textSecondary }]}>{value}%</Text>
              </TouchableOpacity>
            ))}
            <View style={[styles.customSlippage, { backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.slippageInput, { color: colors.text }]}
                value={slippage}
                onChangeText={setSlippage}
                keyboardType="decimal-pad"
                placeholder="Custom"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={[styles.percentSign, { color: colors.textSecondary }]}>%</Text>
            </View>
          </View>
        </View>
      )}

      <View style={[styles.swapCard, { backgroundColor: colors.surface }]}>
        <View style={styles.tokenSection}>
          <View style={styles.tokenHeader}>
            <Text style={[styles.tokenLabel, { color: colors.textSecondary }]}>You Pay</Text>
            <Text style={[styles.balanceText, { color: colors.textSecondary }]}>Balance: {fromToken.balance}</Text>
          </View>
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.tokenSelector}>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{fromToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={fromAmount}
              onChangeText={setFromAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.quickAmounts}>
            {['25%', '50%', '75%', 'MAX'].map(pct => (
              <TouchableOpacity key={pct} style={[styles.quickBtn, { backgroundColor: colors.background }]}>
                <Text style={[styles.quickBtnText, { color: colors.primary }]}>{pct}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.swapBtn, { backgroundColor: colors.primary }]} onPress={handleSwapTokens}>
          <ArrowDownUp size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.tokenSection}>
          <View style={styles.tokenHeader}>
            <Text style={[styles.tokenLabel, { color: colors.textSecondary }]}>You Receive</Text>
            <Text style={[styles.balanceText, { color: colors.textSecondary }]}>Balance: {toToken.balance}</Text>
          </View>
          <View style={[styles.tokenInputRow, { backgroundColor: colors.background }]}>
            <TouchableOpacity style={styles.tokenSelector}>
              <Text style={[styles.tokenSymbol, { color: colors.text }]}>{toToken.symbol}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.receiveAmount, { color: colors.text }]}>
              {fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>

        <View style={[styles.routeInfo, { backgroundColor: colors.background }]}>
          <View style={styles.routeHeader}>
            <RefreshCw size={14} color={colors.primary} />
            <Text style={[styles.routeTitle, { color: colors.text }]}>Best Route</Text>
          </View>
          <View style={styles.routePath}>
            <Text style={[styles.routeToken, { color: colors.text }]}>{fromToken.symbol}</Text>
            <View style={[styles.routeArrow, { backgroundColor: colors.primary }]} />
            <Text style={[styles.routeToken, { color: colors.text }]}>{toToken.symbol}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Route Comparison</Text>
        {dexOptions.map((dex, index) => (
          <View key={index} style={[styles.dexOption, { backgroundColor: colors.surface }, index === 0 && { borderColor: colors.primary, borderWidth: 2 }]}>
            <View style={styles.dexInfo}>
              <Text style={[styles.dexName, { color: colors.text }]}>{dex.name}</Text>
              {index === 0 && (
                <View style={[styles.bestBadge, { backgroundColor: '#10B98120' }]}>
                  <Text style={[styles.bestText, { color: '#10B981' }]}>Best Rate</Text>
                </View>
              )}
            </View>
            <View style={styles.dexDetails}>
              <Text style={[styles.dexRate, { color: colors.text }]}>${dex.rate.toFixed(2)}</Text>
              <Text style={[styles.dexGas, { color: colors.textSecondary }]}>Gas: {dex.gas}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Exchange Rate</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}</Text>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailLabelRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price Impact</Text>
            {priceImpact > 1 && <AlertTriangle size={12} color="#F59E0B" />}
          </View>
          <Text style={[styles.detailValue, { color: priceImpact > 1 ? '#F59E0B' : '#10B981' }]}>{priceImpact}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Minimum Received</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{minimumReceived} {toToken.symbol}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Slippage Tolerance</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{slippage}%</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.swapExecuteBtn, { backgroundColor: colors.primary }]}>
        <Zap size={18} color="#FFFFFF" />
        <Text style={styles.swapExecuteBtnText}>Swap Tokens</Text>
      </TouchableOpacity>

      <View style={[styles.securityNote, { backgroundColor: colors.surface }]}>
        <Shield size={18} color={colors.primary} />
        <Text style={[styles.securityText, { color: colors.textSecondary }]}>
          <Text>This swap is protected by MEV protection and will be executed through audited contracts.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsPanel: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  slippageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  slippageBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  slippageBtnText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  customSlippage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    flex: 1,
  },
  slippageInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
  percentSign: {
    fontSize: 14,
  },
  swapCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
  },
  tokenSection: {
    marginBottom: 8,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  balanceText: {
    fontSize: 12,
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
    gap: 6,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'right' as const,
    paddingLeft: 12,
  },
  receiveAmount: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
    textAlign: 'right' as const,
    paddingLeft: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  quickBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  routeInfo: {
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  routeTitle: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  routePath: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  routeToken: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  routeArrow: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  dexOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  dexInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dexName: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  bestBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  bestText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  dexDetails: {
    alignItems: 'flex-end',
  },
  dexRate: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  dexGas: {
    fontSize: 11,
    marginTop: 2,
  },
  detailsCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  swapExecuteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
  },
  swapExecuteBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  securityNote: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
