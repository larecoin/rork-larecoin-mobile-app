import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Lock, Bell, Fingerprint, Smartphone, Globe, MapPin, Eye, EyeOff, AlertTriangle, Check, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: typeof Shield;
  color: string;
}

export default function CardSecurityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();

  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: 'fraud-alerts',
      title: 'Fraud Alerts',
      description: 'Get notified of suspicious activity',
      enabled: true,
      icon: AlertTriangle,
      color: '#EF4444',
    },
    {
      id: 'transaction-notifications',
      title: 'Transaction Notifications',
      description: 'Real-time alerts for all transactions',
      enabled: true,
      icon: Bell,
      color: '#F59E0B',
    },
    {
      id: 'biometric-auth',
      title: 'Biometric Authentication',
      description: 'Use fingerprint or face for transactions',
      enabled: true,
      icon: Fingerprint,
      color: '#8B5CF6',
    },
    {
      id: 'online-transactions',
      title: 'Online Transactions',
      description: 'Allow card for online purchases',
      enabled: true,
      icon: Globe,
      color: '#3B82F6',
    },
    {
      id: 'international',
      title: 'International Transactions',
      description: 'Allow card usage outside your country',
      enabled: false,
      icon: MapPin,
      color: '#10B981',
    },
    {
      id: 'contactless',
      title: 'Contactless Payments',
      description: 'Enable tap-to-pay functionality',
      enabled: true,
      icon: Smartphone,
      color: '#06B6D4',
    },
  ]);

  const [showPinSection, setShowPinSection] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinVisible, setPinVisible] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);

  const handleToggleSetting = (id: string) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleChangePin = () => {
    if (currentPin.length === 4 && newPin.length === 4 && newPin === confirmPin) {
      console.log('PIN changed successfully');
      setShowPinSection(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Card Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.freezeCard, { backgroundColor: cardFrozen ? '#EF4444' + '15' : colors.surface }]}>
          <View style={styles.freezeCardContent}>
            <View style={[styles.freezeIcon, { backgroundColor: cardFrozen ? '#EF4444' + '20' : colors.primary + '20' }]}>
              <Lock size={24} color={cardFrozen ? '#EF4444' : colors.primary} />
            </View>
            <View style={styles.freezeInfo}>
              <Text style={[styles.freezeTitle, { color: colors.text }]}>
                {cardFrozen ? 'Card is Frozen' : 'Freeze Card'}
              </Text>
              <Text style={[styles.freezeDescription, { color: colors.textSecondary }]}>
                {cardFrozen 
                  ? 'Your card is currently frozen. All transactions are blocked.'
                  : 'Temporarily block all transactions on your card'
                }
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.freezeButton, { backgroundColor: cardFrozen ? '#EF4444' : colors.primary }]}
            onPress={() => setCardFrozen(!cardFrozen)}
          >
            <Text style={styles.freezeButtonText}>
              {cardFrozen ? 'Unfreeze Card' : 'Freeze Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>PIN Management</Text>
          
          <TouchableOpacity 
            style={[styles.pinCard, { backgroundColor: colors.surface }]}
            onPress={() => setShowPinSection(!showPinSection)}
          >
            <View style={[styles.pinIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
              <Shield size={20} color="#8B5CF6" />
            </View>
            <View style={styles.pinInfo}>
              <Text style={[styles.pinTitle, { color: colors.text }]}>Change PIN</Text>
              <Text style={[styles.pinDescription, { color: colors.textSecondary }]}>Update your 4-digit card PIN</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} style={{ transform: [{ rotate: showPinSection ? '90deg' : '0deg' }] }} />
          </TouchableOpacity>

          {showPinSection && (
            <View style={[styles.pinForm, { backgroundColor: colors.surface }]}>
              <View style={styles.pinInputGroup}>
                <Text style={[styles.pinInputLabel, { color: colors.textSecondary }]}>Current PIN</Text>
                <View style={[styles.pinInputWrapper, { backgroundColor: colors.background }]}>
                  <TextInput
                    style={[styles.pinInput, { color: colors.text }]}
                    value={currentPin}
                    onChangeText={setCurrentPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={!pinVisible}
                    placeholder="••••"
                    placeholderTextColor={colors.textTertiary}
                  />
                  <TouchableOpacity onPress={() => setPinVisible(!pinVisible)}>
                    {pinVisible ? (
                      <EyeOff size={18} color={colors.textSecondary} />
                    ) : (
                      <Eye size={18} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.pinInputGroup}>
                <Text style={[styles.pinInputLabel, { color: colors.textSecondary }]}>New PIN</Text>
                <View style={[styles.pinInputWrapper, { backgroundColor: colors.background }]}>
                  <TextInput
                    style={[styles.pinInput, { color: colors.text }]}
                    value={newPin}
                    onChangeText={setNewPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={!pinVisible}
                    placeholder="••••"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.pinInputGroup}>
                <Text style={[styles.pinInputLabel, { color: colors.textSecondary }]}>Confirm New PIN</Text>
                <View style={[styles.pinInputWrapper, { backgroundColor: colors.background }]}>
                  <TextInput
                    style={[styles.pinInput, { color: colors.text }]}
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={!pinVisible}
                    placeholder="••••"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {newPin.length === 4 && confirmPin.length === 4 && newPin !== confirmPin && (
                <View style={[styles.pinError, { backgroundColor: '#FEE2E2' }]}>
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text style={styles.pinErrorText}>PINs do not match</Text>
                </View>
              )}

              <TouchableOpacity 
                style={[
                  styles.changePinButton, 
                  { backgroundColor: colors.primary },
                  (currentPin.length !== 4 || newPin.length !== 4 || newPin !== confirmPin) && styles.buttonDisabled
                ]}
                onPress={handleChangePin}
                disabled={currentPin.length !== 4 || newPin.length !== 4 || newPin !== confirmPin}
              >
                <Text style={styles.changePinButtonText}>Update PIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security Settings</Text>
          
          {securitySettings.map(setting => (
            <View key={setting.id} style={[styles.settingCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
                <setting.icon size={20} color={setting.color} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>{setting.title}</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => handleToggleSetting(setting.id)}
                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                thumbColor={setting.enabled ? colors.primary : colors.textTertiary}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Security Activity</Text>
          
          <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityText, { color: colors.text }]}>PIN changed successfully</Text>
                <Text style={[styles.activityTime, { color: colors.textTertiary }]}>2 days ago</Text>
              </View>
            </View>
            <View style={[styles.activityDivider, { backgroundColor: colors.border }]} />
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityText, { color: colors.text }]}>Biometric authentication enabled</Text>
                <Text style={[styles.activityTime, { color: colors.textTertiary }]}>5 days ago</Text>
              </View>
            </View>
            <View style={[styles.activityDivider, { backgroundColor: colors.border }]} />
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityText, { color: colors.text }]}>Card temporarily frozen</Text>
                <Text style={[styles.activityTime, { color: colors.textTertiary }]}>1 week ago</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  freezeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  freezeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  freezeIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  freezeTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  freezeDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  freezeButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  freezeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 14,
  },
  pinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
  },
  pinIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinInfo: {
    flex: 1,
    marginLeft: 12,
  },
  pinTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  pinDescription: {
    fontSize: 12,
  },
  pinForm: {
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  pinInputGroup: {
    marginBottom: 14,
  },
  pinInputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  pinInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pinInput: {
    flex: 1,
    fontSize: 18,
    letterSpacing: 8,
    textAlign: 'center' as const,
  },
  pinError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 14,
  },
  pinErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  changePinButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  changePinButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  activityCard: {
    borderRadius: 14,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  activityDivider: {
    height: 1,
    marginVertical: 4,
  },
});
