import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gift, Users, DollarSign, TrendingUp, Copy, Share2, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const recentReferrals = [
  { id: '1', name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', earned: '$10', status: 'completed', date: 'Jan 20' },
  { id: '2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', earned: '$10', status: 'pending', date: 'Jan 18' },
  { id: '3', name: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', earned: '$10', status: 'completed', date: 'Jan 15' },
];

const tiers = [
  { name: 'Bronze', referrals: '0-10', bonus: '5%', current: true },
  { name: 'Silver', referrals: '11-50', bonus: '10%', current: false },
  { name: 'Gold', referrals: '51-100', bonus: '15%', current: false },
  { name: 'Platinum', referrals: '100+', bonus: '20%', current: false },
];

export default function ReferralsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Referrals' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Gift size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Earn Together</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends and earn $10 for each successful referral
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Users size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Referrals</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <DollarSign size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>$240</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Earned</Text>
          </View>
        </View>

        <View style={[styles.codeCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.codeLabel, { color: colors.textTertiary }]}>Your Referral Code</Text>
          <View style={styles.codeRow}>
            <Text style={[styles.codeText, { color: colors.text }]}>LARE2024XYZ</Text>
            <TouchableOpacity style={[styles.copyButton, { backgroundColor: colors.primary }]}>
              <Copy size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.shareButton, { borderColor: colors.primary }]}>
            <Share2 size={18} color={colors.primary} />
            <Text style={[styles.shareButtonText, { color: colors.primary }]}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Reward Tiers</Text>
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
                <View style={styles.tierInfo}>
                  <Text style={[styles.tierName, { color: tier.current ? colors.primary : colors.text }]}>
                    {tier.name} {tier.current && '(Current)'}
                  </Text>
                  <Text style={[styles.tierReferrals, { color: colors.textTertiary }]}>
                    {tier.referrals} referrals
                  </Text>
                </View>
                <View style={[styles.tierBonus, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.tierBonusText, { color: colors.success }]}>{tier.bonus} Bonus</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Recent Referrals</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentReferrals.map((referral) => (
            <View
              key={referral.id}
              style={[styles.referralCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: referral.avatar }} style={styles.referralAvatar} />
              <View style={styles.referralInfo}>
                <Text style={[styles.referralName, { color: colors.text }]}>{referral.name}</Text>
                <Text style={[styles.referralDate, { color: colors.textTertiary }]}>{referral.date}</Text>
              </View>
              <View style={styles.referralRight}>
                <Text style={[styles.referralEarned, { color: colors.success }]}>{referral.earned}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: referral.status === 'completed' ? colors.success + '20' : colors.warning + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: referral.status === 'completed' ? colors.success : colors.warning }
                  ]}>
                    {referral.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.leaderboardCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.leaderboardIcon, { backgroundColor: colors.warning + '20' }]}>
            <TrendingUp size={24} color={colors.warning} />
          </View>
          <View style={styles.leaderboardInfo}>
            <Text style={[styles.leaderboardTitle, { color: colors.text }]}>Referral Leaderboard</Text>
            <Text style={[styles.leaderboardSubtitle, { color: colors.textTertiary }]}>
              You're ranked #156 this month
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  codeCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  codeText: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  copyButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tiersCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  tierRowLast: {
    borderBottomWidth: 0,
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tierReferrals: {
    fontSize: 12,
  },
  tierBonus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tierBonusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  referralAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  referralDate: {
    fontSize: 12,
  },
  referralRight: {
    alignItems: 'flex-end',
  },
  referralEarned: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500' as const,
    textTransform: 'capitalize',
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  leaderboardIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  leaderboardSubtitle: {
    fontSize: 13,
  },
});
