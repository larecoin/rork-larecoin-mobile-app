import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, Wallet, ChevronDown, Check, TrendingDown, Clock, AlertCircle, Calendar, Target, Repeat, X, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface WithdrawMethod {
  id: string;
  name: string;
  icon: typeof Building2;
  fee: string;
  time: string;
  color: string;
}

interface CryptoHolding {
  id: string;
  symbol: string;
  name: string;
  price: number;
  balance: number;
  icon: string;
}

interface ScheduledSellOrder {
  id: string;
  crypto: CryptoHolding;
  amount: number;
  type: 'price_target' | 'date_time' | 'recurring';
  targetPrice?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  recurringInterval?: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

const withdrawMethods: WithdrawMethod[] = [
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%', time: '1-3 days', color: '#27AE60' },
  { id: 'wallet', name: 'Convert to LUSD', icon: Wallet, fee: '0.1%', time: 'Instant', color: '#D4AF37' },
];

const cryptoHoldings: CryptoHolding[] = [
  { id: 'lare', symbol: 'LARE', name: 'LareCoin', price: 1.25, balance: 12450.75, icon: '🪙' },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 43250.00, balance: 0.0845, icon: '₿' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 2650.00, balance: 2.5, icon: 'Ξ' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, balance: 1500.00, icon: '💵' },
  { id: 'lusd', symbol: 'LUSD', name: 'Lare USD', price: 1.00, balance: 5280.50, icon: '💎' },
];

const recurringIntervals = [
  { id: 'hourly', label: 'Hourly', description: 'Every hour' },
  { id: 'daily', label: 'Daily', description: 'Once per day' },
  { id: 'weekly', label: 'Weekly', description: 'Once per week' },
  { id: 'monthly', label: 'Monthly', description: 'Once per month' },
];

const mockScheduledOrders: ScheduledSellOrder[] = [
  { 
    id: '1', 
    crypto: cryptoHoldings[1], 
    amount: 0.01, 
    type: 'price_target', 
    targetPrice: 50000,
    createdAt: '2025-01-24',
    status: 'active'
  },
  { 
    id: '2', 
    crypto: cryptoHoldings[2], 
    amount: 0.5, 
    type: 'date_time', 
    scheduledDate: '2025-02-01',
    scheduledTime: '09:00',
    createdAt: '2025-01-23',
    status: 'active'
  },
  { 
    id: '3', 
    crypto: cryptoHoldings[0], 
    amount: 100, 
    type: 'recurring', 
    recurringInterval: 'weekly',
    createdAt: '2025-01-20',
    status: 'active'
  },
];

export default function SellCrypto() {
  const router = useRouter();
  const { colors } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoHolding>(cryptoHoldings[0]);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawMethod>(withdrawMethods[0]);
  const [showCryptoSelector, setShowCryptoSelector] = useState(false);
  const [showWithdrawSelector, setShowWithdrawSelector] = useState(false);
  const [inputMode, setInputMode] = useState<'crypto' | 'usd'>('crypto');
  
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);
  const [scheduleType, setScheduleType] = useState<'instant' | 'price_target' | 'date_time'>('instant');
  const [targetPrice, setTargetPrice] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('');
  const [showRecurringSelector, setShowRecurringSelector] = useState(false);
  
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledSellOrder[]>(mockScheduledOrders);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const cryptoAmount = inputMode === 'crypto' ? numericAmount : numericAmount / selectedCrypto.price;
  const usdAmount = inputMode === 'usd' ? numericAmount : numericAmount * selectedCrypto.price;
  const fee = usdAmount * (parseFloat(selectedWithdraw.fee) / 100);
  const totalReceive = usdAmount - fee;
  const maxAmount = inputMode === 'crypto' ? selectedCrypto.balance : selectedCrypto.balance * selectedCrypto.price;

  const percentages = [25, 50, 75, 100];

  const handlePercentage = (percent: number) => {
    const value = (maxAmount * percent) / 100;
    setAmount(value.toFixed(inputMode === 'crypto' ? 6 : 2));
  };

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

  const getScheduleDescription = (order: ScheduledSellOrder) => {
    switch (order.type) {
      case 'price_target':
        return `Sell when ${order.crypto.symbol} reaches $${order.targetPrice?.toLocaleString()}`;
      case 'date_time':
        return `Auto sell on ${order.scheduledDate} at ${order.scheduledTime}`;
      case 'recurring':
        return `${order.recurringInterval?.charAt(0).toUpperCase()}${order.recurringInterval?.slice(1)} recurring sell`;
      default:
        return '';
    }
  };

  const isValidScheduledOrder = () => {
    if (numericAmount <= 0 || numericAmount > maxAmount) return false;
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
        <Text style={[styles.cardTitle, { color: colors.text }]}>I want to sell</Text>
        
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
          <View style={styles.cryptoBalance}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Balance</Text>
            <Text style={[styles.balanceValue, { color: colors.text }]}>{selectedCrypto.balance.toLocaleString()}</Text>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showCryptoSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {cryptoHoldings.map(crypto => (
              <TouchableOpacity
                key={crypto.id}
                style={[
                  styles.dropdownItem,
                  selectedCrypto.id === crypto.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedCrypto(crypto);
                  setShowCryptoSelector(false);
                  setAmount('');
                }}
              >
                <Text style={styles.cryptoIcon}>{crypto.icon}</Text>
                <View style={styles.dropdownItemInfo}>
                  <Text style={[styles.dropdownItemTitle, { color: colors.text }]}>{crypto.symbol}</Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    Balance: {crypto.balance.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.dropdownItemValue}>
                  <Text style={[styles.dropdownItemPrice, { color: colors.text }]}>
                    ${(crypto.balance * crypto.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Text>
                  <Text style={[styles.dropdownItemSubtitle, { color: colors.textSecondary }]}>
                    @ ${crypto.price.toLocaleString()}
                  </Text>
                </View>
                {selectedCrypto.id === crypto.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Amount</Text>
          <View style={[styles.modeToggle, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
              style={[styles.modeBtn, inputMode === 'crypto' && { backgroundColor: colors.primary }]}
              onPress={() => { setInputMode('crypto'); setAmount(''); }}
            >
              <Text style={[styles.modeBtnText, { color: inputMode === 'crypto' ? colors.background : colors.textSecondary }]}>
                {selectedCrypto.symbol}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeBtn, inputMode === 'usd' && { backgroundColor: colors.primary }]}
              onPress={() => { setInputMode('usd'); setAmount(''); }}
            >
              <Text style={[styles.modeBtnText, { color: inputMode === 'usd' ? colors.background : colors.textSecondary }]}>
                USD
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.amountInputContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>
            {inputMode === 'usd' ? '$' : selectedCrypto.icon}
          </Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.percentageRow}>
          {percentages.map(percent => (
            <TouchableOpacity
              key={percent}
              style={[styles.percentageBtn, { backgroundColor: colors.background }]}
              onPress={() => handlePercentage(percent)}
            >
              <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{percent}%</Text>
            </TouchableOpacity>
          ))}
        </View>

        {numericAmount > maxAmount && (
          <View style={[styles.warningBox, { backgroundColor: colors.error + '15' }]}>
            <AlertCircle size={16} color={colors.error} />
            <Text style={[styles.warningText, { color: colors.error }]}>Insufficient balance</Text>
          </View>
        )}

        {numericAmount > 0 && numericAmount <= maxAmount && (
          <View style={[styles.convertBox, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.convertRow}>
              <Text style={[styles.convertLabel, { color: colors.textSecondary }]}>Selling</Text>
              <Text style={[styles.convertValue, { color: colors.text }]}>
                {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
              </Text>
            </View>
            <View style={styles.convertRow}>
              <Text style={[styles.convertLabel, { color: colors.textSecondary }]}>@ Market Price</Text>
              <Text style={[styles.convertValue, { color: colors.text }]}>
                ${selectedCrypto.price.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Schedule Options Card */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sell Schedule</Text>
          <TouchableOpacity onPress={() => setShowScheduleOptions(!showScheduleOptions)}>
            <Text style={[styles.toggleText, { color: colors.primary }]}>
              {showScheduleOptions ? 'Hide Options' : 'Schedule Sell'}
            </Text>
          </TouchableOpacity>
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
              Sell when {selectedCrypto.symbol} reaches:
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
                  { color: parseFloat(targetPrice) > selectedCrypto.price ? '#27AE60' : colors.error }
                ]}>
                  ({parseFloat(targetPrice) > selectedCrypto.price ? '+' : ''}{(((parseFloat(targetPrice) - selectedCrypto.price) / selectedCrypto.price) * 100).toFixed(2)}%)
                </Text>
              )}
            </View>
          </View>
        )}

        {scheduleType === 'date_time' && (
          <View style={styles.scheduleInputSection}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Auto sell on:
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
                  <Text>Make this a recurring sell</Text>
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

                <View style={[styles.recurringNotice, { backgroundColor: colors.accent + '15' }]}>
                  <AlertCircle size={16} color={colors.accent} />
                  <Text style={[styles.recurringNoticeText, { color: colors.accent }]}>
                    <Text>Recurring sells will only execute if you have sufficient balance</Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Receive Funds Via</Text>
        
        <TouchableOpacity 
          style={[styles.paymentSelector, { backgroundColor: colors.background }]}
          onPress={() => setShowWithdrawSelector(!showWithdrawSelector)}
        >
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIcon, { backgroundColor: selectedWithdraw.color + '20' }]}>
              <selectedWithdraw.icon size={20} color={selectedWithdraw.color} />
            </View>
            <View>
              <Text style={[styles.paymentName, { color: colors.text }]}>{selectedWithdraw.name}</Text>
              <Text style={[styles.paymentDetails, { color: colors.textSecondary }]}>
                Fee: {selectedWithdraw.fee} • {selectedWithdraw.time}
              </Text>
            </View>
          </View>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {showWithdrawSelector && (
          <View style={[styles.dropdown, { backgroundColor: colors.backgroundSecondary }]}>
            {withdrawMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.dropdownItem,
                  selectedWithdraw.id === method.id && { backgroundColor: colors.primary + '20' }
                ]}
                onPress={() => {
                  setSelectedWithdraw(method);
                  setShowWithdrawSelector(false);
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
                {selectedWithdraw.id === method.id && <Check size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Scheduled Orders Section */}
      {activeOrders.length > 0 && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Scheduled Sell Orders ({activeOrders.length})
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
                    {order.amount} {order.crypto.symbol}
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
        <Text style={[styles.summaryTitle, { color: colors.text }]}>Sale Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Sell Amount</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            {cryptoAmount.toFixed(6)} {selectedCrypto.symbol}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Value at Market</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>${usdAmount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Fee ({selectedWithdraw.fee})</Text>
          <Text style={[styles.summaryValue, { color: colors.error }]}>-${fee.toFixed(2)}</Text>
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
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>You'll Receive</Text>
          <Text style={[styles.totalValue, { color: colors.accent }]}>${totalReceive.toFixed(2)}</Text>
        </View>

        <View style={[styles.timeInfo, { backgroundColor: colors.backgroundSecondary }]}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {scheduleType === 'instant' 
              ? `Estimated arrival: ${selectedWithdraw.time}`
              : scheduleType === 'price_target'
                ? `Executes when price reaches $${targetPrice || '...'}`
                : `Scheduled for ${scheduledDate || '...'} at ${scheduledTime || '...'}`
            }
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.sellButton,
          { backgroundColor: scheduleType === 'instant' ? colors.error : colors.primary },
          ((numericAmount <= 0 || numericAmount > maxAmount) || 
           (scheduleType !== 'instant' && !isValidScheduledOrder())) && styles.sellButtonDisabled
        ]}
        disabled={(numericAmount <= 0 || numericAmount > maxAmount) || 
                  (scheduleType !== 'instant' && !isValidScheduledOrder())}
      >
        {scheduleType === 'instant' ? (
          <TrendingDown size={20} color="#FFFFFF" />
        ) : (
          <Calendar size={20} color="#FFFFFF" />
        )}
        <Text style={styles.sellButtonText}>
          {scheduleType === 'instant' 
            ? `Sell ${selectedCrypto.symbol}` 
            : `Schedule ${isRecurring ? 'Recurring ' : ''}Sell Order`
          }
        </Text>
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
              <Text style={[styles.modalTitle, { color: colors.text }]}>Scheduled Sell Orders</Text>
              <TouchableOpacity onPress={() => setShowOrdersModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {scheduledOrders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Calendar size={48} color={colors.textTertiary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    <Text>No scheduled sell orders</Text>
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
                            {order.amount} {order.crypto.symbol}
                          </Text>
                          <Text style={[styles.modalOrderValue, { color: colors.textSecondary }]}>
                            ≈ ${(order.amount * order.crypto.price).toFixed(2)}
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
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
  },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  cryptoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  cryptoBalance: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 11,
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  dropdownItemValue: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  dropdownItemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  percentageRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  percentageBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  convertBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  convertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  convertLabel: {
    fontSize: 13,
  },
  convertValue: {
    fontSize: 13,
    fontWeight: '600' as const,
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
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
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
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 13,
    flex: 1,
  },
  sellButton: {
    margin: 16,
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  sellButtonDisabled: {
    opacity: 0.5,
  },
  sellButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
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
