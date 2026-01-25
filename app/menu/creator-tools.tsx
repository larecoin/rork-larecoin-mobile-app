import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wand2, Video, Image as ImageIcon, Music, FileText, Palette, Sparkles, Mic, Camera, TrendingUp } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const tools = [
  { id: '1', name: 'AI Image Generator', description: 'Create stunning images from text', icon: Sparkles, color: '#9C27B0' },
  { id: '2', name: 'Video Editor', description: 'Edit and enhance videos', icon: Video, color: '#F44336' },
  { id: '3', name: 'Photo Studio', description: 'Professional photo editing', icon: Camera, color: '#4CAF50' },
  { id: '4', name: 'Audio Mixer', description: 'Create and edit audio', icon: Music, color: '#FF9800' },
  { id: '5', name: 'NFT Creator', description: 'Mint your digital art', icon: Palette, color: '#2196F3' },
  { id: '6', name: 'Voice Recorder', description: 'Record high-quality audio', icon: Mic, color: '#E91E63' },
];

const templates = [
  { id: '1', name: 'Social Post', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop' },
  { id: '2', name: 'NFT Art', image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&h=200&fit=crop' },
  { id: '3', name: 'Video Thumbnail', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop' },
  { id: '4', name: 'Banner', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop' },
];

const stats = [
  { label: 'Creations', value: '124' },
  { label: 'Views', value: '45.2K' },
  { label: 'Likes', value: '8.9K' },
];

export default function CreatorToolsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Creator Tools' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Wand2 size={40} color="#FFF" />
          <Text style={styles.heroTitle}>Create Something Amazing</Text>
          <Text style={styles.heroSubtitle}>Use AI-powered tools to bring your ideas to life</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Creator Tools</Text>
          <View style={styles.toolsGrid}>
            {tools.map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={[styles.toolCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
                  <tool.icon size={24} color={tool.color} />
                </View>
                <Text style={[styles.toolName, { color: colors.text }]}>{tool.name}</Text>
                <Text style={[styles.toolDescription, { color: colors.textTertiary }]}>{tool.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Templates</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {templates.map((template) => (
              <TouchableOpacity key={template.id} style={styles.templateCard}>
                <Image source={{ uri: template.image }} style={styles.templateImage} />
                <View style={[styles.templateOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
                  <Text style={styles.templateName}>{template.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={[styles.analyticsCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.analyticsIcon, { backgroundColor: colors.primary + '15' }]}>
            <TrendingUp size={24} color={colors.primary} />
          </View>
          <View style={styles.analyticsInfo}>
            <Text style={[styles.analyticsTitle, { color: colors.text }]}>Creator Analytics</Text>
            <Text style={[styles.analyticsDescription, { color: colors.textTertiary }]}>
              Track your content performance and audience growth
            </Text>
          </View>
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
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  templateCard: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
  },
  templateImage: {
    width: '100%',
    height: '100%',
  },
  templateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  templateName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  analyticsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  analyticsIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsInfo: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  analyticsDescription: {
    fontSize: 13,
  },
});
