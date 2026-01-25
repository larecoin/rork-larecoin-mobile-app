import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Zap, TrendingUp, TrendingDown, Info, AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface LeveragedToken {
  symbol: string;
  name: string;
  leverage: string;
  direction: 'long' | 'short';
  price: number;
  change24h: number;
  nav: number;
}

export default function LeveragedTokensScreen() {
  const { colors } = useApp();
  const [filter, setFilter] = useState<'all' | 'long' | 'short'>('all');

  const tokens: LeveragedToken[] = [
    { symbol: 'BTC3L', name: 'Bitcoin 3x Long', leverage: '3x', direction: 'long', price: 12.45, change24h: 7.35, nav: 12.42 },
    { symbol: 'BTC3S', name: 'Bitcoin 3x Short', leverage: '3x', direction: 'short', price: 0.85, change24h: -7.12, nav: 0.86 },
    { symbol: 'ETH3L', name: 'Ethereum 3x Long', leverage: '3x', direction: 'long', price: 8.92, change24h: 9.24, nav: 8.89 },
    { symbol: 'ETH3S', name: 'Ethereum 3x Short', leverage: '3x', direction: 'short', price: 1.12, change24h: -8.95, nav: 1.14 },
    { symbol: 'SOL2L', name: 'Solana 2x Long', leverage: '2x', direction: 'long', price: 5.67, change24h: -2.89, nav: 5.65 },
    { symbol: 'SOL2S', name: 'Solana 2x Short', leverage: '2x', direction: 'short', price: 3.24, change24h: 2.95, nav: 3.22 },
  ];

  const filteredTokens = filter === 'all' ? tokens : tokens.filter(t => t.direction === filter);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Zap size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Leveraged Tokens</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Pre-packaged leveraged exposure without liquidation risk
          </Text>
        </View>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720' }]}>
        <AlertTriangle size={16} color="#F59E0B" />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          Leveraged tokens are subject to volatility decay. Not suitable for long-term holding.
        </Text>
      </View>

      <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
        {(['all', 'long', 'short'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { backgroundColor: colors.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#FFFFFF' : colors.textSecondary }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tokenList}>
        {filteredTokens.map((token, index) => (
          <View key={index} style={[styles.tokenCard, { backgroundColor: colors.surface }]}>
            <View style={styles.tokenHeader}>
              <View style={styles.tokenInfo}>
                <View style={styles.tokenTitleRow}>
                  <Text style={[styles.tokenSymbol, { color: colors.text }]}>{token.symbol}</Text>
                  <View style={[styles.leverageBadge, { backgroundColor: token.direction === 'long' ? '#10B98120' : '#EF444420' }]}>
                    {token.direction === 'long' ? (
                      <TrendingUp size={12} color="#10B981" />
                    ) : (
                      <TrendingDown size={12} color="#EF4444" />
                    )}
                    <Text style={[styles.leverageText, { color: token.direction === 'long' ? '#10B981' : '#EF4444' }]}>
                      {token.leverage}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tokenName, { color: colors.textSecondary }]}>{token.name}</Text>
              </View>
              <View style={styles.tokenPricing}>
                <Text style={[styles.tokenPrice, { color: colors.text }]}>${token.price.toFixed(2)}</Text>
                <Text style={[styles.tokenChange, { color: token.change24h >= 0 ? '#10B981' : '#EF4444' }]}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </Text>
              </View>
            </View>

            <View style={[styles.navRow, { backgroundColor: colors.background }]}>
              <Text style={[styles.navLabel, { color: colors.textSecondary }]}>NAV</Text>
              <Text style={[styles.navValue, { color: colors.text }]}>${token.nav.toFixed(2)}</Text>
            </View>

            <View style={styles.tokenActions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.actionBtnText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.background }]}>
                <Text style={[styles.actionBtnTextSecondary, { color: colors.text }]}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Leveraged Tokens Work</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Provide leveraged exposure without margin or liquidation{'\n'}
            • Automatically rebalance to maintain target leverage{'\n'}
            • Subject to volatility decay over time{'\n'}
            • Best for short-term directional trades
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
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tokenList: {
    paddingHorizontal: 16,
  },
  tokenCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tokenInfo: {
    gap: 4,
  },
  tokenTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  leverageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  leverageText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  tokenName: {
    fontSize: 12,
  },
  tokenPricing: {
    alignItems: 'flex-end',
  },
  tokenPrice: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  tokenChange: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  navLabel: {
    fontSize: 12,
  },
  navValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  tokenActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  actionBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 16,
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
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 20,
  },
});
