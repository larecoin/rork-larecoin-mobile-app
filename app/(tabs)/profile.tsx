import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Linking, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Settings, ChevronRight, Shield, Bell, HelpCircle, FileText, 
  Share2, Star, LogOut, Copy, CheckCircle, Edit2, Users, Heart,
  Compass, MessageCircle, Rss, UserPlus, ThumbsUp, Send, Bookmark,
  MoreHorizontal, Globe, Palette, Video, FolderOpen, FileUser, Calendar,
  Contact, Code, Link, Mic, PenTool, Camera, Newspaper, Menu,
  DollarSign, Wallet, TrendingUp, CreditCard, Coins, ToggleLeft, ToggleRight, Clock,
  AtSign, ExternalLink, X, Flag, Zap, Briefcase, Cpu, Gamepad2, Music, Film, ShoppingBag
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import NavMenuModal from '@/components/NavMenuModal';

const menuItems = [
  { id: 'security', title: 'Security', subtitle: '2FA enabled', icon: Shield, color: '#3498DB', route: '/menu/security' },
  { id: 'notifications', title: 'Notifications', subtitle: 'Push & Email', icon: Bell, color: '#9B59B6', route: '/menu/notifications' },
  { id: 'help', title: 'Help Center', subtitle: 'FAQs & Support', icon: HelpCircle, color: '#E74C3C', route: '/menu/help-center' },
  { id: 'terms', title: 'Terms & Privacy', subtitle: 'Legal documents', icon: FileText, color: '#95A5A6', route: '/menu/terms-privacy' },
  { id: 'share', title: 'Share App', subtitle: 'Invite friends', icon: Share2, color: '#2ECC71', route: '/menu/share-app' },
  { id: 'rate', title: 'Rate Us', subtitle: 'On the App Store', icon: Star, color: '#F39C12', route: '/menu/rate-us' },
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
  { id: 'photos', title: 'Photos', icon: Camera, color: '#0EA5E9', route: '/menu/photos' },
  { id: 'media', title: 'Videos/Media', icon: Video, color: '#8B5CF6', route: '/menu/media' },
  { id: 'resume', title: 'Resume', icon: FileUser, color: '#14B8A6', route: '/menu/resume' },
  { id: 'files', title: 'File Storage', icon: FolderOpen, color: '#06B6D4', route: '/menu/file-storage' },
  { id: 'calendar', title: 'Calendar', icon: Calendar, color: '#F59E0B', route: '/menu/calendar' },
  { id: 'contacts', title: 'Contacts', icon: Contact, color: '#3B82F6', route: '/menu/contacts' },
  { id: 'articles', title: 'Articles', icon: Newspaper, color: '#84CC16', route: '/menu/articles' },
  { id: 'blog', title: 'Blog', icon: PenTool, color: '#6366F1', route: '/menu/blog' },
  { id: 'podcast', title: 'Podcast', icon: Mic, color: '#EC4899', route: '/menu/podcast' },
  { id: 'creator', title: 'Creator Tools', icon: Palette, color: '#F472B6', route: '/menu/creator-tools' },
  { id: 'developers', title: 'Developers', icon: Code, color: '#22C55E', route: '/menu/developers' },
  { id: 'apis', title: 'APIs & Hooks', icon: Link, color: '#EF4444', route: '/menu/apis-hooks' },
];

const newsCategories = [
  { id: 'all', label: 'All', icon: Rss, color: '#FF6B6B' },
  { id: 'crypto', label: 'Crypto', icon: Coins, color: '#F59E0B' },
  { id: 'defi', label: 'DeFi', icon: TrendingUp, color: '#10B981' },
  { id: 'nfts', label: 'NFTs', icon: Palette, color: '#8B5CF6' },
  { id: 'markets', label: 'Markets', icon: TrendingUp, color: '#3B82F6' },
  { id: 'tech', label: 'Tech', icon: Cpu, color: '#06B6D4' },
  { id: 'business', label: 'Business', icon: Briefcase, color: '#6366F1' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#EC4899' },
  { id: 'entertainment', label: 'Entertainment', icon: Film, color: '#F472B6' },
  { id: 'music', label: 'Music', icon: Music, color: '#A78BFA' },
  { id: 'sports', label: 'Sports', icon: Zap, color: '#EF4444' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#14B8A6' },
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
  const { activeWallet, userHandle, updateUserHandle } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'content' | 'settings'>('social');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [monetizationEnabled, setMonetizationEnabled] = useState(true);
  const [showHandleModal, setShowHandleModal] = useState(false);
  const [editHandle, setEditHandle] = useState(userHandle);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
  const [payPerViewEnabled, setPayPerViewEnabled] = useState(true);
  const [activeNewsCategory, setActiveNewsCategory] = useState('all');

  const handleCopyAddress = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenHandleModal = () => {
    setEditHandle(userHandle);
    setShowHandleModal(true);
  };

  const handleSaveHandle = () => {
    if (editHandle.trim()) {
      updateUserHandle(editHandle.trim());
    }
    setShowHandleModal(false);
  };

  const handleOpenProfileLink = () => {
    const url = `https://larecoin.com/profile/${userHandle}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
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
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowNavMenu(true)}
        >
          <Menu size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
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
          
          <TouchableOpacity style={styles.handleContainer} onPress={handleOpenHandleModal}>
            <AtSign size={14} color={Colors.primary} />
            <Text style={styles.handleText}>{userHandle}</Text>
            <Edit2 size={12} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileLinkContainer} onPress={handleOpenProfileLink}>
            <Text style={styles.profileLinkText}>larecoin.com/profile/{userHandle}</Text>
            <ExternalLink size={12} color={Colors.primary} />
          </TouchableOpacity>
          
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
                <TouchableOpacity style={styles.reportNewsBtn}>
                  <Flag size={14} color="#EF4444" />
                  <Text style={styles.reportNewsText}>Report News</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContent}
              >
                {newsCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      activeNewsCategory === category.id && styles.categoryChipActive,
                      activeNewsCategory === category.id && { backgroundColor: category.color + '20', borderColor: category.color }
                    ]}
                    onPress={() => setActiveNewsCategory(category.id)}
                  >
                    <category.icon 
                      size={14} 
                      color={activeNewsCategory === category.id ? category.color : Colors.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      activeNewsCategory === category.id && { color: category.color }
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

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

            <View style={styles.monetizationSection}>
              <View style={styles.monetizationHeader}>
                <View style={styles.monetizationTitleRow}>
                  <View style={[styles.monetizationIconBg, { backgroundColor: '#10B981' + '20' }]}>
                    <DollarSign size={20} color="#10B981" />
                  </View>
                  <Text style={styles.monetizationTitle}>Content Monetization</Text>
                </View>
                <TouchableOpacity 
                  style={styles.mainToggle}
                  onPress={() => setMonetizationEnabled(!monetizationEnabled)}
                >
                  {monetizationEnabled ? (
                    <ToggleRight size={28} color={Colors.primary} />
                  ) : (
                    <ToggleLeft size={28} color={Colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.earningsCard}>
                <View style={styles.earningsRow}>
                  <View style={styles.earningItem}>
                    <Text style={styles.earningLabel}>Total Earned</Text>
                    <View style={styles.earningValueRow}>
                      <Coins size={16} color="#F59E0B" />
                      <Text style={styles.earningValue}>2,450.00</Text>
                      <Text style={styles.earningCurrency}>LARE</Text>
                    </View>
                  </View>
                  <View style={styles.earningDivider} />
                  <View style={styles.earningItem}>
                    <Text style={styles.earningLabel}>Available</Text>
                    <View style={styles.earningValueRow}>
                      <Coins size={16} color="#10B981" />
                      <Text style={[styles.earningValue, { color: '#10B981' }]}>1,280.50</Text>
                      <Text style={styles.earningCurrency}>LARE</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.pendingRow}>
                  <Clock size={14} color={Colors.textSecondary} />
                  <Text style={styles.pendingText}>Pending: 320.00 LARE (processing)</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.payoutButton}>
                <Wallet size={18} color="#FFF" />
                <Text style={styles.payoutButtonText}>Collect Payout in LARE</Text>
              </TouchableOpacity>

              <View style={styles.monetizationOptions}>
                <Text style={styles.monetizationOptionsTitle}>Revenue Streams</Text>
                
                <TouchableOpacity 
                  style={styles.monetizationOption}
                  onPress={() => setTipsEnabled(!tipsEnabled)}
                >
                  <View style={[styles.optionIconBg, { backgroundColor: '#EC4899' + '15' }]}>
                    <Heart size={18} color="#EC4899" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Tips & Donations</Text>
                    <Text style={styles.optionDesc}>Receive tips from supporters</Text>
                  </View>
                  {tipsEnabled ? (
                    <ToggleRight size={24} color={Colors.primary} />
                  ) : (
                    <ToggleLeft size={24} color={Colors.textTertiary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.monetizationOption}
                  onPress={() => setSubscriptionsEnabled(!subscriptionsEnabled)}
                >
                  <View style={[styles.optionIconBg, { backgroundColor: '#8B5CF6' + '15' }]}>
                    <Users size={18} color="#8B5CF6" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Subscriptions</Text>
                    <Text style={styles.optionDesc}>Monthly supporter memberships</Text>
                  </View>
                  {subscriptionsEnabled ? (
                    <ToggleRight size={24} color={Colors.primary} />
                  ) : (
                    <ToggleLeft size={24} color={Colors.textTertiary} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.monetizationOption}
                  onPress={() => setPayPerViewEnabled(!payPerViewEnabled)}
                >
                  <View style={[styles.optionIconBg, { backgroundColor: '#0EA5E9' + '15' }]}>
                    <CreditCard size={18} color="#0EA5E9" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Pay-Per-View</Text>
                    <Text style={styles.optionDesc}>Charge for premium content</Text>
                  </View>
                  {payPerViewEnabled ? (
                    <ToggleRight size={24} color={Colors.primary} />
                  ) : (
                    <ToggleLeft size={24} color={Colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.payoutSettings}>
                <Text style={styles.payoutSettingsTitle}>Payout Settings</Text>
                
                <TouchableOpacity style={styles.payoutSettingItem}>
                  <View style={[styles.optionIconBg, { backgroundColor: Colors.primary + '15' }]}>
                    <Wallet size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Payout Wallet</Text>
                    <Text style={styles.optionDesc}>0x7a3f...8e2d (LARE Network)</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.payoutSettingItem}>
                  <View style={[styles.optionIconBg, { backgroundColor: '#F59E0B' + '15' }]}>
                    <TrendingUp size={18} color="#F59E0B" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Auto-Payout Threshold</Text>
                    <Text style={styles.optionDesc}>500 LARE minimum</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.textTertiary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.payoutSettingItem}>
                  <View style={[styles.optionIconBg, { backgroundColor: '#10B981' + '15' }]}>
                    <Clock size={18} color="#10B981" />
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Payout Schedule</Text>
                    <Text style={styles.optionDesc}>Weekly (every Friday)</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.textTertiary} />
                </TouchableOpacity>
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
                  onPress={() => router.push(item.route as any)}
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

      <NavMenuModal visible={showNavMenu} onClose={() => setShowNavMenu(false)} />

      <Modal
        visible={showHandleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHandleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile Handle</Text>
              <TouchableOpacity onPress={() => setShowHandleModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Your unique handle for your public profile
            </Text>

            <View style={styles.handleInputContainer}>
              <View style={styles.handleInputPrefix}>
                <AtSign size={18} color={Colors.primary} />
              </View>
              <TextInput
                style={styles.handleInput}
                value={editHandle}
                onChangeText={(text) => setEditHandle(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="yourhandle"
                placeholderTextColor={Colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
              />
            </View>

            <View style={styles.profileLinkPreview}>
              <Text style={styles.previewLabel}>Your profile link:</Text>
              <Text style={styles.previewLink}>larecoin.com/profile/{editHandle || 'yourhandle'}</Text>
            </View>

            <View style={styles.handleRules}>
              <Text style={styles.rulesTitle}>Handle requirements:</Text>
              <Text style={styles.ruleText}>• Lowercase letters, numbers, and underscores only</Text>
              <Text style={styles.ruleText}>• Maximum 30 characters</Text>
              <Text style={styles.ruleText}>• Must be unique</Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowHandleModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !editHandle.trim() && styles.saveButtonDisabled]}
                onPress={handleSaveHandle}
                disabled={!editHandle.trim()}
              >
                <Text style={styles.saveButtonText}>Save Handle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
  },
  handleText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  profileLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  profileLinkText: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  reportNewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444' + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reportNewsText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  categoriesScroll: {
    marginBottom: 16,
    marginLeft: -20,
    marginRight: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
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
  monetizationSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  monetizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monetizationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monetizationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monetizationTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  mainToggle: {
    padding: 4,
  },
  earningsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  earningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  earningValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  earningValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  earningCurrency: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pendingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  payoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 16,
  },
  payoutButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  monetizationOptions: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  monetizationOptionsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  monetizationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  payoutSettings: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  payoutSettingsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  payoutSettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  handleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  handleInputPrefix: {
    paddingLeft: 14,
    paddingRight: 4,
  },
  handleInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 14,
    paddingRight: 14,
  },
  profileLinkPreview: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  previewLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  handleRules: {
    marginBottom: 20,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
