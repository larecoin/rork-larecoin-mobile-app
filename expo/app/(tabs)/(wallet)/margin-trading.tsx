import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, Info, Scale, Percent, DollarSign } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function MarginTradingScreen() {
  const { colors } = useApp();
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState(5);
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  const currentPrice = 42150.00;
  const availableMargin = 5280.50;
  const maxLeverage = 20;

  const positions = [
    { pair: 'BTC/USDT', side: 'long', size: '$2,500', entry: 41850.00, current: 42150.00, pnl: 178.50, pnlPercent: 7.14, leverage: 5 },
    { pair: 'ETH/USDT', side: 'short', size: '$1,200', entry: 2380.00, current: 2340.50, pnl: 19.90, pnlPercent: 1.66, leverage: 3 },
  ];

  const liquidationPrice = position === 'long' 
    ? currentPrice * (1 - 1 / leverage * 0.9) 
    : currentPrice * (1 + 1 / leverage * 0.9);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.accountCard, { backgroundColor: colors.surface }]}>
        <View style={styles.accountRow}>
          <View style={styles.accountItem}>
            <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Available Margin</Text>
            <Text style={[styles.accountValue, { color: colors.text }]}>${availableMargin.toLocaleString()}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text style={[styles.accountLabel, { color: colors.textSecondary }]}>Margin Level</Text>
            <Text style={[styles.accountValue, { color: '#10B981' }]}>245%</Text>
          </View>
        </View>
        <View style={[styles.warningBanner, { backgroundColor: '#FEF3C720' }]}>
          <AlertTriangle size={16} color="#F59E0B" />
          <Text style={[styles.warningText, { color: '#F59E0B' }]}>Margin trading involves high risk</Text>
        </View>
      </View>

      <View style={[styles.tradingPanel, { backgroundColor: colors.surface }]}>
        <View style={styles.pairHeader}>
          <TouchableOpacity style={styles.pairSelector}>
            <Text style={[styles.pairName, { color: colors.text }]}>BTC/USDT</Text>
            <ChevronDown size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.currentPrice, { color: colors.text }]}>${currentPrice.toLocaleString()}</Text>
        </View>

        <View style={styles.positionToggle}>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'long' && { backgroundColor: '#10B981' }]}
            onPress={() => setPosition('long')}
          >
            <TrendingUp size={16} color={position === 'long' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'long' ? '#FFFFFF' : colors.textSecondary }]}>Long</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.positionBtn, position === 'short' && { backgroundColor: '#EF4444' }]}
            onPress={() => setPosition('short')}
          >
            <TrendingDown size={16} color={position === 'short' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.positionBtnText, { color: position === 'short' ? '#FFFFFF' : colors.textSecondary }]}>Short</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.leverageSection}>
          <View style={styles.leverageHeader}>
            <Text style={[styles.leverageLabel, { color: colors.text }]}>Leverage</Text>
            <Text style={[styles.leverageValue, { color: colors.primary }]}>{leverage}x</Text>
          </View>
          <View style={styles.leverageSlider}>
            {[1, 2, 3, 5, 10, 15, 20].map(lev => (
              <TouchableOpacity
                key={lev}
                style={[styles.leverageBtn, { backgroundColor: colors.background }, leverage === lev && { backgroundColor: colors.primary }]}
                onPress={() => setLeverage(lev)}
              >
                <Text style={[styles.leverageBtnText, { color: leverage === lev ? '#FFFFFF' : colors.textSecondary }]}>{lev}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.orderTypeToggle, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.orderTypeBtn, orderType === 'market' && { backgroundColor: colors.surface }]}
            onPress={() => setOrderType('market')}
          >
            <Text style={[styles.orderTypeText, { color: orderType === 'market' ? colors.text : colors.textSecondary }]}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.orderTypeBtn, orderType === 'limit' && { backgroundColor: colors.surface }]}
            onPress={() => setOrderType('limit')}
          >
            <Text style={[styles.orderTypeText, { color: orderType === 'limit' ? colors.text : colors.textSecondary }]}>Limit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Amount (USDT)</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <DollarSign size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.background }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Position Size</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>${amount ? (parseFloat(amount) * leverage).toFixed(2) : '0.00'}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Liquidation Price</Text>
              <Info size={12} color={colors.textTertiary} />
            </View>
            <Text style={[styles.infoValue, { color: '#EF4444' }]}>${liquidationPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Est. Fee</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>0.04%</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: position === 'long' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.submitBtnText}>Open {position === 'long' ? 'Long' : 'Short'} Position</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Open Positions</Text>
        {positions.map((pos, index) => (
          <View key={index} style={[styles.positionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.positionHeader}>
              <View style={styles.positionInfo}>
                <Text style={[styles.positionPair, { color: colors.text }]}>{pos.pair}</Text>
                <View style={[styles.sideBadge, { backgroundColor: pos.side === 'long' ? '#10B98120' : '#EF444420' }]}>
                  <Text style={[styles.sideText, { color: pos.side === 'long' ? '#10B981' : '#EF4444' }]}>
                    {pos.side.toUpperCase()} {pos.leverage}x
                  </Text>
                </View>
              </View>
              <Text style={[styles.positionSize, { color: colors.text }]}>{pos.size}</Text>
            </View>
            <View style={styles.positionDetails}>
              <View style={styles.positionDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Entry</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>${pos.entry.toLocaleString()}</Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Current</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>${pos.current.toLocaleString()}</Text>
              </View>
              <View style={styles.positionDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>PnL</Text>
                <Text style={[styles.detailValue, { color: pos.pnl >= 0 ? '#10B981' : '#EF4444' }]}>
                  {pos.pnl >= 0 ? '+' : ''}${pos.pnl} ({pos.pnlPercent}%)
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.closeBtn, { borderColor: colors.border }]}>
              <Text style={[styles.closeBtnText, { color: colors.text }]}>Close Position</Text>
            </TouchableOpacity>
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
  accountCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 14,
  },
  accountItem: {
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  tradingPanel: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  pairHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  currentPrice: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  positionToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  positionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  positionBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  leverageSection: {
    marginBottom: 16,
  },
  leverageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leverageLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  leverageValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  leverageSlider: {
    flexDirection: 'row',
    gap: 6,
  },
  leverageBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  leverageBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  orderTypeToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  orderTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  orderTypeText: {
    fontSize: 13,
    fontWeight: '500' as const,
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
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500' as const,
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
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  positionCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  positionPair: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  sideBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sideText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  positionSize: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  positionDetail: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  closeBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
