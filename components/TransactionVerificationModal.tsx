import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { ScanFace, ShieldCheck, MessageSquare, X, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { useTransactionVerification } from '@/contexts/TransactionVerificationContext';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function TransactionVerificationModal() {
  const {
    step,
    pendingTransaction,
    is2FAEnabled,
    completeBiometricStep,
    completeOTPStep,
    resendOTP,
    cancelVerification,
    resetVerification,
  } = useTransactionVerification();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [shakeAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.9));
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const visible = step !== 'idle' && step !== 'success';

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 65, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  useEffect(() => {
    if (step === 'biometric') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      pulse.start();

      const timer = setTimeout(() => {
        completeBiometricStep();
      }, 600);
      return () => {
        clearTimeout(timer);
        pulse.stop();
      };
    }
  }, [step, completeBiometricStep, pulseAnim]);

  useEffect(() => {
    if (step === 'sms_verify') {
      setOtpDigits(['', '', '', '', '', '']);
      setResendCooldown(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 400);
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (step === 'success') {
      const t = setTimeout(() => resetVerification(), 1200);
      return () => clearTimeout(t);
    }
  }, [step, resetVerification]);

  const handleOTPChange = useCallback((index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').split('').slice(0, 6);
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((d, i) => { newOtp[i] = d; });
      setOtpDigits(newOtp);
      if (digits.length === 6) {
        completeOTPStep(newOtp.join(''));
      } else {
        inputRefs.current[digits.length]?.focus();
      }
      return;
    }

    const newOtp = [...otpDigits];
    newOtp[index] = value.replace(/\D/g, '');
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      completeOTPStep(newOtp.join(''));
    }
  }, [otpDigits, completeOTPStep]);

  const handleOTPKeyPress = useCallback((index: number, key: string) => {
    if (key === 'Backspace' && !otpDigits[index] && index > 0) {
      const newOtp = [...otpDigits];
      newOtp[index - 1] = '';
      setOtpDigits(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }, [otpDigits]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    await resendOTP();
    setResendCooldown(30);
    setOtpDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  }, [resendCooldown, resendOTP]);

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  useEffect(() => {
    if (step === 'failed') {
      triggerShake();
    }
  }, [step, triggerShake]);

  if (!visible) return null;

  const renderBiometricStep = () => (
    <View style={styles.stepContainer}>
      <Animated.View style={[styles.iconCircle, styles.iconCircleBio, { transform: [{ scale: pulseAnim }] }]}>
        <ScanFace size={48} color="#fff" />
      </Animated.View>
      <Text style={styles.stepTitle}>Face Verification</Text>
      <Text style={styles.stepSubtitle}>
        {is2FAEnabled ? 'Step 1 of 2 — ' : ''}Look at your device to verify your identity
      </Text>
      <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
    </View>
  );

  const renderSMSSendStep = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, styles.iconCircleSMS]}>
        <MessageSquare size={40} color="#fff" />
      </View>
      <Text style={styles.stepTitle}>Sending Verification Code</Text>
      <Text style={styles.stepSubtitle}>Step 2 of 2 — Sending SMS to your registered number</Text>
      <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 20 }} />
    </View>
  );

  const renderSMSVerifyStep = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, styles.iconCircleSMS]}>
        <ShieldCheck size={40} color="#fff" />
      </View>
      <Text style={styles.stepTitle}>Enter Verification Code</Text>
      <Text style={styles.stepSubtitle}>Step 2 of 2 — Enter the 6-digit code sent via SMS</Text>

      <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
        {otpDigits.map((digit, idx) => (
          <TextInput
            key={idx}
            ref={ref => { inputRefs.current[idx] = ref; }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
            value={digit}
            onChangeText={v => handleOTPChange(idx, v)}
            onKeyPress={({ nativeEvent }) => handleOTPKeyPress(idx, nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={6}
            selectTextOnFocus
            testID={`otp-input-${idx}`}
          />
        ))}
      </Animated.View>

      <TouchableOpacity
        onPress={handleResend}
        disabled={resendCooldown > 0}
        style={styles.resendButton}
        testID="resend-otp-btn"
      >
        <RefreshCw size={14} color={resendCooldown > 0 ? Colors.textTertiary : Colors.primary} />
        <Text style={[styles.resendText, resendCooldown > 0 && styles.resendTextDisabled]}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFailedStep = () => (
    <View style={styles.stepContainer}>
      <View style={[styles.iconCircle, styles.iconCircleFail]}>
        <AlertTriangle size={40} color="#fff" />
      </View>
      <Text style={styles.stepTitle}>Verification Failed</Text>
      <Text style={styles.stepSubtitle}>Unable to verify your identity. Transaction cancelled.</Text>
      <TouchableOpacity style={styles.dismissButton} onPress={resetVerification} testID="dismiss-fail-btn">
        <Text style={styles.dismissButtonText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'biometric': return renderBiometricStep();
      case 'sms_send': return renderSMSSendStep();
      case 'sms_verify': return renderSMSVerifyStep();
      case 'failed': return renderFailedStep();
      default: return null;
    }
  };

  return (
    <Modal visible={true} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.sheet, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <ShieldCheck size={18} color={Colors.primary} />
                <Text style={styles.headerTitle}>Transaction Verification</Text>
              </View>
              <TouchableOpacity onPress={cancelVerification} style={styles.closeBtn} testID="close-verify-btn">
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {pendingTransaction && (
              <View style={styles.txnSummary}>
                <Text style={styles.txnLabel}>Transaction</Text>
                <Text style={styles.txnValue}>
                  {pendingTransaction.type} {pendingTransaction.amount} {pendingTransaction.token}
                </Text>
                {pendingTransaction.to && (
                  <Text style={styles.txnTo}>
                    To: {pendingTransaction.to.length > 16
                      ? pendingTransaction.to.slice(0, 8) + '...' + pendingTransaction.to.slice(-6)
                      : pendingTransaction.to}
                  </Text>
                )}
              </View>
            )}

            {renderStep()}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sheet: {
    width: width - 40,
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
  },
  txnSummary: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  txnLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  txnValue: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  txnTo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stepContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconCircleBio: {
    backgroundColor: '#2E86AB',
  },
  iconCircleSMS: {
    backgroundColor: '#00B88A',
  },
  iconCircleFail: {
    backgroundColor: '#E05050',
  },
  stepTitle: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
    textAlign: 'center' as const,
  },
  stepSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 18,
    maxWidth: 280,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    textAlign: 'center' as const,
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceLight,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  resendTextDisabled: {
    color: Colors.textTertiary,
  },
  dismissButton: {
    marginTop: 24,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dismissButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
