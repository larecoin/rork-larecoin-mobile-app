import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, Bell, Plus, ThumbsUp, MessageCircle, Send, Bookmark,
  MoreHorizontal, CheckCircle, Image as ImageIcon, Video, Smile,
  TrendingUp, Users, Hash, Filter, Heart, ShoppingCart, BellRing,
  ChevronDown, Coins, DollarSign, Image as ImageIcon2, ArrowUpRight, ArrowDownRight
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const feedPosts = [
  {
    id: '1',
    author: 'CryptoWhale',
    handle: '@cryptowhale',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100',
    time: '2h ago',
    content: 'Just staked 10,000 LUSD for 12% APY! The passive income is real 🚀 #DeFi #Staking',
    likes: 234,
    comments: 45,
    shares: 12,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600',
    verified: true,
  },
  {
    id: '2',
    author: 'NFT Artist',
    handle: '@nftartist',
    avatar: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100',
    time: '4h ago',
    content: 'New collection dropping next week! Get ready for some amazing digital art pieces 🎨✨ Follow for sneak peeks!',
    likes: 512,
    comments: 89,
    shares: 34,
    image: null,
    verified: false,
  },
  {
    id: '3',
    author: 'DeFi Master',
    handle: '@defimaster',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    time: '6h ago',
    content: 'Market analysis: Larecoin showing strong support at current levels. Bullish momentum building! 📊 What are your thoughts?',
    likes: 892,
    comments: 156,
    shares: 78,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600',
    verified: true,
  },
  {
    id: '4',
    author: 'Blockchain Dev',
    handle: '@blockdev',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
    time: '8h ago',
    content: 'Just deployed a new smart contract on Solana. Gas fees are incredibly low compared to ETH. The future is multi-chain! ⛓️',
    likes: 345,
    comments: 67,
    shares: 23,
    image: null,
    verified: true,
  },
  {
    id: '5',
    author: 'Crypto News',
    handle: '@cryptonews',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=100',
    time: '10h ago',
    content: '🚨 BREAKING: Major institution announces $500M crypto investment fund. This is huge for mainstream adoption!',
    likes: 1247,
    comments: 234,
    shares: 567,
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600',
    verified: true,
  },
];

type MarketType = 'all' | 'crypto' | 'stablecoin' | 'nft';

const marketAssets = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 67432.50, change: 2.34, marketCap: '1.32T', volume: '28.5B', type: 'crypto', icon: '₿', color: '#F7931A' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3245.80, change: -1.23, marketCap: '389.2B', volume: '15.2B', type: 'crypto', icon: '⟠', color: '#627EEA' },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 142.65, change: 5.67, marketCap: '62.1B', volume: '3.8B', type: 'crypto', icon: '◎', color: '#9945FF' },
  { id: '4', symbol: 'LARE', name: 'Larecoin', price: 1.24, change: 8.92, marketCap: '124.5M', volume: '45.2M', type: 'crypto', icon: '💰', color: '#D4AF37' },
  { id: '5', symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.01, marketCap: '95.2B', volume: '52.1B', type: 'stablecoin', icon: '₮', color: '#26A17B' },
  { id: '6', symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.00, marketCap: '32.8B', volume: '8.4B', type: 'stablecoin', icon: '💵', color: '#2775CA' },
  { id: '7', symbol: 'LUSD', name: 'Lare USD', price: 1.00, change: 0.00, marketCap: '850M', volume: '125M', type: 'stablecoin', icon: '💲', color: '#00D395' },
  { id: '8', symbol: 'DAI', name: 'Dai', price: 1.00, change: -0.01, marketCap: '5.3B', volume: '320M', type: 'stablecoin', icon: '◈', color: '#F5AC37' },
  { id: '9', symbol: 'BAYC', name: 'Bored Ape YC', price: 28.5, change: -3.45, marketCap: '285M', volume: '12.4M', type: 'nft', icon: '🐵', color: '#BFAD7E' },
  { id: '10', symbol: 'PUNK', name: 'CryptoPunks', price: 45.2, change: 1.23, marketCap: '452M', volume: '8.9M', type: 'nft', icon: '👾', color: '#638596' },
  { id: '11', symbol: 'AZUKI', name: 'Azuki', price: 8.75, change: 12.34, marketCap: '87.5M', volume: '5.2M', type: 'nft', icon: '🎭', color: '#C93D3D' },
  { id: '12', symbol: 'DOODLE', name: 'Doodles', price: 3.2, change: -5.67, marketCap: '32M', volume: '1.8M', type: 'nft', icon: '🎨', color: '#F9D54A' },
];

const trendingTopics = [
  { tag: '#DeFi', posts: '12.5K' },
  { tag: '#NFTs', posts: '8.2K' },
  { tag: '#Solana', posts: '6.8K' },
  { tag: '#Bitcoin', posts: '45.3K' },
];

const suggestedUsers = [
  { name: 'Crypto Queen', handle: '@cryptoqueen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', verified: true },
  { name: 'Web3 Builder', handle: '@web3builder', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', verified: false },
];

export default function NewsfeedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'markets' | 'foryou' | 'following' | 'trending'>('foryou');
  const [marketFilter, setMarketFilter] = useState<MarketType>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleFavorite = (assetId: string) => {
    setFavorites(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const togglePriceAlert = (assetId: string) => {
    setPriceAlerts(prev => 
      prev.includes(assetId) ? prev.filter(id => id !== assetId) : [...prev, assetId]
    );
  };

  const filteredMarkets = marketAssets.filter(asset => 
    marketFilter === 'all' ? true : asset.type === marketFilter
  );

  const getFilterLabel = (filter: MarketType) => {
    switch (filter) {
      case 'all': return 'All Markets';
      case 'crypto': return 'Crypto';
      case 'stablecoin': return 'Stablecoins';
      case 'nft': return 'NFTs';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Feed</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.surface }]}>
            <Bell size={20} color={colors.text} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Search size={18} color={colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search posts, users, topics..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.background }]}>
          <Filter size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabScrollContainer}
        contentContainerStyle={[styles.tabContainer, { backgroundColor: colors.surface }]}
      >
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'markets' && styles.tabActive]}
          onPress={() => setActiveTab('markets')}
        >
          <Coins size={16} color={activeTab === 'markets' ? '#1E88E5' : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'markets' && styles.tabTextActive]}>Markets</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'foryou' && styles.tabActive]}
          onPress={() => setActiveTab('foryou')}
        >
          <Text style={[styles.tabText, activeTab === 'foryou' && styles.tabTextActive]}>For You</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'following' && styles.tabActive]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trending' && styles.tabActive]}
          onPress={() => setActiveTab('trending')}
        >
          <TrendingUp size={16} color={activeTab === 'trending' ? '#1E88E5' : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>Trending</Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {activeTab === 'markets' && (
          <View style={styles.marketsContainer}>
            <View style={styles.marketFiltersRow}>
              <TouchableOpacity 
                style={[styles.filterDropdown, { backgroundColor: colors.surface }]}
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Text style={[styles.filterDropdownText, { color: colors.text }]}>{getFilterLabel(marketFilter)}</Text>
                <ChevronDown size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <View style={styles.marketFilterChips}>
                {(['all', 'crypto', 'stablecoin', 'nft'] as MarketType[]).map((filter) => (
                  <TouchableOpacity 
                    key={filter}
                    style={[
                      styles.filterChip, 
                      { backgroundColor: colors.surface },
                      marketFilter === filter && styles.filterChipActive
                    ]}
                    onPress={() => setMarketFilter(filter)}
                  >
                    {filter === 'crypto' && <Coins size={14} color={marketFilter === filter ? '#FFF' : colors.textSecondary} />}
                    {filter === 'stablecoin' && <DollarSign size={14} color={marketFilter === filter ? '#FFF' : colors.textSecondary} />}
                    {filter === 'nft' && <ImageIcon2 size={14} color={marketFilter === filter ? '#FFF' : colors.textSecondary} />}
                    <Text style={[
                      styles.filterChipText,
                      { color: colors.textSecondary },
                      marketFilter === filter && styles.filterChipTextActive
                    ]}>
                      {filter === 'all' ? 'All' : filter === 'crypto' ? 'Crypto' : filter === 'stablecoin' ? 'Stable' : 'NFT'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={[styles.marketHeader, { backgroundColor: colors.surface }]}>
              <Text style={[styles.marketHeaderText, { color: colors.textSecondary, flex: 2 }]}>Asset</Text>
              <Text style={[styles.marketHeaderText, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>Price</Text>
              <Text style={[styles.marketHeaderText, { color: colors.textSecondary, flex: 1, textAlign: 'right' }]}>24h</Text>
              <Text style={[styles.marketHeaderText, { color: colors.textSecondary, flex: 2, textAlign: 'right' }]}>Actions</Text>
            </View>

            {filteredMarkets.map((asset) => (
              <View key={asset.id} style={[styles.marketItem, { backgroundColor: colors.surface }]}>
                <View style={styles.marketAssetInfo}>
                  <View style={[styles.marketIcon, { backgroundColor: asset.color + '20' }]}>
                    <Text style={styles.marketIconText}>{asset.icon}</Text>
                  </View>
                  <View style={styles.marketAssetDetails}>
                    <Text style={[styles.marketSymbol, { color: colors.text }]}>{asset.symbol}</Text>
                    <Text style={[styles.marketName, { color: colors.textSecondary }]}>{asset.name}</Text>
                  </View>
                </View>
                <View style={styles.marketPriceCol}>
                  <Text style={[styles.marketPrice, { color: colors.text }]}>
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[styles.marketCap, { color: colors.textTertiary }]}>{asset.marketCap}</Text>
                </View>
                <View style={styles.marketChangeCol}>
                  <View style={[styles.changeBadge, { backgroundColor: asset.change >= 0 ? '#10B98120' : '#EF444420' }]}>
                    {asset.change >= 0 ? (
                      <ArrowUpRight size={12} color="#10B981" />
                    ) : (
                      <ArrowDownRight size={12} color="#EF4444" />
                    )}
                    <Text style={[styles.changeText, { color: asset.change >= 0 ? '#10B981' : '#EF4444' }]}>
                      {Math.abs(asset.change).toFixed(2)}%
                    </Text>
                  </View>
                </View>
                <View style={styles.marketActions}>
                  <TouchableOpacity style={[styles.actionBtn, styles.buyBtn]}>
                    <ShoppingCart size={14} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: favorites.includes(asset.id) ? '#EF444420' : colors.background }]}
                    onPress={() => toggleFavorite(asset.id)}
                  >
                    <Heart 
                      size={14} 
                      color={favorites.includes(asset.id) ? '#EF4444' : colors.textSecondary} 
                      fill={favorites.includes(asset.id) ? '#EF4444' : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: priceAlerts.includes(asset.id) ? '#F5920020' : colors.background }]}
                    onPress={() => togglePriceAlert(asset.id)}
                  >
                    <BellRing 
                      size={14} 
                      color={priceAlerts.includes(asset.id) ? '#F59200' : colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View style={styles.marketStats}>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Market Cap</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>$2.45T</Text>
                <View style={styles.statChange}>
                  <ArrowUpRight size={12} color="#10B981" />
                  <Text style={styles.statChangeText}>+2.34%</Text>
                </View>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>24h Volume</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>$89.2B</Text>
                <View style={styles.statChange}>
                  <ArrowUpRight size={12} color="#10B981" />
                  <Text style={styles.statChangeText}>+5.12%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab !== 'markets' && <View style={[styles.createPostCard, { backgroundColor: colors.surface }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }} 
            style={styles.userAvatar} 
          />
          <TouchableOpacity style={[styles.createPostInput, { backgroundColor: colors.background }]}>
            <Text style={[styles.createPostPlaceholder, { color: colors.textTertiary }]}>What's on your mind?</Text>
          </TouchableOpacity>
          <View style={styles.createPostActions}>
            <TouchableOpacity style={styles.createPostBtn}>
              <ImageIcon size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.createPostBtn}>
              <Video size={20} color="#E74C3C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.createPostBtn}>
              <Smile size={20} color="#F39C12" />
            </TouchableOpacity>
          </View>
        </View>}

        {activeTab === 'trending' && (
          <View style={[styles.trendingSection, { backgroundColor: colors.surface }]}>
            <View style={styles.trendingHeader}>
              <Hash size={18} color={Colors.primary} />
              <Text style={[styles.trendingTitle, { color: colors.text }]}>Trending Topics</Text>
            </View>
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity key={index} style={styles.trendingItem}>
                <Text style={[styles.trendingTag, { color: Colors.primary }]}>{topic.tag}</Text>
                <Text style={[styles.trendingPosts, { color: colors.textSecondary }]}>{topic.posts} posts</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'following' && (
          <View style={[styles.suggestedSection, { backgroundColor: colors.surface }]}>
            <View style={styles.suggestedHeader}>
              <Users size={18} color={Colors.primary} />
              <Text style={[styles.suggestedTitle, { color: colors.text }]}>Suggested for You</Text>
            </View>
            {suggestedUsers.map((user, index) => (
              <View key={index} style={styles.suggestedUser}>
                <Image source={{ uri: user.avatar }} style={styles.suggestedAvatar} />
                <View style={styles.suggestedInfo}>
                  <View style={styles.suggestedNameRow}>
                    <Text style={[styles.suggestedName, { color: colors.text }]}>{user.name}</Text>
                    {user.verified && (
                      <View style={styles.verifiedBadgeSmall}>
                        <CheckCircle size={10} color="#FFF" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.suggestedHandle, { color: colors.textSecondary }]}>{user.handle}</Text>
                </View>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followBtnText}>Follow</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab !== 'markets' && feedPosts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: colors.surface }]}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
              <View style={styles.postAuthorInfo}>
                <View style={styles.authorNameRow}>
                  <Text style={[styles.postAuthor, { color: colors.text }]}>{post.author}</Text>
                  {post.verified && (
                    <View style={styles.verifiedBadgeSmall}>
                      <CheckCircle size={12} color="#FFF" />
                    </View>
                  )}
                </View>
                <Text style={[styles.postHandle, { color: colors.textTertiary }]}>{post.handle} · {post.time}</Text>
              </View>
              <TouchableOpacity style={styles.postMoreBtn}>
                <MoreHorizontal size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

            {post.image && (
              <Image source={{ uri: post.image }} style={styles.postImage} />
            )}

            <View style={[styles.postActions, { borderTopColor: colors.border }]}>
              <TouchableOpacity 
                style={styles.postAction}
                onPress={() => toggleLike(post.id)}
              >
                <ThumbsUp 
                  size={20} 
                  color={likedPosts.includes(post.id) ? Colors.primary : colors.textSecondary} 
                  fill={likedPosts.includes(post.id) ? Colors.primary : 'transparent'}
                />
                <Text style={[
                  styles.postActionText,
                  { color: colors.textSecondary },
                  likedPosts.includes(post.id) && { color: Colors.primary }
                ]}>
                  {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.postAction}>
                <MessageCircle size={20} color={colors.textSecondary} />
                <Text style={[styles.postActionText, { color: colors.textSecondary }]}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.postAction}>
                <Send size={20} color={colors.textSecondary} />
                <Text style={[styles.postActionText, { color: colors.textSecondary }]}>{post.shares}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.postActionRight}
                onPress={() => toggleSave(post.id)}
              >
                <Bookmark 
                  size={20} 
                  color={savedPosts.includes(post.id) ? Colors.warning : colors.textSecondary}
                  fill={savedPosts.includes(post.id) ? Colors.warning : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/menu/create-post')}>
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabScrollContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#1E88E5' + '15',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#1E88E5',
    fontWeight: '600' as const,
  },
  createPostCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createPostInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createPostPlaceholder: {
    fontSize: 14,
  },
  createPostActions: {
    flexDirection: 'row',
    gap: 4,
  },
  createPostBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  trendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  trendingTag: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  trendingPosts: {
    fontSize: 13,
  },
  suggestedSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  suggestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  suggestedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  suggestedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  suggestedInfo: {
    flex: 1,
  },
  suggestedNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  suggestedName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  suggestedHandle: {
    fontSize: 13,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  postCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  verifiedBadgeSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postHandle: {
    fontSize: 13,
    marginTop: 2,
  },
  postMoreBtn: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    gap: 6,
  },
  postActionText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  postActionRight: {
    marginLeft: 'auto',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4A90D9',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  marketsContainer: {
    paddingHorizontal: 20,
  },
  marketFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  filterDropdownText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  marketFilterChips: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: '#1E88E5',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  marketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  marketHeaderText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  marketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  marketAssetInfo: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  marketIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketIconText: {
    fontSize: 18,
  },
  marketAssetDetails: {
    flex: 1,
  },
  marketSymbol: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  marketName: {
    fontSize: 12,
    marginTop: 2,
  },
  marketPriceCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  marketCap: {
    fontSize: 11,
    marginTop: 2,
  },
  marketChangeCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  marketActions: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    backgroundColor: '#10B981',
  },
  marketStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#10B981',
  },
});
