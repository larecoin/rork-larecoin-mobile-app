import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wallet, Image as ImageIcon, Grid, List, Plus, Send, ArrowDownLeft, Receipt, Ticket, CreditCard, Zap } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

type NFTCategory = 'all' | 'collectibles' | 'receipts' | 'tickets' | 'memberships';

interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  value: string;
  category: NFTCategory;
  date?: string;
  merchant?: string;
  description?: string;
}

const nfts: NFTItem[] = [
  // Collectible NFTs
  { id: '1', name: 'Crypto Punk #1234', collection: 'CryptoPunks', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&h=200&fit=crop', value: '12.5 ETH', category: 'collectibles' },
  { id: '2', name: 'Bored Ape #5678', collection: 'BAYC', image: 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=200&h=200&fit=crop', value: '85 ETH', category: 'collectibles' },
  { id: '3', name: 'Azuki #9012', collection: 'Azuki', image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=200&h=200&fit=crop', value: '15 ETH', category: 'collectibles' },
  { id: '4', name: 'Doodle #3456', collection: 'Doodles', image: 'https://images.unsplash.com/photo-1569437061241-a848be43cc82?w=200&h=200&fit=crop', value: '8 ETH', category: 'collectibles' },
  { id: '5', name: 'Pudgy Penguin #2891', collection: 'Pudgy Penguins', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop', value: '4.2 ETH', category: 'collectibles' },
  { id: '6', name: 'Clone X #8821', collection: 'CloneX', image: 'https://images.unsplash.com/photo-1633477189729-9290b3261d0a?w=200&h=200&fit=crop', value: '6.8 ETH', category: 'collectibles' },
  
  // Receipt NFTs
  { id: 'r1', name: 'Apple MacBook Pro', collection: 'Purchase Receipts', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop', value: '$2,499.00', category: 'receipts', date: 'Jan 15, 2026', merchant: 'Apple Store', description: 'MacBook Pro 14" M3 Pro' },
  { id: 'r2', name: 'Nike Air Max', collection: 'Purchase Receipts', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', value: '$189.99', category: 'receipts', date: 'Jan 10, 2026', merchant: 'Nike', description: 'Air Max 90 - Size 10' },
  { id: 'r3', name: 'Whole Foods Groceries', collection: 'Purchase Receipts', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop', value: '$156.42', category: 'receipts', date: 'Jan 22, 2026', merchant: 'Whole Foods Market', description: 'Weekly grocery shopping' },
  { id: 'r4', name: 'Tesla Charging', collection: 'Service Receipts', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&h=200&fit=crop', value: '$45.80', category: 'receipts', date: 'Jan 20, 2026', merchant: 'Tesla Supercharger', description: '85 kWh charged' },
  { id: 'r5', name: 'Spotify Premium', collection: 'Subscription Receipts', image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop', value: '$10.99/mo', category: 'receipts', date: 'Jan 1, 2026', merchant: 'Spotify', description: 'Monthly subscription' },
  { id: 'r6', name: 'Starbucks Order', collection: 'Purchase Receipts', image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=200&h=200&fit=crop', value: '$7.45', category: 'receipts', date: 'Jan 24, 2026', merchant: 'Starbucks', description: 'Grande Caramel Macchiato' },
  { id: 'r7', name: 'Amazon Prime', collection: 'Subscription Receipts', image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=200&h=200&fit=crop', value: '$14.99/mo', category: 'receipts', date: 'Jan 5, 2026', merchant: 'Amazon', description: 'Prime membership renewal' },
  { id: 'r8', name: 'Gas Station', collection: 'Purchase Receipts', image: 'https://images.unsplash.com/photo-1545458102-2c9e9d6e1a62?w=200&h=200&fit=crop', value: '$52.30', category: 'receipts', date: 'Jan 18, 2026', merchant: 'Shell', description: '15.2 gallons premium' },
  
  // Event Tickets
  { id: 't1', name: 'ETH Denver 2026', collection: 'Event Tickets', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop', value: '0.5 ETH', category: 'tickets', date: 'Feb 28, 2026', description: 'VIP Access Pass' },
  { id: 't2', name: 'Lakers vs Warriors', collection: 'Sports Tickets', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=200&fit=crop', value: '$450.00', category: 'tickets', date: 'Mar 15, 2026', description: 'Section 102, Row A' },
  { id: 't3', name: 'Coldplay World Tour', collection: 'Concert Tickets', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop', value: '$285.00', category: 'tickets', date: 'Apr 22, 2026', description: 'Floor seats - GA' },
  
  // Membership NFTs
  { id: 'm1', name: 'Founders Club', collection: 'Premium Memberships', image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=200&fit=crop', value: '2 ETH', category: 'memberships', description: 'Lifetime Access' },
  { id: 'm2', name: 'Gym Elite Pass', collection: 'Fitness Memberships', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop', value: '$99/mo', category: 'memberships', date: 'Annual 2026', description: 'All locations access' },
  { id: 'm3', name: 'Coffee Club Gold', collection: 'Loyalty Programs', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop', value: 'Free', category: 'memberships', description: '500 points earned' },
];

const categories: { key: NFTCategory; label: string; icon: any }[] = [
  { key: 'all', label: 'All', icon: Grid },
  { key: 'collectibles', label: 'Collectibles', icon: ImageIcon },
  { key: 'receipts', label: 'Receipts', icon: Receipt },
  { key: 'tickets', label: 'Tickets', icon: Ticket },
  { key: 'memberships', label: 'Members', icon: CreditCard },
];

export default function WalletNFTsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, getTotalBalance, userTokens } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens');
  const [nftCategory, setNftCategory] = useState<NFTCategory>('all');

  const filteredNfts = nftCategory === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.category === nftCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Wallet & NFTs' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Wallet size={32} color="#FFF" />
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>${getTotalBalance().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <Send size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <ArrowDownLeft size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceAction}>
              <View style={styles.actionIcon}>
                <Plus size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Buy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tokens' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('tokens')}
          >
            <Wallet size={18} color={activeTab === 'tokens' ? '#FFF' : colors.text} />
            <Text style={[styles.tabText, { color: activeTab === 'tokens' ? '#FFF' : colors.text }]}>Tokens</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'nfts' && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab('nfts')}
          >
            <ImageIcon size={18} color={activeTab === 'nfts' ? '#FFF' : colors.text} />
            <Text style={[styles.tabText, { color: activeTab === 'nfts' ? '#FFF' : colors.text }]}>NFTs</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tokens' ? (
          <View style={styles.section}>
            {userTokens.map((token) => (
              <TouchableOpacity
                key={token.id}
                style={[styles.tokenCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.tokenIcon, { backgroundColor: token.color + '20' }]}>
                  <Text style={[styles.tokenSymbol, { color: token.color }]}>{token.symbol[0]}</Text>
                </View>
                <View style={styles.tokenInfo}>
                  <Text style={[styles.tokenName, { color: colors.text }]}>{token.name}</Text>
                  <Text style={[styles.tokenBalance, { color: colors.textTertiary }]}>
                    {token.balance} {token.symbol}
                  </Text>
                </View>
                <View style={styles.tokenValue}>
                  <Text style={[styles.tokenUsd, { color: colors.text }]}>
                    ${(token.balance * token.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[
                    styles.tokenChange,
                    { color: token.change24h >= 0 ? colors.success : colors.error }
                  ]}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryContainer}
            >
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = nftCategory === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      { backgroundColor: isActive ? colors.primary : colors.surface }
                    ]}
                    onPress={() => setNftCategory(cat.key)}
                  >
                    <IconComponent size={14} color={isActive ? '#FFF' : colors.textSecondary} />
                    <Text style={[
                      styles.categoryChipText,
                      { color: isActive ? '#FFF' : colors.textSecondary }
                    ]}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.nftHeader}>
              <Text style={[styles.nftCount, { color: colors.text }]}>{filteredNfts.length} Items</Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={[styles.viewButton, viewMode === 'grid' && { backgroundColor: colors.surface }]}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid size={18} color={viewMode === 'grid' ? colors.primary : colors.textTertiary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.viewButton, viewMode === 'list' && { backgroundColor: colors.surface }]}
                  onPress={() => setViewMode('list')}
                >
                  <List size={18} color={viewMode === 'list' ? colors.primary : colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            {viewMode === 'grid' ? (
              <View style={styles.nftGrid}>
                {filteredNfts.map((nft) => (
                  <TouchableOpacity
                    key={nft.id}
                    style={[styles.nftCard, { backgroundColor: colors.surface }]}
                  >
                    {nft.category === 'receipts' && (
                      <View style={[styles.receiptBadge, { backgroundColor: colors.primary }]}>
                        <Receipt size={10} color="#FFF" />
                      </View>
                    )}
                    {nft.category === 'tickets' && (
                      <View style={[styles.receiptBadge, { backgroundColor: '#F59E0B' }]}>
                        <Ticket size={10} color="#FFF" />
                      </View>
                    )}
                    {nft.category === 'memberships' && (
                      <View style={[styles.receiptBadge, { backgroundColor: '#8B5CF6' }]}>
                        <Zap size={10} color="#FFF" />
                      </View>
                    )}
                    <Image source={{ uri: nft.image }} style={styles.nftImage} />
                    <View style={styles.nftInfo}>
                      <Text style={[styles.nftName, { color: colors.text }]} numberOfLines={1}>{nft.name}</Text>
                      <Text style={[styles.nftCollection, { color: colors.textTertiary }]} numberOfLines={1}>{nft.collection}</Text>
                      {nft.date && (
                        <Text style={[styles.nftDate, { color: colors.textTertiary }]}>{nft.date}</Text>
                      )}
                      <Text style={[styles.nftValue, { color: colors.primary }]}>{nft.value}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.nftList}>
                {filteredNfts.map((nft) => (
                  <TouchableOpacity
                    key={nft.id}
                    style={[styles.nftListItem, { backgroundColor: colors.surface }]}
                  >
                    <Image source={{ uri: nft.image }} style={styles.nftListImage} />
                    <View style={styles.nftListInfo}>
                      <Text style={[styles.nftName, { color: colors.text }]} numberOfLines={1}>{nft.name}</Text>
                      <Text style={[styles.nftCollection, { color: colors.textTertiary }]} numberOfLines={1}>{nft.collection}</Text>
                      {nft.merchant && (
                        <Text style={[styles.nftMerchant, { color: colors.textSecondary }]}>{nft.merchant}</Text>
                      )}
                      {nft.description && (
                        <Text style={[styles.nftDescription, { color: colors.textTertiary }]} numberOfLines={1}>{nft.description}</Text>
                      )}
                    </View>
                    <View style={styles.nftListRight}>
                      <Text style={[styles.nftValue, { color: colors.primary }]}>{nft.value}</Text>
                      {nft.date && (
                        <Text style={[styles.nftListDate, { color: colors.textTertiary }]}>{nft.date}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
  content: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 4,
  },
  balanceActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 24,
  },
  balanceAction: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '500' as const,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tokenSymbol: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tokenBalance: {
    fontSize: 13,
  },
  tokenValue: {
    alignItems: 'flex-end',
  },
  tokenUsd: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tokenChange: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  nftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nftCount: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  viewButton: {
    padding: 8,
    borderRadius: 8,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nftCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    aspectRatio: 1,
  },
  nftInfo: {
    padding: 10,
  },
  nftName: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  nftCollection: {
    fontSize: 11,
    marginBottom: 4,
  },
  nftValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  categoryScroll: {
    marginBottom: 16,
    marginLeft: -16,
    marginRight: -16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  receiptBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nftDate: {
    fontSize: 10,
    marginTop: 2,
  },
  nftList: {
    gap: 10,
  },
  nftListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  nftListImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  nftListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nftMerchant: {
    fontSize: 11,
    fontWeight: '500' as const,
    marginTop: 2,
  },
  nftDescription: {
    fontSize: 10,
    marginTop: 2,
  },
  nftListRight: {
    alignItems: 'flex-end',
  },
  nftListDate: {
    fontSize: 10,
    marginTop: 4,
  },
});
