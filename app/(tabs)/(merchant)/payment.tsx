import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { QrCode, Check, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { tokens } from '@/constants/tokens';

const acceptedTokens = tokens.slice(0, 3);

export default function PaymentScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(acceptedTokens[0]);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setGenerated(true);
  };

  const handleNewPayment = () => {
    setGenerated(false);
    setAmount('');
  };

  const cryptoAmount = parseFloat(amount || '0') / selectedToken.usdValue;

  if (generated) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <View style={styles.qrCode}>
                {[...Array(10)].map((_, row) => (
                  <View key={row} style={styles.qrRow}>
                    {[...Array(10)].map((_, col) => (
                      <View 
                        key={col} 
                        style={[
                          styles.qrCell,
                          Math.random() > 0.5 && styles.qrCellFilled
                        ]} 
                      />
                    ))}
                  </View>
                ))}
              </View>
              <View style={styles.qrLogo}>
                <Text style={styles.qrLogoText}>{selectedToken.icon}</Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentLabel}>Amount Due</Text>
            <Text style={styles.paymentAmount}>${parseFloat(amount).toFixed(2)}</Text>
            <Text style={styles.cryptoAmount}>
              ≈ {cryptoAmount.toFixed(6)} {selectedToken.symbol}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.pulsingDot} />
            <Text style={styles.statusText}>Waiting for payment...</Text>
          </View>

          <Text style={styles.instruction}>
            Customer scans QR with any compatible wallet
          </Text>

          <TouchableOpacity style={styles.newPaymentButton} onPress={handleNewPayment}>
            <Text style={styles.newPaymentButtonText}>New Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <QrCode size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Quick Payment</Text>
        <Text style={styles.subtitle}>Generate a QR code for instant crypto payment</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Amount (USD)</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Accept Payment In</Text>
          <TouchableOpacity 
            style={styles.tokenSelector}
            onPress={() => setShowTokenPicker(!showTokenPicker)}
          >
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenIcon}>{selectedToken.icon}</Text>
              <Text style={styles.tokenName}>{selectedToken.symbol}</Text>
            </View>
            <ChevronDown size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          {showTokenPicker && (
            <View style={styles.tokenList}>
              {acceptedTokens.map(token => (
                <TouchableOpacity
                  key={token.id}
                  style={[
                    styles.tokenOption,
                    token.id === selectedToken.id && styles.tokenOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedToken(token);
                    setShowTokenPicker(false);
                  }}
                >
                  <Text style={styles.tokenIcon}>{token.icon}</Text>
                  <Text style={styles.tokenOptionText}>{token.symbol}</Text>
                  {token.id === selectedToken.id && (
                    <Check size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {amount && parseFloat(amount) > 0 && (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Customer pays</Text>
            <Text style={styles.previewAmount}>
              ≈ {cryptoAmount.toFixed(6)} {selectedToken.symbol}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.generateButton,
          (!amount || parseFloat(amount) <= 0) && styles.generateButtonDisabled
        ]}
        onPress={handleGenerate}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        <QrCode size={20} color={Colors.background} />
        <Text style={styles.generateButtonText}>Generate QR Code</Text>
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
  content: {
    flex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    paddingVertical: 16,
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
  tokenList: {
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tokenOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tokenOptionSelected: {
    backgroundColor: Colors.primary + '10',
  },
  tokenOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  preview: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  generateButtonDisabled: {
    backgroundColor: Colors.surface,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
    backgroundColor: Colors.text,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrCode: {
    width: '100%',
    height: '100%',
  },
  qrRow: {
    flexDirection: 'row',
    flex: 1,
  },
  qrCell: {
    flex: 1,
    margin: 1.5,
    backgroundColor: Colors.text,
  },
  qrCellFilled: {
    backgroundColor: Colors.background,
  },
  qrLogo: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLogoText: {
    fontSize: 24,
  },
  paymentDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  cryptoAmount: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warning,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
  },
  instruction: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  newPaymentButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  newPaymentButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
