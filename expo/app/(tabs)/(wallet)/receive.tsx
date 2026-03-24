import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { Copy, Share2, ChevronDown, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { useWalletSecurity } from '@/contexts/WalletSecurityContext';

export default function ReceiveScreen() {
  const { userTokens } = useApp();
  const { walletKeys } = useWalletSecurity();
  const [selectedToken, setSelectedToken] = useState(userTokens[0]);
  const [showTokenPicker, setShowTokenPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletAddress = walletKeys?.publicKey || '0xLARE1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t';

  const qrPattern = useMemo(() => {
    const pattern: boolean[][] = [];
    let seed = walletAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let row = 0; row < 8; row++) {
      pattern[row] = [];
      for (let col = 0; col < 8; col++) {
        pattern[row][col] = random() > 0.5;
      }
    }
    return pattern;
  }, [walletAddress]);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(walletAddress);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Copy error:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My ${selectedToken.symbol} address: ${walletAddress}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Select Token</Text>
        <TouchableOpacity 
          style={styles.tokenSelector}
          onPress={() => setShowTokenPicker(!showTokenPicker)}
        >
          <View style={styles.tokenInfo}>
            <Text style={styles.tokenIcon}>{selectedToken.icon}</Text>
            <Text style={styles.tokenName}>{selectedToken.name}</Text>
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
                }}
              >
                <Text style={styles.tokenIcon}>{token.icon}</Text>
                <Text style={styles.tokenOptionText}>{token.symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrPlaceholder}>
          <View style={styles.qrCode}>
            {qrPattern.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.qrRow}>
                {row.map((filled, colIndex) => (
                  <View 
                    key={colIndex} 
                    style={[
                      styles.qrCell,
                      filled && styles.qrCellFilled
                    ]} 
                  />
                ))}
              </View>
            ))}
          </View>
          <View style={styles.qrLogo}>
            <Text style={styles.qrLogoText}>💰</Text>
          </View>
        </View>
        <Text style={styles.qrHint}>Scan to send {selectedToken.symbol}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>Wallet Address</Text>
        <View style={styles.addressBox}>
          <Text style={styles.address} numberOfLines={1}>
            {walletAddress}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, copied && styles.actionButtonSuccess]}
          onPress={handleCopy}
        >
          {copied ? (
            <Check size={20} color={Colors.success} />
          ) : (
            <Copy size={20} color={Colors.primary} />
          )}
          <Text style={[styles.actionButtonText, copied && styles.actionButtonTextSuccess]}>
            {copied ? 'Copied!' : 'Copy Address'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningText}>
          Only send {selectedToken.symbol} to this address. Sending other tokens may result in permanent loss.
        </Text>
      </View>
    </View>
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
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.text,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    margin: 2,
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
  qrHint: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  addressSection: {
    marginBottom: 24,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  addressBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  address: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonSuccess: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '20',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionButtonTextSuccess: {
    color: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning + '15',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  warningText: {
    fontSize: 13,
    color: Colors.warning,
    lineHeight: 20,
  },
});
