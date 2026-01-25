import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, Calendar, ShoppingBag, Globe, AlertCircle, Check, Info } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface LimitSetting {
  id: string;
  title: string;
  description: string;
  currentLimit: number;
  maxLimit: number;
  enabled: boolean;
  icon: typeof DollarSign;
  color: string;
}

export default function TransactionLimitsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();

  const [limits, setLimits] = useState<LimitSetting[]>([
    {
      id: 'daily',
      title: 'Daily Spending Limit',
      description: 'Maximum amount you can spend per day',
      currentLimit: 2500,
      maxLimit: 10000,
      enabled: true,
      icon: Calendar,
      color: '#3B82F6',
    },
    {
      id: 'per-transaction',
      title: 'Per Transaction Limit',
      description: 'Maximum amount for a single transaction',
      currentLimit: 1000,
      maxLimit: 5000,
      enabled: true,
      icon: DollarSign,
      color: '#10B981',
    },
    {
      id: 'monthly',
      title: 'Monthly Spending Limit',
      description: 'Maximum amount you can spend per month',
      currentLimit: 25000,
      maxLimit: 100000,
      enabled: true,
      icon: ShoppingBag,
      color: '#8B5CF6',
    },
    {
      id: 'international',
      title: 'International Transaction Limit',
      description: 'Maximum for international purchases',
      currentLimit: 500,
      maxLimit: 5000,
      enabled: false,
      icon: Globe,
      color: '#F59E0B',
    },
  ]);

  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleToggleLimit = (id: string) => {
    setLimits(limits.map(limit => 
      limit.id === id ? { ...limit, enabled: !limit.enabled } : limit
    ));
  };

  const handleEditLimit = (id: string) => {
    const limit = limits.find(l => l.id === id);
    if (limit) {
      setEditValue(limit.currentLimit.toString());
      setEditingLimit(id);
    }
  };

  const handleSaveLimit = (id: string) => {
    const numValue = parseInt(editValue, 10);
    const limit = limits.find(l => l.id === id);
    if (limit && numValue > 0 && numValue <= limit.maxLimit) {
      setLimits(limits.map(l => 
        l.id === id ? { ...l, currentLimit: numValue } : l
      ));
    }
    setEditingLimit(null);
    setEditValue('');
  };

  const spendingStats = {
    todaySpent: 347.50,
    monthSpent: 4280.00,
    dailyLimit: limits.find(l => l.id === 'daily')?.currentLimit || 2500,
    monthlyLimit: limits.find(l => l.id === 'monthly')?.currentLimit || 25000,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transaction Limits</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.overviewCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.overviewTitle, { color: colors.text }]}>Spending Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStatItem}>
              <Text style={[styles.overviewStatLabel, { color: colors.textSecondary }]}>Today</Text>
              <Text style={[styles.overviewStatValue, { color: colors.text }]}>
                ${spendingStats.todaySpent.toLocaleString()}
              </Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: colors.primary,
                      width: `${Math.min((spendingStats.todaySpent / spendingStats.dailyLimit) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.overviewStatLimit, { color: colors.textTertiary }]}>
                of ${spendingStats.dailyLimit.toLocaleString()} limit
              </Text>
            </View>
            <View style={[styles.overviewDivider, { backgroundColor: colors.border }]} />
            <View style={styles.overviewStatItem}>
              <Text style={[styles.overviewStatLabel, { color: colors.textSecondary }]}>This Month</Text>
              <Text style={[styles.overviewStatValue, { color: colors.text }]}>
                ${spendingStats.monthSpent.toLocaleString()}
              </Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: '#8B5CF6',
                      width: `${Math.min((spendingStats.monthSpent / spendingStats.monthlyLimit) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.overviewStatLimit, { color: colors.textTertiary }]}>
                of ${spendingStats.monthlyLimit.toLocaleString()} limit
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.limitsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending Limits</Text>
          
          {limits.map(limit => (
            <View key={limit.id} style={[styles.limitCard, { backgroundColor: colors.surface }]}>
              <View style={styles.limitHeader}>
                <View style={[styles.limitIcon, { backgroundColor: limit.color + '20' }]}>
                  <limit.icon size={20} color={limit.color} />
                </View>
                <View style={styles.limitInfo}>
                  <Text style={[styles.limitTitle, { color: colors.text }]}>{limit.title}</Text>
                  <Text style={[styles.limitDescription, { color: colors.textSecondary }]}>{limit.description}</Text>
                </View>
                <Switch
                  value={limit.enabled}
                  onValueChange={() => handleToggleLimit(limit.id)}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={limit.enabled ? colors.primary : colors.textTertiary}
                />
              </View>
              
              {limit.enabled && (
                <View style={styles.limitValueSection}>
                  {editingLimit === limit.id ? (
                    <View style={styles.editLimitContainer}>
                      <View style={[styles.editInputWrapper, { backgroundColor: colors.background }]}>
                        <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
                        <TextInput
                          style={[styles.editInput, { color: colors.text }]}
                          value={editValue}
                          onChangeText={setEditValue}
                          keyboardType="numeric"
                          autoFocus
                        />
                      </View>
                      <View style={styles.editActions}>
                        <TouchableOpacity 
                          style={[styles.editCancelBtn, { backgroundColor: colors.background }]}
                          onPress={() => setEditingLimit(null)}
                        >
                          <Text style={[styles.editCancelText, { color: colors.textSecondary }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.editSaveBtn, { backgroundColor: colors.primary }]}
                          onPress={() => handleSaveLimit(limit.id)}
                        >
                          <Check size={16} color="#FFFFFF" />
                          <Text style={styles.editSaveText}>Save</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.maxLimitNote, { color: colors.textTertiary }]}>
                        Maximum: ${limit.maxLimit.toLocaleString()}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={[styles.currentLimitBox, { backgroundColor: colors.background }]}
                      onPress={() => handleEditLimit(limit.id)}
                    >
                      <Text style={[styles.currentLimitLabel, { color: colors.textSecondary }]}>Current Limit</Text>
                      <Text style={[styles.currentLimitValue, { color: colors.text }]}>
                        ${limit.currentLimit.toLocaleString()}
                      </Text>
                      <Text style={[styles.tapToEdit, { color: colors.primary }]}>Tap to edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: '#FEF3C7' }]}>
          <Info size={20} color="#D97706" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>About Transaction Limits</Text>
            <Text style={styles.infoText}>
              Transaction limits help protect your account from unauthorized spending. 
              You can adjust these limits at any time. Higher limits may require additional verification.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
  },
  overviewStatItem: {
    flex: 1,
  },
  overviewDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  overviewStatLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  overviewStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  overviewStatLimit: {
    fontSize: 11,
  },
  limitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 14,
  },
  limitCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  limitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitInfo: {
    flex: 1,
    marginLeft: 12,
  },
  limitTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  limitDescription: {
    fontSize: 12,
  },
  limitValueSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  currentLimitBox: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  currentLimitLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  currentLimitValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  tapToEdit: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  editLimitContainer: {
    gap: 12,
  },
  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600' as const,
    marginRight: 4,
  },
  editInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600' as const,
  },
  editActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editCancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editCancelText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  editSaveBtn: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  maxLimitNote: {
    fontSize: 11,
    textAlign: 'center' as const,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#92400E',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
});
