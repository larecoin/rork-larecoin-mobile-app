import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FolderOpen, Image as ImageIcon, Video, FileText, Music, Upload, Grid, List, MoreVertical } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const files = [
  { id: '1', name: 'Profile Photo.jpg', type: 'image', size: '2.4 MB', date: 'Jan 20, 2026', thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { id: '2', name: 'NFT Collection', type: 'folder', size: '48 items', date: 'Jan 18, 2026', thumbnail: null },
  { id: '3', name: 'Trading Video.mp4', type: 'video', size: '156 MB', date: 'Jan 15, 2026', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop' },
  { id: '4', name: 'Whitepaper.pdf', type: 'document', size: '4.2 MB', date: 'Jan 10, 2026', thumbnail: null },
  { id: '5', name: 'Background Music.mp3', type: 'audio', size: '8.5 MB', date: 'Jan 8, 2026', thumbnail: null },
];

const storageStats = { used: 12.5, total: 50 };

export default function MediaScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'document': return FileText;
      case 'audio': return Music;
      case 'folder': return FolderOpen;
      default: return FileText;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'image': return '#4CAF50';
      case 'video': return '#F44336';
      case 'document': return '#2196F3';
      case 'audio': return '#9C27B0';
      case 'folder': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Media & Files' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.storageCard, { backgroundColor: colors.surface }]}>
          <View style={styles.storageHeader}>
            <Text style={[styles.storageTitle, { color: colors.text }]}>Storage</Text>
            <Text style={[styles.storageUsed, { color: colors.textTertiary }]}>
              {storageStats.used} GB / {storageStats.total} GB
            </Text>
          </View>
          <View style={[styles.storageBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.storageProgress, 
                { backgroundColor: colors.primary, width: `${(storageStats.used / storageStats.total) * 100}%` }
              ]} 
            />
          </View>
          <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.upgradeText, { color: colors.primary }]}>Upgrade Storage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolbar}>
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
            <Upload size={18} color="#FFF" />
            <Text style={styles.uploadText}>Upload</Text>
          </TouchableOpacity>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.viewButton, viewMode === 'grid' && { backgroundColor: colors.surface }]}
              onPress={() => setViewMode('grid')}
            >
              <Grid size={18} color={viewMode === 'grid' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.viewButton, viewMode === 'list' && { backgroundColor: colors.surface }]}
              onPress={() => setViewMode('list')}
            >
              <List size={18} color={viewMode === 'list' ? colors.primary : colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Recent Files</Text>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            const iconColor = getIconColor(file.type);
            return (
              <TouchableOpacity
                key={file.id}
                style={[styles.fileItem, { backgroundColor: colors.surface }]}
              >
                {file.thumbnail ? (
                  <Image source={{ uri: file.thumbnail }} style={styles.fileThumbnail} />
                ) : (
                  <View style={[styles.fileIconWrapper, { backgroundColor: iconColor + '20' }]}>
                    <FileIcon size={24} color={iconColor} />
                  </View>
                )}
                <View style={styles.fileInfo}>
                  <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={[styles.fileMeta, { color: colors.textTertiary }]}>
                    {file.size} • {file.date}
                  </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
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
  storageCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  storageUsed: {
    fontSize: 13,
  },
  storageBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  storageProgress: {
    height: '100%',
    borderRadius: 4,
  },
  upgradeButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  upgradeText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  uploadText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 4,
  },
  viewButton: {
    padding: 10,
    borderRadius: 8,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  fileThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  fileIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
  },
});
