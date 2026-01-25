import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  icon: string;
}

const marketData: MarketItem[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 67234.50, change24h: 2.45, marketCap: '$1.32T', icon: '₿' },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change24h: 1.23, marketCap: '$415B', icon: 'Ξ' },
  { id: '3', name: 'Larecoin', symbol: 'LARE', price: 1.85, change24h: 5.67, marketCap: '$185M', icon: 'L' },
  { id: '4', name: 'Solana', symbol: 'SOL', price: 142.30, change24h: -1.45, marketCap: '$62B', icon: '◎' },
  { id: '5', name: 'LUSD', symbol: 'LUSD', price: 1.00, change24h: 0.01, marketCap: '$52M', icon: '$' },
  { id: '6', name: 'Polygon', symbol: 'MATIC', price: 0.72, change24h: -2.34, marketCap: '$7.1B', icon: '⬡' },
];

export default function MarketsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Gainers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Losers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Asset</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>24h</Text>
        </View>

        {marketData.map(item => (
          <TouchableOpacity key={item.id} style={styles.marketItem}>
            <View style={styles.assetInfo}>
              <View style={styles.iconWrapper}>
                <Text style={styles.iconText}>{item.icon}</Text>
              </View>
              <View>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetSymbol}>{item.symbol}</Text>
              </View>
            </View>
            <Text style={styles.price}>${item.price.toLocaleString()}</Text>
            <View style={[styles.changeWrapper, item.change24h >= 0 ? styles.changePositive : styles.changeNegative]}>
              {item.change24h >= 0 ? (
                <TrendingUp size={12} color={Colors.success} />
              ) : (
                <TrendingDown size={12} color={Colors.error} />
              )}
              <Text style={[styles.changeText, item.change24h >= 0 ? styles.changeTextPositive : styles.changeTextNegative]}>
                {Math.abs(item.change24h).toFixed(2)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}

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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  marketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  assetInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  assetName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  assetSymbol: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  price: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'right',
  },
  changeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changePositive: {
    backgroundColor: Colors.success + '15',
  },
  changeNegative: {
    backgroundColor: Colors.error + '15',
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: Colors.success,
  },
  changeTextNegative: {
    color: Colors.error,
  },
});
