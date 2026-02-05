import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Plus, Copy, Eye, EyeOff, Shield, Trash2, RefreshCw, Check, Clock, Globe, ShoppingBag, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface VirtualCard {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  nickname: string;
  limit: number;
  spent: number;
  status: 'active' | 'paused' | 'expired';
  createdAt: string;
  usage: 'single' | 'recurring' | 'merchant';
  merchantLocked?: string;
}

export default function VirtualCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();

  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([
    {
      id: '1',
      cardNumber: '4521 8745 3698 7412',
      expiryDate: '03/27',
      cvv: '482',
      cardHolder: 'JOHN DOE',
      nickname: 'Online Shopping',
      limit: 500,
      spent: 127.50,
      status: 'active',
      createdAt: '2025-01-15',
      usage: 'recurring',
    },
    {
      id: '2',
      cardNumber: '4521 9632 7845 1236',
      expiryDate: '01/25',
      cvv: '159',
      cardHolder: 'JOHN DOE',
      nickname: 'Netflix Subscription',
      limit: 25,
      spent: 15.99,
      status: 'active',
      createdAt: '2025-01-10',
      usage: 'merchant',
      merchantLocked: 'Netflix',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardDetailsVisible, setCardDetailsVisible] = useState<Record<string, boolean>>({});
  const [newCardData, setNewCardData] = useState({
    nickname: '',
    limit: '',
    usage: 'recurring' as 'single' | 'recurring' | 'merchant',
  });

  const toggleCardDetails = (cardId: string) => {
    setCardDetailsVisible(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCreateCard = () => {
    if (!newCardData.nickname || !newCardData.limit) return;
    
    const newCard: VirtualCard = {
      id: Date.now().toString(),
      cardNumber: `4521 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: '01/28',
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      cardHolder: 'JOHN DOE',
      nickname: newCardData.nickname,
      limit: parseInt(newCardData.limit, 10),
      spent: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      usage: newCardData.usage,
    };

    setVirtualCards([...virtualCards, newCard]);
    setNewCardData({ nickname: '', limit: '', usage: 'recurring' });
    setShowCreateModal(false);
  };

  const handleDeleteCard = (cardId: string) => {
    setVirtualCards(virtualCards.filter(c => c.id !== cardId));
  };

  const handleToggleCardStatus = (cardId: string) => {
    setVirtualCards(virtualCards.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'active' ? 'paused' : 'active' }
        : card
    ));
  };

  const handleRegenerateCard = (cardId: string) => {
    setVirtualCards(virtualCards.map(card => 
      card.id === cardId 
        ? { 
            ...card, 
            cardNumber: `4521 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
            cvv: Math.floor(100 + Math.random() * 900).toString(),
            expiryDate: '02/28',
          }
        : card
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'paused': return '#F59E0B';
      case 'expired': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  const getUsageIcon = (usage: string) => {
    switch (usage) {
      case 'single': return Clock;
      case 'recurring': return RefreshCw;
      case 'merchant': return ShoppingBag;
      default: return CreditCard;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Virtual Cards</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
          <Shield size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>Secure Online Shopping</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              <Text>Create virtual cards for online purchases. Set spending limits and protect your main card details.</Text>
            </Text>
          </View>
        </View>

        <View style={styles.cardsSection}>
          <View style={styles.cardsSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Virtual Cards</Text>
            <Text style={[styles.cardCount, { color: colors.textSecondary }]}>{virtualCards.length} cards</Text>
          </View>

          {virtualCards.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <CreditCard size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Virtual Cards</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                <Text>Create your first virtual card for secure online purchases</Text>
              </Text>
              <TouchableOpacity 
                style={[styles.createFirstButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowCreateModal(true)}
              >
                <Plus size={18} color="#FFFFFF" />
                <Text style={styles.createFirstButtonText}>Create Virtual Card</Text>
              </TouchableOpacity>
            </View>
          ) : (
            virtualCards.map(card => {
              const UsageIcon = getUsageIcon(card.usage);
              return (
                <View key={card.id} style={[styles.virtualCardContainer, { backgroundColor: colors.surface }]}>
                  <View style={[styles.virtualCard, { backgroundColor: card.status === 'paused' ? '#6B7280' : '#1E3A5F' }]}>
                    {card.status === 'paused' && (
                      <View style={styles.pausedOverlay}>
                        <Text style={styles.pausedText}>PAUSED</Text>
                      </View>
                    )}
                    <View style={styles.cardTop}>
                      <View style={styles.cardChip}>
                        <View style={[styles.chipLine, { backgroundColor: '#FFD700' }]} />
                        <View style={[styles.chipLine, { backgroundColor: '#FFD700' }]} />
                        <View style={[styles.chipLine, { backgroundColor: '#FFD700' }]} />
                      </View>
                      <View style={styles.cardBrandRow}>
                        <Text style={styles.cardNickname}>{card.nickname}</Text>
                        <Text style={styles.cardBrand}>VIRTUAL</Text>
                      </View>
                    </View>
                    <View style={styles.cardNumberSection}>
                      <Text style={styles.cardNumber}>
                        {cardDetailsVisible[card.id] ? card.cardNumber : '•••• •••• •••• ' + card.cardNumber.slice(-4)}
                      </Text>
                      <TouchableOpacity onPress={() => toggleCardDetails(card.id)}>
                        {cardDetailsVisible[card.id] ? (
                          <EyeOff size={18} color="rgba(255,255,255,0.8)" />
                        ) : (
                          <Eye size={18} color="rgba(255,255,255,0.8)" />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cardBottom}>
                      <View>
                        <Text style={styles.cardLabel}>HOLDER</Text>
                        <Text style={styles.cardValue}>{card.cardHolder}</Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>EXPIRES</Text>
                        <Text style={styles.cardValue}>
                          {cardDetailsVisible[card.id] ? card.expiryDate : '••/••'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.cardLabel}>CVV</Text>
                        <Text style={styles.cardValue}>
                          {cardDetailsVisible[card.id] ? card.cvv : '•••'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardDetails}>
                    <View style={styles.cardDetailRow}>
                      <View style={styles.cardDetailItem}>
                        <View style={[styles.usageBadge, { backgroundColor: colors.primary + '15' }]}>
                          <UsageIcon size={14} color={colors.primary} />
                          <Text style={[styles.usageBadgeText, { color: colors.primary }]}>
                            {card.usage === 'single' ? 'Single Use' : card.usage === 'recurring' ? 'Recurring' : 'Merchant Locked'}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(card.status) + '15' }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(card.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(card.status) }]}>
                          {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    {card.merchantLocked && (
                      <View style={[styles.merchantLockedBanner, { backgroundColor: colors.background }]}>
                        <Globe size={14} color={colors.textSecondary} />
                        <Text style={[styles.merchantLockedText, { color: colors.textSecondary }]}>
                          Locked to: {card.merchantLocked}
                        </Text>
                      </View>
                    )}

                    <View style={styles.spendingSection}>
                      <View style={styles.spendingRow}>
                        <Text style={[styles.spendingLabel, { color: colors.textSecondary }]}>Spending</Text>
                        <Text style={[styles.spendingValue, { color: colors.text }]}>
                          ${card.spent.toLocaleString()} / ${card.limit.toLocaleString()}
                        </Text>
                      </View>
                      <View style={[styles.spendingBar, { backgroundColor: colors.border }]}>
                        <View 
                          style={[
                            styles.spendingProgress, 
                            { backgroundColor: colors.primary, width: `${Math.min((card.spent / card.limit) * 100, 100)}%` }
                          ]} 
                        />
                      </View>
                    </View>

                    <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                      {cardDetailsVisible[card.id] && (
                        <TouchableOpacity style={styles.cardActionBtn}>
                          <Copy size={16} color={colors.primary} />
                          <Text style={[styles.cardActionText, { color: colors.primary }]}>Copy</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity 
                        style={styles.cardActionBtn}
                        onPress={() => handleToggleCardStatus(card.id)}
                      >
                        {card.status === 'active' ? (
                          <>
                            <Clock size={16} color="#F59E0B" />
                            <Text style={[styles.cardActionText, { color: '#F59E0B' }]}>Pause</Text>
                          </>
                        ) : (
                          <>
                            <Check size={16} color="#10B981" />
                            <Text style={[styles.cardActionText, { color: '#10B981' }]}>Resume</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cardActionBtn}
                        onPress={() => handleRegenerateCard(card.id)}
                      >
                        <RefreshCw size={16} color={colors.textSecondary} />
                        <Text style={[styles.cardActionText, { color: colors.textSecondary }]}>Regenerate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.cardActionBtn}
                        onPress={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                        <Text style={[styles.cardActionText, { color: '#EF4444' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Virtual Card</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              <Text>Set up a new virtual card for online purchases</Text>
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Nickname</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="e.g., Online Shopping"
                placeholderTextColor={colors.textTertiary}
                value={newCardData.nickname}
                onChangeText={(text) => setNewCardData({ ...newCardData, nickname: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Spending Limit (LUSD)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="500"
                placeholderTextColor={colors.textTertiary}
                value={newCardData.limit}
                onChangeText={(text) => setNewCardData({ ...newCardData, limit: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Type</Text>
              <View style={styles.usageOptions}>
                {(['recurring', 'single', 'merchant'] as const).map(usage => (
                  <TouchableOpacity
                    key={usage}
                    style={[
                      styles.usageOption,
                      { backgroundColor: colors.background },
                      newCardData.usage === usage && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setNewCardData({ ...newCardData, usage })}
                  >
                    {React.createElement(getUsageIcon(usage), { size: 18, color: newCardData.usage === usage ? colors.primary : colors.textSecondary })}
                    <Text style={[styles.usageOptionText, { color: newCardData.usage === usage ? colors.primary : colors.text }]}>
                      {usage === 'single' ? 'Single Use' : usage === 'recurring' ? 'Recurring' : 'Merchant'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalCancelBtn, { backgroundColor: colors.background }]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewCardData({ nickname: '', limit: '', usage: 'recurring' });
                }}
              >
                <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalCreateBtn, 
                  { backgroundColor: colors.primary },
                  (!newCardData.nickname || !newCardData.limit) && styles.buttonDisabled
                ]}
                onPress={handleCreateCard}
                disabled={!newCardData.nickname || !newCardData.limit}
              >
                <Text style={styles.modalCreateText}>Create Card</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardsSection: {
    marginBottom: 24,
  },
  cardsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  cardCount: {
    fontSize: 13,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  virtualCardContainer: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  virtualCard: {
    padding: 20,
    position: 'relative',
  },
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pausedText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardChip: {
    width: 36,
    height: 26,
    backgroundColor: '#D4AF37',
    borderRadius: 5,
    padding: 3,
    justifyContent: 'space-between',
  },
  chipLine: {
    height: 2.5,
    borderRadius: 1,
  },
  cardBrandRow: {
    alignItems: 'flex-end',
  },
  cardNickname: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginBottom: 2,
  },
  cardBrand: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  cardNumberSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '600' as const,
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  cardValue: {
    color: '#FFFFFF',
    fontSize: 13,
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
  cardDetailItem: {
    flex: 1,
  },
  usageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  usageBadgeText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
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
  merchantLockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  merchantLockedText: {
    fontSize: 12,
  },
  spendingSection: {
    marginBottom: 14,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spendingLabel: {
    fontSize: 13,
  },
  spendingValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  spendingBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  spendingProgress: {
    height: '100%',
    borderRadius: 3,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '500' as const,
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
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  usageOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  usageOption: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 6,
  },
  usageOptionText: {
    fontSize: 11,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  modalCreateBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalCreateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
