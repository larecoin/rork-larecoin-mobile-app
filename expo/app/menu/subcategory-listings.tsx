import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { 
  Search, MapPin, ChevronDown, Clock, Flame, BadgeCheck, TrendingUp, 
  MapPinIcon, Filter, SlidersHorizontal, Phone, MessageSquare, Heart,
  Share2, Star, ChevronRight, Grid, List
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface MerchantAd {
  id: string;
  title: string;
  description: string;
  price: string;
  merchantName: string;
  verified: boolean;
  location: string;
  distance: string;
  postedAt: Date;
  image: string;
  isBumped: boolean;
  bumpedUntil?: Date;
  category: string;
  subcategory: string;
  rating: number;
  reviews: number;
  phone?: string;
  tags: string[];
}

const generateMockAds = (category: string, subcategory: string): MerchantAd[] => {
  const now = new Date();
  
  const images = [
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
  ];

  const merchants = [
    { name: 'Elite Services LLC', verified: true },
    { name: 'Budget Pro', verified: true },
    { name: 'Family First Co', verified: false },
    { name: 'QuickFix Solutions', verified: true },
    { name: 'Pro Team Services', verified: true },
    { name: 'Weekend Warriors', verified: false },
    { name: 'New Start LLC', verified: false },
    { name: 'Premier Solutions', verified: true },
    { name: 'Local Experts', verified: true },
    { name: 'Value Masters', verified: false },
    { name: 'Quality First Inc', verified: true },
    { name: 'Neighborhood Pros', verified: false },
  ];

  const locations = ['Downtown', 'Midtown', 'Westside', 'Eastside', 'Northside', 'Suburbs', 'Central', 'Harbor District', 'Tech Park', 'Old Town'];
  const distances = ['0.3 mi', '0.5 mi', '0.8 mi', '1.2 mi', '1.5 mi', '2.1 mi', '2.8 mi', '3.4 mi', '4.0 mi', '5.2 mi'];
  const prices = ['$25', '$50', '$65', '$75', '$95', '$120', '$150', '$175', '$200', '$250', '$300', '$500'];
  const tagOptions = ['Quick Response', '24/7 Available', 'Free Estimates', 'Licensed', 'Insured', 'Eco-Friendly', 'Same Day', 'Warranty', 'Top Rated'];

  const ads: MerchantAd[] = [];

  for (let i = 0; i < 15; i++) {
    const merchant = merchants[i % merchants.length];
    const isBumped = i < 3;
    const hoursAgo = i === 0 ? 0.5 : i < 5 ? i * 2 : i * 5;
    
    ads.push({
      id: `${i + 1}`,
      title: i === 0 
        ? `Premium ${subcategory} Service - Limited Time Offer!` 
        : i === 1 
        ? `${subcategory} - Best Deals in Town!`
        : i === 2
        ? `Professional ${subcategory} Experts`
        : `${subcategory} ${['Service', 'Available', 'Specialist', 'Pro', 'Expert'][i % 5]} - ${['Great Prices', 'Quality Work', 'Fast Service', 'Reliable', 'Affordable'][i % 5]}`,
      description: [
        'Professional quality service with years of experience. Contact us today for a free quote and consultation.',
        'Limited time offer! Best prices in town guaranteed. Satisfaction or your money back.',
        'Family owned business serving the community for 15+ years. We treat every customer like family.',
        'Quality work at competitive prices. Free estimates available. Call now!',
        'Licensed and insured professionals ready to help. Available 7 days a week.',
        'Book now and save! Special discounts for first-time customers.',
        'Grand opening special! Exceptional service at unbeatable prices.',
        'Trusted by thousands of satisfied customers. See our 5-star reviews!',
      ][i % 8],
      price: prices[i % prices.length],
      merchantName: merchant.name,
      verified: merchant.verified,
      location: locations[i % locations.length],
      distance: distances[i % distances.length],
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * hoursAgo),
      image: images[i % images.length],
      isBumped,
      bumpedUntil: isBumped ? new Date(now.getTime() + 1000 * 60 * 60 * (24 - i * 6)) : undefined,
      category,
      subcategory,
      rating: 3.5 + (Math.random() * 1.5),
      reviews: Math.floor(10 + Math.random() * 200),
      phone: `(555) ${100 + i}-${1000 + i * 111}`,
      tags: tagOptions.slice(i % 3, (i % 3) + 2 + (i % 2)),
    });
  }

  return ads;
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

type SortOption = 'time' | 'price_low' | 'price_high' | 'distance' | 'rating';
type ViewMode = 'list' | 'grid';

export default function SubcategoryListingsScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string; subcategory: string; categoryName: string }>();
  
  const category = params.category || '';
  const subcategory = params.subcategory || '';
  const categoryName = params.categoryName || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [savedAds, setSavedAds] = useState<Set<string>>(new Set());

  const allAds = useMemo(() => generateMockAds(category, subcategory), [category, subcategory]);

  const filteredAds = useMemo(() => {
    let filtered = searchQuery
      ? allAds.filter(ad =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allAds;

    const sorted = [...filtered].sort((a, b) => {
      if (a.isBumped && !b.isBumped) return -1;
      if (!a.isBumped && b.isBumped) return 1;
      
      switch (sortBy) {
        case 'price_low':
          return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
        case 'price_high':
          return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.postedAt.getTime() - a.postedAt.getTime();
      }
    });

    return sorted;
  }, [allAds, searchQuery, sortBy]);

  const toggleSaveAd = (adId: string) => {
    setSavedAds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const handleAdPress = (ad: MerchantAd) => {
    console.log('Ad pressed:', ad.id);
  };

  const handleContactPress = (ad: MerchantAd) => {
    console.log('Contact:', ad.phone);
  };

  const handleMessagePress = (ad: MerchantAd) => {
    console.log('Message:', ad.merchantName);
  };

  const styles = createStyles(colors);

  const renderAdCard = (ad: MerchantAd) => (
    <TouchableOpacity 
      key={ad.id} 
      style={[styles.adCard, ad.isBumped && styles.adCardBumped]}
      onPress={() => handleAdPress(ad)}
      activeOpacity={0.7}
    >
      {ad.isBumped && (
        <View style={styles.bumpedBanner}>
          <TrendingUp size={12} color="#FFF" />
          <Text style={styles.bumpedText}>PRIORITY LISTING</Text>
          <Flame size={12} color="#FFA500" />
        </View>
      )}
      <View style={styles.adContent}>
        <Image source={{ uri: ad.image }} style={styles.adImage} />
        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={() => toggleSaveAd(ad.id)}
        >
          <Heart 
            size={18} 
            color={savedAds.has(ad.id) ? '#EF4444' : '#FFF'} 
            fill={savedAds.has(ad.id) ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
        <View style={styles.adInfo}>
          <View style={styles.adTitleRow}>
            <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
          </View>
          <Text style={styles.adPrice}>{ad.price}</Text>
          <Text style={styles.adDescription} numberOfLines={2}>{ad.description}</Text>
          
          <View style={styles.adMerchantRow}>
            <Text style={styles.adMerchantName}>{ad.merchantName}</Text>
            {ad.verified && <BadgeCheck size={14} color={colors.primary} />}
          </View>

          <View style={styles.ratingRow}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{ad.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsText}>({ad.reviews} reviews)</Text>
          </View>

          <View style={styles.tagsRow}>
            {ad.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.adMetaRow}>
            <View style={styles.adMetaItem}>
              <MapPinIcon size={12} color={colors.textTertiary} />
              <Text style={styles.adMetaText}>{ad.location} • {ad.distance}</Text>
            </View>
            <View style={styles.adMetaItem}>
              <Clock size={12} color={colors.textTertiary} />
              <Text style={styles.adMetaText}>{formatTimeAgo(ad.postedAt)}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.contactBtn}
              onPress={() => handleContactPress(ad)}
            >
              <Phone size={14} color="#FFF" />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageBtn}
              onPress={() => handleMessagePress(ad)}
            >
              <MessageSquare size={14} color={colors.primary} />
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn}>
              <Share2 size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridCard = (ad: MerchantAd) => (
    <TouchableOpacity 
      key={ad.id} 
      style={[styles.gridCard, ad.isBumped && styles.gridCardBumped]}
      onPress={() => handleAdPress(ad)}
      activeOpacity={0.7}
    >
      <View style={styles.gridImageContainer}>
        <Image source={{ uri: ad.image }} style={styles.gridImage} />
        {ad.isBumped && (
          <View style={styles.gridBumpBadge}>
            <Flame size={10} color="#FFF" />
          </View>
        )}
        <TouchableOpacity 
          style={styles.gridSaveBtn}
          onPress={() => toggleSaveAd(ad.id)}
        >
          <Heart 
            size={16} 
            color={savedAds.has(ad.id) ? '#EF4444' : '#FFF'} 
            fill={savedAds.has(ad.id) ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridPrice}>{ad.price}</Text>
        <Text style={styles.gridTitle} numberOfLines={2}>{ad.title}</Text>
        <View style={styles.gridMerchantRow}>
          <Text style={styles.gridMerchant} numberOfLines={1}>{ad.merchantName}</Text>
          {ad.verified && <BadgeCheck size={12} color={colors.primary} />}
        </View>
        <View style={styles.gridMetaRow}>
          <MapPinIcon size={10} color={colors.textTertiary} />
          <Text style={styles.gridMetaText}>{ad.distance}</Text>
          <Clock size={10} color={colors.textTertiary} />
          <Text style={styles.gridMetaText}>{formatTimeAgo(ad.postedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: subcategory,
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? (
                <Grid size={20} color={colors.text} />
              ) : (
                <List size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ),
        }} 
      />

      <TouchableOpacity style={styles.locationSelector}>
        <View style={styles.locationIcon}>
          <MapPin size={16} color={colors.primary} />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Showing ads near</Text>
          <Text style={styles.locationValue}>{selectedLocation}</Text>
        </View>
        <ChevronDown size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${subcategory}...`}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} color={showFilters ? '#FFF' : colors.text} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort by</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterOptions}>
            {[
              { key: 'time', label: 'Most Recent' },
              { key: 'price_low', label: 'Price: Low to High' },
              { key: 'price_high', label: 'Price: High to Low' },
              { key: 'distance', label: 'Nearest' },
              { key: 'rating', label: 'Top Rated' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.filterChip, sortBy === option.key && styles.filterChipActive]}
                onPress={() => setSortBy(option.key as SortOption)}
              >
                <Text style={[styles.filterChipText, sortBy === option.key && styles.filterChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.infoBar}>
        <Text style={styles.adsCount}>{filteredAds.length} listings in {subcategory}</Text>
        <View style={styles.sortInfo}>
          <Filter size={12} color={colors.textTertiary} />
          <Text style={styles.sortText}>
            {sortBy === 'time' ? 'Recent' : sortBy === 'price_low' ? 'Price ↑' : sortBy === 'price_high' ? 'Price ↓' : sortBy === 'distance' ? 'Near' : 'Rating'}
          </Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={viewMode === 'grid' ? styles.gridScrollContent : styles.scrollContent}
      >
        {viewMode === 'list' ? (
          filteredAds.map(renderAdCard)
        ) : (
          <View style={styles.gridContainer}>
            {filteredAds.map(renderGridCard)}
          </View>
        )}

        <View style={styles.bumpPromo}>
          <Flame size={20} color="#FF6B00" />
          <View style={styles.bumpPromoContent}>
            <Text style={styles.bumpPromoTitle}>Want more visibility?</Text>
            <Text style={styles.bumpPromoText}>Bump your ad to the top for priority placement</Text>
          </View>
          <TouchableOpacity style={styles.bumpPromoBtn}>
            <Text style={styles.bumpPromoBtnText}>Bump Ad</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.postAdBtn}>
          <Text style={styles.postAdBtnText}>Post Your Ad in {subcategory}</Text>
          <ChevronRight size={18} color="#FFF" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBtn: {
    padding: 8,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  filterOptions: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '600' as const,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  adsCount: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  sortInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  gridScrollContent: {
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  adCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  adCardBumped: {
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  bumpedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    paddingVertical: 6,
    gap: 6,
  },
  bumpedText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#FFF',
    letterSpacing: 1,
  },
  adContent: {
    padding: 12,
  },
  adImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    backgroundColor: colors.backgroundTertiary,
    marginBottom: 12,
  },
  saveBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adInfo: {
    gap: 6,
  },
  adTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  adTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    lineHeight: 22,
  },
  adPrice: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: colors.primary,
  },
  adDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  adMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  adMerchantName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  adMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  adMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adMetaText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    borderRadius: 10,
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary + '15',
    paddingVertical: 10,
    borderRadius: 10,
  },
  messageBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridCardBumped: {
    borderWidth: 1.5,
    borderColor: '#FF6B00',
  },
  gridImageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.backgroundTertiary,
  },
  gridBumpBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B00',
    borderRadius: 4,
    padding: 4,
  },
  gridSaveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridInfo: {
    padding: 10,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: colors.primary,
    marginBottom: 4,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  gridMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  gridMerchant: {
    fontSize: 11,
    color: colors.textSecondary,
    flex: 1,
  },
  gridMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridMetaText: {
    fontSize: 10,
    color: colors.textTertiary,
    marginRight: 6,
  },
  bumpPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B00' + '15',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
    gap: 12,
  },
  bumpPromoContent: {
    flex: 1,
  },
  bumpPromoTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FF6B00',
    marginBottom: 2,
  },
  bumpPromoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bumpPromoBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bumpPromoBtnText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  postAdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    gap: 8,
  },
  postAdBtnText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});
