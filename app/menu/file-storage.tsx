import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HardDrive, Upload, FolderOpen, File, Image, Video, ChevronRight, Plus } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const storageStats = { used: 15.2, total: 100, files: 234 };

const recentFiles = [
  { id: '1', name: 'NFT_Collection.zip', size: '2.4 GB', type: 'archive', date: 'Jan 24' },
  { id: '2', name: 'profile_photo.jpg', size: '4.2 MB', type: 'image', date: 'Jan 22' },
  { id: '3', name: 'promo_video.mp4', size: '156 MB', type: 'video', date: 'Jan 20' },
];

export default function FileStorageScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'archive': return FolderOpen;
      default: return File;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'File Storage' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.storageCard, { backgroundColor: colors.primary }]}>
          <HardDrive size={40} color="#FFF" />
          <Text style={styles.storageTitle}>Decentralized Storage</Text>
          <View style={styles.storageInfo}>
            <Text style={styles.storageUsed}>{storageStats.used} GB</Text>
            <Text style={styles.storageTotal}> / {storageStats.total} GB</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View style={[styles.progressFill, { width: `${(storageStats.used / storageStats.total) * 100}%` }]} />
          </View>
          <Text style={styles.filesCount}>{storageStats.files} files stored</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Upload size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <FolderOpen size={24} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.text }]}>New Folder</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Recent Files</Text>
          <View style={[styles.filesCard, { backgroundColor: colors.surface }]}>
            {recentFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <TouchableOpacity
                  key={file.id}
                  style={[
                    styles.fileRow,
                    { borderBottomColor: colors.border },
                    index === recentFiles.length - 1 && styles.fileRowLast,
                  ]}
                >
                  <View style={[styles.fileIcon, { backgroundColor: colors.primary + '15' }]}>
                    <FileIcon size={20} color={colors.primary} />
                  </View>
                  <View style={styles.fileInfo}>
                    <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{file.name}</Text>
                    <Text style={[styles.fileMeta, { color: colors.textTertiary }]}>{file.size} • {file.date}</Text>
                  </View>
                  <ChevronRight size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={[styles.upgradeCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.upgradeIcon, { backgroundColor: colors.primary + '15' }]}>
            <Plus size={24} color={colors.primary} />
          </View>
          <View style={styles.upgradeInfo}>
            <Text style={[styles.upgradeTitle, { color: colors.text }]}>Need More Space?</Text>
            <Text style={[styles.upgradeDescription, { color: colors.textTertiary }]}>Upgrade to get up to 1TB of storage</Text>
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
  storageCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  storageTitle: { fontSize: 18, fontWeight: '600' as const, color: '#FFF', marginTop: 12, marginBottom: 16 },
  storageInfo: { flexDirection: 'row', alignItems: 'baseline' },
  storageUsed: { fontSize: 32, fontWeight: '700' as const, color: '#FFF' },
  storageTotal: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  progressBar: { width: '100%', height: 8, borderRadius: 4, marginTop: 16 },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#FFF' },
  filesCount: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 12 },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  actionButton: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12 },
  actionText: { fontSize: 13, fontWeight: '500' as const, marginTop: 8 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  filesCard: { borderRadius: 16, overflow: 'hidden' },
  fileRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  fileRowLast: { borderBottomWidth: 0 },
  fileIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '500' as const, marginBottom: 2 },
  fileMeta: { fontSize: 12 },
  upgradeCard: { flexDirection: 'row', alignItems: 'center', margin: 16, padding: 16, borderRadius: 16, gap: 14 },
  upgradeIcon: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  upgradeInfo: { flex: 1 },
  upgradeTitle: { fontSize: 15, fontWeight: '600' as const, marginBottom: 2 },
  upgradeDescription: { fontSize: 13 },
});
