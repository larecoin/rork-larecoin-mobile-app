import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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
  Layers,
  X,
  ChevronDown,
  Palette,
  Ruler,
  DollarSign,
  Settings2,
  PlusCircle,
  Minus,
  FolderOpen,
  MoreVertical,
  <Text>Check</Text>
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CustomAttribute {
  id: string;
  name: string;
  type: 'size' | 'color' | 'material' | 'style' | 'custom';
  values: AttributeValue[];
}

interface AttributeValue {
  id: string;
  value: string;
  priceModifier: number;
  stockQuantity: number;
}

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
  attributes?: CustomAttribute[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  itemCount: number;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Coffee', color: '#8B4513', itemCount: 1 },
  { id: '2', name: 'Dairy Alt', color: '#87CEEB', itemCount: 2 },
  { id: '3', name: 'Bakery', color: '#DEB887', itemCount: 1 },
  { id: '4', name: 'Syrups', color: '#FFD700', itemCount: 1 },
  { id: '5', name: 'Supplies', color: '#708090', itemCount: 1 },
];

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    category: 'Coffee',
    quantity: 0,
    minStock: 0,
    price: 0,
    cost: 0,
  });
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([]);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [newAttribute, setNewAttribute] = useState<{
    name: string;
    type: 'size' | 'color' | 'material' | 'style' | 'custom';
  }>({ name: '', type: 'custom' });
  const [editingAttributeId, setEditingAttributeId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366F1' });
  const [showCategoryMenu, setShowCategoryMenu] = useState<string | null>(null);

  const categoryColors = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', '#14B8A6',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899',
  ];

  const categoryNames = ['All', ...categories.map(c => c.name)];

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.minStock);
  const totalValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
  const totalRetailValue = mockInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      color: newCategory.color,
      itemCount: 0,
    };
    setCategories([...categories, category]);
    setNewCategory({ name: '', color: '#6366F1' });
    setShowCategoryModal(false);
    console.log('Category added:', category);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.name.trim()) return;
    setCategories(categories.map(c => 
      c.id === editingCategory.id 
        ? { ...c, name: newCategory.name.trim(), color: newCategory.color }
        : c
    ));
    setEditingCategory(null);
    setNewCategory({ name: '', color: '#6366F1' });
    setShowCategoryModal(false);
    console.log('Category updated:', editingCategory.id);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(c => c.id !== categoryId));
    setShowCategoryMenu(null);
    if (selectedCategory === categories.find(c => c.id === categoryId)?.name) {
      setSelectedCategory('All');
    }
    console.log('Category deleted:', categoryId);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, color: category.color });
    setShowCategoryModal(true);
    setShowCategoryMenu(null);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const attributeTypes = [
    { id: 'size', label: 'Size', icon: Ruler, examples: 'S, M, L, XL' },
    { id: 'color', label: 'Color', icon: Palette, examples: 'Red, Blue, Green' },
    { id: 'material', label: 'Material', icon: Layers, examples: 'Cotton, Polyester' },
    { id: 'style', label: 'Style', icon: Settings2, examples: 'Classic, Modern' },
    { id: 'custom', label: 'Custom', icon: Tag, examples: 'Any attribute' },
  ];

  const addAttribute = () => {
    if (!newAttribute.name.trim()) return;
    const attr: CustomAttribute = {
      id: Date.now().toString(),
      name: newAttribute.name,
      type: newAttribute.type,
      values: [],
    };
    setCustomAttributes([...customAttributes, attr]);
    setNewAttribute({ name: '', type: 'custom' });
    setShowAttributeModal(false);
  };

  const removeAttribute = (attrId: string) => {
    setCustomAttributes(customAttributes.filter(a => a.id !== attrId));
  };

  const addAttributeValue = (attrId: string) => {
    setCustomAttributes(customAttributes.map(attr => {
      if (attr.id === attrId) {
        return {
          ...attr,
          values: [...attr.values, {
            id: Date.now().toString(),
            value: '',
            priceModifier: 0,
            stockQuantity: 0,
          }],
        };
      }
      return attr;
    }));
  };

  const updateAttributeValue = (attrId: string, valueId: string, field: keyof AttributeValue, val: string | number) => {
    setCustomAttributes(customAttributes.map(attr => {
      if (attr.id === attrId) {
        return {
          ...attr,
          values: attr.values.map(v => {
            if (v.id === valueId) {
              return { ...v, [field]: val };
            }
            return v;
          }),
        };
      }
      return attr;
    }));
  };

  const removeAttributeValue = (attrId: string, valueId: string) => {
    setCustomAttributes(customAttributes.map(attr => {
      if (attr.id === attrId) {
        return {
          ...attr,
          values: attr.values.filter(v => v.id !== valueId),
        };
      }
      return attr;
    }));
  };

  const handleAddItem = () => {
    console.log('Adding item:', { ...newItem, attributes: customAttributes });
    setShowAddModal(false);
    setNewItem({ name: '', sku: '', category: 'Coffee', quantity: 0, minStock: 0, price: 0, cost: 0 });
    setCustomAttributes([]);
  };

  const getAttributeIcon = (type: string) => {
    switch (type) {
      case 'size': return Ruler;
      case 'color': return Palette;
      case 'material': return Layers;
      case 'style': return Settings2;
      default: return Tag;
    }
  };

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
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
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
          {categoryNames.map(cat => (
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

        <View style={styles.categoriesSection}>
          <View style={styles.categoriesSectionHeader}>
            <Text style={styles.categoriesSectionTitle}>Categories</Text>
            <TouchableOpacity 
              style={styles.manageCategoriesBtn}
              onPress={() => {
                setEditingCategory(null);
                setNewCategory({ name: '', color: '#6366F1' });
                setShowCategoryModal(true);
              }}
            >
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.manageCategoriesText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {categories.length === 0 ? (
            <View style={styles.emptyCategoriesCard}>
              <FolderOpen size={32} color={Colors.textSecondary} />
              <Text style={styles.emptyCategoriesTitle}>No Categories</Text>
              <Text style={styles.emptyCategoriesText}>Create categories to organize your inventory</Text>
            </View>
          ) : (
            <View style={styles.categoriesGrid}>
              {categories.map(category => (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryCardHeader}>
                    <View style={[styles.categoryColorDot, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryCardName} numberOfLines={1}>{category.name}</Text>
                    <TouchableOpacity 
                      style={styles.categoryMenuBtn}
                      onPress={() => setShowCategoryMenu(showCategoryMenu === category.id ? null : category.id)}
                    >
                      <MoreVertical size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.categoryItemCount}>{category.itemCount} items</Text>
                  
                  {showCategoryMenu === category.id && (
                    <View style={styles.categoryMenuDropdown}>
                      <TouchableOpacity 
                        style={styles.categoryMenuItem}
                        onPress={() => openEditCategory(category)}
                      >
                        <Edit2 size={14} color={Colors.text} />
                        <Text style={styles.categoryMenuItemText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.categoryMenuItem, styles.categoryMenuItemDelete]}
                        onPress={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={14} color={Colors.error} />
                        <Text style={[styles.categoryMenuItemText, { color: Colors.error }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => setShowAddModal(true)}>
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

      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView 
          style={styles.modalContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalHeader, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Inventory Item</Text>
            <TouchableOpacity onPress={handleAddItem}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Name</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter product name"
                  placeholderTextColor={Colors.textSecondary}
                  value={newItem.name}
                  onChangeText={(text) => setNewItem({ ...newItem, name: text })}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>SKU</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="SKU-001"
                    placeholderTextColor={Colors.textSecondary}
                    value={newItem.sku}
                    onChangeText={(text) => setNewItem({ ...newItem, sku: text })}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <TouchableOpacity style={styles.selectInput}>
                    <Text style={styles.selectText}>{newItem.category}</Text>
                    <ChevronDown size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Base Price ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={newItem.price > 0 ? newItem.price.toString() : ''}
                    onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) || 0 })}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Cost ($)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={newItem.cost > 0 ? newItem.cost.toString() : ''}
                    onChangeText={(text) => setNewItem({ ...newItem, cost: parseFloat(text) || 0 })}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="number-pad"
                    value={newItem.quantity > 0 ? newItem.quantity.toString() : ''}
                    onChangeText={(text) => setNewItem({ ...newItem, quantity: parseInt(text) || 0 })}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Min Stock</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="number-pad"
                    value={newItem.minStock > 0 ? newItem.minStock.toString() : ''}
                    onChangeText={(text) => setNewItem({ ...newItem, minStock: parseInt(text) || 0 })}
                  />
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Custom Attributes</Text>
                <TouchableOpacity 
                  style={styles.addAttributeBtn}
                  onPress={() => setShowAttributeModal(true)}
                >
                  <PlusCircle size={18} color={Colors.primary} />
                  <Text style={styles.addAttributeText}>Add</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionSubtitle}>Add sizes, colors, materials, or custom variations</Text>

              {customAttributes.length === 0 ? (
                <TouchableOpacity 
                  style={styles.emptyAttributeCard}
                  onPress={() => setShowAttributeModal(true)}
                >
                  <Settings2 size={32} color={Colors.textSecondary} />
                  <Text style={styles.emptyAttributeTitle}>No Attributes Added</Text>
                  <Text style={styles.emptyAttributeText}>Tap to add size, color, or custom attributes</Text>
                </TouchableOpacity>
              ) : (
                customAttributes.map(attr => {
                  const AttrIcon = getAttributeIcon(attr.type);
                  return (
                    <View key={attr.id} style={styles.attributeCard}>
                      <View style={styles.attributeHeader}>
                        <View style={styles.attributeInfo}>
                          <View style={[styles.attributeIcon, { backgroundColor: Colors.primary + '20' }]}>
                            <AttrIcon size={16} color={Colors.primary} />
                          </View>
                          <View>
                            <Text style={styles.attributeName}>{attr.name}</Text>
                            <Text style={styles.attributeType}>{attr.type.charAt(0).toUpperCase() + attr.type.slice(1)}</Text>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => removeAttribute(attr.id)}>
                          <X size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                      </View>

                      {attr.values.map((val, idx) => (
                        <View key={val.id} style={styles.valueRow}>
                          <TextInput
                            style={[styles.valueInput, { flex: 2 }]}
                            placeholder="Value (e.g., Large)"
                            placeholderTextColor={Colors.textSecondary}
                            value={val.value}
                            onChangeText={(text) => updateAttributeValue(attr.id, val.id, 'value', text)}
                          />
                          <View style={styles.priceModifierInput}>
                            <DollarSign size={14} color={Colors.textSecondary} />
                            <TextInput
                              style={styles.priceInput}
                              placeholder="+0"
                              placeholderTextColor={Colors.textSecondary}
                              keyboardType="decimal-pad"
                              value={val.priceModifier !== 0 ? val.priceModifier.toString() : ''}
                              onChangeText={(text) => updateAttributeValue(attr.id, val.id, 'priceModifier', parseFloat(text) || 0)}
                            />
                          </View>
                          <TextInput
                            style={[styles.valueInput, { flex: 1 }]}
                            placeholder="Qty"
                            placeholderTextColor={Colors.textSecondary}
                            keyboardType="number-pad"
                            value={val.stockQuantity > 0 ? val.stockQuantity.toString() : ''}
                            onChangeText={(text) => updateAttributeValue(attr.id, val.id, 'stockQuantity', parseInt(text) || 0)}
                          />
                          <TouchableOpacity 
                            style={styles.removeValueBtn}
                            onPress={() => removeAttributeValue(attr.id, val.id)}
                          >
                            <Minus size={14} color={Colors.error} />
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity 
                        style={styles.addValueBtn}
                        onPress={() => addAttributeValue(attr.id)}
                      >
                        <Plus size={14} color={Colors.primary} />
                        <Text style={styles.addValueText}>Add Value</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showAttributeModal} animationType="fade" transparent>
        <View style={styles.attributeModalOverlay}>
          <View style={styles.attributeModalContent}>
            <View style={styles.attributeModalHeader}>
              <Text style={styles.attributeModalTitle}>Add Attribute</Text>
              <TouchableOpacity onPress={() => setShowAttributeModal(false)}>
                <X size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Attribute Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Size, Color, Weight"
                placeholderTextColor={Colors.textSecondary}
                value={newAttribute.name}
                onChangeText={(text) => setNewAttribute({ ...newAttribute, name: text })}
              />
            </View>

            <Text style={styles.inputLabel}>Attribute Type</Text>
            <View style={styles.typeGrid}>
              {attributeTypes.map(type => {
                const TypeIcon = type.icon;
                const isSelected = newAttribute.type === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeCard, isSelected && styles.typeCardActive]}
                    onPress={() => setNewAttribute({ ...newAttribute, type: type.id as typeof newAttribute.type })}
                  >
                    <TypeIcon size={20} color={isSelected ? Colors.primary : Colors.textSecondary} />
                    <Text style={[styles.typeLabel, isSelected && styles.typeLabelActive]}>{type.label}</Text>
                    <Text style={styles.typeExamples}>{type.examples}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.createAttributeBtn} onPress={addAttribute}>
              <Text style={styles.createAttributeBtnText}>Create Attribute</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showCategoryModal} animationType="fade" transparent>
        <View style={styles.categoryModalOverlay}>
          <View style={styles.categoryModalContent}>
            <View style={styles.categoryModalHeader}>
              <Text style={styles.categoryModalTitle}>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowCategoryModal(false);
                setEditingCategory(null);
                setNewCategory({ name: '', color: '#6366F1' });
              }}>
                <X size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Electronics, Clothing"
                placeholderTextColor={Colors.textSecondary}
                value={newCategory.name}
                onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
              />
            </View>

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {categoryColors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    newCategory.color === color && styles.colorOptionActive
                  ]}
                  onPress={() => setNewCategory({ ...newCategory, color })}
                >
                  {newCategory.color === color && (
                    <Check size={16} color="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.categoryPreview}>
              <View style={[styles.categoryColorDot, { backgroundColor: newCategory.color }]} />
              <Text style={styles.categoryPreviewName}>
                {newCategory.name || 'Category Name'}
              </Text>
            </View>

            <View style={styles.categoryModalActions}>
              {editingCategory && (
                <TouchableOpacity 
                  style={styles.deleteCategoryBtn}
                  onPress={() => {
                    handleDeleteCategory(editingCategory.id);
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: '#6366F1' });
                  }}
                >
                  <Trash2 size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.saveCategoryBtn, !newCategory.name.trim() && styles.saveCategoryBtnDisabled]}
                onPress={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={!newCategory.name.trim()}
              >
                <Text style={styles.saveCategoryBtnText}>
                  {editingCategory ? 'Update' : 'Create'}
                </Text>
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
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  selectInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    color: Colors.text,
  },
  addAttributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addAttributeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyAttributeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyAttributeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptyAttributeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  attributeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  attributeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  attributeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attributeName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  attributeType: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  valueInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  priceModifierInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  removeValueBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addValueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary + '10',
    marginTop: 4,
  },
  addValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  attributeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  attributeModalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  attributeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  attributeModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  typeCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 6,
  },
  typeLabelActive: {
    color: Colors.primary,
  },
  typeExamples: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  createAttributeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createAttributeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  categoriesSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  categoriesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  manageCategoriesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
  },
  manageCategoriesText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyCategoriesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyCategoriesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptyCategoriesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  categoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryCardName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryMenuBtn: {
    padding: 4,
  },
  categoryItemCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 6,
    marginLeft: 20,
  },
  categoryMenuDropdown: {
    position: 'absolute',
    top: 40,
    right: 8,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  categoryMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  categoryMenuItemDelete: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  categoryMenuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryModalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionActive: {
    borderWidth: 3,
    borderColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  categoryPreviewName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryModalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteCategoryBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCategoryBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveCategoryBtnDisabled: {
    opacity: 0.5,
  },
  saveCategoryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
});
