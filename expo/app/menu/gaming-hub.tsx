import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gamepad2, Users, Trophy, Zap, Star, Clock, Coins, ChevronRight, Flame } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const categories = [
  { id: 'all', name: 'All Games', icon: Gamepad2 },
  { id: 'multiplayer', name: 'Multiplayer', icon: Users },
  { id: 'tournaments', name: 'Tournaments', icon: Trophy },
  { id: 'trending', name: 'Trending', icon: Flame },
  { id: 'p2e', name: 'Play to Earn', icon: Coins },
];

const featuredGames = [
  {
    id: '1',
    title: 'Crypto Legends',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=300&fit=crop',
    players: '125K',
    category: 'multiplayer',
    reward: '500 LARE',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'NFT Racing Pro',
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=300&fit=crop',
    players: '89K',
    category: 'multiplayer',
    reward: '350 LARE',
    rating: 4.6,
  },
];

const games = [
  {
    id: '1',
    title: 'Battle Arena',
    description: 'Real-time PvP combat',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    players: '45K online',
    category: 'multiplayer',
    rating: 4.7,
    reward: '200 LARE/win',
    tags: ['PvP', 'Action'],
  },
  {
    id: '2',
    title: 'Crypto Quest',
    description: 'MMORPG adventure',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=200&h=200&fit=crop',
    players: '32K online',
    category: 'multiplayer',
    rating: 4.5,
    reward: '150 LARE/hr',
    tags: ['RPG', 'Adventure'],
  },
  {
    id: '3',
    title: 'Chain Cards',
    description: 'Strategic card battles',
    image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=200&h=200&fit=crop',
    players: '28K online',
    category: 'multiplayer',
    rating: 4.8,
    reward: '100 LARE/match',
    tags: ['Strategy', 'Cards'],
  },
  {
    id: '4',
    title: 'Meta Racers',
    description: 'High-speed racing',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f897a?w=200&h=200&fit=crop',
    players: '21K online',
    category: 'multiplayer',
    rating: 4.4,
    reward: '180 LARE/race',
    tags: ['Racing', 'Competitive'],
  },
  {
    id: '5',
    title: 'Tower Defense X',
    description: 'Co-op tower defense',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop',
    players: '18K online',
    category: 'multiplayer',
    rating: 4.6,
    reward: '120 LARE/wave',
    tags: ['Strategy', 'Co-op'],
  },
  {
    id: '6',
    title: 'Pixel Warriors',
    description: 'Retro multiplayer brawler',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&h=200&fit=crop',
    players: '15K online',
    category: 'multiplayer',
    rating: 4.3,
    reward: '80 LARE/match',
    tags: ['Action', 'Retro'],
  },
  {
    id: '7',
    title: 'Crypto Poker',
    description: 'Texas Hold\'em with crypto',
    image: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=200&h=200&fit=crop',
    players: '52K online',
    category: 'multiplayer',
    rating: 4.9,
    reward: 'Variable',
    tags: ['Casino', 'Cards'],
  },
  {
    id: '8',
    title: 'Space Commanders',
    description: 'Galactic fleet battles',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=200&h=200&fit=crop',
    players: '12K online',
    category: 'multiplayer',
    rating: 4.5,
    reward: '250 LARE/battle',
    tags: ['Strategy', 'Sci-Fi'],
  },
];

const tournaments = [
  {
    id: '1',
    title: 'Weekly Championship',
    game: 'Battle Arena',
    prize: '10,000 LARE',
    participants: '256/512',
    startsIn: '2h 30m',
  },
  {
    id: '2',
    title: 'Pro League Finals',
    game: 'Crypto Quest',
    prize: '25,000 LARE',
    participants: '64/64',
    startsIn: '1d 4h',
  },
];

export default function GamingHubScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('multiplayer');

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory || selectedCategory === 'multiplayer');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Gaming Hub' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={[styles.headerBanner, { backgroundColor: '#1a1a2e' }]}>
            <View style={styles.headerContent}>
              <View style={[styles.headerIcon, { backgroundColor: '#6C5CE7' }]}>
                <Gamepad2 size={28} color="#FFF" />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Play & Earn</Text>
                <Text style={styles.headerSubtitle}>Win LARE tokens in multiplayer games</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>250K+</Text>
                <Text style={styles.statLabel}>Players</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>50+</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1M LARE</Text>
                <Text style={styles.statLabel}>Paid Out</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  { backgroundColor: isSelected ? '#6C5CE7' : colors.surface },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Icon size={16} color={isSelected ? '#FFF' : colors.textSecondary} />
                <Text style={[
                  styles.categoryText,
                  { color: isSelected ? '#FFF' : colors.textSecondary },
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Games</Text>
            <Zap size={18} color="#FFD700" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredGames.map((game) => (
              <TouchableOpacity key={game.id} style={styles.featuredCard}>
                <Image source={{ uri: game.image }} style={styles.featuredImage} />
                <View style={styles.featuredGradient}>
                  <View style={styles.featuredBadge}>
                    <Users size={12} color="#FFF" />
                    <Text style={styles.featuredPlayers}>{game.players} playing</Text>
                  </View>
                  <Text style={styles.featuredTitle}>{game.title}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.ratingBadge}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{game.rating}</Text>
                    </View>
                    <View style={styles.rewardBadge}>
                      <Coins size={12} color="#4CAF50" />
                      <Text style={styles.rewardText}>{game.reward}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Tournaments</Text>
            <Trophy size={18} color="#FFD700" />
          </View>
          {tournaments.map((tournament) => (
            <TouchableOpacity 
              key={tournament.id} 
              style={[styles.tournamentCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.tournamentIcon, { backgroundColor: '#6C5CE7' + '20' }]}>
                <Trophy size={24} color="#6C5CE7" />
              </View>
              <View style={styles.tournamentInfo}>
                <Text style={[styles.tournamentTitle, { color: colors.text }]}>{tournament.title}</Text>
                <Text style={[styles.tournamentGame, { color: colors.textSecondary }]}>{tournament.game}</Text>
                <View style={styles.tournamentMeta}>
                  <View style={styles.metaItem}>
                    <Coins size={12} color="#4CAF50" />
                    <Text style={[styles.metaText, { color: '#4CAF50' }]}>{tournament.prize}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users size={12} color={colors.textTertiary} />
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>{tournament.participants}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tournamentTimer}>
                <Clock size={14} color="#FF6B6B" />
                <Text style={[styles.timerText, { color: '#FF6B6B' }]}>{tournament.startsIn}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Multiplayer Games</Text>
            <Users size={18} color="#6C5CE7" />
          </View>
          <View style={styles.gamesGrid}>
            {filteredGames.map((game) => (
              <TouchableOpacity 
                key={game.id} 
                style={[styles.gameCard, { backgroundColor: colors.surface }]}
              >
                <Image source={{ uri: game.image }} style={styles.gameImage} />
                <View style={styles.gameInfo}>
                  <Text style={[styles.gameTitle, { color: colors.text }]} numberOfLines={1}>
                    {game.title}
                  </Text>
                  <Text style={[styles.gameDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                    {game.description}
                  </Text>
                  <View style={styles.gameMeta}>
                    <View style={styles.playersOnline}>
                      <View style={styles.onlineDot} />
                      <Text style={[styles.playersText, { color: colors.textTertiary }]}>{game.players}</Text>
                    </View>
                    <View style={styles.gameRating}>
                      <Star size={10} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.gameRatingText, { color: colors.textSecondary }]}>{game.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.tagsRow}>
                    {game.tags.map((tag, idx) => (
                      <View key={idx} style={[styles.tag, { backgroundColor: '#6C5CE7' + '20' }]}>
                        <Text style={[styles.tagText, { color: '#6C5CE7' }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.rewardRow}>
                    <Coins size={12} color="#4CAF50" />
                    <Text style={[styles.gameReward, { color: '#4CAF50' }]}>{game.reward}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.playButton, { backgroundColor: '#6C5CE7' }]}>
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.viewAllButton, { backgroundColor: colors.surface }]}>
          <Text style={[styles.viewAllText, { color: colors.text }]}>View All Games</Text>
          <ChevronRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
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
  headerSection: {
    padding: 16,
    paddingTop: 8,
  },
  headerBanner: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  featuredCard: {
    width: 300,
    height: 180,
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  featuredPlayers: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600' as const,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76,175,80,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600' as const,
  },
  tournamentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  tournamentIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tournamentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tournamentTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  tournamentGame: {
    fontSize: 12,
    marginBottom: 6,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  tournamentTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,107,107,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  gamesGrid: {
    gap: 12,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
  },
  gameImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  gameDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  gameMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  playersOnline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  playersText: {
    fontSize: 11,
  },
  gameRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  gameRatingText: {
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gameReward: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  playButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 8,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  viewAllText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
