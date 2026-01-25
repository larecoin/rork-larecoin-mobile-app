import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Boxes, TrendingUp, Plus, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const myAssets = [
  { id: '1', name: 'Manhattan Penthouse', tokens: 50, totalTokens: 10000, value: '$12,500', yield: '$85/mo', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=200&fit=crop' },
  { id: '2', name: 'Ferrari 488 GTB', tokens: 25, totalTokens: 1000, value: '$8,000', yield: '$35/mo', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200&fit=crop' },
  { id: '3', name: 'Tech Startup Equity', tokens: 500, totalTokens: 50000, value: '$50,000', yield: '$625/mo', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop' },
];

export default function MyTokenizedAssetsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const totalValue = myAssets.reduce((sum, asset) => sum + parseFloat(asset.value.replace(/[$,]/g, '')), 0);
  const totalYield = myAssets.reduce((sum, asset) => sum + parseFloat(asset.yield.replace(/[$\/mo,]/g, '')), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Tokenized Assets' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <Boxes size={32} color="#FFF" />
          <Text style={styles.summaryLabel}>Portfolio Value</Text>
          <Text style={styles.summaryValue}>${totalValue.toLocaleString()}</Text>
          <View style={styles.yieldRow}>
            <TrendingUp size={16} color="#4CAF50" />
            <Text style={styles.yieldText}>${totalYield}/month in yield</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Assets</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>575</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Tokens</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>12.5%</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Avg APY</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Holdings</Text>
          {myAssets.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              style={[styles.assetCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: asset.image }} style={styles.assetImage} />
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, { color: colors.text }]}>{asset.name}</Text>
                <Text style={[styles.assetTokens, { color: colors.textTertiary }]}>
                  {asset.tokens} / {asset.totalTokens.toLocaleString()} tokens ({((asset.tokens / asset.totalTokens) * 100).toFixed(2)}%)
                </Text>
                <View style={styles.assetValues}>
                  <Text style={[styles.assetValue, { color: colors.text }]}>{asset.value}</Text>
                  <View style={[styles.yieldBadge, { backgroundColor: colors.success + '20' }]}>
                    <Text style={[styles.yieldBadgeText, { color: colors.success }]}>{asset.yield}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.browseButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.browseButtonText}>Browse More Assets</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 12,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 4,
  },
  yieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  yieldText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500' as const,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  assetImage: {
    width: 80,
    height: 80,
  },
  assetInfo: {
    flex: 1,
    padding: 12,
  },
  assetName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  assetTokens: {
    fontSize: 12,
    marginBottom: 8,
  },
  assetValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assetValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  yieldBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  yieldBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
