import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { 
  CircleDollarSign, ArrowDownUp, CreditCard, Building2, ChevronDown, Shield, Clock, 
  AlertCircle, TrendingUp, TrendingDown, Info, Check, X, Wallet, Scale, Award, Gem
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Metal {
  id: string;
  symbol: string;
  name: string;
  pricePerOz: number;
  change24h: number;
  image: string;
  color: string;
  purity: string;
  minPurchase: number;
  description: string;
}

interface Holding {
  symbol: string;
  amount: number;
  valueUSD: number;
}

export default function PreciousMetalsScreen() {
  const { colors } = useApp();
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [amountType, setAmountType] = useState<'usd' | 'oz'>('usd');
  const [selectedMetal, setSelectedMetal] = useState('XAUT');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [showMetalPicker, setShowMetalPicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const metals: Metal[] = [
    { 
      id: 'gold', 
      symbol: 'XAUT', 
      name: 'Tokenized Gold', 
      pricePerOz: 2024.50, 
      change24h: 1.24,
      image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=100&h=100&fit=crop',
      color: '#FFD700',
      purity: '99.99%',
      minPurchase: 0.001,
      description: 'Each token represents 1 troy oz of LBMA-accredited gold stored in Swiss vaults'
    },
    { 
      id: 'silver', 
      symbol: 'XAGT', 
      name: 'Tokenized Silver', 
      pricePerOz: 23.45, 
      change24h: -0.82,
      image: 'https://images.unsplash.com/photo-1589787168422-ae57f552ceb4?w=100&h=100&fit=crop',
      color: '#C0C0C0',
      purity: '99.9%',
      minPurchase: 0.01,
      description: 'Each token represents 1 troy oz of LBMA-accredited silver stored in Swiss vaults'
    },
    { 
      id: 'platinum', 
      symbol: 'XPTT', 
      name: 'Tokenized Platinum', 
      pricePerOz: 912.30, 
      change24h: 0.56,
      image: 'https://images.unsplash.com/photo-1603665301175-57ba46f392bf?w=100&h=100&fit=crop',
      color: '#E5E4E2',
      purity: '99.95%',
      minPurchase: 0.001,
      description: 'Each token represents 1 troy oz of LPPM-accredited platinum stored in London vaults'
    },
    { 
      id: 'palladium', 
      symbol: 'XPDT', 
      name: 'Tokenized Palladium', 
      pricePerOz: 1045.80, 
      change24h: 2.15,
      image: 'https://images.unsplash.com/photo-1612832164313-ac0d7e07b5c7?w=100&h=100&fit=crop',
      color: '#CED0DD',
      purity: '99.95%',
      minPurchase: 0.001,
      description: 'Each token represents 1 troy oz of LPPM-accredited palladium stored in London vaults'
    },
  ];

  const holdings: Holding[] = [
    { symbol: 'XAUT', amount: 0.125, valueUSD: 253.06 },
    { symbol: 'XAGT', amount: 5.5, valueUSD: 128.98 },
  ];

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet Balance', icon: Wallet, fee: '0.5%', balance: '$12,450.00' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%', balance: null },
    { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '1.0%', balance: null },
  ];

  const selectedMetalData = metals.find(m => m.symbol === selectedMetal);
  
  const calculateAmount = () => {
    if (!amount || !selectedMetalData) return { oz: '0.00000', usd: '0.00' };
    const numAmount = parseFloat(amount);
    if (amountType === 'usd') {
      return {
        oz: (numAmount / selectedMetalData.pricePerOz).toFixed(5),
        usd: numAmount.toFixed(2)
      };
    } else {
      return {
        oz: numAmount.toFixed(5),
        usd: (numAmount * selectedMetalData.pricePerOz).toFixed(2)
      };
    }
  };

  const calculated = calculateAmount();
  const fee = paymentMethod === 'card' ? 0.025 : paymentMethod === 'bank' ? 0.01 : 0.005;
  const feeAmount = parseFloat(calculated.usd) * fee;
  const total = mode === 'buy' 
    ? parseFloat(calculated.usd) + feeAmount 
    : parseFloat(calculated.usd) - feeAmount;

  const handleConfirmOrder = () => {
    setShowConfirmModal(false);
    setTimeout(() => setShowSuccessModal(true), 300);
  };

  const getTotalHoldingsValue = () => {
    return holdings.reduce((sum, h) => sum + h.valueUSD, 0).toFixed(2);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.headerCard, { backgroundColor: '#1a1a2e' }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>Your Metal Holdings</Text>
            <Text style={styles.headerValue}>${getTotalHoldingsValue()}</Text>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: 'rgba(255,215,0,0.2)' }]}>
            <Gem size={16} color="#FFD700" />
            <Text style={styles.headerBadgeText}>Vault Secured</Text>
          </View>
        </View>
        <View style={styles.holdingsRow}>
          {holdings.map(holding => {
            const metal = metals.find(m => m.symbol === holding.symbol);
            return (
              <View key={holding.symbol} style={styles.holdingItem}>
                <View style={[styles.holdingDot, { backgroundColor: metal?.color || '#FFD700' }]} />
                <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                <Text style={styles.holdingAmount}>{holding.amount} oz</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.modeToggle, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.modeBtn, mode === 'buy' && { backgroundColor: '#10B981' }]}
          onPress={() => setMode('buy')}
        >
          <Text style={[styles.modeBtnText, { color: mode === 'buy' ? '#FFFFFF' : colors.textSecondary }]}>Buy Metals</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeBtn, mode === 'sell' && { backgroundColor: '#EF4444' }]}
          onPress={() => setMode('sell')}
        >
          <Text style={[styles.modeBtnText, { color: mode === 'sell' ? '#FFFFFF' : colors.textSecondary }]}>Sell Metals</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 16, marginTop: 8 }]}>Select Metal</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metalScroll}>
        {metals.map(metal => (
          <TouchableOpacity 
            key={metal.symbol}
            style={[
              styles.metalCard, 
              { backgroundColor: colors.surface },
              selectedMetal === metal.symbol && { borderColor: metal.color, borderWidth: 2 }
            ]}
            onPress={() => setSelectedMetal(metal.symbol)}
          >
            <View style={[styles.metalIconBg, { backgroundColor: metal.color + '25' }]}>
              <Text style={[styles.metalIcon, { color: metal.color }]}>
                {metal.symbol.substring(1, 3)}
              </Text>
            </View>
            <Text style={[styles.metalName, { color: colors.text }]}>{metal.name.split(' ')[1]}</Text>
            <Text style={[styles.metalPrice, { color: colors.textSecondary }]}>${metal.pricePerOz.toLocaleString()}/oz</Text>
            <View style={styles.metalChange}>
              {metal.change24h >= 0 ? (
                <TrendingUp size={12} color="#10B981" />
              ) : (
                <TrendingDown size={12} color="#EF4444" />
              )}
              <Text style={[styles.metalChangeText, { color: metal.change24h >= 0 ? '#10B981' : '#EF4444' }]}>
                {metal.change24h >= 0 ? '+' : ''}{metal.change24h}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedMetalData && (
        <View style={[styles.metalInfo, { backgroundColor: colors.surface }]}>
          <View style={styles.metalInfoHeader}>
            <Award size={16} color={selectedMetalData.color} />
            <Text style={[styles.metalInfoTitle, { color: colors.text }]}>
              {selectedMetalData.name}
            </Text>
            <View style={[styles.purityBadge, { backgroundColor: selectedMetalData.color + '20' }]}>
              <Text style={[styles.purityText, { color: selectedMetalData.color }]}>
                {selectedMetalData.purity} Pure
              </Text>
            </View>
          </View>
          <Text style={[styles.metalInfoDesc, { color: colors.textSecondary }]}>
            {selectedMetalData.description}
          </Text>
        </View>
      )}

      <View style={[styles.exchangeCard, { backgroundColor: colors.surface }]}>
        <View style={styles.inputSection}>
          <View style={styles.inputLabelRow}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              {mode === 'buy' ? 'You Pay' : 'You Sell'}
            </Text>
            <TouchableOpacity 
              style={styles.toggleAmountType}
              onPress={() => setAmountType(amountType === 'usd' ? 'oz' : 'usd')}
            >
              <ArrowDownUp size={12} color={colors.primary} />
              <Text style={[styles.toggleText, { color: colors.primary }]}>
                Switch to {amountType === 'usd' ? 'oz' : 'USD'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
            <View style={styles.currencySelector}>
              <Text style={[styles.currencyText, { color: colors.text }]}>
                {amountType === 'usd' ? 'USD' : selectedMetal}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.swapIconContainer}>
          <View style={[styles.swapIcon, { backgroundColor: selectedMetalData?.color || colors.primary }]}>
            <ArrowDownUp size={18} color="#1a1a2e" />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            {mode === 'buy' ? 'You Receive' : 'You Get'}
          </Text>
          <View style={[styles.inputRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.receiveAmount, { color: colors.text }]}>
              {amountType === 'usd' ? calculated.oz : calculated.usd}
            </Text>
            <View style={styles.currencySelector}>
              <Text style={[styles.currencyText, { color: colors.text }]}>
                {amountType === 'usd' ? selectedMetal : 'USD'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.rateDisplay, { backgroundColor: colors.background }]}>
          <Scale size={14} color={colors.textSecondary} />
          <Text style={[styles.rateText, { color: colors.textSecondary }]}>
            1 oz {selectedMetalData?.name.split(' ')[1]} = ${selectedMetalData?.pricePerOz.toLocaleString() || '0.00'} USD
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity 
            key={method.id}
            style={[
              styles.paymentOption, 
              { backgroundColor: colors.surface },
              paymentMethod === method.id && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '15' }]}>
              <method.icon size={20} color={colors.primary} />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
              <View style={styles.paymentMeta}>
                <Text style={[styles.paymentFee, { color: colors.textSecondary }]}>Fee: {method.fee}</Text>
                {method.balance && (
                  <Text style={[styles.paymentBalance, { color: '#10B981' }]}>{method.balance}</Text>
                )}
              </View>
            </View>
            <View style={[
              styles.radioOuter, 
              { borderColor: paymentMethod === method.id ? colors.primary : colors.border }
            ]}>
              {paymentMethod === method.id && <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            {mode === 'buy' ? 'Purchase Amount' : 'Sell Amount'}
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {calculated.oz} oz ({selectedMetal})
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Value</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${calculated.usd}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Processing Fee</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${feeAmount.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            {mode === 'buy' ? 'Total to Pay' : 'Total to Receive'}
          </Text>
          <Text style={[styles.totalValue, { color: selectedMetalData?.color || colors.primary }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.continueBtn, { backgroundColor: selectedMetalData?.color || colors.primary }]}
        onPress={() => setShowConfirmModal(true)}
      >
        <Text style={[styles.continueBtnText, { color: '#1a1a2e' }]}>
          {mode === 'buy' ? 'Buy' : 'Sell'} {selectedMetalData?.name.split(' ')[1]}
        </Text>
      </TouchableOpacity>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Shield size={18} color="#10B981" />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          All tokenized metals are backed 1:1 by physical metals stored in LBMA/LPPM accredited vaults. Ownership is recorded on-chain and can be redeemed for physical delivery.
        </Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Clock size={18} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
          <Text>Transactions are processed instantly. Physical redemption requires minimum 1 oz and takes 5-10 business days.</Text>
        </Text>
      </View>

      <View style={{ height: 40 }} />

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmModal, { backgroundColor: colors.surface }]}>
            <View style={styles.confirmHeader}>
              <Text style={[styles.confirmTitle, { color: colors.text }]}>Confirm {mode === 'buy' ? 'Purchase' : 'Sale'}</Text>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.confirmMetal, { backgroundColor: colors.background }]}>
              <View style={[styles.confirmMetalIcon, { backgroundColor: (selectedMetalData?.color || '#FFD700') + '25' }]}>
                <Text style={[styles.confirmMetalSymbol, { color: selectedMetalData?.color }]}>
                  {selectedMetal.substring(1, 3)}
                </Text>
              </View>
              <View style={styles.confirmMetalInfo}>
                <Text style={[styles.confirmMetalName, { color: colors.text }]}>{selectedMetalData?.name}</Text>
                <Text style={[styles.confirmMetalAmount, { color: colors.textSecondary }]}>
                  {calculated.oz} oz @ ${selectedMetalData?.pricePerOz.toLocaleString()}/oz
                </Text>
              </View>
            </View>

            <View style={styles.confirmDetails}>
              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.confirmValue, { color: colors.text }]}>${calculated.usd}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, { color: colors.textSecondary }]}>Fee</Text>
                <Text style={[styles.confirmValue, { color: colors.text }]}>${feeAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.confirmRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }]}>
                <Text style={[styles.confirmTotalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.confirmTotalValue, { color: selectedMetalData?.color }]}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.confirmBtn, { backgroundColor: selectedMetalData?.color || colors.primary }]}
              onPress={handleConfirmOrder}
            >
              <Text style={[styles.confirmBtnText, { color: '#1a1a2e' }]}>Confirm {mode === 'buy' ? 'Purchase' : 'Sale'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.successModal, { backgroundColor: colors.surface }]}>
            <View style={[styles.successIcon, { backgroundColor: '#10B981' }]}>
              <Check size={32} color="#FFFFFF" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              {mode === 'buy' ? 'Purchase' : 'Sale'} Successful!
            </Text>
            <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
              You have successfully {mode === 'buy' ? 'purchased' : 'sold'} {calculated.oz} oz of {selectedMetalData?.name}
            </Text>
            <View style={[styles.successDetails, { backgroundColor: colors.background }]}>
              <View style={styles.successRow}>
                <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Transaction ID</Text>
                <Text style={[styles.successValue, { color: colors.text }]}>#TXN{Date.now().toString().slice(-8)}</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Amount</Text>
                <Text style={[styles.successValue, { color: colors.text }]}>{calculated.oz} oz</Text>
              </View>
              <View style={styles.successRow}>
                <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Total {mode === 'buy' ? 'Paid' : 'Received'}</Text>
                <Text style={[styles.successValue, { color: selectedMetalData?.color }]}>${total.toFixed(2)}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.successBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowSuccessModal(false);
                setAmount('');
              }}
            >
              <Text style={styles.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginBottom: 4,
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  holdingsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  holdingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  holdingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  holdingSymbol: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  holdingAmount: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  metalScroll: {
    paddingLeft: 16,
  },
  metalCard: {
    width: 120,
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
  },
  metalIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metalIcon: {
    fontSize: 16,
    fontWeight: '800' as const,
  },
  metalName: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  metalPrice: {
    fontSize: 11,
    marginBottom: 6,
  },
  metalChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metalChangeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  metalInfo: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
  },
  metalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metalInfoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  },
  purityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  purityText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  metalInfoDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  exchangeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
  },
  inputSection: {
    marginBottom: 8,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  toggleAmountType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  receiveAmount: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600' as const,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  swapIconContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  swapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  rateText: {
    fontSize: 13,
  },
  section: {
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 14,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  paymentFee: {
    fontSize: 12,
  },
  paymentBalance: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summaryCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 6,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  continueBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmModal: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  confirmMetal: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  confirmMetalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmMetalSymbol: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  confirmMetalInfo: {
    marginLeft: 14,
  },
  confirmMetalName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  confirmMetalAmount: {
    fontSize: 13,
    marginTop: 2,
  },
  confirmDetails: {
    marginBottom: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmLabel: {
    fontSize: 14,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  confirmTotalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  confirmTotalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  confirmBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  successModal: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  successDetails: {
    width: '100%',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  successRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  successLabel: {
    fontSize: 13,
  },
  successValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  successBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  successBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
