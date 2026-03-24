import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, Filter, Download, Share2, ChevronRight, Receipt, Calendar, QrCode,
  DollarSign, User, CreditCard, CheckCircle, Clock, XCircle, Eye,
  FileText, Printer, Mail
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface ReceiptItem {
  id: string;
  receiptNumber: string;
  date: string;
  customer: string;
  items: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'refunded';
}

const mockReceipts: ReceiptItem[] = [
  {
    id: '1',
    receiptNumber: 'RCP-2024-001234',
    date: '2024-01-25 14:32',
    customer: 'John Smith',
    items: 3,
    total: 89.99,
    paymentMethod: 'Crypto - USDC',
    status: 'completed',
  },
  {
    id: '2',
    receiptNumber: 'RCP-2024-001233',
    date: '2024-01-25 12:15',
    customer: 'Sarah Johnson',
    items: 5,
    total: 156.50,
    paymentMethod: 'Credit Card',
    status: 'completed',
  },
  {
    id: '3',
    receiptNumber: 'RCP-2024-001232',
    date: '2024-01-25 10:45',
    customer: 'Mike Williams',
    items: 2,
    total: 45.00,
    paymentMethod: 'Crypto - SOL',
    status: 'pending',
  },
  {
    id: '4',
    receiptNumber: 'RCP-2024-001231',
    date: '2024-01-24 18:20',
    customer: 'Emily Brown',
    items: 7,
    total: 234.75,
    paymentMethod: 'Debit Card',
    status: 'completed',
  },
  {
    id: '5',
    receiptNumber: 'RCP-2024-001230',
    date: '2024-01-24 15:10',
    customer: 'David Lee',
    items: 1,
    total: 29.99,
    paymentMethod: 'Crypto - BTC',
    status: 'refunded',
  },
  {
    id: '6',
    receiptNumber: 'RCP-2024-001229',
    date: '2024-01-24 11:05',
    customer: 'Lisa Garcia',
    items: 4,
    total: 112.00,
    paymentMethod: 'Apple Pay',
    status: 'completed',
  },
  {
    id: '7',
    receiptNumber: 'RCP-2024-001228',
    date: '2024-01-23 16:45',
    customer: 'James Wilson',
    items: 6,
    total: 189.50,
    paymentMethod: 'Crypto - ETH',
    status: 'completed',
  },
];

const receiptStats = [
  { label: 'Today', value: '$292.49', count: 3 },
  { label: 'This Week', value: '$1,245.89', count: 18 },
  { label: 'This Month', value: '$4,892.50', count: 67 },
];

export default function ReceiptsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'refunded':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'refunded':
        return XCircle;
      default:
        return Receipt;
    }
  };

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || receipt.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Receipts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.surface }]}>
            <Download size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Search size={18} color={colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search receipts..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.background }]}>
          <Filter size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.background }]}>
          <QrCode size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          {receiptStats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statCount, { color: Colors.primary }]}>{stat.count} receipts</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.filterTabs}>
          {(['all', 'completed', 'pending', 'refunded'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                { backgroundColor: colors.surface },
                activeFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterTabText,
                { color: colors.textSecondary },
                activeFilter === filter && styles.filterTabTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.receiptsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Receipts</Text>
            <Text style={[styles.receiptCount, { color: colors.textSecondary }]}>{filteredReceipts.length} found</Text>
          </View>

          {filteredReceipts.map((receipt) => {
            const StatusIcon = getStatusIcon(receipt.status);
            const statusColor = getStatusColor(receipt.status);
            
            return (
              <TouchableOpacity 
                key={receipt.id} 
                style={[styles.receiptCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.receiptHeader}>
                  <View style={[styles.receiptIcon, { backgroundColor: statusColor + '15' }]}>
                    <Receipt size={20} color={statusColor} />
                  </View>
                  <View style={styles.receiptInfo}>
                    <Text style={[styles.receiptNumber, { color: colors.text }]}>{receipt.receiptNumber}</Text>
                    <View style={styles.receiptMeta}>
                      <Calendar size={12} color={colors.textTertiary} />
                      <Text style={[styles.receiptDate, { color: colors.textTertiary }]}>{receipt.date}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                    <StatusIcon size={12} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.receiptDetails, { borderTopColor: colors.border }]}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <User size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>{receipt.customer}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CreditCard size={14} color={colors.textSecondary} />
                      <Text style={[styles.detailText, { color: colors.textSecondary }]}>{receipt.paymentMethod}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.itemsText, { color: colors.textSecondary }]}>{receipt.items} items</Text>
                    <Text style={[styles.totalText, { color: colors.text }]}>${receipt.total.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={[styles.receiptActions, { borderTopColor: colors.border }]}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Eye size={16} color={Colors.primary} />
                    <Text style={[styles.actionText, { color: Colors.primary }]}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Printer size={16} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Print</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Mail size={16} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Email</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Share2 size={16} color={colors.textSecondary} />
                    <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsScroll: {
    marginBottom: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 140,
    borderRadius: 16,
    padding: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statCount: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: Colors.primary + '15',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  filterTabTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  receiptsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  receiptCount: {
    fontSize: 13,
  },
  receiptCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptNumber: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  receiptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  receiptDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  receiptDetails: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
  },
  itemsText: {
    fontSize: 13,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  receiptActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
