import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, TrendingUp, TrendingDown, X, ChevronDown, Coins, Shield, BarChart3, Clock, ArrowUpRight, ArrowDownLeft, Info, Check } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Metal {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  supply: string;
  image: string;
  description: string;
  purity: string;
  unit: string;
}

interface Holding {
  metalId: string;
  amount: number;
  avgBuyPrice: number;
}

const preciousMetals: Metal[] = [
  {
    id: 'gold',
    name: 'Gold',
    symbol: 'XAU',
    price: 2024.50,
    change24h: 1.25,
    marketCap: '$12.5T',
    volume24h: '$182.5B',
    supply: '208,874 tonnes',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&h=200&fit=crop',
    description: 'Tokenized 99.99% pure gold bullion stored in secure vaults',
    purity: '99.99%',
    unit: 'oz',
  },
  {
    id: 'silver',
    name: 'Silver',
    symbol: 'XAG',
    price: 23.45,
    change24h: -0.82,
    marketCap: '$1.4T',
    volume24h: '$28.3B',
    supply: '1.74M tonnes',
    image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=200&h=200&fit=crop',
    description: 'Tokenized 99.9% pure silver bars with verified storage',
    purity: '99.9%',
    unit: 'oz',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    symbol: 'XPT',
    price: 982.30,
    change24h: 2.15,
    marketCap: '$195B',
    volume24h: '$4.8B',
    supply: '9,978 tonnes',
    image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=200&h=200&fit=crop',
    description: 'Tokenized 99.95% pure platinum from certified refiners',
    purity: '99.95%',
    unit: 'oz',
  },
  {
    id: 'palladium',
    name: 'Palladium',
    symbol: 'XPD',
    price: 1045.80,
    change24h: -1.45,
    marketCap: '$42B',
    volume24h: '$1.2B',
    supply: '3,150 tonnes',
    image: 'https://images.unsplash.com/photo-1617375407633-acd67aba7864?w=200&h=200&fit=crop',
    description: 'Tokenized 99.95% pure palladium with proof of reserves',
    purity: '99.95%',
    unit: 'oz',
  },
  {
    id: 'rhodium',
    name: 'Rhodium',
    symbol: 'XRH',
    price: 4850.00,
    change24h: 3.25,
    marketCap: '$8.5B',
    volume24h: '$320M',
    supply: '30 tonnes/year',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=200&h=200&fit=crop',
    description: 'Rare tokenized rhodium with highest purity standards',
    purity: '99.9%',
    unit: 'oz',
  },
];

const recentTransactions = [
  { id: '1', type: 'buy', metal: 'Gold', amount: 0.5, price: 2024.50, total: 1012.25, date: '2024-01-15' },
  { id: '2', type: 'sell', metal: 'Silver', amount: 10, price: 23.45, total: 234.50, date: '2024-01-14' },
  { id: '3', type: 'buy', metal: 'Platinum', amount: 0.25, price: 982.30, total: 245.58, date: '2024-01-12' },
];

export default function TokenizedPreciousMetalsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetal, setSelectedMetal] = useState<Metal | null>(null);
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([
    { metalId: 'gold', amount: 1.5, avgBuyPrice: 1985.20 },
    { metalId: 'silver', amount: 50, avgBuyPrice: 22.80 },
  ]);

  const filteredMetals = preciousMetals.filter(metal =>
    metal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    metal.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHolding = (metalId: string) => holdings.find(h => h.metalId === metalId);

  const getTotalPortfolioValue = () => {
    return holdings.reduce((total, holding) => {
      const metal = preciousMetals.find(m => m.id === holding.metalId);
      return total + (metal ? metal.price * holding.amount : 0);
    }, 0);
  };

  const openTradeModal = (metal: Metal, type: 'buy' | 'sell') => {
    setSelectedMetal(metal);
    setTradeType(type);
    setAmount('');
    setTradeModalVisible(true);
  };

  const openDetailModal = (metal: Metal) => {
    setSelectedMetal(metal);
    setDetailModalVisible(true);
  };

  const executeTrade = () => {
    if (!selectedMetal || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const holding = getHolding(selectedMetal.id);

    if (tradeType === 'sell' && (!holding || holding.amount < amountNum)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    if (tradeType === 'buy') {
      if (holding) {
        const newAmount = holding.amount + amountNum;
        const newAvgPrice = ((holding.avgBuyPrice * holding.amount) + (selectedMetal.price * amountNum)) / newAmount;
        setHoldings(prev => prev.map(h => 
          h.metalId === selectedMetal.id 
            ? { ...h, amount: newAmount, avgBuyPrice: newAvgPrice }
            : h
        ));
      } else {
        setHoldings(prev => [...prev, { metalId: selectedMetal.id, amount: amountNum, avgBuyPrice: selectedMetal.price }]);
      }
      Alert.alert('Success', `Purchased ${amountNum} ${selectedMetal.unit} of ${selectedMetal.name}`);
    } else {
      const newAmount = (holding?.amount || 0) - amountNum;
      if (newAmount <= 0) {
        setHoldings(prev => prev.filter(h => h.metalId !== selectedMetal.id));
      } else {
        setHoldings(prev => prev.map(h => 
          h.metalId === selectedMetal.id 
            ? { ...h, amount: newAmount }
            : h
        ));
      }
      Alert.alert('Success', `Sold ${amountNum} ${selectedMetal.unit} of ${selectedMetal.name}`);
    }

    setTradeModalVisible(false);
    setAmount('');
  };

  const renderTradeModal = () => (
    <Modal
      visible={tradeModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setTradeModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedMetal?.name}
            </Text>
            <TouchableOpacity onPress={() => setTradeModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {selectedMetal && (
            <>
              <View style={[styles.priceDisplay, { backgroundColor: colors.surface }]}>
                <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>Current Price</Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>
                  ${selectedMetal.price.toLocaleString()} / {selectedMetal.unit}
                </Text>
                <View style={styles.priceChange}>
                  {selectedMetal.change24h >= 0 ? (
                    <TrendingUp size={14} color={colors.success} />
                  ) : (
                    <TrendingDown size={14} color={colors.error} />
                  )}
                  <Text style={{ color: selectedMetal.change24h >= 0 ? colors.success : colors.error, fontSize: 13 }}>
                    {selectedMetal.change24h >= 0 ? '+' : ''}{selectedMetal.change24h}%
                  </Text>
                </View>
              </View>

              {tradeType === 'sell' && (
                <View style={[styles.balanceInfo, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.balanceLabel, { color: colors.textTertiary }]}>Available Balance</Text>
                  <Text style={[styles.balanceValue, { color: colors.text }]}>
                    {getHolding(selectedMetal.id)?.amount.toFixed(4) || '0'} {selectedMetal.unit}
                  </Text>
                </View>
              )}

              <View style={styles.inputSection}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                  Amount ({selectedMetal.unit})
                </Text>
                <View style={[styles.amountInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="0.00"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                  />
                  <TouchableOpacity 
                    style={[styles.maxButton, { backgroundColor: colors.primary + '20' }]}
                    onPress={() => {
                      if (tradeType === 'sell') {
                        const holding = getHolding(selectedMetal.id);
                        setAmount(holding?.amount.toString() || '0');
                      }
                    }}
                  >
                    <Text style={[styles.maxButtonText, { color: colors.primary }]}>MAX</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.quickAmounts}>
                {['0.1', '0.5', '1', '5'].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.quickAmountBtn, { backgroundColor: colors.surface }]}
                    onPress={() => setAmount(val)}
                  >
                    <Text style={[styles.quickAmountText, { color: colors.text }]}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.totalSection, { backgroundColor: colors.surface }]}>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textTertiary }]}>Subtotal</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>
                    ${(parseFloat(amount || '0') * selectedMetal.price).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.textTertiary }]}>Fee (0.1%)</Text>
                  <Text style={[styles.totalValue, { color: colors.text }]}>
                    ${(parseFloat(amount || '0') * selectedMetal.price * 0.001).toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.totalRow}>
                  <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total</Text>
                  <Text style={[styles.grandTotalValue, { color: colors.primary }]}>
                    ${(parseFloat(amount || '0') * selectedMetal.price * (tradeType === 'buy' ? 1.001 : 0.999)).toFixed(2)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.executeButton,
                  { backgroundColor: tradeType === 'buy' ? colors.success : colors.error }
                ]}
                onPress={executeTrade}
              >
                <Text style={styles.executeButtonText}>
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedMetal.name}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderDetailModal = () => (
    <Modal
      visible={detailModalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setDetailModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background, maxHeight: '85%' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedMetal?.name} Details</Text>
            <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {selectedMetal && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.detailImageContainer}>
                <Image source={{ uri: selectedMetal.image }} style={styles.detailImage} />
              </View>

              <View style={[styles.detailStats, { backgroundColor: colors.surface }]}>
                <View style={styles.detailStatRow}>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Symbol</Text>
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>{selectedMetal.symbol}</Text>
                </View>
                <View style={styles.detailStatRow}>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Purity</Text>
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>{selectedMetal.purity}</Text>
                </View>
                <View style={styles.detailStatRow}>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Market Cap</Text>
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>{selectedMetal.marketCap}</Text>
                </View>
                <View style={styles.detailStatRow}>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>24h Volume</Text>
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>{selectedMetal.volume24h}</Text>
                </View>
                <View style={styles.detailStatRow}>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Global Supply</Text>
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>{selectedMetal.supply}</Text>
                </View>
              </View>

              <View style={[styles.descriptionBox, { backgroundColor: colors.surface }]}>
                <Info size={18} color={colors.primary} />
                <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                  {selectedMetal.description}
                </Text>
              </View>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={[styles.detailActionBtn, { backgroundColor: colors.success }]}
                  onPress={() => {
                    setDetailModalVisible(false);
                    openTradeModal(selectedMetal, 'buy');
                  }}
                >
                  <ArrowDownLeft size={18} color="#FFF" />
                  <Text style={styles.detailActionText}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.detailActionBtn, { backgroundColor: colors.error }]}
                  onPress={() => {
                    setDetailModalVisible(false);
                    openTradeModal(selectedMetal, 'sell');
                  }}
                >
                  <ArrowUpRight size={18} color="#FFF" />
                  <Text style={styles.detailActionText}>Sell</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Precious Metals' }} />
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.portfolioCard, { backgroundColor: colors.primary }]}>
          <View style={styles.portfolioHeader}>
            <Coins size={24} color="#FFF" />
            <Text style={styles.portfolioTitle}>Your Holdings</Text>
          </View>
          <Text style={styles.portfolioValue}>${getTotalPortfolioValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.portfolioAssets}>
            {holdings.map(holding => {
              const metal = preciousMetals.find(m => m.id === holding.metalId);
              if (!metal) return null;
              const value = metal.price * holding.amount;
              const pnl = ((metal.price - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
              return (
                <View key={holding.metalId} style={styles.portfolioAsset}>
                  <Text style={styles.portfolioAssetName}>{metal.symbol}</Text>
                  <Text style={styles.portfolioAssetAmount}>{holding.amount.toFixed(2)} {metal.unit}</Text>
                  <Text style={[styles.portfolioAssetPnl, { color: pnl >= 0 ? '#90EE90' : '#FFB6C1' }]}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search precious metals..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Precious Metals</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Shield size={12} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.primary }]}>Vault Secured</Text>
            </View>
          </View>

          {filteredMetals.map(metal => {
            const holding = getHolding(metal.id);
            return (
              <TouchableOpacity
                key={metal.id}
                style={[styles.metalCard, { backgroundColor: colors.surface }]}
                onPress={() => openDetailModal(metal)}
              >
                <Image source={{ uri: metal.image }} style={styles.metalImage} />
                <View style={styles.metalInfo}>
                  <View style={styles.metalHeader}>
                    <Text style={[styles.metalName, { color: colors.text }]}>{metal.name}</Text>
                    <Text style={[styles.metalSymbol, { color: colors.textTertiary }]}>{metal.symbol}</Text>
                  </View>
                  <View style={styles.metalPriceRow}>
                    <Text style={[styles.metalPrice, { color: colors.text }]}>
                      ${metal.price.toLocaleString()}
                    </Text>
                    <View style={[
                      styles.changeBox,
                      { backgroundColor: metal.change24h >= 0 ? colors.success + '20' : colors.error + '20' }
                    ]}>
                      {metal.change24h >= 0 ? (
                        <TrendingUp size={12} color={colors.success} />
                      ) : (
                        <TrendingDown size={12} color={colors.error} />
                      )}
                      <Text style={{ 
                        color: metal.change24h >= 0 ? colors.success : colors.error,
                        fontSize: 12,
                        fontWeight: '600' as const,
                      }}>
                        {metal.change24h >= 0 ? '+' : ''}{metal.change24h}%
                      </Text>
                    </View>
                  </View>
                  {holding && (
                    <Text style={[styles.holdingText, { color: colors.primary }]}>
                      You own: {holding.amount.toFixed(4)} {metal.unit}
                    </Text>
                  )}
                </View>
                <View style={styles.metalActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.success }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      openTradeModal(metal, 'buy');
                    }}
                  >
                    <Text style={styles.actionBtnText}>Buy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.error }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      openTradeModal(metal, 'sell');
                    }}
                  >
                    <Text style={styles.actionBtnText}>Sell</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <Clock size={16} color={colors.textTertiary} />
          </View>

          {recentTransactions.map(tx => (
            <View key={tx.id} style={[styles.txCard, { backgroundColor: colors.surface }]}>
              <View style={[
                styles.txIcon,
                { backgroundColor: tx.type === 'buy' ? colors.success + '20' : colors.error + '20' }
              ]}>
                {tx.type === 'buy' ? (
                  <ArrowDownLeft size={18} color={colors.success} />
                ) : (
                  <ArrowUpRight size={18} color={colors.error} />
                )}
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txTitle, { color: colors.text }]}>
                  {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.metal}
                </Text>
                <Text style={[styles.txDate, { color: colors.textTertiary }]}>{tx.date}</Text>
              </View>
              <View style={styles.txAmounts}>
                <Text style={[styles.txAmount, { color: colors.text }]}>{tx.amount} oz</Text>
                <Text style={[
                  styles.txTotal,
                  { color: tx.type === 'buy' ? colors.error : colors.success }
                ]}>
                  {tx.type === 'buy' ? '-' : '+'}${tx.total.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Shield size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>100% Backed & Insured</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              All tokenized metals are backed 1:1 by physical bullion stored in LBMA-certified vaults with full insurance coverage.
            </Text>
          </View>
        </View>
      </ScrollView>

      {renderTradeModal()}
      {renderDetailModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  portfolioCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
  },
  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 16,
  },
  portfolioAssets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  portfolioAsset: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  portfolioAssetName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  portfolioAssetAmount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  portfolioAssetPnl: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  metalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  metalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  metalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  metalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metalName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  metalSymbol: {
    fontSize: 12,
  },
  metalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metalPrice: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  changeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  holdingText: {
    fontSize: 11,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  metalActions: {
    flexDirection: 'column',
    gap: 6,
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#FFF',
    textAlign: 'center' as const,
  },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  txDate: {
    fontSize: 11,
    marginTop: 2,
  },
  txAmounts: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  txTotal: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  priceDisplay: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  balanceInfo: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
  },
  balanceValue: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  inputSection: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  maxButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  maxButtonText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  totalSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 13,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  executeButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  detailImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  detailImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  detailStats: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  detailStatLabel: {
    fontSize: 13,
  },
  detailStatValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  descriptionBox: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
  },
  descriptionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
  },
  detailActionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
