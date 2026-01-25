import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Scale, TrendingUp, TrendingDown, Calendar, Info, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Option {
  strike: number;
  expiry: string;
  callPrice: number;
  putPrice: number;
  callIV: number;
  putIV: number;
}

export default function OptionsScreen() {
  const { colors } = useApp();
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [selectedExpiry, setSelectedExpiry] = useState('Jan 31');

  const currentPrice = 42150.00;
  
  const expiries = ['Jan 31', 'Feb 7', 'Feb 28', 'Mar 28'];
  
  const options: Option[] = [
    { strike: 40000, expiry: 'Jan 31', callPrice: 2450.50, putPrice: 180.20, callIV: 52.3, putIV: 48.5 },
    { strike: 41000, expiry: 'Jan 31', callPrice: 1650.80, putPrice: 320.40, callIV: 50.1, putIV: 49.2 },
    { strike: 42000, expiry: 'Jan 31', callPrice: 980.20, putPrice: 580.60, callIV: 48.5, putIV: 50.8 },
    { strike: 43000, expiry: 'Jan 31', callPrice: 520.40, putPrice: 1020.80, callIV: 47.2, putIV: 52.1 },
    { strike: 44000, expiry: 'Jan 31', callPrice: 280.60, putPrice: 1680.20, callIV: 46.8, putIV: 54.3 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <Scale size={22} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Options Trading</Text>
        </View>
        <View style={styles.spotPrice}>
          <Text style={[styles.spotLabel, { color: colors.textSecondary }]}>BTC Spot Price</Text>
          <Text style={[styles.spotValue, { color: colors.text }]}>${currentPrice.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.expirySection}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Expiration Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.expiryOptions}>
            {expiries.map(exp => (
              <TouchableOpacity
                key={exp}
                style={[
                  styles.expiryBtn,
                  { backgroundColor: colors.surface },
                  selectedExpiry === exp && { backgroundColor: colors.primary }
                ]}
                onPress={() => setSelectedExpiry(exp)}
              >
                <Text style={[styles.expiryText, { color: selectedExpiry === exp ? '#FFFFFF' : colors.textSecondary }]}>
                  {exp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.typeToggle, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.typeBtn, optionType === 'call' && { backgroundColor: '#10B981' }]}
          onPress={() => setOptionType('call')}
        >
          <TrendingUp size={16} color={optionType === 'call' ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.typeBtnText, { color: optionType === 'call' ? '#FFFFFF' : colors.textSecondary }]}>Call Options</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.typeBtn, optionType === 'put' && { backgroundColor: '#EF4444' }]}
          onPress={() => setOptionType('put')}
        >
          <TrendingDown size={16} color={optionType === 'put' ? '#FFFFFF' : colors.textSecondary} />
          <Text style={[styles.typeBtnText, { color: optionType === 'put' ? '#FFFFFF' : colors.textSecondary }]}>Put Options</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chainHeader}>
        <Text style={[styles.chainHeaderText, { color: colors.textSecondary }]}>Strike</Text>
        <Text style={[styles.chainHeaderText, { color: colors.textSecondary }]}>Price</Text>
        <Text style={[styles.chainHeaderText, { color: colors.textSecondary }]}>IV</Text>
        <Text style={[styles.chainHeaderText, { color: colors.textSecondary }]}>Action</Text>
      </View>

      <View style={styles.optionsChain}>
        {options.map((opt, index) => {
          const price = optionType === 'call' ? opt.callPrice : opt.putPrice;
          const iv = optionType === 'call' ? opt.callIV : opt.putIV;
          const isITM = optionType === 'call' ? opt.strike < currentPrice : opt.strike > currentPrice;
          
          return (
            <View 
              key={index} 
              style={[
                styles.optionRow, 
                { backgroundColor: colors.surface },
                isITM && { borderLeftWidth: 3, borderLeftColor: optionType === 'call' ? '#10B981' : '#EF4444' }
              ]}
            >
              <View style={styles.strikeCol}>
                <Text style={[styles.strikeText, { color: colors.text }]}>${opt.strike.toLocaleString()}</Text>
                {isITM && <Text style={[styles.itmLabel, { color: optionType === 'call' ? '#10B981' : '#EF4444' }]}>ITM</Text>}
              </View>
              <Text style={[styles.priceText, { color: colors.text }]}>${price.toFixed(2)}</Text>
              <Text style={[styles.ivText, { color: colors.textSecondary }]}>{iv}%</Text>
              <TouchableOpacity style={[styles.buyBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.buyBtnText}>Buy</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <Info size={18} color={colors.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Options Basics</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Call options profit when price rises above strike{'\n'}
            • Put options profit when price falls below strike{'\n'}
            • ITM (In The Money) = currently profitable{'\n'}
            • IV = Implied Volatility, higher = more expensive
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  spotPrice: {
    alignItems: 'center',
  },
  spotLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  spotValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  expirySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 10,
  },
  expiryOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  expiryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  expiryText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  typeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  chainHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  chainHeaderText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  optionsChain: {
    paddingHorizontal: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  strikeCol: {
    flex: 1,
  },
  strikeText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  itmLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  priceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  ivText: {
    flex: 1,
    fontSize: 13,
  },
  buyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 20,
  },
});
