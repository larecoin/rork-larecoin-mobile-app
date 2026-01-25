import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, Bell, Plus, ThumbsUp, MessageCircle, Send, Bookmark,
  MoreHorizontal, CheckCircle, Image as ImageIcon, Video, Smile,
  TrendingUp, Users, Hash, Filter
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
  const [activeTab, setActiveTab] = useState<'foryou' | 'following' | 'trending'>('foryou');
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

      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
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
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={[styles.createPostCard, { backgroundColor: colors.surface }]}>
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
        </View>

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

        {feedPosts.map((post) => (
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

      <TouchableOpacity style={styles.fab}>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
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
});
