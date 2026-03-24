import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Share2, Copy, CheckCircle, Gift, Users, 
  MessageCircle, Mail, Twitter, Instagram, Facebook, Link2,
  QrCode, Smartphone, Send
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function ShareAppScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);

  const referralCode = 'ALEX2026';
  const shareLink = 'https://larecoin.com/invite/ALEX2026';

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Larecoin - the future of digital finance! Use my referral code ${referralCode} to get $10 bonus. Download now: ${shareLink}`,
        url: shareLink,
        title: 'Join Larecoin',
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const shareOptions = [
    { id: 'message', title: 'Messages', icon: MessageCircle, color: '#10B981' },
    { id: 'email', title: 'Email', icon: Mail, color: '#3B82F6' },
    { id: 'twitter', title: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { id: 'instagram', title: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', title: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'more', title: 'More', icon: Share2, color: '#8B5CF6' },
  ];

  const rewards = [
    { id: '1', title: 'Both Get $10', subtitle: 'You and your friend each receive $10 in LUSD', icon: Gift, color: '#F59E0B' },
    { id: '2', title: 'Unlimited Invites', subtitle: 'No limit on how many friends you can invite', icon: Users, color: '#10B981' },
    { id: '3', title: 'Instant Credit', subtitle: 'Rewards added after friend completes KYC', icon: Send, color: '#8B5CF6' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Share App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Gift size={40} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Invite Friends, Earn Rewards</Text>
          <Text style={styles.heroSubtitle}>
            Share Larecoin with friends and you both get $10 when they sign up and complete verification
          </Text>
        </View>

        <View style={styles.referralCard}>
          <Text style={styles.referralLabel}>Your Referral Code</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              {copied ? (
                <CheckCircle size={20} color={Colors.success} />
              ) : (
                <Copy size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.linkCard}>
          <View style={styles.linkHeader}>
            <Link2 size={18} color={Colors.textSecondary} />
            <Text style={styles.linkLabel}>Your Invite Link</Text>
          </View>
          <Text style={styles.linkText} numberOfLines={1}>{shareLink}</Text>
          <TouchableOpacity style={styles.shareLinkButton} onPress={handleShare}>
            <Share2 size={18} color="#FFF" />
            <Text style={styles.shareLinkButtonText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Via</Text>
          <View style={styles.shareGrid}>
            {shareOptions.map((option) => (
              <TouchableOpacity 
                key={option.id} 
                style={styles.shareOption}
                onPress={option.id === 'more' ? handleShare : undefined}
              >
                <View style={[styles.shareIcon, { backgroundColor: option.color + '15' }]}>
                  <option.icon size={22} color={option.color} />
                </View>
                <Text style={styles.shareOptionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsCard}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepSubtitle}>Send your unique referral code or link to friends</Text>
              </View>
            </View>
            <View style={styles.stepConnector} />
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Signs Up</Text>
                <Text style={styles.stepSubtitle}>They create an account using your code</Text>
              </View>
            </View>
            <View style={styles.stepConnector} />
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Both Get Rewarded</Text>
                <Text style={styles.stepSubtitle}>$10 credited after KYC verification</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral Benefits</Text>
          <View style={styles.benefitsCard}>
            {rewards.map((reward, index) => (
              <View 
                key={reward.id}
                style={[
                  styles.benefitItem,
                  index === rewards.length - 1 && styles.benefitItemLast
                ]}
              >
                <View style={[styles.benefitIcon, { backgroundColor: reward.color + '15' }]}>
                  <reward.icon size={20} color={reward.color} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{reward.title}</Text>
                  <Text style={styles.benefitSubtitle}>{reward.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Friends Invited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>$80</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.qrButton}>
          <QrCode size={20} color={Colors.primary} />
          <Text style={styles.qrButtonText}>Show QR Code</Text>
        </TouchableOpacity>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#F59E0B' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  referralCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary + '15',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  referralLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  linkLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 14,
  },
  shareLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
  shareLinkButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shareOption: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  stepsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  stepContent: {
    flex: 1,
    marginLeft: 14,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  stepSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: Colors.primary + '30',
    marginLeft: 15,
    marginVertical: 4,
  },
  benefitsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  benefitItemLast: {
    borderBottomWidth: 0,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
    marginLeft: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  benefitSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  qrButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
