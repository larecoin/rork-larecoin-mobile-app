import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, UserPlus, UserCheck, Users } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const suggestedUsers = [
  { id: '1', name: 'CryptoWhale', username: '@cryptowhale', avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', followers: '125K', isFollowing: false, verified: true },
  { id: '2', name: 'DeFi Master', username: '@defimaster', avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop', followers: '89K', isFollowing: true, verified: true },
  { id: '3', name: 'NFT Artist', username: '@nftartist', avatar: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', followers: '45K', isFollowing: false, verified: false },
  { id: '4', name: 'Blockchain Dev', username: '@blockchaindev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', followers: '32K', isFollowing: false, verified: true },
  { id: '5', name: 'Trader Pro', username: '@traderpro', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', followers: '28K', isFollowing: true, verified: false },
];

const categories = ['All', 'Traders', 'Developers', 'Artists', 'Influencers', 'Educators'];

export default function FollowScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [users, setUsers] = useState(suggestedUsers);

  const toggleFollow = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Follow & Connect' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search users..."
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

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>1,234</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Following</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>5,678</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Followers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Suggested for You</Text>
          {users.map((user) => (
            <View key={user.id} style={[styles.userCard, { backgroundColor: colors.surface }]}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  {user.verified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.userHandle, { color: colors.textTertiary }]}>{user.username}</Text>
                <Text style={[styles.followers, { color: colors.textTertiary }]}>{user.followers} followers</Text>
              </View>
              <TouchableOpacity 
                style={[
                  styles.followButton,
                  { backgroundColor: user.isFollowing ? colors.surface : colors.primary },
                  user.isFollowing && { borderWidth: 1, borderColor: colors.border }
                ]}
                onPress={() => toggleFollow(user.id)}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck size={16} color={colors.text} />
                    <Text style={[styles.followButtonText, { color: colors.text }]}>Following</Text>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} color="#FFF" />
                    <Text style={[styles.followButtonText, { color: '#FFF' }]}>Follow</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
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
  header: {
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
    marginBottom: 8,
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
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700' as const,
  },
  userHandle: {
    fontSize: 13,
    marginTop: 2,
  },
  followers: {
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
