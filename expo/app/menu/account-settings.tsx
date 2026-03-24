import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { User, Mail, Phone, MapPin, Shield, Bell, Lock, Camera, ChevronRight, Check, Gauge, DollarSign, Globe, Eye, Smartphone, Rss, Monitor, Fingerprint, Key, AlertTriangle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function AccountSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Main Street, New York, NY 10001');
  const [isEditing, setIsEditing] = useState(false);

  const settingsOptions = [
    { id: 'security', label: 'Security Settings', icon: Shield, description: 'Password, 2FA, biometrics' },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, description: 'Push, email, SMS alerts' },
    { id: 'privacy', label: 'Privacy Settings', icon: Lock, description: 'Data sharing, visibility' },
  ];

  const accountOptions = [
    { id: 'limits', label: 'Limits', icon: Gauge, description: 'Trading, withdrawal & deposit limits' },
    { id: 'native-currency', label: 'Native Currency', icon: DollarSign, description: 'USD', value: 'USD' },
    { id: 'update-address', label: 'Update Address', icon: MapPin, description: 'Billing & shipping addresses' },
    { id: 'language', label: 'Language', icon: Globe, description: 'English (US)', value: 'English' },
    { id: 'privacy', label: 'Privacy', icon: Eye, description: 'Profile visibility, data sharing' },
    { id: 'phone-numbers', label: 'Phone Numbers', icon: Smartphone, description: 'Manage linked phone numbers' },
    { id: 'notification-settings', label: 'Notification Settings', icon: Bell, description: 'Push, email, SMS preferences' },
    { id: 'feed-settings', label: 'Feed Settings', icon: Rss, description: 'Content preferences, filters' },
    { id: 'display-settings', label: 'Display Settings', icon: Monitor, description: 'Theme, appearance, layout' },
  ];

  const securityOptions = [
    { id: 'pin', label: 'Set PIN', icon: Key, description: 'Create or change your PIN' },
    { id: 'biometrics', label: 'Face ID / Fingerprint', icon: Fingerprint, description: 'Enable biometric authentication' },
    { id: '2fa', label: 'Two-Factor Authentication', icon: Shield, description: 'Authenticator app, SMS codes' },
    { id: 'login-alerts', label: 'Login Alerts', icon: AlertTriangle, description: 'Get notified of new logins' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Account Settings' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
              <Camera size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{email}</Text>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Personal Information</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <User size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={isEditing}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <Mail size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Email</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  keyboardType="email-address"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <Phone size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Phone</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputRowLast}>
              <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                <MapPin size={18} color={colors.primary} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Address</Text>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Settings</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.settingsRow,
                  { borderBottomColor: colors.border },
                  index === settingsOptions.length - 1 && styles.settingsRowLast,
                ]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                  <option.icon size={18} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>{option.label}</Text>
                  <Text style={[styles.settingsDescription, { color: colors.textTertiary }]}>{option.description}</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account Status</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: colors.text }]}>Email Verified</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Check size={14} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>Verified</Text>
              </View>
            </View>
            <View style={[styles.statusRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.statusLabel, { color: colors.text }]}>KYC Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Check size={14} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>Approved</Text>
              </View>
            </View>
            <View style={[styles.statusRow, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <Text style={[styles.statusLabel, { color: colors.text }]}>2FA Enabled</Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Check size={14} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {accountOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.settingsRow,
                  { borderBottomColor: colors.border },
                  index === accountOptions.length - 1 && styles.settingsRowLast,
                ]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: colors.primary + '15' }]}>
                  <option.icon size={18} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>{option.label}</Text>
                  <Text style={[styles.settingsDescription, { color: colors.textTertiary }]}>{option.description}</Text>
                </View>
                {option.value ? (
                  <Text style={[styles.optionValue, { color: colors.textSecondary }]}>{option.value}</Text>
                ) : null}
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Security Settings</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {securityOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.settingsRow,
                  { borderBottomColor: colors.border },
                  index === securityOptions.length - 1 && styles.settingsRowLast,
                ]}
              >
                <View style={[styles.iconWrapper, { backgroundColor: colors.warning + '15' }]}>
                  <option.icon size={18} color={colors.warning} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={[styles.settingsLabel, { color: colors.text }]}>{option.label}</Text>
                  <Text style={[styles.settingsDescription, { color: colors.textTertiary }]}>{option.description}</Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  inputRowLast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    fontWeight: '500' as const,
    padding: 0,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  optionValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    marginRight: 8,
  },
});
