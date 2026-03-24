import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Receipt,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  Zap,
  Wifi,
  Phone,
  Droplet,
  CreditCard,
  ChevronRight,
  Filter,
  Send
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Bill {
  id: string;
  payee: string;
  category: 'utilities' | 'rent' | 'supplies' | 'services' | 'insurance' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'scheduled';
  autopay: boolean;
}

const mockBills: Bill[] = [
  { id: '1', payee: 'City Power Co.', category: 'utilities', amount: 285.50, dueDate: 'Jan 28, 2025', status: 'pending', autopay: true },
  { id: '2', payee: 'Premium Property LLC', category: 'rent', amount: 3500.00, dueDate: 'Feb 1, 2025', status: 'scheduled', autopay: true },
  { id: '3', payee: 'Internet Plus', category: 'services', amount: 89.99, dueDate: 'Jan 25, 2025', status: 'overdue', autopay: false },
  { id: '4', payee: 'Water Utilities', category: 'utilities', amount: 125.00, dueDate: 'Jan 30, 2025', status: 'pending', autopay: false },
  { id: '5', payee: 'Business Insurance Inc', category: 'insurance', amount: 450.00, dueDate: 'Feb 5, 2025', status: 'pending', autopay: true },
  { id: '6', payee: 'Coffee Supplies Co.', category: 'supplies', amount: 892.00, dueDate: 'Jan 20, 2025', status: 'paid', autopay: false },
];

const quickPayees = [
  { id: '1', name: 'Power', icon: Zap, color: '#F39C12' },
  { id: '2', name: 'Internet', icon: Wifi, color: '#3498DB' },
  { id: '3', name: 'Phone', icon: Phone, color: '#9B59B6' },
  { id: '4', name: 'Water', icon: Droplet, color: '#1ABC9C' },
  { id: '5', name: 'Rent', icon: Building2, color: '#E74C3C' },
  { id: '6', name: 'Other', icon: Plus, color: Colors.textSecondary },
];

export default function BillPay() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Pending', 'Overdue', 'Paid', 'Scheduled'];

  const totalDue = mockBills
    .filter(bill => bill.status === 'pending' || bill.status === 'overdue')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const overdueBills = mockBills.filter(bill => bill.status === 'overdue').length;
  const upcomingBills = mockBills.filter(bill => bill.status === 'pending' || bill.status === 'scheduled').length;

  const filteredBills = mockBills.filter(bill => {
    const matchesSearch = bill.payee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || bill.status === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'paid': return Colors.accent;
      case 'pending': return Colors.warning;
      case 'overdue': return Colors.error;
      case 'scheduled': return Colors.primary;
      default: return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} color={Colors.accent} />;
      case 'pending': return <Clock size={14} color={Colors.warning} />;
      case 'overdue': return <AlertCircle size={14} color={Colors.error} />;
      case 'scheduled': return <Calendar size={14} color={Colors.primary} />;
    }
  };

  const getCategoryIcon = (category: Bill['category']) => {
    switch (category) {
      case 'utilities': return Zap;
      case 'rent': return Building2;
      case 'supplies': return Receipt;
      case 'services': return Wifi;
      case 'insurance': return CreditCard;
      default: return Receipt;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Pay</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryLabel}>Total Due</Text>
            <Text style={styles.summaryAmount}>${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
            {overdueBills > 0 && (
              <View style={styles.overdueAlert}>
                <AlertCircle size={14} color={Colors.error} />
                <Text style={styles.overdueText}>{overdueBills} bill{overdueBills > 1 ? 's' : ''} overdue</Text>
              </View>
            )}
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{upcomingBills}</Text>
              <Text style={styles.summaryStatLabel}>Upcoming</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{mockBills.filter(b => b.autopay).length}</Text>
              <Text style={styles.summaryStatLabel}>Auto-Pay</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickPaySection}>
          <Text style={styles.quickPayTitle}>Quick Pay</Text>
          <View style={styles.quickPayGrid}>
            {quickPayees.map(payee => (
              <TouchableOpacity key={payee.id} style={styles.quickPayCard}>
                <View style={[styles.quickPayIcon, { backgroundColor: payee.color + '20' }]}>
                  <payee.icon size={20} color={payee.color} />
                </View>
                <Text style={styles.quickPayLabel}>{payee.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search bills..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, selectedFilter === filter && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterChipText, selectedFilter === filter && styles.filterChipTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bills</Text>
            <Text style={styles.billCount}>{filteredBills.length} bills</Text>
          </View>

          {filteredBills.map(bill => {
            const CategoryIcon = getCategoryIcon(bill.category);
            return (
              <TouchableOpacity key={bill.id} style={styles.billCard}>
                <View style={styles.billIcon}>
                  <CategoryIcon size={20} color={Colors.primary} />
                </View>
                <View style={styles.billInfo}>
                  <Text style={styles.billPayee}>{bill.payee}</Text>
                  <View style={styles.billMeta}>
                    <Calendar size={12} color={Colors.textSecondary} />
                    <Text style={styles.billDueDate}>Due {bill.dueDate}</Text>
                    {bill.autopay && (
                      <View style={styles.autopayBadge}>
                        <Text style={styles.autopayText}>Auto-Pay</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.billRight}>
                  <Text style={styles.billAmount}>${bill.amount.toFixed(2)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
                    {getStatusIcon(bill.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                      {bill.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionCard}>
            <Send size={22} color={Colors.primary} />
            <Text style={styles.actionText}>Pay All Due</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Calendar size={22} color={Colors.accent} />
            <Text style={styles.actionText}>Payment History</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <CreditCard size={22} color="#9B59B6" />
            <Text style={styles.actionText}>Manage Auto-Pay</Text>
            <ChevronRight size={16} color={Colors.textSecondary} />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#B5E5F5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryMain: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#1A5276',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D3B54',
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.error + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 8,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,59,84,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D3B54',
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#1A5276',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(13,59,84,0.2)',
  },
  quickPaySection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  quickPayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  quickPayGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickPayCard: {
    alignItems: 'center',
    width: '15%',
  },
  quickPayIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickPayLabel: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  billCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  billIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billPayee: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  billMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  billDueDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  autopayBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  autopayText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.accent,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionsSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
