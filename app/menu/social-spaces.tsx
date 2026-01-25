import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Plus, Users, MessageSquare, Globe, Lock, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const spaces = [
  { id: '1', name: 'Crypto Traders', members: 12500, posts: 342, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '2', name: 'DeFi Enthusiasts', members: 8200, posts: 156, image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '3', name: 'NFT Collectors', members: 5600, posts: 89, image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', isPublic: true, trending: false },
  { id: '4', name: 'Larecoin Community', members: 25000, posts: 1200, image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '5', name: 'Private Investors Club', members: 320, posts: 45, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop', isPublic: false, trending: false },
];

const categories = ['All', 'Trading', 'DeFi', 'NFTs', 'Gaming', 'Social', 'Business'];

export default function SocialSpacesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Social Spaces' }} />
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
              placeholder="Search spaces..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category ? colors.primary : colors.surface }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category ? '#FFF' : colors.text }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Create New Space</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Trending Spaces</Text>
          {spaces.filter(s => s.trending).map((space) => (
            <TouchableOpacity
              key={space.id}
              style={[styles.spaceCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: space.image }} style={styles.spaceImage} />
              <View style={styles.spaceInfo}>
                <View style={styles.spaceHeader}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                  {space.trending && (
                    <View style={[styles.trendingBadge, { backgroundColor: colors.warning + '20' }]}>
                      <TrendingUp size={12} color={colors.warning} />
                    </View>
                  )}
                </View>
                <View style={styles.spaceStats}>
                  <View style={styles.stat}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.members.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <MessageSquare size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.posts} posts
                    </Text>
                  </View>
                  {space.isPublic ? (
                    <Globe size={14} color={colors.success} />
                  ) : (
                    <Lock size={14} color={colors.warning} />
                  )}
                </View>
              </View>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.joinButtonText, { color: colors.primary }]}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>All Spaces</Text>
          {spaces.map((space) => (
            <TouchableOpacity
              key={space.id}
              style={[styles.spaceCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: space.image }} style={styles.spaceImage} />
              <View style={styles.spaceInfo}>
                <View style={styles.spaceHeader}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                </View>
                <View style={styles.spaceStats}>
                  <View style={styles.stat}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.members.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <MessageSquare size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.posts} posts
                    </Text>
                  </View>
                  {space.isPublic ? (
                    <Globe size={14} color={colors.success} />
                  ) : (
                    <Lock size={14} color={colors.warning} />
                  )}
                </View>
              </View>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.joinButtonText, { color: colors.primary }]}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  spaceImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spaceName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  trendingBadge: {
    padding: 4,
    borderRadius: 6,
  },
  spaceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
