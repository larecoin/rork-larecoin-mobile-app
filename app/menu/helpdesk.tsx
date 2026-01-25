import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HelpCircle, Search, MessageCircle, FileText, Video, ChevronRight, Plus, Clock, CheckCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const faqCategories = [
  { id: '1', name: 'Getting Started', icon: '🚀', articles: 12 },
  { id: '2', name: 'Wallet & Security', icon: '🔐', articles: 18 },
  { id: '3', name: 'Trading', icon: '📈', articles: 24 },
  { id: '4', name: 'Payments', icon: '💳', articles: 15 },
  { id: '5', name: 'Account', icon: '👤', articles: 10 },
  { id: '6', name: 'Merchant', icon: '🏪', articles: 8 },
];

const myTickets = [
  { id: 'TKT-001', subject: 'Withdrawal delay', status: 'open', updated: '2 hours ago' },
  { id: 'TKT-002', subject: 'KYC verification issue', status: 'resolved', updated: '3 days ago' },
];

export default function HelpdeskScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Helpdesk' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <HelpCircle size={40} color="#FFF" />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <View style={[styles.searchBar, { backgroundColor: '#FFF' }]}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for help..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <MessageCircle size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <FileText size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Docs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <Video size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Tutorials</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Help Topics</Text>
          <View style={styles.categoriesGrid}>
            {faqCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.surface }]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryName, { color: colors.text }]}>{category.name}</Text>
                <Text style={[styles.categoryArticles, { color: colors.textTertiary }]}>
                  {category.articles} articles
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Tickets</Text>
            <TouchableOpacity style={[styles.newTicketButton, { backgroundColor: colors.primary }]}>
              <Plus size={16} color="#FFF" />
              <Text style={styles.newTicketText}>New</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.ticketsCard, { backgroundColor: colors.surface }]}>
            {myTickets.map((ticket, index) => (
              <TouchableOpacity
                key={ticket.id}
                style={[
                  styles.ticketRow,
                  { borderBottomColor: colors.border },
                  index === myTickets.length - 1 && styles.ticketRowLast,
                ]}
              >
                <View style={[
                  styles.ticketStatus,
                  { backgroundColor: ticket.status === 'open' ? colors.warning + '15' : colors.success + '15' }
                ]}>
                  {ticket.status === 'open' ? (
                    <Clock size={16} color={colors.warning} />
                  ) : (
                    <CheckCircle size={16} color={colors.success} />
                  )}
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={[styles.ticketSubject, { color: colors.text }]}>{ticket.subject}</Text>
                  <Text style={[styles.ticketMeta, { color: colors.textTertiary }]}>
                    {ticket.id} • {ticket.updated}
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.contactCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
            <MessageCircle size={24} color={colors.primary} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactTitle, { color: colors.text }]}>Need more help?</Text>
            <Text style={[styles.contactDescription, { color: colors.textTertiary }]}>
              Contact our support team 24/7
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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
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
  newTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  newTicketText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '31%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryArticles: {
    fontSize: 10,
  },
  ticketsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  ticketRowLast: {
    borderBottomWidth: 0,
  },
  ticketStatus: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  ticketMeta: {
    fontSize: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 13,
  },
});
