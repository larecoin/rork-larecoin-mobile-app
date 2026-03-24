import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Webhook, Plus, Activity, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const webhooks = [
  { id: '1', name: 'Payment Received', url: 'https://api.mysite.com/webhook', status: 'active', events: 1250 },
  { id: '2', name: 'Order Completed', url: 'https://api.mysite.com/orders', status: 'active', events: 890 },
  { id: '3', name: 'User Signup', url: 'https://api.mysite.com/users', status: 'error', events: 0 },
];

export default function ApisHooksScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: "API's & Hooks" }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Webhook size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Webhooks & Integrations</Text>
          <Text style={styles.heroSubtitle}>Connect your apps with real-time event notifications</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Webhook size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Webhooks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Activity size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>2.1K</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Events</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Create Webhook</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Webhooks</Text>
          {webhooks.map((webhook) => (
            <TouchableOpacity
              key={webhook.id}
              style={[styles.webhookCard, { backgroundColor: colors.surface }]}
            >
              <View style={[
                styles.webhookStatus,
                { backgroundColor: webhook.status === 'active' ? colors.success + '15' : colors.error + '15' }
              ]}>
                {webhook.status === 'active' ? (
                  <CheckCircle size={18} color={colors.success} />
                ) : (
                  <AlertCircle size={18} color={colors.error} />
                )}
              </View>
              <View style={styles.webhookInfo}>
                <Text style={[styles.webhookName, { color: colors.text }]}>{webhook.name}</Text>
                <Text style={[styles.webhookUrl, { color: colors.textTertiary }]} numberOfLines={1}>{webhook.url}</Text>
                <Text style={[styles.webhookEvents, { color: colors.textTertiary }]}>{webhook.events} events sent</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  heroCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginTop: 12, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700' as const, marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, paddingVertical: 16, borderRadius: 14, gap: 10 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  webhookCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 10 },
  webhookStatus: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  webhookInfo: { flex: 1 },
  webhookName: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  webhookUrl: { fontSize: 12, marginBottom: 2 },
  webhookEvents: { fontSize: 11 },
});
