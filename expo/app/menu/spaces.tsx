import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Layout, Plus, Settings, Users, Eye, Lock, Globe, MoreVertical } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const mySpaces = [
  { id: '1', name: 'Trading Hub', description: 'My personal trading workspace', members: 12, views: 1250, isPublic: true, image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop' },
  { id: '2', name: 'NFT Gallery', description: 'Showcase of my NFT collection', members: 5, views: 890, isPublic: true, image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&h=200&fit=crop' },
  { id: '3', name: 'Private Portfolio', description: 'Personal investment tracking', members: 1, views: 45, isPublic: false, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop' },
];

const templates = [
  { id: '1', name: 'Portfolio Dashboard', category: 'Finance' },
  { id: '2', name: 'NFT Showcase', category: 'Art' },
  { id: '3', name: 'Community Hub', category: 'Social' },
  { id: '4', name: 'Business Page', category: 'Business' },
];

export default function SpacesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'My Spaces' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Layout size={40} color="#FFF" />
          <Text style={styles.heroTitle}>Your Digital Spaces</Text>
          <Text style={styles.heroSubtitle}>Create and manage your personalized web3 spaces</Text>
          <TouchableOpacity style={styles.createButton}>
            <Plus size={18} color={colors.primary} />
            <Text style={[styles.createButtonText, { color: colors.primary }]}>Create New Space</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Spaces</Text>
          {mySpaces.map((space) => (
            <TouchableOpacity
              key={space.id}
              style={[styles.spaceCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: space.image }} style={styles.spaceImage} />
              <View style={styles.spaceInfo}>
                <View style={styles.spaceHeader}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                  {space.isPublic ? (
                    <Globe size={14} color={colors.success} />
                  ) : (
                    <Lock size={14} color={colors.warning} />
                  )}
                </View>
                <Text style={[styles.spaceDescription, { color: colors.textTertiary }]} numberOfLines={1}>
                  {space.description}
                </Text>
                <View style={styles.spaceStats}>
                  <View style={styles.stat}>
                    <Users size={12} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>{space.members}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Eye size={12} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>{space.views}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.spaceActions}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background }]}>
                  <Settings size={16} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background }]}>
                  <MoreVertical size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Start from Template</Text>
          <View style={styles.templatesGrid}>
            {templates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[styles.templateCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.templateIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Layout size={24} color={colors.primary} />
                </View>
                <Text style={[styles.templateName, { color: colors.text }]}>{template.name}</Text>
                <Text style={[styles.templateCategory, { color: colors.textTertiary }]}>{template.category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
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
  spaceCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  spaceImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  spaceDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  spaceStats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  spaceActions: {
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  templateIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
    textAlign: 'center',
  },
  templateCategory: {
    fontSize: 12,
  },
});
