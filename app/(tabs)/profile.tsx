import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Settings, ChevronRight, Shield, Bell, HelpCircle, FileText, 
  Share2, Star, LogOut, Copy, CheckCircle, Edit2, Users, Heart,
  Compass, MessageCircle, Rss, UserPlus, ThumbsUp, Send, Bookmark,
  MoreHorizontal, Globe, Palette, Video, FolderOpen, FileUser, Calendar,
  Contact, Code, Link, Mic, PenTool, Camera, Newspaper
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const menuItems = [
  { id: 'security', title: 'Security', subtitle: '2FA enabled', icon: Shield, color: '#3498DB' },
  { id: 'notifications', title: 'Notifications', subtitle: 'Push & Email', icon: Bell, color: '#9B59B6' },
  { id: 'help', title: 'Help Center', subtitle: 'FAQs & Support', icon: HelpCircle, color: '#E74C3C' },
  { id: 'terms', title: 'Terms & Privacy', subtitle: 'Legal documents', icon: FileText, color: '#95A5A6' },
  { id: 'share', title: 'Share App', subtitle: 'Invite friends', icon: Share2, color: '#2ECC71' },
  { id: 'rate', title: 'Rate Us', subtitle: 'On the App Store', icon: Star, color: '#F39C12' },
];

const socialFeatures = [
  { id: 'feed', title: 'News Feed', icon: Rss, color: '#FF6B6B', route: null },
  { id: 'follow', title: 'Follow', icon: UserPlus, color: '#4ECDC4', route: '/menu/follow' },
  { id: 'dating', title: 'Dating', icon: Heart, color: '#FF85A2', route: '/menu/dating' },
  { id: 'explore', title: 'Explore', icon: Compass, color: '#45B7D1', route: '/menu/explore' },
  { id: 'spaces', title: 'Spaces', icon: Globe, color: '#A78BFA', route: '/menu/social-spaces' },
  { id: 'messages', title: 'Messages', icon: MessageCircle, color: '#10B981', route: '/menu/messages' },
];

const contentToolsFeatures = [
  { id: 'creator', title: 'Creator Tools', icon: Palette, color: '#F472B6', route: '/menu/creator-tools' },
  { id: 'media', title: 'Media', icon: Video, color: '#8B5CF6', route: '/menu/media' },
  { id: 'files', title: 'File Storage', icon: FolderOpen, color: '#06B6D4', route: '/menu/file-storage' },
  { id: 'resume', title: 'Resume', icon: FileUser, color: '#14B8A6', route: '/menu/resume' },
  { id: 'calendar', title: 'Calendar', icon: Calendar, color: '#F59E0B', route: '/menu/calendar' },
  { id: 'contacts', title: 'Contacts', icon: Contact, color: '#3B82F6', route: '/menu/contacts' },
  { id: 'developers', title: 'Developers', icon: Code, color: '#22C55E', route: '/menu/developers' },
  { id: 'apis', title: 'APIs & Hooks', icon: Link, color: '#EF4444', route: '/menu/apis-hooks' },
  { id: 'podcast', title: 'Podcast', icon: Mic, color: '#EC4899', route: null },
  { id: 'blog', title: 'Blog', icon: PenTool, color: '#6366F1', route: null },
  { id: 'photos', title: 'Photos', icon: Camera, color: '#0EA5E9', route: null },
  { id: 'articles', title: 'Articles', icon: Newspaper, color: '#84CC16', route: null },
];

const feedPosts = [
  {
    id: '1',
    author: 'CryptoWhale',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100',
    time: '2h ago',
    content: 'Just staked 10,000 LUSD for 12% APY! The passive income is real 🚀 #DeFi #Staking',
    likes: 234,
    comments: 45,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600',
    verified: true,
  },
  {
    id: '2',
    author: 'NFT Artist',
    avatar: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100',
    time: '4h ago',
    content: 'New collection dropping next week! Get ready for some amazing digital art pieces 🎨✨',
    likes: 512,
    comments: 89,
    image: null,
    verified: false,
  },
  {
    id: '3',
    author: 'DeFi Master',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    time: '6h ago',
    content: 'Market analysis: Larecoin showing strong support at current levels. Bullish momentum building! 📊',
    likes: 892,
    comments: 156,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600',
    verified: true,
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeWallet } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'content' | 'settings'>('social');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const handleCopyAddress = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialFeature = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
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

  const memberSince = 'January 2024';
  const verificationStatus = 'Verified';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Edit2 size={14} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Alex Johnson</Text>
          <Text style={styles.userEmail}>alex.johnson@email.com</Text>
          
          <TouchableOpacity style={styles.addressContainer} onPress={handleCopyAddress}>
            <Text style={styles.addressText}>
              {activeWallet?.address.slice(0, 10)}...{activeWallet?.address.slice(-8)}
            </Text>
            {copied ? (
              <CheckCircle size={16} color={Colors.success} />
            ) : (
              <Copy size={16} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1,234</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5,678</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'social' && styles.tabActive]}
            onPress={() => setActiveTab('social')}
          >
            <Users size={16} color={activeTab === 'social' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'social' && styles.tabTextActive]}>Social</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'content' && styles.tabActive]}
            onPress={() => setActiveTab('content')}
          >
            <Palette size={16} color={activeTab === 'content' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>Content</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
            onPress={() => setActiveTab('settings')}
          >
            <Settings size={16} color={activeTab === 'settings' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'social' && (
          <>
            <View style={styles.socialGrid}>
              {socialFeatures.map((feature) => (
                <TouchableOpacity 
                  key={feature.id} 
                  style={styles.socialCard}
                  onPress={() => handleSocialFeature(feature.route)}
                >
                  <View style={[styles.socialIconContainer, { backgroundColor: feature.color + '15' }]}>
                    <feature.icon size={22} color={feature.color} />
                  </View>
                  <Text style={styles.socialCardTitle}>{feature.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.feedSection}>
              <View style={styles.feedHeader}>
                <Text style={styles.feedTitle}>News Feed</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              {feedPosts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                    <View style={styles.postAuthorInfo}>
                      <View style={styles.authorNameRow}>
                        <Text style={styles.postAuthor}>{post.author}</Text>
                        {post.verified && (
                          <View style={styles.verifiedBadgeSmall}>
                            <CheckCircle size={12} color="#FFF" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.postTime}>{post.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.postMoreBtn}>
                      <MoreHorizontal size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.postContent}>{post.content}</Text>

                  {post.image && (
                    <Image source={{ uri: post.image }} style={styles.postImage} />
                  )}

                  <View style={styles.postActions}>
                    <TouchableOpacity 
                      style={styles.postAction}
                      onPress={() => toggleLike(post.id)}
                    >
                      <ThumbsUp 
                        size={20} 
                        color={likedPosts.includes(post.id) ? Colors.primary : Colors.textSecondary} 
                        fill={likedPosts.includes(post.id) ? Colors.primary : 'transparent'}
                      />
                      <Text style={[
                        styles.postActionText,
                        likedPosts.includes(post.id) && { color: Colors.primary }
                      ]}>
                        {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.postAction}>
                      <MessageCircle size={20} color={Colors.textSecondary} />
                      <Text style={styles.postActionText}>{post.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.postAction}>
                      <Send size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.postActionRight}
                      onPress={() => toggleSave(post.id)}
                    >
                      <Bookmark 
                        size={20} 
                        color={savedPosts.includes(post.id) ? Colors.warning : Colors.textSecondary}
                        fill={savedPosts.includes(post.id) ? Colors.warning : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'content' && (
          <>
            <View style={styles.contentToolsGrid}>
              {contentToolsFeatures.map((feature) => (
                <TouchableOpacity 
                  key={feature.id} 
                  style={styles.contentToolCard}
                  onPress={() => handleSocialFeature(feature.route)}
                >
                  <View style={[styles.contentToolIcon, { backgroundColor: feature.color + '15' }]}>
                    <feature.icon size={22} color={feature.color} />
                  </View>
                  <Text style={styles.contentToolTitle}>{feature.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.quickStatsSection}>
              <Text style={styles.quickStatsTitle}>Your Content Stats</Text>
              <View style={styles.quickStatsGrid}>
                <View style={styles.quickStatCard}>
                  <Text style={styles.quickStatValue}>12</Text>
                  <Text style={styles.quickStatLabel}>Posts</Text>
                </View>
                <View style={styles.quickStatCard}>
                  <Text style={styles.quickStatValue}>48</Text>
                  <Text style={styles.quickStatLabel}>Files</Text>
                </View>
                <View style={styles.quickStatCard}>
                  <Text style={styles.quickStatValue}>2.4K</Text>
                  <Text style={styles.quickStatLabel}>Views</Text>
                </View>
                <View style={styles.quickStatCard}>
                  <Text style={styles.quickStatValue}>156</Text>
                  <Text style={styles.quickStatLabel}>Saves</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>{memberSince}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Verification</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>{verificationStatus}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
              {menuItems.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.logoutBtn}>
              <LogOut size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </>
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
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundTertiary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
  },
  menuSection: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.error + '15',
    borderRadius: 14,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  socialCard: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  socialCardTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  feedSection: {
    paddingHorizontal: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  postCard: {
    backgroundColor: Colors.surface,
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
    width: 42,
    height: 42,
    borderRadius: 21,
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
    color: Colors.text,
  },
  verifiedBadgeSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTime: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  postMoreBtn: {
    padding: 4,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    gap: 6,
  },
  postActionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  postActionRight: {
    marginLeft: 'auto',
  },
  contentToolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  contentToolCard: {
    width: '23%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  contentToolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  contentToolTitle: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  quickStatsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickStatsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
});
