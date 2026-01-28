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
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Plus, 
  X, 
  Users,
  UserPlus,
  Send,
  Smile,
  Image as ImageIcon,
  Video,
  FileText,
  Link2,
  BarChart3,
  MessageCircle,
  Hash,
  Lock,
  Globe,
  Settings,
  MoreVertical,
  Check,
  CheckCheck,
  Phone,
  Camera,
  Mic,
  Play,
  Pause,
  ChevronRight,
  Crown,
  Bell,
  BellOff,
  Trash2,
  LogOut,
  Copy,
  Share2,
  Pin,
  Reply,
  Forward,
  Star,
  AtSign,
  Paperclip,
  Gift
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing';
  isAdmin?: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: string;
  endsAt?: string;
  allowMultiple?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'gif' | 'link' | 'poll' | 'voice';
  mediaUrl?: string;
  linkPreview?: { title: string; description: string; image: string; url: string };
  poll?: Poll;
  replyTo?: { id: string; senderName: string; content: string };
  reactions?: { emoji: string; count: number; users: string[] }[];
  isRead?: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  type: 'group' | 'direct';
  members: User[];
  lastMessage?: { content: string; sender: string; timestamp: string };
  unread: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isPublic?: boolean;
  description?: string;
  inviteLink?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', status: 'online', isAdmin: true },
  { id: '2', name: 'Sarah Williams', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', status: 'online' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', status: 'offline' },
  { id: '4', name: 'Emma Davis', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', status: 'typing' },
  { id: '5', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', status: 'online' },
  { id: '6', name: 'Lisa Anderson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', status: 'offline' },
  { id: '7', name: 'David Brown', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop', status: 'online' },
  { id: '8', name: 'You', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', status: 'online' },
];

const currentUser = mockUsers[7];

const mockChatRooms: ChatRoom[] = [
  { 
    id: '1', 
    name: 'Crypto Trading Hub', 
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', 
    type: 'group',
    members: mockUsers.slice(0, 6),
    lastMessage: { content: 'Anyone watching BTC right now?', sender: 'Alex', timestamp: '2m' },
    unread: 5,
    isPinned: true,
    isPublic: true,
    description: 'Discuss crypto trading strategies and market analysis',
    inviteLink: 'larecoin.app/chat/crypto-hub'
  },
  { 
    id: '2', 
    name: 'NFT Collectors', 
    avatar: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', 
    type: 'group',
    members: mockUsers.slice(2, 7),
    lastMessage: { content: 'New drop just announced! 🔥', sender: 'Mike', timestamp: '15m' },
    unread: 12,
    isPublic: true,
    description: 'For NFT enthusiasts and collectors'
  },
  { 
    id: '3', 
    name: 'Sarah Williams', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 
    type: 'direct',
    members: [mockUsers[1], currentUser],
    lastMessage: { content: 'Thanks for the help!', sender: 'Sarah', timestamp: '1h' },
    unread: 0,
  },
  { 
    id: '4', 
    name: 'DeFi Strategies', 
    avatar: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop', 
    type: 'group',
    members: mockUsers.slice(0, 5),
    lastMessage: { content: 'Check out this yield farm', sender: 'James', timestamp: '3h' },
    unread: 3,
    isMuted: true,
    isPublic: false,
    description: 'Private group for advanced DeFi strategies'
  },
  { 
    id: '5', 
    name: 'Mike Johnson', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 
    type: 'direct',
    members: [mockUsers[2], currentUser],
    lastMessage: { content: 'Let me know when you\'re free', sender: 'Mike', timestamp: 'Yesterday' },
    unread: 1,
  },
];

const mockMessages: Message[] = [
  { id: '1', senderId: '1', senderName: 'Alex Chen', senderAvatar: mockUsers[0].avatar, content: 'Hey everyone! Welcome to the chat 👋', timestamp: '10:00 AM', type: 'text', isRead: true },
  { id: '2', senderId: '2', senderName: 'Sarah Williams', senderAvatar: mockUsers[1].avatar, content: 'Thanks for adding me!', timestamp: '10:02 AM', type: 'text', isRead: true },
  { id: '3', senderId: '1', senderName: 'Alex Chen', senderAvatar: mockUsers[0].avatar, content: '', timestamp: '10:05 AM', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop', isRead: true },
  { id: '4', senderId: '3', senderName: 'Mike Johnson', senderAvatar: mockUsers[2].avatar, content: 'Check out this article:', timestamp: '10:10 AM', type: 'link', linkPreview: { title: 'Bitcoin Hits New ATH', description: 'BTC reaches $150k milestone', image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=100&fit=crop', url: 'https://example.com' }, isRead: true },
  { id: '5', senderId: '1', senderName: 'Alex Chen', senderAvatar: mockUsers[0].avatar, content: '', timestamp: '10:15 AM', type: 'poll', poll: { id: 'p1', question: 'What\'s your prediction for BTC this month?', options: [{ id: 'o1', text: 'Above $160k', votes: 12, voters: ['1', '2', '3'] }, { id: 'o2', text: '$140k - $160k', votes: 8, voters: ['4', '5'] }, { id: 'o3', text: 'Below $140k', votes: 3, voters: ['6'] }], totalVotes: 23, createdBy: '1' }, isRead: true },
  { id: '6', senderId: '8', senderName: 'You', senderAvatar: currentUser.avatar, content: 'Voted for above $160k! 🚀', timestamp: '10:18 AM', type: 'text', isRead: true },
  { id: '7', senderId: '4', senderName: 'Emma Davis', senderAvatar: mockUsers[3].avatar, content: '', timestamp: '10:20 AM', type: 'gif', mediaUrl: 'https://media.giphy.com/media/trN9ber5LbxCDgkUhg/giphy.gif', isRead: true },
];

const emojiList = ['😀', '😂', '❤️', '🔥', '👍', '👎', '🚀', '💎', '🙌', '💰', '📈', '📉', '🤔', '😎', '🎉', '💪'];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [activeTab, setActiveTab] = useState<'all' | 'groups' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showChatInfoModal, setShowChatInfoModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublicGroup, setIsPublicGroup] = useState(true);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const filteredChats = mockChatRooms.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'groups' && chat.type === 'group') ||
      (activeTab === 'direct' && chat.type === 'direct');
    return matchesSearch && matchesTab;
  });

  const sendMessage = (type: Message['type'] = 'text', extraData?: Partial<Message>) => {
    if (type === 'text' && !newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: 'You',
      senderAvatar: currentUser.avatar,
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      isRead: false,
      replyTo: replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content || 'Media' } : undefined,
      ...extraData,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);
    setShowAttachMenu(false);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendPoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) return;
    
    const poll: Poll = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions.filter(o => o.trim()).map((text, i) => ({
        id: `opt-${i}`,
        text,
        votes: 0,
        voters: [],
      })),
      totalVotes: 0,
      createdBy: currentUser.id,
    };
    
    sendMessage('poll', { poll, content: '' });
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollModal(false);
  };

  const votePoll = (pollId: string, optionId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.poll?.id === pollId) {
        const updatedPoll = { ...msg.poll };
        updatedPoll.options = updatedPoll.options.map(opt => {
          if (opt.id === optionId && !opt.voters.includes(currentUser.id)) {
            return { ...opt, votes: opt.votes + 1, voters: [...opt.voters, currentUser.id] };
          }
          return opt;
        });
        updatedPoll.totalVotes = updatedPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
        return { ...msg, poll: updatedPoll };
      }
      return msg;
    }));
  };

  const toggleMember = (user: User) => {
    if (selectedMembers.find(m => m.id === user.id)) {
      setSelectedMembers(prev => prev.filter(m => m.id !== user.id));
    } else {
      setSelectedMembers(prev => [...prev, user]);
    }
  };

  const createGroup = () => {
    if (!groupName.trim() || selectedMembers.length < 1) return;
    console.log('Creating group:', groupName, selectedMembers);
    setShowCreateGroupModal(false);
    setGroupName('');
    setGroupDescription('');
    setSelectedMembers([]);
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const renderChatItem = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity 
      style={[
        styles.chatItem, 
        { backgroundColor: item.unread > 0 ? colors.primary + '08' : colors.surface }
      ]}
      onPress={() => setSelectedChat(item)}
    >
      <View style={styles.chatAvatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
        {item.type === 'direct' && (
          <View style={[
            styles.onlineIndicator, 
            { backgroundColor: item.members[0]?.status === 'online' ? '#4CAF50' : colors.textTertiary }
          ]} />
        )}
        {item.type === 'group' && (
          <View style={[styles.groupBadge, { backgroundColor: colors.primary }]}>
            <Users size={10} color="#FFF" />
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <View style={styles.chatNameRow}>
            {item.isPinned && <Pin size={12} color={colors.warning} />}
            <Text style={[styles.chatName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isMuted && <BellOff size={12} color={colors.textTertiary} />}
            {item.type === 'group' && !item.isPublic && <Lock size={12} color={colors.textTertiary} />}
          </View>
          <Text style={[styles.chatTime, { color: colors.textTertiary }]}>
            {item.lastMessage?.timestamp}
          </Text>
        </View>
        
        <View style={styles.chatPreview}>
          <Text style={[styles.chatMessage, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.type === 'group' && item.lastMessage?.sender && (
              <Text style={{ fontWeight: '500' as const }}>{item.lastMessage.sender}: </Text>
            )}
            {item.lastMessage?.content}
          </Text>
          {item.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (msg: Message, index: number) => {
    const isOwn = msg.senderId === currentUser.id;
    const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);
    
    return (
      <View key={msg.id} style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
        {!isOwn && showAvatar && (
          <Image source={{ uri: msg.senderAvatar }} style={styles.messageAvatar} />
        )}
        {!isOwn && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View style={[
          styles.messageBubble,
          isOwn ? [styles.ownMessage, { backgroundColor: colors.primary }] : [styles.otherMessage, { backgroundColor: colors.surface }]
        ]}>
          {!isOwn && showAvatar && (
            <Text style={[styles.messageSender, { color: colors.primary }]}>{msg.senderName}</Text>
          )}
          
          {msg.replyTo && (
            <View style={[styles.replyPreview, { borderLeftColor: colors.primary }]}>
              <Text style={[styles.replyName, { color: colors.primary }]}>{msg.replyTo.senderName}</Text>
              <Text style={[styles.replyContent, { color: colors.textTertiary }]} numberOfLines={1}>
                {msg.replyTo.content}
              </Text>
            </View>
          )}
          
          {msg.type === 'text' && (
            <Text style={[styles.messageText, { color: isOwn ? '#FFF' : colors.text }]}>
              {msg.content}
            </Text>
          )}
          
          {msg.type === 'image' && (
            <Image source={{ uri: msg.mediaUrl }} style={styles.messageImage} />
          )}
          
          {msg.type === 'gif' && (
            <Image source={{ uri: msg.mediaUrl }} style={styles.messageGif} />
          )}
          
          {msg.type === 'video' && (
            <View style={styles.videoPreview}>
              <Image source={{ uri: msg.mediaUrl }} style={styles.videoThumbnail} />
              <View style={styles.playButton}>
                <Play size={24} color="#FFF" fill="#FFF" />
              </View>
            </View>
          )}
          
          {msg.type === 'link' && msg.linkPreview && (
            <TouchableOpacity style={[styles.linkPreview, { backgroundColor: isOwn ? 'rgba(255,255,255,0.15)' : colors.background }]}>
              <Image source={{ uri: msg.linkPreview.image }} style={styles.linkImage} />
              <View style={styles.linkInfo}>
                <Text style={[styles.linkTitle, { color: isOwn ? '#FFF' : colors.text }]} numberOfLines={1}>
                  {msg.linkPreview.title}
                </Text>
                <Text style={[styles.linkDesc, { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textTertiary }]} numberOfLines={2}>
                  {msg.linkPreview.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          {msg.type === 'poll' && msg.poll && (
            <View style={styles.pollContainer}>
              <View style={styles.pollHeader}>
                <BarChart3 size={16} color={isOwn ? '#FFF' : colors.primary} />
                <Text style={[styles.pollTitle, { color: isOwn ? '#FFF' : colors.text }]}>Poll</Text>
              </View>
              <Text style={[styles.pollQuestion, { color: isOwn ? '#FFF' : colors.text }]}>
                {msg.poll.question}
              </Text>
              {msg.poll.options.map((option) => {
                const percentage = msg.poll!.totalVotes > 0 
                  ? Math.round((option.votes / msg.poll!.totalVotes) * 100) 
                  : 0;
                const hasVoted = option.voters.includes(currentUser.id);
                
                return (
                  <TouchableOpacity 
                    key={option.id} 
                    style={[
                      styles.pollOption,
                      { backgroundColor: isOwn ? 'rgba(255,255,255,0.15)' : colors.background }
                    ]}
                    onPress={() => votePoll(msg.poll!.id, option.id)}
                    disabled={option.voters.includes(currentUser.id)}
                  >
                    <View 
                      style={[
                        styles.pollProgress, 
                        { width: `${percentage}%`, backgroundColor: hasVoted ? colors.success : colors.primary + '30' }
                      ]} 
                    />
                    <Text style={[styles.pollOptionText, { color: isOwn ? '#FFF' : colors.text }]}>
                      {option.text}
                    </Text>
                    <Text style={[styles.pollVotes, { color: isOwn ? 'rgba(255,255,255,0.7)' : colors.textTertiary }]}>
                      {percentage}%
                    </Text>
                    {hasVoted && <Check size={14} color={colors.success} />}
                  </TouchableOpacity>
                );
              })}
              <Text style={[styles.pollTotal, { color: isOwn ? 'rgba(255,255,255,0.6)' : colors.textTertiary }]}>
                {msg.poll.totalVotes} votes
              </Text>
            </View>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, { color: isOwn ? 'rgba(255,255,255,0.6)' : colors.textTertiary }]}>
              {msg.timestamp}
            </Text>
            {isOwn && (
              msg.isRead ? <CheckCheck size={14} color="#4CAF50" /> : <Check size={14} color="rgba(255,255,255,0.6)" />
            )}
          </View>
        </View>
      </View>
    );
  };

  if (selectedChat) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.chatRoomHeader, { backgroundColor: colors.surface, paddingTop: insets.top }]}>
          <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatRoomInfo} onPress={() => setShowChatInfoModal(true)}>
            <Image source={{ uri: selectedChat.avatar }} style={styles.chatRoomAvatar} />
            <View>
              <Text style={[styles.chatRoomName, { color: colors.text }]}>{selectedChat.name}</Text>
              <Text style={[styles.chatRoomStatus, { color: colors.textTertiary }]}>
                {selectedChat.type === 'group' 
                  ? `${selectedChat.members.length} members`
                  : selectedChat.members[0]?.status === 'typing' 
                    ? 'typing...' 
                    : selectedChat.members[0]?.status}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.chatRoomActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Phone size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Video size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction} onPress={() => setShowChatInfoModal(true)}>
              <MoreVertical size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>
        
        {replyingTo && (
          <View style={[styles.replyBar, { backgroundColor: colors.surface }]}>
            <View style={styles.replyInfo}>
              <Reply size={16} color={colors.primary} />
              <View style={styles.replyDetails}>
                <Text style={[styles.replyToName, { color: colors.primary }]}>
                  Replying to {replyingTo.senderName}
                </Text>
                <Text style={[styles.replyToContent, { color: colors.textTertiary }]} numberOfLines={1}>
                  {replyingTo.content || 'Media'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <X size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 10 }]}>
            {showAttachMenu && (
              <View style={styles.attachMenu}>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#4CAF50' }]}>
                  <Camera size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#2196F3' }]}>
                  <ImageIcon size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#9C27B0' }]}>
                  <Video size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#FF9800' }]}>
                  <Gift size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#E91E63' }]} onPress={() => {
                  setShowAttachMenu(false);
                  setShowPollModal(true);
                }}>
                  <BarChart3 size={22} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.attachOption, { backgroundColor: '#607D8B' }]}>
                  <FileText size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.inputRow}>
              <TouchableOpacity 
                style={styles.attachBtn}
                onPress={() => setShowAttachMenu(!showAttachMenu)}
              >
                <Plus size={24} color={colors.primary} />
              </TouchableOpacity>
              
              <View style={[styles.textInputContainer, { backgroundColor: colors.background }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.text }]}
                  placeholder="Type a message..."
                  placeholderTextColor={colors.textTertiary}
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
                <TouchableOpacity 
                  style={styles.emojiBtn}
                  onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={22} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
              
              {newMessage.trim() ? (
                <TouchableOpacity 
                  style={[styles.sendBtn, { backgroundColor: colors.primary }]}
                  onPress={() => sendMessage()}
                >
                  <Send size={20} color="#FFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
                  <Mic size={20} color="#FFF" />
                </TouchableOpacity>
              )}
            </View>
            
            {showEmojiPicker && (
              <View style={styles.emojiPicker}>
                {emojiList.map((emoji) => (
                  <TouchableOpacity 
                    key={emoji}
                    style={styles.emojiItem}
                    onPress={() => setNewMessage(prev => prev + emoji)}
                  >
                    <Text style={styles.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
        
        {/* Chat Info Modal */}
        <Modal visible={showChatInfoModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.infoModal, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedChat.type === 'group' ? 'Group Info' : 'Chat Info'}
                </Text>
                <TouchableOpacity onPress={() => setShowChatInfoModal(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.infoContent}>
                <View style={styles.infoHeader}>
                  <Image source={{ uri: selectedChat.avatar }} style={styles.infoAvatar} />
                  <Text style={[styles.infoName, { color: colors.text }]}>{selectedChat.name}</Text>
                  {selectedChat.description && (
                    <Text style={[styles.infoDesc, { color: colors.textSecondary }]}>
                      {selectedChat.description}
                    </Text>
                  )}
                </View>
                
                {selectedChat.type === 'group' && (
                  <>
                    <View style={styles.infoActions}>
                      <TouchableOpacity style={[styles.infoAction, { backgroundColor: colors.surface }]}>
                        <Bell size={20} color={colors.text} />
                        <Text style={[styles.infoActionText, { color: colors.text }]}>Mute</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.infoAction, { backgroundColor: colors.surface }]}
                        onPress={() => {
                          setShowChatInfoModal(false);
                          setShowInviteModal(true);
                        }}
                      >
                        <UserPlus size={20} color={colors.text} />
                        <Text style={[styles.infoActionText, { color: colors.text }]}>Invite</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.infoAction, { backgroundColor: colors.surface }]}>
                        <Share2 size={20} color={colors.text} />
                        <Text style={[styles.infoActionText, { color: colors.text }]}>Share</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {selectedChat.inviteLink && (
                      <TouchableOpacity style={[styles.inviteLinkCard, { backgroundColor: colors.surface }]}>
                        <Link2 size={18} color={colors.primary} />
                        <Text style={[styles.inviteLink, { color: colors.primary }]}>
                          {selectedChat.inviteLink}
                        </Text>
                        <Copy size={18} color={colors.textTertiary} />
                      </TouchableOpacity>
                    )}
                    
                    <View style={styles.membersSection}>
                      <Text style={[styles.membersTitle, { color: colors.textTertiary }]}>
                        {selectedChat.members.length} Members
                      </Text>
                      {selectedChat.members.map((member) => (
                        <View key={member.id} style={[styles.memberItem, { backgroundColor: colors.surface }]}>
                          <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                          <View style={styles.memberInfo}>
                            <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                            <Text style={[styles.memberStatus, { color: colors.textTertiary }]}>
                              {member.status}
                            </Text>
                          </View>
                          {member.isAdmin && (
                            <View style={[styles.adminBadge, { backgroundColor: colors.warning + '20' }]}>
                              <Crown size={12} color={colors.warning} />
                              <Text style={[styles.adminText, { color: colors.warning }]}>Admin</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </>
                )}
                
                <TouchableOpacity style={[styles.dangerAction, { backgroundColor: colors.error + '15' }]}>
                  <LogOut size={20} color={colors.error} />
                  <Text style={[styles.dangerText, { color: colors.error }]}>
                    {selectedChat.type === 'group' ? 'Leave Group' : 'Delete Chat'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
        
        {/* Poll Modal */}
        <Modal visible={showPollModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.pollModal, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Create Poll</Text>
                <TouchableOpacity onPress={() => setShowPollModal(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.pollForm}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Question</Text>
                <TextInput
                  style={[styles.pollInput, { backgroundColor: colors.surface, color: colors.text }]}
                  placeholder="Ask a question..."
                  placeholderTextColor={colors.textTertiary}
                  value={pollQuestion}
                  onChangeText={setPollQuestion}
                />
                
                <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 16 }]}>Options</Text>
                {pollOptions.map((option, index) => (
                  <View key={index} style={styles.pollOptionInput}>
                    <TextInput
                      style={[styles.pollInput, { backgroundColor: colors.surface, color: colors.text, flex: 1 }]}
                      placeholder={`Option ${index + 1}`}
                      placeholderTextColor={colors.textTertiary}
                      value={option}
                      onChangeText={(text) => updatePollOption(index, text)}
                    />
                    {index > 1 && (
                      <TouchableOpacity onPress={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}>
                        <X size={20} color={colors.textTertiary} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                
                {pollOptions.length < 6 && (
                  <TouchableOpacity style={styles.addOptionBtn} onPress={addPollOption}>
                    <Plus size={18} color={colors.primary} />
                    <Text style={[styles.addOptionText, { color: colors.primary }]}>Add Option</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              
              <View style={styles.pollActions}>
                <TouchableOpacity 
                  style={[styles.createPollBtn, { backgroundColor: colors.primary }]}
                  onPress={sendPoll}
                >
                  <Text style={styles.createPollText}>Create Poll</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Invite Modal */}
        <Modal visible={showInviteModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.inviteModal, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Invite Members</Text>
                <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
                <Search size={18} color={colors.textTertiary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search contacts..."
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <FlatList
                data={mockUsers.filter(u => !selectedChat.members.find(m => m.id === u.id))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.inviteItem, { backgroundColor: colors.surface }]}>
                    <Image source={{ uri: item.avatar }} style={styles.inviteAvatar} />
                    <View style={styles.inviteInfo}>
                      <Text style={[styles.inviteName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.inviteStatus, { color: colors.textTertiary }]}>{item.status}</Text>
                    </View>
                    <TouchableOpacity style={[styles.inviteBtn, { backgroundColor: colors.primary }]}>
                      <UserPlus size={16} color="#FFF" />
                      <Text style={styles.inviteBtnText}>Invite</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                style={styles.inviteList}
              />
              
              <View style={styles.shareLinkSection}>
                <Text style={[styles.shareLinkLabel, { color: colors.textSecondary }]}>
                  Or share invite link
                </Text>
                <TouchableOpacity style={[styles.copyLinkBtn, { backgroundColor: colors.surface }]}>
                  <Link2 size={18} color={colors.primary} />
                  <Text style={[styles.copyLinkText, { color: colors.primary }]}>
                    {selectedChat.inviteLink || 'larecoin.app/chat/invite'}
                  </Text>
                  <Copy size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Chat' }} />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <View style={[styles.brandIcon, { backgroundColor: colors.primary }]}>
              <MessageCircle size={20} color="#FFF" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                Connect with anyone, anywhere
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.newChatBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowCreateGroupModal(true)}
          >
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search chats..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
        {(['all', 'groups', 'direct'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textTertiary }]}>
              {tab === 'all' ? 'All Chats' : tab === 'groups' ? 'Groups' : 'Direct'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Create Group Modal */}
      <Modal visible={showCreateGroupModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.createGroupModal, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Chat</Text>
              <TouchableOpacity onPress={() => {
                setShowCreateGroupModal(false);
                setSelectedMembers([]);
                setGroupName('');
              }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.createOptions}>
              <TouchableOpacity style={[styles.createOption, { backgroundColor: colors.surface }]}>
                <View style={[styles.createOptionIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Users size={22} color={colors.primary} />
                </View>
                <View style={styles.createOptionInfo}>
                  <Text style={[styles.createOptionTitle, { color: colors.text }]}>New Group</Text>
                  <Text style={[styles.createOptionDesc, { color: colors.textTertiary }]}>
                    Create a group chat with multiple people
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary, paddingHorizontal: 16, marginTop: 16 }]}>
              Group Name
            </Text>
            <TextInput
              style={[styles.groupInput, { backgroundColor: colors.surface, color: colors.text }]}
              placeholder="Enter group name..."
              placeholderTextColor={colors.textTertiary}
              value={groupName}
              onChangeText={setGroupName}
            />
            
            <Text style={[styles.inputLabel, { color: colors.textSecondary, paddingHorizontal: 16, marginTop: 16 }]}>
              Add Members ({selectedMembers.length} selected)
            </Text>
            
            {selectedMembers.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedMembers}>
                {selectedMembers.map((member) => (
                  <TouchableOpacity 
                    key={member.id} 
                    style={styles.selectedMember}
                    onPress={() => toggleMember(member)}
                  >
                    <Image source={{ uri: member.avatar }} style={styles.selectedMemberAvatar} />
                    <View style={styles.removeMember}>
                      <X size={10} color="#FFF" />
                    </View>
                    <Text style={[styles.selectedMemberName, { color: colors.text }]} numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            
            <FlatList
              data={mockUsers.filter(u => u.id !== currentUser.id)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedMembers.find(m => m.id === item.id);
                return (
                  <TouchableOpacity 
                    style={[styles.memberSelectItem, { backgroundColor: colors.surface }]}
                    onPress={() => toggleMember(item)}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.memberSelectAvatar} />
                    <View style={styles.memberSelectInfo}>
                      <Text style={[styles.memberSelectName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.memberSelectStatus, { color: colors.textTertiary }]}>{item.status}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      { borderColor: isSelected ? colors.primary : colors.border },
                      isSelected && { backgroundColor: colors.primary }
                    ]}>
                      {isSelected && <Check size={12} color="#FFF" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              style={styles.membersList}
            />
            
            <View style={styles.createActions}>
              <TouchableOpacity 
                style={[styles.createGroupBtn, { backgroundColor: colors.primary }]}
                onPress={createGroup}
                disabled={!groupName.trim() || selectedMembers.length < 1}
              >
                <Text style={styles.createGroupText}>Create Group</Text>
              </TouchableOpacity>
            </View>
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
  header: {
    padding: 16,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  newChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  chatAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  chatAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  groupBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600' as const,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
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
  chatRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  chatRoomInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatRoomAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  chatRoomName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  chatRoomStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  chatRoomActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 40,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  ownMessage: {
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    borderBottomLeftRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  messageGif: {
    width: 180,
    height: 140,
    borderRadius: 12,
  },
  videoPreview: {
    width: 200,
    height: 150,
    borderRadius: 12,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkPreview: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  linkImage: {
    width: '100%',
    height: 100,
  },
  linkInfo: {
    padding: 10,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  linkDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  pollContainer: {
    minWidth: 220,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  pollTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
  },
  pollQuestion: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  pollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  pollProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  pollOptionText: {
    flex: 1,
    fontSize: 14,
    zIndex: 1,
  },
  pollVotes: {
    fontSize: 12,
    marginRight: 8,
    zIndex: 1,
  },
  pollTotal: {
    fontSize: 12,
    marginTop: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
  },
  replyPreview: {
    borderLeftWidth: 3,
    paddingLeft: 8,
    marginBottom: 8,
    paddingVertical: 4,
  },
  replyName: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  replyContent: {
    fontSize: 12,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  replyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  replyDetails: {
    flex: 1,
  },
  replyToName: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  replyToContent: {
    fontSize: 13,
  },
  inputContainer: {
    padding: 12,
  },
  attachMenu: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  attachOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  attachBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 22,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  emojiBtn: {
    padding: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    gap: 8,
  },
  emojiItem: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
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
  createGroupModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  createOptions: {
    padding: 16,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  createOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createOptionInfo: {
    flex: 1,
  },
  createOptionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  createOptionDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  groupInput: {
    marginHorizontal: 16,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  selectedMembers: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectedMember: {
    alignItems: 'center',
    marginRight: 12,
    width: 60,
  },
  selectedMemberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  removeMember: {
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
  selectedMemberName: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  membersList: {
    maxHeight: 250,
  },
  memberSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  memberSelectAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  memberSelectInfo: {
    flex: 1,
  },
  memberSelectName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  memberSelectStatus: {
    fontSize: 12,
    marginTop: 2,
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
  createActions: {
    padding: 16,
  },
  createGroupBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  infoContent: {
    padding: 16,
  },
  infoHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  infoAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  infoName: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  infoDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  infoActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  infoAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    width: 80,
  },
  infoActionText: {
    fontSize: 12,
    marginTop: 6,
  },
  inviteLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    gap: 10,
  },
  inviteLink: {
    flex: 1,
    fontSize: 14,
  },
  membersSection: {
    marginBottom: 20,
  },
  membersTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  memberStatus: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  adminText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  dangerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  dangerText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  pollModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  pollForm: {
    padding: 16,
  },
  pollInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  pollOptionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  addOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  pollActions: {
    padding: 16,
  },
  createPollBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPollText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  inviteModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 10,
  },
  inviteList: {
    maxHeight: 300,
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  inviteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteName: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  inviteStatus: {
    fontSize: 12,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  inviteBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  shareLinkSection: {
    padding: 16,
  },
  shareLinkLabel: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  copyLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  copyLinkText: {
    flex: 1,
    fontSize: 14,
  },
});
