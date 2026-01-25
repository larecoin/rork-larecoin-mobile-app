import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, ShoppingCart, ChevronRight, MapPin, QrCode, ChevronDown, ChevronUp,
  Car, Briefcase, Home, MapPinned, Zap, Truck, Building2, Tag, Wrench, Globe,
  Users, Store, ArrowLeft, Clock, Flame, Star, BadgeCheck, TrendingUp, MapPinIcon
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

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
}

const generateMockAds = (category: string, subcategory: string): MerchantAd[] => {
  const now = new Date();
  const ads: MerchantAd[] = [
    {
      id: '1',
      title: `Premium ${subcategory} Service`,
      description: 'Professional quality service with years of experience. Contact us today for a free quote.',
      price: '$150',
      merchantName: 'Elite Services LLC',
      verified: true,
      location: 'Downtown',
      distance: '0.5 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 30),
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200',
      isBumped: true,
      bumpedUntil: new Date(now.getTime() + 1000 * 60 * 60 * 24),
      category,
      subcategory,
    },
    {
      id: '2',
      title: `${subcategory} - Great Deals!`,
      description: 'Limited time offer. Best prices in town guaranteed.',
      price: '$75',
      merchantName: 'Budget Pro',
      verified: true,
      location: 'Midtown',
      distance: '1.2 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 45),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      isBumped: true,
      bumpedUntil: new Date(now.getTime() + 1000 * 60 * 60 * 12),
      category,
      subcategory,
    },
    {
      id: '3',
      title: `Local ${subcategory} Expert`,
      description: 'Family owned business serving the community for 15+ years.',
      price: '$120',
      merchantName: 'Family First Co',
      verified: false,
      location: 'Westside',
      distance: '2.1 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200',
      isBumped: false,
      category,
      subcategory,
    },
    {
      id: '4',
      title: `Affordable ${subcategory}`,
      description: 'Quality work at competitive prices. Free estimates available.',
      price: '$50',
      merchantName: 'QuickFix Solutions',
      verified: true,
      location: 'Eastside',
      distance: '3.4 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * 5),
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200',
      isBumped: false,
      category,
      subcategory,
    },
    {
      id: '5',
      title: `${subcategory} Specialists`,
      description: 'Licensed and insured professionals ready to help.',
      price: '$200',
      merchantName: 'Pro Team Services',
      verified: true,
      location: 'Northside',
      distance: '4.0 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * 8),
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=200',
      isBumped: false,
      category,
      subcategory,
    },
    {
      id: '6',
      title: `Weekend ${subcategory} Special`,
      description: 'Book now and save 20% on all services this weekend only.',
      price: '$95',
      merchantName: 'Weekend Warriors',
      verified: false,
      location: 'Suburbs',
      distance: '5.2 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200',
      isBumped: false,
      category,
      subcategory,
    },
    {
      id: '7',
      title: `${subcategory} - New in Area`,
      description: 'Grand opening special! First 50 customers get 30% off.',
      price: '$65',
      merchantName: 'New Start LLC',
      verified: false,
      location: 'Central',
      distance: '1.8 mi',
      postedAt: new Date(now.getTime() - 1000 * 60 * 60 * 48),
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
      isBumped: false,
      category,
      subcategory,
    },
  ];
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

const categories: Category[] = [
  {
    id: 'merchant-directory',
    name: 'Merchant Directory',
    icon: <Store size={22} color={Colors.primary} />,
    subcategories: ['Search All Merchants', 'Featured Merchants', 'Verified Merchants', 'New Merchants', 'Top Rated']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: <Car size={22} color="#3B82F6" />,
    subcategories: ['Tools & Parts', 'Towing/Haul', 'Auto Dealers', 'Parking Lots', 'Auto Glass', 'Tires & Rims', 'Car Washes', 'Custom Decals', 'Repair & Body']
  },
  {
    id: 'jobs',
    name: 'Jobs',
    icon: <Briefcase size={22} color="#10B981" />,
    subcategories: ['Financial', 'Admin/Office', 'Computers', 'Customer Service', 'Domestic', 'Transportation', 'Education', 'Surveys', 'Medical/Health', 'Food/Beverage', 'Hospitality', 'Beauty', 'Real Estate', 'Skilled Labor', 'Sales', 'Marketing', 'Retail', 'Resumes']
  },
  {
    id: 'rentals',
    name: 'Rentals',
    icon: <Home size={22} color="#F59E0B" />,
    subcategories: ['Rooms/Shared', 'Sublets/Temp', 'Parking/Storage', 'Office/Commercial', 'Apt/Condo/House', 'Vacation Rentals', 'Rentals Wanted']
  },
  {
    id: 'local-places',
    name: 'Local Places',
    icon: <MapPinned size={22} color="#EC4899" />,
    subcategories: ['Restaurants & Bars', 'Clothing Boutiques', 'Grocery & Bakeries', 'Pharmacy & Pets', 'Pizza & Fast Food', 'Delis & Cafes', 'Hotel and Motel', 'Museums & Parks', 'Misc Entertainment']
  },
  {
    id: 'gigs',
    name: 'Gigs',
    icon: <Zap size={22} color="#8B5CF6" />,
    subcategories: ['Teaching', 'Computer', 'Creative', 'Crew', 'Domestic', 'Event', 'Labor', 'Talent', 'Writing']
  },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: <Truck size={22} color="#06B6D4" />,
    subcategories: ['Gifts/Deals', 'Grocery/Flowers', 'Food/Beverage', 'Convenience', 'Smoke/Supply', 'Pharmacy/Baby']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: <Building2 size={22} color="#EF4444" />,
    subcategories: ['Residential', 'Commercial', 'Special Purpose', 'Industrial', 'Lots and Land', 'Approved Plans', 'Wanted']
  },
  {
    id: 'for-sale',
    name: 'For Sale',
    icon: <Tag size={22} color="#14B8A6" />,
    subcategories: ['Antiques', 'Appliances', 'Arts + Crafts', 'Atv/utv/sno', 'Auto Parts', 'Aviation', 'Baby+kid', 'Barter', 'Health and Beauty', 'Bike parts', 'Bicycles', 'Boat parts', 'Boats', 'Books', 'Business', 'Cars+trucks', 'Cds/dvd/vhs', 'Cell phones', 'Clothes+acc', 'Collectibles', 'Computer parts', 'Computers', 'Electronics', 'Farm+garden', 'Free', 'Furniture', 'Garage sale', 'General Merchandise', 'Heavy Equipment', 'Household', 'Jewelry', 'Materials', 'Motorcycle parts', 'Motorcycles', 'Music instruments', 'Pets, Pet Supplies', 'Photo+video', 'RVs+camp', 'Sport Equipment', 'Tickets', 'Tools', 'Toys+games', 'Trailers', 'Video gaming', 'Wanted', 'Wheels+tires']
  },
  {
    id: 'services',
    name: 'Services',
    icon: <Wrench size={22} color="#F97316" />,
    subcategories: ['Biz Opps', 'Business', 'Cleaning', 'Computer', 'Creative', 'Domestic', 'Financial', 'Health & Beauty', 'Home Improvement', 'Insurance', 'Labor/Moving', 'Landscape/Lawn', 'Legal', 'Massage', 'Real Estate']
  },
  {
    id: 'access',
    name: 'Access',
    icon: <Globe size={22} color="#6366F1" />,
    subcategories: ['Escrow', 'SSL', 'Ecommerce', 'Websites', 'Hosting', 'Privacy', 'Domains', 'Resume', 'Email', 'Storage', 'Shopping', 'Apps', 'Games', 'Music', 'Videos', 'Articles', 'Images', 'Maps', 'Calendar']
  },
  {
    id: 'community',
    name: 'Community',
    icon: <Users size={22} color="#A855F7" />,
    subcategories: ['Lost & Found', 'Musicians', 'Pets', 'Politics', 'Religions', 'Reports/Scams', 'Rideshare', 'Activities', 'Discussions', 'Childcare', 'Healthcare', 'Pet Care', 'Classes/Workshops', 'General', 'Groups', 'Fitness & Gyms', 'Non Profits', 'Local News']
  },
];

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLocation, setSelectedLocation] = useState('Current Location');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{
    category: Category;
    subcategory: string;
  } | null>(null);
  const [adSearchQuery, setAdSearchQuery] = useState('');

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleSubcategoryPress = (category: Category, subcategory: string) => {
    setSelectedSubcategory({ category, subcategory });
    setAdSearchQuery('');
  };

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  const ads = useMemo(() => {
    if (!selectedSubcategory) return [];
    const allAds = generateMockAds(selectedSubcategory.category.id, selectedSubcategory.subcategory);
    
    const filtered = adSearchQuery
      ? allAds.filter(ad => 
          ad.title.toLowerCase().includes(adSearchQuery.toLowerCase()) ||
          ad.merchantName.toLowerCase().includes(adSearchQuery.toLowerCase())
        )
      : allAds;

    return filtered.sort((a, b) => {
      if (a.isBumped && !b.isBumped) return -1;
      if (!a.isBumped && b.isBumped) return 1;
      return b.postedAt.getTime() - a.postedAt.getTime();
    });
  }, [selectedSubcategory, adSearchQuery]);

  if (selectedSubcategory) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.adsHeader}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => setSelectedSubcategory(null)}
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.adsHeaderInfo}>
            <Text style={styles.adsHeaderTitle}>{selectedSubcategory.subcategory}</Text>
            <Text style={styles.adsHeaderSubtitle}>{selectedSubcategory.category.name}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.locationSelector}>
          <View style={styles.locationIcon}>
            <MapPin size={18} color={Colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Showing ads near</Text>
            <Text style={styles.locationValue}>{selectedLocation}</Text>
          </View>
          <ChevronDown size={18} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads..."
            placeholderTextColor={Colors.textTertiary}
            value={adSearchQuery}
            onChangeText={setAdSearchQuery}
          />
        </View>

        <View style={styles.adsInfoBar}>
          <Text style={styles.adsCount}>{ads.length} listings</Text>
          <View style={styles.sortInfo}>
            <Clock size={12} color={Colors.textTertiary} />
            <Text style={styles.sortText}>Sorted by time</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.adsScrollContent}>
          {ads.map((ad) => (
            <TouchableOpacity key={ad.id} style={[
              styles.adCard,
              ad.isBumped && styles.adCardBumped
            ]}>
              {ad.isBumped && (
                <View style={styles.bumpedBanner}>
                  <TrendingUp size={12} color="#FFF" />
                  <Text style={styles.bumpedText}>PRIORITY</Text>
                  <Flame size={12} color="#FFA500" />
                </View>
              )}
              <View style={styles.adContent}>
                <Image source={{ uri: ad.image }} style={styles.adImage} />
                <View style={styles.adInfo}>
                  <View style={styles.adTitleRow}>
                    <Text style={styles.adTitle} numberOfLines={1}>{ad.title}</Text>
                    <Text style={styles.adPrice}>{ad.price}</Text>
                  </View>
                  <Text style={styles.adDescription} numberOfLines={2}>{ad.description}</Text>
                  <View style={styles.adMerchantRow}>
                    <Text style={styles.adMerchantName}>{ad.merchantName}</Text>
                    {ad.verified && (
                      <BadgeCheck size={14} color={Colors.primary} />
                    )}
                  </View>
                  <View style={styles.adMetaRow}>
                    <View style={styles.adMetaItem}>
                      <MapPinIcon size={12} color={Colors.textTertiary} />
                      <Text style={styles.adMetaText}>{ad.location} • {ad.distance}</Text>
                    </View>
                    <View style={styles.adMetaItem}>
                      <Clock size={12} color={Colors.textTertiary} />
                      <Text style={styles.adMetaText}>{formatTimeAgo(ad.postedAt)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

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

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <QrCode size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn}>
            <ShoppingCart size={20} color={Colors.text} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.locationSelector}>
        <View style={styles.locationIcon}>
          <MapPin size={18} color={Colors.primary} />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Delivery to</Text>
          <Text style={styles.locationValue}>{selectedLocation}</Text>
        </View>
        <ChevronDown size={18} color={Colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories, merchants..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <TouchableOpacity 
              style={[
                styles.categoryHeader,
                category.id === 'merchant-directory' && styles.merchantDirectoryHeader
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={[
                styles.categoryIconBox,
                category.id === 'merchant-directory' && styles.merchantIconBox
              ]}>
                {category.icon}
              </View>
              <Text style={[
                styles.categoryName,
                category.id === 'merchant-directory' && styles.merchantDirectoryName
              ]}>
                {category.name}
              </Text>
              <View style={styles.categoryMeta}>
                <Text style={styles.subcategoryCount}>{category.subcategories.length}</Text>
                {expandedCategory === category.id ? (
                  <ChevronUp size={18} color={Colors.textSecondary} />
                ) : (
                  <ChevronRight size={18} color={Colors.textSecondary} />
                )}
              </View>
            </TouchableOpacity>
            
            {expandedCategory === category.id && (
              <View style={styles.subcategoriesContainer}>
                {category.subcategories.map((sub, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.subcategoryItem}
                    onPress={() => handleSubcategoryPress(category, sub)}
                  >
                    <Text style={styles.subcategoryText}>{sub}</Text>
                    <ChevronRight size={14} color={Colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

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
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  merchantDirectoryHeader: {
    backgroundColor: Colors.primary + '15',
  },
  categoryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantIconBox: {
    backgroundColor: Colors.primary + '25',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  merchantDirectoryName: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subcategoryCount: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  subcategoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 6,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginLeft: 56,
  },
  subcategoryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  adsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adsHeaderInfo: {
    flex: 1,
  },
  adsHeaderTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  adsHeaderSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  adsInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  adsCount: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  sortInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  adsScrollContent: {
    paddingHorizontal: 20,
  },
  adCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  adCardBumped: {
    borderWidth: 1,
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
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#FFF',
    letterSpacing: 1,
  },
  adContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
  },
  adInfo: {
    flex: 1,
  },
  adTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  adTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 8,
  },
  adPrice: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  adDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  adMerchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  adMerchantName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  adMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adMetaText: {
    fontSize: 11,
    color: Colors.textTertiary,
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
    color: Colors.textSecondary,
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
});
