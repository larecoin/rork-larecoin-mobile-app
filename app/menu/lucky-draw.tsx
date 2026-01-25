import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gift, Ticket, Trophy, Clock, Star, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const myTickets = [
  { id: '1', draw: 'Weekly Grand Draw', tickets: 5, drawDate: 'Jan 26, 2026', prize: '$10,000' },
  { id: '2', draw: 'Daily Lucky Spin', tickets: 12, drawDate: 'Jan 25, 2026', prize: '500 LRC' },
  { id: '3', draw: 'Monthly Mega Draw', tickets: 2, drawDate: 'Feb 1, 2026', prize: '$100,000' },
];

const pastWins = [
  { id: '1', draw: 'Daily Lucky Spin', prize: '50 LRC', date: 'Jan 20, 2026' },
  { id: '2', draw: 'Weekly Raffle', prize: '100 LRC', date: 'Jan 15, 2026' },
];

export default function LuckyDrawScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Lucky Draw' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Gift size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Lucky Draw</Text>
          <Text style={styles.heroSubtitle}>Win big prizes with your tickets!</Text>
          <View style={styles.ticketCount}>
            <Ticket size={20} color={colors.primary} />
            <Text style={[styles.ticketCountText, { color: colors.primary }]}>19 Active Tickets</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Trophy size={24} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>$150</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Won</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Star size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Times Won</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Entries</Text>
          {myTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[styles.ticketCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.ticketIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ticket size={22} color={colors.primary} />
              </View>
              <View style={styles.ticketInfo}>
                <Text style={[styles.ticketName, { color: colors.text }]}>{ticket.draw}</Text>
                <View style={styles.ticketMeta}>
                  <View style={styles.ticketMetaItem}>
                    <Ticket size={12} color={colors.textTertiary} />
                    <Text style={[styles.ticketMetaText, { color: colors.textTertiary }]}>
                      {ticket.tickets} tickets
                    </Text>
                  </View>
                  <View style={styles.ticketMetaItem}>
                    <Clock size={12} color={colors.textTertiary} />
                    <Text style={[styles.ticketMetaText, { color: colors.textTertiary }]}>
                      {ticket.drawDate}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.ticketPrize}>
                <Text style={[styles.prizeLabel, { color: colors.textTertiary }]}>Prize</Text>
                <Text style={[styles.prizeValue, { color: colors.success }]}>{ticket.prize}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]}>
          <Ticket size={20} color="#FFF" />
          <Text style={styles.buyButtonText}>Get More Tickets</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Past Wins</Text>
          <View style={[styles.winsCard, { backgroundColor: colors.surface }]}>
            {pastWins.map((win, index) => (
              <View
                key={win.id}
                style={[
                  styles.winItem,
                  { borderBottomColor: colors.border },
                  index === pastWins.length - 1 && styles.winItemLast,
                ]}
              >
                <View style={[styles.winIcon, { backgroundColor: colors.success + '15' }]}>
                  <Trophy size={18} color={colors.success} />
                </View>
                <View style={styles.winInfo}>
                  <Text style={[styles.winDraw, { color: colors.text }]}>{win.draw}</Text>
                  <Text style={[styles.winDate, { color: colors.textTertiary }]}>{win.date}</Text>
                </View>
                <Text style={[styles.winPrize, { color: colors.success }]}>{win.prize}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.allDrawsButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.allDrawsText, { color: colors.text }]}>View All Draws</Text>
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
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  ticketCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  ticketCountText: {
    fontSize: 15,
    fontWeight: '600' as const,
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
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  ticketIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  ticketMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  ticketMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketMetaText: {
    fontSize: 12,
  },
  ticketPrize: {
    alignItems: 'flex-end',
  },
  prizeLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  prizeValue: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  winsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  winItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  winItemLast: {
    borderBottomWidth: 0,
  },
  winIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  winInfo: {
    flex: 1,
  },
  winDraw: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  winDate: {
    fontSize: 12,
  },
  winPrize: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  allDrawsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  allDrawsText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
});
