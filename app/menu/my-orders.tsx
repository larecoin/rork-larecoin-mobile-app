import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const orders = [
  { id: 'ORD-001', items: [{ name: 'Crypto Hardware Wallet', image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop', qty: 1 }], total: '$149.99', status: 'delivered', date: 'Jan 20, 2026' },
  { id: 'ORD-002', items: [{ name: 'NFT Art Print', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', qty: 2 }], total: '$89.98', status: 'shipping', date: 'Jan 22, 2026' },
  { id: 'ORD-003', items: [{ name: 'DeFi Course Access', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', qty: 1 }], total: '$299.00', status: 'processing', date: 'Jan 24, 2026' },
];

const tabs = ['All', 'Processing', 'Shipping', 'Delivered'];

export default function MyOrdersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered': return { icon: CheckCircle, color: colors.success, label: 'Delivered' };
      case 'shipping': return { icon: Truck, color: colors.primary, label: 'Shipping' };
      case 'processing': return { icon: Clock, color: colors.warning, label: 'Processing' };
      default: return { icon: Package, color: colors.textTertiary, label: status };
    }
  };

  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(o => o.status === activeTab.toLowerCase());

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Orders' }} />
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              { backgroundColor: activeTab === tab ? colors.primary : colors.surface }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? '#FFF' : colors.text }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((order) => {
          const status = getStatusInfo(order.status);
          return (
            <TouchableOpacity
              key={order.id}
              style={[styles.orderCard, { backgroundColor: colors.surface }]}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={[styles.orderId, { color: colors.text }]}>{order.id}</Text>
                  <Text style={[styles.orderDate, { color: colors.textTertiary }]}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
                  <status.icon size={14} color={status.color} />
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.itemQty, { color: colors.textTertiary }]}>Qty: {item.qty}</Text>
                  </View>
                </View>
              ))}

              <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
                <Text style={[styles.totalLabel, { color: colors.textTertiary }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>{order.total}</Text>
                <ChevronRight size={20} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No orders found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  orderCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  itemQty: {
    fontSize: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
  },
  totalLabel: {
    flex: 1,
    fontSize: 13,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 12,
  },
});
