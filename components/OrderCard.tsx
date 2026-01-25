import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Order } from '@/mocks/products';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  onComplete?: () => void;
}

export default function OrderCard({ order, onPress, onComplete }: OrderCardProps) {
  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <Clock size={16} color={Colors.warning} />;
      case 'completed':
        return <CheckCircle size={16} color={Colors.success} />;
      case 'cancelled':
        return <XCircle size={16} color={Colors.error} />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            {getStatusIcon()}
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{formatTime(order.timestamp)}</Text>
      </View>

      <View style={styles.items}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}x {item.product.name}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>{itemCount} items</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
          <Text style={styles.paymentToken}>via {order.paymentToken}</Text>
        </View>
        
        {order.status === 'pending' && onComplete && (
          <TouchableOpacity 
            style={styles.completeButton}
            onPress={onComplete}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
        
        {order.status !== 'pending' && (
          <ChevronRight size={20} color={Colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
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
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  items: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  paymentToken: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  completeButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.background,
  },
});
