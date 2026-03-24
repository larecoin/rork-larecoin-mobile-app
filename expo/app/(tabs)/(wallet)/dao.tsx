import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Vote, FileText, Clock, Check, X, TrendingUp, Award, ChevronRight, Info, MessageSquare } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  endTime: string;
  yourVote?: 'for' | 'against';
  category: 'governance' | 'treasury' | 'protocol' | 'community';
}

const proposals: Proposal[] = [
  { 
    id: '1', 
    title: 'Increase Staking Rewards by 2%', 
    description: 'Proposal to increase the base staking rewards from 8% to 10% APY to attract more long-term holders.',
    proposer: '0x7a2...3f4c', 
    status: 'active', 
    votesFor: 125000, 
    votesAgainst: 45000, 
    totalVotes: 170000, 
    quorum: 200000, 
    endTime: '2d 14h',
    yourVote: 'for',
    category: 'protocol'
  },
  { 
    id: '2', 
    title: 'Community Treasury Allocation', 
    description: 'Allocate 500,000 LARE from treasury for community development grants and hackathons.',
    proposer: '0x3b1...8d2a', 
    status: 'active', 
    votesFor: 89000, 
    votesAgainst: 32000, 
    totalVotes: 121000, 
    quorum: 200000, 
    endTime: '5d 3h',
    category: 'treasury'
  },
  { 
    id: '3', 
    title: 'New Bridge Partnership', 
    description: 'Integrate with LayerZero for cross-chain bridging to expand to 15+ networks.',
    proposer: '0x9c4...1e7f', 
    status: 'pending', 
    votesFor: 0, 
    votesAgainst: 0, 
    totalVotes: 0, 
    quorum: 200000, 
    endTime: 'Starts in 1d',
    category: 'protocol'
  },
  { 
    id: '4', 
    title: 'Reduce Transaction Fees', 
    description: 'Lower platform fees from 0.3% to 0.2% to improve competitiveness.',
    proposer: '0x2d8...5a9c', 
    status: 'passed', 
    votesFor: 245000, 
    votesAgainst: 55000, 
    totalVotes: 300000, 
    quorum: 200000, 
    endTime: 'Ended',
    yourVote: 'for',
    category: 'governance'
  },
  { 
    id: '5', 
    title: 'NFT Marketplace Integration', 
    description: 'Build native NFT marketplace with zero listing fees for LARE holders.',
    proposer: '0x6f2...4b8e', 
    status: 'rejected', 
    votesFor: 78000, 
    votesAgainst: 142000, 
    totalVotes: 220000, 
    quorum: 200000, 
    endTime: 'Ended',
    category: 'community'
  },
];

const categoryColors = {
  governance: '#3498DB',
  treasury: '#F39C12',
  protocol: '#9B59B6',
  community: '#2ECC71',
};

const statusColors = {
  active: '#3498DB',
  passed: '#2ECC71',
  rejected: '#E74C3C',
  pending: '#F39C12',
};

export default function DAOScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'passed' | 'rejected'>('all');

  const votingPower = 15000;
  const delegatedPower = 5000;
  const totalPower = votingPower + delegatedPower;

  const filteredProposals = activeFilter === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === activeFilter);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Users size={32} color="#E67E22" />
        </View>
        <Text style={styles.title}>DAO Governance</Text>
        <Text style={styles.subtitle}>Participate in community decisions and shape the future</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Vote size={20} color={Colors.primary} />
          <Text style={styles.statLabel}>Your Voting Power</Text>
          <Text style={styles.statValue}>{totalPower.toLocaleString()}</Text>
          <Text style={styles.statSubtext}>{delegatedPower.toLocaleString()} delegated</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={20} color="#F39C12" />
          <Text style={styles.statLabel}>Votes Cast</Text>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statSubtext}>This month</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard}>
          <FileText size={20} color={Colors.primary} />
          <Text style={styles.actionLabel}>Create Proposal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Users size={20} color="#9B59B6" />
          <Text style={styles.actionLabel}>Delegate Votes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MessageSquare size={20} color="#2ECC71" />
          <Text style={styles.actionLabel}>Forum</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        {['all', 'active', 'passed', 'rejected'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter as typeof activeFilter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.proposalsList}>
        {filteredProposals.map(proposal => (
          <TouchableOpacity key={proposal.id} style={styles.proposalCard}>
            <View style={styles.proposalHeader}>
              <View style={[styles.categoryTag, { backgroundColor: categoryColors[proposal.category] + '20' }]}>
                <Text style={[styles.categoryText, { color: categoryColors[proposal.category] }]}>
                  {proposal.category.toUpperCase()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[proposal.status] + '20' }]}>
                <Text style={[styles.statusText, { color: statusColors[proposal.status] }]}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.proposalTitle}>{proposal.title}</Text>
            <Text style={styles.proposalDesc} numberOfLines={2}>{proposal.description}</Text>

            <View style={styles.proposerRow}>
              <Text style={styles.proposerLabel}>Proposed by</Text>
              <Text style={styles.proposerAddress}>{proposal.proposer}</Text>
            </View>

            {proposal.status !== 'pending' && (
              <View style={styles.votingSection}>
                <View style={styles.voteBar}>
                  <View style={[styles.voteBarFor, { width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst || 1)) * 100}%` }]} />
                </View>
                <View style={styles.voteStats}>
                  <View style={styles.voteStat}>
                    <Check size={14} color="#2ECC71" />
                    <Text style={styles.voteStatText}>{(proposal.votesFor / 1000).toFixed(0)}K For</Text>
                  </View>
                  <View style={styles.voteStat}>
                    <X size={14} color="#E74C3C" />
                    <Text style={styles.voteStatText}>{(proposal.votesAgainst / 1000).toFixed(0)}K Against</Text>
                  </View>
                </View>
                <View style={styles.quorumInfo}>
                  <Text style={styles.quorumText}>
                    Quorum: {((proposal.totalVotes / proposal.quorum) * 100).toFixed(0)}% ({(proposal.totalVotes / 1000).toFixed(0)}K / {(proposal.quorum / 1000).toFixed(0)}K)
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.proposalFooter}>
              <View style={styles.timeInfo}>
                <Clock size={14} color={Colors.textSecondary} />
                <Text style={styles.timeText}>{proposal.endTime}</Text>
              </View>
              {proposal.yourVote && (
                <View style={[styles.yourVoteBadge, { backgroundColor: proposal.yourVote === 'for' ? '#2ECC7120' : '#E74C3C20' }]}>
                  <Text style={[styles.yourVoteText, { color: proposal.yourVote === 'for' ? '#2ECC71' : '#E74C3C' }]}>
                    Voted {proposal.yourVote === 'for' ? 'For' : 'Against'}
                  </Text>
                </View>
              )}
              {proposal.status === 'active' && !proposal.yourVote && (
                <View style={styles.voteActions}>
                  <TouchableOpacity style={styles.voteForBtn}>
                    <Check size={16} color={Colors.background} />
                    <Text style={styles.voteBtnText}>For</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.voteAgainstBtn}>
                    <X size={16} color={Colors.background} />
                    <Text style={styles.voteBtnText}>Against</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>About DAO Governance</Text>
        </View>
        <Text style={styles.infoText}>
          LARE holders can participate in governance by voting on proposals. Your voting power is determined by your LARE holdings plus any delegated votes. Proposals require meeting quorum to pass, and results are binding on-chain.
        </Text>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E67E2220',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  statSubtext: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  proposalsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  proposalCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  proposalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  proposalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  proposerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  proposerLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginRight: 6,
  },
  proposerAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  votingSection: {
    marginBottom: 16,
  },
  voteBar: {
    height: 8,
    backgroundColor: '#E74C3C30',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  voteBarFor: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  voteStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  voteStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  quorumInfo: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 10,
  },
  quorumText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  proposalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  yourVoteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  yourVoteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  voteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  voteForBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  voteAgainstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  voteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
  infoSection: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
