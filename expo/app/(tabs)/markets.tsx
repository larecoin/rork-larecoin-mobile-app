import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Search, Flame, ShoppingCart, DollarSign, ArrowLeftRight, Star, Bell } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  icon: string;
  isTrending?: boolean;
  isFavorite?: boolean;
}

const marketData: MarketItem[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 67234.50, change24h: 2.45, marketCap: '$1.32T', icon: '₿', isTrending: true, isFavorite: true },
  { id: '2', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change24h: 1.23, marketCap: '$415B', icon: 'Ξ', isTrending: true },
  { id: '3', name: 'Larecoin', symbol: 'LARE', price: 1.85, change24h: 5.67, marketCap: '$185M', icon: 'L', isTrending: true, isFavorite: true },
  { id: '4', name: 'Solana', symbol: 'SOL', price: 142.30, change24h: -1.45, marketCap: '$62B', icon: '◎', isTrending: true },
  { id: '5', name: 'LUSD', symbol: 'LUSD', price: 1.00, change24h: 0.01, marketCap: '$52M', icon: '$', isFavorite: true },
  { id: '6', name: 'Polygon', symbol: 'MATIC', price: 0.72, change24h: -2.34, marketCap: '$7.1B', icon: '⬡' },
];

type FilterType = 'all' | 'trending' | 'gainers' | 'losers' | 'favorites';

export default function MarketsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '3', '5']));

  const handleAssetPress = (id: string) => {
    setSelectedAssetId(prev => prev === id ? null : id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAction = (action: string, item: MarketItem) => {
    console.log(`${action} action for ${item.symbol}`);
  };

  const filteredData = marketData.filter(item => {
    switch (activeFilter) {
      case 'trending':
        return item.isTrending;
      case 'gainers':
        return item.change24h > 0;
      case 'losers':
        return item.change24h < 0;
      case 'favorites':
        return item.isFavorite;
      default:
        return true;
    }
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Markets</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'all' && styles.tabActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.tabText, activeFilter === 'all' && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'trending' && styles.tabActive]}
          onPress={() => setActiveFilter('trending')}
        >
          <View style={styles.tabWithIcon}>
            <Flame size={14} color={activeFilter === 'trending' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeFilter === 'trending' && styles.tabTextActive]}>Trending</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'gainers' && styles.tabActive]}
          onPress={() => setActiveFilter('gainers')}
        >
          <Text style={[styles.tabText, activeFilter === 'gainers' && styles.tabTextActive]}>Gainers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'losers' && styles.tabActive]}
          onPress={() => setActiveFilter('losers')}
        >
          <Text style={[styles.tabText, activeFilter === 'losers' && styles.tabTextActive]}>Losers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeFilter === 'favorites' && styles.tabActive]}
          onPress={() => setActiveFilter('favorites')}
        >
          <Text style={[styles.tabText, activeFilter === 'favorites' && styles.tabTextActive]}>Favorites</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Asset</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>24h</Text>
        </View>

        {filteredData.map(item => (
          <View key={item.id}>
            <TouchableOpacity 
              style={[styles.marketItem, selectedAssetId === item.id && styles.marketItemSelected]}
              onPress={() => handleAssetPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.assetInfo}>
                <View style={[styles.iconWrapper, selectedAssetId === item.id && styles.iconWrapperSelected]}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>
                <View>
                  <View style={styles.nameRow}>
                    <Text style={styles.assetName}>{item.name}</Text>
                    {item.isTrending && <Flame size={12} color={Colors.warning} />}
                    {favorites.has(item.id) && <Star size={12} color={Colors.warning} fill={Colors.warning} />}
                  </View>
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
            
            {selectedAssetId === item.id && (
              <View style={styles.actionPanel}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnBuy]}
                  onPress={() => handleAction('BUY', item)}
                >
                  <ShoppingCart size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>BUY</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnSell]}
                  onPress={() => handleAction('SELL', item)}
                >
                  <DollarSign size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>SELL</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnSwap]}
                  onPress={() => handleAction('SWAP', item)}
                >
                  <ArrowLeftRight size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>SWAP</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, favorites.has(item.id) ? styles.actionBtnStarred : styles.actionBtnStar]}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Star size={16} color="#fff" fill={favorites.has(item.id) ? '#fff' : 'transparent'} />
                  <Text style={styles.actionBtnText}>{favorites.has(item.id) ? 'STARRED' : 'STAR'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnAlert]}
                  onPress={() => handleAction('ALERT', item)}
                >
                  <Bell size={16} color="#fff" />
                  <Text style={styles.actionBtnText}>ALERT</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  tabsScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
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
  tabWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  marketItemSelected: {
    backgroundColor: Colors.primary + '10',
    borderBottomColor: Colors.primary + '30',
  },
  iconWrapperSelected: {
    backgroundColor: Colors.primary + '20',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  actionPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 80,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  actionBtnBuy: {
    backgroundColor: Colors.success,
  },
  actionBtnSell: {
    backgroundColor: Colors.error,
  },
  actionBtnSwap: {
    backgroundColor: Colors.primary,
  },
  actionBtnStar: {
    backgroundColor: Colors.textSecondary,
  },
  actionBtnStarred: {
    backgroundColor: Colors.warning,
  },
  actionBtnAlert: {
    backgroundColor: '#8B5CF6',
  },
});
