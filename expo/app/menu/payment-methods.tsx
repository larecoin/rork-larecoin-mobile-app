import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Building2, Smartphone, Plus, Check, MoreVertical, Shield } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const paymentMethods = [
  { id: '1', type: 'card', name: 'Visa •••• 4532', expiry: '12/27', isDefault: true, icon: CreditCard },
  { id: '2', type: 'card', name: 'Mastercard •••• 8901', expiry: '03/26', isDefault: false, icon: CreditCard },
  { id: '3', type: 'bank', name: 'Chase Bank •••• 6789', account: 'Checking', isDefault: false, icon: Building2 },
  { id: '4', type: 'wallet', name: 'Apple Pay', account: 'Connected', isDefault: false, icon: Smartphone },
];

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Payment Methods' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={[styles.addCard, { backgroundColor: colors.primary }]}>
          <Plus size={24} color="#FFF" />
          <View style={styles.addCardInfo}>
            <Text style={styles.addCardTitle}>Add Payment Method</Text>
            <Text style={styles.addCardSubtitle}>Card, bank account, or digital wallet</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Saved Methods</Text>
          {paymentMethods.map((method) => (
            <View
              key={method.id}
              style={[styles.methodCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.methodIcon, { backgroundColor: colors.primary + '15' }]}>
                <method.icon size={22} color={colors.primary} />
              </View>
              <View style={styles.methodInfo}>
                <View style={styles.methodHeader}>
                  <Text style={[styles.methodName, { color: colors.text }]}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.success + '20' }]}>
                      <Check size={12} color={colors.success} />
                      <Text style={[styles.defaultText, { color: colors.success }]}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.methodDetail, { color: colors.textTertiary }]}>
                  {method.expiry || method.account}
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreVertical size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={[styles.securityCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.securityIcon, { backgroundColor: colors.success + '15' }]}>
            <Shield size={24} color={colors.success} />
          </View>
          <View style={styles.securityInfo}>
            <Text style={[styles.securityTitle, { color: colors.text }]}>Secure Payments</Text>
            <Text style={[styles.securityDescription, { color: colors.textTertiary }]}>
              <Text>Your payment information is encrypted and securely stored. We never share your details with third parties.</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Limits</Text>
          <View style={[styles.limitsCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.limitRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.limitLabel, { color: colors.text }]}>Daily Purchase Limit</Text>
              <Text style={[styles.limitValue, { color: colors.primary }]}>$10,000</Text>
            </View>
            <View style={[styles.limitRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.limitLabel, { color: colors.text }]}>Weekly Purchase Limit</Text>
              <Text style={[styles.limitValue, { color: colors.primary }]}>$50,000</Text>
            </View>
            <View style={styles.limitRowLast}>
              <Text style={[styles.limitLabel, { color: colors.text }]}>Monthly Purchase Limit</Text>
              <Text style={[styles.limitValue, { color: colors.primary }]}>$200,000</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.increaseLimitButton, { borderColor: colors.primary }]}>
            <Text style={[styles.increaseLimitText, { color: colors.primary }]}>Request Higher Limits</Text>
          </TouchableOpacity>
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
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  addCardInfo: {
    flex: 1,
  },
  addCardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  addCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
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
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  methodDetail: {
    fontSize: 13,
  },
  moreButton: {
    padding: 4,
  },
  securityCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  limitsCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  limitRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  limitLabel: {
    fontSize: 14,
  },
  limitValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  increaseLimitButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  increaseLimitText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
