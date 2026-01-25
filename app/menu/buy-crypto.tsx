import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, Building2, Smartphone, ChevronDown, ArrowRight, Info, RefreshCw, Clock, Calendar, X, Trash2, Play, Pause, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const cryptoOptions = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { id: 'lrc', name: 'Larecoin', symbol: 'LRC', icon: 'L' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '$' },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, fee: '2.5%' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, fee: '0.5%' },
  { id: 'apple', name: 'Apple Pay', icon: Smartphone, fee: '2.0%' },
];

const recurringSchedules = [
  { id: 'hourly', label: 'Hourly', description: 'Every hour' },
  { id: 'daily', label: 'Daily', description: 'Once a day' },
  { id: 'weekly', label: 'Weekly', description: 'Once a week' },
  { id: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month' },
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = ['12:00 AM', '6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

interface RecurringOrder {
  id: string;
  crypto: typeof cryptoOptions[0];
  amount: string;
  schedule: typeof recurringSchedules[0];
  dayOfWeek?: number;
  time: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  nextExecution: string;
}

const mockRecurringOrders: RecurringOrder[] = [
  {
    id: '1',
    crypto: cryptoOptions[0],
    amount: '50',
    schedule: recurringSchedules[2],
    dayOfWeek: 1,
    time: '9:00 AM',
    startDate: '2025-01-01',
    isActive: true,
    nextExecution: 'Mon, Jan 27 at 9:00 AM',
  },
  {
    id: '2',
    crypto: cryptoOptions[1],
    amount: '100',
    schedule: recurringSchedules[4],
    time: '12:00 PM',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    isActive: false,
    nextExecution: 'Feb 1 at 12:00 PM',
  },
];

export default function BuyCryptoScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [amount, setAmount] = useState('100');
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoOptions[2]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(recurringSchedules[1]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>(mockRecurringOrders);

  const quickAmounts = ['50', '100', '250', '500', '1000'];

  const toggleOrderStatus = (orderId: string) => {
    setRecurringOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, isActive: !order.isActive } : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setRecurringOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const getScheduleDescription = () => {
    if (selectedSchedule.id === 'weekly' || selectedSchedule.id === 'biweekly') {
      return `Every ${selectedSchedule.id === 'biweekly' ? '2 ' : ''}${weekDays[selectedDay]} at ${selectedTime}`;
    }
    if (selectedSchedule.id === 'monthly') {
      return `1st of every month at ${selectedTime}`;
    }
    if (selectedSchedule.id === 'daily') {
      return `Every day at ${selectedTime}`;
    }
    return selectedSchedule.description;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Buy Crypto' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>You Pay</Text>
          <View style={[styles.inputCard, { backgroundColor: colors.surface }]}>
            <View style={styles.inputRow}>
              <Text style={[styles.currency, { color: colors.text }]}>$</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={[styles.currencyLabel, { color: colors.textTertiary }]}>USD</Text>
            </View>
            <View style={styles.quickAmounts}>
              {quickAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[
                    styles.quickAmount,
                    { backgroundColor: amount === amt ? colors.primary : colors.background }
                  ]}
                  onPress={() => setAmount(amt)}
                >
                  <Text style={[
                    styles.quickAmountText,
                    { color: amount === amt ? '#FFF' : colors.text }
                  ]}>
                    ${amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <View style={[styles.arrowCircle, { backgroundColor: colors.surface }]}>
            <ArrowRight size={20} color={colors.primary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>You Receive</Text>
          <TouchableOpacity style={[styles.selectCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.cryptoIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.cryptoIconText, { color: colors.primary }]}>{selectedCrypto.icon}</Text>
            </View>
            <View style={styles.cryptoInfo}>
              <Text style={[styles.cryptoName, { color: colors.text }]}>{selectedCrypto.name}</Text>
              <Text style={[styles.cryptoSymbol, { color: colors.textTertiary }]}>{selectedCrypto.symbol}</Text>
            </View>
            <ChevronDown size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <View style={[styles.receiveAmount, { backgroundColor: colors.surface, marginTop: 12 }]}>
            <Text style={[styles.receiveLabel, { color: colors.textTertiary }]}>≈</Text>
            <Text style={[styles.receiveValue, { color: colors.text }]}>
              {(parseFloat(amount || '0') / 1.5).toFixed(4)} {selectedCrypto.symbol}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Payment Method</Text>
          <View style={[styles.paymentCard, { backgroundColor: colors.surface }]}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  { borderBottomColor: colors.border },
                  index === paymentMethods.length - 1 && styles.paymentOptionLast,
                  selectedPayment.id === method.id && { backgroundColor: colors.primary + '10' }
                ]}
                onPress={() => setSelectedPayment(method)}
              >
                <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '15' }]}>
                  <method.icon size={20} color={colors.primary} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentName, { color: colors.text }]}>{method.name}</Text>
                  <Text style={[styles.paymentFee, { color: colors.textTertiary }]}>Fee: {method.fee}</Text>
                </View>
                <View style={[
                  styles.radio,
                  { borderColor: selectedPayment.id === method.id ? colors.primary : colors.border }
                ]}>
                  {selectedPayment.id === method.id && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Recurring Buy</Text>
          <View style={[styles.recurringCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={styles.recurringToggle}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <View style={[styles.recurringIcon, { backgroundColor: colors.primary + '15' }]}>
                <RefreshCw size={20} color={colors.primary} />
              </View>
              <View style={styles.recurringInfo}>
                <Text style={[styles.recurringTitle, { color: colors.text }]}>Set as Recurring Buy</Text>
                <Text style={[styles.recurringDesc, { color: colors.textTertiary }]}>
                  Automatically buy on a schedule
                </Text>
              </View>
              <View style={[
                styles.toggle,
                { backgroundColor: isRecurring ? colors.primary : colors.border }
              ]}>
                <View style={[
                  styles.toggleKnob,
                  { transform: [{ translateX: isRecurring ? 18 : 2 }] }
                ]} />
              </View>
            </TouchableOpacity>

            {isRecurring && (
              <View style={[styles.scheduleContainer, { borderTopColor: colors.border }]}>
                <View style={styles.scheduleHeader}>
                  <Clock size={14} color={colors.textTertiary} />
                  <Text style={[styles.scheduleLabel, { color: colors.textTertiary }]}>Frequency</Text>
                </View>
                <View style={styles.scheduleOptions}>
                  {recurringSchedules.map((schedule) => (
                    <TouchableOpacity
                      key={schedule.id}
                      style={[
                        styles.scheduleOption,
                        { 
                          backgroundColor: selectedSchedule.id === schedule.id ? colors.primary : colors.background,
                          borderColor: selectedSchedule.id === schedule.id ? colors.primary : colors.border,
                        }
                      ]}
                      onPress={() => setSelectedSchedule(schedule)}
                    >
                      <Text style={[
                        styles.scheduleOptionText,
                        { color: selectedSchedule.id === schedule.id ? '#FFF' : colors.text }
                      ]}>
                        {schedule.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {(selectedSchedule.id === 'weekly' || selectedSchedule.id === 'biweekly') && (
                  <View style={styles.dayTimeSection}>
                    <Text style={[styles.subLabel, { color: colors.textTertiary }]}>Day of Week</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                      <View style={styles.dayOptions}>
                        {weekDays.map((day, index) => (
                          <TouchableOpacity
                            key={day}
                            style={[
                              styles.dayOption,
                              { 
                                backgroundColor: selectedDay === index ? colors.primary : colors.background,
                                borderColor: selectedDay === index ? colors.primary : colors.border,
                              }
                            ]}
                            onPress={() => setSelectedDay(index)}
                          >
                            <Text style={[
                              styles.dayOptionText,
                              { color: selectedDay === index ? '#FFF' : colors.text }
                            ]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {selectedSchedule.id !== 'hourly' && (
                  <View style={styles.dayTimeSection}>
                    <Text style={[styles.subLabel, { color: colors.textTertiary }]}>Time</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                      <View style={styles.dayOptions}>
                        {timeSlots.map((time) => (
                          <TouchableOpacity
                            key={time}
                            style={[
                              styles.timeOption,
                              { 
                                backgroundColor: selectedTime === time ? colors.primary : colors.background,
                                borderColor: selectedTime === time ? colors.primary : colors.border,
                              }
                            ]}
                            onPress={() => setSelectedTime(time)}
                          >
                            <Text style={[
                              styles.timeOptionText,
                              { color: selectedTime === time ? '#FFF' : colors.text }
                            ]}>
                              {time}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                <View style={[styles.endDateToggle, { borderTopColor: colors.border }]}>
                  <View style={styles.endDateInfo}>
                    <Calendar size={16} color={colors.textTertiary} />
                    <Text style={[styles.endDateLabel, { color: colors.text }]}>Set End Date</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.miniToggle,
                      { backgroundColor: hasEndDate ? colors.primary : colors.border }
                    ]}
                    onPress={() => setHasEndDate(!hasEndDate)}
                  >
                    <View style={[
                      styles.miniToggleKnob,
                      { transform: [{ translateX: hasEndDate ? 12 : 2 }] }
                    ]} />
                  </TouchableOpacity>
                </View>

                {hasEndDate && (
                  <View style={[styles.endDatePicker, { backgroundColor: colors.background }]}>
                    <Text style={[styles.endDateText, { color: colors.textTertiary }]}>
                      Recurring buy will end after 12 months (Jan 25, 2027)
                    </Text>
                  </View>
                )}

                <View style={[styles.scheduleNote, { backgroundColor: colors.background }]}>
                  <Text style={[styles.scheduleNoteText, { color: colors.text }]}>
                    {getScheduleDescription()}
                  </Text>
                  <Text style={[styles.scheduleNoteAmount, { color: colors.primary }]}>
                    ${amount || '0'} USD per execution
                  </Text>
                </View>
              </View>
            )}
          </View>

          {recurringOrders.length > 0 && (
            <TouchableOpacity 
              style={[styles.manageOrdersBtn, { backgroundColor: colors.background }]}
              onPress={() => setShowRecurringModal(true)}
            >
              <View style={styles.manageOrdersLeft}>
                <RefreshCw size={16} color={colors.primary} />
                <Text style={[styles.manageOrdersText, { color: colors.text }]}>
                  Manage Recurring Orders ({recurringOrders.length})
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>${amount || '0'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Fee ({selectedPayment.fee})</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${(parseFloat(amount || '0') * parseFloat(selectedPayment.fee) / 100).toFixed(2)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              ${(parseFloat(amount || '0') * (1 + parseFloat(selectedPayment.fee) / 100)).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.primary + '10' }]}>
          <Info size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Crypto will be credited to your wallet within 5-10 minutes after payment confirmation.
          </Text>
        </View>

        <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.buyButtonText}>
            {isRecurring ? `Set ${selectedSchedule.label} Buy` : `Buy ${selectedCrypto.symbol}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showRecurringModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRecurringModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Recurring Orders</Text>
            <TouchableOpacity 
              style={[styles.modalClose, { backgroundColor: colors.surface }]}
              onPress={() => setShowRecurringModal(false)}
            >
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {recurringOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <RefreshCw size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Recurring Orders</Text>
                <Text style={[styles.emptyDesc, { color: colors.textTertiary }]}>
                  Set up automatic buys to dollar-cost average into your favorite assets.
                </Text>
              </View>
            ) : (
              recurringOrders.map((order) => (
                <View 
                  key={order.id} 
                  style={[
                    styles.orderCard, 
                    { backgroundColor: colors.surface, opacity: order.isActive ? 1 : 0.6 }
                  ]}
                >
                  <View style={styles.orderTop}>
                    <View style={styles.orderCrypto}>
                      <View style={[styles.orderCryptoIcon, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.orderCryptoIconText, { color: colors.primary }]}>
                          {order.crypto.icon}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.orderCryptoName, { color: colors.text }]}>
                          {order.crypto.name}
                        </Text>
                        <Text style={[styles.orderAmount, { color: colors.primary }]}>
                          ${order.amount} USD
                        </Text>
                      </View>
                    </View>
                    <View style={[
                      styles.statusBadge, 
                      { backgroundColor: order.isActive ? colors.success + '20' : colors.textTertiary + '20' }
                    ]}>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: order.isActive ? colors.success : colors.textTertiary }
                      ]} />
                      <Text style={[
                        styles.statusText, 
                        { color: order.isActive ? colors.success : colors.textTertiary }
                      ]}>
                        {order.isActive ? 'Active' : 'Paused'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.orderDetails, { borderTopColor: colors.border }]}>
                    <View style={styles.orderDetailRow}>
                      <Text style={[styles.orderDetailLabel, { color: colors.textTertiary }]}>Schedule</Text>
                      <Text style={[styles.orderDetailValue, { color: colors.text }]}>
                        {order.schedule.label}{order.dayOfWeek !== undefined ? ` (${weekDays[order.dayOfWeek]})` : ''}
                      </Text>
                    </View>
                    <View style={styles.orderDetailRow}>
                      <Text style={[styles.orderDetailLabel, { color: colors.textTertiary }]}>Time</Text>
                      <Text style={[styles.orderDetailValue, { color: colors.text }]}>{order.time}</Text>
                    </View>
                    <View style={styles.orderDetailRow}>
                      <Text style={[styles.orderDetailLabel, { color: colors.textTertiary }]}>Next Execution</Text>
                      <Text style={[styles.orderDetailValue, { color: colors.text }]}>{order.nextExecution}</Text>
                    </View>
                    {order.endDate && (
                      <View style={styles.orderDetailRow}>
                        <Text style={[styles.orderDetailLabel, { color: colors.textTertiary }]}>Ends</Text>
                        <Text style={[styles.orderDetailValue, { color: colors.text }]}>{order.endDate}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.orderActions}>
                    <TouchableOpacity 
                      style={[
                        styles.orderActionBtn, 
                        { backgroundColor: order.isActive ? colors.warning + '15' : colors.success + '15' }
                      ]}
                      onPress={() => toggleOrderStatus(order.id)}
                    >
                      {order.isActive ? (
                        <Pause size={16} color={colors.warning} />
                      ) : (
                        <Play size={16} color={colors.success} />
                      )}
                      <Text style={[
                        styles.orderActionText, 
                        { color: order.isActive ? colors.warning : colors.success }
                      ]}>
                        {order.isActive ? 'Pause' : 'Resume'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.orderActionBtn, { backgroundColor: colors.error + '15' }]}
                      onPress={() => deleteOrder(order.id)}
                    >
                      <Trash2 size={16} color={colors.error} />
                      <Text style={[styles.orderActionText, { color: colors.error }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  inputCard: {
    padding: 16,
    borderRadius: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 32,
    fontWeight: '300' as const,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600' as const,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  quickAmount: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  cryptoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cryptoIconText: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  cryptoSymbol: {
    fontSize: 13,
  },
  receiveAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  receiveLabel: {
    fontSize: 18,
  },
  receiveValue: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  paymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  paymentOptionLast: {
    borderBottomWidth: 0,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  paymentFee: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
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
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
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
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  buyButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  recurringCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recurringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recurringIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recurringInfo: {
    flex: 1,
  },
  recurringTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  recurringDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFF',
  },
  scheduleContainer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  scheduleLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scheduleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scheduleOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  scheduleOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  scheduleNote: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  scheduleNoteText: {
    fontSize: 13,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  scheduleNoteAmount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  dayTimeSection: {
    marginTop: 16,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  dayScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  dayOptions: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  dayOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayOptionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeOptionText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  endDateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  endDateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  endDateLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  miniToggle: {
    width: 32,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  miniToggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  endDatePicker: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  endDateText: {
    fontSize: 12,
    textAlign: 'center',
  },
  manageOrdersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  manageOrdersLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manageOrdersText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  orderCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  orderCrypto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderCryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCryptoIconText: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  orderCryptoName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
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
  orderDetails: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetailLabel: {
    fontSize: 13,
  },
  orderDetailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  orderActions: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 0,
    gap: 10,
  },
  orderActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  orderActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
