import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Lock, Fingerprint, Shield, Eye, EyeOff, Copy, Check, Trash2,
  AlertTriangle, ChevronRight, KeyRound, MessageSquare, ScanFace,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useWalletSecurity } from '@/contexts/WalletSecurityContext';
import { useTransactionVerification } from '@/contexts/TransactionVerificationContext';
import { useApp } from '@/contexts/AppContext';
import { formatAddress } from '@/services/walletCrypto';

export default function WalletSecurityScreen() {
  const { colors } = useApp();
  const {
    securityLevel, hasBackedUp, walletKeys, setupStatus,
    removePin, enableBiometric, markBackedUp,
    getMnemonic, resetWallet, lockWallet,
  } = useWalletSecurity();

  const [showSeed, setShowSeed] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [showPhoneSetup, setShowPhoneSetup] = useState(false);
  const {
    is2FAEnabled, phoneNumber, isBiometricAvailable,
    enable2FA, disable2FA,
  } = useTransactionVerification();

  const handleRevealSeed = useCallback(async () => {
    if (showSeed) {
      setShowSeed(false);
      setSeedPhrase(null);
      return;
    }
    const mnemonic = await getMnemonic();
    if (mnemonic) {
      setSeedPhrase(mnemonic);
      setShowSeed(true);
      await markBackedUp();
    }
  }, [showSeed, getMnemonic, markBackedUp]);

  const handleCopySeed = useCallback(async () => {
    if (!seedPhrase) return;
    await Clipboard.setStringAsync(seedPhrase);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [seedPhrase]);

  const handleToggleBiometric = useCallback(async () => {
    if (securityLevel === 'biometric') {
      await removePin();
    } else {
      if (Platform.OS === 'web') {
        Alert.alert('Not Available', 'Biometric authentication is not available on web.');
        return;
      }
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const LocalAuth = require('expo-local-authentication');
        const compatible = await LocalAuth.hasHardwareAsync();
        if (!compatible) {
          Alert.alert('Not Available', 'Your device does not support biometric authentication.');
          return;
        }
        const enrolled = await LocalAuth.isEnrolledAsync();
        if (!enrolled) {
          Alert.alert('Not Set Up', 'Please set up biometrics in your device settings first.');
          return;
        }
        await enableBiometric();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('[WalletSecurity] Biometric setup error:', error);
      }
    }
  }, [securityLevel, removePin, enableBiometric]);

  const handleResetWallet = useCallback(() => {
    Alert.alert(
      'Reset Wallet',
      'This will permanently delete your wallet from this device. Make sure you have your seed phrase backed up.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetWallet();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  }, [resetWallet]);

  if (setupStatus !== 'ready') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'Wallet Security', headerStyle: { backgroundColor: colors.backgroundSecondary } }} />
        <View style={styles.emptyState}>
          <KeyRound size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Wallet Set Up</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            <Text>Set up your wallet first to manage security settings.</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Wallet Security', headerStyle: { backgroundColor: colors.backgroundSecondary } }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.statusIcon, { backgroundColor: '#10B981' + '15' }]}>
            <Shield size={28} color="#10B981" />
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: colors.text }]}>Wallet Active</Text>
            <Text style={[styles.statusAddr, { color: colors.textSecondary }]}>
              {walletKeys ? formatAddress(walletKeys.publicKey, 8) : '---'}
            </Text>
          </View>
          <View style={[styles.secBadge, { backgroundColor: securityLevel === 'none' ? '#F59E0B' + '20' : '#10B981' + '20' }]}>
            <Text style={[styles.secBadgeText, { color: securityLevel === 'none' ? '#F59E0B' : '#10B981' }]}>
              {securityLevel === 'none' ? 'Unprotected' : securityLevel === 'pin' ? 'PIN' : 'Biometric'}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>AUTHENTICATION</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              if (securityLevel === 'pin') {
                Alert.alert('Remove PIN?', 'This will remove PIN protection.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: removePin },
                ]);
              } else {
                Alert.alert('PIN', 'Use the Wallet Setup flow to set a PIN.');
              }
            }}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
              <Lock size={18} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>PIN Lock</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {securityLevel === 'pin' ? 'Enabled' : 'Not set'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingRow} onPress={handleToggleBiometric}>
            <View style={[styles.settingIcon, { backgroundColor: '#6366F1' + '15' }]}>
              <Fingerprint size={18} color="#6366F1" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Biometric Unlock</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {securityLevel === 'biometric' ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {securityLevel !== 'none' && (
          <>
            <TouchableOpacity
              style={[styles.lockBtn, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}
              onPress={lockWallet}
            >
              <Lock size={18} color={colors.primary} />
              <Text style={[styles.lockBtnText, { color: colors.primary }]}>Lock Wallet Now</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>TRANSACTION VERIFICATION</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.settingRow} onPress={() => {
            Alert.alert('Biometric Verification', 'Face/fingerprint scan is required for every financial transaction.\n\nThis is always enabled for your security.');
          }}>
            <View style={[styles.settingIcon, { backgroundColor: '#2E86AB' + '15' }]}>
              <ScanFace size={18} color="#2E86AB" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Biometric Scan</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {isBiometricAvailable ? 'Required for all transactions' : 'Auto-approved on web'}
              </Text>
            </View>
            <View style={[styles.secBadge, { backgroundColor: '#10B981' + '20' }]}>
              <Text style={[styles.secBadgeText, { color: '#10B981' }]}>Active</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => {
            if (is2FAEnabled) {
              Alert.alert('Disable SMS 2FA?', 'Transactions will only require biometric verification.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Disable', style: 'destructive', onPress: () => { disable2FA(); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } },
              ]);
            } else {
              setPhoneInput(phoneNumber || '');
              setShowPhoneSetup(true);
            }
          }}>
            <View style={[styles.settingIcon, { backgroundColor: '#00B88A' + '15' }]}>
              <MessageSquare size={18} color="#00B88A" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>SMS 2FA</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {is2FAEnabled ? `Enabled • ${phoneNumber.slice(0, 4)}****${phoneNumber.slice(-2)}` : 'Add extra security layer'}
              </Text>
            </View>
            <View style={[styles.secBadge, { backgroundColor: is2FAEnabled ? '#10B981' + '20' : '#F59E0B' + '20' }]}>
              <Text style={[styles.secBadgeText, { color: is2FAEnabled ? '#10B981' : '#F59E0B' }]}>
                {is2FAEnabled ? 'Active' : 'Off'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {showPhoneSetup && (
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, padding: 16 }]}>
            <Text style={[styles.settingTitle, { color: colors.text, marginBottom: 8 }]}>Enter Phone Number</Text>
            <TextInput
              style={[styles.phoneInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="+1 234 567 8900"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
              testID="phone-input"
            />
            <View style={styles.phoneActions}>
              <TouchableOpacity
                style={[styles.phoneBtn, { backgroundColor: colors.background }]}
                onPress={() => setShowPhoneSetup(false)}
              >
                <Text style={[styles.phoneBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.phoneBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  if (phoneInput.length >= 8) {
                    enable2FA(phoneInput);
                    setShowPhoneSetup(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  } else {
                    Alert.alert('Invalid', 'Please enter a valid phone number.');
                  }
                }}
              >
                <Text style={[styles.phoneBtnText, { color: '#fff' }]}>Enable 2FA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>BACKUP</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleRevealSeed}>
            <View style={[styles.settingIcon, { backgroundColor: '#F59E0B' + '15' }]}>
              {showSeed ? <EyeOff size={18} color="#F59E0B" /> : <Eye size={18} color="#F59E0B" />}
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Seed Phrase</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {hasBackedUp ? 'Backed up' : 'Not backed up yet'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
          {showSeed && seedPhrase && (
            <View style={[styles.seedReveal, { backgroundColor: colors.background }]}>
              <View style={[styles.seedWarning, { backgroundColor: '#F59E0B' + '10' }]}>
                <AlertTriangle size={14} color="#F59E0B" />
                <Text style={[styles.seedWarningText, { color: '#F59E0B' }]}>Never share this with anyone</Text>
              </View>
              <View style={styles.seedWordsWrap}>
                {seedPhrase.split(' ').map((w, i) => (
                  <View key={i} style={[styles.seedWordChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.seedWordIdx, { color: colors.textTertiary }]}>{i + 1}</Text>
                    <Text style={[styles.seedWordVal, { color: colors.text }]}>{w}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={[styles.copyRow, { borderColor: colors.border }]} onPress={handleCopySeed}>
                {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} color={colors.primary} />}
                <Text style={[styles.copyRowText, { color: copied ? '#10B981' : colors.primary }]}>
                  {copied ? 'Copied!' : 'Copy Seed Phrase'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity style={styles.settingRow} onPress={() => setShowPrivateKey(!showPrivateKey)}>
            <View style={[styles.settingIcon, { backgroundColor: '#EF4444' + '15' }]}>
              <KeyRound size={18} color="#EF4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Private Key</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
                {showPrivateKey && walletKeys ? formatAddress(walletKeys.privateKey, 10) : '••••••••••'}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DANGER ZONE</Text>
        <TouchableOpacity
          style={[styles.dangerBtn, { backgroundColor: '#EF4444' + '10', borderColor: '#EF4444' + '30' }]}
          onPress={handleResetWallet}
        >
          <Trash2 size={18} color="#EF4444" />
          <Text style={[styles.dangerBtnText, { color: '#EF4444' }]}>Reset Wallet</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '600' as const },
  emptySubtitle: { fontSize: 14, textAlign: 'center' as const, paddingHorizontal: 40 },
  statusCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 24, gap: 12 },
  statusIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 16, fontWeight: '600' as const },
  statusAddr: { fontSize: 12, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  secBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  secBadgeText: { fontSize: 11, fontWeight: '700' as const },
  sectionLabel: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  settingsCard: { borderRadius: 14, marginBottom: 20, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '600' as const },
  settingDesc: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 16 },
  lockBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  lockBtnText: { fontSize: 15, fontWeight: '600' as const },
  seedReveal: { padding: 16, margin: 12, marginTop: 0, borderRadius: 12 },
  seedWarning: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, marginBottom: 12 },
  seedWarningText: { fontSize: 12, fontWeight: '600' as const },
  seedWordsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  seedWordChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  seedWordIdx: { fontSize: 10, fontWeight: '700' as const, width: 16 },
  seedWordVal: { fontSize: 13, fontWeight: '500' as const },
  copyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderTopWidth: 1 },
  copyRowText: { fontSize: 13, fontWeight: '600' as const },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, borderWidth: 1 },
  dangerBtnText: { fontSize: 15, fontWeight: '600' as const },
  phoneInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  phoneActions: { flexDirection: 'row', gap: 10 },
  phoneBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  phoneBtnText: { fontSize: 14, fontWeight: '600' as const },
});
