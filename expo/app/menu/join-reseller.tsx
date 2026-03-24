import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserPlus, Check, DollarSign, Users, TrendingUp, Award } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const benefits = [
  { icon: DollarSign, title: 'Earn up to 25% Commission', description: 'On every referral purchase' },
  { icon: Users, title: 'Unlimited Referrals', description: 'No cap on earnings' },
  { icon: TrendingUp, title: 'Real-time Dashboard', description: 'Track your performance' },
  { icon: Award, title: 'Exclusive Rewards', description: 'Bonuses for top performers' },
];

const requirements = [
  'Active Larecoin account',
  'Completed KYC verification',
  'Minimum 30 days account age',
  'No policy violations',
];

export default function JoinResellerScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Join Reseller Program' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <UserPlus size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Become a Reseller</Text>
          <Text style={styles.heroSubtitle}>Turn your network into earnings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Benefits</Text>
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <View key={index} style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
                <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '15' }]}>
                  <benefit.icon size={22} color={colors.primary} />
                </View>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>{benefit.title}</Text>
                <Text style={[styles.benefitDescription, { color: colors.textTertiary }]}>{benefit.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Requirements</Text>
          <View style={[styles.requirementsCard, { backgroundColor: colors.surface }]}>
            {requirements.map((req, index) => (
              <View
                key={index}
                style={[
                  styles.requirementRow,
                  { borderBottomColor: colors.border },
                  index === requirements.length - 1 && styles.requirementRowLast,
                ]}
              >
                <View style={[styles.checkIcon, { backgroundColor: colors.success + '20' }]}>
                  <Check size={14} color={colors.success} />
                </View>
                <Text style={[styles.requirementText, { color: colors.text }]}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
          By applying, you agree to our Reseller Program Terms and Conditions.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  heroCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginTop: 12, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  benefitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  benefitCard: { width: '48%', padding: 14, borderRadius: 12 },
  benefitIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  benefitTitle: { fontSize: 13, fontWeight: '600' as const, marginBottom: 4 },
  benefitDescription: { fontSize: 11 },
  requirementsCard: { borderRadius: 16, overflow: 'hidden' },
  requirementRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  requirementRowLast: { borderBottomWidth: 0 },
  checkIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  requirementText: { fontSize: 14 },
  applyButton: { margin: 16, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
  disclaimer: { textAlign: 'center', fontSize: 12, paddingHorizontal: 32, marginTop: 8 },
});
