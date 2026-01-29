import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Store, QrCode, Package, Edit2, Eye, Share2, Settings, 
  Heart, ChevronRight, Plus, Check, X, Globe, MapPin, Copy, Link,
  CreditCard, Wallet, Clock, Building2, Users, Bitcoin, Fingerprint,
  ChevronDown, ChevronUp, DollarSign, Smartphone, Receipt, Menu, RefreshCw,
  Star, UserCircle, Navigation, Trash2, Phone, Mail, ShoppingCart,
  Layers, Cable, Map, Zap, Lock, Unlock, TrendingUp
} from 'lucide-react-native';
import ModeToggle from '@/components/ModeToggle';
import MerchantNavMenuModal from '@/components/MerchantNavMenuModal';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useApp, MerchantType } from '@/contexts/AppContext';

interface Charity {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  fee: string;
}

interface PaymentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  methods: PaymentMethod[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  avatar?: string;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  productName?: string;
  replied: boolean;
}

interface ShopLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  isActive: boolean;
  orders: number;
  revenue: number;
}

interface MetaverseLand {
  id: string;
  name: string;
  zone: string;
  size: string;
  price: number;
  features: string[];
  image: string;
  available: boolean;
  type: '2D' | '3D' | 'VR' | 'AR';
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Smith', email: 'john@email.com', phone: '+1 555-0101', totalOrders: 12, totalSpent: 1240.50, lastOrder: '2 days ago' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 555-0102', totalOrders: 8, totalSpent: 890.25, lastOrder: '1 week ago' },
  { id: '3', name: 'Mike Williams', email: 'mike@email.com', phone: '+1 555-0103', totalOrders: 5, totalSpent: 456.00, lastOrder: '3 days ago' },
  { id: '4', name: 'Emily Brown', email: 'emily@email.com', phone: '+1 555-0104', totalOrders: 15, totalSpent: 2100.75, lastOrder: 'Today' },
  { id: '5', name: 'David Lee', email: 'david@email.com', phone: '+1 555-0105', totalOrders: 3, totalSpent: 245.00, lastOrder: '5 days ago' },
];

const mockReviews: Review[] = [
  { id: '1', customerName: 'John S.', rating: 5, comment: 'Excellent products and fast shipping! Will definitely order again.', date: '2 days ago', productName: 'Premium Widget', replied: true },
  { id: '2', customerName: 'Sarah J.', rating: 4, comment: 'Good quality, but delivery took a bit longer than expected.', date: '1 week ago', productName: 'Basic Kit', replied: false },
  { id: '3', customerName: 'Mike W.', rating: 5, comment: 'Amazing customer service! They resolved my issue quickly.', date: '3 days ago', replied: true },
  { id: '4', customerName: 'Emily B.', rating: 3, comment: 'Product was okay, but packaging could be better.', date: '5 days ago', productName: 'Starter Pack', replied: false },
  { id: '5', customerName: 'David L.', rating: 5, comment: 'Best shop in the area! Highly recommend.', date: '1 day ago', replied: false },
];

const mockLocations: ShopLocation[] = [
  { id: '1', name: 'Main Store', address: '123 Main Street', city: 'New York, NY', isActive: true, orders: 45, revenue: 12500 },
  { id: '2', name: 'Downtown Branch', address: '456 Commerce Ave', city: 'New York, NY', isActive: true, orders: 32, revenue: 8900 },
  { id: '3', name: 'Mall Kiosk', address: 'Westfield Mall, Level 2', city: 'Brooklyn, NY', isActive: false, orders: 12, revenue: 3200 },
];

const metaverseLands: MetaverseLand[] = [
  { id: '1', name: 'Prime Plaza Lot', zone: 'Central District', size: '10x10m', price: 2500, features: ['High Traffic', 'Billboard Rights', 'Event Space'], image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400', available: true, type: 'VR' },
  { id: '2', name: 'Neon Street Corner', zone: 'Entertainment Hub', size: '15x15m', price: 4500, features: ['AR Portal', 'Music Venue', 'NFT Gallery'], image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', available: true, type: 'AR' },
  { id: '3', name: 'Skyline Tower Base', zone: 'Business Park', size: '20x20m', price: 8000, features: ['3D Storefront', 'Meeting Rooms', 'Premium Visibility'], image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400', available: true, type: '3D' },
  { id: '4', name: 'Pixel Garden Plot', zone: 'Creative Quarter', size: '8x8m', price: 1200, features: ['2D Shop Display', 'Social Hub', 'Art Wall'], image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400', available: true, type: '2D' },
  { id: '5', name: 'VR Mall Suite', zone: 'Shopping Complex', size: '12x12m', price: 5500, features: ['Virtual Try-On', 'Interactive Demo', '360° View'], image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400', available: false, type: 'VR' },
];

const charities: Charity[] = [
  { id: '1', name: 'Red Cross', category: 'Humanitarian', description: 'Disaster relief and emergency assistance' },
  { id: '2', name: 'UNICEF', category: 'Children', description: 'Supporting children worldwide' },
  { id: '3', name: 'WWF', category: 'Environment', description: 'Wildlife conservation and environmental protection' },
  { id: '4', name: 'Doctors Without Borders', category: 'Health', description: 'Medical humanitarian aid' },
  { id: '5', name: 'Local Food Bank', category: 'Community', description: 'Fighting hunger in local communities' },
];

const paymentCategories: PaymentCategory[] = [
  {
    id: 'cards',
    name: 'Card-Based Payments',
    icon: <CreditCard size={20} color="#3498DB" />,
    color: '#3498DB',
    description: 'Credit, debit & prepaid cards',
    methods: [
      { id: 'visa', name: 'Visa', fee: '2.9%' },
      { id: 'mastercard', name: 'Mastercard', fee: '2.9%' },
      { id: 'amex', name: 'American Express', fee: '3.5%' },
      { id: 'discover', name: 'Discover', fee: '2.9%' },
      { id: 'diners', name: 'Diners Club', fee: '3.0%' },
      { id: 'jcb', name: 'JCB', fee: '3.0%' },
      { id: 'unionpay', name: 'UnionPay', fee: '2.8%' },
      { id: 'visa-debit', name: 'Visa Debit', fee: '1.9%' },
      { id: 'mc-debit', name: 'Mastercard Debit', fee: '1.9%' },
      { id: 'prepaid', name: 'Prepaid Cards', fee: '2.5%' },
      { id: 'gift-cards', name: 'Gift Cards', fee: '2.0%' },
    ],
  },
  {
    id: 'digital-wallets',
    name: 'Digital Wallets & Mobile',
    icon: <Smartphone size={20} color="#9B59B6" />,
    color: '#9B59B6',
    description: 'Apple Pay, Google Pay & more',
    methods: [
      { id: 'apple-pay', name: 'Apple Pay', fee: '2.5%' },
      { id: 'google-pay', name: 'Google Pay', fee: '2.5%' },
      { id: 'samsung-pay', name: 'Samsung Pay', fee: '2.5%' },
      { id: 'paypal', name: 'PayPal', fee: '3.49%' },
      { id: 'venmo', name: 'Venmo', fee: '3.0%' },
      { id: 'cash-app', name: 'Cash App', fee: '2.75%' },
      { id: 'alipay', name: 'Alipay', fee: '2.2%' },
      { id: 'wechat-pay', name: 'WeChat Pay', fee: '2.2%' },
      { id: 'amazon-pay', name: 'Amazon Pay', fee: '2.9%' },
      { id: 'grabpay', name: 'GrabPay', fee: '2.3%' },
      { id: 'phonepe', name: 'PhonePe', fee: '1.5%' },
      { id: 'paytm', name: 'Paytm', fee: '1.5%' },
      { id: 'mercado-pago', name: 'Mercado Pago', fee: '2.5%' },
    ],
  },
  {
    id: 'bnpl',
    name: 'Buy Now, Pay Later',
    icon: <Clock size={20} color="#E67E22" />,
    color: '#E67E22',
    description: 'Affirm, Klarna, Afterpay',
    methods: [
      { id: 'affirm', name: 'Affirm', fee: '5.99%' },
      { id: 'afterpay', name: 'Afterpay / Clearpay', fee: '6.0%' },
      { id: 'klarna', name: 'Klarna', fee: '5.99%' },
      { id: 'paypal-pay4', name: 'PayPal Pay in 4', fee: '4.5%' },
      { id: 'sezzle', name: 'Sezzle', fee: '6.0%' },
      { id: 'zip', name: 'Zip (Quadpay)', fee: '6.0%' },
    ],
  },
  {
    id: 'bank-transfers',
    name: 'Bank Transfers & Real-Time',
    icon: <Building2 size={20} color="#27AE60" />,
    color: '#27AE60',
    description: 'ACH, Wire, SEPA & instant payments',
    methods: [
      { id: 'ach', name: 'ACH Transfer (U.S.)', fee: '0.8%' },
      { id: 'wire', name: 'Wire Transfer', fee: '$25 flat' },
      { id: 'sepa', name: 'SEPA Transfer (EU)', fee: '0.5%' },
      { id: 'faster-uk', name: 'Faster Payments (UK)', fee: '0.5%' },
      { id: 'fednow', name: 'FedNow (U.S.)', fee: '0.5%' },
      { id: 'rtp', name: 'RTP Network', fee: '0.5%' },
      { id: 'pix', name: 'Pix (Brazil)', fee: '0.5%' },
      { id: 'upi', name: 'UPI (India)', fee: '0.3%' },
      { id: 'promptpay', name: 'PromptPay (Thailand)', fee: '0.4%' },
      { id: 'open-banking', name: 'Open Banking (A2A)', fee: '0.6%' },
    ],
  },
  {
    id: 'p2p',
    name: 'P2P & Mobile Money',
    icon: <Users size={20} color="#1ABC9C" />,
    color: '#1ABC9C',
    description: 'Zelle, M-Pesa & regional services',
    methods: [
      { id: 'zelle', name: 'Zelle', fee: '0.5%' },
      { id: 'mpesa', name: 'M-Pesa (Africa)', fee: '1.5%' },
      { id: 'gcash', name: 'GCash (Philippines)', fee: '1.5%' },
      { id: 'dana', name: 'Dana (Indonesia)', fee: '1.5%' },
      { id: 'ovo', name: 'OVO (Indonesia)', fee: '1.5%' },
    ],
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency & Blockchain',
    icon: <Bitcoin size={20} color="#F39C12" />,
    color: '#F39C12',
    description: 'BTC, ETH, Stablecoins & more',
    methods: [
      { id: 'btc', name: 'Bitcoin (BTC)', fee: '1.0%' },
      { id: 'eth', name: 'Ethereum (ETH)', fee: '1.0%' },
      { id: 'usdt', name: 'USDT (Tether)', fee: '0.5%' },
      { id: 'usdc', name: 'USDC', fee: '0.5%' },
      { id: 'dai', name: 'DAI', fee: '0.5%' },
      { id: 'sol', name: 'Solana (SOL)', fee: '1.0%' },
      { id: 'bnb', name: 'BNB', fee: '1.0%' },
      { id: 'bitpay', name: 'BitPay Gateway', fee: '1.0%' },
      { id: 'coinbase-commerce', name: 'Coinbase Commerce', fee: '1.0%' },
      { id: 'nowpayments', name: 'NOWPayments', fee: '0.5%' },
    ],
  },
  {
    id: 'specialized',
    name: 'Other & Emerging Methods',
    icon: <Fingerprint size={20} color="#8E44AD" />,
    color: '#8E44AD',
    description: 'QR, biometric, CBDCs & loyalty',
    methods: [
      { id: 'qr-payments', name: 'QR Code Payments', fee: '1.5%' },
      { id: 'biometric', name: 'Biometric Payments', fee: '2.0%' },
      { id: 'invoice', name: 'Invoice / Link Payments', fee: '2.9%' },
      { id: 'autopay', name: 'Autopay / Recurring', fee: '2.5%' },
      { id: 'loyalty-points', name: 'Loyalty / Rewards Points', fee: '1.0%' },
      { id: 'cbdc', name: 'CBDC (Digital Yuan, etc.)', fee: '0.2%' },
    ],
  },
];

export default function MyShopScreen() {
  const insets = useSafeAreaInsets();
  const { merchantProfile, merchantProducts, merchantProfiles, addMerchantProfile, switchMerchantProfile, activeMerchantId, wallets } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(charities[0]);
  const [donationPercent, setDonationPercent] = useState('2');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>([
    'visa', 'mastercard', 'apple-pay', 'google-pay', 'paypal', 'btc', 'eth', 'usdt', 'usdc'
  ]);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [showSwitchProfileModal, setShowSwitchProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCategory, setNewProfileCategory] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');
  const [newProfileType, setNewProfileType] = useState<MerchantType>('business');
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [showMetaverseModal, setShowMetaverseModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState<MetaverseLand | null>(null);
  const [ownedLands, setOwnedLands] = useState<string[]>([]);
  const [customers] = useState<Customer[]>(mockCustomers);
  const [reviews] = useState<Review[]>(mockReviews);
  const [locations, setLocations] = useState<ShopLocation[]>(mockLocations);

  const shopSlug = merchantProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const shopUrl = `larecoin.com/shop/${shopSlug}`;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const togglePaymentMethod = (methodId: string) => {
    setEnabledPaymentMethods(prev =>
      prev.includes(methodId)
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const getEnabledCountForCategory = (category: PaymentCategory) => {
    return category.methods.filter(m => enabledPaymentMethods.includes(m.id)).length;
  };

  const copyShopUrl = async () => {
    try {
      await Clipboard.setStringAsync(`https://${shopUrl}`);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.log('Copy error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const shopStats = {
    views: 1250,
    orders: 89,
    rating: 4.8,
    products: merchantProducts.length,
    customers: customers.length,
    locations: locations.filter(l => l.isActive).length,
  };

  const toggleLocationStatus = (locationId: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId ? { ...loc, isActive: !loc.isActive } : loc
    ));
  };

  const purchaseLand = (land: MetaverseLand) => {
    if (!ownedLands.includes(land.id)) {
      setOwnedLands(prev => [...prev, land.id]);
      setSelectedLand(null);
    }
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) return;
    await addMerchantProfile({
      name: newProfileName.trim(),
      category: newProfileCategory.trim() || 'General',
      description: newProfileDescription.trim(),
      linkedWalletId: selectedWalletId,
      type: newProfileType,
    });
    setNewProfileName('');
    setNewProfileCategory('');
    setNewProfileDescription('');
    setNewProfileType('business');
    setSelectedWalletId(null);
    setShowAddProfileModal(false);
  };

  const handleSwitchProfile = async (profileId: string) => {
    await switchMerchantProfile(profileId);
    setShowSwitchProfileModal(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={14} 
        color={i < rating ? '#F39C12' : Colors.border} 
        fill={i < rating ? '#F39C12' : 'transparent'}
      />
    ));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowNavMenu(true)}
        >
          <Menu size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>My Shop</Text>
          <Text style={styles.businessName}>{merchantProfile.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => setShowAddProfileModal(true)}
          >
            <Plus size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerIconBtn}
            onPress={() => setShowSwitchProfileModal(true)}
          >
            <RefreshCw size={20} color={Colors.text} />
          </TouchableOpacity>
          {merchantProfiles.length > 1 && (
            <View style={styles.profileCountBadge}>
              <Text style={styles.profileCountText}>{merchantProfiles.length}</Text>
            </View>
          )}
          <ModeToggle />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.shopCard}>
          <View style={styles.shopHeader}>
            <View style={styles.shopIconWrapper}>
              <Store size={28} color={Colors.primary} />
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{merchantProfile.name}</Text>
              <Text style={styles.shopCategory}>{merchantProfile.category}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Edit2 size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.shopDescription}>{merchantProfile.description}</Text>
          
          <View style={styles.shopStatsRow}>
            <TouchableOpacity style={styles.shopStatItem} onPress={() => setShowCustomersModal(true)}>
              <Text style={styles.shopStatValue}>{shopStats.customers}</Text>
              <Text style={styles.shopStatLabel}>Customers</Text>
            </TouchableOpacity>
            <View style={styles.shopStatDivider} />
            <TouchableOpacity style={styles.shopStatItem} onPress={() => setShowRatingsModal(true)}>
              <Text style={styles.shopStatValue}>{shopStats.rating}</Text>
              <Text style={styles.shopStatLabel}>Rating</Text>
            </TouchableOpacity>
            <View style={styles.shopStatDivider} />
            <TouchableOpacity style={styles.shopStatItem} onPress={() => setShowLocationsModal(true)}>
              <Text style={styles.shopStatValue}>{shopStats.locations}</Text>
              <Text style={styles.shopStatLabel}>Locations</Text>
            </TouchableOpacity>
            <View style={styles.shopStatDivider} />
            <View style={styles.shopStatItem}>
              <Text style={styles.shopStatValue}>{shopStats.products}</Text>
              <Text style={styles.shopStatLabel}>Products</Text>
            </View>
          </View>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <View style={styles.qrIconWrapper}>
              <QrCode size={48} color={Colors.primary} />
            </View>
            <View style={styles.qrInfo}>
              <Text style={styles.qrTitle}>Your Shop QR Code</Text>
              <Text style={styles.qrDesc}>Customers scan to browse & order</Text>
              <TouchableOpacity style={styles.shopUrlRow} onPress={copyShopUrl}>
                <Link size={14} color={Colors.primary} />
                <Text style={styles.shopUrlText} numberOfLines={1}>{shopUrl}</Text>
                {copiedUrl ? (
                  <Check size={16} color={Colors.accent} />
                ) : (
                  <Copy size={16} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.qrActions}>
            <TouchableOpacity style={styles.qrActionBtn}>
              <Eye size={18} color={Colors.primary} />
              <Text style={styles.qrActionText}>Preview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.qrActionBtn, styles.qrActionBtnPrimary]}>
              <Share2 size={18} color={Colors.background} />
              <Text style={styles.qrActionTextPrimary}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.paymentRequestCard}
          onPress={() => setShowPaymentModal(true)}
        >
          <View style={styles.paymentRequestIconWrapper}>
            <Receipt size={22} color="#3498DB" />
          </View>
          <View style={styles.paymentRequestInfo}>
            <Text style={styles.paymentRequestTitle}>Request Payments</Text>
            <Text style={styles.paymentRequestDesc}>
              {enabledPaymentMethods.length} payment methods enabled
            </Text>
            <Text style={styles.paymentRequestNote}>
              Net amounts moved on-chain to Larecoin liquidity pools
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.charityCard}
          onPress={() => setShowCharityModal(true)}
        >
          <View style={styles.charityIconWrapper}>
            <Heart size={22} color="#E74C3C" />
          </View>
          <View style={styles.charityInfo}>
            <Text style={styles.charityTitle}>Preferred Charity</Text>
            {selectedCharity ? (
              <>
                <Text style={styles.charityName}>{selectedCharity.name}</Text>
                <Text style={styles.charityDonation}>{donationPercent}% of sales donated</Text>
              </>
            ) : (
              <Text style={styles.charityEmpty}>Tap to select a charity partner</Text>
            )}
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
                <Package size={22} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Manage Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.accent + '20' }]}>
                <Plus size={22} color={Colors.accent} />
              </View>
              <Text style={styles.actionLabel}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                <Globe size={22} color="#9B59B6" />
              </View>
              <Text style={styles.actionLabel}>Online Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => setShowLocationsModal(true)}>
              <View style={[styles.actionIcon, { backgroundColor: '#E74C3C' + '20' }]}>
                <MapPin size={22} color="#E74C3C" />
              </View>
              <Text style={styles.actionLabel}>Locations</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.metaverseCard}
          onPress={() => setShowMetaverseModal(true)}
        >
          <View style={styles.metaverseGradient}>
            <View style={styles.metaverseIconWrapper}>
              <Cable size={28} color="#fff" />
            </View>
            <View style={styles.metaverseInfo}>
              <Text style={styles.metaverseTitle}>Metaverse Shop Plots</Text>
              <Text style={styles.metaverseDesc}>Buy virtual land for VR/AR/3D/2D storefronts</Text>
              <View style={styles.metaverseBadges}>
                <View style={styles.metaverseBadge}>
                  <Layers size={12} color="#fff" />
                  <Text style={styles.metaverseBadgeText}>VR</Text>
                </View>
                <View style={styles.metaverseBadge}>
                  <Map size={12} color="#fff" />
                  <Text style={styles.metaverseBadgeText}>AR</Text>
                </View>
                <View style={styles.metaverseBadge}>
                  <Cable size={12} color="#fff" />
                  <Text style={styles.metaverseBadgeText}>3D</Text>
                </View>
                <View style={styles.metaverseBadge}>
                  <Globe size={12} color="#fff" />
                  <Text style={styles.metaverseBadgeText}>2D</Text>
                </View>
              </View>
            </View>
            <View style={styles.metaverseArrow}>
              <ChevronRight size={24} color="#fff" />
            </View>
          </View>
          {ownedLands.length > 0 && (
            <View style={styles.ownedLandsRow}>
              <Text style={styles.ownedLandsText}>{ownedLands.length} plots owned</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {merchantProducts.slice(0, 3).map(product => (
            <View key={product.id} style={styles.productRow}>
              <View style={styles.productImagePlaceholder}>
                <Package size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity style={styles.productEditBtn}>
                <Edit2 size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <MerchantNavMenuModal visible={showNavMenu} onClose={() => setShowNavMenu(false)} />

      {/* Add Business Profile Modal */}
      <Modal
        visible={showAddProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Business Profile</Text>
              <TouchableOpacity onPress={() => setShowAddProfileModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Business Name *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter business name"
                  placeholderTextColor={Colors.textSecondary}
                  value={newProfileName}
                  onChangeText={setNewProfileName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Food & Beverage, Retail"
                  placeholderTextColor={Colors.textSecondary}
                  value={newProfileCategory}
                  onChangeText={setNewProfileCategory}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  placeholder="Describe your business"
                  placeholderTextColor={Colors.textSecondary}
                  value={newProfileDescription}
                  onChangeText={setNewProfileDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Business Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[styles.typeOption, newProfileType === 'business' && styles.typeOptionActive]}
                    onPress={() => setNewProfileType('business')}
                  >
                    <Store size={20} color={newProfileType === 'business' ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.typeOptionText, newProfileType === 'business' && styles.typeOptionTextActive]}>Business</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typeOption, newProfileType === 'charity' && styles.typeOptionActive]}
                    onPress={() => setNewProfileType('charity')}
                  >
                    <Heart size={20} color={newProfileType === 'charity' ? '#E74C3C' : Colors.textSecondary} />
                    <Text style={[styles.typeOptionText, newProfileType === 'charity' && styles.typeOptionTextActive]}>Charity</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Link Wallet (Optional)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.walletList}>
                  <TouchableOpacity
                    style={[styles.walletOption, !selectedWalletId && styles.walletOptionActive]}
                    onPress={() => setSelectedWalletId(null)}
                  >
                    <Text style={[styles.walletOptionText, !selectedWalletId && styles.walletOptionTextActive]}>None</Text>
                  </TouchableOpacity>
                  {wallets.filter(w => !w.isSubWallet).map(wallet => (
                    <TouchableOpacity
                      key={wallet.id}
                      style={[styles.walletOption, selectedWalletId === wallet.id && styles.walletOptionActive]}
                      onPress={() => setSelectedWalletId(wallet.id)}
                    >
                      <Wallet size={14} color={selectedWalletId === wallet.id ? Colors.primary : Colors.textSecondary} />
                      <Text style={[styles.walletOptionText, selectedWalletId === wallet.id && styles.walletOptionTextActive]}>{wallet.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.saveBtn, !newProfileName.trim() && styles.saveBtnDisabled]}
              onPress={handleAddProfile}
              disabled={!newProfileName.trim()}
            >
              <Plus size={20} color={Colors.background} />
              <Text style={styles.saveBtnText}>Create Business Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Switch Business Profile Modal */}
      <Modal
        visible={showSwitchProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSwitchProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Business Profile</Text>
              <TouchableOpacity onPress={() => setShowSwitchProfileModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.profileList} showsVerticalScrollIndicator={false}>
              {merchantProfiles.map(profile => {
                const isActive = profile.id === activeMerchantId;
                const linkedWallet = wallets.find(w => w.id === profile.linkedWalletId);
                return (
                  <TouchableOpacity
                    key={profile.id}
                    style={[styles.profileCard, isActive && styles.profileCardActive]}
                    onPress={() => handleSwitchProfile(profile.id)}
                  >
                    <View style={[styles.profileIconWrapper, { backgroundColor: profile.type === 'charity' ? '#E74C3C20' : Colors.primary + '20' }]}>
                      {profile.type === 'charity' ? (
                        <Heart size={24} color="#E74C3C" />
                      ) : (
                        <Store size={24} color={Colors.primary} />
                      )}
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{profile.name}</Text>
                      <Text style={styles.profileCategory}>{profile.category}</Text>
                      {linkedWallet && (
                        <View style={styles.linkedWalletRow}>
                          <Wallet size={12} color={Colors.textSecondary} />
                          <Text style={styles.linkedWalletText}>{linkedWallet.label}</Text>
                        </View>
                      )}
                    </View>
                    {isActive && (
                      <View style={styles.activeProfileBadge}>
                        <Check size={16} color={Colors.accent} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity 
              style={styles.addNewProfileBtn}
              onPress={() => {
                setShowSwitchProfileModal(false);
                setShowAddProfileModal(true);
              }}
            >
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addNewProfileText}>Add New Business Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCharityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCharityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Charity Partner</Text>
              <TouchableOpacity onPress={() => setShowCharityModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.donationRow}>
              <Text style={styles.donationLabel}>Donation Percentage</Text>
              <View style={styles.donationInput}>
                <TextInput
                  style={styles.donationInputText}
                  value={donationPercent}
                  onChangeText={setDonationPercent}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={styles.donationPercent}>%</Text>
              </View>
            </View>

            <ScrollView style={styles.charityList}>
              {charities.map(charity => (
                <TouchableOpacity
                  key={charity.id}
                  style={[
                    styles.charityOption,
                    selectedCharity?.id === charity.id && styles.charityOptionActive
                  ]}
                  onPress={() => setSelectedCharity(charity)}
                >
                  <View style={styles.charityOptionInfo}>
                    <Text style={styles.charityOptionName}>{charity.name}</Text>
                    <Text style={styles.charityOptionCategory}>{charity.category}</Text>
                    <Text style={styles.charityOptionDesc}>{charity.description}</Text>
                  </View>
                  {selectedCharity?.id === charity.id && (
                    <Check size={20} color={Colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={() => setShowCharityModal(false)}
            >
              <Text style={styles.saveBtnText}>Save Selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Sources</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentNotice}>
              <DollarSign size={16} color={Colors.accent} />
              <Text style={styles.paymentNoticeText}>
                All payments incur processing fees. Net amounts are moved on-chain into Larecoin's liquidity pools.
              </Text>
            </View>

            <ScrollView style={styles.paymentCategoryList} showsVerticalScrollIndicator={false}>
              {paymentCategories.map(category => (
                <View key={category.id} style={styles.paymentCategoryContainer}>
                  <TouchableOpacity 
                    style={styles.paymentCategoryHeader}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <View style={[styles.paymentCategoryIcon, { backgroundColor: category.color + '15' }]}>
                      {category.icon}
                    </View>
                    <View style={styles.paymentCategoryInfo}>
                      <Text style={styles.paymentCategoryName}>{category.name}</Text>
                      <Text style={styles.paymentCategoryDesc}>{category.description}</Text>
                    </View>
                    <View style={styles.paymentCategoryRight}>
                      <View style={[styles.enabledBadge, { backgroundColor: category.color + '20' }]}>
                        <Text style={[styles.enabledBadgeText, { color: category.color }]}>
                          {getEnabledCountForCategory(category)}/{category.methods.length}
                        </Text>
                      </View>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUp size={18} color={Colors.textSecondary} />
                      ) : (
                        <ChevronDown size={18} color={Colors.textSecondary} />
                      )}
                    </View>
                  </TouchableOpacity>

                  {expandedCategories.includes(category.id) && (
                    <View style={styles.paymentMethodsList}>
                      {category.methods.map(method => (
                        <TouchableOpacity
                          key={method.id}
                          style={[
                            styles.paymentMethodItem,
                            enabledPaymentMethods.includes(method.id) && styles.paymentMethodItemEnabled
                          ]}
                          onPress={() => togglePaymentMethod(method.id)}
                        >
                          <View style={styles.paymentMethodInfo}>
                            <Text style={styles.paymentMethodName}>{method.name}</Text>
                            <Text style={styles.paymentMethodFee}>Fee: {method.fee}</Text>
                          </View>
                          <View style={[
                            styles.paymentMethodToggle,
                            enabledPaymentMethods.includes(method.id) && styles.paymentMethodToggleEnabled
                          ]}>
                            {enabledPaymentMethods.includes(method.id) && (
                              <Check size={14} color="#fff" />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.saveBtnText}>Save Payment Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Customers Modal */}
      <Modal
        visible={showCustomersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Customers</Text>
              <TouchableOpacity onPress={() => setShowCustomersModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.customerStats}>
              <View style={styles.customerStatBox}>
                <Text style={styles.customerStatValue}>{customers.length}</Text>
                <Text style={styles.customerStatLabel}>Total</Text>
              </View>
              <View style={styles.customerStatBox}>
                <Text style={styles.customerStatValue}>${customers.reduce((a, c) => a + c.totalSpent, 0).toLocaleString()}</Text>
                <Text style={styles.customerStatLabel}>Revenue</Text>
              </View>
              <View style={styles.customerStatBox}>
                <Text style={styles.customerStatValue}>{customers.reduce((a, c) => a + c.totalOrders, 0)}</Text>
                <Text style={styles.customerStatLabel}>Orders</Text>
              </View>
            </View>

            <ScrollView style={styles.customerList} showsVerticalScrollIndicator={false}>
              {customers.map(customer => (
                <View key={customer.id} style={styles.customerCard}>
                  <View style={styles.customerAvatar}>
                    <UserCircle size={40} color={Colors.primary} />
                  </View>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <View style={styles.customerContactRow}>
                      <Mail size={12} color={Colors.textSecondary} />
                      <Text style={styles.customerContact}>{customer.email}</Text>
                    </View>
                    <View style={styles.customerMetrics}>
                      <View style={styles.customerMetric}>
                        <ShoppingCart size={12} color={Colors.accent} />
                        <Text style={styles.customerMetricText}>{customer.totalOrders} orders</Text>
                      </View>
                      <View style={styles.customerMetric}>
                        <DollarSign size={12} color={Colors.accent} />
                        <Text style={styles.customerMetricText}>${customer.totalSpent.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.customerActions}>
                    <TouchableOpacity style={styles.customerActionBtn}>
                      <Phone size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customerActionBtn}>
                      <Mail size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Ratings Modal */}
      <Modal
        visible={showRatingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRatingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reviews & Ratings</Text>
              <TouchableOpacity onPress={() => setShowRatingsModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingOverview}>
              <View style={styles.ratingBig}>
                <Text style={styles.ratingBigValue}>{averageRating.toFixed(1)}</Text>
                <View style={styles.ratingStars}>
                  {renderStars(Math.round(averageRating))}
                </View>
                <Text style={styles.ratingCount}>{reviews.length} reviews</Text>
              </View>
              <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = reviews.filter(r => r.rating === stars).length;
                  const percent = (count / reviews.length) * 100;
                  return (
                    <View key={stars} style={styles.ratingBar}>
                      <Text style={styles.ratingBarLabel}>{stars}</Text>
                      <Star size={12} color="#F39C12" fill="#F39C12" />
                      <View style={styles.ratingBarTrack}>
                        <View style={[styles.ratingBarFill, { width: `${percent}%` }]} />
                      </View>
                      <Text style={styles.ratingBarCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <ScrollView style={styles.reviewList} showsVerticalScrollIndicator={false}>
              {reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.customerName}</Text>
                      <View style={styles.reviewStars}>
                        {renderStars(review.rating)}
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  {review.productName && (
                    <Text style={styles.reviewProduct}>Product: {review.productName}</Text>
                  )}
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <View style={styles.reviewActions}>
                    {review.replied ? (
                      <View style={styles.repliedBadge}>
                        <Check size={12} color={Colors.accent} />
                        <Text style={styles.repliedText}>Replied</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.replyBtn}>
                        <Text style={styles.replyBtnText}>Reply</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Locations Modal */}
      <Modal
        visible={showLocationsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shop Locations</Text>
              <TouchableOpacity onPress={() => setShowLocationsModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addLocationBtn}>
              <Plus size={20} color={Colors.primary} />
              <Text style={styles.addLocationText}>Add New Location</Text>
            </TouchableOpacity>

            <ScrollView style={styles.locationList} showsVerticalScrollIndicator={false}>
              {locations.map(location => (
                <View key={location.id} style={[styles.locationCard, !location.isActive && styles.locationCardInactive]}>
                  <View style={styles.locationHeader}>
                    <View style={[styles.locationIcon, { backgroundColor: location.isActive ? Colors.accent + '20' : Colors.border + '30' }]}>
                      <MapPin size={20} color={location.isActive ? Colors.accent : Colors.textSecondary} />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>{location.address}</Text>
                      <Text style={styles.locationCity}>{location.city}</Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.locationToggle, location.isActive && styles.locationToggleActive]}
                      onPress={() => toggleLocationStatus(location.id)}
                    >
                      {location.isActive ? (
                        <Unlock size={16} color={Colors.accent} />
                      ) : (
                        <Lock size={16} color={Colors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.locationStats}>
                    <View style={styles.locationStat}>
                      <ShoppingCart size={14} color={Colors.textSecondary} />
                      <Text style={styles.locationStatText}>{location.orders} orders</Text>
                    </View>
                    <View style={styles.locationStat}>
                      <DollarSign size={14} color={Colors.textSecondary} />
                      <Text style={styles.locationStatText}>${location.revenue.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.locationStatus, location.isActive ? styles.locationStatusActive : styles.locationStatusInactive]}>
                      <Text style={[styles.locationStatusText, location.isActive && styles.locationStatusTextActive]}>
                        {location.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.locationActions}>
                    <TouchableOpacity style={styles.locationActionBtn}>
                      <Edit2 size={16} color={Colors.primary} />
                      <Text style={styles.locationActionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locationActionBtn}>
                      <Navigation size={16} color={Colors.primary} />
                      <Text style={styles.locationActionText}>Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.locationActionBtn, styles.locationActionDanger]}>
                      <Trash2 size={16} color="#E74C3C" />
                      <Text style={[styles.locationActionText, { color: '#E74C3C' }]}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Metaverse Land Modal */}
      <Modal
        visible={showMetaverseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMetaverseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.paymentModalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Metaverse Land Plots</Text>
              <TouchableOpacity onPress={() => setShowMetaverseModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.metaverseNotice}>
              <Cable size={18} color="#8E44AD" />
              <Text style={styles.metaverseNoticeText}>
                Own virtual commercial land to host your shop in immersive environments
              </Text>
            </View>

            <ScrollView style={styles.landList} showsVerticalScrollIndicator={false}>
              {metaverseLands.map(land => {
                const isOwned = ownedLands.includes(land.id);
                return (
                  <TouchableOpacity 
                    key={land.id} 
                    style={[styles.landCard, isOwned && styles.landCardOwned]}
                    onPress={() => !isOwned && setSelectedLand(land)}
                  >
                    <Image source={{ uri: land.image }} style={styles.landImage} />
                    <View style={styles.landTypeBadge}>
                      <Text style={styles.landTypeText}>{land.type}</Text>
                    </View>
                    {isOwned && (
                      <View style={styles.ownedBadge}>
                        <Check size={12} color="#fff" />
                        <Text style={styles.ownedBadgeText}>Owned</Text>
                      </View>
                    )}
                    <View style={styles.landInfo}>
                      <Text style={styles.landName}>{land.name}</Text>
                      <Text style={styles.landZone}>{land.zone} • {land.size}</Text>
                      <View style={styles.landFeatures}>
                        {land.features.slice(0, 2).map((feature, idx) => (
                          <View key={idx} style={styles.landFeatureBadge}>
                            <Text style={styles.landFeatureText}>{feature}</Text>
                          </View>
                        ))}
                        {land.features.length > 2 && (
                          <Text style={styles.landMoreFeatures}>+{land.features.length - 2}</Text>
                        )}
                      </View>
                      <View style={styles.landPriceRow}>
                        <Text style={styles.landPrice}>${land.price.toLocaleString()}</Text>
                        {!isOwned && land.available && (
                          <View style={styles.availableBadge}>
                            <Text style={styles.availableText}>Available</Text>
                          </View>
                        )}
                        {!land.available && !isOwned && (
                          <View style={styles.soldBadge}>
                            <Text style={styles.soldText}>Sold</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Land Purchase Modal */}
      <Modal
        visible={selectedLand !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedLand(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.purchaseModal, { paddingBottom: insets.bottom + 20 }]}>
            {selectedLand && (
              <>
                <Image source={{ uri: selectedLand.image }} style={styles.purchaseImage} />
                <TouchableOpacity style={styles.purchaseClose} onPress={() => setSelectedLand(null)}>
                  <X size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.purchaseContent}>
                  <View style={styles.purchaseHeader}>
                    <Text style={styles.purchaseTitle}>{selectedLand.name}</Text>
                    <View style={styles.purchaseTypeBadge}>
                      <Text style={styles.purchaseTypeText}>{selectedLand.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.purchaseZone}>{selectedLand.zone} • {selectedLand.size}</Text>
                  
                  <View style={styles.purchaseFeatures}>
                    <Text style={styles.purchaseFeaturesTitle}>Features</Text>
                    {selectedLand.features.map((feature, idx) => (
                      <View key={idx} style={styles.purchaseFeatureRow}>
                        <Check size={16} color={Colors.accent} />
                        <Text style={styles.purchaseFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.purchasePriceBox}>
                    <Text style={styles.purchasePriceLabel}>Purchase Price</Text>
                    <Text style={styles.purchasePriceValue}>${selectedLand.price.toLocaleString()} LUSD</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.purchaseBtn}
                    onPress={() => purchaseLand(selectedLand)}
                  >
                    <Zap size={20} color="#fff" />
                    <Text style={styles.purchaseBtnText}>Purchase Land Plot</Text>
                  </TouchableOpacity>

                  <Text style={styles.purchaseDisclaimer}>
                    Virtual land ownership is recorded on-chain. You can resell or lease your plot anytime.
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerCenter: {
    flex: 1,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCountBadge: {
    position: 'absolute',
    right: 70,
    top: -4,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  shopCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  shopCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  shopStatsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
  },
  shopStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  shopStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  shopStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  shopStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  qrSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  qrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  qrIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  qrInfo: {
    flex: 1,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  qrDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  shopUrlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    gap: 8,
  },
  shopUrlText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  qrActions: {
    flexDirection: 'row',
    gap: 10,
  },
  qrActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    borderRadius: 12,
  },
  qrActionBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  qrActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  qrActionTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },
  charityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E74C3C' + '30',
  },
  charityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E74C3C' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  charityInfo: {
    flex: 1,
  },
  charityTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  charityName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  charityDonation: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '500',
  },
  charityEmpty: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
  },
  productEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  donationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  donationLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  donationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  donationInputText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    width: 40,
    textAlign: 'center',
  },
  donationPercent: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  charityList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  charityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  charityOptionActive: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  charityOptionInfo: {
    flex: 1,
  },
  charityOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  charityOptionCategory: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  charityOptionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  paymentRequestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3498DB' + '30',
  },
  paymentRequestIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3498DB' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentRequestInfo: {
    flex: 1,
  },
  paymentRequestTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  paymentRequestDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  paymentRequestNote: {
    fontSize: 11,
    color: '#3498DB',
    fontWeight: '500',
  },
  paymentModalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  paymentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '10',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  paymentNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
  paymentCategoryList: {
    flex: 1,
  },
  paymentCategoryContainer: {
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
  },
  paymentCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  paymentCategoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentCategoryInfo: {
    flex: 1,
  },
  paymentCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  paymentCategoryDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paymentCategoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  enabledBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  enabledBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  paymentMethodsList: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
  },
  paymentMethodItemEnabled: {
    backgroundColor: Colors.accent + '10',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  paymentMethodFee: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  paymentMethodToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodToggleEnabled: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  // Customer Modal Styles
  customerStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  customerStatBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  customerStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  customerStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  customerList: {
    flex: 1,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  customerAvatar: {
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  customerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  customerContact: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  customerMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  customerMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerMetricText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  customerActions: {
    flexDirection: 'column',
    gap: 6,
  },
  customerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Rating Modal Styles
  ratingOverview: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 20,
  },
  ratingBig: {
    alignItems: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  ratingBigValue: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.text,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  ratingBreakdown: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingBarLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 12,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 3,
  },
  ratingBarCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    width: 16,
    textAlign: 'right',
  },
  reviewList: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewerInfo: {
    gap: 4,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  reviewProduct: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 6,
  },
  reviewComment: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewActions: {
    flexDirection: 'row',
  },
  repliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  repliedText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500',
  },
  replyBtn: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replyBtnText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  // Location Modal Styles
  addLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  addLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  locationList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  locationCardInactive: {
    opacity: 0.7,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  locationCity: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  locationToggle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationToggleActive: {
    backgroundColor: Colors.accent + '15',
  },
  locationStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  locationStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationStatText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  locationStatus: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationStatusActive: {
    backgroundColor: Colors.accent + '15',
  },
  locationStatusInactive: {
    backgroundColor: Colors.border + '50',
  },
  locationStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  locationStatusTextActive: {
    color: Colors.accent,
  },
  locationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  locationActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    paddingVertical: 10,
    borderRadius: 10,
  },
  locationActionDanger: {
    backgroundColor: '#E74C3C' + '10',
  },
  locationActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  // Metaverse Card Styles
  metaverseCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
  },
  metaverseGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#8E44AD',
  },
  metaverseIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  metaverseInfo: {
    flex: 1,
  },
  metaverseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  metaverseDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  metaverseBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  metaverseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaverseBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  metaverseArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownedLandsRow: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  ownedLandsText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  // Metaverse Modal Styles
  metaverseNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E44AD' + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  metaverseNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  landList: {
    flex: 1,
  },
  landCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  landCardOwned: {
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  landImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.border,
  },
  landTypeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#8E44AD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  landTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  ownedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ownedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  landInfo: {
    padding: 14,
  },
  landName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  landZone: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  landFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  landFeatureBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  landFeatureText: {
    fontSize: 11,
    color: Colors.text,
    fontWeight: '500',
  },
  landMoreFeatures: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    alignSelf: 'center',
  },
  landPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  landPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  availableBadge: {
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.accent,
  },
  soldBadge: {
    backgroundColor: '#E74C3C' + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  soldText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E74C3C',
  },
  // Purchase Modal Styles
  purchaseModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  purchaseImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
  },
  purchaseClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseContent: {
    padding: 20,
  },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  purchaseTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  purchaseTypeBadge: {
    backgroundColor: '#8E44AD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  purchaseTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  purchaseZone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  purchaseFeatures: {
    marginBottom: 20,
  },
  purchaseFeaturesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  purchaseFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  purchaseFeatureText: {
    fontSize: 14,
    color: Colors.text,
  },
  purchasePriceBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  purchasePriceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  purchasePriceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  purchaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#8E44AD',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  purchaseBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  purchaseDisclaimer: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTextArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeOptionTextActive: {
    color: Colors.primary,
  },
  walletList: {
    marginTop: 4,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  walletOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  walletOptionTextActive: {
    color: Colors.primary,
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  profileList: {
    maxHeight: 350,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent + '08',
  },
  profileIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  profileCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  linkedWalletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkedWalletText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  activeProfileBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  addNewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
