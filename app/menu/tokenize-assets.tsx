import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gem, Plus, Home, Car, Briefcase, Image, FileText, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const assetTypes = [
  { id: '1', name: 'Real Estate', icon: Home, description: 'Tokenize property ownership', color: '#4CAF50' },
  { id: '2', name: 'Vehicles', icon: Car, description: 'Cars, boats, and more', color: '#2196F3' },
  { id: '3', name: 'Business Equity', icon: Briefcase, description: 'Shares and ownership', color: '#9C27B0' },
  { id: '4', name: 'Art & Collectibles', icon: Image, description: 'Physical art pieces', color: '#FF9800' },
  { id: '5', name: 'Documents', icon: FileText, description: 'Contracts and deeds', color: '#F44336' },
];

const steps = [
  { step: 1, title: 'Submit Asset Details', description: 'Provide documentation and proof of ownership' },
  { step: 2, title: 'Verification', description: 'Our team verifies asset authenticity' },
  { step: 3, title: 'Token Creation', description: 'Smart contract is deployed' },
  { step: 4, title: 'List or Hold', description: 'Trade on marketplace or hold' },
];

export default function TokenizeAssetsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Tokenize Assets' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Gem size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Tokenize Real-World Assets</Text>
          <Text style={styles.heroSubtitle}>
            Convert physical assets into blockchain tokens for fractional ownership and easy trading
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Asset Types</Text>
          {assetTypes.map((asset) => (
            <TouchableOpacity
              key={asset.id}
              style={[styles.assetCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.assetIcon, { backgroundColor: asset.color + '20' }]}>
                <asset.icon size={24} color={asset.color} />
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, { color: colors.text }]}>{asset.name}</Text>
                <Text style={[styles.assetDescription, { color: colors.textTertiary }]}>{asset.description}</Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>How It Works</Text>
          <View style={[styles.stepsCard, { backgroundColor: colors.surface }]}>
            {steps.map((step, index) => (
              <View
                key={step.step}
                style={[
                  styles.stepRow,
                  { borderBottomColor: colors.border },
                  index === steps.length - 1 && styles.stepRowLast,
                ]}
              >
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDescription, { color: colors.textTertiary }]}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.startButton, { backgroundColor: colors.primary }]}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.startButtonText}>Start Tokenizing</Text>
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
  heroCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
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
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  assetIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  assetDescription: {
    fontSize: 13,
  },
  stepsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  stepRowLast: {
    borderBottomWidth: 0,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700' as const,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
