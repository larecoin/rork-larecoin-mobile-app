import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  Switch
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Phone, 
  Video, 
  MessageSquare, 
  Search, 
  Plus, 
  X, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Users,
  UserPlus,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Star,
  MoreVertical,
  Camera,
  CameraOff,
  Maximize2,
  Minimize2,
  Grid,
  Settings,
  ChevronRight,
  Hash,
  Voicemail,
  Shield,
  Zap,
  Globe,
  Send,
  Smile
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  lastSeen?: string;
  isFavorite?: boolean;
}

interface CallLog {
  id: string;
  contact: Contact;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  duration?: string;
  timestamp: string;
  isGroupCall?: boolean;
  participants?: number;
}

interface SMSThread {
  id: string;
  contact: Contact;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 123-4567', status: 'online', isFavorite: true },
  { id: '2', name: 'Sarah Williams', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 234-5678', status: 'online', isFavorite: true },
  { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 345-6789', status: 'away', lastSeen: '5m ago' },
  { id: '4', name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 456-7890', status: 'offline', lastSeen: '2h ago' },
  { id: '5', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 567-8901', status: 'busy' },
  { id: '6', name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 678-9012', status: 'online' },
  { id: '7', name: 'David Brown', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 789-0123', status: 'offline', lastSeen: '1d ago' },
  { id: '8', name: 'Jennifer Lee', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', phoneNumber: '+1 (555) 890-1234', status: 'online', isFavorite: true },
];

const mockCallLogs: CallLog[] = [
  { id: '1', contact: mockContacts[0], type: 'outgoing', callType: 'video', duration: '15:32', timestamp: '10 min ago' },
  { id: '2', contact: mockContacts[1], type: 'incoming', callType: 'voice', duration: '5:21', timestamp: '1 hour ago' },
  { id: '3', contact: mockContacts[2], type: 'missed', callType: 'voice', timestamp: '3 hours ago' },
  { id: '4', contact: mockContacts[3], type: 'outgoing', callType: 'voice', duration: '2:45', timestamp: 'Yesterday', isGroupCall: true, participants: 4 },
  { id: '5', contact: mockContacts[4], type: 'incoming', callType: 'video', duration: '28:15', timestamp: 'Yesterday' },
  { id: '6', contact: mockContacts[5], type: 'missed', callType: 'video', timestamp: '2 days ago' },
];

const mockSMSThreads: SMSThread[] = [
  { id: '1', contact: mockContacts[0], lastMessage: 'Hey, are you joining the call later?', timestamp: '2m', unread: 2 },
  { id: '2', contact: mockContacts[1], lastMessage: 'Thanks for the help!', timestamp: '1h', unread: 0 },
  { id: '3', contact: mockContacts[2], lastMessage: 'Let me know when you\'re free', timestamp: '3h', unread: 1 },
  { id: '4', contact: mockContacts[3], lastMessage: 'See you tomorrow!', timestamp: 'Yesterday', unread: 0 },
];

export default function LarecoinMobileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  
  const [activeTab, setActiveTab] = useState<'calls' | 'contacts' | 'sms' | 'dialpad'>('calls');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showGroupCallModal, setShowGroupCallModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<Contact[]>([]);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [dialpadNumber, setDialpadNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCallActive]);

  useEffect(() => {
    if (showIncomingCall) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [showIncomingCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (contact: Contact, type: 'voice' | 'video') => {
    setSelectedContact(contact);
    setCallType(type);
    setIsCallActive(true);
    setCallDuration(0);
    setShowCallModal(true);
  };

  const startGroupCall = () => {
    if (selectedParticipants.length < 2) return;
    setCallType('voice');
    setIsCallActive(true);
    setCallDuration(0);
    setShowGroupCallModal(false);
    setShowCallModal(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setShowCallModal(false);
    setSelectedContact(null);
    setSelectedParticipants([]);
    setCallDuration(0);
    setIsMuted(false);
    setIsSpeaker(false);
    setIsVideoEnabled(true);
  };

  const answerCall = () => {
    setShowIncomingCall(false);
    setIsCallActive(true);
    setCallDuration(0);
    setShowCallModal(true);
  };

  const declineCall = () => {
    setShowIncomingCall(false);
    setSelectedContact(null);
  };

  const toggleParticipant = (contact: Contact) => {
    if (selectedParticipants.find(p => p.id === contact.id)) {
      setSelectedParticipants(prev => prev.filter(p => p.id !== contact.id));
    } else if (selectedParticipants.length < 9) {
      setSelectedParticipants(prev => [...prev, contact]);
    }
  };

  const openSMS = (contact: Contact) => {
    setSelectedContact(contact);
    setShowSMSModal(true);
  };

  const sendSMS = () => {
    if (!smsMessage.trim()) return;
    console.log('Sending SMS to:', selectedContact?.name, 'Message:', smsMessage);
    setSmsMessage('');
  };

  const dialpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const dialpadLetters: Record<string, string> = {
    '2': 'ABC', '3': 'DEF', '4': 'GHI', '5': 'JKL',
    '6': 'MNO', '7': 'PQRS', '8': 'TUV', '9': 'WXYZ'
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'busy': return '#F44336';
      case 'away': return '#FF9800';
      default: return colors.textTertiary;
    }
  };

  const filteredContacts = mockContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber.includes(searchQuery)
  );

  const favoriteContacts = mockContacts.filter(c => c.isFavorite);

  const renderCallLog = ({ item }: { item: CallLog }) => (
    <TouchableOpacity 
      style={[styles.callLogItem, { backgroundColor: colors.surface }]}
      onPress={() => startCall(item.contact, item.callType)}
    >
      <View style={styles.callLogLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.contact.avatar }} style={styles.avatar} />
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.contact.status) }]} />
        </View>
        <View style={styles.callLogInfo}>
          <Text style={[styles.contactName, { color: colors.text }]}>{item.contact.name}</Text>
          <View style={styles.callTypeRow}>
            {item.type === 'incoming' && <PhoneIncoming size={14} color={colors.success} />}
            {item.type === 'outgoing' && <PhoneOutgoing size={14} color={colors.primary} />}
            {item.type === 'missed' && <PhoneIncoming size={14} color={colors.error} />}
            <Text style={[
              styles.callTypeText, 
              { color: item.type === 'missed' ? colors.error : colors.textTertiary }
            ]}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              {item.isGroupCall && ` • Group (${item.participants})`}
              {item.duration && ` • ${item.duration}`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.callLogRight}>
        <Text style={[styles.callTimestamp, { color: colors.textTertiary }]}>{item.timestamp}</Text>
        <View style={styles.callActions}>
          <TouchableOpacity 
            style={[styles.callActionBtn, { backgroundColor: colors.primary + '15' }]}
            onPress={() => startCall(item.contact, 'voice')}
          >
            <Phone size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.callActionBtn, { backgroundColor: colors.success + '15' }]}
            onPress={() => startCall(item.contact, 'video')}
          >
            <Video size={18} color={colors.success} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={[styles.contactItem, { backgroundColor: colors.surface }]}
      onPress={() => startCall(item, 'voice')}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactPhone, { color: colors.textTertiary }]}>{item.phoneNumber}</Text>
        <Text style={[styles.contactStatus, { color: getStatusColor(item.status) }]}>
          {item.status === 'offline' && item.lastSeen ? `Last seen ${item.lastSeen}` : item.status}
        </Text>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={[styles.contactActionBtn, { backgroundColor: colors.primary + '15' }]}
          onPress={() => startCall(item, 'voice')}
        >
          <Phone size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.contactActionBtn, { backgroundColor: colors.success + '15' }]}
          onPress={() => startCall(item, 'video')}
        >
          <Video size={20} color={colors.success} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.contactActionBtn, { backgroundColor: colors.warning + '15' }]}
          onPress={() => openSMS(item)}
        >
          <MessageSquare size={20} color={colors.warning} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSMSThread = ({ item }: { item: SMSThread }) => (
    <TouchableOpacity 
      style={[styles.smsItem, { backgroundColor: item.unread > 0 ? colors.primary + '08' : colors.surface }]}
      onPress={() => openSMS(item.contact)}
    >
      <Image source={{ uri: item.contact.avatar }} style={styles.smsAvatar} />
      <View style={styles.smsInfo}>
        <View style={styles.smsHeader}>
          <Text style={[styles.smsName, { color: colors.text }]}>{item.contact.name}</Text>
          <Text style={[styles.smsTime, { color: colors.textTertiary }]}>{item.timestamp}</Text>
        </View>
        <Text style={[styles.smsPreview, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Larecoin Mobile' }} />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.brandHeader}>
          <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
            <Phone size={20} color="#FFF" />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>Larecoin Mobile</Text>
            <Text style={[styles.brandSubtitle, { color: colors.textTertiary }]}>
              Free calls & messages worldwide
            </Text>
          </View>
        </View>
        
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search contacts..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        {(['calls', 'contacts', 'sms', 'dialpad'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            {tab === 'calls' && <Clock size={20} color={activeTab === tab ? colors.primary : colors.textTertiary} />}
            {tab === 'contacts' && <Users size={20} color={activeTab === tab ? colors.primary : colors.textTertiary} />}
            {tab === 'sms' && <MessageSquare size={20} color={activeTab === tab ? colors.primary : colors.textTertiary} />}
            {tab === 'dialpad' && <Hash size={20} color={activeTab === tab ? colors.primary : colors.textTertiary} />}
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textTertiary }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'calls' && (
        <View style={styles.content}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.primary }]}
              onPress={() => setShowGroupCallModal(true)}
            >
              <Users size={20} color="#FFF" />
              <Text style={styles.quickActionText}>Group Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.success }]}>
              <Video size={20} color="#FFF" />
              <Text style={styles.quickActionText}>Video Meet</Text>
            </TouchableOpacity>
          </View>

          {favoriteContacts.length > 0 && (
            <View style={styles.favoritesSection}>
              <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Favorites</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {favoriteContacts.map((contact) => (
                  <TouchableOpacity 
                    key={contact.id}
                    style={styles.favoriteItem}
                    onPress={() => startCall(contact, 'voice')}
                  >
                    <View style={styles.favoriteAvatarWrap}>
                      <Image source={{ uri: contact.avatar }} style={styles.favoriteAvatar} />
                      <View style={[styles.favoriteStatusDot, { backgroundColor: getStatusColor(contact.status) }]} />
                    </View>
                    <Text style={[styles.favoriteName, { color: colors.text }]} numberOfLines={1}>
                      {contact.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: colors.textTertiary, paddingHorizontal: 16 }]}>
            Recent Calls
          </Text>
          <FlatList
            data={mockCallLogs}
            renderItem={renderCallLog}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {activeTab === 'contacts' && (
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'sms' && (
        <FlatList
          data={mockSMSThreads}
          renderItem={renderSMSThread}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'dialpad' && (
        <View style={styles.dialpadContainer}>
          <Text style={[styles.dialpadNumber, { color: colors.text }]}>
            {dialpadNumber || 'Enter number'}
          </Text>
          <View style={styles.dialpadGrid}>
            {dialpadKeys.map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.dialpadKey, { backgroundColor: colors.surface }]}
                onPress={() => setDialpadNumber(prev => prev + key)}
              >
                <Text style={[styles.dialpadKeyText, { color: colors.text }]}>{key}</Text>
                {dialpadLetters[key] && (
                  <Text style={[styles.dialpadLetters, { color: colors.textTertiary }]}>
                    {dialpadLetters[key]}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.dialpadActions}>
            <TouchableOpacity 
              style={[styles.dialAction, { backgroundColor: colors.success }]}
              onPress={() => {
                if (dialpadNumber) {
                  startCall({ 
                    id: 'dial', 
                    name: dialpadNumber, 
                    avatar: '', 
                    phoneNumber: dialpadNumber, 
                    status: 'offline' 
                  }, 'voice');
                }
              }}
            >
              <Phone size={28} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.dialAction, styles.deleteAction, { backgroundColor: colors.surface }]}
              onPress={() => setDialpadNumber(prev => prev.slice(0, -1))}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Call Modal */}
      <Modal visible={showCallModal} animationType="slide" transparent={false}>
        <View style={[styles.callModal, { backgroundColor: '#1A1A2E' }]}>
          <View style={[styles.callHeader, { paddingTop: insets.top + 10 }]}>
            {callType === 'video' && isVideoEnabled ? (
              <View style={styles.videoContainer}>
                <Image 
                  source={{ uri: selectedContact?.avatar || selectedParticipants[0]?.avatar }} 
                  style={styles.remoteVideo}
                />
                <View style={styles.localVideoContainer}>
                  <View style={[styles.localVideo, { backgroundColor: colors.surface }]}>
                    <Camera size={24} color={colors.textTertiary} />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.voiceCallHeader}>
                {selectedParticipants.length > 0 ? (
                  <View style={styles.groupAvatars}>
                    {selectedParticipants.slice(0, 4).map((p, i) => (
                      <Image 
                        key={p.id} 
                        source={{ uri: p.avatar }} 
                        style={[styles.groupAvatar, { marginLeft: i > 0 ? -20 : 0 }]} 
                      />
                    ))}
                  </View>
                ) : (
                  <Image 
                    source={{ uri: selectedContact?.avatar }} 
                    style={styles.callAvatar}
                  />
                )}
                <Text style={styles.callName}>
                  {selectedParticipants.length > 0 
                    ? `Group Call (${selectedParticipants.length + 1})` 
                    : selectedContact?.name}
                </Text>
                <Text style={styles.callStatus}>
                  {isCallActive ? formatDuration(callDuration) : 'Connecting...'}
                </Text>
              </View>
            )}
          </View>

          {selectedParticipants.length > 0 && (
            <View style={styles.participantsStrip}>
              <Text style={styles.participantsLabel}>Participants</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedParticipants.map((p) => (
                  <View key={p.id} style={styles.participantItem}>
                    <Image source={{ uri: p.avatar }} style={styles.participantAvatar} />
                    <Text style={styles.participantName}>{p.name.split(' ')[0]}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={[styles.callControls, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity 
              style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={24} color="#FFF" /> : <Mic size={24} color="#FFF" />}
              <Text style={styles.controlLabel}>Mute</Text>
            </TouchableOpacity>

            {callType === 'video' && (
              <TouchableOpacity 
                style={[styles.controlBtn, !isVideoEnabled && styles.controlBtnActive]}
                onPress={() => setIsVideoEnabled(!isVideoEnabled)}
              >
                {isVideoEnabled ? <Camera size={24} color="#FFF" /> : <CameraOff size={24} color="#FFF" />}
                <Text style={styles.controlLabel}>Camera</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              {isSpeaker ? <Volume2 size={24} color="#FFF" /> : <VolumeX size={24} color="#FFF" />}
              <Text style={styles.controlLabel}>Speaker</Text>
            </TouchableOpacity>

            {selectedParticipants.length < 9 && (
              <TouchableOpacity 
                style={styles.controlBtn}
                onPress={() => {
                  setShowCallModal(false);
                  setShowGroupCallModal(true);
                }}
              >
                <UserPlus size={24} color="#FFF" />
                <Text style={styles.controlLabel}>Add</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.endCallBtn]}
              onPress={endCall}
            >
              <PhoneOff size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Incoming Call Modal */}
      <Modal visible={showIncomingCall} animationType="fade" transparent>
        <View style={styles.incomingCallOverlay}>
          <Animated.View style={[styles.incomingCallCard, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.incomingLabel}>Incoming Call</Text>
            <Image source={{ uri: selectedContact?.avatar }} style={styles.incomingAvatar} />
            <Text style={styles.incomingName}>{selectedContact?.name}</Text>
            <Text style={styles.incomingPhone}>{selectedContact?.phoneNumber}</Text>
            
            <View style={styles.incomingActions}>
              <TouchableOpacity style={styles.declineBtn} onPress={declineCall}>
                <PhoneOff size={28} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerBtn} onPress={answerCall}>
                <Phone size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Group Call Setup Modal */}
      <Modal visible={showGroupCallModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.groupCallModal, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Start Group Call</Text>
              <TouchableOpacity onPress={() => {
                setShowGroupCallModal(false);
                setSelectedParticipants([]);
              }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.participantCount, { color: colors.textSecondary }]}>
              Select up to 9 participants ({selectedParticipants.length}/9)
            </Text>

            {selectedParticipants.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedStrip}>
                {selectedParticipants.map((p) => (
                  <TouchableOpacity 
                    key={p.id} 
                    style={styles.selectedParticipant}
                    onPress={() => toggleParticipant(p)}
                  >
                    <Image source={{ uri: p.avatar }} style={styles.selectedAvatar} />
                    <View style={styles.removeSelected}>
                      <X size={10} color="#FFF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <FlatList
              data={mockContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedParticipants.find(p => p.id === item.id);
                return (
                  <TouchableOpacity 
                    style={[styles.selectableContact, { backgroundColor: colors.surface }]}
                    onPress={() => toggleParticipant(item)}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.selectableAvatar} />
                    <View style={styles.selectableInfo}>
                      <Text style={[styles.selectableName, { color: colors.text }]}>{item.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={[styles.miniStatus, { backgroundColor: getStatusColor(item.status) }]} />
                        <Text style={[styles.selectableStatus, { color: colors.textTertiary }]}>{item.status}</Text>
                      </View>
                    </View>
                    <View style={[
                      styles.checkbox,
                      { borderColor: isSelected ? colors.primary : colors.border },
                      isSelected && { backgroundColor: colors.primary }
                    ]}>
                      {isSelected && <View style={styles.checkmark} />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              style={styles.contactsList}
            />

            <View style={styles.groupCallActions}>
              <TouchableOpacity 
                style={[styles.startGroupBtn, { backgroundColor: colors.success }]}
                onPress={startGroupCall}
                disabled={selectedParticipants.length < 1}
              >
                <Phone size={20} color="#FFF" />
                <Text style={styles.startGroupText}>Start Voice Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.startGroupBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  if (selectedParticipants.length >= 1) {
                    setCallType('video');
                    startGroupCall();
                  }
                }}
                disabled={selectedParticipants.length < 1}
              >
                <Video size={20} color="#FFF" />
                <Text style={styles.startGroupText}>Start Video Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SMS Modal */}
      <Modal visible={showSMSModal} animationType="slide" transparent={false}>
        <View style={[styles.smsModal, { backgroundColor: colors.background, paddingTop: insets.top }]}>
          <View style={[styles.smsModalHeader, { backgroundColor: colors.surface }]}>
            <TouchableOpacity onPress={() => setShowSMSModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.smsHeaderInfo}>
              <Image source={{ uri: selectedContact?.avatar }} style={styles.smsHeaderAvatar} />
              <View>
                <Text style={[styles.smsHeaderName, { color: colors.text }]}>{selectedContact?.name}</Text>
                <Text style={[styles.smsHeaderPhone, { color: colors.textTertiary }]}>
                  {selectedContact?.phoneNumber}
                </Text>
              </View>
            </View>
            <View style={styles.smsHeaderActions}>
              <TouchableOpacity onPress={() => {
                setShowSMSModal(false);
                if (selectedContact) startCall(selectedContact, 'voice');
              }}>
                <Phone size={22} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setShowSMSModal(false);
                if (selectedContact) startCall(selectedContact, 'video');
              }}>
                <Video size={22} color={colors.success} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.smsMessages}>
            <View style={[styles.messageBubble, styles.receivedMessage, { backgroundColor: colors.surface }]}>
              <Text style={[styles.messageText, { color: colors.text }]}>Hey! How are you?</Text>
              <Text style={[styles.messageTime, { color: colors.textTertiary }]}>10:30 AM</Text>
            </View>
            <View style={[styles.messageBubble, styles.sentMessage, { backgroundColor: colors.primary }]}>
              <Text style={[styles.messageText, { color: '#FFF' }]}>I am good! Just finished a call.</Text>
              <Text style={[styles.messageTime, { color: 'rgba(255,255,255,0.7)' }]}>10:32 AM</Text>
            </View>
            <View style={[styles.messageBubble, styles.receivedMessage, { backgroundColor: colors.surface }]}>
              <Text style={[styles.messageText, { color: colors.text }]}>Great! Want to catch up later?</Text>
              <Text style={[styles.messageTime, { color: colors.textTertiary }]}>10:33 AM</Text>
            </View>
          </ScrollView>

          <View style={[styles.smsInputContainer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 10 }]}>
            <TouchableOpacity style={styles.attachBtn}>
              <Plus size={22} color={colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.smsInput, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              value={smsMessage}
              onChangeText={setSmsMessage}
              multiline
            />
            <TouchableOpacity style={styles.emojiBtn}>
              <Smile size={22} color={colors.textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendBtn, { backgroundColor: colors.primary }]}
              onPress={sendSMS}
            >
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Simulate incoming call button for demo */}
      <TouchableOpacity 
        style={[styles.demoCallBtn, { backgroundColor: colors.warning, bottom: insets.bottom + 90 }]}
        onPress={() => {
          setSelectedContact(mockContacts[Math.floor(Math.random() * mockContacts.length)]);
          setCallType('voice');
          setShowIncomingCall(true);
        }}
      >
        <PhoneIncoming size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    gap: 12,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  brandSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  content: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  favoritesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  favoriteItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70,
  },
  favoriteAvatarWrap: {
    position: 'relative',
    marginBottom: 6,
  },
  favoriteAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  favoriteStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  favoriteName: {
    fontSize: 12,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  callLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  callLogLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  callLogInfo: {
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  callTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTypeText: {
    fontSize: 13,
  },
  callLogRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  callTimestamp: {
    fontSize: 12,
  },
  callActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactPhone: {
    fontSize: 13,
    marginTop: 2,
  },
  contactStatus: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  smsAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  smsInfo: {
    flex: 1,
  },
  smsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  smsName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  smsTime: {
    fontSize: 12,
  },
  smsPreview: {
    fontSize: 14,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  dialpadContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    alignItems: 'center',
  },
  dialpadNumber: {
    fontSize: 32,
    fontWeight: '300' as const,
    height: 50,
    marginBottom: 20,
  },
  dialpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  dialpadKey: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialpadKeyText: {
    fontSize: 28,
    fontWeight: '400' as const,
  },
  dialpadLetters: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 2,
  },
  dialpadActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 24,
  },
  dialAction: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  callModal: {
    flex: 1,
  },
  callHeader: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  localVideoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  localVideo: {
    width: 100,
    height: 140,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceCallHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  groupAvatars: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1A1A2E',
  },
  callName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  callStatus: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  participantsStrip: {
    padding: 16,
  },
  participantsLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  participantItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  participantName: {
    color: '#FFF',
    fontSize: 12,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlBtn: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  controlLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 6,
  },
  endCallBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingCallOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingCallCard: {
    alignItems: 'center',
    padding: 40,
  },
  incomingLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  incomingAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  incomingName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  incomingPhone: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginBottom: 40,
  },
  incomingActions: {
    flexDirection: 'row',
    gap: 60,
  },
  declineBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  groupCallModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  participantCount: {
    padding: 16,
    paddingBottom: 8,
  },
  selectedStrip: {
    paddingHorizontal: 16,
    maxHeight: 70,
  },
  selectedParticipant: {
    position: 'relative',
    marginRight: 12,
  },
  selectedAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  removeSelected: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactsList: {
    maxHeight: 300,
  },
  selectableContact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  selectableAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  selectableInfo: {
    flex: 1,
  },
  selectableName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  miniStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  selectableStatus: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  groupCallActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  startGroupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startGroupText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  smsModal: {
    flex: 1,
  },
  smsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  smsHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  smsHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  smsHeaderName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  smsHeaderPhone: {
    fontSize: 12,
  },
  smsHeaderActions: {
    flexDirection: 'row',
    gap: 16,
  },
  smsMessages: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  smsInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
  },
  attachBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smsInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  emojiBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCallBtn: {
    position: 'absolute',
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
