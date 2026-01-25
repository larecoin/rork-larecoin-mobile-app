import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Bot, User, Phone, Mail, MessageCircle } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to Larecoin Support. How can I help you today?',
    isBot: true,
    timestamp: new Date(),
  },
];

const quickReplies = [
  'Account Issues',
  'Payment Problems',
  'KYC Verification',
  'Transaction Help',
  'Security Concerns',
  'Other',
];

export default function CustomerServiceScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. A support agent will be with you shortly. In the meantime, you can check our FAQ section or browse help articles.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Customer Support' }} />
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={[styles.statusBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.statusText, { color: colors.text }]}>Support Team Online</Text>
          <Text style={[styles.responseTime, { color: colors.textTertiary }]}>Avg. response: 2 min</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.isBot ? styles.botBubble : styles.userBubble,
                { backgroundColor: message.isBot ? colors.surface : colors.primary },
              ]}
            >
              <View style={styles.messageHeader}>
                {message.isBot ? (
                  <Bot size={16} color={colors.primary} />
                ) : (
                  <User size={16} color="#FFF" />
                )}
                <Text style={[
                  styles.messageTime,
                  { color: message.isBot ? colors.textTertiary : 'rgba(255,255,255,0.7)' }
                ]}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={[
                styles.messageText,
                { color: message.isBot ? colors.text : '#FFF' }
              ]}>
                {message.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.quickRepliesContainer, { borderTopColor: colors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply}
                style={[styles.quickReplyButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={[styles.quickReplyText, { color: colors.text }]}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, paddingBottom: insets.bottom || 16 }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            placeholder="Type your message..."
            placeholderTextColor={colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSend}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={[styles.contactOptions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.contactOption}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
            <Phone size={18} color={colors.primary} />
          </View>
          <Text style={[styles.contactText, { color: colors.text }]}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactOption}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
            <Mail size={18} color={colors.primary} />
          </View>
          <Text style={[styles.contactText, { color: colors.text }]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactOption}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
            <MessageCircle size={18} color={colors.primary} />
          </View>
          <Text style={[styles.contactText, { color: colors.text }]}>FAQ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
  },
  responseTime: {
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  botBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  messageTime: {
    fontSize: 11,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  quickReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactOptions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    justifyContent: 'space-around',
  },
  contactOption: {
    alignItems: 'center',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
