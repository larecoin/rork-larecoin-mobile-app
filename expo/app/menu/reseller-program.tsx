import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Award, Users, DollarSign, TrendingUp, ChevronRight, Gift } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const tiers = [
  { name: 'Bronze', commission: '10%', requirements: '0-10 referrals', current: true },
  { name: 'Silver', commission: '15%', requirements: '11-50 referrals', current: false },
  { name: 'Gold', commission: '20%', requirements: '51-100 referrals', current: false },
  { name: 'Platinum', commission: '25%', requirements: '100+ referrals', current: false },
];

const stats = [
  { label: 'Referrals', value: '8', icon: Users },
  { label: 'Earnings', value: '$1,240', icon: DollarSign },
  { label: 'Commission', value: '10%', icon: TrendingUp },
];

export default function ResellerProgramScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Reseller Program' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Award size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Reseller Program</Text>
          <Text style={styles.heroSubtitle}>Earn commissions by referring customers to Larecoin</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <stat.icon size={20} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Commission Tiers</Text>
          <View style={[styles.tiersCard, { backgroundColor: colors.surface }]}>
            {tiers.map((tier, index) => (
              <View
                key={tier.name}
                style={[
                  styles.tierRow,
                  { borderBottomColor: colors.border },
                  index === tiers.length - 1 && styles.tierRowLast,
                  tier.current && { backgroundColor: colors.primary + '10' },
                ]}
              >
                <View style={[
                  styles.tierBadge,
                  { backgroundColor: tier.current ? colors.primary : colors.textTertiary + '30' }
                ]}>
                  <Award size={16} color={tier.current ? '#FFF' : colors.textTertiary} />
                </View>
                <View style={styles.tierInfo}>
                  <Text style={[styles.tierName, { color: tier.current ? colors.primary : colors.text }]}>
                    {tier.name} {tier.current && '(Current)'}
                  </Text>
                  <Text style={[styles.tierRequirements, { color: colors.textTertiary }]}>{tier.requirements}</Text>
                </View>
                <View style={[styles.commissionBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.commissionText, { color: colors.success }]}>{tier.commission}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.inviteCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.inviteIcon, { backgroundColor: colors.primary + '15' }]}>
            <Gift size={24} color={colors.primary} />
          </View>
          <View style={styles.inviteInfo}>
            <Text style={[styles.inviteTitle, { color: colors.text }]}>Invite Friends</Text>
            <Text style={[styles.inviteDescription, { color: colors.textTertiary }]}>Share your unique link</Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  statCard: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' as const, marginTop: 8 },
  statLabel: { fontSize: 11, marginTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  tiersCard: { borderRadius: 16, overflow: 'hidden' },
  tierRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  tierRowLast: { borderBottomWidth: 0 },
  tierBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tierInfo: { flex: 1 },
  tierName: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  tierRequirements: { fontSize: 12 },
  commissionBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  commissionText: { fontSize: 13, fontWeight: '700' as const },
  inviteCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, gap: 14 },
  inviteIcon: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  inviteInfo: { flex: 1 },
  inviteTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  inviteDescription: { fontSize: 13 },
});
