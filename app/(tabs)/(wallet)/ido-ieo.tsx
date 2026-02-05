import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Rocket, Clock, Users, TrendingUp, Shield, AlertCircle, ChevronRight, Star, Calendar } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Launch {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  type: 'IDO' | 'IEO' | 'Fair Launch';
  status: 'upcoming' | 'live' | 'ended';
  price: string;
  raised: string;
  target: string;
  participants: number;
  startDate: string;
  endDate: string;
  allocation: string;
}

export default function IdoIeoScreen() {
  const { colors } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'ended'>('live');

  const launches: Launch[] = [
    { id: '1', name: 'MetaVerse AI', symbol: 'MVAI', description: 'Decentralized AI platform for metaverse', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100', type: 'IDO', status: 'live', price: '$0.025', raised: '$2.4M', target: '$3M', participants: 12450, startDate: 'Jan 20, 2025', endDate: 'Jan 27, 2025', allocation: '$500 max' },
    { id: '2', name: 'DeFi Shield', symbol: 'DSHD', description: 'Insurance protocol for DeFi', image: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=100', type: 'IEO', status: 'live', price: '$0.15', raised: '$1.8M', target: '$2.5M', participants: 8920, startDate: 'Jan 22, 2025', endDate: 'Jan 29, 2025', allocation: '$1000 max' },
    { id: '3', name: 'GameFi Quest', symbol: 'GFQ', description: 'Play-to-earn gaming ecosystem', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100', type: 'Fair Launch', status: 'upcoming', price: '$0.08', raised: '$0', target: '$5M', participants: 0, startDate: 'Feb 1, 2025', endDate: 'Feb 8, 2025', allocation: 'No limit' },
    { id: '4', name: 'SocialFi Hub', symbol: 'SFH', description: 'Decentralized social media platform', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100', type: 'IDO', status: 'ended', price: '$0.05', raised: '$4M', target: '$4M', participants: 25680, startDate: 'Jan 10, 2025', endDate: 'Jan 17, 2025', allocation: '$250 max' },
  ];

  const filteredLaunches = launches.filter(l => l.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#10B981';
      case 'upcoming': return '#F59E0B';
      case 'ended': return colors.textSecondary;
      default: return colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'IDO': return '#8B5CF6';
      case 'IEO': return '#3B82F6';
      case 'Fair Launch': return '#10B981';
      default: return colors.primary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <Rocket size={24} color={colors.primary} />
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Token Launchpad</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Participate in early token offerings</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Launches</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>$45.2M</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Raised</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>156K</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participants</Text>
          </View>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(['upcoming', 'live', 'ended'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFFFFF' : colors.textSecondary }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.launchList}>
        {filteredLaunches.map(launch => (
          <View key={launch.id} style={[styles.launchCard, { backgroundColor: colors.surface }]}>
            <View style={styles.launchHeader}>
              <Image source={{ uri: launch.image }} style={styles.launchImage} />
              <View style={styles.launchInfo}>
                <View style={styles.launchTitleRow}>
                  <Text style={[styles.launchName, { color: colors.text }]}>{launch.name}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(launch.type) + '20' }]}>
                    <Text style={[styles.typeText, { color: getTypeColor(launch.type) }]}>{launch.type}</Text>
                  </View>
                </View>
                <Text style={[styles.launchSymbol, { color: colors.primary }]}>${launch.symbol}</Text>
                <Text style={[styles.launchDesc, { color: colors.textSecondary }]} numberOfLines={1}>{launch.description}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                  {launch.raised} / {launch.target}
                </Text>
                <Text style={[styles.progressPercent, { color: colors.text }]}>
                  {((parseFloat(launch.raised.replace(/[^0-9.]/g, '')) / parseFloat(launch.target.replace(/[^0-9.]/g, ''))) * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: getStatusColor(launch.status),
                      width: `${Math.min((parseFloat(launch.raised.replace(/[^0-9.]/g, '')) / parseFloat(launch.target.replace(/[^0-9.]/g, ''))) * 100, 100)}%`
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.launchDetails}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{launch.price}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailLabelRow}>
                  <Users size={12} color={colors.textSecondary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Participants</Text>
                </View>
                <Text style={[styles.detailValue, { color: colors.text }]}>{launch.participants.toLocaleString()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Allocation</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{launch.allocation}</Text>
              </View>
            </View>

            <View style={[styles.dateRow, { backgroundColor: colors.background }]}>
              <Calendar size={14} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                {launch.startDate} - {launch.endDate}
              </Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                { backgroundColor: launch.status === 'live' ? colors.primary : launch.status === 'upcoming' ? colors.surface : colors.background },
                launch.status !== 'live' && { borderWidth: 1, borderColor: colors.border }
              ]}
            >
              <Text style={[styles.actionBtnText, { color: launch.status === 'live' ? '#FFFFFF' : colors.text }]}>
                {launch.status === 'live' ? 'Participate Now' : launch.status === 'upcoming' ? 'Set Reminder' : 'View Details'}
              </Text>
              <ChevronRight size={16} color={launch.status === 'live' ? '#FFFFFF' : colors.text} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Shield size={20} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Verified Projects Only</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            <Text>All projects on our launchpad undergo thorough due diligence and smart contract audits.</Text>
          </Text>
        </View>
      </View>

      <View style={[styles.warningCard, { backgroundColor: '#FEF3C720', borderColor: '#F59E0B' }]}>
        <AlertCircle size={18} color="#F59E0B" />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          <Text>Token launches are high-risk investments. Always do your own research before participating.</Text>
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  launchList: {
    paddingHorizontal: 16,
  },
  launchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  launchHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  launchImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  launchInfo: {
    flex: 1,
  },
  launchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  launchName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  launchSymbol: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  launchDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  launchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    gap: 4,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
