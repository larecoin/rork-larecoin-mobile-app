import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Package, Plus, ShoppingBag, Zap, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const products = [
  { id: '1', name: 'Premium API Access', price: '$99/mo', type: 'subscription', sales: 45 },
  { id: '2', name: 'Trading Bot License', price: '$299', type: 'one-time', sales: 128 },
  { id: '3', name: 'NFT Creation Service', price: '$49', type: 'service', sales: 89 },
];

export default function ProductsServicesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Products & Services' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Package size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Sell Digital Products</Text>
          <Text style={styles.heroSubtitle}>Create and sell digital products, subscriptions, and services</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <ShoppingBag size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Products</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Zap size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>262</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Sales</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Create New Product</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Products</Text>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.productIcon, { backgroundColor: colors.primary + '15' }]}>
                <Package size={22} color={colors.primary} />
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
                <View style={styles.productMeta}>
                  <Text style={[styles.productPrice, { color: colors.success }]}>{product.price}</Text>
                  <Text style={[styles.productSales, { color: colors.textTertiary }]}>{product.sales} sales</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  heroCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginTop: 12, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700' as const, marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, paddingVertical: 16, borderRadius: 14, gap: 10 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  productCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 10 },
  productIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: '600' as const, marginBottom: 4 },
  productMeta: { flexDirection: 'row', gap: 12 },
  productPrice: { fontSize: 13, fontWeight: '600' as const },
  productSales: { fontSize: 12 },
});
