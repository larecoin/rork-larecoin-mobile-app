import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import TransactionItem from '@/components/TransactionItem';
import { TransactionType } from '@/mocks/transactions';

type FilterType = 'all' | TransactionType;

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'send', label: 'Sent' },
  { key: 'receive', label: 'Received' },
  { key: 'swap', label: 'Swaps' },
  { key: 'purchase', label: 'Purchases' },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const { userTransactions } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTransactions = activeFilter === 'all' 
    ? userTransactions 
    : userTransactions.filter(t => t.type === activeFilter);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Transactions',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.taxButton}
              onPress={() => router.push('/menu/tax-center')}
            >
              <Receipt size={18} color={Colors.primary} />
              <Text style={styles.taxButtonText}>Taxes</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.key && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === item.key && styles.filterTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionWrapper}>
            <TransactionItem transaction={item} />
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  filterContainer: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  list: {
    padding: 16,
  },
  transactionWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  taxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  taxButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
