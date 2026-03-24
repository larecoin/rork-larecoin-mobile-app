import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Edit2, Package } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Product } from '@/mocks/products';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onEdit?: () => void;
}

export default function ProductCard({ product, onPress, onEdit }: ProductCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: product.image }}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Edit2 size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.description} numberOfLines={1}>{product.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <View style={styles.stock}>
            <Package size={12} color={Colors.textTertiary} />
            <Text style={styles.stockText}>{product.stockCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.backgroundTertiary,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  stock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
