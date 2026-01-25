import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  Camera, Upload, Grid, LayoutGrid, Trash2, Heart, MessageCircle, 
  Share2, MoreHorizontal, X, ChevronLeft, ChevronRight, Plus,
  Filter, Image as ImageIcon, Folder
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 8) / 3;

interface Photo {
  id: string;
  url: string;
  likes: number;
  comments: number;
  date: string;
  album?: string;
}

interface Album {
  id: string;
  name: string;
  coverUrl: string;
  count: number;
}

const mockPhotos: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', likes: 234, comments: 18, date: '2024-01-15', album: 'Travel' },
  { id: '2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', likes: 189, comments: 12, date: '2024-01-14', album: 'Nature' },
  { id: '3', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400', likes: 456, comments: 34, date: '2024-01-13', album: 'Travel' },
  { id: '4', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', likes: 321, comments: 22, date: '2024-01-12', album: 'Nature' },
  { id: '5', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', likes: 567, comments: 45, date: '2024-01-11', album: 'Nature' },
  { id: '6', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', likes: 234, comments: 16, date: '2024-01-10', album: 'Travel' },
  { id: '7', url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=400', likes: 432, comments: 28, date: '2024-01-09' },
  { id: '8', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400', likes: 198, comments: 14, date: '2024-01-08' },
  { id: '9', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400', likes: 345, comments: 26, date: '2024-01-07' },
  { id: '10', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400', likes: 278, comments: 19, date: '2024-01-06' },
  { id: '11', url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc069c?w=400', likes: 412, comments: 31, date: '2024-01-05' },
  { id: '12', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', likes: 189, comments: 11, date: '2024-01-04' },
];

const mockAlbums: Album[] = [
  { id: '1', name: 'Travel', coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', count: 24 },
  { id: '2', name: 'Nature', coverUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', count: 18 },
  { id: '3', name: 'Events', coverUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', count: 32 },
  { id: '4', name: 'Family', coverUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', count: 45 },
];

export default function PhotosScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'albums'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);

  const handlePhotoPress = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex > 0) {
      const newIndex = selectedPhotoIndex - 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(mockPhotos[newIndex]);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex < mockPhotos.length - 1) {
      const newIndex = selectedPhotoIndex + 1;
      setSelectedPhotoIndex(newIndex);
      setSelectedPhoto(mockPhotos[newIndex]);
    }
  };

  const toggleLike = (photoId: string) => {
    setLikedPhotos(prev => 
      prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Photos',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />

      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockPhotos.length}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mockAlbums.length}</Text>
            <Text style={styles.statLabel}>Albums</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.4K</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.uploadButton}>
            <Upload size={18} color="#FFF" />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
          onPress={() => setViewMode('grid')}
        >
          <Grid size={18} color={viewMode === 'grid' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.toggleText, viewMode === 'grid' && styles.toggleTextActive]}>All Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'albums' && styles.toggleButtonActive]}
          onPress={() => setViewMode('albums')}
        >
          <Folder size={18} color={viewMode === 'albums' ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.toggleText, viewMode === 'albums' && styles.toggleTextActive]}>Albums</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {viewMode === 'grid' ? (
          <View style={styles.photoGrid}>
            {mockPhotos.map((photo, index) => (
              <TouchableOpacity 
                key={photo.id} 
                style={styles.photoItem}
                onPress={() => handlePhotoPress(photo, index)}
              >
                <Image source={{ uri: photo.url }} style={styles.photoImage} />
                <View style={styles.photoOverlay}>
                  <View style={styles.photoStats}>
                    <Heart size={12} color="#FFF" />
                    <Text style={styles.photoStatText}>{photo.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.albumsContainer}>
            <TouchableOpacity style={styles.createAlbumCard}>
              <View style={styles.createAlbumIcon}>
                <Plus size={24} color={Colors.primary} />
              </View>
              <Text style={styles.createAlbumText}>Create Album</Text>
            </TouchableOpacity>
            {mockAlbums.map((album) => (
              <TouchableOpacity key={album.id} style={styles.albumCard}>
                <Image source={{ uri: album.coverUrl }} style={styles.albumCover} />
                <View style={styles.albumInfo}>
                  <Text style={styles.albumName}>{album.name}</Text>
                  <Text style={styles.albumCount}>{album.count} photos</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
              <X size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalDate}>{selectedPhoto?.date}</Text>
            <TouchableOpacity>
              <MoreHorizontal size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.photoViewContainer}>
            {selectedPhotoIndex > 0 && (
              <TouchableOpacity style={styles.navButtonLeft} onPress={handlePrevPhoto}>
                <ChevronLeft size={32} color="#FFF" />
              </TouchableOpacity>
            )}
            
            {selectedPhoto && (
              <Image 
                source={{ uri: selectedPhoto.url }} 
                style={styles.fullPhoto}
                resizeMode="contain"
              />
            )}

            {selectedPhotoIndex < mockPhotos.length - 1 && (
              <TouchableOpacity style={styles.navButtonRight} onPress={handleNextPhoto}>
                <ChevronRight size={32} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalAction}
              onPress={() => selectedPhoto && toggleLike(selectedPhoto.id)}
            >
              <Heart 
                size={24} 
                color={selectedPhoto && likedPhotos.includes(selectedPhoto.id) ? '#EF4444' : '#FFF'}
                fill={selectedPhoto && likedPhotos.includes(selectedPhoto.id) ? '#EF4444' : 'transparent'}
              />
              <Text style={styles.modalActionText}>
                {selectedPhoto ? (likedPhotos.includes(selectedPhoto.id) ? selectedPhoto.likes + 1 : selectedPhoto.likes) : 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalAction}>
              <MessageCircle size={24} color="#FFF" />
              <Text style={styles.modalActionText}>{selectedPhoto?.comments || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalAction}>
              <Share2 size={24} color="#FFF" />
              <Text style={styles.modalActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalAction}>
              <Trash2 size={24} color="#FFF" />
              <Text style={styles.modalActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  cameraButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary + '15',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 4,
  },
  photoItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  photoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoStatText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500' as const,
  },
  albumsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  createAlbumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.primary + '40',
  },
  createAlbumIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAlbumText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  albumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    gap: 14,
  },
  albumCover: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  albumCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  modalDate: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500' as const,
  },
  photoViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullPhoto: {
    width: width,
    height: width,
  },
  navButtonLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  navButtonRight: {
    position: 'absolute',
    right: 10,
    zIndex: 10,
    padding: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 40,
  },
  modalAction: {
    alignItems: 'center',
    gap: 6,
  },
  modalActionText: {
    fontSize: 12,
    color: '#FFF',
  },
});
