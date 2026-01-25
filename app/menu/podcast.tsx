import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Mic, Plus, Play, Pause, Settings, Upload, Headphones, Clock,
  Calendar, BarChart2, Users, Share2, Heart, MessageCircle,
  MoreVertical, Radio, Rss, Download, ExternalLink, TrendingUp
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Episode {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  duration: string;
  plays: number;
  likes: number;
  comments: number;
  publishedAt: string;
  status: 'published' | 'draft' | 'scheduled';
}

const mockEpisodes: Episode[] = [
  {
    id: '1',
    title: 'The Future of DeFi: Expert Insights',
    description: 'In this episode, we dive deep into the world of decentralized finance with industry experts...',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600',
    duration: '45:32',
    plays: 3421,
    likes: 234,
    comments: 56,
    publishedAt: '2024-01-18',
    status: 'published',
  },
  {
    id: '2',
    title: 'Building Web3 Applications from Scratch',
    description: 'A comprehensive guide to starting your journey in Web3 development...',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600',
    duration: '38:15',
    plays: 2876,
    likes: 198,
    comments: 42,
    publishedAt: '2024-01-15',
    status: 'published',
  },
  {
    id: '3',
    title: 'Crypto Market Analysis - January 2024',
    description: 'Breaking down the latest market trends and what to expect in the coming months...',
    coverImage: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600',
    duration: '52:08',
    plays: 4532,
    likes: 312,
    comments: 78,
    publishedAt: '2024-01-12',
    status: 'published',
  },
  {
    id: '4',
    title: 'Interview: Top Blockchain Developer',
    description: 'Exclusive interview with one of the leading blockchain developers in the space...',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600',
    duration: '1:05:22',
    plays: 0,
    likes: 0,
    comments: 0,
    publishedAt: '',
    status: 'scheduled',
  },
];

export default function PodcastScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'episodes' | 'analytics' | 'settings'>('episodes');
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);

  const totalPlays = mockEpisodes.reduce((sum, e) => sum + e.plays, 0);
  const totalDuration = '15h 42m';
  const publishedEpisodes = mockEpisodes.filter(e => e.status === 'published').length;

  const togglePlay = (episodeId: string) => {
    setPlayingEpisode(prev => prev === episodeId ? null : episodeId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return '#10B981';
      case 'draft': return '#F59E0B';
      case 'scheduled': return '#8B5CF6';
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Podcast',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.podcastInfo}>
          <View style={styles.podcastCover}>
            <Mic size={28} color={Colors.primary} />
          </View>
          <View style={styles.podcastDetails}>
            <Text style={styles.podcastName}>Crypto Insights</Text>
            <Text style={styles.podcastCategory}>Technology & Finance</Text>
            <View style={styles.rssRow}>
              <Rss size={12} color={Colors.textSecondary} />
              <Text style={styles.rssText}>RSS Feed Available</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Headphones size={18} color="#0EA5E9" />
            <Text style={styles.statValue}>{(totalPlays / 1000).toFixed(1)}K</Text>
            <Text style={styles.statLabel}>Total Plays</Text>
          </View>
          <View style={styles.statCard}>
            <Radio size={18} color="#EC4899" />
            <Text style={styles.statValue}>{publishedEpisodes}</Text>
            <Text style={styles.statLabel}>Episodes</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={18} color="#8B5CF6" />
            <Text style={styles.statValue}>892</Text>
            <Text style={styles.statLabel}>Subscribers</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.recordButton}>
            <Mic size={20} color="#FFF" />
            <Text style={styles.recordButtonText}>Record</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'episodes' && styles.tabActive]}
          onPress={() => setActiveTab('episodes')}
        >
          <Radio size={16} color={activeTab === 'episodes' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'episodes' && styles.tabTextActive]}>Episodes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.tabActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <BarChart2 size={16} color={activeTab === 'analytics' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'analytics' && styles.tabTextActive]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.tabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={16} color={activeTab === 'settings' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.tabTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'episodes' && (
          <View style={styles.episodesContainer}>
            {mockEpisodes.map((episode) => (
              <View key={episode.id} style={styles.episodeCard}>
                <View style={styles.episodeHeader}>
                  <TouchableOpacity 
                    style={styles.episodeCoverContainer}
                    onPress={() => togglePlay(episode.id)}
                  >
                    <Image source={{ uri: episode.coverImage }} style={styles.episodeCover} />
                    <View style={styles.playOverlay}>
                      {playingEpisode === episode.id ? (
                        <Pause size={24} color="#FFF" fill="#FFF" />
                      ) : (
                        <Play size={24} color="#FFF" fill="#FFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.episodeInfo}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(episode.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(episode.status) }]}>
                        {episode.status.charAt(0).toUpperCase() + episode.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}</Text>
                    <View style={styles.episodeMeta}>
                      <View style={styles.metaItem}>
                        <Clock size={12} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{episode.duration}</Text>
                      </View>
                      {episode.publishedAt && (
                        <View style={styles.metaItem}>
                          <Calendar size={12} color={Colors.textSecondary} />
                          <Text style={styles.metaText}>{episode.publishedAt}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreVertical size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.episodeDescription} numberOfLines={2}>
                  {episode.description}
                </Text>

                {episode.status === 'published' && (
                  <View style={styles.episodeStats}>
                    <View style={styles.episodeStat}>
                      <Headphones size={14} color={Colors.textSecondary} />
                      <Text style={styles.episodeStatText}>{episode.plays}</Text>
                    </View>
                    <View style={styles.episodeStat}>
                      <Heart size={14} color={Colors.textSecondary} />
                      <Text style={styles.episodeStatText}>{episode.likes}</Text>
                    </View>
                    <View style={styles.episodeStat}>
                      <MessageCircle size={14} color={Colors.textSecondary} />
                      <Text style={styles.episodeStatText}>{episode.comments}</Text>
                    </View>
                    <TouchableOpacity style={styles.shareButton}>
                      <Share2 size={14} color={Colors.primary} />
                      <Text style={styles.shareText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'analytics' && (
          <View style={styles.analyticsContainer}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Performance Overview</Text>
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#0EA5E9' + '20' }]}>
                    <Headphones size={20} color="#0EA5E9" />
                  </View>
                  <Text style={styles.analyticsValue}>{(totalPlays / 1000).toFixed(1)}K</Text>
                  <Text style={styles.analyticsLabel}>Total Plays</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+18%</Text>
                  </View>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#8B5CF6' + '20' }]}>
                    <Users size={20} color="#8B5CF6" />
                  </View>
                  <Text style={styles.analyticsValue}>892</Text>
                  <Text style={styles.analyticsLabel}>Subscribers</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+24%</Text>
                  </View>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#F59E0B' + '20' }]}>
                    <Clock size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.analyticsValue}>{totalDuration}</Text>
                  <Text style={styles.analyticsLabel}>Total Duration</Text>
                </View>
                <View style={styles.analyticsItem}>
                  <View style={[styles.analyticsIconBg, { backgroundColor: '#10B981' + '20' }]}>
                    <Download size={20} color="#10B981" />
                  </View>
                  <Text style={styles.analyticsValue}>1.2K</Text>
                  <Text style={styles.analyticsLabel}>Downloads</Text>
                  <View style={styles.trendBadge}>
                    <TrendingUp size={10} color="#10B981" />
                    <Text style={styles.trendText}>+12%</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.topEpisodesCard}>
              <Text style={styles.analyticsTitle}>Top Episodes</Text>
              {mockEpisodes
                .filter(e => e.status === 'published')
                .sort((a, b) => b.plays - a.plays)
                .slice(0, 3)
                .map((episode, index) => (
                  <View key={episode.id} style={styles.topEpisodeItem}>
                    <Text style={styles.topEpisodeRank}>#{index + 1}</Text>
                    <Image source={{ uri: episode.coverImage }} style={styles.topEpisodeCover} />
                    <View style={styles.topEpisodeInfo}>
                      <Text style={styles.topEpisodeTitle} numberOfLines={1}>{episode.title}</Text>
                      <Text style={styles.topEpisodePlays}>{episode.plays} plays</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Podcast Settings</Text>
              
              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: Colors.primary + '15' }]}>
                  <Mic size={18} color={Colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Podcast Name</Text>
                  <Text style={styles.settingsItemValue}>Crypto Insights</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#10B981' + '15' }]}>
                  <Rss size={18} color="#10B981" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>RSS Feed</Text>
                  <Text style={styles.settingsItemValue}>larecoin.com/podcast/feed.xml</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#8B5CF6' + '15' }]}>
                  <ExternalLink size={18} color="#8B5CF6" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Distribution</Text>
                  <Text style={styles.settingsItemValue}>Apple, Spotify, Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem}>
                <View style={[styles.settingsIconBg, { backgroundColor: '#F59E0B' + '15' }]}>
                  <Radio size={18} color="#F59E0B" />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsItemTitle}>Category</Text>
                  <Text style={styles.settingsItemValue}>Technology & Finance</Text>
                </View>
              </TouchableOpacity>
            </View>
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
    padding: 20,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  podcastInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  podcastCover: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastDetails: {
    flex: 1,
    marginLeft: 16,
  },
  podcastName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  podcastCategory: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rssRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  rssText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  recordButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
  },
  recordButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  uploadButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.primary + '15',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  episodesContainer: {
    paddingHorizontal: 20,
  },
  episodeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  episodeHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  episodeCoverContainer: {
    position: 'relative',
  },
  episodeCover: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 14,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  episodeTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  episodeMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  episodeDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  episodeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  episodeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  episodeStatText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  shareText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  analyticsContainer: {
    paddingHorizontal: 20,
  },
  analyticsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  analyticsItem: {
    width: '47%',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  analyticsIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  analyticsLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#10B981' + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  topEpisodesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  topEpisodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topEpisodeRank: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    width: 30,
  },
  topEpisodeCover: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  topEpisodeInfo: {
    flex: 1,
  },
  topEpisodeTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  topEpisodePlays: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
    marginLeft: 14,
  },
  settingsItemTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  settingsItemValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
