import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { CreditCard, Lock, Globe, Bell, Eye, EyeOff, Snowflake, Settings, ChevronRight, Copy, Shield } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface CardTransaction {
  id: string;
  merchant: string;
  amount: string;
  date: string;
  type: 'purchase' | 'atm' | 'refund';
}

const mockTransactions: CardTransaction[] = [
  { id: '1', merchant: 'Amazon', amount: '-$124.99', date: 'Today, 2:34 PM', type: 'purchase' },
  { id: '2', merchant: 'ATM Withdrawal', amount: '-$200.00', date: 'Yesterday, 10:15 AM', type: 'atm' },
  { id: '3', merchant: 'Starbucks', amount: '-$8.50', date: 'Jan 23, 9:00 AM', type: 'purchase' },
  { id: '4', merchant: 'Refund - Apple', amount: '+$49.99', date: 'Jan 22, 4:30 PM', type: 'refund' },
  { id: '5', merchant: 'Uber', amount: '-$23.45', date: 'Jan 21, 8:20 PM', type: 'purchase' },
];

export default function LUSDDebitCardScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [onlineTransactions, setOnlineTransactions] = useState(true);
  const [internationalTransactions, setInternationalTransactions] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const cardNumber = '4532 •••• •••• 7821';
  const fullCardNumber = '4532 8921 6743 7821';
  const cardBalance = '$2,458.32';

  return (
    <>
      <Stack.Screen options={{ title: 'LUSD Debit Card', headerShown: true }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <View style={[styles.debitCard, cardFrozen && styles.cardFrozen]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>LUSD Debit</Text>
              <CreditCard size={28} color="#fff" />
            </View>
            
            <View style={styles.cardChip} />
            
            <TouchableOpacity 
              style={styles.cardNumberRow}
              onPress={() => setShowCardNumber(!showCardNumber)}
            >
              <Text style={styles.cardNumber}>
                {showCardNumber ? fullCardNumber : cardNumber}
              </Text>
              {showCardNumber ? (
                <EyeOff size={18} color="rgba(255,255,255,0.7)" />
              ) : (
                <Eye size={18} color="rgba(255,255,255,0.7)" />
              )}
            </TouchableOpacity>
            
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>JOHN DOE</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>12/28</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>CVV</Text>
                <Text style={styles.cardValue}>•••</Text>
              </View>
            </View>
            
            {cardFrozen && (
              <View style={styles.frozenOverlay}>
                <Snowflake size={40} color="#fff" />
                <Text style={styles.frozenText}>Card Frozen</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.text }]}>{cardBalance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity style={[styles.balanceButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.balanceButtonText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.balanceButton, { backgroundColor: colors.border }]}>
              <Text style={[styles.balanceButtonTextSecondary, { color: colors.text }]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={[styles.quickAction, { borderRightColor: colors.border, borderRightWidth: 1 }]}
            onPress={() => setCardFrozen(!cardFrozen)}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: cardFrozen ? '#3B82F6' : colors.border }]}>
              <Snowflake size={20} color={cardFrozen ? '#fff' : colors.textSecondary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>
              {cardFrozen ? 'Unfreeze' : 'Freeze'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickAction, { borderRightColor: colors.border, borderRightWidth: 1 }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.border }]}>
              <Copy size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Copy Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.border }]}>
              <Settings size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.quickActionLabel, { color: colors.text }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Controls</Text>
          <View style={[styles.controlsCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.controlItem, { borderBottomColor: colors.border }]}>
              <View style={styles.controlLeft}>
                <Globe size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>Online Transactions</Text>
              </View>
              <Switch
                value={onlineTransactions}
                onValueChange={setOnlineTransactions}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            
            <View style={[styles.controlItem, { borderBottomColor: colors.border }]}>
              <View style={styles.controlLeft}>
                <Globe size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>International Transactions</Text>
              </View>
              <Switch
                value={internationalTransactions}
                onValueChange={setInternationalTransactions}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
            
            <View style={[styles.controlItem, { borderBottomWidth: 0 }]}>
              <View style={styles.controlLeft}>
                <Bell size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>Transaction Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security</Text>
          <View style={[styles.controlsCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <View style={styles.controlLeft}>
                <Lock size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>Change PIN</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <View style={styles.controlLeft}>
                <Shield size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>Set Spending Limits</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
              <View style={styles.controlLeft}>
                <CreditCard size={20} color={colors.iconColor} />
                <Text style={[styles.controlLabel, { color: colors.text }]}>Report Lost/Stolen</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <View style={[styles.transactionsCard, { backgroundColor: colors.surface }]}>
            {mockTransactions.map((transaction, index) => (
              <View 
                key={transaction.id} 
                style={[
                  styles.transactionItem,
                  { borderBottomColor: colors.border },
                  index === mockTransactions.length - 1 && { borderBottomWidth: 0 }
                ]}
              >
                <View style={styles.transactionLeft}>
                  <Text style={[styles.transactionMerchant, { color: colors.text }]}>
                    {transaction.merchant}
                  </Text>
                  <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                    {transaction.date}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'refund' ? '#10B981' : colors.text }
                ]}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    padding: 20,
    alignItems: 'center',
  },
  debitCard: {
    width: '100%',
    maxWidth: 340,
    aspectRatio: 1.586,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#1a1a2e',
    backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardFrozen: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  cardChip: {
    width: 45,
    height: 35,
    backgroundColor: '#d4af37',
    borderRadius: 6,
    marginTop: 20,
  },
  cardNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '500' as const,
    letterSpacing: 1,
  },
  cardValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 4,
  },
  frozenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frozenText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
    marginTop: 8,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  balanceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  balanceButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  balanceButtonTextSecondary: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  controlsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  controlItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  transactionsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  transactionDate: {
    fontSize: 13,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
