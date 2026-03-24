import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, TrendingUp, MapPin, Filter } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const featuredItems = [
  { id: '1', title: 'Top DeFi Projects', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop', category: 'DeFi' },
  { id: '2', title: 'Rising NFT Artists', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop', category: 'NFTs' },
  { id: '3', title: 'Crypto Meetups Near You', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', category: 'Events' },
];

const trendingTopics = [
  { id: '1', name: '#Bitcoin', posts: '125K' },
  { id: '2', name: '#Larecoin', posts: '89K' },
  { id: '3', name: '#DeFi', posts: '67K' },
  { id: '4', name: '#NFTs', posts: '54K' },
  { id: '5', name: '#Web3', posts: '43K' },
];

const discoveries = [
  { id: '1', title: 'Learn to Trade', description: 'Start your trading journey', icon: '📈', color: '#4CAF50' },
  { id: '2', title: 'Stake & Earn', description: 'Passive income strategies', icon: '💰', color: '#FF9800' },
  { id: '3', title: 'NFT Viewer', description: 'Get paid to rate NFTs', icon: '🎨', color: '#9C27B0' },
  { id: '4', title: 'Gaming Hub', description: 'Play-to-earn games', icon: '🎮', color: '#2196F3' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDiscoverPress = (itemId: string) => {
    if (itemId === '4') {
      router.push('/menu/gaming-hub');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Explore & Discover' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Explore Larecoin..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Filter size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Featured</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.featuredCard}>
                <Image source={{ uri: item.image }} style={styles.featuredImage} />
                <View style={[styles.featuredOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                  <Text style={[styles.featuredCategory, { backgroundColor: colors.primary }]}>{item.category}</Text>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Trending Now</Text>
            <TrendingUp size={18} color={colors.primary} />
          </View>
          <View style={[styles.trendingCard, { backgroundColor: colors.surface }]}>
            {trendingTopics.map((topic, index) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.trendingItem,
                  { borderBottomColor: colors.border },
                  index === trendingTopics.length - 1 && styles.trendingItemLast,
                ]}
              >
                <Text style={[styles.trendingRank, { color: colors.primary }]}>#{index + 1}</Text>
                <View style={styles.trendingInfo}>
                  <Text style={[styles.trendingName, { color: colors.text }]}>{topic.name}</Text>
                  <Text style={[styles.trendingPosts, { color: colors.textTertiary }]}>{topic.posts} posts</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Discover</Text>
          <View style={styles.discoverGrid}>
            {discoveries.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.discoverCard, { backgroundColor: colors.surface }]}
                onPress={() => handleDiscoverPress(item.id)}
              >
                <View style={[styles.discoverIcon, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.discoverEmoji}>{item.icon}</Text>
                </View>
                <Text style={[styles.discoverTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.discoverDescription, { color: colors.textTertiary }]}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Near You</Text>
            <MapPin size={18} color={colors.primary} />
          </View>
          <View style={[styles.nearCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.nearIcon, { backgroundColor: colors.primary + '15' }]}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <View style={styles.nearInfo}>
              <Text style={[styles.nearTitle, { color: colors.text }]}>Enable Location</Text>
              <Text style={[styles.nearDescription, { color: colors.textTertiary }]}>
                Discover crypto-friendly merchants, events, and community members near you.
              </Text>
            </View>
            <TouchableOpacity style={[styles.enableButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.enableButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  searchContainer: {
    padding: 16,
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
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  featuredCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  featuredCategory: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  trendingCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  trendingItemLast: {
    borderBottomWidth: 0,
  },
  trendingRank: {
    fontSize: 14,
    fontWeight: '700' as const,
    width: 30,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  trendingPosts: {
    fontSize: 12,
    marginTop: 2,
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  discoverCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
  },
  discoverIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  discoverEmoji: {
    fontSize: 24,
  },
  discoverTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  discoverDescription: {
    fontSize: 12,
  },
  nearCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  nearIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nearInfo: {
    flex: 1,
  },
  nearTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  nearDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  enableButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  enableButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
