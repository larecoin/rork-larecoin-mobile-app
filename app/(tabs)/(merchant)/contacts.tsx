import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, Plus, User, Mail, Phone, MessageSquare, 
  Star, Filter, ChevronRight, MoreVertical
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'supplier' | 'partner';
  orders: number;
  totalSpent: number;
  isFavorite: boolean;
  lastContact: string;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'John Smith', email: 'john@email.com', phone: '+1 234 567 890', type: 'customer', orders: 12, totalSpent: 450, isFavorite: true, lastContact: '2 days ago' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1 234 567 891', type: 'customer', orders: 8, totalSpent: 320, isFavorite: false, lastContact: '1 week ago' },
  { id: '3', name: 'Tech Supplies Inc', email: 'contact@techsupplies.com', phone: '+1 234 567 892', type: 'supplier', orders: 0, totalSpent: 0, isFavorite: true, lastContact: '3 days ago' },
  { id: '4', name: 'Mike Williams', email: 'mike@email.com', phone: '+1 234 567 893', type: 'customer', orders: 5, totalSpent: 180, isFavorite: false, lastContact: '2 weeks ago' },
  { id: '5', name: 'Delivery Partners', email: 'support@delivery.com', phone: '+1 234 567 894', type: 'partner', orders: 0, totalSpent: 0, isFavorite: false, lastContact: '1 day ago' },
  { id: '6', name: 'Emily Davis', email: 'emily@email.com', phone: '+1 234 567 895', type: 'customer', orders: 15, totalSpent: 620, isFavorite: true, lastContact: '5 days ago' },
];

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [activeFilter, setActiveFilter] = useState<'all' | 'customer' | 'supplier' | 'partner'>('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || contact.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const toggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const getTypeColor = (type: Contact['type']) => {
    switch (type) {
      case 'customer': return Colors.primary;
      case 'supplier': return '#9B59B6';
      case 'partner': return Colors.accent;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Plus size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'customer', 'supplier', 'partner'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.filterChipTextActive]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={styles.content}
      >
        {filteredContacts.map(contact => (
          <TouchableOpacity key={contact.id} style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <User size={24} color={Colors.textSecondary} />
            </View>
            <View style={styles.contactInfo}>
              <View style={styles.contactNameRow}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.isFavorite && (
                  <Star size={14} color="#F39C12" fill="#F39C12" />
                )}
              </View>
              <View style={[styles.typeBadge, { backgroundColor: getTypeColor(contact.type) + '20' }]}>
                <Text style={[styles.typeText, { color: getTypeColor(contact.type) }]}>
                  {contact.type}
                </Text>
              </View>
              {contact.type === 'customer' && (
                <Text style={styles.contactStats}>
                  {contact.orders} orders • ${contact.totalSpent} spent
                </Text>
              )}
              <Text style={styles.lastContact}>Last contact: {contact.lastContact}</Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity 
                style={styles.contactActionBtn}
                onPress={() => toggleFavorite(contact.id)}
              >
                <Star 
                  size={18} 
                  color={contact.isFavorite ? '#F39C12' : Colors.textSecondary} 
                  fill={contact.isFavorite ? '#F39C12' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactActionBtn}>
                <MessageSquare size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactActionBtn}>
                <MoreVertical size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredContacts.length === 0 && (
          <View style={styles.emptyState}>
            <User size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Contacts Found</Text>
            <Text style={styles.emptyDesc}>Try adjusting your search or filters</Text>
          </View>
        )}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  contactStats: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  lastContact: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 4,
  },
  contactActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
