import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, X, Star, MessageCircle, MapPin, Briefcase, Filter, Settings } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

const profiles = [
  { id: '1', name: 'Sarah', age: 28, distance: '2 mi', job: 'Blockchain Developer', bio: 'Crypto enthusiast & coffee lover ☕', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop'], interests: ['DeFi', 'NFTs', 'Yoga'] },
  { id: '2', name: 'Emily', age: 26, distance: '5 mi', job: 'UX Designer', bio: 'Creating beautiful experiences 🎨', images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop'], interests: ['Design', 'Travel', 'Photography'] },
  { id: '3', name: 'Jessica', age: 30, distance: '3 mi', job: 'Product Manager', bio: 'Building the future of Web3 🚀', images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop'], interests: ['Startups', 'Fitness', 'Music'] },
];

export default function DatingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProfile = profiles[currentIndex];

  const handleAction = (action: 'pass' | 'like' | 'superlike') => {
    console.log(`${action} for ${currentProfile.name}`);
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Start Dating' }} />
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]}>
          <Settings size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: currentProfile.images[0] }} style={styles.profileImage} />
          <View style={styles.profileOverlay}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{currentProfile.name}, {currentProfile.age}</Text>
              <View style={styles.infoRow}>
                <MapPin size={14} color="#FFF" />
                <Text style={styles.infoText}>{currentProfile.distance} away</Text>
              </View>
              <View style={styles.infoRow}>
                <Briefcase size={14} color="#FFF" />
                <Text style={styles.infoText}>{currentProfile.job}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.bioCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.bioTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>{currentProfile.bio}</Text>
        </View>

        <View style={[styles.interestsCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.interestsTitle, { color: colors.text }]}>Interests</Text>
          <View style={styles.interestsTags}>
            {currentProfile.interests.map((interest) => (
              <View key={interest} style={[styles.interestTag, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.interestText, { color: colors.primary }]}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton, { backgroundColor: colors.surface }]}
          onPress={() => handleAction('pass')}
        >
          <X size={28} color={colors.error} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.superlikeButton, { backgroundColor: colors.primary }]}
          onPress={() => handleAction('superlike')}
        >
          <Star size={24} color="#FFF" fill="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton, { backgroundColor: colors.success }]}
          onPress={() => handleAction('like')}
        >
          <Heart size={28} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: width * 1.2,
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  profileInfo: {
    gap: 6,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  bioCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  interestsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  interestsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  superlikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
