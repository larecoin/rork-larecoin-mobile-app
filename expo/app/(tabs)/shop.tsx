import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, ShoppingCart, ChevronRight, MapPin, QrCode, ChevronDown, ChevronUp,
  Car, Briefcase, Home, MapPinned, Zap, Truck, Building2, Tag, Wrench, Globe,
  Users, Store, ArrowLeft, Clock, Flame, Star, BadgeCheck, TrendingUp, MapPinIcon,
  Navigation, Plus, X, CircleDot, Square, Shield, Sparkles, Timer, UserCheck, Locate, Package, Menu,
  Megaphone, PlusSquare
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import NavMenuModal from '@/components/NavMenuModal';

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

interface RideOption {
  id: string;
  name: string;
  provider: string;
  providerLogo: string;
  vehicleType: string;
  capacity: number;
  price: number;
  surge: number;
  eta: number;
  duration: number;
  distance: number;
  features: string[];
}

interface Location {
  address: string;
  lat?: number;
  lng?: number;
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
  const router = useRouter();
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
    if (subcategory === 'Rideshare') {
      setSelectedSubcategory({ category, subcategory });
      setAdSearchQuery('');
    } else {
      router.push({
        pathname: '/menu/subcategory-listings',
        params: {
          category: category.id,
          subcategory: subcategory,
          categoryName: category.name,
        },
      });
    }
  };

  const [pickupLocation, setPickupLocation] = useState<Location>({ address: '' });
  const [dropoffLocation, setDropoffLocation] = useState<Location>({ address: '' });
  const [stops, setStops] = useState<Location[]>([]);
  const [selectedRideType, setSelectedRideType] = useState<string>('economy');
  const [showRideOptions, setShowRideOptions] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
  const [showNavMenu, setShowNavMenu] = useState(false);

  const rideTypes = [
    { id: 'economy', name: 'Economy', icon: '🚗', description: 'Affordable everyday rides' },
    { id: 'comfort', name: 'Comfort', icon: '🚙', description: 'Newer cars, extra legroom' },
    { id: 'premium', name: 'Premium', icon: '🚘', description: 'Luxury vehicles' },
    { id: 'xl', name: 'XL', icon: '🚐', description: 'For groups up to 6' },
  ];

  const generateRideOptions = (): RideOption[] => {
    const basePrice = 12 + Math.random() * 8;
    const baseDuration = 15 + Math.floor(Math.random() * 20);
    const baseDistance = 3.5 + Math.random() * 5;
    
    return [
      {
        id: '1',
        name: 'UberX',
        provider: 'Uber',
        providerLogo: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=100',
        vehicleType: selectedRideType,
        capacity: selectedRideType === 'xl' ? 6 : 4,
        price: basePrice * (selectedRideType === 'premium' ? 1.8 : selectedRideType === 'comfort' ? 1.3 : selectedRideType === 'xl' ? 1.5 : 1),
        surge: Math.random() > 0.7 ? 1.2 + Math.random() * 0.5 : 1,
        eta: 3 + Math.floor(Math.random() * 5),
        duration: baseDuration,
        distance: baseDistance,
        features: ['Affordable', 'Quick pickup'],
      },
      {
        id: '2',
        name: 'Lyft',
        provider: 'Lyft',
        providerLogo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100',
        vehicleType: selectedRideType,
        capacity: selectedRideType === 'xl' ? 6 : 4,
        price: (basePrice * 0.95) * (selectedRideType === 'premium' ? 1.75 : selectedRideType === 'comfort' ? 1.25 : selectedRideType === 'xl' ? 1.45 : 1),
        surge: Math.random() > 0.7 ? 1.1 + Math.random() * 0.4 : 1,
        eta: 4 + Math.floor(Math.random() * 6),
        duration: baseDuration + Math.floor(Math.random() * 3),
        distance: baseDistance,
        features: ['Friendly drivers', 'Best price'],
      },
      {
        id: '3',
        name: 'UberX Share',
        provider: 'Uber',
        providerLogo: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=100',
        vehicleType: 'shared',
        capacity: 2,
        price: basePrice * 0.65,
        surge: 1,
        eta: 5 + Math.floor(Math.random() * 8),
        duration: baseDuration + 10 + Math.floor(Math.random() * 10),
        distance: baseDistance,
        features: ['Save money', 'Eco-friendly'],
      },
      {
        id: '4',
        name: 'Lyft Shared',
        provider: 'Lyft',
        providerLogo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=100',
        vehicleType: 'shared',
        capacity: 2,
        price: basePrice * 0.6,
        surge: 1,
        eta: 6 + Math.floor(Math.random() * 7),
        duration: baseDuration + 12 + Math.floor(Math.random() * 8),
        distance: baseDistance,
        features: ['Cheapest option', 'Meet new people'],
      },
    ];
  };

  const rideOptions = useMemo(() => {
    if (showRideOptions) {
      return generateRideOptions();
    }
    return [];
  }, [showRideOptions, selectedRideType]);

  const handleGetQuotes = () => {
    if (pickupLocation.address && dropoffLocation.address) {
      setShowRideOptions(true);
    }
  };

  const handleAddStop = () => {
    if (stops.length < 3) {
      setStops([...stops, { address: '' }]);
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleUpdateStop = (index: number, address: string) => {
    const newStops = [...stops];
    newStops[index] = { address };
    setStops(newStops);
  };

  const handleRequestRide = (ride: RideOption) => {
    setSelectedRide(ride);
    console.log('Requesting ride:', ride);
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

  if (selectedSubcategory?.subcategory === 'Rideshare') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.rideHeader}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => {
              setSelectedSubcategory(null);
              setShowRideOptions(false);
              setSelectedRide(null);
              setPickupLocation({ address: '' });
              setDropoffLocation({ address: '' });
              setStops([]);
            }}
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.rideHeaderInfo}>
            <Text style={styles.rideHeaderTitle}>Rideshare</Text>
            <Text style={styles.rideHeaderSubtitle}>Get a ride anywhere</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.rideScrollContent}>
          {/* Map Preview Area */}
          <View style={styles.mapPreview}>
            <View style={styles.mapPlaceholder}>
              <Navigation size={40} color={Colors.primary} />
              <Text style={styles.mapPlaceholderText}>Route will appear here</Text>
            </View>
            {pickupLocation.address && dropoffLocation.address && (
              <View style={styles.routeOverlay}>
                <View style={styles.routeInfo}>
                  <View style={styles.routePoint}>
                    <CircleDot size={14} color="#22C55E" />
                    <Text style={styles.routePointText} numberOfLines={1}>{pickupLocation.address}</Text>
                  </View>
                  {stops.map((stop, index) => (
                    <View key={index} style={styles.routePoint}>
                      <Square size={12} color="#F59E0B" />
                      <Text style={styles.routePointText} numberOfLines={1}>{stop.address || 'Stop ' + (index + 1)}</Text>
                    </View>
                  ))}
                  <View style={styles.routePoint}>
                    <MapPin size={14} color="#EF4444" />
                    <Text style={styles.routePointText} numberOfLines={1}>{dropoffLocation.address}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Location Inputs */}
          <View style={styles.locationInputsCard}>
            <View style={styles.locationInputRow}>
              <View style={styles.locationDotGreen} />
              <View style={styles.locationInputWrapper}>
                <Text style={styles.locationInputLabel}>Pickup</Text>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter pickup location"
                  placeholderTextColor={Colors.textTertiary}
                  value={pickupLocation.address}
                  onChangeText={(text) => setPickupLocation({ address: text })}
                />
              </View>
              <TouchableOpacity style={styles.locateBtn}>
                <Locate size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.locationDivider} />

            {stops.map((stop, index) => (
              <React.Fragment key={index}>
                <View style={styles.locationInputRow}>
                  <View style={styles.locationDotYellow} />
                  <View style={styles.locationInputWrapper}>
                    <Text style={styles.locationInputLabel}>Stop {index + 1}</Text>
                    <TextInput
                      style={styles.locationInput}
                      placeholder="Enter stop location"
                      placeholderTextColor={Colors.textTertiary}
                      value={stop.address}
                      onChangeText={(text) => handleUpdateStop(index, text)}
                    />
                  </View>
                  <TouchableOpacity 
                    style={styles.removeStopBtn}
                    onPress={() => handleRemoveStop(index)}
                  >
                    <X size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <View style={styles.locationDivider} />
              </React.Fragment>
            ))}

            <View style={styles.locationInputRow}>
              <View style={styles.locationDotRed} />
              <View style={styles.locationInputWrapper}>
                <Text style={styles.locationInputLabel}>Drop-off</Text>
                <TextInput
                  style={styles.locationInput}
                  placeholder="Enter destination"
                  placeholderTextColor={Colors.textTertiary}
                  value={dropoffLocation.address}
                  onChangeText={(text) => setDropoffLocation({ address: text })}
                />
              </View>
            </View>

            {stops.length < 3 && (
              <TouchableOpacity style={styles.addStopBtn} onPress={handleAddStop}>
                <Plus size={16} color={Colors.primary} />
                <Text style={styles.addStopText}>Add stop</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Ride Type Selector */}
          <Text style={styles.sectionTitle}>Select ride type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rideTypesScroll}
          >
            {rideTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.rideTypeCard,
                  selectedRideType === type.id && styles.rideTypeCardSelected
                ]}
                onPress={() => setSelectedRideType(type.id)}
              >
                <Text style={styles.rideTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.rideTypeName,
                  selectedRideType === type.id && styles.rideTypeNameSelected
                ]}>{type.name}</Text>
                <Text style={styles.rideTypeDesc}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Get Quote Button */}
          {!showRideOptions && (
            <TouchableOpacity 
              style={[
                styles.getQuoteBtn,
                (!pickupLocation.address || !dropoffLocation.address) && styles.getQuoteBtnDisabled
              ]}
              onPress={handleGetQuotes}
              disabled={!pickupLocation.address || !dropoffLocation.address}
            >
              <Search size={20} color="#FFF" />
              <Text style={styles.getQuoteBtnText}>Get Ride Quotes</Text>
            </TouchableOpacity>
          )}

          {/* Ride Options */}
          {showRideOptions && (
            <View style={styles.rideOptionsSection}>
              <View style={styles.rideOptionsHeader}>
                <Text style={styles.sectionTitle}>Available Rides</Text>
                <TouchableOpacity onPress={() => setShowRideOptions(false)}>
                  <Text style={styles.editRouteText}>Edit route</Text>
                </TouchableOpacity>
              </View>

              {rideOptions.sort((a, b) => a.price - b.price).map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  style={[
                    styles.rideOptionCard,
                    selectedRide?.id === ride.id && styles.rideOptionCardSelected
                  ]}
                  onPress={() => setSelectedRide(ride)}
                >
                  <View style={styles.rideOptionLeft}>
                    <View style={[
                      styles.providerBadge,
                      ride.provider === 'Uber' ? styles.uberBadge : styles.lyftBadge
                    ]}>
                      <Text style={styles.providerBadgeText}>{ride.provider}</Text>
                    </View>
                    <View style={styles.rideOptionInfo}>
                      <Text style={styles.rideOptionName}>{ride.name}</Text>
                      <View style={styles.rideOptionMeta}>
                        <Timer size={12} color={Colors.textTertiary} />
                        <Text style={styles.rideOptionMetaText}>{ride.eta} min away</Text>
                        <Text style={styles.rideOptionDot}>•</Text>
                        <UserCheck size={12} color={Colors.textTertiary} />
                        <Text style={styles.rideOptionMetaText}>{ride.capacity} seats</Text>
                      </View>
                      <View style={styles.rideFeatures}>
                        {ride.features.map((feature, i) => (
                          <View key={i} style={styles.featureTag}>
                            <Text style={styles.featureTagText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  <View style={styles.rideOptionRight}>
                    {ride.surge > 1 && (
                      <View style={styles.surgeBadge}>
                        <Sparkles size={10} color="#FFF" />
                        <Text style={styles.surgeBadgeText}>{ride.surge.toFixed(1)}x</Text>
                      </View>
                    )}
                    <Text style={styles.ridePrice}>${(ride.price * ride.surge).toFixed(2)}</Text>
                    <Text style={styles.rideDuration}>{ride.duration} min trip</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {selectedRide && (
                <View style={styles.bookingSection}>
                  <View style={styles.bookingSummary}>
                    <View style={styles.bookingDetail}>
                      <Text style={styles.bookingLabel}>Provider</Text>
                      <Text style={styles.bookingValue}>{selectedRide.provider} - {selectedRide.name}</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Text style={styles.bookingLabel}>Est. Arrival</Text>
                      <Text style={styles.bookingValue}>{selectedRide.eta} min</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Text style={styles.bookingLabel}>Trip Duration</Text>
                      <Text style={styles.bookingValue}>{selectedRide.duration} min ({selectedRide.distance.toFixed(1)} mi)</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Text style={styles.bookingLabel}>Total Fare</Text>
                      <Text style={styles.bookingValuePrice}>${(selectedRide.price * selectedRide.surge).toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.requestRideBtn}
                    onPress={() => handleRequestRide(selectedRide)}
                  >
                    <Car size={20} color="#FFF" />
                    <Text style={styles.requestRideBtnText}>Request {selectedRide.name}</Text>
                  </TouchableOpacity>

                  <View style={styles.safetyNote}>
                    <Shield size={14} color={Colors.textSecondary} />
                    <Text style={styles.safetyNoteText}>Your safety is our priority. All drivers are verified.</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowNavMenu(true)}
        >
          <Menu size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/menu/my-ads')}>
            <Megaphone size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/menu/post-ad')}>
            <PlusSquare size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/menu/my-orders')}>
            <Package size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/menu/scan-qr')}>
            <QrCode size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/menu/cart')}>
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

      <NavMenuModal visible={showNavMenu} onClose={() => setShowNavMenu(false)} />
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
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Rideshare styles
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  rideHeaderInfo: {
    flex: 1,
  },
  rideHeaderTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  rideHeaderSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rideScrollContent: {
    paddingHorizontal: 20,
  },
  mapPreview: {
    height: 180,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2a3a',
  },
  mapPlaceholderText: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  routeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  routeInfo: {
    gap: 6,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routePointText: {
    fontSize: 12,
    color: '#FFF',
    flex: 1,
  },
  locationInputsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },
  locationDotYellow: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#F59E0B',
  },
  locationDotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  locationInputWrapper: {
    flex: 1,
  },
  locationInputLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginBottom: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  locationInput: {
    fontSize: 15,
    color: Colors.text,
    padding: 0,
    paddingVertical: 4,
  },
  locateBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeStopBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
    marginLeft: 24,
  },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderStyle: 'dashed',
  },
  addStopText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  rideTypesScroll: {
    paddingBottom: 16,
    gap: 10,
  },
  rideTypeCard: {
    width: 110,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rideTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  rideTypeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  rideTypeName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  rideTypeNameSelected: {
    color: Colors.primary,
  },
  rideTypeDesc: {
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
  },
  getQuoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 8,
  },
  getQuoteBtnDisabled: {
    backgroundColor: Colors.textTertiary,
    opacity: 0.5,
  },
  getQuoteBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  rideOptionsSection: {
    marginTop: 8,
  },
  rideOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editRouteText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  rideOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rideOptionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  rideOptionLeft: {
    flex: 1,
    gap: 8,
  },
  providerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  uberBadge: {
    backgroundColor: '#000',
  },
  lyftBadge: {
    backgroundColor: '#FF00BF',
  },
  providerBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  rideOptionInfo: {
    gap: 4,
  },
  rideOptionName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  rideOptionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rideOptionMetaText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  rideOptionDot: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginHorizontal: 2,
  },
  rideFeatures: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  featureTag: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featureTagText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  rideOptionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  surgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  surgeBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  ridePrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  rideDuration: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  bookingSection: {
    marginTop: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  bookingSummary: {
    gap: 10,
    marginBottom: 16,
  },
  bookingDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bookingValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bookingValuePrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  requestRideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#22C55E',
    borderRadius: 14,
    paddingVertical: 16,
  },
  requestRideBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  safetyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  safetyNoteText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
