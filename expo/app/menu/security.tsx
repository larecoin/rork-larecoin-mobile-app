import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Shield, Smartphone, Key, Lock, Eye, EyeOff, 
  Fingerprint, Mail, AlertTriangle, CheckCircle, ChevronRight,
  History, MapPin, LogOut
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const securitySettings = [
    {
      id: 'password',
      title: 'Change Password',
      subtitle: 'Last changed 30 days ago',
      icon: Key,
      color: '#3498DB',
      hasChevron: true,
    },
    {
      id: 'pin',
      title: 'Transaction PIN',
      subtitle: 'Required for transactions',
      icon: Lock,
      color: '#9B59B6',
      hasChevron: true,
    },
    {
      id: 'recovery',
      title: 'Recovery Phrase',
      subtitle: 'Backup your wallet',
      icon: Shield,
      color: '#E67E22',
      hasChevron: true,
    },
  ];

  const activeSessions = [
    { id: '1', device: 'iPhone 14 Pro', location: 'New York, US', time: 'Active now', current: true },
    { id: '2', device: 'MacBook Pro', location: 'New York, US', time: '2 hours ago', current: false },
    { id: '3', device: 'Chrome Browser', location: 'Los Angeles, US', time: '1 day ago', current: false },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.securityStatus}>
          <View style={styles.statusIconContainer}>
            <Shield size={32} color="#10B981" />
          </View>
          <Text style={styles.statusTitle}>Account Protected</Text>
          <Text style={styles.statusSubtitle}>Your security score is excellent</Text>
          <View style={styles.securityScore}>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreProgress, { width: '90%' }]} />
            </View>
            <Text style={styles.scoreText}>90/100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
          <View style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: '#10B981' + '20' }]}>
                <Smartphone size={20} color="#10B981" />
              </View>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>2FA via Authenticator</Text>
                <Text style={styles.toggleSubtitle}>Google Authenticator or similar</Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={twoFactorEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
            {twoFactorEnabled && (
              <View style={styles.verifiedRow}>
                <CheckCircle size={14} color="#10B981" />
                <Text style={styles.verifiedText}>Enabled and active</Text>
              </View>
            )}
          </View>

          <View style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
                <Fingerprint size={20} color="#8B5CF6" />
              </View>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Biometric Login</Text>
                <Text style={styles.toggleSubtitle}>Face ID or fingerprint</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={biometricEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.toggleCard}>
            <View style={styles.toggleRow}>
              <View style={[styles.toggleIcon, { backgroundColor: '#F59E0B' + '20' }]}>
                <Mail size={20} color="#F59E0B" />
              </View>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleTitle}>Login Alerts</Text>
                <Text style={styles.toggleSubtitle}>Get notified of new logins</Text>
              </View>
              <Switch
                value={loginAlertsEnabled}
                onValueChange={setLoginAlertsEnabled}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={loginAlertsEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <View style={styles.settingsCard}>
            {securitySettings.map((setting, index) => (
              <TouchableOpacity 
                key={setting.id} 
                style={[
                  styles.settingItem,
                  index === securitySettings.length - 1 && styles.settingItemLast
                ]}
              >
                <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
                  <setting.icon size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                {setting.hasChevron && <ChevronRight size={18} color={Colors.textTertiary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Sessions</Text>
            <TouchableOpacity>
              <Text style={styles.manageText}>Manage All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sessionsCard}>
            {activeSessions.map((session, index) => (
              <View 
                key={session.id} 
                style={[
                  styles.sessionItem,
                  index === activeSessions.length - 1 && styles.sessionItemLast
                ]}
              >
                <View style={styles.sessionIcon}>
                  <Smartphone size={18} color={Colors.textSecondary} />
                </View>
                <View style={styles.sessionContent}>
                  <View style={styles.sessionTitleRow}>
                    <Text style={styles.sessionDevice}>{session.device}</Text>
                    {session.current && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>Current</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.sessionMeta}>
                    <MapPin size={12} color={Colors.textTertiary} />
                    <Text style={styles.sessionLocation}>{session.location}</Text>
                    <Text style={styles.sessionDot}>•</Text>
                    <Text style={styles.sessionTime}>{session.time}</Text>
                  </View>
                </View>
                {!session.current && (
                  <TouchableOpacity style={styles.revokeButton}>
                    <LogOut size={16} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security History</Text>
          <TouchableOpacity style={styles.historyCard}>
            <View style={[styles.historyIcon, { backgroundColor: Colors.primary + '20' }]}>
              <History size={20} color={Colors.primary} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>View Security Activity</Text>
              <Text style={styles.historySubtitle}>Recent logins, password changes, and more</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  securityStatus: {
    marginHorizontal: 20,
    backgroundColor: '#10B981' + '15',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  securityScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  manageText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  toggleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContent: {
    flex: 1,
    marginLeft: 12,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  verifiedText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500' as const,
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sessionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sessionItemLast: {
    borderBottomWidth: 0,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionContent: {
    flex: 1,
    marginLeft: 12,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDevice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  currentBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sessionLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sessionDot: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  sessionTime: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  revokeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  historySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
