import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Package,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Edit2,
  Trash2,
  Box,
  Tag,
  Layers
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  price: number;
  cost: number;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Espresso Beans (1kg)', sku: 'COF-001', category: 'Coffee', quantity: 45, minStock: 20, price: 24.99, cost: 15.00, lastUpdated: '2h ago' },
  { id: '2', name: 'Oat Milk (1L)', sku: 'MLK-002', category: 'Dairy Alt', quantity: 8, minStock: 15, price: 4.99, cost: 2.50, lastUpdated: '1h ago' },
  { id: '3', name: 'Paper Cups (500pc)', sku: 'SUP-003', category: 'Supplies', quantity: 3, minStock: 10, price: 35.00, cost: 22.00, lastUpdated: '30m ago' },
  { id: '4', name: 'Croissants', sku: 'BAK-004', category: 'Bakery', quantity: 24, minStock: 10, price: 3.50, cost: 1.20, lastUpdated: '4h ago' },
  { id: '5', name: 'Vanilla Syrup (750ml)', sku: 'SYR-005', category: 'Syrups', quantity: 12, minStock: 5, price: 12.99, cost: 6.50, lastUpdated: '1d ago' },
  { id: '6', name: 'Almond Milk (1L)', sku: 'MLK-006', category: 'Dairy Alt', quantity: 15, minStock: 10, price: 5.49, cost: 2.80, lastUpdated: '3h ago' },
];

export default function InventoryManager() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Coffee', 'Dairy Alt', 'Bakery', 'Syrups', 'Supplies'];

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.minStock);
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const totalRetailValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock * 0.5) return 'critical';
    if (item.quantity <= item.minStock) return 'low';
    return 'good';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Manager</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Package size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{mockInventory.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.warning + '20' }]}>
              <AlertTriangle size={18} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>{lowStockItems.length}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.accent + '20' }]}>
              <BarChart3 size={18} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>${totalValue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Cost Value</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items or SKU..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {lowStockItems.length > 0 && (
          <View style={styles.alertBanner}>
            <AlertTriangle size={18} color={Colors.warning} />
            <Text style={styles.alertText}>{lowStockItems.length} items need restocking</Text>
            <TouchableOpacity>
              <Text style={styles.alertAction}>View</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inventoryList}>
          {filteredInventory.map(item => {
            const status = getStockStatus(item);
            return (
              <TouchableOpacity key={item.id} style={styles.inventoryCard}>
                <View style={styles.inventoryHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: Colors.primary + '20' }]}>
                    <Tag size={12} color={Colors.primary} />
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.sku}>{item.sku}</Text>
                </View>
                
                <Text style={styles.itemName}>{item.name}</Text>
                
                <View style={styles.inventoryDetails}>
                  <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Quantity</Text>
                    <View style={styles.quantityRow}>
                      <Text style={[
                        styles.quantityValue,
                        status === 'critical' && styles.quantityCritical,
                        status === 'low' && styles.quantityLow
                      ]}>
                        {item.quantity}
                      </Text>
                      {status !== 'good' && (
                        <View style={[
                          styles.stockBadge,
                          status === 'critical' ? styles.stockCritical : styles.stockLow
                        ]}>
                          <TrendingDown size={10} color={status === 'critical' ? Colors.error : Colors.warning} />
                          <Text style={[
                            styles.stockBadgeText,
                            { color: status === 'critical' ? Colors.error : Colors.warning }
                          ]}>
                            {status === 'critical' ? 'Critical' : 'Low'}
                          </Text>
                        </View>
                      )}
                      {status === 'good' && (
                        <View style={styles.stockGood}>
                          <TrendingUp size={10} color={Colors.accent} />
                          <Text style={[styles.stockBadgeText, { color: Colors.accent }]}>Good</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.minStock}>Min: {item.minStock}</Text>
                  </View>
                  
                  <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Cost</Text>
                      <Text style={styles.priceValue}>${item.cost.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceValue}>${item.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Margin</Text>
                      <Text style={[styles.priceValue, { color: Colors.accent }]}>
                        {(((item.price - item.cost) / item.price) * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.inventoryFooter}>
                  <Text style={styles.lastUpdated}>Updated {item.lastUpdated}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Edit2 size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.error + '15' }]}>
                      <Trash2 size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Box size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Layers size={20} color={Colors.accent} />
            <Text style={styles.quickActionText}>Bulk Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <BarChart3 size={20} color="#9B59B6" />
            <Text style={styles.quickActionText}>Reports</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.background,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: Colors.warning + '15',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  alertAction: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.warning,
  },
  inventoryList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  inventoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  sku: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  inventoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quantitySection: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  quantityCritical: {
    color: Colors.error,
  },
  quantityLow: {
    color: Colors.warning,
  },
  minStock: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockCritical: {
    backgroundColor: Colors.error + '15',
  },
  stockLow: {
    backgroundColor: Colors.warning + '15',
  },
  stockGood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.accent + '15',
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  priceSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  inventoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lastUpdated: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
});
