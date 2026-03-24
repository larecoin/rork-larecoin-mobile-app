import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ShieldCheck, CreditCard, User, Building2, FileCheck, Camera, Upload, Check, Clock, AlertCircle, ChevronRight, Briefcase } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

type VerificationLevel = 'none' | 'basic' | 'advanced' | 'business';
type CardType = 'personal' | 'business';

interface LinkedCard {
  id: string;
  type: CardType;
  last4: string;
  brand: string;
  expiry: string;
  isDefault: boolean;
}

const linkedCards: LinkedCard[] = [
  { id: '1', type: 'personal', last4: '4242', brand: 'Visa', expiry: '12/26', isDefault: true },
];

export default function KycAmlScreen() {
  const { activeWallet, linkedMerchantWallet } = useApp();
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('basic');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardType, setCardType] = useState<CardType>('personal');

  const isBusinessWallet = activeWallet?.id === linkedMerchantWallet?.id;

  const verificationLevels = [
    { level: 'none' as const, label: 'Unverified', limit: '$0', icon: AlertCircle, color: Colors.textTertiary },
    { level: 'basic' as const, label: 'Basic', limit: '$1,000/day', icon: User, color: '#F39C12' },
    { level: 'advanced' as const, label: 'Advanced', limit: '$50,000/day', icon: FileCheck, color: '#2ECC71' },
    { level: 'business' as const, label: 'Business', limit: 'Unlimited', icon: Building2, color: '#3498DB' },
  ];

  const currentLevelIndex = verificationLevels.findIndex(v => v.level === verificationLevel);

  const handleStartVerification = (level: VerificationLevel) => {
    if (level === 'advanced') {
      Alert.alert('Advanced Verification', 'This will require government-issued ID and proof of address. Continue?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Start advanced verification') },
      ]);
    } else if (level === 'business') {
      Alert.alert('Business Verification', 'This requires business registration documents and beneficial owner information.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Start business verification') },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>KYC & AML</Text>
        <Text style={styles.subtitle}>Verify your identity to unlock higher limits and link payment methods</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Status</Text>
        <View style={styles.levelProgress}>
          {verificationLevels.map((item, index) => (
            <View key={item.level} style={styles.levelItem}>
              <View style={[
                styles.levelIcon,
                { backgroundColor: index <= currentLevelIndex ? item.color + '20' : Colors.surface }
              ]}>
                <item.icon 
                  size={20} 
                  color={index <= currentLevelIndex ? item.color : Colors.textTertiary} 
                />
                {index < currentLevelIndex && (
                  <View style={styles.checkBadge}>
                    <Check size={10} color={Colors.background} />
                  </View>
                )}
              </View>
              <Text style={[
                styles.levelLabel,
                index <= currentLevelIndex && { color: Colors.text, fontWeight: '600' as const }
              ]}>
                {item.label}
              </Text>
              <Text style={styles.levelLimit}>{item.limit}</Text>
              {index < verificationLevels.length - 1 && (
                <View style={[
                  styles.levelConnector,
                  index < currentLevelIndex && { backgroundColor: item.color }
                ]} />
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrade Verification</Text>
        
        {verificationLevel === 'basic' && (
          <TouchableOpacity 
            style={styles.upgradeCard}
            onPress={() => handleStartVerification('advanced')}
          >
            <View style={styles.upgradeIconWrapper}>
              <FileCheck size={24} color="#2ECC71" />
            </View>
            <View style={styles.upgradeInfo}>
              <Text style={styles.upgradeTitle}>Advanced Verification</Text>
              <Text style={styles.upgradeDesc}>Upload ID and proof of address</Text>
              <View style={styles.upgradeBenefits}>
                <Text style={styles.benefitText}>• $50,000 daily limit</Text>
                <Text style={styles.benefitText}>• Link debit/credit cards</Text>
                <Text style={styles.benefitText}>• Bank transfers enabled</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}

        {isBusinessWallet && verificationLevel !== 'business' && (
          <TouchableOpacity 
            style={styles.upgradeCard}
            onPress={() => handleStartVerification('business')}
          >
            <View style={[styles.upgradeIconWrapper, { backgroundColor: '#3498DB20' }]}>
              <Building2 size={24} color="#3498DB" />
            </View>
            <View style={styles.upgradeInfo}>
              <Text style={styles.upgradeTitle}>Business Verification</Text>
              <Text style={styles.upgradeDesc}>For merchant-linked wallets</Text>
              <View style={styles.upgradeBenefits}>
                <Text style={styles.benefitText}>• Unlimited transactions</Text>
                <Text style={styles.benefitText}>• Business debit card</Text>
                <Text style={styles.benefitText}>• Tax reporting tools</Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Linked Cards</Text>
          <TouchableOpacity 
            style={styles.addCardBtn}
            onPress={() => setShowAddCard(true)}
          >
            <Text style={styles.addCardText}>+ Add Card</Text>
          </TouchableOpacity>
        </View>

        {linkedCards.length === 0 ? (
          <View style={styles.emptyCards}>
            <CreditCard size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No cards linked</Text>
            <Text style={styles.emptySubtext}>Complete verification to link a debit card</Text>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {linkedCards.map(card => (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardIcon}>
                  {card.type === 'business' ? (
                    <Briefcase size={20} color={Colors.primary} />
                  ) : (
                    <CreditCard size={20} color={Colors.primary} />
                  )}
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardNameRow}>
                    <Text style={styles.cardBrand}>{card.brand} •••• {card.last4}</Text>
                    {card.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                  <Text style={styles.cardType}>
                    {card.type === 'business' ? 'Business Debit' : 'Personal Debit'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.cardMenuBtn}>
                  <Text style={styles.cardMenuText}>•••</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Required Documents</Text>
        <View style={styles.documentsList}>
          <View style={styles.documentItem}>
            <View style={[styles.documentIcon, { backgroundColor: '#2ECC7120' }]}>
              <Check size={16} color="#2ECC71" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Email Verification</Text>
              <Text style={styles.documentStatus}>Verified</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <View style={[styles.documentIcon, { backgroundColor: '#2ECC7120' }]}>
              <Check size={16} color="#2ECC71" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Phone Verification</Text>
              <Text style={styles.documentStatus}>Verified</Text>
            </View>
          </View>
          <View style={styles.documentItem}>
            <View style={[styles.documentIcon, { backgroundColor: '#F39C1220' }]}>
              <Clock size={16} color="#F39C12" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Government ID</Text>
              <Text style={[styles.documentStatus, { color: '#F39C12' }]}>Pending</Text>
            </View>
            <TouchableOpacity style={styles.uploadBtn}>
              <Upload size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.documentItem}>
            <View style={[styles.documentIcon, { backgroundColor: Colors.surface }]}>
              <AlertCircle size={16} color={Colors.textTertiary} />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>Proof of Address</Text>
              <Text style={[styles.documentStatus, { color: Colors.textTertiary }]}>Not submitted</Text>
            </View>
            <TouchableOpacity style={styles.uploadBtn}>
              <Upload size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <ShieldCheck size={18} color={Colors.primary} />
          <Text style={styles.infoTitle}>Why Verify?</Text>
        </View>
        <Text style={styles.infoText}>
          KYC (Know Your Customer) and AML (Anti-Money Laundering) verification helps us maintain 
          a secure platform. Higher verification levels unlock increased transaction limits and 
          additional features like bank transfers and card payments.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  levelProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  levelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  levelLimit: {
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  levelConnector: {
    position: 'absolute',
    top: 24,
    right: -25,
    width: 50,
    height: 2,
    backgroundColor: Colors.surface,
    zIndex: -1,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  upgradeIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2ECC7120',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  upgradeDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  upgradeBenefits: {
    gap: 2,
  },
  benefitText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  addCardBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
  },
  addCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyCards: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  cardsList: {
    gap: 12,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardBrand: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  defaultBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardType: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  cardMenuBtn: {
    padding: 8,
  },
  cardMenuText: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  documentsList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  documentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  documentStatus: {
    fontSize: 12,
    color: '#2ECC71',
  },
  uploadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
