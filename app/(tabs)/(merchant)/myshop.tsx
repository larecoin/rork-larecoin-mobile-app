import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Store, QrCode, Package, Edit2, Eye, Share2, Settings, 
  Heart, ChevronRight, Plus, Check, X, Globe, MapPin, Copy, Link,
  CreditCard, Wallet, Clock, Building2, Users, Bitcoin, Fingerprint,
  ChevronDown, ChevronUp, DollarSign, Smartphone, Receipt
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

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
  const { merchantProfile, merchantProducts } = useApp();
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
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Shop</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings size={22} color={Colors.text} />
        </TouchableOpacity>
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
            <View style={styles.shopStatItem}>
              <Text style={styles.shopStatValue}>{shopStats.views}</Text>
              <Text style={styles.shopStatLabel}>Views</Text>
            </View>
            <View style={styles.shopStatDivider} />
            <View style={styles.shopStatItem}>
              <Text style={styles.shopStatValue}>{shopStats.orders}</Text>
              <Text style={styles.shopStatLabel}>Orders</Text>
            </View>
            <View style={styles.shopStatDivider} />
            <View style={styles.shopStatItem}>
              <Text style={styles.shopStatValue}>{shopStats.rating}</Text>
              <Text style={styles.shopStatLabel}>Rating</Text>
            </View>
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
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E74C3C' + '20' }]}>
                <MapPin size={22} color="#E74C3C" />
              </View>
              <Text style={styles.actionLabel}>Locations</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
});
