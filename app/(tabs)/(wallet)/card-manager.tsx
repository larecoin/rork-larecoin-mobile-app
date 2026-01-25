import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { CreditCard, Plus, Trash2, Check, Shield, DollarSign, Eye, EyeOff, Lock, Smartphone, Bell, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface LinkedCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
  lusdLimit: number;
  spentThisMonth: number;
  status: 'active' | 'frozen' | 'pending';
}

const mockCards: LinkedCard[] = [
  {
    id: '1',
    cardNumber: '**** **** **** 4521',
    cardHolder: 'JOHN DOE',
    expiryDate: '12/27',
    cardType: 'visa',
    isDefault: true,
    lusdLimit: 5000,
    spentThisMonth: 1247.50,
    status: 'active',
  },
];

export default function CardManagerScreen() {
  const { colors, activeWallet, mode } = useApp();
  const [cards, setCards] = useState<LinkedCard[]>(mockCards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumberVisible, setCardNumberVisible] = useState<Record<string, boolean>>({});
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const lusdBalance = 5280.50;
  const isMerchant = mode === 'merchant';

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiryDate || !newCard.cvv) {
      Alert.alert('Missing Information', 'Please fill in all card details');
      return;
    }

    const maskedNumber = '**** **** **** ' + newCard.cardNumber.slice(-4);
    const card: LinkedCard = {
      id: Date.now().toString(),
      cardNumber: maskedNumber,
      cardHolder: newCard.cardHolder.toUpperCase(),
      expiryDate: newCard.expiryDate,
      cardType: 'visa',
      isDefault: cards.length === 0,
      lusdLimit: 2500,
      spentThisMonth: 0,
      status: 'pending',
    };

    setCards([...cards, card]);
    setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    setShowAddCard(false);
    Alert.alert('Card Added', 'Your card is being verified. This may take 1-2 business days.');
  };

  const handleRemoveCard = (cardId: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setCards(cards.filter(c => c.id !== cardId))
        },
      ]
    );
  };

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === cardId })));
  };

  const toggleCardVisibility = (cardId: string) => {
    setCardNumberVisible(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case 'visa': return '#1A1F71';
      case 'mastercard': return '#EB001B';
      case 'amex': return '#006FCF';
      default: return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'frozen': return '#F59E0B';
      case 'pending': return '#6366F1';
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Card Manager' }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Available LUSD for Card Spending</Text>
              <Text style={styles.balanceAmount}>${lusdBalance.toLocaleString()}</Text>
            </View>
            <View style={[styles.lusdBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <DollarSign size={20} color="#FFFFFF" />
              <Text style={styles.lusdBadgeText}>LUSD</Text>
            </View>
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceInfoText}>
              {isMerchant ? 'Business Debit Card' : 'Personal Debit Card'} • Linked to {activeWallet?.label || 'Main Wallet'}
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <AlertCircle size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Link a debit card to spend your LUSD balance anywhere Visa/Mastercard is accepted. 
            {isMerchant && ' Business cards include expense tracking and higher limits.'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Linked Cards</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddCard(true)}
            >
              <Plus size={18} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {cards.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <CreditCard size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Cards Linked</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Add a debit card to start spending your LUSD
              </Text>
            </View>
          ) : (
            cards.map(card => (
              <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.surface }]}>
                <View style={[styles.cardVisual, { backgroundColor: getCardTypeColor(card.cardType) }]}>
                  <View style={styles.cardVisualHeader}>
                    <Text style={styles.cardTypeText}>{card.cardType.toUpperCase()}</Text>
                    {card.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Check size={10} color="#FFFFFF" />
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardNumberRow}>
                    <Text style={styles.cardNumberText}>
                      {cardNumberVisible[card.id] ? '4521 8745 3698 4521' : card.cardNumber}
                    </Text>
                    <TouchableOpacity onPress={() => toggleCardVisibility(card.id)}>
                      {cardNumberVisible[card.id] ? (
                        <EyeOff size={18} color="rgba(255,255,255,0.8)" />
                      ) : (
                        <Eye size={18} color="rgba(255,255,255,0.8)" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardFooterLabel}>CARD HOLDER</Text>
                      <Text style={styles.cardFooterValue}>{card.cardHolder}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardFooterLabel}>EXPIRES</Text>
                      <Text style={styles.cardFooterValue}>{card.expiryDate}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <View style={styles.cardDetailRow}>
                    <Text style={[styles.cardDetailLabel, { color: colors.textSecondary }]}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(card.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(card.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(card.status) }]}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardDetailRow}>
                    <Text style={[styles.cardDetailLabel, { color: colors.textSecondary }]}>Monthly Limit</Text>
                    <Text style={[styles.cardDetailValue, { color: colors.text }]}>${card.lusdLimit.toLocaleString()}</Text>
                  </View>
                  <View style={styles.cardDetailRow}>
                    <Text style={[styles.cardDetailLabel, { color: colors.textSecondary }]}>Spent This Month</Text>
                    <Text style={[styles.cardDetailValue, { color: colors.text }]}>${card.spentThisMonth.toLocaleString()}</Text>
                  </View>
                  <View style={styles.spendingBar}>
                    <View 
                      style={[
                        styles.spendingProgress, 
                        { 
                          backgroundColor: colors.primary,
                          width: `${(card.spentThisMonth / card.lusdLimit) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.remainingText, { color: colors.textSecondary }]}>
                    ${(card.lusdLimit - card.spentThisMonth).toLocaleString()} remaining
                  </Text>
                </View>

                <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                  {!card.isDefault && (
                    <TouchableOpacity 
                      style={styles.cardActionBtn}
                      onPress={() => handleSetDefault(card.id)}
                    >
                      <Check size={16} color={colors.primary} />
                      <Text style={[styles.cardActionText, { color: colors.primary }]}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.cardActionBtn}
                    onPress={() => handleRemoveCard(card.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                    <Text style={[styles.cardActionText, { color: colors.error }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Settings</Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                <Lock size={18} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Transaction Limits</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Set daily and per-transaction limits</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: '#10B981' + '20' }]}>
                <Shield size={18} color="#10B981" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Security Settings</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>PIN, freeze card, fraud protection</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: '#F59E0B' + '20' }]}>
                <Bell size={18} color="#F59E0B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Transaction alerts and spending updates</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.settingIcon, { backgroundColor: '#6366F1' + '20' }]}>
                <Smartphone size={18} color="#6366F1" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Virtual Card</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Generate virtual card for online purchases</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showAddCard && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Link Debit Card</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Enter your debit card details to link it with your LUSD balance
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textTertiary}
                value={newCard.cardNumber}
                onChangeText={(text) => setNewCard({ ...newCard, cardNumber: text })}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Holder Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="JOHN DOE"
                placeholderTextColor={colors.textTertiary}
                value={newCard.cardHolder}
                onChangeText={(text) => setNewCard({ ...newCard, cardHolder: text })}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textTertiary}
                  value={newCard.expiryDate}
                  onChangeText={(text) => setNewCard({ ...newCard, expiryDate: text })}
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CVV</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder="***"
                  placeholderTextColor={colors.textTertiary}
                  value={newCard.cvv}
                  onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={[styles.securityNote, { backgroundColor: colors.background }]}>
              <Shield size={16} color={colors.primary} />
              <Text style={[styles.securityNoteText, { color: colors.textSecondary }]}>
                Your card details are encrypted and securely stored
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowAddCard(false);
                  setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
                }}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddCard}
              >
                <Text style={styles.modalConfirmText}>Link Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700' as const,
  },
  lusdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  lusdBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  balanceInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  balanceInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 16,
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
    fontWeight: '700' as const,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  cardItem: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardVisual: {
    padding: 20,
  },
  cardVisualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTypeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600' as const,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardFooterLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginBottom: 2,
  },
  cardFooterValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  cardDetails: {
    padding: 16,
  },
  cardDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardDetailLabel: {
    fontSize: 14,
  },
  cardDetailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  spendingBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  spendingProgress: {
    height: '100%',
    borderRadius: 3,
  },
  remainingText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 12,
    gap: 16,
    justifyContent: 'flex-end',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
  settingDivider: {
    height: 1,
    marginLeft: 70,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  modalConfirmBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
