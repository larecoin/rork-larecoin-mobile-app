import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Sparkles, Zap, AlertTriangle, Info, ChevronDown, Code, Shield } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function FlashLoansScreen() {
  const { colors } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('USDC');

  const assets = [
    { symbol: 'USDC', available: '$125M', fee: '0.09%' },
    { symbol: 'USDT', available: '$98M', fee: '0.09%' },
    { symbol: 'DAI', available: '$45M', fee: '0.09%' },
    { symbol: 'ETH', available: '52,000 ETH', fee: '0.09%' },
    { symbol: 'WBTC', available: '1,200 WBTC', fee: '0.09%' },
  ];

  const strategies = [
    { name: 'Arbitrage', description: 'Exploit price differences across DEXs', risk: 'Medium', complexity: 'High' },
    { name: 'Liquidation', description: 'Liquidate undercollateralized positions', risk: 'Low', complexity: 'High' },
    { name: 'Collateral Swap', description: 'Swap collateral without closing position', risk: 'Low', complexity: 'Medium' },
    { name: 'Self-Liquidation', description: 'Close your own position efficiently', risk: 'Low', complexity: 'Low' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Sparkles size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Flash Loans</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            <Text>Uncollateralized loans repaid within one transaction</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B' }]}>
        <AlertTriangle size={18} color="#F59E0B" />
        <View style={styles.warningContent}>
          <Text style={[styles.warningTitle, { color: '#F59E0B' }]}>Advanced Feature</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            <Text>Flash loans require smart contract development knowledge. Entire transaction reverts if loan isn't repaid.</Text>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Liquidity</Text>
        {assets.map((asset, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.assetCard, 
              { backgroundColor: colors.surface },
              selectedAsset === asset.symbol && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setSelectedAsset(asset.symbol)}
          >
            <View style={styles.assetInfo}>
              <Text style={[styles.assetSymbol, { color: colors.text }]}>{asset.symbol}</Text>
              <Text style={[styles.assetAvailable, { color: colors.textSecondary }]}>Available: {asset.available}</Text>
            </View>
            <View style={styles.assetFee}>
              <Text style={[styles.feeLabel, { color: colors.textSecondary }]}>Fee</Text>
              <Text style={[styles.feeValue, { color: colors.primary }]}>{asset.fee}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.loanPanel, { backgroundColor: colors.surface }]}>
        <Text style={[styles.panelTitle, { color: colors.text }]}>Request Flash Loan</Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
            <View style={styles.assetSelector}>
              <Text style={[styles.selectedAsset, { color: colors.text }]}>{selectedAsset}</Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </View>
          </View>
        </View>

        <View style={[styles.feeDisplay, { backgroundColor: colors.background }]}>
          <View style={styles.feeRow}>
            <Text style={[styles.feeDisplayLabel, { color: colors.textSecondary }]}>Loan Amount</Text>
            <Text style={[styles.feeDisplayValue, { color: colors.text }]}>{amount || '0.00'} {selectedAsset}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={[styles.feeDisplayLabel, { color: colors.textSecondary }]}>Protocol Fee (0.09%)</Text>
            <Text style={[styles.feeDisplayValue, { color: colors.text }]}>
              {amount ? (parseFloat(amount) * 0.0009).toFixed(4) : '0.00'} {selectedAsset}
            </Text>
          </View>
          <View style={[styles.feeRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Must Repay</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {amount ? (parseFloat(amount) * 1.0009).toFixed(4) : '0.00'} {selectedAsset}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
          <Code size={18} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Generate Contract Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Common Strategies</Text>
        {strategies.map((strategy, index) => (
          <View key={index} style={[styles.strategyCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.strategyName, { color: colors.text }]}>{strategy.name}</Text>
            <Text style={[styles.strategyDesc, { color: colors.textSecondary }]}>{strategy.description}</Text>
            <View style={styles.strategyMeta}>
              <View style={[styles.metaBadge, { backgroundColor: strategy.risk === 'Low' ? '#10B98120' : '#F59E0B20' }]}>
                <Text style={[styles.metaText, { color: strategy.risk === 'Low' ? '#10B981' : '#F59E0B' }]}>
                  {strategy.risk} Risk
                </Text>
              </View>
              <View style={[styles.metaBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.metaText, { color: colors.primary }]}>{strategy.complexity} Complexity</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Shield size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Flash Loans Work</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Borrow any amount without collateral. The loan must be repaid within the same transaction block. If not repaid, the entire transaction reverts as if it never happened.
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  warningCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  assetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  assetInfo: {
    gap: 4,
  },
  assetSymbol: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  assetAvailable: {
    fontSize: 12,
  },
  assetFee: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 10,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  loanPanel: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  assetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectedAsset: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  feeDisplay: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  feeDisplayLabel: {
    fontSize: 13,
  },
  feeDisplayValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    marginTop: 6,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  strategyCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  strategyName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  strategyDesc: {
    fontSize: 12,
    marginBottom: 10,
  },
  strategyMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  metaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
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
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
