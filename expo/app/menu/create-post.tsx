import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  TextInput, Image, Platform, Alert 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  X, Image as ImageIcon, Video, FileText, Upload, Radio, Users,
  ChevronRight, Globe, Lock, UserCheck, MapPin, Hash, AtSign,
  Smile, Bold, Italic, Link, List, Camera, Mic, Play, Plus, Trash2
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

type PostType = 'text' | 'photo' | 'video' | 'article' | 'file' | 'broadcast' | 'space';
type Visibility = 'public' | 'private' | 'followers';

interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'file';
  uri: string;
  name?: string;
}

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  
  const [postType, setPostType] = useState<PostType>('text');
  const [content, setContent] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');

  const postTypes = [
    { id: 'text', label: 'Text', icon: FileText, color: '#3B82F6' },
    { id: 'photo', label: 'Photo', icon: ImageIcon, color: '#10B981' },
    { id: 'video', label: 'Video', icon: Video, color: '#EF4444' },
    { id: 'article', label: 'Article', icon: FileText, color: '#8B5CF6' },
    { id: 'file', label: 'File', icon: Upload, color: '#F59E0B' },
    { id: 'broadcast', label: 'Go Live', icon: Radio, color: '#EC4899' },
    { id: 'space', label: 'Space', icon: Users, color: '#06B6D4' },
  ] as const;

  const visibilityOptions = [
    { id: 'public', label: 'Public', description: 'Anyone can see this post', icon: Globe },
    { id: 'followers', label: 'Followers', description: 'Only followers can see', icon: UserCheck },
    { id: 'private', label: 'Private', description: 'Only you can see', icon: Lock },
  ] as const;

  const handleAddMedia = () => {
    const newMedia: MediaItem = {
      id: Date.now().toString(),
      type: postType === 'photo' ? 'photo' : postType === 'video' ? 'video' : 'file',
      uri: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400',
      name: postType === 'file' ? 'document.pdf' : undefined,
    };
    setMedia([...media, newMedia]);
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handlePost = () => {
    if (postType === 'broadcast') {
      Alert.alert('Go Live', 'Starting your live broadcast...', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: () => {
          console.log('Starting broadcast:', broadcastTitle);
          router.back();
        }},
      ]);
      return;
    }

    if (postType === 'space') {
      Alert.alert('Launch Space', `Creating "${spaceName}" space...`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Launch', onPress: () => {
          console.log('Launching space:', spaceName);
          router.push('/menu/social-spaces');
        }},
      ]);
      return;
    }

    console.log('Posting:', { postType, content, media, visibility, tags, location });
    Alert.alert('Posted!', 'Your post has been published successfully.');
    router.back();
  };

  const canPost = () => {
    switch (postType) {
      case 'text':
        return content.trim().length > 0;
      case 'photo':
      case 'video':
      case 'file':
        return media.length > 0 || content.trim().length > 0;
      case 'article':
        return articleTitle.trim().length > 0 && articleContent.trim().length > 0;
      case 'broadcast':
        return broadcastTitle.trim().length > 0;
      case 'space':
        return spaceName.trim().length > 0;
      default:
        return false;
    }
  };

  const getVisibilityIcon = () => {
    const option = visibilityOptions.find(o => o.id === visibility);
    return option?.icon || Globe;
  };

  const VisibilityIcon = getVisibilityIcon();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
        <TouchableOpacity 
          style={[styles.postBtn, !canPost() && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={!canPost()}
        >
          <Text style={[styles.postBtnText, !canPost() && styles.postBtnTextDisabled]}>
            {postType === 'broadcast' ? 'Go Live' : postType === 'space' ? 'Launch' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.typeScrollContainer}
        contentContainerStyle={styles.typeContainer}
      >
        {postTypes.map((type) => {
          const Icon = type.icon;
          const isActive = postType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeBtn,
                { backgroundColor: colors.surface },
                isActive && { backgroundColor: type.color + '20', borderColor: type.color, borderWidth: 1 }
              ]}
              onPress={() => setPostType(type.id as PostType)}
            >
              <Icon size={20} color={isActive ? type.color : colors.textSecondary} />
              <Text style={[styles.typeLabel, { color: isActive ? type.color : colors.textSecondary }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.userRow, { backgroundColor: colors.surface }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Your Name</Text>
            <TouchableOpacity 
              style={[styles.visibilityBtn, { backgroundColor: colors.background }]}
              onPress={() => setShowVisibilityPicker(!showVisibilityPicker)}
            >
              <VisibilityIcon size={14} color={colors.textSecondary} />
              <Text style={[styles.visibilityText, { color: colors.textSecondary }]}>
                {visibilityOptions.find(o => o.id === visibility)?.label}
              </Text>
              <ChevronRight size={14} color={colors.textSecondary} style={{ transform: [{ rotate: showVisibilityPicker ? '90deg' : '0deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        {showVisibilityPicker && (
          <View style={[styles.visibilityPicker, { backgroundColor: colors.surface }]}>
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.visibilityOption,
                    visibility === option.id && { backgroundColor: Colors.primary + '15' }
                  ]}
                  onPress={() => {
                    setVisibility(option.id as Visibility);
                    setShowVisibilityPicker(false);
                  }}
                >
                  <Icon size={20} color={visibility === option.id ? Colors.primary : colors.textSecondary} />
                  <View style={styles.visibilityOptionInfo}>
                    <Text style={[styles.visibilityOptionLabel, { color: colors.text }]}>{option.label}</Text>
                    <Text style={[styles.visibilityOptionDesc, { color: colors.textSecondary }]}>{option.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {postType === 'article' ? (
          <View style={styles.articleContainer}>
            <TextInput
              style={[styles.articleTitleInput, { color: colors.text, backgroundColor: colors.surface }]}
              placeholder="Article Title"
              placeholderTextColor={colors.textTertiary}
              value={articleTitle}
              onChangeText={setArticleTitle}
            />
            <View style={[styles.formattingBar, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={styles.formatBtn}>
                <Bold size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.formatBtn}>
                <Italic size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.formatBtn}>
                <Link size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.formatBtn}>
                <List size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.formatBtn}>
                <ImageIcon size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.articleInput, { color: colors.text, backgroundColor: colors.surface }]}
              placeholder="Write your article..."
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
              value={articleContent}
              onChangeText={setArticleContent}
            />
          </View>
        ) : postType === 'broadcast' ? (
          <View style={[styles.broadcastContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.broadcastPreview}>
              <View style={[styles.broadcastCamera, { backgroundColor: colors.background }]}>
                <Camera size={48} color={colors.textTertiary} />
                <Text style={[styles.broadcastCameraText, { color: colors.textTertiary }]}>Camera Preview</Text>
              </View>
            </View>
            <TextInput
              style={[styles.broadcastTitleInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Broadcast title..."
              placeholderTextColor={colors.textTertiary}
              value={broadcastTitle}
              onChangeText={setBroadcastTitle}
            />
            <View style={styles.broadcastOptions}>
              <TouchableOpacity style={[styles.broadcastOption, { backgroundColor: colors.background }]}>
                <Video size={20} color={Colors.primary} />
                <Text style={[styles.broadcastOptionText, { color: colors.text }]}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.broadcastOption, { backgroundColor: colors.background }]}>
                <Mic size={20} color={colors.textSecondary} />
                <Text style={[styles.broadcastOptionText, { color: colors.text }]}>Audio Only</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Ready to go live</Text>
            </View>
          </View>
        ) : postType === 'space' ? (
          <View style={[styles.spaceContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.spaceIcon, { backgroundColor: '#06B6D4' + '20' }]}>
              <Users size={40} color="#06B6D4" />
            </View>
            <Text style={[styles.spaceTitle, { color: colors.text }]}>Create a Social Space</Text>
            <Text style={[styles.spaceDesc, { color: colors.textSecondary }]}>
              <Text>Host live audio conversations with your community</Text>
            </Text>
            <TextInput
              style={[styles.spaceNameInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Space name..."
              placeholderTextColor={colors.textTertiary}
              value={spaceName}
              onChangeText={setSpaceName}
            />
            <TextInput
              style={[styles.spaceDescInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="What will you talk about? (optional)"
              placeholderTextColor={colors.textTertiary}
              multiline
              value={content}
              onChangeText={setContent}
            />
            <View style={styles.spaceFeatures}>
              <View style={styles.spaceFeature}>
                <Mic size={16} color={Colors.primary} />
                <Text style={[styles.spaceFeatureText, { color: colors.textSecondary }]}>Live Audio</Text>
              </View>
              <View style={styles.spaceFeature}>
                <Users size={16} color={Colors.primary} />
                <Text style={[styles.spaceFeatureText, { color: colors.textSecondary }]}>Multiple Speakers</Text>
              </View>
              <View style={styles.spaceFeature}>
                <Play size={16} color={Colors.primary} />
                <Text style={[styles.spaceFeatureText, { color: colors.textSecondary }]}>Recording</Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            <TextInput
              style={[styles.contentInput, { color: colors.text, backgroundColor: colors.surface }]}
              placeholder={
                postType === 'photo' ? "Add a caption..." :
                postType === 'video' ? "Describe your video..." :
                postType === 'file' ? "Add a description..." :
                "What's on your mind?"
              }
              placeholderTextColor={colors.textTertiary}
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />

            {(postType === 'photo' || postType === 'video' || postType === 'file') && (
              <View style={styles.mediaSection}>
                <View style={styles.mediaSectionHeader}>
                  <Text style={[styles.mediaSectionTitle, { color: colors.text }]}>
                    {postType === 'photo' ? 'Photos' : postType === 'video' ? 'Videos' : 'Files'}
                  </Text>
                  <TouchableOpacity style={styles.addMediaBtn} onPress={handleAddMedia}>
                    <Plus size={18} color={Colors.primary} />
                    <Text style={styles.addMediaText}>Add</Text>
                  </TouchableOpacity>
                </View>

                {media.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaList}>
                    {media.map((item) => (
                      <View key={item.id} style={styles.mediaItem}>
                        {item.type === 'file' ? (
                          <View style={[styles.filePreview, { backgroundColor: colors.background }]}>
                            <Upload size={24} color={colors.textSecondary} />
                            <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>
                              {item.name}
                            </Text>
                          </View>
                        ) : (
                          <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
                        )}
                        <TouchableOpacity 
                          style={styles.removeMediaBtn}
                          onPress={() => handleRemoveMedia(item.id)}
                        >
                          <Trash2 size={14} color="#FFF" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    <TouchableOpacity 
                      style={[styles.addMoreMedia, { backgroundColor: colors.surface, borderColor: colors.border }]}
                      onPress={handleAddMedia}
                    >
                      <Plus size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  <TouchableOpacity 
                    style={[styles.mediaPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    onPress={handleAddMedia}
                  >
                    {postType === 'photo' && <ImageIcon size={32} color={colors.textTertiary} />}
                    {postType === 'video' && <Video size={32} color={colors.textTertiary} />}
                    {postType === 'file' && <Upload size={32} color={colors.textTertiary} />}
                    <Text style={[styles.mediaPlaceholderText, { color: colors.textTertiary }]}>
                      {postType === 'photo' ? 'Tap to add photos' :
                       postType === 'video' ? 'Tap to add videos' :
                       'Tap to upload files'}
                    </Text>
                    <Text style={[styles.mediaPlaceholderHint, { color: colors.textTertiary }]}>
                      {postType === 'file' ? 'Supports all file types' : 'You can add multiple'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}

        {postType !== 'broadcast' && postType !== 'space' && (
          <>
            <View style={[styles.optionsSection, { backgroundColor: colors.surface }]}>
              <TouchableOpacity style={styles.optionRow}>
                <MapPin size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.optionInput, { color: colors.text }]}
                  placeholder="Add location"
                  placeholderTextColor={colors.textTertiary}
                  value={location}
                  onChangeText={setLocation}
                />
              </TouchableOpacity>

              <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />

              <View style={styles.tagsRow}>
                <Hash size={20} color={colors.textSecondary} />
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <TouchableOpacity 
                      key={tag} 
                      style={styles.tag}
                      onPress={() => handleRemoveTag(tag)}
                    >
                      <Text style={styles.tagText}>#{tag}</Text>
                      <X size={12} color="#FFF" />
                    </TouchableOpacity>
                  ))}
                  <TextInput
                    style={[styles.tagInput, { color: colors.text }]}
                    placeholder={tags.length === 0 ? "Add tags" : ""}
                    placeholderTextColor={colors.textTertiary}
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={handleAddTag}
                  />
                </View>
              </View>

              <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity style={styles.optionRow}>
                <AtSign size={20} color={colors.textSecondary} />
                <Text style={[styles.optionText, { color: colors.textTertiary }]}>Tag people</Text>
              </TouchableOpacity>

              <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity style={styles.optionRow}>
                <Smile size={20} color={colors.textSecondary} />
                <Text style={[styles.optionText, { color: colors.textTertiary }]}>Feeling/Activity</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  postBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnDisabled: {
    backgroundColor: Colors.primary + '50',
  },
  postBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  postBtnTextDisabled: {
    opacity: 0.5,
  },
  typeScrollContainer: {
    maxHeight: 70,
  },
  typeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  content: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  visibilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  visibilityText: {
    fontSize: 12,
  },
  visibilityPicker: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  visibilityOptionInfo: {
    flex: 1,
  },
  visibilityOptionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  visibilityOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  contentInput: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 120,
  },
  articleContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  articleTitleInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600' as const,
  },
  formattingBar: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 12,
    gap: 4,
  },
  formatBtn: {
    padding: 10,
    borderRadius: 8,
  },
  articleInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 250,
  },
  broadcastContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  broadcastPreview: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  broadcastCamera: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 12,
  },
  broadcastCameraText: {
    fontSize: 14,
  },
  broadcastTitleInput: {
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
  },
  broadcastOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  broadcastOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  broadcastOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#EF4444',
  },
  spaceContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  spaceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  spaceDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  spaceNameInput: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  spaceDescInput: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  spaceFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  spaceFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spaceFeatureText: {
    fontSize: 12,
  },
  mediaSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  mediaSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mediaSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  addMediaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMediaText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  mediaList: {
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative',
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  filePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
  },
  fileName: {
    fontSize: 11,
    textAlign: 'center',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreMedia: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaPlaceholder: {
    padding: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mediaPlaceholderText: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginTop: 8,
  },
  mediaPlaceholderHint: {
    fontSize: 12,
  },
  optionsSection: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  optionInput: {
    flex: 1,
    fontSize: 14,
  },
  optionText: {
    fontSize: 14,
  },
  optionDivider: {
    height: 1,
    marginHorizontal: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  tagsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  tagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    minWidth: 80,
  },
});
