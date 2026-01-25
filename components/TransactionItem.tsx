import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Clock } from 'lucide-react-native';
import { Transaction } from '@/mocks/transactions';
import { useApp } from '@/contexts/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export default function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { colors } = useApp();

  const getIcon = () => {
    const iconProps = { size: 20, strokeWidth: 2 };
    switch (transaction.type) {
      case 'send':
        return <ArrowUpRight {...iconProps} color={colors.error} />;
      case 'receive':
        return <ArrowDownLeft {...iconProps} color={colors.success} />;
      case 'swap':
        return <RefreshCw {...iconProps} color={colors.primary} />;
      case 'purchase':
        return <CreditCard {...iconProps} color={colors.accent} />;
    }
  };

  const getIconBg = () => {
    switch (transaction.type) {
      case 'send':
        return colors.error + '20';
      case 'receive':
        return colors.success + '20';
      case 'swap':
        return colors.primary + '20';
      case 'purchase':
        return colors.accent + '20';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getAmountPrefix = () => {
    return transaction.type === 'send' ? '-' : '+';
  };

  const getAmountColor = () => {
    return transaction.type === 'send' ? colors.error : colors.success;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBg() }]}>
        {getIcon()}
      </View>
      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.description, { color: colors.text }]}>{transaction.description}</Text>
          {transaction.status === 'pending' && (
            <View style={[styles.pendingBadge, { backgroundColor: colors.warning + '20' }]}>
              <Clock size={10} color={colors.warning} />
              <Text style={[styles.pendingText, { color: colors.warning }]}>Pending</Text>
            </View>
          )}
        </View>
        <Text style={[styles.address, { color: colors.textSecondary }]}>{transaction.address}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.amount, { color: getAmountColor() }]}>
          {getAmountPrefix()}{transaction.amount} {transaction.token}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>{formatTime(transaction.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  pendingText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
});
