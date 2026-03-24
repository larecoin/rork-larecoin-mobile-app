import React, { useState, useRef } from 'react';
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
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Search, 
  Edit, 
  CheckCheck, 
  Sparkles, 
  Tag, 
  X, 
  Briefcase, 
  Users, 
  Heart, 
  ShoppingBag,
  Headphones,
  Star,
  MessageCircle,
  Bot,
  Send,
  ChevronDown,
  Check,
  Filter,
  MoreVertical
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Label {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  labels: string[];
  isAI?: boolean;
}

const labelColors = {
  work: '#3B82F6',
  personal: '#EC4899',
  trading: '#10B981',
  groups: '#8B5CF6',
  support: '#F59E0B',
  important: '#EF4444',
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: 'Hi! I\'m your AI assistant. I can help you organize messages, draft replies, summarize conversations, or answer questions. How can I help?' }
  ]);
  
  const labels: Label[] = [
    { id: 'all', name: 'All', color: colors.primary, icon: <MessageCircle size={14} color="#FFF" /> },
    { id: 'work', name: 'Work', color: labelColors.work, icon: <Briefcase size={14} color="#FFF" /> },
    { id: 'personal', name: 'Personal', color: labelColors.personal, icon: <Heart size={14} color="#FFF" /> },
    { id: 'trading', name: 'Trading', color: labelColors.trading, icon: <ShoppingBag size={14} color="#FFF" /> },
    { id: 'groups', name: 'Groups', color: labelColors.groups, icon: <Users size={14} color="#FFF" /> },
    { id: 'support', name: 'Support', color: labelColors.support, icon: <Headphones size={14} color="#FFF" /> },
    { id: 'important', name: 'Important', color: labelColors.important, icon: <Star size={14} color="#FFF" /> },
  ];

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 'ai', name: 'AI Assistant', avatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop', lastMessage: 'How can I help you today?', time: 'Now', unread: 0, online: true, labels: [], isAI: true },
    { id: '1', name: 'Alex Trading', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', lastMessage: 'The trade went through successfully!', time: '2m', unread: 2, online: true, labels: ['trading', 'important'] },
    { id: '2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', lastMessage: 'Thanks for the referral bonus 🎉', time: '15m', unread: 0, online: true, labels: ['personal'] },
    { id: '3', name: 'DeFi Group', avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop', lastMessage: 'Mike: New staking pool is live!', time: '1h', unread: 5, online: false, labels: ['groups', 'trading'] },
    { id: '4', name: 'Support Team', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', lastMessage: 'Your ticket has been resolved', time: '3h', unread: 0, online: true, labels: ['support'] },
    { id: '5', name: 'NFT Collectors', avatar: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop', lastMessage: 'New drop alert! Check it out', time: '5h', unread: 12, online: false, labels: ['groups'] },
    { id: '6', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', lastMessage: 'Can you send me the wallet address?', time: '1d', unread: 0, online: false, labels: ['work'] },
  ]);

  const filteredConversations = conversations.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = selectedLabel === 'all' || chat.labels.includes(selectedLabel) || chat.isAI;
    return matchesSearch && matchesLabel;
  });

  const toggleLabel = (chatId: string, labelId: string) => {
    setConversations(prev => prev.map(chat => {
      if (chat.id === chatId) {
        const hasLabel = chat.labels.includes(labelId);
        return {
          ...chat,
          labels: hasLabel 
            ? chat.labels.filter(l => l !== labelId)
            : [...chat.labels, labelId]
        };
      }
      return chat;
    }));
  };

  const sendAIMessage = () => {
    if (!aiMessage.trim()) return;
    
    const userMsg = aiMessage.trim();
    setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setAiMessage('');
    
    setTimeout(() => {
      let response = '';
      if (userMsg.toLowerCase().includes('summarize')) {
        response = 'Based on your recent conversations:\n\n• Alex Trading: Completed a successful trade\n• DeFi Group: New staking pool launched\n• NFT Collectors: New NFT drop available\n\nWould you like more details on any of these?';
      } else if (userMsg.toLowerCase().includes('draft') || userMsg.toLowerCase().includes('reply')) {
        response = 'Here\'s a suggested reply:\n\n"Thank you for the update! I\'ll review the details and get back to you shortly."\n\nWould you like me to adjust the tone or add more details?';
      } else if (userMsg.toLowerCase().includes('organize') || userMsg.toLowerCase().includes('label')) {
        response = 'I can help organize your messages! Here are some suggestions:\n\n• Move trading discussions to "Trading" label\n• Mark urgent items as "Important"\n• Group chats can be labeled as "Groups"\n\nWould you like me to auto-label your conversations?';
      } else {
        response = 'I can help you with:\n\n• Summarizing conversations\n• Drafting replies\n• Organizing messages with labels\n• Finding specific messages\n• Setting reminders\n\nWhat would you like to do?';
      }
      setAiMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  const getLabelColor = (labelId: string) => {
    return labelColors[labelId as keyof typeof labelColors] || colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Messages' }} />
      
      <View style={styles.header}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Search size={20} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search messages..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[styles.aiButton, { backgroundColor: '#3B82F6' }]}
          onPress={() => setShowAIChat(true)}
        >
          <Sparkles size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.newButton, { backgroundColor: colors.primary }]}>
          <Edit size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.labelsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.labelsScroll}
        >
          {labels.map((label) => {
            const isSelected = selectedLabel === label.id;
            const count = label.id === 'all' 
              ? conversations.length 
              : conversations.filter(c => c.labels.includes(label.id)).length;
            
            return (
              <TouchableOpacity
                key={label.id}
                style={[
                  styles.labelChip,
                  { 
                    backgroundColor: isSelected ? label.color : colors.surface,
                    borderColor: isSelected ? label.color : colors.border,
                  }
                ]}
                onPress={() => setSelectedLabel(label.id)}
              >
                {label.icon}
                <Text style={[
                  styles.labelChipText,
                  { color: isSelected ? '#FFF' : colors.textSecondary }
                ]}>
                  {label.name}
                </Text>
                {count > 0 && (
                  <View style={[
                    styles.labelCount,
                    { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.border }
                  ]}>
                    <Text style={[
                      styles.labelCountText,
                      { color: isSelected ? '#FFF' : colors.textTertiary }
                    ]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={[
              styles.chatItem, 
              { backgroundColor: chat.unread > 0 ? colors.primary + '08' : 'transparent' }
            ]}
            onPress={() => chat.isAI && setShowAIChat(true)}
            onLongPress={() => {
              if (!chat.isAI) {
                setSelectedChat(chat.id);
                setShowLabelModal(true);
              }
            }}
          >
            <View style={styles.avatarContainer}>
              {chat.isAI ? (
                <View style={[styles.aiAvatar, { backgroundColor: '#3B82F6' }]}>
                  <Bot size={28} color="#FFF" />
                </View>
              ) : (
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
              )}
              {chat.online && <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />}
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <View style={styles.nameRow}>
                  <Text style={[styles.chatName, { color: colors.text }]}>{chat.name}</Text>
                  {chat.isAI && (
                    <View style={[styles.aiBadge, { backgroundColor: '#3B82F6' }]}>
                      <Sparkles size={10} color="#FFF" />
                      <Text style={styles.aiBadgeText}>AI</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.chatTime, { color: colors.textTertiary }]}>{chat.time}</Text>
              </View>
              <View style={styles.chatPreview}>
                <Text 
                  style={[
                    styles.chatMessage, 
                    { color: chat.unread > 0 ? colors.text : colors.textTertiary }
                  ]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
                {chat.unread > 0 ? (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.unreadText}>{chat.unread}</Text>
                  </View>
                ) : !chat.isAI && (
                  <CheckCheck size={16} color={colors.primary} />
                )}
              </View>
              {chat.labels.length > 0 && (
                <View style={styles.chatLabels}>
                  {chat.labels.slice(0, 3).map(labelId => (
                    <View 
                      key={labelId} 
                      style={[styles.miniLabel, { backgroundColor: getLabelColor(labelId) + '20' }]}
                    >
                      <View style={[styles.miniLabelDot, { backgroundColor: getLabelColor(labelId) }]} />
                      <Text style={[styles.miniLabelText, { color: getLabelColor(labelId) }]}>
                        {labels.find(l => l.id === labelId)?.name}
                      </Text>
                    </View>
                  ))}
                  {chat.labels.length > 3 && (
                    <Text style={[styles.moreLabelText, { color: colors.textTertiary }]}>
                      +{chat.labels.length - 3}
                    </Text>
                  )}
                </View>
              )}
            </View>
            {!chat.isAI && (
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={() => {
                  setSelectedChat(chat.id);
                  setShowLabelModal(true);
                }}
              >
                <MoreVertical size={18} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showLabelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLabelModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLabelModal(false)}
        >
          <View style={[styles.labelModal, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Manage Labels</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {conversations.find(c => c.id === selectedChat)?.name}
            </Text>
            
            <View style={styles.labelGrid}>
              {labels.filter(l => l.id !== 'all').map(label => {
                const chat = conversations.find(c => c.id === selectedChat);
                const isApplied = chat?.labels.includes(label.id);
                
                return (
                  <TouchableOpacity
                    key={label.id}
                    style={[
                      styles.labelOption,
                      { 
                        backgroundColor: isApplied ? label.color : colors.background,
                        borderColor: label.color,
                      }
                    ]}
                    onPress={() => selectedChat && toggleLabel(selectedChat, label.id)}
                  >
                    <View style={[
                      styles.labelIconWrap,
                      { backgroundColor: isApplied ? 'rgba(255,255,255,0.2)' : label.color }
                    ]}>
                      {label.icon}
                    </View>
                    <Text style={[
                      styles.labelOptionText,
                      { color: isApplied ? '#FFF' : colors.text }
                    ]}>
                      {label.name}
                    </Text>
                    {isApplied && (
                      <Check size={16} color="#FFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowLabelModal(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showAIChat}
        animationType="slide"
        onRequestClose={() => setShowAIChat(false)}
      >
        <View style={[styles.aiChatContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.aiHeader, { backgroundColor: colors.surface, paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => setShowAIChat(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.aiHeaderCenter}>
              <View style={[styles.aiHeaderIcon, { backgroundColor: '#3B82F6' }]}>
                <Bot size={20} color="#FFF" />
              </View>
              <View>
                <Text style={[styles.aiHeaderTitle, { color: colors.text }]}>AI Assistant</Text>
                <Text style={[styles.aiHeaderSubtitle, { color: colors.textSecondary }]}>
                  Message organizer & helper
                </Text>
              </View>
            </View>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView 
            style={styles.aiChatContent}
            contentContainerStyle={styles.aiChatScroll}
          >
            {aiMessages.map((msg, index) => (
              <View 
                key={index}
                style={[
                  styles.aiMessageBubble,
                  msg.role === 'user' ? styles.userMessage : styles.botMessage,
                  { 
                    backgroundColor: msg.role === 'user' ? colors.primary : colors.surface,
                  }
                ]}
              >
                {msg.role === 'ai' && (
                  <View style={[styles.botIcon, { backgroundColor: '#3B82F6' }]}>
                    <Sparkles size={12} color="#FFF" />
                  </View>
                )}
                <Text style={[
                  styles.aiMessageText,
                  { color: msg.role === 'user' ? '#FFF' : colors.text }
                ]}>
                  {msg.content}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          <View style={[styles.aiInputContainer, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={[styles.quickAction, { backgroundColor: colors.background }]}
                onPress={() => setAiMessage('Summarize my recent messages')}
              >
                <Text style={[styles.quickActionText, { color: colors.primary }]}>Summarize</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.quickAction, { backgroundColor: colors.background }]}
                onPress={() => setAiMessage('Help me organize my messages')}
              >
                <Text style={[styles.quickActionText, { color: colors.primary }]}>Organize</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.quickAction, { backgroundColor: colors.background }]}
                onPress={() => setAiMessage('Draft a reply for me')}
              >
                <Text style={[styles.quickActionText, { color: colors.primary }]}>Draft reply</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.aiInputRow}>
              <TextInput
                style={[styles.aiInput, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="Ask AI anything..."
                placeholderTextColor={colors.textTertiary}
                value={aiMessage}
                onChangeText={setAiMessage}
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={sendAIMessage}
              >
                <Send size={20} color="#FFF" />
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
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
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
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  labelsScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  labelChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  labelCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  labelCountText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 14,
    paddingRight: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  aiAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
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
    marginBottom: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatName: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  aiBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700' as const,
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
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  chatLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  miniLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  miniLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniLabelText: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  moreLabelText: {
    fontSize: 11,
  },
  moreButton: {
    padding: 8,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  labelModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  labelGrid: {
    gap: 10,
  },
  labelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  labelIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  doneButton: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  aiChatContainer: {
    flex: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  aiHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiHeaderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  aiHeaderSubtitle: {
    fontSize: 12,
  },
  aiChatContent: {
    flex: 1,
  },
  aiChatScroll: {
    padding: 16,
    gap: 12,
  },
  aiMessageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  botIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  aiMessageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiInputContainer: {
    padding: 12,
    paddingTop: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  quickAction: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  aiInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
