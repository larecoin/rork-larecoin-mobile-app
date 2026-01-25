import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  FileText, Plus, Search, Filter, Eye, Heart, MessageCircle, 
  Clock, Edit3, Trash2, MoreHorizontal, BookOpen, TrendingUp,
  Calendar, Tag
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  comments: number;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Decentralized Finance',
    excerpt: 'Exploring how DeFi is reshaping the financial landscape and what it means for everyday users...',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    status: 'published',
    views: 2345,
    likes: 189,
    comments: 34,
    readTime: '8 min',
    publishedAt: '2024-01-15',
    tags: ['DeFi', 'Crypto', 'Finance'],
  },
  {
    id: '2',
    title: 'Building Your First Smart Contract',
    excerpt: 'A step-by-step guide to creating and deploying your first smart contract on the blockchain...',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
    status: 'published',
    views: 1876,
    likes: 156,
    comments: 28,
    readTime: '12 min',
    publishedAt: '2024-01-12',
    tags: ['Development', 'Blockchain', 'Tutorial'],
  },
  {
    id: '3',
    title: 'Understanding Tokenomics',
    excerpt: 'A comprehensive guide to understanding the economics behind cryptocurrency tokens...',
    coverImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600',
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
    readTime: '10 min',
    publishedAt: '',
    tags: ['Tokenomics', 'Crypto'],
  },
  {
    id: '4',
    title: 'NFT Market Analysis 2024',
    excerpt: 'Analyzing current trends and future predictions for the NFT marketplace...',
    coverImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600',
    status: 'published',
    views: 3421,
    likes: 267,
    comments: 56,
    readTime: '6 min',
    publishedAt: '2024-01-08',
    tags: ['NFT', 'Market', 'Analysis'],
  },
];

export default function ArticlesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || article.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const publishedCount = mockArticles.filter(a => a.status === 'published').length;
  const draftCount = mockArticles.filter(a => a.status === 'draft').length;
  const totalViews = mockArticles.reduce((sum, a) => sum + a.views, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Articles',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <BookOpen size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{publishedCount}</Text>
            <Text style={styles.statLabel}>Published</Text>
          </View>
          <View style={styles.statCard}>
            <Edit3 size={20} color="#F59E0B" />
            <Text style={styles.statValue}>{draftCount}</Text>
            <Text style={styles.statLabel}>Drafts</Text>
          </View>
          <View style={styles.statCard}>
            <Eye size={20} color="#10B981" />
            <Text style={styles.statValue}>{(totalViews / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Views</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton}>
          <Plus size={20} color="#FFF" />
          <Text style={styles.createButtonText}>Write Article</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>
            All ({mockArticles.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'published' && styles.filterTabActive]}
          onPress={() => setActiveFilter('published')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'published' && styles.filterTabTextActive]}>
            Published ({publishedCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, activeFilter === 'draft' && styles.filterTabActive]}
          onPress={() => setActiveFilter('draft')}
        >
          <Text style={[styles.filterTabText, activeFilter === 'draft' && styles.filterTabTextActive]}>
            Drafts ({draftCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredArticles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <Image source={{ uri: article.coverImage }} style={styles.articleImage} />
            <View style={styles.articleContent}>
              <View style={styles.articleHeader}>
                <View style={[
                  styles.statusBadge,
                  article.status === 'draft' && styles.statusBadgeDraft
                ]}>
                  <Text style={[
                    styles.statusText,
                    article.status === 'draft' && styles.statusTextDraft
                  ]}>
                    {article.status === 'published' ? 'Published' : 'Draft'}
                  </Text>
                </View>
                <TouchableOpacity>
                  <MoreHorizontal size={18} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>

              <View style={styles.tagsRow}>
                {article.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Tag size={10} color={Colors.primary} />
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.articleMeta}>
                <View style={styles.metaItem}>
                  <Clock size={12} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{article.readTime}</Text>
                </View>
                {article.status === 'published' && (
                  <>
                    <View style={styles.metaItem}>
                      <Eye size={12} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{article.views}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Heart size={12} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{article.likes}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MessageCircle size={12} color={Colors.textSecondary} />
                      <Text style={styles.metaText}>{article.comments}</Text>
                    </View>
                  </>
                )}
              </View>

              {article.publishedAt && (
                <View style={styles.dateRow}>
                  <Calendar size={12} color={Colors.textTertiary} />
                  <Text style={styles.dateText}>{article.publishedAt}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

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
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  searchSection: {
    padding: 20,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: '#FFF',
  },
  articleCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 140,
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#10B981' + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeDraft: {
    backgroundColor: '#F59E0B' + '20',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  statusTextDraft: {
    color: '#F59E0B',
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  articleMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
