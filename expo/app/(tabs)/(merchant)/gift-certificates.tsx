import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Gift,
  Plus,
  Search,
  QrCode,
  Copy,
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface GiftCertificate {
  id: string;
  code: string;
  amount: number;
  balance: number;
  status: 'active' | 'redeemed' | 'expired';
  purchasedBy: string;
  redeemedBy?: string;
  createdAt: string;
  expiresAt: string;
}

const mockCertificates: GiftCertificate[] = [
  { id: '1', code: 'GIFT-A1B2C3', amount: 50, balance: 50, status: 'active', purchasedBy: 'John Smith', createdAt: 'Jan 15, 2025', expiresAt: 'Jan 15, 2026' },
  { id: '2', code: 'GIFT-D4E5F6', amount: 100, balance: 35, status: 'active', purchasedBy: 'Emily Davis', createdAt: 'Jan 10, 2025', expiresAt: 'Jan 10, 2026' },
  { id: '3', code: 'GIFT-G7H8I9', amount: 25, balance: 0, status: 'redeemed', purchasedBy: 'Mike Chen', redeemedBy: 'Sarah Johnson', createdAt: 'Dec 20, 2024', expiresAt: 'Dec 20, 2025' },
  { id: '4', code: 'GIFT-J0K1L2', amount: 75, balance: 75, status: 'expired', purchasedBy: 'Lisa Park', createdAt: 'Jun 15, 2024', expiresAt: 'Jan 15, 2025' },
];

const denominations = [25, 50, 75, 100, 150, 200];

export default function GiftCertificates() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');

  const totalIssued = mockCertificates.reduce((sum, cert) => sum + cert.amount, 0);
  const totalOutstanding = mockCertificates
    .filter(cert => cert.status === 'active')
    .reduce((sum, cert) => sum + cert.balance, 0);
  const activeCertificates = mockCertificates.filter(cert => cert.status === 'active').length;

  const filteredCertificates = mockCertificates.filter(cert =>
    cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.purchasedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getStatusIcon = (status: GiftCertificate['status']) => {
    switch (status) {
      case 'active': return <CheckCircle size={14} color={Colors.accent} />;
      case 'redeemed': return <Clock size={14} color={Colors.primary} />;
      case 'expired': return <XCircle size={14} color={Colors.error} />;
    }
  };

  const getStatusColor = (status: GiftCertificate['status']) => {
    switch (status) {
      case 'active': return Colors.accent;
      case 'redeemed': return Colors.primary;
      case 'expired': return Colors.error;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gift Certificates</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreate(!showCreate)}>
          <Plus size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <DollarSign size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>${totalIssued}</Text>
            <Text style={styles.statLabel}>Total Issued</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Gift size={18} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>${totalOutstanding}</Text>
            <Text style={styles.statLabel}>Outstanding</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#9B59B6' + '20' }]}>
              <Sparkles size={18} color="#9B59B6" />
            </View>
            <Text style={styles.statValue}>{activeCertificates}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>

        {showCreate && (
          <View style={styles.createCard}>
            <View style={styles.createHeader}>
              <Gift size={20} color={Colors.primary} />
              <Text style={styles.createTitle}>Create Gift Certificate</Text>
            </View>
            
            <Text style={styles.createLabel}>Select Amount</Text>
            <View style={styles.denominationGrid}>
              {denominations.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    styles.denominationChip,
                    selectedAmount === amount && styles.denominationChipActive
                  ]}
                  onPress={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                >
                  <Text style={[
                    styles.denominationText,
                    selectedAmount === amount && styles.denominationTextActive
                  ]}>
                    ${amount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.createLabel}>Or Custom Amount</Text>
            <View style={styles.customAmountInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Enter amount"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={customAmount}
                onChangeText={(text) => {
                  setCustomAmount(text);
                  setSelectedAmount(0);
                }}
              />
            </View>

            <TouchableOpacity style={styles.createButton}>
              <Gift size={18} color={Colors.background} />
              <Text style={styles.createButtonText}>Generate Certificate</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by code or buyer..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Certificates</Text>
            <Text style={styles.sectionCount}>{filteredCertificates.length} total</Text>
          </View>

          {filteredCertificates.map(cert => (
            <TouchableOpacity key={cert.id} style={styles.certificateCard}>
              <View style={styles.certificateHeader}>
                <View style={styles.codeContainer}>
                  <Text style={styles.certificateCode}>{cert.code}</Text>
                  <TouchableOpacity style={styles.copyBtn}>
                    <Copy size={14} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(cert.status) + '20' }]}>
                  {getStatusIcon(cert.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(cert.status) }]}>
                    {cert.status}
                  </Text>
                </View>
              </View>

              <View style={styles.certificateBody}>
                <View style={styles.amountSection}>
                  <Text style={styles.amountLabel}>Value</Text>
                  <Text style={styles.amountValue}>${cert.amount}</Text>
                  {cert.status === 'active' && cert.balance < cert.amount && (
                    <Text style={styles.balanceText}>Balance: ${cert.balance}</Text>
                  )}
                </View>
                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purchased by</Text>
                    <Text style={styles.detailValue}>{cert.purchasedBy}</Text>
                  </View>
                  {cert.redeemedBy && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Redeemed by</Text>
                      <Text style={styles.detailValue}>{cert.redeemedBy}</Text>
                    </View>
                  )}
                  <View style={styles.detailRow}>
                    <Calendar size={12} color={Colors.textSecondary} />
                    <Text style={styles.detailValue}>Expires {cert.expiresAt}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.certificateActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <QrCode size={16} color={Colors.primary} />
                  <Text style={styles.actionBtnText}>View QR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Share2 size={16} color={Colors.accent} />
                  <Text style={[styles.actionBtnText, { color: Colors.accent }]}>Share</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.redeemBanner}>
          <View style={styles.redeemContent}>
            <QrCode size={24} color={Colors.background} />
            <View style={styles.redeemInfo}>
              <Text style={styles.redeemTitle}>Redeem Certificate</Text>
              <Text style={styles.redeemDesc}>Scan QR code to redeem</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.background} />
        </TouchableOpacity>

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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  createCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  createLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  denominationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  denominationChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  denominationChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  denominationText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  denominationTextActive: {
    color: Colors.background,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  certificateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  certificateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificateCode: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: 'monospace',
  },
  copyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  certificateBody: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  amountSection: {
    marginRight: 20,
  },
  amountLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  balanceText: {
    fontSize: 11,
    color: Colors.accent,
    marginTop: 2,
  },
  detailsSection: {
    flex: 1,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  certificateActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  redeemBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 18,
  },
  redeemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  redeemInfo: {
    flex: 1,
  },
  redeemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
    marginBottom: 2,
  },
  redeemDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
