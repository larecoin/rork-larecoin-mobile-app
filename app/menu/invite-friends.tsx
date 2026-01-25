import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share2, Copy, Gift, Users, Award, Mail, MessageSquare, QrCode, Check } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function InviteFriendsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const referralCode = 'LARE2024XYZ';
  const referralLink = 'https://larecoin.app/ref/LARE2024XYZ';

  const rewards = [
    { level: 1, friends: 5, reward: '$25 in LRC', achieved: true },
    { level: 2, friends: 15, reward: '$75 in LRC', achieved: true },
    { level: 3, friends: 30, reward: '$150 in LRC', achieved: false },
    { level: 4, friends: 50, reward: '$300 in LRC', achieved: false },
  ];

  const stats = [
    { label: 'Friends Invited', value: '18' },
    { label: 'Active Referrals', value: '12' },
    { label: 'Total Earned', value: '$100' },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Larecoin and get $10 in free crypto! Use my referral code: ${referralCode}\n\n${referralLink}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleEmailInvite = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    Alert.alert('Invitation Sent', `An invitation has been sent to ${email}`);
    setEmail('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Invite Friends' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <Gift size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Earn Rewards Together!</Text>
          <Text style={styles.heroSubtitle}>
            Invite friends and both of you receive $10 in LRC when they sign up and verify their account.
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
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Your Referral Code</Text>
          <View style={[styles.referralCard, { backgroundColor: colors.surface }]}>
            <View style={styles.codeContainer}>
              <Text style={[styles.referralCode, { color: colors.text }]}>{referralCode}</Text>
              <TouchableOpacity 
                style={[styles.copyButton, { backgroundColor: copied ? colors.success : colors.primary }]}
                onPress={handleCopy}
              >
                {copied ? <Check size={18} color="#FFF" /> : <Copy size={18} color="#FFF" />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.shareButton, { backgroundColor: colors.primary }]} onPress={handleShare}>
              <Share2 size={18} color="#FFF" />
              <Text style={styles.shareButtonText}>Share Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Invite via Email</Text>
          <View style={[styles.emailCard, { backgroundColor: colors.surface }]}>
            <View style={styles.emailInputRow}>
              <TextInput
                style={[styles.emailInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="friend@email.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleEmailInvite}
              >
                <Mail size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Share Via</Text>
          <View style={styles.shareOptions}>
            <TouchableOpacity style={[styles.shareOption, { backgroundColor: colors.surface }]}>
              <View style={[styles.shareIcon, { backgroundColor: '#25D366' }]}>
                <MessageSquare size={20} color="#FFF" />
              </View>
              <Text style={[styles.shareLabel, { color: colors.text }]}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareOption, { backgroundColor: colors.surface }]}>
              <View style={[styles.shareIcon, { backgroundColor: '#1DA1F2' }]}>
                <MessageSquare size={20} color="#FFF" />
              </View>
              <Text style={[styles.shareLabel, { color: colors.text }]}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareOption, { backgroundColor: colors.surface }]}>
              <View style={[styles.shareIcon, { backgroundColor: '#0077B5' }]}>
                <Users size={20} color="#FFF" />
              </View>
              <Text style={[styles.shareLabel, { color: colors.text }]}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareOption, { backgroundColor: colors.surface }]}>
              <View style={[styles.shareIcon, { backgroundColor: colors.text }]}>
                <QrCode size={20} color={colors.background} />
              </View>
              <Text style={[styles.shareLabel, { color: colors.text }]}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Reward Milestones</Text>
          <View style={[styles.rewardsCard, { backgroundColor: colors.surface }]}>
            {rewards.map((reward, index) => (
              <View 
                key={reward.level}
                style={[
                  styles.rewardRow,
                  { borderBottomColor: colors.border },
                  index === rewards.length - 1 && styles.rewardRowLast,
                ]}
              >
                <View style={[
                  styles.levelBadge, 
                  { backgroundColor: reward.achieved ? colors.success + '20' : colors.textTertiary + '20' }
                ]}>
                  <Award size={16} color={reward.achieved ? colors.success : colors.textTertiary} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardTitle, { color: colors.text }]}>Level {reward.level}</Text>
                  <Text style={[styles.rewardSubtitle, { color: colors.textTertiary }]}>
                    {reward.friends} friends invited
                  </Text>
                </View>
                <View style={[
                  styles.rewardBadge,
                  { backgroundColor: reward.achieved ? colors.success + '20' : colors.primary + '15' }
                ]}>
                  <Text style={[
                    styles.rewardText,
                    { color: reward.achieved ? colors.success : colors.primary }
                  ]}>
                    {reward.reward}
                  </Text>
                </View>
              </View>
            ))}
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
  heroSection: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 10,
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
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  referralCard: {
    padding: 16,
    borderRadius: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referralCode: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  emailCard: {
    padding: 16,
    borderRadius: 16,
  },
  emailInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  emailInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  shareOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  shareIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  rewardsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  rewardRowLast: {
    borderBottomWidth: 0,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  rewardSubtitle: {
    fontSize: 12,
  },
  rewardBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
