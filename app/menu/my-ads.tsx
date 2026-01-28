import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Eye, MessageCircle, DollarSign, Plus, Pause, Play, 
  Trash2, Edit3, Clock, X, Package, Tag, MapPin,
  TrendingUp, Flame, MoreVertical, Search, Filter, CheckCircle,
  AlertCircle, RefreshCw, Share2, Copy, Heart
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  status: 'active' | 'paused' | 'sold' | 'expired' | 'pending';
  views: number;
  inquiries: number;
  favorites: number;
  category: string;
  subcategory: string;
  condition: string;
  location: string;
  images: string[];
  createdAt: Date;
  expiresAt: Date;
  isBumped: boolean;
  bumpedUntil?: Date;
}

const mockListings: Listing[] = [
  { 
    id: '1', 
    title: 'iPhone 14 Pro Max - Like New', 
    description: 'Barely used, comes with original box and accessories. No scratches.',
    price: 899,
    originalPrice: 1099,
    status: 'active', 
    views: 342, 
    inquiries: 12, 
    favorites: 28,
    category: 'Electronics',
    subcategory: 'Cell Phones',
    condition: 'Like New',
    location: 'Downtown',
    images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 27),
    isBumped: true,
    bumpedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  { 
    id: '2', 
    title: 'Professional Web Development Services', 
    description: 'Full-stack developer offering website and app development.',
    price: 50,
    status: 'active', 
    views: 156, 
    inquiries: 8, 
    favorites: 15,
    category: 'Services',
    subcategory: 'Computer',
    condition: 'Service',
    location: 'Remote',
    images: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23),
    isBumped: false,
  },
  { 
    id: '3', 
    title: 'Vintage Leather Sofa', 
    description: 'Beautiful mid-century modern leather sofa in excellent condition.',
    price: 450,
    status: 'paused', 
    views: 89, 
    inquiries: 3, 
    favorites: 12,
    category: 'For Sale',
    subcategory: 'Furniture',
    condition: 'Good',
    location: 'Westside',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16),
    isBumped: false,
  },
  { 
    id: '4', 
    title: 'Mountain Bike - Trek', 
    description: '2022 Trek mountain bike, excellent for trails.',
    price: 650,
    status: 'sold', 
    views: 523, 
    inquiries: 24, 
    favorites: 45,
    category: 'For Sale',
    subcategory: 'Bicycles',
    condition: 'Excellent',
    location: 'Northside',
    images: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    isBumped: false,
  },
  { 
    id: '5', 
    title: 'Private Guitar Lessons', 
    description: 'Learn guitar from experienced instructor. All levels welcome.',
    price: 40,
    status: 'active', 
    views: 78, 
    inquiries: 5, 
    favorites: 8,
    category: 'Services',
    subcategory: 'Creative',
    condition: 'Service',
    location: 'Midtown',
    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    isBumped: false,
  },
];

export default function MyAdsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBumpModal, setShowBumpModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalInquiries = listings.reduce((sum, l) => sum + l.inquiries, 0);
  const activeListings = listings.filter(l => l.status === 'active').length;
  const soldListings = listings.filter(l => l.status === 'sold').length;

  const filteredListings = listings.filter(l => {
    const matchesStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleListingStatus = (listingId: string) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId && l.status !== 'sold' && l.status !== 'expired') {
        const newStatus = l.status === 'active' ? 'paused' : 'active';
        return { ...l, status: newStatus };
      }
      return l;
    }));
  };

  const deleteListing = (listingId: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setListings(prev => prev.filter(l => l.id !== listingId));
            setShowDetailsModal(false);
          }
        }
      ]
    );
  };

  const markAsSold = (listingId: string) => {
    Alert.alert(
      'Mark as Sold',
      'Mark this listing as sold?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Sold', 
          onPress: () => {
            setListings(prev => prev.map(l => 
              l.id === listingId ? { ...l, status: 'sold' as const } : l
            ));
            setShowDetailsModal(false);
          }
        }
      ]
    );
  };

  const bumpListing = (listingId: string, days: number) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return { 
          ...l, 
          isBumped: true, 
          bumpedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * days)
        };
      }
      return l;
    }));
    setShowBumpModal(false);
    Alert.alert('Success', `Your listing has been bumped for ${days} day${days > 1 ? 's' : ''}!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'paused': return colors.warning;
      case 'sold': return '#8B5CF6';
      case 'expired': return colors.textTertiary;
      case 'pending': return colors.primary;
      default: return colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={12} color={getStatusColor(status)} />;
      case 'paused': return <Pause size={12} color={getStatusColor(status)} />;
      case 'sold': return <DollarSign size={12} color={getStatusColor(status)} />;
      case 'expired': return <AlertCircle size={12} color={getStatusColor(status)} />;
      case 'pending': return <Clock size={12} color={getStatusColor(status)} />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const daysRemaining = (date: Date) => {
    const diff = date.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const renderBumpModal = () => (
    <Modal
      visible={showBumpModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowBumpModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Bump Listing</Text>
          <TouchableOpacity onPress={() => setShowBumpModal(false)}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.bumpContent}>
          <View style={[styles.bumpHero, { backgroundColor: '#FF6B00' + '15' }]}>
            <Flame size={40} color="#FF6B00" />
            <Text style={[styles.bumpHeroTitle, { color: colors.text }]}>Get More Visibility</Text>
            <Text style={[styles.bumpHeroText, { color: colors.textSecondary }]}>
              Bumped listings appear at the top of search results and get up to 5x more views!
            </Text>
          </View>

          <Text style={[styles.bumpSectionTitle, { color: colors.text }]}>Select Duration</Text>

          {[
            { days: 1, price: 2.99, label: '24 Hours', popular: false },
            { days: 3, price: 6.99, label: '3 Days', popular: true },
            { days: 7, price: 12.99, label: '7 Days', popular: false },
            { days: 14, price: 19.99, label: '14 Days', popular: false },
          ].map((option) => (
            <TouchableOpacity
              key={option.days}
              style={[
                styles.bumpOption,
                { backgroundColor: colors.surface },
                option.popular && { borderColor: '#FF6B00', borderWidth: 2 }
              ]}
              onPress={() => selectedListing && bumpListing(selectedListing.id, option.days)}
            >
              {option.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
              )}
              <View style={styles.bumpOptionLeft}>
                <Text style={[styles.bumpOptionDays, { color: colors.text }]}>{option.label}</Text>
                <Text style={[styles.bumpOptionDesc, { color: colors.textSecondary }]}>
                  ~{option.days * 50} extra views
                </Text>
              </View>
              <Text style={[styles.bumpOptionPrice, { color: '#FF6B00' }]}>${option.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderDetailsModal = () => {
    if (!selectedListing) return null;

    return (
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Listing Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image 
              source={{ uri: selectedListing.images[0] }} 
              style={styles.detailImage}
            />

            <View style={styles.detailContent}>
              <View style={styles.detailHeaderRow}>
                <View style={[
                  styles.statusBadgeLarge,
                  { backgroundColor: getStatusColor(selectedListing.status) + '20' }
                ]}>
                  {getStatusIcon(selectedListing.status)}
                  <Text style={[styles.statusTextLarge, { color: getStatusColor(selectedListing.status) }]}>
                    {selectedListing.status.toUpperCase()}
                  </Text>
                </View>
                {selectedListing.isBumped && (
                  <View style={styles.bumpedBadge}>
                    <Flame size={12} color="#FFF" />
                    <Text style={styles.bumpedBadgeText}>BUMPED</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.detailTitle, { color: colors.text }]}>{selectedListing.title}</Text>
              <Text style={[styles.detailPrice, { color: colors.primary }]}>
                ${selectedListing.price}
                {selectedListing.condition === 'Service' && <Text style={styles.perHour}>/hr</Text>}
              </Text>
              <Text style={[styles.detailDesc, { color: colors.textSecondary }]}>
                {selectedListing.description}
              </Text>

              <View style={styles.detailMeta}>
                <View style={styles.detailMetaItem}>
                  <Tag size={14} color={colors.textTertiary} />
                  <Text style={[styles.detailMetaText, { color: colors.textSecondary }]}>
                    {selectedListing.category} • {selectedListing.subcategory}
                  </Text>
                </View>
                <View style={styles.detailMetaItem}>
                  <MapPin size={14} color={colors.textTertiary} />
                  <Text style={[styles.detailMetaText, { color: colors.textSecondary }]}>
                    {selectedListing.location}
                  </Text>
                </View>
                <View style={styles.detailMetaItem}>
                  <Package size={14} color={colors.textTertiary} />
                  <Text style={[styles.detailMetaText, { color: colors.textSecondary }]}>
                    {selectedListing.condition}
                  </Text>
                </View>
              </View>

              <View style={styles.detailStatsGrid}>
                <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                  <Eye size={20} color={colors.primary} />
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>
                    {selectedListing.views}
                  </Text>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Views</Text>
                </View>
                <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                  <MessageCircle size={20} color={colors.success} />
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>
                    {selectedListing.inquiries}
                  </Text>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Inquiries</Text>
                </View>
                <View style={[styles.detailStatCard, { backgroundColor: colors.surface }]}>
                  <Heart size={20} color="#EC4899" />
                  <Text style={[styles.detailStatValue, { color: colors.text }]}>
                    {selectedListing.favorites}
                  </Text>
                  <Text style={[styles.detailStatLabel, { color: colors.textTertiary }]}>Favorites</Text>
                </View>
              </View>

              {selectedListing.status !== 'sold' && selectedListing.status !== 'expired' && (
                <View style={[styles.expiryCard, { backgroundColor: colors.surface }]}>
                  <Clock size={18} color={colors.textSecondary} />
                  <View style={styles.expiryInfo}>
                    <Text style={[styles.expiryLabel, { color: colors.textSecondary }]}>Expires in</Text>
                    <Text style={[styles.expiryValue, { color: colors.text }]}>
                      {daysRemaining(selectedListing.expiresAt)} days
                    </Text>
                  </View>
                  <TouchableOpacity style={[styles.renewBtn, { backgroundColor: colors.primary + '20' }]}>
                    <RefreshCw size={14} color={colors.primary} />
                    <Text style={[styles.renewBtnText, { color: colors.primary }]}>Renew</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.actionButtons}>
                {selectedListing.status !== 'sold' && selectedListing.status !== 'expired' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                      onPress={() => toggleListingStatus(selectedListing.id)}
                    >
                      {selectedListing.status === 'active' ? (
                        <>
                          <Pause size={18} color={colors.warning} />
                          <Text style={[styles.actionBtnText, { color: colors.text }]}>Pause</Text>
                        </>
                      ) : (
                        <>
                          <Play size={18} color={colors.success} />
                          <Text style={[styles.actionBtnText, { color: colors.text }]}>Activate</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                      onPress={() => router.push('/menu/post-ad')}
                    >
                      <Edit3 size={18} color={colors.primary} />
                      <Text style={[styles.actionBtnText, { color: colors.text }]}>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity 
                  style={[styles.actionBtn, { backgroundColor: colors.surface }]}
                >
                  <Share2 size={18} color={colors.textSecondary} />
                  <Text style={[styles.actionBtnText, { color: colors.text }]}>Share</Text>
                </TouchableOpacity>
              </View>

              {selectedListing.status === 'active' && (
                <>
                  <TouchableOpacity 
                    style={[styles.bumpBtn, { backgroundColor: '#FF6B00' }]}
                    onPress={() => {
                      setShowDetailsModal(false);
                      setTimeout(() => setShowBumpModal(true), 300);
                    }}
                  >
                    <Flame size={20} color="#FFF" />
                    <Text style={styles.bumpBtnText}>Bump to Top</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.soldBtn, { backgroundColor: '#8B5CF6' }]}
                    onPress={() => markAsSold(selectedListing.id)}
                  >
                    <CheckCircle size={20} color="#FFF" />
                    <Text style={styles.soldBtnText}>Mark as Sold</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity 
                style={[styles.deleteBtn, { backgroundColor: colors.error + '15' }]}
                onPress={() => deleteListing(selectedListing.id)}
              >
                <Trash2 size={18} color={colors.error} />
                <Text style={[styles.deleteBtnText, { color: colors.error }]}>Delete Listing</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Listings' }} />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Package size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{activeListings}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Eye size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{totalViews}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Views</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MessageCircle size={20} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>{totalInquiries}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Inquiries</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <DollarSign size={20} color="#8B5CF6" />
            <Text style={[styles.statValue, { color: colors.text }]}>{soldListings}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Sold</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.newListingBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/menu/post-ad')}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.newListingText}>Post New Listing</Text>
        </TouchableOpacity>

        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search your listings..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterTabs}
        >
          {['all', 'active', 'paused', 'sold', 'expired'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                { backgroundColor: filterStatus === status ? colors.primary : colors.surface }
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.filterTabText,
                { color: filterStatus === status ? '#FFF' : colors.textSecondary }
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listingsSection}>
          {filteredListings.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Package size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No listings found</Text>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                {filterStatus === 'all' 
                  ? 'Create your first listing to start selling'
                  : `No ${filterStatus} listings`}
              </Text>
            </View>
          ) : (
            filteredListings.map((listing) => (
              <TouchableOpacity
                key={listing.id}
                style={[styles.listingCard, { backgroundColor: colors.surface }]}
                onPress={() => {
                  setSelectedListing(listing);
                  setShowDetailsModal(true);
                }}
              >
                {listing.isBumped && (
                  <View style={styles.bumpedBanner}>
                    <Flame size={12} color="#FFF" />
                    <Text style={styles.bumpedBannerText}>BUMPED</Text>
                  </View>
                )}
                <View style={styles.listingContent}>
                  <Image source={{ uri: listing.images[0] }} style={styles.listingImage} />
                  <View style={styles.listingInfo}>
                    <View style={styles.listingHeader}>
                      <Text style={[styles.listingTitle, { color: colors.text }]} numberOfLines={1}>
                        {listing.title}
                      </Text>
                      <TouchableOpacity>
                        <MoreVertical size={18} color={colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.listingPrice, { color: colors.primary }]}>
                      ${listing.price}
                      {listing.condition === 'Service' && '/hr'}
                    </Text>
                    <View style={styles.listingMeta}>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(listing.status) + '20' }
                      ]}>
                        {getStatusIcon(listing.status)}
                        <Text style={[styles.statusText, { color: getStatusColor(listing.status) }]}>
                          {listing.status}
                        </Text>
                      </View>
                      <Text style={[styles.listingDate, { color: colors.textTertiary }]}>
                        {formatDate(listing.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.listingStats}>
                      <View style={styles.listingStat}>
                        <Eye size={12} color={colors.textTertiary} />
                        <Text style={[styles.listingStatText, { color: colors.textTertiary }]}>
                          {listing.views}
                        </Text>
                      </View>
                      <View style={styles.listingStat}>
                        <MessageCircle size={12} color={colors.textTertiary} />
                        <Text style={[styles.listingStatText, { color: colors.textTertiary }]}>
                          {listing.inquiries}
                        </Text>
                      </View>
                      <View style={styles.listingStat}>
                        <Heart size={12} color={colors.textTertiary} />
                        <Text style={[styles.listingStatText, { color: colors.textTertiary }]}>
                          {listing.favorites}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {renderDetailsModal()}
      {renderBumpModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 8 },
  statCard: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' as const, marginTop: 6 },
  statLabel: { fontSize: 10, marginTop: 2 },
  newListingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, gap: 8 },
  newListingText: { color: '#FFF', fontSize: 15, fontWeight: '600' as const },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  filterScroll: { marginTop: 12 },
  filterTabs: { paddingHorizontal: 16, gap: 8 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterTabText: { fontSize: 13, fontWeight: '600' as const },
  listingsSection: { paddingHorizontal: 16, marginTop: 16 },
  listingCard: { borderRadius: 14, marginBottom: 12, overflow: 'hidden' },
  bumpedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF6B00', paddingVertical: 4, gap: 4 },
  bumpedBannerText: { fontSize: 10, fontWeight: '800' as const, color: '#FFF', letterSpacing: 1 },
  listingContent: { flexDirection: 'row', padding: 12, gap: 12 },
  listingImage: { width: 80, height: 80, borderRadius: 10 },
  listingInfo: { flex: 1 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  listingTitle: { flex: 1, fontSize: 14, fontWeight: '600' as const, marginRight: 8 },
  listingPrice: { fontSize: 16, fontWeight: '700' as const, marginTop: 2 },
  listingMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  listingDate: { fontSize: 11 },
  listingStats: { flexDirection: 'row', marginTop: 8, gap: 12 },
  listingStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listingStatText: { fontSize: 11 },
  emptyState: { padding: 40, borderRadius: 16, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600' as const, marginTop: 16 },
  emptyText: { fontSize: 14, textAlign: 'center' as const, marginTop: 8 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' as const },
  detailImage: { width: '100%', height: 250 },
  detailContent: { padding: 16 },
  detailHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  statusBadgeLarge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  statusTextLarge: { fontSize: 12, fontWeight: '700' as const },
  bumpedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B00', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  bumpedBadgeText: { fontSize: 10, fontWeight: '800' as const, color: '#FFF' },
  detailTitle: { fontSize: 22, fontWeight: '700' as const, marginBottom: 4 },
  detailPrice: { fontSize: 24, fontWeight: '700' as const, marginBottom: 8 },
  perHour: { fontSize: 14, fontWeight: '500' as const },
  detailDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  detailMeta: { gap: 8, marginBottom: 20 },
  detailMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailMetaText: { fontSize: 13 },
  detailStatsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  detailStatCard: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  detailStatValue: { fontSize: 20, fontWeight: '700' as const, marginTop: 6 },
  detailStatLabel: { fontSize: 11, marginTop: 2 },
  expiryCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 16, gap: 12 },
  expiryInfo: { flex: 1 },
  expiryLabel: { fontSize: 11 },
  expiryValue: { fontSize: 16, fontWeight: '600' as const },
  renewBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 6 },
  renewBtnText: { fontSize: 13, fontWeight: '600' as const },
  actionButtons: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 6 },
  actionBtnText: { fontSize: 13, fontWeight: '600' as const },
  bumpBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginBottom: 10 },
  bumpBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  soldBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, gap: 8, marginBottom: 10 },
  soldBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  deleteBtnText: { fontSize: 14, fontWeight: '600' as const },
  bumpContent: { flex: 1, padding: 16 },
  bumpHero: { padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 24 },
  bumpHeroTitle: { fontSize: 20, fontWeight: '700' as const, marginTop: 12, marginBottom: 8 },
  bumpHeroText: { fontSize: 14, textAlign: 'center' as const, lineHeight: 20 },
  bumpSectionTitle: { fontSize: 16, fontWeight: '700' as const, marginBottom: 12 },
  bumpOption: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 10, position: 'relative' },
  popularBadge: { position: 'absolute', top: -8, right: 12, backgroundColor: '#FF6B00', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  popularBadgeText: { fontSize: 9, fontWeight: '800' as const, color: '#FFF', letterSpacing: 0.5 },
  bumpOptionLeft: { flex: 1 },
  bumpOptionDays: { fontSize: 16, fontWeight: '600' as const },
  bumpOptionDesc: { fontSize: 12, marginTop: 2 },
  bumpOptionPrice: { fontSize: 18, fontWeight: '700' as const },
});
