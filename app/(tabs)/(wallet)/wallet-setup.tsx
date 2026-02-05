import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Animated, Alert, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  Shield, Plus, Download, ChevronRight, Eye, EyeOff, Copy, Check,
  Lock, ArrowLeft, AlertTriangle, KeyRound,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useWalletSecurity } from '@/contexts/WalletSecurityContext';
import { useApp } from '@/contexts/AppContext';

type SetupStep = 'welcome' | 'create' | 'import' | 'seed-display' | 'seed-confirm' | 'pin-setup' | 'done';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WalletSetupScreen() {
  const router = useRouter();
  const { colors } = useApp();
  const {
    createNewWallet, confirmWalletCreation, importWallet,
    setupPin, tempMnemonic,
  } = useWalletSecurity();

  const [step, setStep] = useState<SetupStep>('welcome');
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [seedRevealed, setSeedRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importMnemonic, setImportMnemonic] = useState('');
  const [confirmWords, setConfirmWords] = useState<Record<number, string>>({});
  const [confirmIndices, setConfirmIndices] = useState<number[]>([]);
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinStep, setPinStep] = useState<'create' | 'confirm'>('create');
  const [pinError, setPinError] = useState('');
  const [importError, setImportError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = useCallback((nextStep: SetupStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  const handleCreateWallet = useCallback(async () => {
    setIsProcessing(true);
    try {
      const mnemonic = await createNewWallet(12);
      setSeedWords(mnemonic.split(' '));
      const indices: number[] = [];
      while (indices.length < 3) {
        const idx = Math.floor(Math.random() * 12);
        if (!indices.includes(idx)) indices.push(idx);
      }
      setConfirmIndices(indices.sort((a, b) => a - b));
      animateTransition('seed-display');
    } catch (error) {
      console.log('[WalletSetup] Create error:', error);
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [createNewWallet, animateTransition]);

  const handleCopySeed = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(seedWords.join(' '));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.log('[WalletSetup] Copy error:', e);
    }
  }, [seedWords]);

  const handleConfirmSeed = useCallback(() => {
    for (const idx of confirmIndices) {
      if ((confirmWords[idx] || '').toLowerCase().trim() !== seedWords[idx]) {
        Alert.alert('Incorrect', `Word #${idx + 1} does not match. Please check your seed phrase.`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    animateTransition('pin-setup');
  }, [confirmIndices, confirmWords, seedWords, animateTransition]);

  const handleImportWallet = useCallback(async () => {
    setImportError('');
    setIsProcessing(true);
    try {
      const success = await importWallet(importMnemonic.trim());
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        animateTransition('pin-setup');
      } else {
        setImportError('Invalid seed phrase. Please check and try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (importErr) {
      console.log('[WalletSetup] Import error:', importErr);
      setImportError('Failed to import wallet.');
    } finally {
      setIsProcessing(false);
    }
  }, [importWallet, importMnemonic, animateTransition]);

  const handlePinInput = useCallback(async (digit: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pinStep === 'create') {
      const newPin = pin + digit;
      setPin(newPin);
      setPinError('');
      if (newPin.length === 6) {
        setPinStep('confirm');
      }
    } else {
      const newConfirm = pinConfirm + digit;
      setPinConfirm(newConfirm);
      setPinError('');
      if (newConfirm.length === 6) {
        if (newConfirm === pin) {
          setIsProcessing(true);
          try {
            await setupPin(newConfirm);
            if (step !== 'import') {
              await confirmWalletCreation();
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            animateTransition('done');
          } catch (e) {
            setPinError('Failed to set PIN');
          } finally {
            setIsProcessing(false);
          }
        } else {
          setPinError('PINs do not match. Try again.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setPinConfirm('');
        }
      }
    }
  }, [pin, pinConfirm, pinStep, setupPin, confirmWalletCreation, animateTransition, step]);

  const handlePinDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pinStep === 'create') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setPinConfirm(prev => prev.slice(0, -1));
    }
  }, [pinStep]);

  const handleSkipPin = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (tempMnemonic) {
        await confirmWalletCreation();
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      animateTransition('done');
    } catch (e) {
      console.log('[WalletSetup] Skip pin error:', e);
    } finally {
      setIsProcessing(false);
    }
  }, [confirmWalletCreation, tempMnemonic, animateTransition]);

  const currentPin = pinStep === 'create' ? pin : pinConfirm;

  const renderPinDots = () => (
    <View style={styles.pinDotsRow}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.pinDot,
            { borderColor: colors.border },
            i < currentPin.length && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
        />
      ))}
    </View>
  );

  const renderPinPad = () => (
    <View style={styles.pinPad}>
      {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']].map((row, ri) => (
        <View key={ri} style={styles.pinRow}>
          {row.map((digit, ci) => {
            if (digit === '') return <View key={ci} style={styles.pinKey} />;
            if (digit === 'del') {
              return (
                <TouchableOpacity
                  key={ci}
                  style={[styles.pinKey, { backgroundColor: colors.surface }]}
                  onPress={handlePinDelete}
                >
                  <ArrowLeft size={22} color={colors.text} />
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={ci}
                style={[styles.pinKey, { backgroundColor: colors.surface }]}
                onPress={() => handlePinInput(digit)}
              >
                <Text style={[styles.pinKeyText, { color: colors.text }]}>{digit}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.heroIcon, { backgroundColor: colors.primary + '15' }]}>
              <KeyRound size={48} color={colors.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Secure Your Wallet</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Create a new non-custodial wallet or import an existing one using your seed phrase.
            </Text>
            <View style={styles.optionCards}>
              <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleCreateWallet}
                disabled={isProcessing}
              >
                <View style={[styles.optionIconWrap, { backgroundColor: '#10B981' + '20' }]}>
                  <Plus size={24} color="#10B981" />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Create New Wallet</Text>
                  <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                    Generate a new seed phrase and keypair
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => animateTransition('import')}
              >
                <View style={[styles.optionIconWrap, { backgroundColor: '#6366F1' + '20' }]}>
                  <Download size={24} color="#6366F1" />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Import Existing Wallet</Text>
                  <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                    Restore using your 12 or 24-word seed phrase
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'seed-display':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.stepContainer}>
              <View style={[styles.warningBanner, { backgroundColor: '#F59E0B' + '15', borderColor: '#F59E0B' + '40' }]}>
                <AlertTriangle size={20} color="#F59E0B" />
                <Text style={[styles.warningText, { color: '#F59E0B' }]}>
                  Write down these words in order. Never share your seed phrase with anyone.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.revealToggle, { backgroundColor: colors.surface }]}
                onPress={() => setSeedRevealed(!seedRevealed)}
              >
                {seedRevealed ? <EyeOff size={18} color={colors.primary} /> : <Eye size={18} color={colors.primary} />}
                <Text style={[styles.revealToggleText, { color: colors.primary }]}>
                  {seedRevealed ? 'Hide Seed Phrase' : 'Reveal Seed Phrase'}
                </Text>
              </TouchableOpacity>
              <View style={styles.seedGrid}>
                {seedWords.map((word, i) => (
                  <View key={i} style={[styles.seedWord, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.seedWordNum, { color: colors.textTertiary }]}>{i + 1}</Text>
                    <Text style={[styles.seedWordText, { color: colors.text }]}>
                      {seedRevealed ? word : '••••••'}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={handleCopySeed}
              >
                {copied ? <Check size={18} color="#10B981" /> : <Copy size={18} color={colors.primary} />}
                <Text style={[styles.copyBtnText, { color: copied ? '#10B981' : colors.primary }]}>
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={() => animateTransition('seed-confirm')}
              >
                <Text style={[styles.primaryBtnText, { color: '#FFFFFF' }]}>I have saved my seed phrase</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'seed-confirm':
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Verify Your Seed Phrase</Text>
              <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Enter the following words to confirm you saved your seed phrase.
              </Text>
              {confirmIndices.map(idx => (
                <View key={idx} style={styles.confirmField}>
                  <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Word #{idx + 1}</Text>
                  <TextInput
                    style={[styles.confirmInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                    placeholder={`Enter word #${idx + 1}`}
                    placeholderTextColor={colors.textTertiary}
                    value={confirmWords[idx] || ''}
                    onChangeText={text => setConfirmWords(prev => ({ ...prev, [idx]: text }))}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              ))}
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 24 }]}
                onPress={handleConfirmSeed}
                disabled={confirmIndices.some(idx => !(confirmWords[idx] || '').trim())}
              >
                <Text style={[styles.primaryBtnText, { color: '#FFFFFF' }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case 'import':
        return (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Import Wallet</Text>
                <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                  Enter your 12 or 24-word seed phrase, separated by spaces.
                </Text>
                <TextInput
                  style={[styles.importInput, { backgroundColor: colors.surface, color: colors.text, borderColor: importError ? colors.error : colors.border }]}
                  placeholder="Enter your seed phrase..."
                  placeholderTextColor={colors.textTertiary}
                  value={importMnemonic}
                  onChangeText={t => { setImportMnemonic(t); setImportError(''); }}
                  multiline
                  numberOfLines={4}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {importError ? (
                  <Text style={[styles.errorText, { color: colors.error }]}>{importError}</Text>
                ) : null}
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
                  onPress={handleImportWallet}
                  disabled={!importMnemonic.trim() || isProcessing}
                >
                  <Text style={[styles.primaryBtnText, { color: '#FFFFFF' }]}>
                    {isProcessing ? 'Importing...' : 'Import Wallet'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryBtn, { borderColor: colors.border }]}
                  onPress={() => animateTransition('welcome')}
                >
                  <Text style={[styles.secondaryBtnText, { color: colors.textSecondary }]}>Back</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );

      case 'pin-setup':
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.pinIcon, { backgroundColor: colors.primary + '15' }]}>
              <Lock size={32} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              {pinStep === 'create' ? 'Create a PIN' : 'Confirm Your PIN'}
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              {pinStep === 'create'
                ? 'Set a 6-digit PIN to protect your wallet'
                : 'Enter the same PIN again to confirm'}
            </Text>
            {renderPinDots()}
            {pinError ? <Text style={[styles.errorText, { color: colors.error }]}>{pinError}</Text> : null}
            {renderPinPad()}
            <TouchableOpacity onPress={handleSkipPin} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        );

      case 'done':
        return (
          <View style={styles.stepContainer}>
            <View style={[styles.doneIcon, { backgroundColor: '#10B981' + '15' }]}>
              <Shield size={48} color="#10B981" />
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Wallet Ready!</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Your non-custodial wallet has been set up. Your keys are stored securely on this device.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 32 }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.primaryBtnText, { color: '#FFFFFF' }]}>Go to Wallet</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Wallet Setup', headerStyle: { backgroundColor: colors.backgroundSecondary } }} />
      <Animated.View style={[styles.animWrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {renderStep()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  animWrap: { flex: 1 },
  stepContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  heroIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 26, fontWeight: '700' as const, textAlign: 'center' as const, marginBottom: 12 },
  heroSubtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center' as const, marginBottom: 32, paddingHorizontal: 16 },
  optionCards: { gap: 14 },
  optionCard: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 18, borderRadius: 16, borderWidth: 1, gap: 14 },
  optionIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionTextWrap: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600' as const, marginBottom: 3 },
  optionDesc: { fontSize: 13 },
  warningBanner: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  warningText: { flex: 1, fontSize: 13, lineHeight: 19 },
  revealToggle: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, padding: 12, borderRadius: 10, marginBottom: 16 },
  revealToggleText: { fontSize: 14, fontWeight: '600' as const },
  seedGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 10, marginBottom: 20 },
  seedWord: { width: (SCREEN_WIDTH - 68) / 3, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  seedWordNum: { fontSize: 11, width: 18, fontWeight: '600' as const },
  seedWordText: { fontSize: 14, fontWeight: '500' as const },
  copyBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  copyBtnText: { fontSize: 14, fontWeight: '600' as const },
  primaryBtn: { padding: 16, borderRadius: 14, alignItems: 'center' as const },
  primaryBtnText: { fontSize: 16, fontWeight: '700' as const },
  secondaryBtn: { padding: 14, borderRadius: 12, alignItems: 'center' as const, borderWidth: 1, marginTop: 12 },
  secondaryBtnText: { fontSize: 15, fontWeight: '600' as const },
  stepTitle: { fontSize: 22, fontWeight: '700' as const, textAlign: 'center' as const, marginBottom: 8 },
  stepSubtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center' as const, marginBottom: 24, paddingHorizontal: 8 },
  confirmField: { marginBottom: 16 },
  confirmLabel: { fontSize: 13, fontWeight: '600' as const, marginBottom: 6 },
  confirmInput: { padding: 14, borderRadius: 12, borderWidth: 1, fontSize: 16 },
  importInput: { padding: 16, borderRadius: 14, borderWidth: 1, fontSize: 15, minHeight: 120, textAlignVertical: 'top' as const },
  errorText: { fontSize: 13, marginTop: 8, textAlign: 'center' as const },
  pinIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  pinDotsRow: { flexDirection: 'row' as const, justifyContent: 'center' as const, gap: 14, marginVertical: 24 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  pinPad: { gap: 12, marginTop: 8 },
  pinRow: { flexDirection: 'row' as const, justifyContent: 'center' as const, gap: 20 },
  pinKey: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  pinKeyText: { fontSize: 26, fontWeight: '500' as const },
  skipBtn: { alignItems: 'center', marginTop: 20 },
  skipText: { fontSize: 14 },
  doneIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24, marginTop: 40 },
});
