import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Vote, Clock, TrendingUp, Users, Calendar, Info, ChevronRight, Zap } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  outcomes: { name: string; odds: number; }[];
  totalPool: string;
  participants: number;
  endTime: string;
  status: 'open' | 'live' | 'closed';
}

export default function EventTradingScreen() {
  const { colors } = useApp();
  const [filter, setFilter] = useState<'all' | 'open' | 'live'>('all');

  const events: Event[] = [
    { id: '1', title: 'BTC Price at Monthly Close', description: 'Where will BTC close at the end of January?', category: 'Crypto', outcomes: [{ name: 'Above $45K', odds: 2.1 }, { name: '$42K-$45K', odds: 1.8 }, { name: 'Below $42K', odds: 3.2 }], totalPool: '$125K', participants: 450, endTime: 'Jan 31, 11:59 PM', status: 'open' },
    { id: '2', title: 'ETH Gas Fees This Week', description: 'Average gas fees for the week', category: 'Crypto', outcomes: [{ name: 'Under 20 gwei', odds: 1.5 }, { name: '20-50 gwei', odds: 2.0 }, { name: 'Over 50 gwei', odds: 4.5 }], totalPool: '$45K', participants: 280, endTime: 'Feb 2, 12:00 AM', status: 'live' },
    { id: '3', title: 'Next Fed Rate Decision', description: 'February FOMC meeting outcome', category: 'Finance', outcomes: [{ name: 'Cut 25bp', odds: 1.6 }, { name: 'Hold', odds: 2.8 }, { name: 'Cut 50bp', odds: 6.0 }], totalPool: '$320K', participants: 1250, endTime: 'Feb 5, 2:00 PM', status: 'open' },
  ];

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10B981';
      case 'live': return '#F59E0B';
      case 'closed': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Vote size={22} color={colors.primary} />
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Event Trading</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            <Text>Trade on specific event outcomes</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.filterContainer, { backgroundColor: colors.surface }]}>
        {(['all', 'open', 'live'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && { backgroundColor: colors.primary }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#FFFFFF' : colors.textSecondary }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.eventList}>
        {filteredEvents.map(event => (
          <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
            <View style={styles.eventHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>{event.category}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) + '20' }]}>
                {event.status === 'live' && <Zap size={10} color={getStatusColor(event.status)} />}
                <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>{event.status}</Text>
              </View>
            </View>

            <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
            <Text style={[styles.eventDesc, { color: colors.textSecondary }]}>{event.description}</Text>

            <View style={styles.outcomesSection}>
              {event.outcomes.map((outcome, index) => (
                <TouchableOpacity key={index} style={[styles.outcomeBtn, { backgroundColor: colors.background }]}>
                  <Text style={[styles.outcomeName, { color: colors.text }]}>{outcome.name}</Text>
                  <Text style={[styles.outcomeOdds, { color: colors.primary }]}>{outcome.odds}x</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.eventMeta}>
              <View style={styles.metaItem}>
                <TrendingUp size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.totalPool}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.participants}</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={12} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>{event.endTime}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Event Trading Works</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Choose an outcome and place your bet. If correct, you win based on the odds. The payout is multiplied by your stake.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  eventList: {
    paddingHorizontal: 16,
  },
  eventCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 13,
    marginBottom: 14,
  },
  outcomesSection: {
    gap: 8,
    marginBottom: 14,
  },
  outcomeBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  outcomeName: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  outcomeOdds: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
