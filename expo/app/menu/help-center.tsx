import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Search, HelpCircle, MessageCircle, Book, FileText,
  ChevronRight, ChevronDown, Wallet, Shield, CreditCard, Users,
  TrendingUp, Gift, Mail, Phone, ExternalLink
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function HelpCenterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const helpCategories = [
    { id: 'wallet', title: 'Wallet & Payments', icon: Wallet, color: '#10B981', articles: 24 },
    { id: 'security', title: 'Security & Privacy', icon: Shield, color: '#3B82F6', articles: 18 },
    { id: 'trading', title: 'Trading & Markets', icon: TrendingUp, color: '#F59E0B', articles: 32 },
    { id: 'card', title: 'LUSD Debit Card', icon: CreditCard, color: '#8B5CF6', articles: 15 },
    { id: 'social', title: 'Social Features', icon: Users, color: '#EC4899', articles: 21 },
    { id: 'rewards', title: 'Rewards & Referrals', icon: Gift, color: '#EF4444', articles: 12 },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to Settings > Security > Change Password. You will need to verify your identity through 2FA before setting a new password. If you\'ve lost access to your 2FA device, please contact support.',
    },
    {
      id: '2',
      question: 'How long do transfers take?',
      answer: 'Internal transfers between Larecoin wallets are instant. External blockchain transfers typically take 1-30 minutes depending on network congestion. Bank transfers may take 1-3 business days.',
    },
    {
      id: '3',
      question: 'What are the transaction fees?',
      answer: 'Larecoin charges 0% fees for internal transfers. External transfers have network fees that vary based on blockchain congestion. Trading fees start at 0.1% and decrease with volume.',
    },
    {
      id: '4',
      question: 'How do I enable 2FA?',
      answer: 'Go to Settings > Security > Two-Factor Authentication. Download an authenticator app like Google Authenticator, scan the QR code, and enter the verification code to complete setup.',
    },
    {
      id: '5',
      question: 'How do I get my LUSD debit card?',
      answer: 'Navigate to Wallet > LUSD Debit Card and tap "Order Card". Complete the verification process and your physical card will be delivered within 5-7 business days. Virtual cards are available instantly.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' + '20' }]}>
              <MessageCircle size={22} color="#10B981" />
            </View>
            <Text style={styles.quickActionText}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' + '20' }]}>
              <Mail size={22} color="#3B82F6" />
            </View>
            <Text style={styles.quickActionText}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' + '20' }]}>
              <Phone size={22} color="#8B5CF6" />
            </View>
            <Text style={styles.quickActionText}>Call Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {helpCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '15' }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryArticles}>{category.articles} articles</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <TouchableOpacity 
                key={faq.id} 
                style={[
                  styles.faqItem,
                  index === faqs.length - 1 && styles.faqItemLast
                ]}
                onPress={() => toggleFaq(faq.id)}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.faqIconContainer}>
                    <HelpCircle size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {expandedFaq === faq.id ? (
                    <ChevronDown size={18} color={Colors.textSecondary} />
                  ) : (
                    <ChevronRight size={18} color={Colors.textSecondary} />
                  )}
                </View>
                {expandedFaq === faq.id && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <View style={styles.resourcesCard}>
            <TouchableOpacity style={styles.resourceItem}>
              <View style={[styles.resourceIcon, { backgroundColor: '#F59E0B' + '20' }]}>
                <Book size={20} color="#F59E0B" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>Getting Started Guide</Text>
                <Text style={styles.resourceSubtitle}>Learn the basics</Text>
              </View>
              <ExternalLink size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.resourceItem, styles.resourceItemLast]}>
              <View style={[styles.resourceIcon, { backgroundColor: '#06B6D4' + '20' }]}>
                <FileText size={20} color="#06B6D4" />
              </View>
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>API Documentation</Text>
                <Text style={styles.resourceSubtitle}>For developers</Text>
              </View>
              <ExternalLink size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contactBanner}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>
          <TouchableOpacity style={styles.contactButton}>
            <MessageCircle size={18} color="#FFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  categoryArticles: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  faqContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  faqAnswer: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 12,
    marginLeft: 44,
  },
  resourcesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resourceItemLast: {
    borderBottomWidth: 0,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  resourceSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  contactBanner: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary + '15',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
