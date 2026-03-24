import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { BarChart3, TrendingUp, TrendingDown, Calendar, ChevronDown, Clock, AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function FuturesScreen() {
  const { colors } = useApp();
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [selectedContract, setSelectedContract] = useState('BTCUSDT-Q1');

  const contracts = [
    { id: 'BTCUSDT-Q1', name: 'BTC Q1 2025', expiry: 'Mar 28, 2025', price: 42450.00, change: 2.4, funding: 0.01 },
    { id: 'BTCUSDT-Q2', name: 'BTC Q2 2025', expiry: 'Jun 27, 2025', price: 43120.00, change: 2.8, funding: 0.02 },
    { id: 'ETHUSDT-Q1', name: 'ETH Q1 2025', expiry: 'Mar 28, 2025', price: 2420.50, change: 3.1, funding: 0.015 },
  ];

  const selectedContractData = contracts.find(c => c.id === selectedContract);

  const openPositions = [
    { contract: 'BTCUSDT-Q1', side: 'long', size: '0.5 BTC', entry: 41200, mark: 42450, pnl: 625, margin: 2060 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerLeft}>
          <BarChart3 size={22} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Futures Trading</Text>
        </View>
        <View style={[styles.warningPill, { backgroundColor: '#FEF3C720' }]}>
          <AlertTriangle size={12} color="#F59E0B" />
          <Text style={[styles.warningPillText, { color: '#F59E0B' }]}>High Risk</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Contract</Text>
        {contracts.map(contract => (
          <TouchableOpacity 
            key={contract.id}
            style={[
              styles.contractCard, 
              { backgroundColor: colors.surface },
              selectedContract === contract.id && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setSelectedContract(contract.id)}
          >
            <View style={styles.contractHeader}>
              <Text style={[styles.contractName, { color: colors.text }]}>{contract.name}</Text>
              <Text style={[styles.contractPrice, { color: colors.text }]}>${contract.price.toLocaleString()}</Text>
            </View>
            <View style={styles.contractDetails}>
              <View style={styles.contractDetail}>
                <Calendar size={12} color={colors.textSecondary} />
                <Text style={[styles.contractDetailText, { color: colors.textSecondary }]}>{contract.expiry}</Text>
              </View>
              <Text style={[styles.contractChange, { color: contract.change >= 0 ? '#10B981' : '#EF4444' }]}>
                {contract.change >= 0 ? '+' : ''}{contract.change}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.tradingPanel, { backgroundColor: colors.surface }]}>
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

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Quantity (BTC)</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Leverage</Text>
          <View style={styles.leverageOptions}>
            {[1, 5, 10, 20, 50].map(lev => (
              <TouchableOpacity key={lev} style={[styles.leverageOption, { backgroundColor: colors.background }]}>
                <Text style={[styles.leverageText, { color: colors.textSecondary }]}>{lev}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.background }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Contract</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedContractData?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expiry</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedContractData?.expiry}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Required Margin</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>$0.00</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: position === 'long' ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.submitBtnText}>Place {position === 'long' ? 'Long' : 'Short'} Order</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Open Positions</Text>
        {openPositions.map((pos, index) => (
          <View key={index} style={[styles.positionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.positionHeader}>
              <View>
                <Text style={[styles.positionContract, { color: colors.text }]}>{pos.contract}</Text>
                <View style={[styles.sideBadge, { backgroundColor: pos.side === 'long' ? '#10B98120' : '#EF444420' }]}>
                  <Text style={[styles.sideText, { color: pos.side === 'long' ? '#10B981' : '#EF4444' }]}>
                    {pos.side.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={[styles.positionPnl, { color: pos.pnl >= 0 ? '#10B981' : '#EF4444' }]}>
                {pos.pnl >= 0 ? '+' : ''}${pos.pnl}
              </Text>
            </View>
            <View style={styles.positionStats}>
              <View style={styles.positionStat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Size</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{pos.size}</Text>
              </View>
              <View style={styles.positionStat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Entry</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>${pos.entry}</Text>
              </View>
              <View style={styles.positionStat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mark</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>${pos.mark}</Text>
              </View>
            </View>
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
  warningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  warningPillText: {
    fontSize: 11,
    fontWeight: '600' as const,
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
  contractCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  contractName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  contractPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  contractDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contractDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contractDetailText: {
    fontSize: 12,
  },
  contractChange: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tradingPanel: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
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
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrapper: {
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
  },
  leverageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  leverageOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  leverageText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
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
  positionCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  positionContract: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  sideBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sideText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  positionPnl: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  positionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionStat: {
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
});
