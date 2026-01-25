import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Heart, X, Star, MapPin, Briefcase, Filter, Settings, 
  Calendar, Clock, Phone, Video, Users, Check, MessageCircle,
  ChevronRight, ArrowLeft, Coffee, MapPinned, Sparkles, Shield,
  AlertCircle, ThumbsUp, ThumbsDown, Crown, Lock, Flame
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

type DateStage = 'none' | 'requested' | 'scheduled' | 'call_1' | 'review_1' | 'call_2' | 'review_2' | 'date_3' | 'review_3' | 'dating';
type RelationshipStatus = 'exclusive' | 'platonic' | 'open';

interface Profile {
  id: string;
  name: string;
  age: number;
  distance: string;
  job: string;
  bio: string;
  images: string[];
  interests: string[];
}

interface Match {
  id: string;
  profile: Profile;
  matchedAt: string;
  dateStage: DateStage;
  scheduledDate?: string;
  scheduledTime?: string;
  relationshipStatus?: RelationshipStatus;
  reviews: { stage: number; rating: 'accept' | 'reject' | null }[];
}

const profiles: Profile[] = [
  { id: '1', name: 'Sarah', age: 28, distance: '2 mi', job: 'Blockchain Developer', bio: 'Crypto enthusiast & coffee lover ☕', images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop'], interests: ['DeFi', 'NFTs', 'Yoga'] },
  { id: '2', name: 'Emily', age: 26, distance: '5 mi', job: 'UX Designer', bio: 'Creating beautiful experiences 🎨', images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop'], interests: ['Design', 'Travel', 'Photography'] },
  { id: '3', name: 'Jessica', age: 30, distance: '3 mi', job: 'Product Manager', bio: 'Building the future of Web3 🚀', images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop'], interests: ['Startups', 'Fitness', 'Music'] },
];

const mockMatches: Match[] = [
  { 
    id: 'm1', 
    profile: profiles[0], 
    matchedAt: '2 hours ago', 
    dateStage: 'none',
    reviews: [{ stage: 1, rating: null }, { stage: 2, rating: null }, { stage: 3, rating: null }]
  },
  { 
    id: 'm2', 
    profile: profiles[1], 
    matchedAt: '1 day ago', 
    dateStage: 'scheduled',
    scheduledDate: 'Jan 28, 2026',
    scheduledTime: '7:00 PM',
    reviews: [{ stage: 1, rating: null }, { stage: 2, rating: null }, { stage: 3, rating: null }]
  },
  { 
    id: 'm3', 
    profile: profiles[2], 
    matchedAt: '3 days ago', 
    dateStage: 'review_2',
    reviews: [{ stage: 1, rating: 'accept' }, { stage: 2, rating: null }, { stage: 3, rating: null }]
  },
];

const venues = [
  { id: 'v1', name: 'The Coffee House', type: 'Café', address: '123 Main St', rating: 4.8 },
  { id: 'v2', name: 'Bella Italia', type: 'Restaurant', address: '456 Oak Ave', rating: 4.6 },
  { id: 'v3', name: 'Skyline Rooftop', type: 'Lounge', address: '789 High St', rating: 4.9 },
];

export default function DatingScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'dates'>('discover');
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDateRequest, setShowDateRequest] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCallScreen, setShowCallScreen] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');

  const currentProfile = profiles[currentIndex];

  const handleAction = (action: 'pass' | 'like' | 'superlike') => {
    console.log(`${action} for ${currentProfile.name}`);
    if (action === 'like' || action === 'superlike') {
      const newMatch: Match = {
        id: `m${Date.now()}`,
        profile: currentProfile,
        matchedAt: 'Just now',
        dateStage: 'none',
        reviews: [{ stage: 1, rating: null }, { stage: 2, rating: null }, { stage: 3, rating: null }]
      };
      setMatches([newMatch, ...matches]);
      Alert.alert('It\'s a Match! 💕', `You and ${currentProfile.name} liked each other!`);
    }
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAskOnDate = (match: Match) => {
    setSelectedMatch(match);
    setShowDateRequest(true);
  };

  const handleSendDateRequest = () => {
    if (!selectedMatch) return;
    setShowDateRequest(false);
    setShowScheduler(true);
  };

  const handleScheduleDate = () => {
    if (!selectedMatch || !selectedDate || !selectedTime) {
      Alert.alert('Missing Info', 'Please select both date and time');
      return;
    }
    
    const updatedMatches = matches.map(m => 
      m.id === selectedMatch.id 
        ? { ...m, dateStage: 'scheduled' as DateStage, scheduledDate: selectedDate, scheduledTime: selectedTime }
        : m
    );
    setMatches(updatedMatches);
    setShowScheduler(false);
    setSelectedDate('');
    setSelectedTime('');
    Alert.alert('Date Scheduled! 📅', `Your first date with ${selectedMatch.profile.name} is set for ${selectedDate} at ${selectedTime}. You'll receive a call notification when it's time.`);
  };

  const handleStartCall = (match: Match, type: 'audio' | 'video') => {
    setSelectedMatch(match);
    setCallType(type);
    setShowCallScreen(true);
  };

  const handleEndCall = () => {
    setShowCallScreen(false);
    setShowReviewScreen(true);
  };

  const handleReview = (rating: 'accept' | 'reject') => {
    if (!selectedMatch) return;
    
    const currentStage = selectedMatch.dateStage;
    let nextStage: DateStage = 'none';
    let reviewIndex = 0;
    
    if (currentStage === 'scheduled' || currentStage === 'call_1') {
      reviewIndex = 0;
      nextStage = rating === 'accept' ? 'call_2' : 'none';
    } else if (currentStage === 'review_1' || currentStage === 'call_2') {
      reviewIndex = 1;
      nextStage = rating === 'accept' ? 'date_3' : 'none';
    } else if (currentStage === 'review_2' || currentStage === 'date_3') {
      reviewIndex = 2;
      nextStage = rating === 'accept' ? 'dating' : 'none';
    }
    
    const updatedMatches = matches.map(m => {
      if (m.id === selectedMatch.id) {
        const newReviews = [...m.reviews];
        newReviews[reviewIndex] = { stage: reviewIndex + 1, rating };
        return { ...m, dateStage: nextStage, reviews: newReviews };
      }
      return m;
    });
    
    setMatches(updatedMatches);
    setShowReviewScreen(false);
    
    if (rating === 'accept' && nextStage === 'dating') {
      setShowStatusPicker(true);
    } else if (rating === 'accept') {
      Alert.alert('Moving Forward! 🎉', `Great! You're ready for your next date with ${selectedMatch.profile.name}.`);
    } else {
      Alert.alert('No Worries', 'We\'ll help you find someone who\'s a better match.');
    }
  };

  const handleSetStatus = (status: RelationshipStatus) => {
    if (!selectedMatch) return;
    
    const updatedMatches = matches.map(m => 
      m.id === selectedMatch.id 
        ? { ...m, relationshipStatus: status }
        : m
    );
    setMatches(updatedMatches);
    setShowStatusPicker(false);
    
    const statusLabels = { exclusive: 'Exclusive', platonic: 'Platonic', open: 'Open Relationship' };
    Alert.alert('Congratulations! 💕', `You and ${selectedMatch.profile.name} are now ${statusLabels[status]}!`);
  };

  const getStageLabel = (stage: DateStage) => {
    const labels: Record<DateStage, string> = {
      none: 'No Date Yet',
      requested: 'Date Requested',
      scheduled: '1st Date Scheduled',
      call_1: 'First Call',
      review_1: 'Awaiting Review',
      call_2: '2nd Date Ready',
      review_2: 'Awaiting Review',
      date_3: '3rd Date Ready',
      review_3: 'Final Review',
      dating: 'Dating'
    };
    return labels[stage];
  };

  const getStageColor = (stage: DateStage) => {
    if (stage === 'none') return colors.textSecondary;
    if (stage === 'dating') return colors.success;
    return colors.primary;
  };

  const dates = [
    { label: 'Today', value: 'Jan 25, 2026' },
    { label: 'Tomorrow', value: 'Jan 26, 2026' },
    { label: 'Jan 27', value: 'Jan 27, 2026' },
    { label: 'Jan 28', value: 'Jan 28, 2026' },
    { label: 'Jan 29', value: 'Jan 29, 2026' },
    { label: 'Jan 30', value: 'Jan 30, 2026' },
    { label: 'Jan 31', value: 'Jan 31, 2026' },
  ];

  const times = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const renderDiscoverTab = () => (
    <>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={[styles.adultClassifiedsCard, { backgroundColor: '#FF1744' }]}
          onPress={() => Alert.alert(
            'Adult Classifieds',
            'You are about to access Adult Classifieds. This section contains mature content for adults 18+ only. By continuing, you confirm you are of legal age.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Continue', onPress: () => console.log('Navigate to Adult Classifieds') }
            ]
          )}
        >
          <View style={styles.adultClassifiedsIcon}>
            <Flame size={24} color="#FFF" fill="#FFF" />
          </View>
          <View style={styles.adultClassifiedsContent}>
            <Text style={styles.adultClassifiedsTitle}>Adult Classifieds</Text>
            <Text style={styles.adultClassifiedsSubtitle}>Skip dating • Direct connections • 18+</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

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
    </>
  );

  const renderMatchesTab = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Matches</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Ask someone on a date to start the dating process
      </Text>

      {matches.filter(m => m.dateStage === 'none').map(match => (
        <View key={match.id} style={[styles.matchCard, { backgroundColor: colors.surface }]}>
          <Image source={{ uri: match.profile.images[0] }} style={styles.matchImage} />
          <View style={styles.matchInfo}>
            <Text style={[styles.matchName, { color: colors.text }]}>{match.profile.name}, {match.profile.age}</Text>
            <Text style={[styles.matchMeta, { color: colors.textSecondary }]}>{match.profile.job}</Text>
            <Text style={[styles.matchTime, { color: colors.textSecondary }]}>Matched {match.matchedAt}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.askDateButton, { backgroundColor: colors.primary }]}
            onPress={() => handleAskOnDate(match)}
          >
            <Calendar size={16} color="#FFF" />
            <Text style={styles.askDateText}>Ask Out</Text>
          </TouchableOpacity>
        </View>
      ))}

      {matches.filter(m => m.dateStage === 'none').length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Heart size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No new matches yet. Keep swiping!
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderDatesTab = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.processCard, { backgroundColor: colors.surface }]}>
        <Shield size={24} color={colors.primary} />
        <View style={styles.processInfo}>
          <Text style={[styles.processTitle, { color: colors.text }]}>Our Safe Dating Process</Text>
          <Text style={[styles.processText, { color: colors.textSecondary }]}>
            1st Date: 45-min monitored call{'\n'}
            2nd Date: Video call{'\n'}
            3rd Date: In-person meeting{'\n'}
            Then: Set your relationship status
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Active Dates</Text>

      {matches.filter(m => m.dateStage !== 'none').map(match => (
        <View key={match.id} style={[styles.dateCard, { backgroundColor: colors.surface }]}>
          <View style={styles.dateHeader}>
            <Image source={{ uri: match.profile.images[0] }} style={styles.dateImage} />
            <View style={styles.dateInfo}>
              <Text style={[styles.dateName, { color: colors.text }]}>{match.profile.name}</Text>
              <View style={[styles.stageBadge, { backgroundColor: getStageColor(match.dateStage) + '20' }]}>
                <Text style={[styles.stageText, { color: getStageColor(match.dateStage) }]}>
                  {getStageLabel(match.dateStage)}
                </Text>
              </View>
            </View>
            {match.relationshipStatus && (
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Crown size={14} color={colors.success} />
                <Text style={[styles.statusText, { color: colors.success }]}>
                  {match.relationshipStatus.charAt(0).toUpperCase() + match.relationshipStatus.slice(1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.stageProgress}>
            {[1, 2, 3].map(stage => {
              const review = match.reviews[stage - 1];
              const isCompleted = review?.rating === 'accept';
              const isCurrent = (stage === 1 && ['scheduled', 'call_1', 'review_1'].includes(match.dateStage)) ||
                               (stage === 2 && ['call_2', 'review_2'].includes(match.dateStage)) ||
                               (stage === 3 && ['date_3', 'review_3', 'dating'].includes(match.dateStage));
              
              return (
                <View key={stage} style={styles.stageItem}>
                  <View style={[
                    styles.stageCircle, 
                    { 
                      backgroundColor: isCompleted ? colors.success : isCurrent ? colors.primary : colors.border,
                      borderColor: isCompleted ? colors.success : isCurrent ? colors.primary : colors.border
                    }
                  ]}>
                    {isCompleted ? (
                      <Check size={14} color="#FFF" />
                    ) : (
                      <Text style={[styles.stageNumber, { color: isCurrent ? '#FFF' : colors.textSecondary }]}>
                        {stage}
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.stageLabel, { color: isCurrent ? colors.primary : colors.textSecondary }]}>
                    {stage === 1 ? 'Call' : stage === 2 ? 'Video' : 'Meet'}
                  </Text>
                </View>
              );
            })}
          </View>

          {match.scheduledDate && match.dateStage === 'scheduled' && (
            <View style={[styles.scheduledInfo, { backgroundColor: colors.primary + '10' }]}>
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.scheduledText, { color: colors.primary }]}>
                {match.scheduledDate} at {match.scheduledTime}
              </Text>
            </View>
          )}

          <View style={styles.dateActions}>
            {match.dateStage === 'scheduled' && (
              <TouchableOpacity 
                style={[styles.dateActionBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleStartCall(match, 'audio')}
              >
                <Phone size={18} color="#FFF" />
                <Text style={styles.dateActionText}>Start Call</Text>
              </TouchableOpacity>
            )}

            {match.dateStage === 'call_2' && (
              <TouchableOpacity 
                style={[styles.dateActionBtn, { backgroundColor: colors.primary }]}
                onPress={() => handleStartCall(match, 'video')}
              >
                <Video size={18} color="#FFF" />
                <Text style={styles.dateActionText}>Start Video Call</Text>
              </TouchableOpacity>
            )}

            {match.dateStage === 'date_3' && (
              <TouchableOpacity 
                style={[styles.dateActionBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setSelectedMatch(match);
                  setShowReviewScreen(true);
                }}
              >
                <MapPinned size={18} color="#FFF" />
                <Text style={styles.dateActionText}>Complete 3rd Date</Text>
              </TouchableOpacity>
            )}

            {match.dateStage === 'dating' && !match.relationshipStatus && (
              <TouchableOpacity 
                style={[styles.dateActionBtn, { backgroundColor: colors.success }]}
                onPress={() => {
                  setSelectedMatch(match);
                  setShowStatusPicker(true);
                }}
              >
                <Heart size={18} color="#FFF" />
                <Text style={styles.dateActionText}>Set Status</Text>
              </TouchableOpacity>
            )}

            {(match.dateStage === 'review_1' || match.dateStage === 'review_2') && (
              <TouchableOpacity 
                style={[styles.dateActionBtn, { backgroundColor: colors.warning || '#F59E0B' }]}
                onPress={() => {
                  setSelectedMatch(match);
                  setShowReviewScreen(true);
                }}
              >
                <Star size={18} color="#FFF" />
                <Text style={styles.dateActionText}>Leave Review</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {matches.filter(m => m.dateStage !== 'none').length === 0 && (
        <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
          <Calendar size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No active dates. Ask someone out from your matches!
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Start Dating' }} />
      
      <View style={styles.headerActions}>
        <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
          {(['discover', 'matches', 'dates'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : colors.textSecondary }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.surface }]}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {activeTab === 'discover' && renderDiscoverTab()}
      {activeTab === 'matches' && renderMatchesTab()}
      {activeTab === 'dates' && renderDatesTab()}

      {/* Date Request Modal */}
      <Modal visible={showDateRequest} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDateRequest(false)}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ask on a Date</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedMatch && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.dateRequestProfile}>
                  <Image source={{ uri: selectedMatch.profile.images[0] }} style={styles.dateRequestImage} />
                  <Text style={[styles.dateRequestName, { color: colors.text }]}>
                    {selectedMatch.profile.name}
                  </Text>
                </View>

                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                  <Shield size={20} color={colors.primary} />
                  <View style={styles.infoCardContent}>
                    <Text style={[styles.infoCardTitle, { color: colors.text }]}>Safe Dating Process</Text>
                    <Text style={[styles.infoCardText, { color: colors.textSecondary }]}>
                      Our dating process ensures safety for both parties. Contact information cannot be exchanged until you've completed all three dates.
                    </Text>
                  </View>
                </View>

                <View style={[styles.processSteps, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.stepsTitle, { color: colors.text }]}>How It Works</Text>
                  
                  <View style={styles.step}>
                    <View style={[styles.stepIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Phone size={18} color={colors.primary} />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>1st Date - Voice Call</Text>
                      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                        45-minute monitored call. No contact info exchange allowed.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step}>
                    <View style={[styles.stepIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Video size={18} color={colors.primary} />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>2nd Date - Video Call</Text>
                      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                        Face-to-face video call with the same guidelines.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step}>
                    <View style={[styles.stepIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Coffee size={18} color={colors.primary} />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>3rd Date - In Person</Text>
                      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                        Meet at a restaurant or public place of your choice.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.step}>
                    <View style={[styles.stepIcon, { backgroundColor: colors.success + '20' }]}>
                      <Heart size={18} color={colors.success} />
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>Relationship Status</Text>
                      <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                        Set your status: Exclusive, Platonic, or Open Relationship.
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendDateRequest}
                >
                  <Text style={styles.primaryButtonText}>Schedule First Date</Text>
                  <ChevronRight size={20} color="#FFF" />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Date Scheduler Modal */}
      <Modal visible={showScheduler} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowScheduler(false)}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Schedule Date</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.pickerLabel, { color: colors.text }]}>Select Date</Text>
              <View style={styles.dateGrid}>
                {dates.map(date => (
                  <TouchableOpacity
                    key={date.value}
                    style={[
                      styles.dateOption,
                      { backgroundColor: colors.surface },
                      selectedDate === date.value && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setSelectedDate(date.value)}
                  >
                    <Text style={[
                      styles.dateOptionLabel,
                      { color: selectedDate === date.value ? '#FFF' : colors.textSecondary }
                    ]}>
                      {date.label}
                    </Text>
                    <Text style={[
                      styles.dateOptionValue,
                      { color: selectedDate === date.value ? '#FFF' : colors.text }
                    ]}>
                      {date.value.split(',')[0].split(' ')[1]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.pickerLabel, { color: colors.text, marginTop: 24 }]}>Select Time</Text>
              <View style={styles.timeGrid}>
                {times.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      { backgroundColor: colors.surface },
                      selectedTime === time && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      { color: selectedTime === time ? '#FFF' : colors.text }
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.reminderNote, { backgroundColor: colors.primary + '10' }]}>
                <AlertCircle size={18} color={colors.primary} />
                <Text style={[styles.reminderText, { color: colors.primary }]}>
                  Both you and {selectedMatch?.profile.name} must agree to this time. They'll receive a notification to confirm.
                </Text>
              </View>

              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  { backgroundColor: colors.primary },
                  (!selectedDate || !selectedTime) && { opacity: 0.5 }
                ]}
                onPress={handleScheduleDate}
                disabled={!selectedDate || !selectedTime}
              >
                <Text style={styles.primaryButtonText}>Confirm Schedule</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Call Screen Modal */}
      <Modal visible={showCallScreen} animationType="fade" transparent>
        <View style={[styles.callScreen, { backgroundColor: '#1A1A2E' }]}>
          <View style={styles.callContent}>
            {selectedMatch && (
              <>
                <Image source={{ uri: selectedMatch.profile.images[0] }} style={styles.callImage} />
                <Text style={styles.callName}>{selectedMatch.profile.name}</Text>
                <Text style={styles.callStatus}>
                  {callType === 'audio' ? 'Voice Call' : 'Video Call'} - 45:00
                </Text>

                <View style={[styles.callWarning, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                  <Lock size={16} color="#FF6B6B" />
                  <Text style={styles.callWarningText}>
                    This call is monitored. Do not exchange personal contact information.
                  </Text>
                </View>
              </>
            )}

            <View style={styles.callActions}>
              <TouchableOpacity style={[styles.callBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Phone size={24} color="#FFF" />
              </TouchableOpacity>
              {callType === 'video' && (
                <TouchableOpacity style={[styles.callBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Video size={24} color="#FFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.callBtn, styles.endCallBtn]}
                onPress={handleEndCall}
              >
                <Phone size={24} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Review Screen Modal */}
      <Modal visible={showReviewScreen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowReviewScreen(false)}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Review Your Date</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedMatch && (
              <View style={styles.modalBody}>
                <View style={styles.reviewProfile}>
                  <Image source={{ uri: selectedMatch.profile.images[0] }} style={styles.reviewImage} />
                  <Text style={[styles.reviewName, { color: colors.text }]}>
                    How was your date with {selectedMatch.profile.name}?
                  </Text>
                  <Text style={[styles.reviewSubtext, { color: colors.textSecondary }]}>
                    {selectedMatch.dateStage === 'date_3' 
                      ? 'Would you like to start dating officially?'
                      : 'Would you like to continue to the next date?'}
                  </Text>
                </View>

                <View style={styles.reviewActions}>
                  <TouchableOpacity 
                    style={[styles.reviewBtn, styles.rejectBtn, { backgroundColor: colors.error + '15' }]}
                    onPress={() => handleReview('reject')}
                  >
                    <ThumbsDown size={28} color={colors.error} />
                    <Text style={[styles.reviewBtnText, { color: colors.error }]}>Not a Match</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.reviewBtn, styles.acceptBtn, { backgroundColor: colors.success + '15' }]}
                    onPress={() => handleReview('accept')}
                  >
                    <ThumbsUp size={28} color={colors.success} />
                    <Text style={[styles.reviewBtnText, { color: colors.success }]}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={showStatusPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background, height: 'auto' }]}>
            <View style={styles.modalHeader}>
              <View style={{ width: 24 }} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Set Relationship Status</Text>
              <View style={{ width: 24 }} />
            </View>

            {selectedMatch && (
              <View style={[styles.modalBody, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={[styles.statusPrompt, { color: colors.textSecondary }]}>
                  Congratulations on completing all three dates with {selectedMatch.profile.name}! 
                  How would you like to define your relationship?
                </Text>

                <TouchableOpacity 
                  style={[styles.statusOption, { backgroundColor: colors.surface }]}
                  onPress={() => handleSetStatus('exclusive')}
                >
                  <View style={[styles.statusIcon, { backgroundColor: '#E91E63' + '20' }]}>
                    <Heart size={24} color="#E91E63" fill="#E91E63" />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={[styles.statusTitle, { color: colors.text }]}>Exclusive</Text>
                    <Text style={[styles.statusDesc, { color: colors.textSecondary }]}>
                      You're exclusively dating each other
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.statusOption, { backgroundColor: colors.surface }]}
                  onPress={() => handleSetStatus('platonic')}
                >
                  <View style={[styles.statusIcon, { backgroundColor: '#2196F3' + '20' }]}>
                    <Users size={24} color="#2196F3" />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={[styles.statusTitle, { color: colors.text }]}>Platonic</Text>
                    <Text style={[styles.statusDesc, { color: colors.textSecondary }]}>
                      You've decided to stay friends
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.statusOption, { backgroundColor: colors.surface }]}
                  onPress={() => handleSetStatus('open')}
                >
                  <View style={[styles.statusIcon, { backgroundColor: '#9C27B0' + '20' }]}>
                    <Sparkles size={24} color="#9C27B0" />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={[styles.statusTitle, { color: colors.text }]}>Open Relationship</Text>
                    <Text style={[styles.statusDesc, { color: colors.textSecondary }]}>
                      You're dating but open to others
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
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
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  matchMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  matchTime: {
    fontSize: 12,
    marginTop: 4,
  },
  askDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  askDateText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  processCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  processInfo: {
    flex: 1,
  },
  processTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  processText: {
    fontSize: 13,
    lineHeight: 20,
  },
  dateCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  dateInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dateName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  stageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  stageProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stageItem: {
    alignItems: 'center',
  },
  stageCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  stageNumber: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  stageLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  scheduledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  scheduledText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  dateActions: {
    marginTop: 12,
  },
  dateActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  dateActionText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  modalBody: {
    padding: 16,
  },
  dateRequestProfile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dateRequestImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  dateRequestName: {
    fontSize: 22,
    fontWeight: '700' as const,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  processSteps: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dateOption: {
    width: (width - 62) / 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateOptionLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  dateOptionValue: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeOption: {
    width: (width - 62) / 3,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  reminderNote: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  callScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContent: {
    alignItems: 'center',
    padding: 20,
  },
  callImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
  },
  callName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 30,
  },
  callWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 40,
    gap: 10,
    maxWidth: 300,
  },
  callWarningText: {
    flex: 1,
    fontSize: 13,
    color: '#FF6B6B',
    lineHeight: 18,
  },
  callActions: {
    flexDirection: 'row',
    gap: 20,
  },
  callBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallBtn: {
    backgroundColor: '#FF4444',
  },
  reviewProfile: {
    alignItems: 'center',
    marginBottom: 30,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  reviewName: {
    fontSize: 20,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  reviewSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 16,
  },
  rejectBtn: {},
  acceptBtn: {},
  reviewBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  statusPrompt: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 13,
  },
  adultClassifiedsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  adultClassifiedsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adultClassifiedsContent: {
    flex: 1,
    marginLeft: 14,
  },
  adultClassifiedsTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 2,
  },
  adultClassifiedsSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
});
