import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe, Search, Plus, CheckCircle, Clock, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const myDomains = [
  { id: '1', name: 'mystore.lrc', status: 'active', expires: 'Jan 2027' },
  { id: '2', name: 'johndoe.lrc', status: 'active', expires: 'Mar 2027' },
  { id: '3', name: 'cryptoshop.lrc', status: 'pending', expires: 'N/A' },
];

export default function DomainsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Domains & Websites' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Globe size={48} color="#FFF" />
          <Text style={styles.heroTitle}>Web3 Domains</Text>
          <Text style={styles.heroSubtitle}>Claim your .lrc domain for your decentralized identity</Text>
        </View>

        <View style={[styles.searchCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.searchLabel, { color: colors.text }]}>Find Your Domain</Text>
          <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="yourname"
              placeholderTextColor={colors.textTertiary}
            />
            <Text style={[styles.domainSuffix, { color: colors.primary }]}>.lrc</Text>
            <TouchableOpacity style={[styles.searchButton, { backgroundColor: colors.primary }]}>
              <Search size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>My Domains</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary + '15' }]}>
              <Plus size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={[styles.domainsCard, { backgroundColor: colors.surface }]}>
            {myDomains.map((domain, index) => (
              <TouchableOpacity
                key={domain.id}
                style={[
                  styles.domainRow,
                  { borderBottomColor: colors.border },
                  index === myDomains.length - 1 && styles.domainRowLast,
                ]}
              >
                <View style={[styles.domainIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Globe size={18} color={colors.primary} />
                </View>
                <View style={styles.domainInfo}>
                  <Text style={[styles.domainName, { color: colors.text }]}>{domain.name}</Text>
                  <Text style={[styles.domainExpiry, { color: colors.textTertiary }]}>
                    Expires: {domain.expires}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: domain.status === 'active' ? colors.success + '20' : colors.warning + '20' }
                ]}>
                  {domain.status === 'active' ? (
                    <CheckCircle size={12} color={colors.success} />
                  ) : (
                    <Clock size={12} color={colors.warning} />
                  )}
                  <Text style={[
                    styles.statusText,
                    { color: domain.status === 'active' ? colors.success : colors.warning }
                  ]}>
                    {domain.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.websiteCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.websiteIcon, { backgroundColor: colors.primary + '15' }]}>
            <Globe size={24} color={colors.primary} />
          </View>
          <View style={styles.websiteInfo}>
            <Text style={[styles.websiteTitle, { color: colors.text }]}>Website Builder</Text>
            <Text style={[styles.websiteDescription, { color: colors.textTertiary }]}>
              <Text>Create a decentralized website for your domain</Text>
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
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
  searchCard: { margin: 16, marginTop: 0, padding: 16, borderRadius: 16 },
  searchLabel: { fontSize: 16, fontWeight: '600' as const, marginBottom: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingLeft: 16 },
  searchInput: { flex: 1, height: 48, fontSize: 16 },
  domainSuffix: { fontSize: 16, fontWeight: '600' as const, marginRight: 8 },
  searchButton: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1 },
  addButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  domainsCard: { borderRadius: 16, overflow: 'hidden' },
  domainRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  domainRowLast: { borderBottomWidth: 0 },
  domainIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  domainInfo: { flex: 1 },
  domainName: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  domainExpiry: { fontSize: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' },
  websiteCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, gap: 14 },
  websiteIcon: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  websiteInfo: { flex: 1 },
  websiteTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  websiteDescription: { fontSize: 13 },
});
