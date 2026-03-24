import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  PenTool, Plus, Settings, Eye, Heart, MessageCircle, Share2,
  Calendar, Globe, Lock, Users, TrendingUp, BarChart2, Edit2,
  Trash2, MoreVertical, ExternalLink, Sparkles
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  visibility: 'public' | 'private' | 'subscribers';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  featured: boolean;
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'My Journey into Web3 Development',
    content: 'It all started when I discovered the potential of decentralized applications. The freedom to build without intermediaries...',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    visibility: 'public',
    views: 4532,
    likes: 342,
    comments: 67,
    shares: 89,
    createdAt: '2024-01-18',
    featured: true,
  },
  {
    id: '2',
    title: 'Top 10 Crypto Projects to Watch',
    content: 'As we enter a new era of blockchain innovation, these projects are leading the charge in reshaping our digital future...',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    visibility: 'public',
    views: 2876,
    likes: 198,
    comments: 45,
    shares: 56,
    createdAt: '2024-01-15',
    featured: false,
  },
  {
    id: '3',
    title: 'Exclusive: Behind the Scenes',
    content: 'A look at what goes into building a successful crypto portfolio and the strategies that work...',
    coverImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600',
    visibility: 'subscribers',
    views: 1243,
    likes: 156,
    comments: 32,
    shares: 12,
    createdAt: '2024-01-12',
    featured: false,
  },
  {
    id: '4',
    title: 'Personal Notes: Market Reflections',
    content: 'Private thoughts on the current market conditions and what I am doing with my portfolio...',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600',
    visibility: 'private',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: '2024-01-10',
    featured: false,
  },
];

export default function BlogScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics' | 'settings'>('posts');

  const totalViews = mockPosts.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = mockPosts.reduce((sum, p) => sum + p.likes, 0);
  const publicPosts = mockPosts.filter(p => p.visibility === 'public').length;

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return Globe;
      case 'private': return Lock;
      case 'subscribers': return Users;
      default: return Globe;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'public': return '#10B981';
      case 'private': return '#EF4444';
      case 'subscribers': return '#8B5CF6';
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Blog',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.blogInfo}>
          <View style={styles.blogAvatar}>
            <PenTool size={24} color={Colors.primary} />
          </View>
          <View style={styles.blogDetails}>
            <Text style={styles.blogName}>My Personal Blog</Text>
            <Text style={styles.blogUrl}>larecoin.com/blog/alexj</Text>
          </View>
          <TouchableOpacity style={styles.editBlogButton}>
            <Edit2 size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{mockPosts.length}</Text>
            <Text style={styles.quickStatLabel}>Posts</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{(totalViews / 1000).toFixed(1)}K</Text>
            <Text style={styles.quickStatLabel}>Views</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>{totalLikes}</Text>
            <Text style={styles.quickStatLabel}>Likes</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>1.2K</Text>
            <Text style={styles.quickStatLabel}>Followers</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createPostButton}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createPostText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <PenTool size={18} color={activeTab === 'posts' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.tabActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <BarChart2 size={18} color={activeTab === 'analytics' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={18} color={activeTab === 'settings' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'posts' && (
          <View style={styles.postsContainer}>
            {mockPosts.map((post) => {
              const VisibilityIcon = getVisibilityIcon(post.visibility);
              return (
                <TouchableOpacity key={post.id} style={styles.postCard}>
                  <Image source={{ uri: post.coverImage }} style={styles.postImage} />
                  {post.featured && (
                    <View style={styles.featuredBadge}>
                      <Sparkles size={12} color="#FFF" />
                      <Text style={styles.featuredText}>Featured</Text>
                    </View>
                  )}
                  <View style={styles.postContent}>
                    <View style={styles.postHeader}>
                      <View style={[styles.visibilityBadge, { backgroundColor: getVisibilityColor(post.visibility) + '20' }]}>
                        <VisibilityIcon size={12} color={getVisibilityColor(post.visibility)} />
                        <Text style={[styles.visibilityText, { color: getVisibilityColor(post.visibility) }]}>
                          {post.visibility.charAt(0).toUpperCase() + post.visibility.slice(1)}
                        </Text>
                      </View>
                      <TouchableOpacity>
                        <MoreVertical size={18} color={Colors.textSecondary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.postTitle}>{post.title}</Text>
                    <Text style={styles.postExcerpt} numberOfLines={2}>{post.content}</Text>

                    <View style={styles.postStats}>
                      <View style={styles.postStat}>
                        <Eye size={14} color={Colors.textSecondary} />
                        <Text style={styles.postStatText}>{post.views}</Text>
                      </View>
                      <View style={styles.postStat}>
                        <Heart size={14} color={Colors.textSecondary} />
                        <Text style={styles.postStatText}>{post.likes}</Text>
                      </View>
                      <View style={styles.postStat}>
                        <MessageCircle size={14} color={Colors.textSecondary} />
                        <Text style={styles.postStatText}>{post.comments}</Text>
                      </View>
                      <View style={styles.postStat}>
                        <Share2 size={14} color={Colors.textSecondary} />
                        <Text style={styles.postStatText}>{post.shares}</Text>
                      </View>
                    </View>

                    <View style={styles.postDate}>
                      <Calendar size={12} color={Colors.textTertiary} />
                      <Text style={styles.postDateText}>{post.createdAt}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {activeTab === 'analytics' && (
          <View style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Performance Overview</Text>
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#0EA5E9' + '20' }]}>
                    <Eye size={20} color="#0EA5E9" />
                  </View>
                  <Text style={styles.analyticsValue}>{(totalViews / 1000).toFixed(1)}K</Text>
                  <Text style={styles.analyticsLabel}>Total Views</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+12%</Text>
                  </View>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#EF4444' + '20' }]}>
                    <Heart size={20} color="#EF4444" />
                  </View>
                  <Text style={styles.analyticsValue}>{totalLikes}</Text>
                  <Text style={styles.analyticsLabel}>Total Likes</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+8%</Text>
                  </View>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#8B5CF6' + '20' }]}>
                    <Users size={20} color="#8B5CF6" />
                  </View>
                  <Text style={styles.analyticsValue}>1.2K</Text>
                  <Text style={styles.analyticsLabel}>Followers</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+24%</Text>
                  </View>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#F59E0B' + '20' }]}>
                    <Share2 size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.analyticsValue}>157</Text>
                  <Text style={styles.analyticsLabel}>Shares</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+15%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.topPostsCard}>
              <Text style={styles.analyticsTitle}>Top Performing Posts</Text>
              {mockPosts.slice(0, 3).map((post, index) => (
                <View key={post.id} style={styles.topPostItem}>
                  <Text style={styles.topPostRank}>#{index + 1}</Text>
                  <Image source={{ uri: post.coverImage }} style={styles.topPostImage} />
                  <View style={styles.topPostInfo}>
                    <Text style={styles.topPostTitle} numberOfLines={1}>{post.title}</Text>
                    <Text style={styles.topPostViews}>{post.views} views</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Blog Settings</Text>
              
              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: Colors.primary + '15' }]}>
                  <PenTool size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Blog Name</Text>
                  <Text style={styles.settingsItemValue}>My Personal Blog</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#10B981' + '15' }]}>
                  <Globe size={18} color="#10B981" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Custom URL</Text>
                  <Text style={styles.settingsItemValue}>larecoin.com/blog/alexj</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#8B5CF6' + '15' }]}>
                  <Users size={18} color="#8B5CF6" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Default Visibility</Text>
                  <Text style={styles.settingsItemValue}>Public</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#F59E0B' + '15' }]}>
                  <MessageCircle size={18} color="#F59E0B" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Comments</Text>
                  <Text style={styles.settingsItemValue}>Enabled for all posts</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  blogInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  blogAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blogDetails: {
    flex: 1,
    marginLeft: 14,
  },
  blogName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  blogUrl: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBlogButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  quickStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createPostText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  tabBar: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  postsContainer: {
    paddingHorizontal: 20,
  },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 150,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  visibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  visibilityText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  postDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postDateText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  analyticsContainer: {
    paddingHorizontal: 20,
  },
  analyticsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsItem: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  analyticsIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  analyticsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#10B981' + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  topPostsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  topPostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topPostRank: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    width: 30,
  },
  topPostImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  topPostInfo: {
    flex: 1,
  },
  topPostTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  topPostViews: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
    marginLeft: 14,
  },
  settingsItemTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  settingsItemValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
