import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, Plus, Clock, CheckCircle, AlertCircle, Users, DollarSign, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const escrows = [
  { id: 'ESC-001', title: 'NFT Purchase from @artist', amount: '$2,500', status: 'active', parties: 2, created: 'Jan 20, 2026' },
  { id: 'ESC-002', title: 'Freelance Project Payment', amount: '$1,200', status: 'pending_release', parties: 2, created: 'Jan 18, 2026' },
  { id: 'ESC-003', title: 'Domain Sale', amount: '$5,000', status: 'completed', parties: 2, created: 'Jan 10, 2026' },
  { id: 'ESC-004', title: 'Equipment Purchase', amount: '$850', status: 'disputed', parties: 2, created: 'Jan 5, 2026' },
];

export default function EscrowManagerScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active': return { icon: Clock, color: colors.primary, label: 'Active' };
      case 'pending_release': return { icon: AlertCircle, color: colors.warning, label: 'Pending Release' };
      case 'completed': return { icon: CheckCircle, color: colors.success, label: 'Completed' };
      case 'disputed': return { icon: AlertCircle, color: colors.error, label: 'Disputed' };
      default: return { icon: Shield, color: colors.textTertiary, label: status };
    }
  };

  const stats = [
    { label: 'Active', value: '2', color: colors.primary },
    { label: 'Completed', value: '8', color: colors.success },
    { label: 'Total Value', value: '$15K', color: colors.text },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Escrow Manager' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Shield size={40} color="#FFF" />
          <Text style={styles.heroTitle}>Secure Escrow</Text>
          <Text style={styles.heroSubtitle}>
            <Text>Protected transactions with smart contract escrow</Text>
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Create New Escrow</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Escrows</Text>
          {escrows.map((escrow) => {
            const status = getStatusInfo(escrow.status);
            return (
              <TouchableOpacity
                key={escrow.id}
                style={[styles.escrowCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.escrowHeader}>
                  <View style={[styles.escrowIcon, { backgroundColor: status.color + '15' }]}>
                    <status.icon size={20} color={status.color} />
                  </View>
                  <View style={styles.escrowInfo}>
                    <Text style={[styles.escrowTitle, { color: colors.text }]}>{escrow.title}</Text>
                    <Text style={[styles.escrowId, { color: colors.textTertiary }]}>{escrow.id}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textTertiary} />
                </View>
                <View style={[styles.escrowDetails, { borderTopColor: colors.border }]}>
                  <View style={styles.detailItem}>
                    <DollarSign size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{escrow.amount}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{escrow.parties} parties</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Shield size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>How Escrow Works</Text>
            <Text style={[styles.infoDescription, { color: colors.textTertiary }]}>
              <Text>Funds are held securely until both parties confirm the transaction is complete. Smart contracts ensure trustless execution.</Text>
            </Text>
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
  },
  statCard: {
    flex: 1,
    padding: 14,
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
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  escrowCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  escrowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  escrowIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  escrowInfo: {
    flex: 1,
  },
  escrowTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  escrowId: {
    fontSize: 12,
  },
  escrowDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  statusBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
