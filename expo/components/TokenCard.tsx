import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { Token } from '@/constants/tokens';
import { useApp } from '@/contexts/AppContext';

interface TokenCardProps {
  token: Token;
  onPress?: () => void;
}

export default function TokenCard({ token, onPress }: TokenCardProps) {
  const { colors } = useApp();
  const isPositive = token.change24h >= 0;
  const totalValue = token.balance * token.usdValue;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: token.color + '20' }]}>
        <Text style={styles.icon}>{token.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{token.name}</Text>
        <Text style={[styles.balance, { color: colors.textSecondary }]}>
          {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {token.symbol}
        </Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: colors.text }]}>
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={[styles.changeContainer, { backgroundColor: isPositive ? colors.success + '20' : colors.error + '20' }]}>
          {isPositive ? (
            <TrendingUp size={12} color={colors.success} />
          ) : (
            <TrendingDown size={12} color={colors.error} />
          )}
          <Text style={[styles.change, { color: isPositive ? colors.success : colors.error }]}>
            {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  balance: {
    fontSize: 14,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
