import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gift, Coins, Users, Target, Trophy, ChevronRight, Zap, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface EarnOption {
  id: string;
  title: string;
  description: string;
  reward: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  progress?: number;
}

const earnOptions: EarnOption[] = [
  { id: '1', title: 'Daily Check-in', description: 'Claim your daily reward', reward: '5 LARE', icon: Gift, color: '#9B59B6', progress: 100 },
  { id: '2', title: 'Staking Rewards', description: 'Earn passive income on holdings', reward: '12% APY', icon: Coins, color: '#F39C12' },
  { id: '3', title: 'Referral Program', description: 'Invite friends and earn', reward: '50 LARE/ref', icon: Users, color: '#3498DB' },
  { id: '4', title: 'Complete Quests', description: 'Finish tasks for rewards', reward: 'Up to 100 LARE', icon: Target, color: '#E74C3C' },
  { id: '5', title: 'Trading Rewards', description: 'Earn cashback on trades', reward: '0.5% cashback', icon: Zap, color: '#2ECC71' },
];

const quests = [
  { id: 'q1', title: 'First Trade', reward: '10 LARE', completed: true },
  { id: 'q2', title: 'Verify Identity', reward: '25 LARE', completed: true },
  { id: 'q3', title: 'Complete a Course', reward: '15 LARE', completed: false },
  { id: 'q4', title: 'Refer a Friend', reward: '50 LARE', completed: false },
];

export default function EarnScreen() {
  const insets = useSafeAreaInsets();

  const totalEarned = 1250;
  const pendingRewards = 75;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Earn</Text>
        <View style={styles.trophyBadge}>
          <Trophy size={14} color={Colors.primary} />
          <Text style={styles.trophyText}>Level 3</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.accent, Colors.accent + 'CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rewardsCard}
        >
          <View style={styles.rewardsRow}>
            <View style={styles.rewardStat}>
              <Text style={styles.rewardLabel}>Total Earned</Text>
              <Text style={styles.rewardValue}>{totalEarned.toLocaleString()} LARE</Text>
            </View>
            <View style={styles.rewardDivider} />
            <View style={styles.rewardStat}>
              <Text style={styles.rewardLabel}>Pending</Text>
              <Text style={styles.rewardValue}>{pendingRewards} LARE</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.claimBtn}>
            <Text style={styles.claimBtnText}>Claim Rewards</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ways to Earn</Text>
          {earnOptions.map(option => (
            <TouchableOpacity key={option.id} style={styles.earnCard}>
              <View style={[styles.earnIcon, { backgroundColor: option.color + '20' }]}>
                <option.icon size={24} color={option.color} />
              </View>
              <View style={styles.earnContent}>
                <Text style={styles.earnTitle}>{option.title}</Text>
                <Text style={styles.earnDesc}>{option.description}</Text>
              </View>
              <View style={styles.earnReward}>
                <Text style={styles.rewardAmount}>{option.reward}</Text>
                {option.progress === 100 ? (
                  <CheckCircle size={16} color={Colors.success} />
                ) : (
                  <ChevronRight size={18} color={Colors.textTertiary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Quests</Text>
            <Text style={styles.questProgress}>2/4 Completed</Text>
          </View>
          <View style={styles.questsContainer}>
            {quests.map(quest => (
              <View key={quest.id} style={[styles.questItem, quest.completed && styles.questCompleted]}>
                <View style={styles.questLeft}>
                  {quest.completed ? (
                    <CheckCircle size={20} color={Colors.success} />
                  ) : (
                    <View style={styles.questCircle} />
                  )}
                  <Text style={[styles.questTitle, quest.completed && styles.questTitleCompleted]}>
                    {quest.title}
                  </Text>
                </View>
                <Text style={[styles.questReward, quest.completed && styles.questRewardCompleted]}>
                  {quest.reward}
                </Text>
              </View>
            ))}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  trophyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trophyText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  rewardsCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  rewardsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  rewardStat: {
    flex: 1,
    alignItems: 'center',
  },
  rewardDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  rewardLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.background,
  },
  claimBtn: {
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  claimBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  questProgress: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  earnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  earnIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnContent: {
    flex: 1,
    marginLeft: 14,
  },
  earnTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  earnDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  earnReward: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  questsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 4,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  questCompleted: {
    backgroundColor: Colors.success + '10',
  },
  questLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  questTitleCompleted: {
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  questReward: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  questRewardCompleted: {
    color: Colors.textSecondary,
  },
});
