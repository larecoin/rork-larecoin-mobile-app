import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Store, Building2, FileText, CreditCard, CheckCircle, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const steps = [
  { id: 1, title: 'Business Info', description: 'Company details', completed: true },
  { id: 2, title: 'Documents', description: 'Upload verification', completed: true },
  { id: 3, title: 'Bank Account', description: 'Payment setup', completed: false },
  { id: 4, title: 'Review', description: 'Final approval', completed: false },
];

export default function RegisterMerchantScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Register Merchant' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Store size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Become a Merchant</Text>
          <Text style={styles.heroSubtitle}>Start accepting crypto payments and grow your business</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Registration Progress</Text>
          <View style={[styles.stepsCard, { backgroundColor: colors.surface }]}>
            {steps.map((step, index) => (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.stepRow,
                  { borderBottomColor: colors.border },
                  index === steps.length - 1 && styles.stepRowLast,
                ]}
              >
                <View style={[
                  styles.stepNumber,
                  { backgroundColor: step.completed ? colors.success : colors.textTertiary + '30' }
                ]}>
                  {step.completed ? (
                    <CheckCircle size={16} color="#FFF" />
                  ) : (
                    <Text style={styles.stepNumberText}>{step.id}</Text>
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDescription, { color: colors.textTertiary }]}>{step.description}</Text>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Benefits</Text>
          <View style={styles.benefitsGrid}>
            <View style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <CreditCard size={24} color={colors.primary} />
              <Text style={[styles.benefitTitle, { color: colors.text }]}>Low Fees</Text>
              <Text style={[styles.benefitDescription, { color: colors.textTertiary }]}>Only 1% per transaction</Text>
            </View>
            <View style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <Building2 size={24} color={colors.primary} />
              <Text style={[styles.benefitTitle, { color: colors.text }]}>Fast Settlement</Text>
              <Text style={[styles.benefitDescription, { color: colors.textTertiary }]}>Same-day payouts</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.continueButtonText}>Continue Registration</Text>
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
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  stepsCard: { borderRadius: 16, overflow: 'hidden' },
  stepRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  stepRowLast: { borderBottomWidth: 0 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNumberText: { color: '#FFF', fontSize: 14, fontWeight: '600' as const },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  stepDescription: { fontSize: 12 },
  benefitsGrid: { flexDirection: 'row', gap: 12 },
  benefitCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  benefitTitle: { fontSize: 14, fontWeight: '600' as const, marginTop: 10, marginBottom: 4 },
  benefitDescription: { fontSize: 12, textAlign: 'center' },
  continueButton: { margin: 16, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  continueButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
});
