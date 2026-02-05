import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Plus, Users, MessageSquare, Globe, Lock, TrendingUp, Radio, Mic, MicOff, Hand, X, Volume2, Settings, Share2, UserPlus, Crown, Phone, Video, PhoneCall, MessageCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface LiveBroadcast {
  id: string;
  title: string;
  host: { name: string; avatar: string };
  listeners: number;
  speakers: { name: string; avatar: string; isSpeaking: boolean }[];
  spaceName: string;
  spaceImage: string;
  startedAt: string;
  isRecording: boolean;
}

const spaces = [
  { id: '1', name: 'Crypto Traders', members: 12500, posts: 342, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '2', name: 'DeFi Enthusiasts', members: 8200, posts: 156, image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '3', name: 'NFT Collectors', members: 5600, posts: 89, image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', isPublic: true, trending: false },
  { id: '4', name: 'Larecoin Community', members: 25000, posts: 1200, image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=100&h=100&fit=crop', isPublic: true, trending: true },
  { id: '5', name: 'Private Investors Club', members: 320, posts: 45, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop', isPublic: false, trending: false },
];

const liveBroadcasts: LiveBroadcast[] = [
  {
    id: '1',
    title: 'Market Analysis: Bitcoin Breaking $100K',
    host: { name: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
    listeners: 2340,
    speakers: [
      { name: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', isSpeaking: true },
      { name: 'DeFiQueen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isSpeaking: false },
      { name: 'WhaleWatcher', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isSpeaking: true },
    ],
    spaceName: 'Crypto Traders',
    spaceImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop',
    startedAt: '45 min ago',
    isRecording: true,
  },
  {
    id: '2',
    title: 'NFT Drop Strategies for 2026',
    host: { name: 'NFTMaster', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    listeners: 856,
    speakers: [
      { name: 'NFTMaster', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isSpeaking: true },
      { name: 'ArtCollector', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', isSpeaking: false },
    ],
    spaceName: 'NFT Collectors',
    spaceImage: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop',
    startedAt: '12 min ago',
    isRecording: false,
  },
];

const categories = ['All', 'Trading', 'DeFi', 'NFTs', 'Gaming', 'Social', 'Business'];

export default function SocialSpacesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [showLiveRoomModal, setShowLiveRoomModal] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<LiveBroadcast | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [allowRecording, setAllowRecording] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);

  const openLiveRoom = (broadcast: LiveBroadcast) => {
    setSelectedBroadcast(broadcast);
    setShowLiveRoomModal(true);
  };

  const startBroadcast = () => {
    if (!broadcastTitle.trim() || !selectedSpace) return;
    setShowGoLiveModal(false);
    setIsLive(true);
    setBroadcastTitle('');
    setSelectedSpace(null);
  };

  const endBroadcast = () => {
    setIsLive(false);
    setShowLiveRoomModal(false);
    setSelectedBroadcast(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Social Spaces' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search spaces..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === category ? colors.primary : colors.surface }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCategory === category ? '#FFF' : colors.text }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.goLiveButton, { backgroundColor: isLive ? '#4CAF50' : '#E53935' }]}
            onPress={() => isLive ? setShowLiveRoomModal(true) : setShowGoLiveModal(true)}
          >
            <Radio size={18} color="#FFF" />
            <Text style={styles.goLiveText}>{isLive ? 'You\'re Live' : 'Go Live'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.primary }]}>
            <Plus size={18} color="#FFF" />
            <Text style={styles.createButtonText}>Create Space</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.larecoinMobileSection}>
          <View style={styles.larecoinHeader}>
            <View style={[styles.larecoinBadge, { backgroundColor: '#6366F1' }]}>
              <PhoneCall size={16} color="#FFF" />
            </View>
            <View style={styles.larecoinInfo}>
              <Text style={[styles.larecoinTitle, { color: colors.text }]}>Larecoin Mobile</Text>
              <Text style={[styles.larecoinSubtitle, { color: colors.textTertiary }]}>Call & message space members</Text>
            </View>
          </View>
          <View style={styles.larecoinActions}>
            <TouchableOpacity 
              style={[styles.larecoinAction, { backgroundColor: '#4CAF50' }]}
              onPress={() => router.push('/menu/larecoin-mobile' as any)}
            >
              <Phone size={18} color="#FFF" />
              <Text style={styles.larecoinActionText}>Voice Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.larecoinAction, { backgroundColor: '#2196F3' }]}
              onPress={() => router.push('/menu/larecoin-mobile' as any)}
            >
              <Video size={18} color="#FFF" />
              <Text style={styles.larecoinActionText}>Video Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.larecoinAction, { backgroundColor: '#9C27B0' }]}
              onPress={() => router.push('/menu/chat' as any)}
            >
              <MessageCircle size={18} color="#FFF" />
              <Text style={styles.larecoinActionText}>Group Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {liveBroadcasts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={[styles.sectionTitle, { color: '#E53935' }]}>LIVE NOW</Text>
              </View>
              <Text style={[styles.liveCount, { color: colors.textTertiary }]}>
                {liveBroadcasts.length} broadcasts
              </Text>
            </View>
            {liveBroadcasts.map((broadcast) => (
              <TouchableOpacity
                key={broadcast.id}
                style={[styles.liveCard, { backgroundColor: colors.surface, borderColor: '#E53935' + '40' }]}
                onPress={() => openLiveRoom(broadcast)}
              >
                <View style={styles.liveCardHeader}>
                  <View style={styles.liveHostInfo}>
                    <Image source={{ uri: broadcast.host.avatar }} style={styles.hostAvatar} />
                    <View>
                      <View style={styles.hostNameRow}>
                        <Text style={[styles.hostName, { color: colors.text }]}>{broadcast.host.name}</Text>
                        <Crown size={14} color="#FFD700" />
                      </View>
                      <Text style={[styles.spaceBadge, { color: colors.textTertiary }]}>
                        {broadcast.spaceName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.liveBadge}>
                    <View style={styles.livePulse} />
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                </View>
                
                <Text style={[styles.broadcastTitle, { color: colors.text }]} numberOfLines={2}>
                  {broadcast.title}
                </Text>

                <View style={styles.speakersRow}>
                  <View style={styles.speakerAvatars}>
                    {broadcast.speakers.slice(0, 4).map((speaker, index) => (
                      <View 
                        key={speaker.name} 
                        style={[
                          styles.speakerAvatarContainer,
                          { marginLeft: index > 0 ? -10 : 0 },
                          speaker.isSpeaking && styles.speakingBorder
                        ]}
                      >
                        <Image source={{ uri: speaker.avatar }} style={styles.speakerAvatar} />
                        {speaker.isSpeaking && (
                          <View style={styles.speakingIndicator}>
                            <Volume2 size={8} color="#FFF" />
                          </View>
                        )}
                      </View>
                    ))}
                    {broadcast.speakers.length > 4 && (
                      <View style={[styles.moreSpeakers, { backgroundColor: colors.border }]}>
                        <Text style={[styles.moreSpeakersText, { color: colors.text }]}>
                          +{broadcast.speakers.length - 4}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.listenerInfo}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.listenerCount, { color: colors.textTertiary }]}>
                      {broadcast.listeners.toLocaleString()} listening
                    </Text>
                  </View>
                </View>

                <View style={styles.liveCardFooter}>
                  <Text style={[styles.startedAt, { color: colors.textTertiary }]}>
                    Started {broadcast.startedAt}
                  </Text>
                  {broadcast.isRecording && (
                    <View style={styles.recordingBadge}>
                      <View style={styles.recordingDot} />
                      <Text style={styles.recordingText}>Recording</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity 
                  style={[styles.joinLiveButton, { backgroundColor: '#E53935' }]}
                  onPress={() => openLiveRoom(broadcast)}
                >
                  <Phone size={16} color="#FFF" />
                  <Text style={styles.joinLiveText}>Tune In</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Trending Spaces</Text>
          {spaces.filter(s => s.trending).map((space) => (
            <TouchableOpacity
              key={space.id}
              style={[styles.spaceCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: space.image }} style={styles.spaceImage} />
              <View style={styles.spaceInfo}>
                <View style={styles.spaceHeader}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                  {space.trending && (
                    <View style={[styles.trendingBadge, { backgroundColor: colors.warning + '20' }]}>
                      <TrendingUp size={12} color={colors.warning} />
                    </View>
                  )}
                </View>
                <View style={styles.spaceStats}>
                  <View style={styles.stat}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.members.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <MessageSquare size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.posts} posts
                    </Text>
                  </View>
                  {space.isPublic ? (
                    <Globe size={14} color={colors.success} />
                  ) : (
                    <Lock size={14} color={colors.warning} />
                  )}
                </View>
              </View>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.joinButtonText, { color: colors.primary }]}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>All Spaces</Text>
          {spaces.map((space) => (
            <TouchableOpacity
              key={space.id}
              style={[styles.spaceCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: space.image }} style={styles.spaceImage} />
              <View style={styles.spaceInfo}>
                <View style={styles.spaceHeader}>
                  <Text style={[styles.spaceName, { color: colors.text }]}>{space.name}</Text>
                </View>
                <View style={styles.spaceStats}>
                  <View style={styles.stat}>
                    <Users size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.members.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <MessageSquare size={14} color={colors.textTertiary} />
                    <Text style={[styles.statText, { color: colors.textTertiary }]}>
                      {space.posts} posts
                    </Text>
                  </View>
                  {space.isPublic ? (
                    <Globe size={14} color={colors.success} />
                  ) : (
                    <Lock size={14} color={colors.warning} />
                  )}
                </View>
              </View>
              <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.joinButtonText, { color: colors.primary }]}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Go Live Modal */}
      <Modal
        visible={showGoLiveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoLiveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.goLiveModalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Start a Broadcast</Text>
              <TouchableOpacity onPress={() => setShowGoLiveModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.goLiveForm} showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Broadcast Title</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
                placeholder="What's your broadcast about?"
                placeholderTextColor={colors.textTertiary}
                value={broadcastTitle}
                onChangeText={setBroadcastTitle}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 16 }]}>
                <Text>Select Space</Text>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.spaceSelector}>
                {spaces.map((space) => (
                  <TouchableOpacity
                    key={space.id}
                    style={[
                      styles.spaceOption,
                      { backgroundColor: colors.surface },
                      selectedSpace === space.id && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => setSelectedSpace(space.id)}
                  >
                    <Image source={{ uri: space.image }} style={styles.spaceOptionImage} />
                    <Text style={[styles.spaceOptionName, { color: colors.text }]} numberOfLines={1}>
                      {space.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.settingsSection}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>Allow Recording</Text>
                    <Text style={[styles.settingDesc, { color: colors.textTertiary }]}>
                      <Text>Save broadcast for replay</Text>
                    </Text>
                  </View>
                  <Switch
                    value={allowRecording}
                    onValueChange={setAllowRecording}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>Speaker Requests</Text>
                    <Text style={[styles.settingDesc, { color: colors.textTertiary }]}>
                      <Text>Allow listeners to request to speak</Text>
                    </Text>
                  </View>
                  <Switch
                    value={allowRequests}
                    onValueChange={setAllowRequests}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.startBroadcastButton,
                  { backgroundColor: broadcastTitle.trim() && selectedSpace ? '#E53935' : colors.border }
                ]}
                onPress={startBroadcast}
                disabled={!broadcastTitle.trim() || !selectedSpace}
              >
                <Radio size={20} color="#FFF" />
                <Text style={styles.startBroadcastText}>Go Live Now</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Live Room Modal */}
      <Modal
        visible={showLiveRoomModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLiveRoomModal(false)}
      >
        <View style={[styles.liveRoomContainer, { backgroundColor: '#1A1A2E', paddingTop: insets.top }]}>
          <View style={styles.liveRoomHeader}>
            <TouchableOpacity 
              style={styles.minimizeButton}
              onPress={() => setShowLiveRoomModal(false)}
            >
              <View style={styles.minimizeBar} />
            </TouchableOpacity>
            <View style={styles.liveRoomInfo}>
              <View style={styles.liveBadge}>
                <View style={styles.livePulse} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
              <Text style={styles.liveRoomListeners}>
                {selectedBroadcast?.listeners.toLocaleString()} listening
              </Text>
            </View>
            <View style={styles.liveRoomActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Share2 size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Settings size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.liveRoomContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.liveRoomTitle}>{selectedBroadcast?.title}</Text>
            
            <View style={styles.hostSection}>
              <Text style={styles.sectionLabel}>HOST</Text>
              <View style={styles.hostCard}>
                <Image 
                  source={{ uri: selectedBroadcast?.host.avatar }} 
                  style={styles.liveHostAvatar} 
                />
                <Text style={styles.liveHostName}>{selectedBroadcast?.host.name}</Text>
                <Crown size={16} color="#FFD700" />
              </View>
            </View>

            <View style={styles.speakersSection}>
              <Text style={styles.sectionLabel}>SPEAKERS</Text>
              <View style={styles.speakersGrid}>
                {selectedBroadcast?.speakers.map((speaker) => (
                  <View key={speaker.name} style={styles.speakerCard}>
                    <View style={[
                      styles.speakerAvatarLarge,
                      speaker.isSpeaking && styles.speakingBorderLarge
                    ]}>
                      <Image source={{ uri: speaker.avatar }} style={styles.speakerAvatarImg} />
                      {speaker.isSpeaking && (
                        <View style={styles.speakingWave}>
                          <Volume2 size={12} color="#FFF" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.speakerName}>{speaker.name}</Text>
                    {speaker.isSpeaking && (
                      <Text style={styles.speakingLabel}>Speaking</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.listenersSection}>
              <Text style={styles.sectionLabel}>LISTENERS</Text>
              <View style={styles.listenerAvatars}>
                {[1,2,3,4,5,6,7,8].map((i) => (
                  <Image 
                    key={i}
                    source={{ uri: `https://images.unsplash.com/photo-150000000000${i}-000000000000?w=50&h=50&fit=crop` }}
                    style={styles.listenerAvatar}
                  />
                ))}
                <View style={styles.moreListeners}>
                  <Text style={styles.moreListenersText}>+{(selectedBroadcast?.listeners || 0) - 8}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.liveRoomControls, { paddingBottom: insets.bottom + 16 }]}>
            <TouchableOpacity 
              style={[styles.controlButton, handRaised && styles.activeControl]}
              onPress={() => setHandRaised(!handRaised)}
            >
              <Hand size={24} color={handRaised ? '#E53935' : '#FFF'} />
              <Text style={[styles.controlLabel, handRaised && { color: '#E53935' }]}>
                {handRaised ? 'Raised' : 'Raise Hand'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, styles.micButton, isMuted && styles.mutedMic]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <MicOff size={28} color="#FFF" />
              ) : (
                <Mic size={28} color="#FFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <UserPlus size={24} color="#FFF" />
              <Text style={styles.controlLabel}>Invite</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, styles.leaveButton]}
              onPress={endBroadcast}
            >
              <Phone size={24} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
              <Text style={[styles.controlLabel, { color: '#E53935' }]}>Leave</Text>
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
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  goLiveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  goLiveText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  larecoinMobileSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  larecoinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  larecoinBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  larecoinInfo: {
    flex: 1,
  },
  larecoinTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  larecoinSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  larecoinActions: {
    flexDirection: 'row',
    gap: 10,
  },
  larecoinAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  larecoinActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
  },
  liveCount: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  liveCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  liveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveHostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  spaceBadge: {
    fontSize: 12,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  liveBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  broadcastTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    marginBottom: 12,
  },
  speakersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  speakerAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speakerAvatarContainer: {
    position: 'relative',
  },
  speakerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  speakingBorder: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    borderRadius: 18,
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 2,
  },
  moreSpeakers: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreSpeakersText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  listenerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listenerCount: {
    fontSize: 13,
  },
  liveCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  startedAt: {
    fontSize: 12,
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E53935',
  },
  recordingText: {
    color: '#E53935',
    fontSize: 11,
    fontWeight: '500' as const,
  },
  joinLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  joinLiveText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  spaceImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spaceName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  trendingBadge: {
    padding: 4,
    borderRadius: 6,
  },
  spaceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  goLiveModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  goLiveForm: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  spaceSelector: {
    marginTop: 8,
  },
  spaceOption: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  spaceOptionImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 8,
  },
  spaceOptionName: {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  settingsSection: {
    marginTop: 24,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  startBroadcastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
    marginBottom: 20,
    gap: 10,
  },
  startBroadcastText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  liveRoomContainer: {
    flex: 1,
  },
  liveRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  minimizeButton: {
    padding: 8,
  },
  minimizeBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
  },
  liveRoomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveRoomListeners: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  liveRoomActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: {
    padding: 4,
  },
  liveRoomContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  liveRoomTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    marginVertical: 20,
  },
  hostSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  liveHostAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  liveHostName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  speakersSection: {
    marginBottom: 24,
  },
  speakersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  speakerCard: {
    alignItems: 'center',
    width: 80,
  },
  speakerAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    position: 'relative',
  },
  speakerAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  speakingBorderLarge: {
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  speakingWave: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 4,
  },
  speakerName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  speakingLabel: {
    color: '#4CAF50',
    fontSize: 10,
    marginTop: 2,
  },
  listenersSection: {
    marginBottom: 24,
  },
  listenerAvatars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listenerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  moreListeners: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreListenersText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  liveRoomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  controlLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 4,
  },
  activeControl: {
    backgroundColor: 'rgba(229,57,53,0.15)',
    borderRadius: 12,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedMic: {
    backgroundColor: '#757575',
  },
  leaveButton: {
    backgroundColor: 'rgba(229,57,53,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
