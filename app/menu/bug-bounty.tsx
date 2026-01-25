import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bug, Award, Shield, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const bounties = [
  { id: '1', title: 'Critical Security Vulnerability', reward: '$10,000 - $50,000', severity: 'critical', status: 'open' },
  { id: '2', title: 'High Impact Bug', reward: '$5,000 - $10,000', severity: 'high', status: 'open' },
  { id: '3', title: 'Medium Impact Bug', reward: '$1,000 - $5,000', severity: 'medium', status: 'open' },
  { id: '4', title: 'Low Impact Bug', reward: '$100 - $1,000', severity: 'low', status: 'open' },
];

const mySubmissions = [
  { id: '1', title: 'XSS Vulnerability in Profile', reward: '$2,500', status: 'paid', date: 'Jan 15, 2026' },
  { id: '2', title: 'API Rate Limit Bypass', reward: '$1,000', status: 'reviewing', date: 'Jan 20, 2026' },
];

const stats = [
  { label: 'Total Paid', value: '$3,500' },
  { label: 'Submissions', value: '5' },
  { label: 'Accepted', value: '2' },
];

export default function BugBountyScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return { icon: CheckCircle, color: colors.success };
      case 'reviewing': return { icon: Clock, color: colors.warning };
      default: return { icon: AlertTriangle, color: colors.textTertiary };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Bug Bounty' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Bug size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Bug Bounty Program</Text>
          <Text style={styles.heroSubtitle}>
            Help us keep Larecoin secure and earn rewards for finding vulnerabilities
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Active Bounties</Text>
          {bounties.map((bounty) => (
            <TouchableOpacity
              key={bounty.id}
              style={[styles.bountyCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(bounty.severity) }]} />
              <View style={styles.bountyContent}>
                <View style={styles.bountyHeader}>
                  <Text style={[styles.bountyTitle, { color: colors.text }]}>{bounty.title}</Text>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(bounty.severity) + '20' }]}>
                    <Text style={[styles.severityText, { color: getSeverityColor(bounty.severity) }]}>
                      {bounty.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.rewardRow}>
                  <DollarSign size={16} color={colors.success} />
                  <Text style={[styles.rewardText, { color: colors.success }]}>{bounty.reward}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Submissions</Text>
          {mySubmissions.map((submission) => {
            const status = getStatusIcon(submission.status);
            return (
              <View
                key={submission.id}
                style={[styles.submissionCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.submissionInfo}>
                  <Text style={[styles.submissionTitle, { color: colors.text }]}>{submission.title}</Text>
                  <Text style={[styles.submissionDate, { color: colors.textTertiary }]}>{submission.date}</Text>
                </View>
                <View style={styles.submissionRight}>
                  <Text style={[styles.submissionReward, { color: colors.success }]}>{submission.reward}</Text>
                  <View style={styles.statusRow}>
                    <status.icon size={14} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{submission.status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]}>
          <Shield size={20} color="#FFF" />
          <Text style={styles.submitButtonText}>Submit a Bug Report</Text>
        </TouchableOpacity>

        <View style={[styles.rulesCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rulesTitle, { color: colors.text }]}>Program Rules</Text>
          <View style={styles.rulesList}>
            <Text style={[styles.ruleItem, { color: colors.textSecondary }]}>• Report vulnerabilities responsibly</Text>
            <Text style={[styles.ruleItem, { color: colors.textSecondary }]}>• Don't access or modify other users' data</Text>
            <Text style={[styles.ruleItem, { color: colors.textSecondary }]}>• Provide detailed reproduction steps</Text>
            <Text style={[styles.ruleItem, { color: colors.textSecondary }]}>• Allow up to 90 days for fixes before disclosure</Text>
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
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  bountyCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  severityIndicator: {
    width: 4,
  },
  bountyContent: {
    flex: 1,
    padding: 14,
  },
  bountyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bountyTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  submissionCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  submissionInfo: {
    flex: 1,
  },
  submissionTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 12,
  },
  submissionRight: {
    alignItems: 'flex-end',
  },
  submissionReward: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'capitalize',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  rulesCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  rulesList: {
    gap: 8,
  },
  ruleItem: {
    fontSize: 13,
    lineHeight: 18,
  },
});
