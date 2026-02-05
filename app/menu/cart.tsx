import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, 
  Image, Alert, Platform, Modal
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Trash2, Plus, Minus, ScanBarcode, CreditCard, Wallet,
  Bitcoin, DollarSign, X, Check, ChevronRight, ShoppingBag, QrCode,
  Smartphone, Building2, Gift, Percent, Tag
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  merchantName?: string;
  isScanned?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'crypto' | 'card' | 'bank' | 'wallet' | 'gift';
  balance?: number;
  symbol?: string;
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Bluetooth Headphones',
    price: 79.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    merchantName: 'TechZone',
  },
  {
    id: '2',
    name: 'Organic Coffee Beans 1kg',
    price: 24.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
    merchantName: 'Bean & Brew',
  },
];

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, userTokens } = useApp();
  
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [showScanner, setShowScanner] = useState(false);
  const [manualSku, setManualSku] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const cryptoPayments: PaymentMethod[] = userTokens.slice(0, 5).map(token => ({
    id: `crypto-${token.symbol}`,
    name: token.name,
    icon: <Bitcoin size={20} color={colors.primary} />,
    type: 'crypto' as const,
    balance: token.balance,
    symbol: token.symbol,
  }));

  const paymentMethods: PaymentMethod[] = [
    { id: 'apple-pay', name: 'Apple Pay', icon: <Smartphone size={20} color={colors.text} />, type: 'wallet' },
    { id: 'google-pay', name: 'Google Pay', icon: <Smartphone size={20} color={colors.text} />, type: 'wallet' },
    { id: 'card-visa', name: 'Visa •••• 4242', icon: <CreditCard size={20} color="#1A1F71" />, type: 'card' },
    { id: 'card-master', name: 'Mastercard •••• 8888', icon: <CreditCard size={20} color="#EB001B" />, type: 'card' },
    { id: 'bank-chase', name: 'Chase Bank •••• 1234', icon: <Building2 size={20} color="#117ACA" />, type: 'bank' },
    { id: 'gift-card', name: 'Gift Card Balance ($50.00)', icon: <Gift size={20} color={colors.accent} />, type: 'gift' },
    ...cryptoPayments,
  ];

  const updateQuantity = useCallback((itemId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const handleScanBarcode = useCallback(() => {
    if (Platform.OS === 'web') {
      Alert.alert('Scanner', 'Barcode scanner is only available on mobile devices. Use manual SKU entry instead.');
    } else {
      setShowScanner(true);
    }
  }, []);

  const addScannedItem = useCallback((sku: string) => {
    console.log('Adding scanned item with SKU:', sku);
    const newItem: CartItem = {
      id: `scanned-${Date.now()}`,
      name: `Product SKU: ${sku}`,
      price: 0,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      sku,
      isScanned: true,
    };
    setCartItems(prev => [...prev, newItem]);
    setManualSku('');
    setShowScanner(false);
    Alert.alert('Product Added', `Item with SKU ${sku} added to cart. Price will be confirmed at checkout.`);
  }, []);

  const applyPromoCode = useCallback(() => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 10 });
      Alert.alert('Promo Applied', '10% discount applied to your order!');
    } else if (promoCode.toUpperCase() === 'FIRST20') {
      setAppliedPromo({ code: 'FIRST20', discount: 20 });
      Alert.alert('Promo Applied', '20% discount applied to your order!');
    } else {
      Alert.alert('Invalid Code', 'This promo code is not valid.');
    }
    setPromoCode('');
  }, [promoCode]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleCheckout = useCallback(() => {
    if (!selectedPayment) {
      Alert.alert('Select Payment', 'Please select a payment method to continue.');
      return;
    }
    console.log('Processing checkout with:', selectedPayment.name);
    Alert.alert(
      'Order Confirmed!', 
      `Your order of $${total.toFixed(2)} has been placed using ${selectedPayment.name}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }, [selectedPayment, total, router]);

  const dynamicStyles = {
    container: { backgroundColor: colors.background },
    surface: { backgroundColor: colors.surface },
    text: { color: colors.text },
    textSecondary: { color: colors.textSecondary },
    border: { borderColor: colors.border },
    primary: { color: colors.primary },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Stack.Screen options={{ title: 'Shopping Cart' }} />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, dynamicStyles.text]}>Checkout</Text>
        <View style={styles.headerBadge}>
          <ShoppingBag size={20} color={colors.primary} />
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={[styles.scanSection, dynamicStyles.surface]}
          onPress={handleScanBarcode}
        >
          <View style={[styles.scanIconBox, { backgroundColor: colors.primary + '15' }]}>
            <ScanBarcode size={24} color={colors.primary} />
          </View>
          <View style={styles.scanInfo}>
            <Text style={[styles.scanTitle, dynamicStyles.text]}>Scan Product Barcode</Text>
            <Text style={[styles.scanSubtitle, dynamicStyles.textSecondary]}>
              <Text>Add items not on the menu by scanning SKU</Text>
            </Text>
          </View>
          <QrCode size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.manualSkuSection, dynamicStyles.surface]}>
          <Text style={[styles.sectionLabel, dynamicStyles.textSecondary]}>Manual SKU Entry</Text>
          <View style={styles.manualSkuRow}>
            <TextInput
              style={[styles.skuInput, dynamicStyles.border, dynamicStyles.text]}
              placeholder="Enter SKU code..."
              placeholderTextColor={colors.textTertiary}
              value={manualSku}
              onChangeText={setManualSku}
            />
            <TouchableOpacity 
              style={[styles.addSkuBtn, { backgroundColor: colors.primary }]}
              onPress={handleScanBarcode}
            >
              <ScanBarcode size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Cart Items</Text>
          <Text style={[styles.itemCount, dynamicStyles.textSecondary]}>{cartItems.length} items</Text>
        </View>

        {cartItems.length === 0 ? (
          <View style={[styles.emptyCart, dynamicStyles.surface]}>
            <ShoppingBag size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, dynamicStyles.text]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtitle, dynamicStyles.textSecondary]}>
              <Text>Scan products or browse the shop to add items</Text>
            </Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={[styles.cartItem, dynamicStyles.surface]}>
              {item.isScanned && (
                <View style={[styles.scannedBadge, { backgroundColor: colors.accent + '15' }]}>
                  <ScanBarcode size={12} color={colors.accent} />
                  <Text style={[styles.scannedText, { color: colors.accent }]}>Scanned</Text>
                </View>
              )}
              <View style={styles.itemContent}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemName, dynamicStyles.text]} numberOfLines={2}>{item.name}</Text>
                  {item.merchantName && (
                    <Text style={[styles.merchantName, dynamicStyles.textSecondary]}>{item.merchantName}</Text>
                  )}
                  {item.sku && (
                    <Text style={[styles.skuText, dynamicStyles.textSecondary]}>SKU: {item.sku}</Text>
                  )}
                  <View style={styles.itemPriceRow}>
                    <Text style={[styles.itemPrice, { color: colors.primary }]}>
                      {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Price TBD'}
                    </Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={[styles.qtyBtn, dynamicStyles.border]}
                        onPress={() => updateQuantity(item.id, -1)}
                      >
                        <Minus size={16} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.qtyText, dynamicStyles.text]}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={[styles.qtyBtn, dynamicStyles.border]}
                        onPress={() => updateQuantity(item.id, 1)}
                      >
                        <Plus size={16} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={[styles.promoSection, dynamicStyles.surface]}>
          <View style={styles.promoHeader}>
            <Tag size={18} color={colors.primary} />
            <Text style={[styles.promoTitle, dynamicStyles.text]}>Promo Code</Text>
          </View>
          {appliedPromo ? (
            <View style={[styles.appliedPromo, { backgroundColor: colors.accent + '15' }]}>
              <Percent size={16} color={colors.accent} />
              <Text style={[styles.appliedPromoText, { color: colors.accent }]}>
                {appliedPromo.code} - {appliedPromo.discount}% OFF
              </Text>
              <TouchableOpacity onPress={() => setAppliedPromo(null)}>
                <X size={16} color={colors.accent} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputRow}>
              <TextInput
                style={[styles.promoInput, dynamicStyles.border, dynamicStyles.text]}
                placeholder="Enter code..."
                placeholderTextColor={colors.textTertiary}
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity 
                style={[styles.applyBtn, { backgroundColor: colors.primary }]}
                onPress={applyPromoCode}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.paymentSection, dynamicStyles.surface]}>
          <Text style={[styles.paymentTitle, dynamicStyles.text]}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentSelector, dynamicStyles.border]}
            onPress={() => setShowPaymentModal(true)}
          >
            {selectedPayment ? (
              <View style={styles.selectedPayment}>
                {selectedPayment.icon}
                <Text style={[styles.selectedPaymentText, dynamicStyles.text]}>
                  {selectedPayment.name}
                </Text>
              </View>
            ) : (
              <Text style={[styles.selectPaymentText, dynamicStyles.textSecondary]}>
                <Text>Select payment method</Text>
              </Text>
            )}
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>

          <View style={styles.paymentHint}>
            <Wallet size={14} color={colors.textTertiary} />
            <Text style={[styles.paymentHintText, dynamicStyles.textSecondary]}>
              Pay with card, bank, wallet, or crypto
            </Text>
          </View>
        </View>

        <View style={[styles.summarySection, dynamicStyles.surface]}>
          <Text style={[styles.summaryTitle, dynamicStyles.text]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, dynamicStyles.textSecondary]}>Subtotal</Text>
            <Text style={[styles.summaryValue, dynamicStyles.text]}>${subtotal.toFixed(2)}</Text>
          </View>
          {appliedPromo && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.accent }]}>Discount ({appliedPromo.discount}%)</Text>
              <Text style={[styles.summaryValue, { color: colors.accent }]}>-${discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, dynamicStyles.textSecondary]}>Tax (8%)</Text>
            <Text style={[styles.summaryValue, dynamicStyles.text]}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, dynamicStyles.text]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom || 20, backgroundColor: colors.backgroundSecondary, borderTopColor: colors.border }]}>
        <View style={styles.checkoutInfo}>
          <Text style={[styles.checkoutLabel, dynamicStyles.textSecondary]}>Total</Text>
          <Text style={[styles.checkoutTotal, { color: colors.primary }]}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutBtn, { backgroundColor: colors.primary, opacity: cartItems.length > 0 ? 1 : 0.5 }]}
          onPress={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.surface, { paddingBottom: insets.bottom || 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.paymentGroupTitle, dynamicStyles.textSecondary]}>Digital Wallets</Text>
              {paymentMethods.filter(p => p.type === 'wallet').map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selectedPayment?.id === method.id && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                >
                  {method.icon}
                  <Text style={[styles.paymentOptionText, dynamicStyles.text]}>{method.name}</Text>
                  {selectedPayment?.id === method.id && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}

              <Text style={[styles.paymentGroupTitle, dynamicStyles.textSecondary]}>Cards</Text>
              {paymentMethods.filter(p => p.type === 'card').map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selectedPayment?.id === method.id && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                >
                  {method.icon}
                  <Text style={[styles.paymentOptionText, dynamicStyles.text]}>{method.name}</Text>
                  {selectedPayment?.id === method.id && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}

              <Text style={[styles.paymentGroupTitle, dynamicStyles.textSecondary]}>Bank Account</Text>
              {paymentMethods.filter(p => p.type === 'bank').map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selectedPayment?.id === method.id && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                >
                  {method.icon}
                  <Text style={[styles.paymentOptionText, dynamicStyles.text]}>{method.name}</Text>
                  {selectedPayment?.id === method.id && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}

              <Text style={[styles.paymentGroupTitle, dynamicStyles.textSecondary]}>Gift Card</Text>
              {paymentMethods.filter(p => p.type === 'gift').map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selectedPayment?.id === method.id && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                >
                  {method.icon}
                  <Text style={[styles.paymentOptionText, dynamicStyles.text]}>{method.name}</Text>
                  {selectedPayment?.id === method.id && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}

              <Text style={[styles.paymentGroupTitle, dynamicStyles.textSecondary]}>Cryptocurrency</Text>
              {paymentMethods.filter(p => p.type === 'crypto').map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.paymentOption, selectedPayment?.id === method.id && { backgroundColor: colors.primary + '15' }]}
                  onPress={() => {
                    setSelectedPayment(method);
                    setShowPaymentModal(false);
                  }}
                >
                  {method.icon}
                  <View style={styles.cryptoInfo}>
                    <Text style={[styles.paymentOptionText, dynamicStyles.text]}>{method.name}</Text>
                    {method.balance !== undefined && (
                      <Text style={[styles.cryptoBalance, dynamicStyles.textSecondary]}>
                        {method.balance.toFixed(4)} {method.symbol}
                      </Text>
                    )}
                  </View>
                  {selectedPayment?.id === method.id && <Check size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showScanner}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.scannerModal, dynamicStyles.surface, { paddingBottom: insets.bottom || 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Scan Barcode</Text>
              <TouchableOpacity onPress={() => setShowScanner(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.scannerPlaceholder, { backgroundColor: colors.backgroundTertiary }]}>
              <ScanBarcode size={64} color={colors.textTertiary} />
              <Text style={[styles.scannerText, dynamicStyles.textSecondary]}>
                <Text>Position barcode within frame</Text>
              </Text>
            </View>

            <Text style={[styles.orText, dynamicStyles.textSecondary]}>or enter SKU manually</Text>
            
            <View style={styles.manualSkuRow}>
              <TextInput
                style={[styles.skuInput, dynamicStyles.border, dynamicStyles.text, { flex: 1 }]}
                placeholder="Enter SKU code..."
                placeholderTextColor={colors.textTertiary}
                value={manualSku}
                onChangeText={setManualSku}
              />
              <TouchableOpacity 
                style={[styles.addSkuBtn, { backgroundColor: colors.primary }]}
                onPress={() => manualSku && addScannedItem(manualSku)}
              >
                <Plus size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  headerBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scanSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    gap: 12,
  },
  scanIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanInfo: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  scanSubtitle: {
    fontSize: 13,
  },
  manualSkuSection: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  manualSkuRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skuInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  addSkuBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  itemCount: {
    fontSize: 13,
  },
  emptyCart: {
    padding: 40,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  cartItem: {
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  scannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scannedText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  merchantName: {
    fontSize: 12,
    marginBottom: 2,
  },
  skuText: {
    fontSize: 11,
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600' as const,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteBtn: {
    padding: 4,
  },
  promoSection: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  promoInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  applyBtn: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
  },
  appliedPromoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  paymentSection: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  selectedPaymentText: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  selectPaymentText: {
    fontSize: 15,
  },
  paymentHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  paymentHintText: {
    fontSize: 12,
  },
  summarySection: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
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
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  checkoutInfo: {},
  checkoutLabel: {
    fontSize: 12,
  },
  checkoutTotal: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  checkoutBtnText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  paymentGroupTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    borderRadius: 10,
    gap: 12,
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 15,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoBalance: {
    fontSize: 12,
    marginTop: 2,
  },
  scannerModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  scannerPlaceholder: {
    height: 250,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  scannerText: {
    fontSize: 14,
    marginTop: 16,
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
});
