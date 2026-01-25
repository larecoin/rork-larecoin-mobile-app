import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Receipt, TrendingUp, Clock, Shield, ChevronRight, Info, Calendar, Percent, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Bond {
  id: string;
  name: string;
  type: 'treasury' | 'corporate' | 'community';
  apr: number;
  maturity: string;
  minInvestment: number;
  maxInvestment: number;
  totalValue: string;
  yourInvestment: number;
  status: 'available' | 'sold_out' | 'maturing';
  riskLevel: 'low' | 'medium' | 'high';
}

const bonds: Bond[] = [
  { id: '1', name: 'LARE Treasury 6M', type: 'treasury', apr: 7.5, maturity: '6 Months', minInvestment: 500, maxInvestment: 50000, totalValue: '$2.4M', yourInvestment: 5000, status: 'available', riskLevel: 'low' },
  { id: '2', name: 'LARE Treasury 12M', type: 'treasury', apr: 10.0, maturity: '12 Months', minInvestment: 1000, maxInvestment: 100000, totalValue: '$5.8M', yourInvestment: 0, status: 'available', riskLevel: 'low' },
  { id: '3', name: 'Infrastructure Bond', type: 'corporate', apr: 12.5, maturity: '24 Months', minInvestment: 2500, maxInvestment: 250000, totalValue: '$12.4M', yourInvestment: 10000, status: 'available', riskLevel: 'medium' },
  { id: '4', name: 'Community Growth', type: 'community', apr: 15.0, maturity: '18 Months', minInvestment: 100, maxInvestment: 10000, totalValue: '$890K', yourInvestment: 0, status: 'available', riskLevel: 'medium' },
  { id: '5', name: 'DeFi Expansion', type: 'corporate', apr: 18.0, maturity: '36 Months', minInvestment: 5000, maxInvestment: 500000, totalValue: '$8.2M', yourInvestment: 0, status: 'sold_out', riskLevel: 'high' },
];

const typeColors = {
  treasury: '#3498DB',
  corporate: '#9B59B6',
  community: '#2ECC71',
};

const riskColors = {
  low: '#2ECC71',
  medium: '#F39C12',
  high: '#E74C3C',
};

export default function BondsScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'treasury' | 'corporate' | 'community'>('all');

  const filteredBonds = activeFilter === 'all' ? bonds : bonds.filter(b => b.type === activeFilter);
  const myBonds = bonds.filter(b => b.yourInvestment > 0);
  const totalInvested = myBonds.reduce((sum, b) => sum + b.yourInvestment, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Receipt size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Bonds</Text>
        <Text style={styles.subtitle}>Invest in fixed-income securities with guaranteed returns</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <DollarSign size={20} color={Colors.primary} />
          <Text style={styles.statLabel}>Total Invested</Text>
          <Text style={styles.statValue}>${totalInvested.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Receipt size={20} color="#2ECC71" />
          <Text style={styles.statLabel}>Active Bonds</Text>
          <Text style={styles.statValue}>{myBonds.length}</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filterContainer}
      >
        {['all', 'treasury', 'corporate', 'community'].map(filter => (
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

      <View style={styles.bondsList}>
        {filteredBonds.map(bond => (
          <TouchableOpacity key={bond.id} style={styles.bondCard}>
            <View style={styles.bondHeader}>
              <View style={styles.bondInfo}>
                <View style={[styles.typeTag, { backgroundColor: typeColors[bond.type] + '20' }]}>
                  <Text style={[styles.typeText, { color: typeColors[bond.type] }]}>
                    {bond.type.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.bondName}>{bond.name}</Text>
              </View>
              {bond.status === 'sold_out' ? (
                <View style={styles.soldOutBadge}>
                  <Text style={styles.soldOutText}>Sold Out</Text>
                </View>
              ) : (
                <View style={styles.aprBadge}>
                  <Percent size={12} color="#2ECC71" />
                  <Text style={styles.aprText}>{bond.apr}% APR</Text>
                </View>
              )}
            </View>

            <View style={styles.bondDetails}>
              <View style={styles.detailItem}>
                <Calendar size={14} color={Colors.textSecondary} />
                <Text style={styles.detailText}>{bond.maturity}</Text>
              </View>
              <View style={styles.detailItem}>
                <Shield size={14} color={riskColors[bond.riskLevel]} />
                <Text style={[styles.detailText, { color: riskColors[bond.riskLevel] }]}>
                  {bond.riskLevel.charAt(0).toUpperCase() + bond.riskLevel.slice(1)} Risk
                </Text>
              </View>
              <View style={styles.detailItem}>
                <TrendingUp size={14} color={Colors.textSecondary} />
                <Text style={styles.detailText}>TVL: {bond.totalValue}</Text>
              </View>
            </View>

            <View style={styles.investmentRange}>
              <Text style={styles.rangeLabel}>Investment Range</Text>
              <Text style={styles.rangeValue}>
                ${bond.minInvestment.toLocaleString()} - ${bond.maxInvestment.toLocaleString()}
              </Text>
            </View>

            {bond.yourInvestment > 0 && (
              <View style={styles.yourInvestment}>
                <Text style={styles.yourInvestLabel}>Your Investment</Text>
                <Text style={styles.yourInvestValue}>${bond.yourInvestment.toLocaleString()}</Text>
                <Text style={styles.estimatedReturn}>
                  Est. Return: ${(bond.yourInvestment * (1 + bond.apr / 100)).toFixed(2)}
                </Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.investBtn, bond.status === 'sold_out' && styles.investBtnDisabled]}
              disabled={bond.status === 'sold_out'}
            >
              <Text style={styles.investBtnText}>
                {bond.yourInvestment > 0 ? 'Add More' : 'Invest Now'}
              </Text>
              <ChevronRight size={18} color={Colors.background} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <Info size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>About Bonds</Text>
        </View>
        <Text style={styles.infoText}>
          Bonds are fixed-income securities that pay a guaranteed return upon maturity. 
          Treasury bonds are backed by the protocol, while corporate and community bonds 
          fund specific projects. Returns are paid upon maturity date.
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
    backgroundColor: Colors.primary + '20',
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
  statsRow: {
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
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
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
  bondsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bondCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  bondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bondInfo: {
    flex: 1,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  bondName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  aprBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2ECC7120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  aprText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2ECC71',
  },
  soldOutBadge: {
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  soldOutText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.error,
  },
  bondDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  investmentRange: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  rangeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  rangeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  yourInvestment: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  yourInvestLabel: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 4,
  },
  yourInvestValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  estimatedReturn: {
    fontSize: 13,
    color: '#2ECC71',
    marginTop: 4,
  },
  investBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  investBtnDisabled: {
    backgroundColor: Colors.surface,
  },
  investBtnText: {
    fontSize: 16,
    fontWeight: '700',
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
