import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, FileText, Shield, Lock, Eye, Scale, Users,
  ChevronRight, ExternalLink, Download, CheckCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TermsPrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  const legalDocuments = [
    { id: 'terms', title: 'Terms of Service', subtitle: 'Last updated: Jan 15, 2026', icon: FileText, color: '#3B82F6' },
    { id: 'privacy', title: 'Privacy Policy', subtitle: 'Last updated: Jan 10, 2026', icon: Shield, color: '#10B981' },
    { id: 'cookies', title: 'Cookie Policy', subtitle: 'Last updated: Dec 20, 2025', icon: Eye, color: '#F59E0B' },
    { id: 'aml', title: 'AML Policy', subtitle: 'Anti-Money Laundering', icon: Scale, color: '#8B5CF6' },
    { id: 'data', title: 'Data Processing Agreement', subtitle: 'For business users', icon: Lock, color: '#EC4899' },
    { id: 'community', title: 'Community Guidelines', subtitle: 'Social features rules', icon: Users, color: '#06B6D4' },
  ];

  const termsHighlights = [
    'By using Larecoin, you agree to these terms',
    'You must be 18 years or older to use our services',
    'You are responsible for maintaining account security',
    'Trading involves risk and may result in loss',
    'We may modify services with reasonable notice',
  ];

  const privacyHighlights = [
    'We collect information you provide directly',
    'Your data is encrypted and securely stored',
    'We do not sell your personal information',
    'You can request data deletion at any time',
    'We use cookies to improve your experience',
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'terms' && styles.tabActive]}
            onPress={() => setActiveTab('terms')}
          >
            <FileText size={16} color={activeTab === 'terms' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'terms' && styles.tabTextActive]}>Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
            onPress={() => setActiveTab('privacy')}
          >
            <Shield size={16} color={activeTab === 'privacy' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>Privacy</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'terms' && (
          <View style={styles.content}>
            <View style={styles.highlightsCard}>
              <Text style={styles.highlightsTitle}>Key Points</Text>
              {termsHighlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <CheckCircle size={16} color={Colors.primary} />
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
              <Text style={styles.sectionText}>
                By accessing or using the Larecoin platform, mobile application, or any associated services (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Eligibility</Text>
              <Text style={styles.sectionText}>
                You must be at least 18 years of age and have the legal capacity to enter into a binding agreement to use our Services. By using our Services, you represent and warrant that you meet these eligibility requirements.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Account Registration</Text>
              <Text style={styles.sectionText}>
                To access certain features, you must create an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Financial Services</Text>
              <Text style={styles.sectionText}>
                <Text>Cryptocurrency trading involves substantial risk. The value of digital assets can fluctuate significantly. Past performance is not indicative of future results. You should only invest what you can afford to lose.</Text>
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'privacy' && (
          <View style={styles.content}>
            <View style={styles.highlightsCard}>
              <Text style={styles.highlightsTitle}>Your Privacy Matters</Text>
              {privacyHighlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <CheckCircle size={16} color="#10B981" />
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information We Collect</Text>
              <Text style={styles.sectionText}>
                We collect information you provide directly, such as when you create an account, make transactions, or contact support. This includes your name, email, phone number, and identity verification documents.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Your Data</Text>
              <Text style={styles.sectionText}>
                We use your information to provide and improve our Services, process transactions, comply with legal obligations, and communicate with you about updates and promotions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Security</Text>
              <Text style={styles.sectionText}>
                We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.sectionText}>
                You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications and request a copy of your data at any time.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.documentsSection}>
          <Text style={styles.documentsTitle}>All Legal Documents</Text>
          <View style={styles.documentsCard}>
            {legalDocuments.map((doc, index) => (
              <TouchableOpacity 
                key={doc.id}
                style={[
                  styles.documentItem,
                  index === legalDocuments.length - 1 && styles.documentItemLast
                ]}
              >
                <View style={[styles.documentIcon, { backgroundColor: doc.color + '15' }]}>
                  <doc.icon size={20} color={doc.color} />
                </View>
                <View style={styles.documentContent}>
                  <Text style={styles.documentTitle}>{doc.title}</Text>
                  <Text style={styles.documentSubtitle}>{doc.subtitle}</Text>
                </View>
                <ChevronRight size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Download All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ExternalLink size={18} color={Colors.primary} />
            <Text style={styles.actionButtonText}>View Online</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Questions about our policies?</Text>
          <Text style={styles.contactSubtitle}>Contact our legal team at legal@larecoin.com</Text>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  content: {
    paddingHorizontal: 20,
  },
  highlightsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  highlightsTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  documentsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  documentsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  documentItemLast: {
    borderBottomWidth: 0,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentContent: {
    flex: 1,
    marginLeft: 12,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  documentSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  contactCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
