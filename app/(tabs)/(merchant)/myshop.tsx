import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Store, QrCode, Package, Edit2, Eye, Share2, Settings, 
  Heart, ChevronRight, Plus, Check, X, Globe, MapPin, Copy, Link
} from 'lucide-react-native';
import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

interface Charity {
  id: string;
  name: string;
  category: string;
  description: string;
}

const charities: Charity[] = [
  { id: '1', name: 'Red Cross', category: 'Humanitarian', description: 'Disaster relief and emergency assistance' },
  { id: '2', name: 'UNICEF', category: 'Children', description: 'Supporting children worldwide' },
  { id: '3', name: 'WWF', category: 'Environment', description: 'Wildlife conservation and environmental protection' },
  { id: '4', name: 'Doctors Without Borders', category: 'Health', description: 'Medical humanitarian aid' },
  { id: '5', name: 'Local Food Bank', category: 'Community', description: 'Fighting hunger in local communities' },
];

export default function MyShopScreen() {
  const insets = useSafeAreaInsets();
  const { merchantProfile, merchantProducts } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [showCharityModal, setShowCharityModal] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(charities[0]);
  const [donationPercent, setDonationPercent] = useState('2');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const shopSlug = merchantProfile.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const shopUrl = `larecoin.com/shop/${shopSlug}`;

  const copyShopUrl = async () => {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(`https://${shopUrl}`);
    } else {
      await Clipboard.setStringAsync(`https://${shopUrl}`);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
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
});
