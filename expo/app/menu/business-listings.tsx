import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, Search, MapPin, Star, Filter } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const listings = [
  { id: '1', name: 'CryptoTech Solutions', category: 'Technology', rating: 4.8, reviews: 124, location: 'New York, NY', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop' },
  { id: '2', name: 'DeFi Consulting', category: 'Finance', rating: 4.6, reviews: 89, location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=200&h=200&fit=crop' },
  { id: '3', name: 'NFT Art Gallery', category: 'Art', rating: 4.9, reviews: 256, location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop' },
];

export default function BusinessListingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Business Listings' }} />
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
              placeholder="Search businesses..."
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
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Featured Businesses</Text>
          {listings.map((listing) => (
            <TouchableOpacity
              key={listing.id}
              style={[styles.listingCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: listing.image }} style={styles.listingImage} />
              <View style={styles.listingInfo}>
                <Text style={[styles.listingName, { color: colors.text }]}>{listing.name}</Text>
                <Text style={[styles.listingCategory, { color: colors.primary }]}>{listing.category}</Text>
                <View style={styles.listingMeta}>
                  <View style={styles.ratingRow}>
                    <Star size={14} color={colors.warning} fill={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{listing.rating}</Text>
                    <Text style={[styles.reviewsText, { color: colors.textTertiary }]}>({listing.reviews})</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color={colors.textTertiary} />
                    <Text style={[styles.locationText, { color: colors.textTertiary }]}>{listing.location}</Text>
                  </View>
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
  container: { flex: 1 },
  content: { flex: 1 },
  searchContainer: { padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 48, borderRadius: 12, gap: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  listingCard: { flexDirection: 'row', borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  listingImage: { width: 100, height: 100 },
  listingInfo: { flex: 1, padding: 12 },
  listingName: { fontSize: 16, fontWeight: '600' as const, marginBottom: 4 },
  listingCategory: { fontSize: 12, fontWeight: '500' as const, marginBottom: 8 },
  listingMeta: { gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '600' as const },
  reviewsText: { fontSize: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 12 },
});
