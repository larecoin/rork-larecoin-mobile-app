import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Bell, BellRing, Mail, Smartphone, MessageSquare,
  TrendingUp, DollarSign, Users, Shield, Gift, Megaphone, Volume2, VolumeX
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface NotificationSetting {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  push: boolean;
  email: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [allNotifications, setAllNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'transactions', title: 'Transactions', subtitle: 'Payments, transfers, and receipts', icon: DollarSign, color: '#10B981', push: true, email: true },
    { id: 'price_alerts', title: 'Price Alerts', subtitle: 'Market movements and targets', icon: TrendingUp, color: '#F59E0B', push: true, email: false },
    { id: 'security', title: 'Security Alerts', subtitle: 'Login attempts and changes', icon: Shield, color: '#EF4444', push: true, email: true },
    { id: 'social', title: 'Social Activity', subtitle: 'Likes, comments, and follows', icon: Users, color: '#8B5CF6', push: true, email: false },
    { id: 'messages', title: 'Messages', subtitle: 'Direct messages and chats', icon: MessageSquare, color: '#3B82F6', push: true, email: false },
    { id: 'promotions', title: 'Promotions', subtitle: 'Offers and special deals', icon: Gift, color: '#EC4899', push: false, email: true },
    { id: 'announcements', title: 'Announcements', subtitle: 'Product updates and news', icon: Megaphone, color: '#06B6D4', push: true, email: true },
  ]);

  const togglePush = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, push: !s.push } : s
    ));
  };

  const toggleEmail = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, email: !s.email } : s
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.masterToggle}>
          <View style={styles.masterToggleRow}>
            <View style={[styles.masterIcon, { backgroundColor: Colors.primary + '20' }]}>
              {allNotifications ? (
                <BellRing size={24} color={Colors.primary} />
              ) : (
                <Bell size={24} color={Colors.textTertiary} />
              )}
            </View>
            <View style={styles.masterContent}>
              <Text style={styles.masterTitle}>All Notifications</Text>
              <Text style={styles.masterSubtitle}>
                {allNotifications ? 'Notifications are enabled' : 'All notifications are muted'}
              </Text>
            </View>
            <Switch
              value={allNotifications}
              onValueChange={setAllNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
              thumbColor={allNotifications ? Colors.primary : Colors.textTertiary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          <View style={styles.soundCard}>
            <View style={styles.soundRow}>
              <View style={[styles.soundIcon, { backgroundColor: '#F59E0B' + '20' }]}>
                {soundEnabled ? (
                  <Volume2 size={20} color="#F59E0B" />
                ) : (
                  <VolumeX size={20} color={Colors.textTertiary} />
                )}
              </View>
              <View style={styles.soundContent}>
                <Text style={styles.soundTitle}>Notification Sound</Text>
                <Text style={styles.soundSubtitle}>Play sound for notifications</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={soundEnabled ? Colors.primary : Colors.textTertiary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            <View style={styles.columnLabels}>
              <View style={styles.labelContainer}>
                <Smartphone size={14} color={Colors.textSecondary} />
                <Text style={styles.columnLabel}>Push</Text>
              </View>
              <View style={styles.labelContainer}>
                <Mail size={14} color={Colors.textSecondary} />
                <Text style={styles.columnLabel}>Email</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsCard}>
            {settings.map((setting, index) => (
              <View 
                key={setting.id}
                style={[
                  styles.settingRow,
                  index === settings.length - 1 && styles.settingRowLast
                ]}
              >
                <View style={[styles.settingIcon, { backgroundColor: setting.color + '15' }]}>
                  <setting.icon size={20} color={setting.color} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                </View>
                <View style={styles.togglesContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.toggleButton,
                      setting.push && styles.toggleButtonActive
                    ]}
                    onPress={() => togglePush(setting.id)}
                  >
                    <Smartphone size={14} color={setting.push ? Colors.primary : Colors.textTertiary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.toggleButton,
                      setting.email && styles.toggleButtonActive
                    ]}
                    onPress={() => toggleEmail(setting.id)}
                  >
                    <Mail size={14} color={setting.email ? Colors.primary : Colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <TouchableOpacity style={styles.quietHoursCard}>
            <View style={[styles.quietIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
              <Bell size={20} color="#8B5CF6" />
            </View>
            <View style={styles.quietContent}>
              <Text style={styles.quietTitle}>Do Not Disturb</Text>
              <Text style={styles.quietSubtitle}>Schedule quiet hours</Text>
            </View>
            <View style={styles.quietTime}>
              <Text style={styles.quietTimeText}>10 PM - 8 AM</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            <Text>Push notifications require the Larecoin app to be installed on your device. Email notifications will be sent to your registered email address.</Text>
          </Text>
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
  masterToggle: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  masterToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masterIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterContent: {
    flex: 1,
    marginLeft: 14,
  },
  masterTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  masterSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  columnLabels: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 44,
    justifyContent: 'center',
  },
  columnLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  soundCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundContent: {
    flex: 1,
    marginLeft: 12,
  },
  soundTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  soundSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingRowLast: {
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
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  togglesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary + '15',
  },
  quietHoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  quietIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietContent: {
    flex: 1,
    marginLeft: 12,
  },
  quietTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  quietSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quietTime: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  quietTimeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
