import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Send, Mail, MessageSquare, Copy, Share2, DollarSign, User, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

type RequestMethod = 'sms' | 'email' | 'link';

export default function RequestPaymentScreen() {
  const { userTokens } = useApp();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [selectedToken, setSelectedToken] = useState(userTokens[0]?.symbol || 'LARE');
  const [requestMethod, setRequestMethod] = useState<RequestMethod>('sms');
  const [linkGenerated, setLinkGenerated] = useState(false);

  const methods = [
    { id: 'sms' as RequestMethod, label: 'SMS', icon: MessageSquare },
    { id: 'email' as RequestMethod, label: 'Email', icon: Mail },
    { id: 'link' as RequestMethod, label: 'Link', icon: Share2 },
  ];

  const handleSendRequest = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (requestMethod !== 'link' && !recipient) {
      Alert.alert('Error', `Please enter ${requestMethod === 'sms' ? 'phone number' : 'email address'}`);
      return;
    }
    
    if (requestMethod === 'link') {
      setLinkGenerated(true);
      Alert.alert('Success', 'Payment link generated!');
    } else {
      Alert.alert('Request Sent', `Payment request for ${amount} ${selectedToken} sent via ${requestMethod.toUpperCase()}`);
    }
  };

  const generatedLink = `https://lare.pay/request/${Math.random().toString(36).substring(7)}`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Send size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Request Payment</Text>
        <Text style={styles.subtitle}>Send a payment request via SMS, email, or share a link</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Request Method</Text>
        <View style={styles.methodsContainer}>
          {methods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, requestMethod === method.id && styles.methodCardActive]}
              onPress={() => {
                setRequestMethod(method.id);
                setLinkGenerated(false);
              }}
            >
              <method.icon 
                size={24} 
                color={requestMethod === method.id ? Colors.background : Colors.textSecondary} 
              />
              <Text style={[styles.methodLabel, requestMethod === method.id && styles.methodLabelActive]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount</Text>
        <View style={styles.amountContainer}>
          <DollarSign size={24} color={Colors.textSecondary} />
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.tokenSelector}>
            <Text style={styles.tokenText}>{selectedToken}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {requestMethod !== 'link' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {requestMethod === 'sms' ? 'Phone Number' : 'Email Address'}
          </Text>
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder={requestMethod === 'sms' ? '+1 (555) 123-4567' : 'email@example.com'}
              placeholderTextColor={Colors.textTertiary}
              keyboardType={requestMethod === 'sms' ? 'phone-pad' : 'email-address'}
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a message to your request..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          numberOfLines={3}
          value={note}
          onChangeText={setNote}
        />
      </View>

      {linkGenerated && requestMethod === 'link' && (
        <View style={styles.linkSection}>
          <Text style={styles.linkTitle}>Payment Link</Text>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>{generatedLink}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Copy size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.linkActions}>
            <TouchableOpacity style={styles.shareBtn}>
              <Share2 size={18} color={Colors.background} />
              <Text style={styles.shareBtnText}>Share Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
        {linkGenerated && requestMethod === 'link' ? (
          <>
            <Check size={20} color={Colors.background} />
            <Text style={styles.sendButtonText}>Generate New Link</Text>
          </>
        ) : (
          <>
            <Send size={20} color={Colors.background} />
            <Text style={styles.sendButtonText}>
              {requestMethod === 'link' ? 'Generate Link' : 'Send Request'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Requests</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent payment requests</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    gap: 8,
  },
  methodCardActive: {
    backgroundColor: Colors.primary,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  methodLabelActive: {
    color: Colors.background,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    paddingVertical: 16,
    marginLeft: 8,
  },
  tokenSelector: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 16,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  linkSection: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  copyBtn: {
    padding: 8,
  },
  linkActions: {
    marginTop: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  recentSection: {
    padding: 20,
    backgroundColor: Colors.background,
    marginTop: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
