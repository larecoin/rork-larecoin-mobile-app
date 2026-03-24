import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditCard, QrCode, Receipt, Plus, Minus, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function POSScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [amount, setAmount] = useState('0.00');

  const handleNumber = (num: string) => {
    if (amount === '0.00') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleClear = () => setAmount('0.00');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Point of Sale' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.displayCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.displayLabel, { color: colors.textTertiary }]}>Amount</Text>
          <Text style={[styles.displayAmount, { color: colors.text }]}>${amount}</Text>
        </View>

        <View style={styles.keypadContainer}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.keypadButton, { backgroundColor: colors.surface }]}
              onPress={() => key === '⌫' ? handleClear() : handleNumber(key)}
            >
              <Text style={[styles.keypadText, { color: colors.text }]}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <QrCode size={24} color="#FFF" />
            <Text style={styles.actionText}>Generate QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.success }]}>
            <CreditCard size={24} color="#FFF" />
            <Text style={styles.actionText}>Charge</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.historyButton, { backgroundColor: colors.surface }]}>
          <Receipt size={20} color={colors.primary} />
          <Text style={[styles.historyText, { color: colors.text }]}>View Transaction History</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  displayCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  displayLabel: { fontSize: 14, marginBottom: 8 },
  displayAmount: { fontSize: 48, fontWeight: '700' as const },
  keypadContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  keypadButton: { width: '31%', aspectRatio: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  keypadText: { fontSize: 24, fontWeight: '600' as const },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 20, gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 14, gap: 10 },
  actionText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
  historyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, padding: 16, borderRadius: 12, gap: 10 },
  historyText: { fontSize: 15, fontWeight: '500' as const },
});
