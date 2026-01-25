import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, TrendingUp, Filter, Home, Car, Briefcase } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const listings = [
  { id: '1', name: 'Manhattan Penthouse', type: 'Real Estate', price: '$2.5M', tokens: '10,000', available: '3,500', apy: '8.2%', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop' },
  { id: '2', name: 'Ferrari 488 GTB', type: 'Vehicle', price: '$320K', tokens: '1,000', available: '450', apy: '5.5%', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop' },
  { id: '3', name: 'Tech Startup Equity', type: 'Business', price: '$5M', tokens: '50,000', available: '12,000', apy: '15%', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop' },
  { id: '4', name: 'Beachfront Villa', type: 'Real Estate', price: '$1.8M', tokens: '8,000', available: '2,100', apy: '7.8%', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&h=200&fit=crop' },
];

const categories = ['All', 'Real Estate', 'Vehicles', 'Business', 'Art'];

export default function AssetsMarketScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Assets Market' }} />
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
              placeholder="Search tokenized assets..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Filter size={20} color={colors.textTertiary} />
            </TouchableOpacity>
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Featured Listings</Text>
          {listings.map((listing) => (
            <TouchableOpacity
              key={listing.id}
              style={[styles.listingCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: listing.image }} style={styles.listingImage} />
              <View style={styles.listingInfo}>
                <Text style={[styles.listingName, { color: colors.text }]}>{listing.name}</Text>
                <Text style={[styles.listingType, { color: colors.primary }]}>{listing.type}</Text>
                <View style={styles.listingStats}>
                  <Text style={[styles.listingPrice, { color: colors.text }]}>{listing.price}</Text>
                  <View style={[styles.apyBadge, { backgroundColor: colors.success + '20' }]}>
                    <TrendingUp size={12} color={colors.success} />
                    <Text style={[styles.apyText, { color: colors.success }]}>{listing.apy} APY</Text>
                  </View>
                </View>
                <View style={styles.tokensInfo}>
                  <Text style={[styles.tokensText, { color: colors.textTertiary }]}>
                    {listing.available} / {listing.tokens} tokens available
                  </Text>
                </View>
              </View>
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
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  listingCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  listingImage: {
    width: 100,
    height: 120,
  },
  listingInfo: {
    flex: 1,
    padding: 12,
  },
  listingName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  listingType: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  listingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  apyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  apyText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  tokensInfo: {
    marginTop: 'auto',
  },
  tokensText: {
    fontSize: 11,
  },
});
