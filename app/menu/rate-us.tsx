import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Star, Heart, MessageSquare, ThumbsUp, Send,
  ExternalLink, CheckCircle, Sparkles
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function RateUsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRateOnStore = () => {
    const url = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/larecoin' 
      : 'https://play.google.com/store/apps/details?id=com.larecoin';
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleSubmitFeedback = () => {
    if (rating > 0) {
      setSubmitted(true);
    }
  };

  const feedbackPrompts = [
    'Easy to use',
    'Fast transactions',
    'Great features',
    'Secure',
    'Good support',
    'Love the design',
  ];

  if (submitted) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Rate Us</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.thankYouContainer}>
          <View style={styles.thankYouIcon}>
            <CheckCircle size={48} color="#10B981" />
          </View>
          <Text style={styles.thankYouTitle}>Thank You!</Text>
          <Text style={styles.thankYouSubtitle}>
            <Text>Your feedback helps us improve Larecoin for everyone</Text>
          </Text>

          {rating >= 4 && (
            <View style={styles.storePrompt}>
              <Sparkles size={20} color="#F59E0B" />
              <Text style={styles.storePromptText}>
                Would you mind sharing your experience on the app store?
              </Text>
              <TouchableOpacity style={styles.storeButton} onPress={handleRateOnStore}>
                <Star size={18} color="#FFF" />
                <Text style={styles.storeButtonText}>Rate on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Rate Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Heart size={40} color="#EC4899" fill="#EC4899" />
          </View>
          <Text style={styles.heroTitle}>Enjoying Larecoin?</Text>
          <Text style={styles.heroSubtitle}>
            <Text>Your feedback means the world to us and helps us make the app even better</Text>
          </Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>How would you rate your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                style={styles.starButton}
                onPress={() => setRating(star)}
              >
                <Star 
                  size={40} 
                  color={star <= rating ? '#F59E0B' : Colors.border}
                  fill={star <= rating ? '#F59E0B' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating === 1 && 'We\'re sorry to hear that'}
              {rating === 2 && 'We can do better'}
              {rating === 3 && 'Thanks for your feedback'}
              {rating === 4 && 'Glad you like it!'}
              {rating === 5 && 'Awesome! We love you too!'}
            </Text>
          )}
        </View>

        {rating > 0 && (
          <>
            <View style={styles.promptsSection}>
              <Text style={styles.promptsLabel}>What do you like most?</Text>
              <View style={styles.promptsGrid}>
                {feedbackPrompts.map((prompt) => (
                  <TouchableOpacity 
                    key={prompt}
                    style={[
                      styles.promptChip,
                      feedback.includes(prompt) && styles.promptChipActive
                    ]}
                    onPress={() => {
                      if (feedback.includes(prompt)) {
                        setFeedback(feedback.replace(prompt + ', ', '').replace(prompt, ''));
                      } else {
                        setFeedback(feedback ? feedback + ', ' + prompt : prompt);
                      }
                    }}
                  >
                    <Text style={[
                      styles.promptChipText,
                      feedback.includes(prompt) && styles.promptChipTextActive
                    ]}>
                      {prompt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackLabel}>
                <MessageSquare size={16} color={Colors.textSecondary} />
                {' '}Additional feedback (optional)
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Tell us more about your experience..."
                placeholderTextColor={Colors.textTertiary}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
            >
              <Send size={18} color="#FFF" />
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.directRateSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.storeRateCard} onPress={handleRateOnStore}>
            <View style={styles.storeIconContainer}>
              <Star size={24} color="#F59E0B" />
            </View>
            <View style={styles.storeContent}>
              <Text style={styles.storeTitle}>Rate on {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}</Text>
              <Text style={styles.storeSubtitle}>Help others discover Larecoin</Text>
            </View>
            <ExternalLink size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <ThumbsUp size={20} color={Colors.primary} />
            <Text style={styles.statsText}>
              <Text style={styles.statsHighlight}>4.8</Text> average rating from{' '}
              <Text style={styles.statsHighlight}>50,000+</Text> reviews
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EC4899' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  ratingSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  promptsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  promptsLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  promptChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  promptChipTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  feedbackSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  directRateSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginHorizontal: 16,
  },
  storeRateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F59E0B' + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeContent: {
    flex: 1,
    marginLeft: 14,
  },
  storeTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  storeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsHighlight: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  thankYouContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  thankYouIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981' + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  thankYouSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  storePrompt: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  storePromptText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 20,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  storeButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFF',
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 14,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFF',
  },
});
