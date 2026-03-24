import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Code, Key, FileText, Terminal, Webhook, Book, ChevronRight, Copy } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const quickLinks = [
  { id: '1', name: 'API Documentation', icon: Book, description: 'Full API reference' },
  { id: '2', name: 'SDKs & Libraries', icon: Code, description: 'JavaScript, Python, Go' },
  { id: '3', name: 'Webhooks', icon: Webhook, description: 'Event notifications' },
  { id: '4', name: 'Sandbox', icon: Terminal, description: 'Test environment' },
];

const apiKeys = [
  { id: '1', name: 'Production Key', key: 'lrc_live_xxxx...xxxx', created: 'Jan 15, 2026' },
  { id: '2', name: 'Test Key', key: 'lrc_test_xxxx...xxxx', created: 'Jan 10, 2026' },
];

export default function DevelopersScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Developers' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Code size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Developer Portal</Text>
          <Text style={styles.heroSubtitle}>Build on Larecoin with our powerful APIs and tools</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Quick Links</Text>
          <View style={styles.linksGrid}>
            {quickLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={[styles.linkCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.linkIcon, { backgroundColor: colors.primary + '15' }]}>
                  <link.icon size={22} color={colors.primary} />
                </View>
                <Text style={[styles.linkName, { color: colors.text }]}>{link.name}</Text>
                <Text style={[styles.linkDescription, { color: colors.textTertiary }]}>{link.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>API Keys</Text>
            <TouchableOpacity style={[styles.newKeyButton, { backgroundColor: colors.primary }]}>
              <Key size={14} color="#FFF" />
              <Text style={styles.newKeyText}>New Key</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.keysCard, { backgroundColor: colors.surface }]}>
            {apiKeys.map((apiKey, index) => (
              <View
                key={apiKey.id}
                style={[
                  styles.keyRow,
                  { borderBottomColor: colors.border },
                  index === apiKeys.length - 1 && styles.keyRowLast,
                ]}
              >
                <View style={styles.keyInfo}>
                  <Text style={[styles.keyName, { color: colors.text }]}>{apiKey.name}</Text>
                  <Text style={[styles.keyValue, { color: colors.textTertiary }]}>{apiKey.key}</Text>
                  <Text style={[styles.keyDate, { color: colors.textTertiary }]}>Created {apiKey.created}</Text>
                </View>
                <TouchableOpacity style={[styles.copyButton, { backgroundColor: colors.primary + '15' }]}>
                  <Copy size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.docsCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.docsIcon, { backgroundColor: colors.primary + '15' }]}>
            <FileText size={24} color={colors.primary} />
          </View>
          <View style={styles.docsInfo}>
            <Text style={[styles.docsTitle, { color: colors.text }]}>View Full Documentation</Text>
            <Text style={[styles.docsDescription, { color: colors.textTertiary }]}>
              Guides, tutorials, and API reference
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
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
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
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
  newKeyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  newKeyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  linkCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
  },
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  linkName: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 12,
  },
  keysCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  keyRowLast: {
    borderBottomWidth: 0,
  },
  keyInfo: {
    flex: 1,
  },
  keyName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  keyValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  keyDate: {
    fontSize: 11,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  docsIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docsInfo: {
    flex: 1,
  },
  docsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  docsDescription: {
    fontSize: 13,
  },
});
