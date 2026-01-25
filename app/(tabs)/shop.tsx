import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, ShoppingCart, ChevronRight, MapPin, ScanLine, ChevronDown, ChevronUp,
  Car, Briefcase, Home, MapPinned, Zap, Truck, Building2, Tag, Wrench, Globe,
  Users, Store
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

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

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <ScanLine size={20} color={Colors.text} />
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
                  <TouchableOpacity key={index} style={styles.subcategoryItem}>
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
});
