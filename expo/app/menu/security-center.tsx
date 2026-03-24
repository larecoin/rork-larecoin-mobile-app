import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, Lock, Smartphone, Key, Eye, AlertTriangle, CheckCircle, ChevronRight, Fingerprint } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const securityFeatures = [
  { id: '1', name: 'Two-Factor Authentication', icon: Smartphone, enabled: true, description: 'Authenticator app' },
  { id: '2', name: 'Biometric Login', icon: Fingerprint, enabled: true, description: 'Face ID enabled' },
  { id: '3', name: 'Login Alerts', icon: AlertTriangle, enabled: true, description: 'Email & push notifications' },
  { id: '4', name: 'Withdrawal Whitelist', icon: CheckCircle, enabled: false, description: 'Restrict withdrawals' },
];

const recentActivity = [
  { id: '1', action: 'Login from iPhone', location: 'New York, US', time: '2 hours ago', status: 'success' },
  { id: '2', action: 'Password changed', location: 'New York, US', time: '3 days ago', status: 'success' },
  { id: '3', action: 'Login attempt blocked', location: 'Unknown, RU', time: '5 days ago', status: 'blocked' },
];

export default function SecurityCenterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Security Center' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scoreCard, { backgroundColor: colors.primary }]}>
          <Shield size={48} color="#FFF" />
          <Text style={styles.scoreTitle}>Security Score</Text>
          <Text style={styles.scoreValue}>85/100</Text>
          <Text style={styles.scoreSubtitle}>Good - Enable withdrawal whitelist for maximum security</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Security Features</Text>
          <View style={[styles.featuresCard, { backgroundColor: colors.surface }]}>
            {securityFeatures.map((feature, index) => (
              <View
                key={feature.id}
                style={[
                  styles.featureRow,
                  { borderBottomColor: colors.border },
                  index === securityFeatures.length - 1 && styles.featureRowLast,
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.primary + '15' }]}>
                  <feature.icon size={20} color={colors.primary} />
                </View>
                <View style={styles.featureInfo}>
                  <Text style={[styles.featureName, { color: colors.text }]}>{feature.name}</Text>
                  <Text style={[styles.featureDescription, { color: colors.textTertiary }]}>{feature.description}</Text>
                </View>
                <Switch
                  value={feature.enabled}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={feature.enabled ? colors.primary : colors.textTertiary}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account Security</Text>
          <View style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={[styles.actionRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Lock size={20} color={colors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionName, { color: colors.text }]}>Change Password</Text>
                <Text style={[styles.actionDescription, { color: colors.textTertiary }]}>Last changed 30 days ago</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Key size={20} color={colors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionName, { color: colors.text }]}>Recovery Phrase</Text>
                <Text style={[styles.actionDescription, { color: colors.textTertiary }]}>View or backup your seed</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRowLast}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Eye size={20} color={colors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionName, { color: colors.text }]}>Active Sessions</Text>
                <Text style={[styles.actionDescription, { color: colors.textTertiary }]}>Manage logged in devices</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
            {recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityRow,
                  { borderBottomColor: colors.border },
                  index === recentActivity.length - 1 && styles.activityRowLast,
                ]}
              >
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: activity.status === 'blocked' ? colors.error + '15' : colors.success + '15' }
                ]}>
                  {activity.status === 'blocked' ? (
                    <AlertTriangle size={16} color={colors.error} />
                  ) : (
                    <CheckCircle size={16} color={colors.success} />
                  )}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityAction, { color: colors.text }]}>{activity.action}</Text>
                  <Text style={[styles.activityMeta, { color: colors.textTertiary }]}>
                    {activity.location} • {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scoreCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#FFF',
    marginVertical: 8,
  },
  scoreSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  featuresCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  featureRowLast: {
    borderBottomWidth: 0,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureInfo: {
    flex: 1,
  },
  featureName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 12,
  },
  actionsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  actionRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
  },
  activityCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  activityRowLast: {
    borderBottomWidth: 0,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: 12,
  },
});
