import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Package, Clock, Check, X, Filter, Search, 
  ChevronRight, DollarSign, User, Calendar
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function MerchantOrdersScreen() {
  const insets = useSafeAreaInsets();
  const { merchantOrders, completeOrder } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const filteredOrders = merchantOrders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const pendingCount = merchantOrders.filter(o => o.status === 'pending').length;
  const completedCount = merchantOrders.filter(o => o.status === 'completed').length;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'completed': return Colors.accent;
      case 'cancelled': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Clock size={14} color={Colors.warning} />
            <Text style={styles.headerStatText}>{pendingCount} pending</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{merchantOrders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed', 'cancelled'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.content}
      >
        {filteredOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderIdRow}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>{formatDate(order.timestamp)}</Text>
            </View>

            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <View style={styles.itemIcon}>
                    <Package size={16} color={Colors.textSecondary} />
                  </View>
                  <Text style={styles.itemName}>{item.quantity}x {item.product.name}</Text>
                  <Text style={styles.itemPrice}>${(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderTotal}>
                <DollarSign size={16} color={Colors.accent} />
                <Text style={styles.totalText}>${order.total.toFixed(2)}</Text>
                <Text style={styles.paymentMethod}>{order.paymentToken}</Text>
              </View>
              {order.status === 'pending' && (
                <View style={styles.orderActions}>
                  <TouchableOpacity 
                    style={styles.rejectBtn}
                    onPress={() => console.log('Reject order:', order.id)}
                  >
                    <X size={18} color={Colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.completeBtn}
                    onPress={() => completeOrder(order.id)}
                  >
                    <Check size={18} color={Colors.background} />
                    <Text style={styles.completeBtnText}>Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptyDesc}>Orders will appear here when customers place them</Text>
          </View>
        )}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  headerStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    marginBottom: 12,
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  orderItems: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent,
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
