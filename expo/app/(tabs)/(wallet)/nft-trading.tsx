import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Search, Filter, Grid3X3, LayoutList, Heart, Clock, TrendingUp, Sparkles } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface NFT {
  id: string;
  name: string;
  collection: string;
  price: number;
  lastSale: number;
  image: string;
  liked: boolean;
  rarity: 'common' | 'rare' | 'legendary';
}

export default function NFTTradingScreen() {
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'explore' | 'owned' | 'watchlist'>('explore');

  const nfts: NFT[] = [
    { id: '1', name: 'Cosmic Ape #4521', collection: 'Bored Apes', price: 12.5, lastSale: 10.2, image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=300', liked: true, rarity: 'legendary' },
    { id: '2', name: 'Pixel Punk #892', collection: 'CryptoPunks', price: 45.0, lastSale: 42.8, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300', liked: false, rarity: 'rare' },
    { id: '3', name: 'Digital Dreams #12', collection: 'Art Blocks', price: 3.2, lastSale: 2.8, image: 'https://images.unsplash.com/photo-1634017839464-5c339afa5b25?w=300', liked: false, rarity: 'common' },
    { id: '4', name: 'Meta Avatar #7823', collection: 'Azuki', price: 8.9, lastSale: 7.5, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300', liked: true, rarity: 'rare' },
  ];

  const collections = [
    { name: 'Bored Apes', floor: 45.2, volume: '12.5K ETH', change: '+5.2%' },
    { name: 'CryptoPunks', floor: 62.8, volume: '8.2K ETH', change: '-2.1%' },
    { name: 'Azuki', floor: 8.5, volume: '4.8K ETH', change: '+12.4%' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#F59E0B';
      case 'rare': return '#8B5CF6';
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search NFTs, collections..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View style={styles.viewControls}>
          <TouchableOpacity 
            style={[styles.viewBtn, { backgroundColor: colors.background }, viewMode === 'grid' && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={18} color={viewMode === 'grid' ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewBtn, { backgroundColor: colors.background }, viewMode === 'list' && { backgroundColor: colors.primary }]}
            onPress={() => setViewMode('list')}
          >
            <LayoutList size={18} color={viewMode === 'list' ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.background }]}>
            <Filter size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(['explore', 'owned', 'watchlist'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFFFFF' : colors.textSecondary }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp size={18} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Collections</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {collections.map((collection, index) => (
            <TouchableOpacity key={index} style={[styles.collectionCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.collectionName, { color: colors.text }]}>{collection.name}</Text>
              <View style={styles.collectionStats}>
                <View style={styles.collectionStat}>
                  <Text style={[styles.collectionStatLabel, { color: colors.textSecondary }]}>Floor</Text>
                  <Text style={[styles.collectionStatValue, { color: colors.text }]}>{collection.floor} ETH</Text>
                </View>
                <View style={styles.collectionStat}>
                  <Text style={[styles.collectionStatLabel, { color: colors.textSecondary }]}>Volume</Text>
                  <Text style={[styles.collectionStatValue, { color: colors.text }]}>{collection.volume}</Text>
                </View>
              </View>
              <Text style={[styles.collectionChange, { color: collection.change.startsWith('+') ? '#10B981' : '#EF4444' }]}>
                {collection.change}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>NFTs</Text>
        <View style={viewMode === 'grid' ? styles.nftGrid : styles.nftList}>
          {nfts.map(nft => (
            <TouchableOpacity 
              key={nft.id} 
              style={viewMode === 'grid' ? [styles.nftCardGrid, { backgroundColor: colors.surface }] : [styles.nftCardList, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: nft.image }} style={viewMode === 'grid' ? styles.nftImageGrid : styles.nftImageList} />
              <View style={styles.nftInfo}>
                <View style={styles.nftHeader}>
                  <View style={styles.nftTitleRow}>
                    <Text style={[styles.nftName, { color: colors.text }]} numberOfLines={1}>{nft.name}</Text>
                    {nft.rarity !== 'common' && (
                      <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(nft.rarity) + '20' }]}>
                        <Sparkles size={10} color={getRarityColor(nft.rarity)} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.nftCollection, { color: colors.textSecondary }]}>{nft.collection}</Text>
                </View>
                <View style={styles.nftPricing}>
                  <View>
                    <Text style={[styles.nftPriceLabel, { color: colors.textSecondary }]}>Price</Text>
                    <Text style={[styles.nftPrice, { color: colors.text }]}>{nft.price} ETH</Text>
                  </View>
                  <TouchableOpacity style={styles.likeBtn}>
                    <Heart size={18} color={nft.liked ? '#EF4444' : colors.textSecondary} fill={nft.liked ? '#EF4444' : 'none'} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.activitySection, { backgroundColor: colors.surface }]}>
        <View style={styles.activityHeader}>
          <Clock size={18} color={colors.primary} />
          <Text style={[styles.activityTitle, { color: colors.text }]}>Recent Activity</Text>
        </View>
        {[
          { action: 'Sale', nft: 'Cosmic Ape #4521', price: '12.5 ETH', time: '2 min ago' },
          { action: 'Bid', nft: 'Pixel Punk #892', price: '44.0 ETH', time: '5 min ago' },
          { action: 'List', nft: 'Meta Avatar #7823', price: '8.9 ETH', time: '12 min ago' },
        ].map((activity, index) => (
          <View key={index} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.activityBadge, { backgroundColor: activity.action === 'Sale' ? '#10B98120' : activity.action === 'Bid' ? '#8B5CF620' : '#F59E0B20' }]}>
              <Text style={[styles.activityBadgeText, { color: activity.action === 'Sale' ? '#10B981' : activity.action === 'Bid' ? '#8B5CF6' : '#F59E0B' }]}>
                {activity.action}
              </Text>
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityNft, { color: colors.text }]}>{activity.nft}</Text>
              <Text style={[styles.activityTime, { color: colors.textSecondary }]}>{activity.time}</Text>
            </View>
            <Text style={[styles.activityPrice, { color: colors.text }]}>{activity.price}</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    margin: 16,
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  viewControls: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  collectionCard: {
    width: 160,
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 10,
  },
  collectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  collectionStat: {
    gap: 2,
  },
  collectionStatLabel: {
    fontSize: 10,
  },
  collectionStatValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  collectionChange: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nftList: {
    gap: 12,
  },
  nftCardGrid: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  nftCardList: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
  },
  nftImageGrid: {
    width: '100%',
    height: 150,
  },
  nftImageList: {
    width: 100,
    height: 100,
  },
  nftInfo: {
    padding: 12,
    flex: 1,
  },
  nftHeader: {
    marginBottom: 8,
  },
  nftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nftName: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  },
  rarityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nftCollection: {
    fontSize: 11,
    marginTop: 2,
  },
  nftPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  nftPriceLabel: {
    fontSize: 10,
  },
  nftPrice: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  likeBtn: {
    padding: 4,
  },
  activitySection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  activityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  activityInfo: {
    flex: 1,
  },
  activityNft: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  activityTime: {
    fontSize: 11,
    marginTop: 2,
  },
  activityPrice: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
