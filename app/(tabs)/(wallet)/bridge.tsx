import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { GitBranch, ArrowDown, Clock, Shield, ChevronDown, Check, Info, AlertTriangle, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Network {
  id: string;
  name: string;
  symbol: string;
  color: string;
  fee: number;
  time: string;
}

interface BridgeHistory {
  id: string;
  fromNetwork: string;
  toNetwork: string;
  token: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  txHash: string;
}

const networks: Network[] = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', fee: 0.005, time: '~15 min' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5', fee: 0.001, time: '~5 min' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0', fee: 0.002, time: '~10 min' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP', color: '#FF0420', fee: 0.002, time: '~10 min' },
  { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', color: '#F3BA2F', fee: 0.001, time: '~3 min' },
  { id: 'lare', name: 'LARE Chain', symbol: 'LARE', color: Colors.primary, fee: 0, time: '~1 min' },
];

const bridgeHistory: BridgeHistory[] = [
  { id: '1', fromNetwork: 'Ethereum', toNetwork: 'LARE Chain', token: 'USDC', amount: 500, status: 'completed', timestamp: '2h ago', txHash: '0x1a2b...3c4d' },
  { id: '2', fromNetwork: 'Polygon', toNetwork: 'Ethereum', token: 'MATIC', amount: 100, status: 'pending', timestamp: '30m ago', txHash: '0x5e6f...7g8h' },
];

export default function BridgeScreen() {
  const [fromNetwork, setFromNetwork] = useState<Network>(networks[0]);
  const [toNetwork, setToNetwork] = useState<Network>(networks[5]);
  const [amount, setAmount] = useState('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [selectedToken, setSelectedToken] = useState('USDC');

  const swapNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  const handleBridge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    Alert.alert(
      'Confirm Bridge',
      `Bridge ${amount} ${selectedToken} from ${fromNetwork.name} to ${toNetwork.name}?\n\nEstimated time: ${toNetwork.time}\nFee: ${toNetwork.fee} ${toNetwork.symbol}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => console.log('Bridge confirmed') },
      ]
    );
  };

  const statusColors = {
    pending: '#F39C12',
    completed: '#2ECC71',
    failed: '#E74C3C',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <GitBranch size={32} color="#9B59B6" />
        </View>
        <Text style={styles.title}>Bridge</Text>
        <Text style={styles.subtitle}>Transfer assets across different blockchain networks</Text>
      </View>

      <View style={styles.bridgeSection}>
        <View style={styles.networkSelector}>
          <Text style={styles.selectorLabel}>From</Text>
          <TouchableOpacity 
            style={styles.networkCard}
            onPress={() => setShowFromSelector(!showFromSelector)}
          >
            <View style={[styles.networkIcon, { backgroundColor: fromNetwork.color + '20' }]}>
              <Text style={[styles.networkIconText, { color: fromNetwork.color }]}>
                {fromNetwork.symbol.charAt(0)}
              </Text>
            </View>
            <View style={styles.networkInfo}>
              <Text style={styles.networkName}>{fromNetwork.name}</Text>
              <Text style={styles.networkSymbol}>{fromNetwork.symbol}</Text>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          
          {showFromSelector && (
            <View style={styles.networkDropdown}>
              {networks.filter(n => n.id !== toNetwork.id).map(network => (
                <TouchableOpacity
                  key={network.id}
                  style={styles.networkOption}
                  onPress={() => {
                    setFromNetwork(network);
                    setShowFromSelector(false);
                  }}
                >
                  <View style={[styles.networkOptionIcon, { backgroundColor: network.color + '20' }]}>
                    <Text style={[styles.networkOptionIconText, { color: network.color }]}>
                      {network.symbol.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.networkOptionName}>{network.name}</Text>
                  {network.id === fromNetwork.id && (
                    <Check size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapNetworks}>
          <View style={styles.swapIconWrapper}>
            <ArrowDown size={20} color={Colors.primary} />
          </View>
        </TouchableOpacity>

        <View style={styles.networkSelector}>
          <Text style={styles.selectorLabel}>To</Text>
          <TouchableOpacity 
            style={styles.networkCard}
            onPress={() => setShowToSelector(!showToSelector)}
          >
            <View style={[styles.networkIcon, { backgroundColor: toNetwork.color + '20' }]}>
              <Text style={[styles.networkIconText, { color: toNetwork.color }]}>
                {toNetwork.symbol.charAt(0)}
              </Text>
            </View>
            <View style={styles.networkInfo}>
              <Text style={styles.networkName}>{toNetwork.name}</Text>
              <Text style={styles.networkSymbol}>{toNetwork.symbol}</Text>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {showToSelector && (
            <View style={styles.networkDropdown}>
              {networks.filter(n => n.id !== fromNetwork.id).map(network => (
                <TouchableOpacity
                  key={network.id}
                  style={styles.networkOption}
                  onPress={() => {
                    setToNetwork(network);
                    setShowToSelector(false);
                  }}
                >
                  <View style={[styles.networkOptionIcon, { backgroundColor: network.color + '20' }]}>
                    <Text style={[styles.networkOptionIconText, { color: network.color }]}>
                      {network.symbol.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.networkOptionName}>{network.name}</Text>
                  {network.id === toNetwork.id && (
                    <Check size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Amount</Text>
        <View style={styles.amountInputContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.tokenBadge}>
            <Text style={styles.tokenBadgeText}>{selectedToken}</Text>
            <ChevronDown size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>Available: 1,250.00 {selectedToken}</Text>
          <TouchableOpacity onPress={() => setAmount('1250')}>
            <Text style={styles.maxBtn}>MAX</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.feeSection}>
        <View style={styles.feeRow}>
          <View style={styles.feeItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.feeLabel}>Est. Time</Text>
          </View>
          <Text style={styles.feeValue}>{toNetwork.time}</Text>
        </View>
        <View style={styles.feeRow}>
          <View style={styles.feeItem}>
            <Zap size={16} color={Colors.textSecondary} />
            <Text style={styles.feeLabel}>Bridge Fee</Text>
          </View>
          <Text style={styles.feeValue}>{toNetwork.fee} {toNetwork.symbol}</Text>
        </View>
        <View style={styles.feeRow}>
          <View style={styles.feeItem}>
            <Shield size={16} color={Colors.textSecondary} />
            <Text style={styles.feeLabel}>You will receive</Text>
          </View>
          <Text style={[styles.feeValue, { color: Colors.primary, fontWeight: '700' as const }]}>
            {amount || '0.00'} {selectedToken}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.bridgeButton, !amount && styles.bridgeButtonDisabled]}
        onPress={handleBridge}
        disabled={!amount}
      >
        <GitBranch size={20} color={Colors.background} />
        <Text style={styles.bridgeButtonText}>Bridge Assets</Text>
      </TouchableOpacity>

      <View style={styles.warningSection}>
        <AlertTriangle size={18} color="#F39C12" />
        <Text style={styles.warningText}>
          Bridge transactions may take longer during network congestion. Always verify the receiving address.
        </Text>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Recent Bridges</Text>
        {bridgeHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyText}>No bridge history</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {bridgeHistory.map(item => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                  <GitBranch size={18} color={Colors.primary} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyRoute}>
                    {item.fromNetwork} → {item.toNetwork}
                  </Text>
                  <Text style={styles.historyAmount}>
                    {item.amount} {item.token}
                  </Text>
                  <Text style={styles.historyTime}>{item.timestamp}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
                  <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#9B59B620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  bridgeSection: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  networkSelector: {
    marginBottom: 8,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  networkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  networkIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  networkSymbol: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  networkDropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 8,
    padding: 8,
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  networkOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  networkOptionIconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  networkOptionName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  swapButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  swapIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountSection: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    paddingVertical: 16,
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  tokenBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  balanceText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  maxBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  feeSection: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  bridgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9B59B6',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  bridgeButtonDisabled: {
    opacity: 0.5,
  },
  bridgeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 20,
    padding: 16,
    backgroundColor: '#F39C1210',
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#F39C12',
    lineHeight: 20,
  },
  historySection: {
    padding: 20,
    backgroundColor: Colors.background,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyHistory: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  historyAmount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  historyTime: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
