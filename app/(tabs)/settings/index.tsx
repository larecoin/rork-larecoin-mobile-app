import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Shield, 
  Bell, 
  Fingerprint, 
  HelpCircle, 
  FileText,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Globe,
  Wallet,
  Store
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  colors: typeof import('@/constants/colors').lightTheme;
}

function SettingItem({ 
  icon, 
  label, 
  value, 
  onPress, 
  showArrow = true,
  toggle,
  toggleValue,
  onToggle,
  colors
}: SettingItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={toggle}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.backgroundTertiary }]}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      ) : showArrow ? (
        <ChevronRight size={20} color={colors.textTertiary} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { mode, merchantProfile, colors, themeMode, toggleTheme } = useApp();
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const isDarkMode = themeMode === 'dark';

  const dynamicStyles = useMemo(() => ({
    container: { backgroundColor: colors.background },
    profileSection: { backgroundColor: colors.surface },
    profileName: { color: colors.text },
    profileAddress: { color: colors.textSecondary },
    modeBadge: { backgroundColor: colors.backgroundTertiary },
    sectionTitle: { color: colors.textSecondary },
    sectionContent: { backgroundColor: colors.surface },
    logoutButton: { backgroundColor: colors.error + '15' },
    version: { color: colors.textTertiary },
  }), [colors]);

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} showsVerticalScrollIndicator={false}>
      <View style={[styles.profileSection, dynamicStyles.profileSection]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={styles.avatarText}>
            {mode === 'wallet' ? '👤' : '🏪'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, dynamicStyles.profileName]}>
            {mode === 'wallet' ? 'Personal Wallet' : merchantProfile.name}
          </Text>
          <Text style={[styles.profileAddress, dynamicStyles.profileAddress]}>0xLARE...1a2b3c</Text>
        </View>
        <View style={[styles.modeBadge, dynamicStyles.modeBadge]}>
          {mode === 'wallet' ? (
            <Wallet size={14} color={colors.primary} />
          ) : (
            <Store size={14} color={colors.accent} />
          )}
          <Text style={[
            styles.modeBadgeText,
            { color: mode === 'wallet' ? colors.primary : colors.accent }
          ]}>
            {mode === 'wallet' ? 'Wallet' : 'Merchant'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Account</Text>
        <View style={[styles.sectionContent, dynamicStyles.sectionContent]}>
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            label="Profile"
            onPress={() => router.push('/menu/account-settings')}
            colors={colors}
          />
          <SettingItem
            icon={<Shield size={20} color={colors.accent} />}
            label="Security"
            value="2FA Enabled"
            onPress={() => console.log('Security')}
            colors={colors}
          />
          <SettingItem
            icon={<Fingerprint size={20} color={colors.success} />}
            label="Biometric Login"
            toggle
            toggleValue={biometricEnabled}
            onToggle={setBiometricEnabled}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Appearance</Text>
        <View style={[styles.sectionContent, dynamicStyles.sectionContent]}>
          <SettingItem
            icon={isDarkMode ? <Moon size={20} color={colors.primaryLight} /> : <Sun size={20} color={colors.warning} />}
            label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
            value={isDarkMode ? 'On' : 'Off'}
            toggle
            toggleValue={isDarkMode}
            onToggle={toggleTheme}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Preferences</Text>
        <View style={[styles.sectionContent, dynamicStyles.sectionContent]}>
          <SettingItem
            icon={<Bell size={20} color={colors.warning} />}
            label="Notifications"
            toggle
            toggleValue={notificationsEnabled}
            onToggle={setNotificationsEnabled}
            colors={colors}
          />
          <SettingItem
            icon={<Globe size={20} color={colors.textSecondary} />}
            label="Language"
            value="English"
            onPress={() => console.log('Language')}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Support</Text>
        <View style={[styles.sectionContent, dynamicStyles.sectionContent]}>
          <SettingItem
            icon={<HelpCircle size={20} color={colors.accent} />}
            label="Help Center"
            onPress={() => console.log('Help')}
            colors={colors}
          />
          <SettingItem
            icon={<FileText size={20} color={colors.textSecondary} />}
            label="Terms & Privacy"
            onPress={() => console.log('Terms')}
            colors={colors}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutButton, dynamicStyles.logoutButton]}>
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, dynamicStyles.version]}>Larecoin v1.0.0</Text>
      
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  profileAddress: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 32,
    padding: 16,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 24,
  },
});
