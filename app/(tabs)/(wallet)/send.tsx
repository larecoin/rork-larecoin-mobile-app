import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Scan, ChevronDown, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function SendScreen() {
  const router = useRouter();
  const { userTokens, addTransaction } = useApp();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(userTokens[0]);
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  const maxAmount = selectedToken.balance;
  const usdValue = parseFloat(amount || '0') * selectedToken.usdValue;
  const isValidAmount = parseFloat(amount || '0') > 0 && parseFloat(amount || '0') <= maxAmount;
  const isValidAddress = address.length >= 10;
  const canSend = isValidAmount && isValidAddress;

  const handleSend = () => {
    if (!canSend) return;
    
    addTransaction({
      type: 'send',
      status: 'pending',
      amount: parseFloat(amount),
      token: selectedToken.symbol,
      usdValue,
      address: address.slice(0, 6) + '...' + address.slice(-4),
      description: 'Transfer to external wallet',
    });
    
    router.back();
  };

  const handleMaxAmount = () => {
    setAmount(maxAmount.toString());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Recipient Address</Text>
          <View style={styles.addressContainer}>
            <TextInput
              style={styles.addressInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter wallet address"
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.scanButton}>
              <Scan size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Token</Text>
          <TouchableOpacity 
            style={styles.tokenSelector}
            onPress={() => setShowTokenPicker(!showTokenPicker)}
          >
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenIcon}>{selectedToken.icon}</Text>
              <View>
                <Text style={styles.tokenName}>{selectedToken.name}</Text>
                <Text style={styles.tokenBalance}>
                  Balance: {selectedToken.balance.toLocaleString()} {selectedToken.symbol}
                </Text>
              </View>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {showTokenPicker && (
            <View style={styles.tokenList}>
              {userTokens.map(token => (
                <TouchableOpacity
                  key={token.id}
                  style={[
                    styles.tokenOption,
                    token.id === selectedToken.id && styles.tokenOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedToken(token);
                    setShowTokenPicker(false);
                    setAmount('');
                  }}
                >
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                  <Text style={styles.tokenOptionText}>{token.symbol}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.amountHeader}>
            <Text style={styles.label}>Amount</Text>
            <TouchableOpacity onPress={handleMaxAmount}>
              <Text style={styles.maxButton}>MAX</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
            />
            <Text style={styles.tokenSymbol}>{selectedToken.symbol}</Text>
          </View>
          <Text style={styles.usdValue}>
            ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
          </Text>
        </View>

        {amount && parseFloat(amount) > maxAmount && (
          <View style={styles.warning}>
            <AlertCircle size={16} color={Colors.error} />
            <Text style={styles.warningText}>Insufficient balance</Text>
          </View>
        )}

        <View style={styles.feeSection}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeValue}>~$0.50</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Estimated Time</Text>
            <Text style={styles.feeValue}>~30 seconds</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Text style={styles.sendButtonText}>Send {selectedToken.symbol}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  scanButton: {
    padding: 16,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenIcon: {
    fontSize: 24,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  tokenBalance: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tokenList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tokenOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  tokenOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  maxButton: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingRight: 16,
  },
  usdValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  feeSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
