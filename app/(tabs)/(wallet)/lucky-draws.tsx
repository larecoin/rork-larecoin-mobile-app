import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Clover, Trophy, Ticket, Clock, Users, Gift, Star, Sparkles, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface LuckyDraw {
  id: string;
  name: string;
  prize: string;
  prizeValue: number;
  ticketPrice: number;
  ticketsSold: number;
  totalTickets: number;
  endTime: string;
  yourTickets: number;
  status: 'active' | 'drawing' | 'completed';
  winner?: string;
}

const luckyDraws: LuckyDraw[] = [
  { id: '1', name: 'Weekly Mega Draw', prize: '10,000 LARE', prizeValue: 10000, ticketPrice: 10, ticketsSold: 8450, totalTickets: 10000, endTime: '2d 14h 32m', yourTickets: 25, status: 'active' },
  { id: '2', name: 'Daily Mini Draw', prize: '500 LARE', prizeValue: 500, ticketPrice: 1, ticketsSold: 2890, totalTickets: 5000, endTime: '6h 45m', yourTickets: 50, status: 'active' },
  { id: '3', name: 'NFT Giveaway', prize: 'Rare NFT Collection', prizeValue: 5000, ticketPrice: 25, ticketsSold: 400, totalTickets: 500, endTime: '5d 8h', yourTickets: 0, status: 'active' },
  { id: '4', name: 'Monthly Grand Prize', prize: '100,000 LARE', prizeValue: 100000, ticketPrice: 50, ticketsSold: 1850, totalTickets: 2000, endTime: '12d 3h', yourTickets: 5, status: 'active' },
  { id: '5', name: 'Last Week Draw', prize: '10,000 LARE', prizeValue: 10000, ticketPrice: 10, ticketsSold: 10000, totalTickets: 10000, endTime: 'Ended', yourTickets: 15, status: 'completed', winner: '0x7a...3f4c' },
];

export default function LuckyDrawsScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeDraws = luckyDraws.filter(d => d.status === 'active');
  const completedDraws = luckyDraws.filter(d => d.status === 'completed');
  const totalTickets = luckyDraws.reduce((sum, d) => sum + d.yourTickets, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Clover size={32} color="#2ECC71" />
          <View style={styles.sparkle1}>
            <Sparkles size={16} color="#F1C40F" />
          </View>
          <View style={styles.sparkle2}>
            <Star size={12} color="#E74C3C" />
          </View>
        </View>
        <Text style={styles.title}>Lucky Draws</Text>
        <Text style={styles.subtitle}>Try your luck and win amazing prizes!</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ticket size={20} color={Colors.primary} />
          <Text style={styles.statLabel}>Your Tickets</Text>
          <Text style={styles.statValue}>{totalTickets}</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={20} color="#F1C40F" />
          <Text style={styles.statLabel}>Total Wins</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
        <View style={styles.statCard}>
          <Gift size={20} color="#E74C3C" />
          <Text style={styles.statLabel}>Won Value</Text>
          <Text style={styles.statValue}>$1,250</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Clover size={18} color={activeTab === 'active' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active Draws</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Trophy size={18} color={activeTab === 'history' ? Colors.background : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.drawsList}>
        {(activeTab === 'active' ? activeDraws : completedDraws).map(draw => (
          <View key={draw.id} style={styles.drawCard}>
            <View style={styles.drawHeader}>
              <View style={styles.drawInfo}>
                <Text style={styles.drawName}>{draw.name}</Text>
                <View style={styles.timerBadge}>
                  <Clock size={12} color={draw.status === 'completed' ? Colors.textSecondary : '#E74C3C'} />
                  <Text style={[styles.timerText, draw.status === 'completed' && { color: Colors.textSecondary }]}>
                    {draw.endTime}
                  </Text>
                </View>
              </View>
              {draw.status === 'completed' && draw.winner && (
                <View style={styles.winnerBadge}>
                  <Trophy size={14} color="#F1C40F" />
                  <Text style={styles.winnerText}>Winner</Text>
                </View>
              )}
            </View>

            <View style={styles.prizeSection}>
              <View style={styles.prizeIcon}>
                <Gift size={28} color="#F1C40F" />
              </View>
              <View style={styles.prizeInfo}>
                <Text style={styles.prizeLabel}>Prize</Text>
                <Text style={styles.prizeValue}>{draw.prize}</Text>
                <Text style={styles.prizeUsd}>≈ ${draw.prizeValue.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Tickets Sold</Text>
                <Text style={styles.progressValue}>{draw.ticketsSold.toLocaleString()} / {draw.totalTickets.toLocaleString()}</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(draw.ticketsSold / draw.totalTickets) * 100}%` }]} />
              </View>
            </View>

            <View style={styles.ticketInfo}>
              <View style={styles.ticketInfoItem}>
                <Text style={styles.ticketInfoLabel}>Ticket Price</Text>
                <Text style={styles.ticketInfoValue}>{draw.ticketPrice} LARE</Text>
              </View>
              <View style={styles.ticketInfoDivider} />
              <View style={styles.ticketInfoItem}>
                <Text style={styles.ticketInfoLabel}>Your Tickets</Text>
                <Text style={[styles.ticketInfoValue, { color: Colors.primary }]}>{draw.yourTickets}</Text>
              </View>
              <View style={styles.ticketInfoDivider} />
              <View style={styles.ticketInfoItem}>
                <Text style={styles.ticketInfoLabel}>Win Chance</Text>
                <Text style={styles.ticketInfoValue}>
                  {draw.yourTickets > 0 ? ((draw.yourTickets / draw.totalTickets) * 100).toFixed(2) : '0'}%
                </Text>
              </View>
            </View>

            {draw.status === 'active' && (
              <View style={styles.drawActions}>
                <TouchableOpacity style={styles.buyTicketsBtn}>
                  <Ticket size={18} color={Colors.background} />
                  <Text style={styles.buyTicketsText}>Buy Tickets</Text>
                </TouchableOpacity>
              </View>
            )}

            {draw.status === 'completed' && draw.winner && (
              <View style={styles.winnerSection}>
                <Text style={styles.winnerLabel}>Winning Ticket</Text>
                <Text style={styles.winnerAddress}>{draw.winner}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.rulesSection}>
        <Text style={styles.rulesTitle}>How It Works</Text>
        <View style={styles.ruleItem}>
          <View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>1</Text></View>
          <Text style={styles.ruleText}>Purchase tickets with LARE tokens</Text>
        </View>
        <View style={styles.ruleItem}>
          <View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>2</Text></View>
          <Text style={styles.ruleText}>Each ticket gives you one entry into the draw</Text>
        </View>
        <View style={styles.ruleItem}>
          <View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>3</Text></View>
          <Text style={styles.ruleText}>Winners are selected randomly using verifiable randomness</Text>
        </View>
        <View style={styles.ruleItem}>
          <View style={styles.ruleNumber}><Text style={styles.ruleNumberText}>4</Text></View>
          <Text style={styles.ruleText}>Prizes are automatically sent to the winners wallet</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2ECC7120',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  sparkle1: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 0,
    left: -4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  drawsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  drawCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  drawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  drawInfo: {
    flex: 1,
  },
  drawName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E74C3C20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E74C3C',
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1C40F20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  winnerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F1C40F',
  },
  prizeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1C40F10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  prizeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F1C40F20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prizeInfo: {
    flex: 1,
  },
  prizeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  prizeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  prizeUsd: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  ticketInfo: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  ticketInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  ticketInfoDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  ticketInfoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ticketInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  drawActions: {
    flexDirection: 'row',
  },
  buyTicketsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  buyTicketsText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
  winnerSection: {
    backgroundColor: '#F1C40F10',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  winnerLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  winnerAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  rulesSection: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
