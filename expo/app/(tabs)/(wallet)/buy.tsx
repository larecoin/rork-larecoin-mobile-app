import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Building2, Wallet, ChevronDown, Check, Info, ShieldCheck, Zap, Clock, Calendar, Target, Repeat, X, Trash2, Play, Pause, AlertCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: typeof CreditCard;
  fee: string;
  time: string;
  color: string;
}

interface CryptoOption {
  id: string;
  symbol: string;
  name: string;
  price: number;
  icon: string;
}

interface ScheduledBuyOrder {
  id: string;
  crypto: CryptoOption;
  amount: number;
  type: 'price_target' | 'date_time' | 'recurring';
  targetPrice?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  recurringInterval?: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%', time: 'Instant', color: '#3498DB' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%', time: '1-3 days', color: '#27AE60' },
  { id: 'wallet', name: 'Wallet Balance (LUSD)', icon: Wallet, fee: '0%', time: 'Instant', color: '#D4AF37' },
];

const cryptoOptions: CryptoOption[] = [
  { id: 'lare', symbol: 'LARE', name: 'LareCoin', price: 1.25, icon: '🪙' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, icon: '₿' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2650.00, icon: 'Ξ' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, icon: '💵' },
  { id: 'lusd', symbol: 'LUSD', name: 'Lare USD', price: 1.00, icon: '💎' },
];

const recurringIntervals = [
  { id: 'hourly', label: 'Hourly', description: 'Every hour' },
  { id: 'daily', label: 'Daily', description: 'Once per day' },
  { id: 'weekly', label: 'Weekly', description: 'Once per week' },
  { id: 'monthly', label: 'Monthly', description: 'Once per month' },
];

const mockScheduledOrders: ScheduledBuyOrder[] = [
  { 
    id: '1', 
    crypto: cryptoOptions[1], 
    amount: 100, 
    type: 'price_target', 
    targetPrice: 40000,
    createdAt: '2025-01-24',
    status: 'active'
  },
  { 
    id: '2', 
    crypto: cryptoOptions[0], 
    amount: 50, 
    type: 'recurring', 
    recurringInterval: 'weekly',
    createdAt: '2025-01-20',
    status: 'active'
  },
];

export default function BuyCrypto() {
  const router = useRouter();
  const { colors } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption>(cryptoOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(paymentMethods[0]);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  
  const [scheduleType, setScheduleType] = useState<'instant' | 'price_target' | 'date_time'>('instant');
  const [targetPrice, setTargetPrice] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('');
  const [showRecurringSelector, setShowRecurringSelector] = useState(false);
  
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledBuyOrder[]>(mockScheduledOrders);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const fee = selectedPayment.id === 'wallet' ? 0 : numericAmount * (parseFloat(selectedPayment.fee) / 100);
  const totalCost = numericAmount + fee;
  const cryptoAmount = numericAmount / selectedCrypto.price;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleCancelOrder = (orderId: string) => {
    setScheduledOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' as const } : order
    ));
  };

  const handleDeleteOrder = (orderId: string) => {
    setScheduledOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const activeOrders = scheduledOrders.filter(o => o.status === 'active');

  const getScheduleTypeIcon = (type: string) => {
    switch (type) {
      case 'price_target': return <Target size={16} color={colors.accent} />;
      case 'date_time': return <Calendar size={16} color={colors.primary} />;
      case 'recurring': return <Repeat size={16} color="#27AE60" />;
      default: return <Clock size={16} color={colors.textSecondary} />;
    }
  };

  const getScheduleDescription = (order: ScheduledBuyOrder) => {
    switch (order.type) {
      case 'price_target':
        return `Buy when ${order.crypto.symbol} drops to ${order.targetPrice?.toLocaleString()}`;
      case 'date_time':
        return `Auto buy on ${order.scheduledDate} at ${order.scheduledTime}`;
      case 'recurring':
        return `${order.recurringInterval?.charAt(0).toUpperCase()}${order.recurringInterval?.slice(1)} recurring buy`;
      default:
        return '';
    }
  };

  const isValidScheduledOrder = () => {
    if (numericAmount <= 0) return false;
    if (scheduleType === 'price_target' && (!targetPrice || parseFloat(targetPrice) <= 0)) return false;
    if (scheduleType === 'date_time' && (!scheduledDate || !scheduledTime)) return false;
    if (isRecurring && !recurringInterval) return false;
    return true;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>I want to buy</Text>
        
        <TouchableOpacity 
          style={[styles.cryptoSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowCryptoSelector(!showCryptoSelector)}
        >
          <View style={styles.cryptoInfo}>
            <Text style={styles.cryptoIcon}>{selectedCrypto.icon}</Text>
            <View>
              <Text style={[styles.cryptoSymbol, { color: colors.text }]}>{selectedCrypto.symbol}</Text>
              <Text style={[styles.cryptoName, { color: colors.textSecondary }]}>{selectedCrypto.name}</Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showCryptoSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {cryptoOptions.map(crypto => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.dropdownItem,
                  selectedCrypto.id === crypto.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoSelector(false);
                }}
              >
                <Text style={styles.cryptoIcon}>{crypto.icon}</Text>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{crypto.symbol}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>{crypto.name}</Text>
                </View>
                <Text style={[styles.dropdownItemPrice, { color: colors.textSecondary }]}>${crypto.price.toLocaleString()}</Text>
                {selectedCrypto.id === crypto.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Amount (USD)</Text>
        
        <View style={[styles.amountInputContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.quickAmounts}>
          {quickAmounts.map(quickAmount => (
            <TouchableOpacity
              key={quickAmount}
              style={[
                styles.quickAmountBtn,
                { backgroundColor: colors.background },
                amount === quickAmount.toString() && { backgroundColor: colors.primary }
              ]}
              onPress={() => setAmount(quickAmount.toString())}
            >
              <Text style={[
                styles.quickAmountText,
                { color: colors.textSecondary },
                amount === quickAmount.toString() && { color: colors.background }
              ]}>
                ${quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {numericAmount > 0 && (
          <View style={[styles.receiveBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.receiveLabel, { color: colors.textSecondary }]}>You will receive approximately</Text>
            <Text style={[styles.receiveAmount, { color: colors.text }]}>
              {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method</Text>
        
        <TouchableOpacity 
          style={[styles.paymentSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowPaymentSelector(!showPaymentSelector)}
        >
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIcon, { backgroundColor: selectedPayment.color + '20' }]}>
              <selectedPayment.icon size={20} color={selectedPayment.color} />
            </View>
            <View>
              <Text style={[styles.paymentName, { color: colors.text }]}>{selectedPayment.name}</Text>
              <Text style={[styles.paymentDetails, { color: colors.textSecondary }]}>
                Fee: {selectedPayment.fee} • {selectedPayment.time}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showPaymentSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.dropdownItem,
                  selectedPayment.id === method.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedPayment(method);
                  setShowPaymentSelector(false);
                }}
              >
                <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                  <method.icon size={18} color={method.color} />
                </View>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{method.name}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    Fee: {method.fee} • {method.time}
                  </Text>
                </View>
                {selectedPayment.id === method.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Schedule Options Card */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Buy Schedule</Text>
        </View>

        <View style={styles.scheduleTypeRow}>
          <TouchableOpacity
            style={[
              styles.scheduleTypeBtn,
              { backgroundColor: scheduleType === 'instant' ? colors.primary : colors.background }
            ]}
            onPress={() => { setScheduleType('instant'); setIsRecurring(false); }}
          >
            <Clock size={16} color={scheduleType === 'instant' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.scheduleTypeBtnText, { color: scheduleType === 'instant' ? '#FFFFFF' : colors.textSecondary }]}>
              <Text>Instant</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.scheduleTypeBtn,
              { backgroundColor: scheduleType === 'price_target' ? colors.accent : colors.background }
            ]}
            onPress={() => setScheduleType('price_target')}
          >
            <Target size={16} color={scheduleType === 'price_target' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.scheduleTypeBtnText, { color: scheduleType === 'price_target' ? '#FFFFFF' : colors.textSecondary }]}>
              <Text>Price Target</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.scheduleTypeBtn,
              { backgroundColor: scheduleType === 'date_time' ? colors.primary : colors.background }
            ]}
            onPress={() => setScheduleType('date_time')}
          >
            <Calendar size={16} color={scheduleType === 'date_time' ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.scheduleTypeBtnText, { color: scheduleType === 'date_time' ? '#FFFFFF' : colors.textSecondary }]}>
              Date & Time
            </Text>
          </TouchableOpacity>
        </View>

        {scheduleType === 'price_target' && (
          <View style={styles.scheduleInputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Buy when {selectedCrypto.symbol} drops to:
            </Text>
            <View style={[styles.priceInputContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
              <TextInput
                style={[styles.priceInput, { color: colors.text }]}
                placeholder="Enter target price"
                placeholderTextColor={colors.textTertiary}
                value={targetPrice}
                onChangeText={setTargetPrice}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.currentPriceInfo, { backgroundColor: colors.backgroundSecondary }]}>
              <Text style={[styles.currentPriceLabel, { color: colors.textSecondary }]}>Current Price:</Text>
              <Text style={[styles.currentPriceValue, { color: colors.text }]}>
                ${selectedCrypto.price.toLocaleString()}
              </Text>
              {parseFloat(targetPrice) > 0 && (
                <Text style={[
                  styles.priceChangeIndicator,
                  { color: parseFloat(targetPrice) < selectedCrypto.price ? '#27AE60' : colors.error }
                ]}>
                  ({parseFloat(targetPrice) < selectedCrypto.price ? '' : '+'}{(((parseFloat(targetPrice) - selectedCrypto.price) / selectedCrypto.price) * 100).toFixed(2)}%)
                </Text>
              )}
            </View>
          </View>
        )}

        {scheduleType === 'date_time' && (
          <View style={styles.scheduleInputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Auto buy on:
            </Text>
            <View style={styles.dateTimeRow}>
              <View style={[styles.dateInputContainer, { backgroundColor: colors.background }]}>
                <Calendar size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.dateInput, { color: colors.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textTertiary}
                  value={scheduledDate}
                  onChangeText={setScheduledDate}
                />
              </View>
              <View style={[styles.timeInputContainer, { backgroundColor: colors.background }]}>
                <Clock size={18} color={colors.textSecondary} />
                <TextInput
                  style={[styles.timeInput, { color: colors.text }]}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textTertiary}
                  value={scheduledTime}
                  onChangeText={setScheduledTime}
                />
              </View>
            </View>
            <Text style={[styles.helperText, { color: colors.textTertiary }]}>
              <Text>Order will execute automatically at the specified date and time</Text>
            </Text>
          </View>
        )}

        {scheduleType !== 'instant' && (
          <View style={[styles.recurringSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.recurringToggle}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View style={styles.recurringToggleLeft}>
                <Repeat size={18} color={isRecurring ? '#27AE60' : colors.textSecondary} />
                <Text style={[styles.recurringToggleText, { color: colors.text }]}>
                  <Text>Make this a recurring buy</Text>
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                { backgroundColor: isRecurring ? '#27AE60' : 'transparent', borderColor: isRecurring ? '#27AE60' : colors.border }
              ]}>
                {isRecurring && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            {isRecurring && (
              <View style={styles.recurringOptions}>
                <TouchableOpacity
                  style={[styles.recurringSelector, { backgroundColor: colors.background }]}
                  onPress={() => setShowRecurringSelector(!showRecurringSelector)}
                >
                  <Text style={[styles.recurringSelectorText, { color: recurringInterval ? colors.text : colors.textTertiary }]}>
                    {recurringInterval ? recurringIntervals.find(r => r.id === recurringInterval)?.label : 'Select frequency'}
                  </Text>
                  <ChevronDown size={18} color={colors.textSecondary} />
                </TouchableOpacity>

                {showRecurringSelector && (
                  <View style={[styles.recurringDropdown, { backgroundColor: colors.backgroundSecondary }]}>
                    {recurringIntervals.map(interval => (
                      <TouchableOpacity
                        key={interval.id}
                        style={[
                          styles.recurringDropdownItem,
                          recurringInterval === interval.id && { backgroundColor: '#27AE60' + '20' }
                        ]}
                        onPress={() => {
                          setRecurringInterval(interval.id);
                          setShowRecurringSelector(false);
                        }}
                      >
                        <View>
                          <Text style={[styles.recurringDropdownTitle, { color: colors.text }]}>{interval.label}</Text>
                          <Text style={[styles.recurringDropdownDesc, { color: colors.textSecondary }]}>{interval.description}</Text>
                        </View>
                        {recurringInterval === interval.id && <Check size={18} color="#27AE60" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={[styles.recurringNotice, { backgroundColor: colors.primary + '15' }]}>
                  <AlertCircle size={16} color={colors.primary} />
                  <Text style={[styles.recurringNoticeText, { color: colors.primary }]}>
                    <Text>Recurring buys will execute automatically using your selected payment method</Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Scheduled Orders Section */}
      {activeOrders.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Scheduled Buy Orders ({activeOrders.length})
            </Text>
            <TouchableOpacity onPress={() => setShowOrdersModal(true)}>
              <Text style={[styles.toggleText, { color: colors.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>

          {activeOrders.slice(0, 2).map(order => (
            <View 
              key={order.id} 
              style={[styles.scheduledOrderCard, { backgroundColor: colors.background }]}
            >
              <View style={styles.orderCardLeft}>
                <View style={styles.orderCardIcon}>
                  {getScheduleTypeIcon(order.type)}
                </View>
                <View>
                  <Text style={[styles.orderCardAmount, { color: colors.text }]}>
                    ${order.amount} → {order.crypto.symbol}
                  </Text>
                  <Text style={[styles.orderCardDesc, { color: colors.textSecondary }]}>
                    {getScheduleDescription(order)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.cancelOrderBtn}
                onPress={() => handleCancelOrder(order.id)}
              >
                <X size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))}

          {activeOrders.length > 2 && (
            <TouchableOpacity 
              style={styles.viewAllBtn}
              onPress={() => setShowOrdersModal(true)}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View all {activeOrders.length} orders
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${numericAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Fee ({selectedPayment.fee})</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${fee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>${totalCost.toFixed(2)}</Text>
        </View>

        {scheduleType !== 'instant' && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Order Type</Text>
            <View style={styles.orderTypeBadge}>
              {getScheduleTypeIcon(scheduleType)}
              <Text style={[styles.orderTypeBadgeText, { color: colors.text }]}>
                {scheduleType === 'price_target' ? 'Price Target' : 'Scheduled'}
                {isRecurring && ' (Recurring)'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
          <ShieldCheck size={20} color={colors.accent} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Secure & encrypted transactions</Text>
        </View>
        <View style={[styles.infoItem, { backgroundColor: colors.surface }]}>
          <Zap size={20} color={colors.warning} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>Instant delivery to your wallet</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.buyButton,
          { backgroundColor: scheduleType === 'instant' ? colors.primary : colors.accent },
          ((numericAmount <= 0) || 
           (scheduleType !== 'instant' && !isValidScheduledOrder())) && styles.buyButtonDisabled
        ]}
        disabled={(numericAmount <= 0) || 
                  (scheduleType !== 'instant' && !isValidScheduledOrder())}
      >
        {scheduleType === 'instant' ? (
          <Text style={[styles.buyButtonText, { color: colors.background }]}>
            Buy {selectedCrypto.symbol}
          </Text>
        ) : (
          <Text style={[styles.buyButtonText, { color: '#FFFFFF' }]}>
            Schedule {isRecurring ? 'Recurring ' : ''}Buy Order
          </Text>
        )}
      </TouchableOpacity>

      {/* Manage Orders Modal */}
      <Modal
        visible={showOrdersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOrdersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Scheduled Buy Orders</Text>
              <TouchableOpacity onPress={() => setShowOrdersModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {scheduledOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Calendar size={48} color={colors.textTertiary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    <Text>No scheduled buy orders</Text>
                  </Text>
                </View>
              ) : (
                scheduledOrders.map(order => (
                  <View 
                    key={order.id} 
                    style={[
                      styles.modalOrderCard, 
                      { backgroundColor: colors.background },
                      order.status === 'cancelled' && styles.cancelledOrder
                    ]}
                  >
                    <View style={styles.modalOrderHeader}>
                      <View style={styles.modalOrderLeft}>
                        <Text style={styles.modalOrderIcon}>{order.crypto.icon}</Text>
                        <View>
                          <Text style={[styles.modalOrderAmount, { color: colors.text }]}>
                            ${order.amount} → {order.crypto.symbol}
                          </Text>
                          <Text style={[styles.modalOrderValue, { color: colors.textSecondary }]}>
                            ≈ {(order.amount / order.crypto.price).toFixed(6)} {order.crypto.symbol}
                          </Text>
                        </View>
                      </View>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: order.status === 'active' ? '#27AE60' + '20' : colors.error + '20' }
                      ]}>
                        <Text style={[
                          styles.statusBadgeText,
                          { color: order.status === 'active' ? '#27AE60' : colors.error }
                        ]}>
                          {order.status === 'active' ? 'Active' : 'Cancelled'}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.modalOrderDetails, { borderTopColor: colors.border }]}>
                      <View style={styles.modalOrderDetailRow}>
                        {getScheduleTypeIcon(order.type)}
                        <Text style={[styles.modalOrderDetailText, { color: colors.textSecondary }]}>
                          {getScheduleDescription(order)}
                        </Text>
                      </View>
                      <Text style={[styles.modalOrderCreated, { color: colors.textTertiary }]}>
                        Created: {order.createdAt}
                      </Text>
                    </View>

                    {order.status === 'active' && (
                      <View style={styles.modalOrderActions}>
                        <TouchableOpacity 
                          style={[styles.modalActionBtn, { backgroundColor: colors.error + '15' }]}
                          onPress={() => handleCancelOrder(order.id)}
                        >
                          <X size={16} color={colors.error} />
                          <Text style={[styles.modalActionBtnText, { color: colors.error }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.modalActionBtn, { backgroundColor: colors.textTertiary + '20' }]}
                          onPress={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 size={16} color={colors.textSecondary} />
                          <Text style={[styles.modalActionBtnText, { color: colors.textSecondary }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {order.status === 'cancelled' && (
                      <TouchableOpacity 
                        style={[styles.deleteFullBtn, { backgroundColor: colors.error + '15' }]}
                        onPress={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 size={16} color={colors.error} />
                        <Text style={[styles.deleteFullBtnText, { color: colors.error }]}>Remove from list</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 0,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cryptoIcon: {
    fontSize: 28,
  },
  cryptoSymbol: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  cryptoName: {
    fontSize: 13,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  dropdownItemInfo: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  dropdownItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownItemPrice: {
    fontSize: 13,
    marginRight: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700' as const,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  receiveBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  receiveLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  receiveAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  paymentDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  infoSection: {
    marginHorizontal: 16,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 13,
  },
  buyButton: {
    margin: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  scheduleTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  scheduleTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  scheduleTypeBtnText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  scheduleInputSection: {
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 14,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  currentPriceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  currentPriceLabel: {
    fontSize: 12,
  },
  currentPriceValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  priceChangeIndicator: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateInputContainer: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: 14,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  timeInputContainer: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: 14,
  },
  timeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  helperText: {
    fontSize: 11,
    marginTop: 8,
  },
  recurringSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recurringToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recurringToggleText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recurringOptions: {
    marginTop: 14,
  },
  recurringSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
  },
  recurringSelectorText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  recurringDropdown: {
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  recurringDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  recurringDropdownTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  recurringDropdownDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  recurringNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  recurringNoticeText: {
    flex: 1,
    fontSize: 12,
  },
  scheduledOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  orderCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  orderCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCardAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  orderCardDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  cancelOrderBtn: {
    padding: 8,
  },
  viewAllBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  orderTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderTypeBadgeText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  modalBody: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
  },
  modalOrderCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cancelledOrder: {
    opacity: 0.6,
  },
  modalOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalOrderIcon: {
    fontSize: 28,
  },
  modalOrderAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalOrderValue: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  modalOrderDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  modalOrderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalOrderDetailText: {
    fontSize: 13,
    flex: 1,
  },
  modalOrderCreated: {
    fontSize: 11,
    marginTop: 6,
  },
  modalOrderActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalActionBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  deleteFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteFullBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
