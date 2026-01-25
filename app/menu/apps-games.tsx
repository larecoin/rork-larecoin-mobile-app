import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Download, Star, Gamepad2, Smartphone, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const featuredApps = [
  { id: '1', name: 'CryptoTracker Pro', category: 'Finance', rating: 4.8, downloads: '500K+', icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop' },
  { id: '2', name: 'NFT Gallery', category: 'Art', rating: 4.6, downloads: '200K+', icon: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop' },
  { id: '3', name: 'DeFi Manager', category: 'Finance', rating: 4.7, downloads: '150K+', icon: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop' },
];

const games = [
  { id: '1', name: 'Crypto Quest', category: 'RPG', rating: 4.5, downloads: '1M+', icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop', rewards: '500 LRC' },
  { id: '2', name: 'NFT Battles', category: 'Strategy', rating: 4.3, downloads: '800K+', icon: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop', rewards: '250 LRC' },
  { id: '3', name: 'DeFi Tycoon', category: 'Simulation', rating: 4.4, downloads: '600K+', icon: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=100&h=100&fit=crop', rewards: '300 LRC' },
];

const categories = ['All', 'Finance', 'Games', 'Social', 'Tools', 'Education'];

export default function AppsGamesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Apps & Games' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textTertiary} />
          <Text style={[styles.searchPlaceholder, { color: colors.textTertiary }]}>Search apps & games...</Text>
        </TouchableOpacity>

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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Apps</Text>
          </View>
          {featuredApps.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={[styles.appCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: app.icon }} style={styles.appIcon} />
              <View style={styles.appInfo}>
                <Text style={[styles.appName, { color: colors.text }]}>{app.name}</Text>
                <Text style={[styles.appCategory, { color: colors.textTertiary }]}>{app.category}</Text>
                <View style={styles.appMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={colors.warning} fill={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{app.rating}</Text>
                  </View>
                  <Text style={[styles.downloads, { color: colors.textTertiary }]}>{app.downloads}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.primary }]}>
                <Download size={16} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Gamepad2 size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Play to Earn Games</Text>
          </View>
          {games.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.appCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: game.icon }} style={styles.appIcon} />
              <View style={styles.appInfo}>
                <Text style={[styles.appName, { color: colors.text }]}>{game.name}</Text>
                <Text style={[styles.appCategory, { color: colors.textTertiary }]}>{game.category}</Text>
                <View style={styles.appMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={colors.warning} fill={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{game.rating}</Text>
                  </View>
                  <View style={[styles.rewardBadge, { backgroundColor: colors.success + '20' }]}>
                    <Text style={[styles.rewardText, { color: colors.success }]}>Earn {game.rewards}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.primary }]}>
                <Download size={16} color="#FFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.promoCard, { backgroundColor: colors.primary }]}>
          <TrendingUp size={32} color="#FFF" />
          <View style={styles.promoInfo}>
            <Text style={styles.promoTitle}>Publish Your App</Text>
            <Text style={styles.promoDescription}>List your app on Larecoin marketplace</Text>
          </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 10,
  },
  searchPlaceholder: {
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
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  appCategory: {
    fontSize: 12,
    marginBottom: 6,
  },
  appMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  downloads: {
    fontSize: 12,
  },
  rewardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  promoInfo: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
});
