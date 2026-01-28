import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  PlusCircle, Image as ImageIcon, DollarSign, Target, ChevronDown, 
  X, Check, Calendar, MapPin, Users, Clock, Zap, Tag, Eye, 
  Smartphone, Globe, TrendingUp, Info, ChevronRight
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const categories = [
  { id: 'digital-art', name: 'Digital Art & NFTs', icon: '🎨' },
  { id: 'finance', name: 'Finance & DeFi', icon: '💰' },
  { id: 'education', name: 'Education & Courses', icon: '📚' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'services', name: 'Services', icon: '🔧' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'food', name: 'Food & Beverage', icon: '🍕' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'other', name: 'Other', icon: '📦' },
];

const targetAudiences = [
  { id: 'crypto-traders', name: 'Crypto Traders', count: '2.5M+' },
  { id: 'nft-collectors', name: 'NFT Collectors', count: '890K+' },
  { id: 'defi-users', name: 'DeFi Users', count: '1.2M+' },
  { id: 'tech-enthusiasts', name: 'Tech Enthusiasts', count: '3.1M+' },
  { id: 'investors', name: 'Investors', count: '1.8M+' },
  { id: 'gamers', name: 'Gamers', count: '4.2M+' },
  { id: 'small-business', name: 'Small Business Owners', count: '780K+' },
  { id: 'general', name: 'General Audience', count: '10M+' },
];

const adPlacements = [
  { id: 'feed', name: 'News Feed', icon: <Smartphone size={18} color="#3B82F6" />, description: 'Appears in main feed' },
  { id: 'marketplace', name: 'Marketplace', icon: <Tag size={18} color="#22C55E" />, description: 'Shop listings page' },
  { id: 'wallet', name: 'Wallet Section', icon: <DollarSign size={18} color="#F59E0B" />, description: 'Financial services area' },
  { id: 'stories', name: 'Stories', icon: <Eye size={18} color="#EC4899" />, description: 'Full-screen stories' },
];

export default function PostAdScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('7');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['feed']);
  const [linkUrl, setLinkUrl] = useState('');
  const [callToAction, setCallToAction] = useState('Learn More');
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const ctaOptions = ['Learn More', 'Shop Now', 'Sign Up', 'Get Started', 'Book Now', 'Contact Us', 'Download', 'Apply Now'];

  const estimatedReach = () => {
    const baseBudget = parseFloat(budget) || 50;
    const days = parseInt(duration) || 7;
    const audienceMultiplier = selectedAudiences.length || 1;
    const placementMultiplier = selectedPlacements.length || 1;
    
    const reach = Math.floor((baseBudget * days * 100 * audienceMultiplier * placementMultiplier) / 10);
    return reach >= 1000 ? `${(reach / 1000).toFixed(1)}K` : reach.toString();
  };

  const estimatedClicks = () => {
    const reach = parseFloat(estimatedReach().replace('K', '')) * (estimatedReach().includes('K') ? 1000 : 1);
    return Math.floor(reach * 0.035);
  };

  const totalCost = () => {
    const daily = parseFloat(budget) || 0;
    const days = parseInt(duration) || 0;
    return (daily * days).toFixed(2);
  };

  const toggleAudience = (id: string) => {
    setSelectedAudiences(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const togglePlacement = (id: string) => {
    setSelectedPlacements(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your ad');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please enter a description for your ad');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Missing Category', 'Please select a category for your ad');
      return;
    }
    if (!budget || parseFloat(budget) < 5) {
      Alert.alert('Invalid Budget', 'Minimum daily budget is $5');
      return;
    }

    Alert.alert(
      'Submit Ad',
      `Your ad will be reviewed and published within 24 hours.\n\nTotal Budget: $${totalCost()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            Alert.alert('Success', 'Your ad has been submitted for review!');
            router.back();
          }
        }
      ]
    );
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Create Ad' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <PlusCircle size={40} color="#FFF" />
          <Text style={styles.heroTitle}>Create Your Ad</Text>
          <Text style={styles.heroSubtitle}>Reach millions of potential customers</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Ad Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Enter a catchy title..."
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={60}
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>{title.length}/60</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Describe your product or service..."
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>{description.length}/200</Text>
          </View>

          <TouchableOpacity 
            style={[styles.uploadArea, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <ImageIcon size={32} color={colors.textTertiary} />
            <Text style={[styles.uploadText, { color: colors.textTertiary }]}>Upload Images or Video</Text>
            <Text style={[styles.uploadHint, { color: colors.textTertiary }]}>
              Recommended: 1200x628px, max 5MB
            </Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
            <TouchableOpacity 
              style={[styles.selectInput, { backgroundColor: colors.background }]}
              onPress={() => setShowCategoryModal(true)}
            >
              {selectedCategoryData ? (
                <View style={styles.selectedOption}>
                  <Text style={styles.selectedIcon}>{selectedCategoryData.icon}</Text>
                  <Text style={[styles.selectedText, { color: colors.text }]}>{selectedCategoryData.name}</Text>
                </View>
              ) : (
                <Text style={[styles.selectText, { color: colors.textTertiary }]}>Select category</Text>
              )}
              <ChevronDown size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Destination URL</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="https://your-website.com"
              placeholderTextColor={colors.textTertiary}
              value={linkUrl}
              onChangeText={setLinkUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Call to Action</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.ctaOptions}>
                {ctaOptions.map((cta) => (
                  <TouchableOpacity
                    key={cta}
                    style={[
                      styles.ctaOption,
                      { 
                        backgroundColor: callToAction === cta ? colors.primary : colors.background,
                        borderColor: callToAction === cta ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setCallToAction(cta)}
                  >
                    <Text style={[
                      styles.ctaOptionText,
                      { color: callToAction === cta ? '#FFF' : colors.text }
                    ]}>{cta}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Target size={18} color={colors.primary} /> Targeting
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Target Audience</Text>
            <TouchableOpacity 
              style={[styles.selectInput, { backgroundColor: colors.background }]}
              onPress={() => setShowAudienceModal(true)}
            >
              <Text style={[
                selectedAudiences.length > 0 ? styles.selectedText : styles.selectText, 
                { color: selectedAudiences.length > 0 ? colors.text : colors.textTertiary }
              ]}>
                {selectedAudiences.length > 0 
                  ? `${selectedAudiences.length} audience(s) selected`
                  : 'Select target audiences'}
              </Text>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Ad Placements</Text>
            <TouchableOpacity 
              style={[styles.selectInput, { backgroundColor: colors.background }]}
              onPress={() => setShowPlacementModal(true)}
            >
              <Text style={[
                selectedPlacements.length > 0 ? styles.selectedText : styles.selectText, 
                { color: selectedPlacements.length > 0 ? colors.text : colors.textTertiary }
              ]}>
                {selectedPlacements.length > 0 
                  ? `${selectedPlacements.length} placement(s) selected`
                  : 'Select ad placements'}
              </Text>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <DollarSign size={18} color={colors.primary} /> Budget & Schedule
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Daily Budget *</Text>
            <View style={[styles.budgetInput, { backgroundColor: colors.background }]}>
              <DollarSign size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.budgetText, { color: colors.text }]}
                placeholder="50"
                placeholderTextColor={colors.textTertiary}
                value={budget}
                onChangeText={setBudget}
                keyboardType="numeric"
              />
              <Text style={[styles.budgetSuffix, { color: colors.textTertiary }]}>/day</Text>
            </View>
            <Text style={[styles.inputHint, { color: colors.textTertiary }]}>Minimum: $5/day</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
            <View style={styles.durationOptions}>
              {['3', '7', '14', '30'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.durationOption,
                    { 
                      backgroundColor: duration === d ? colors.primary : colors.background,
                      borderColor: duration === d ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setDuration(d)}
                >
                  <Text style={[
                    styles.durationText,
                    { color: duration === d ? '#FFF' : colors.text }
                  ]}>{d} days</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.estimateCard, { backgroundColor: colors.background }]}>
            <Text style={[styles.estimateTitle, { color: colors.text }]}>Estimated Performance</Text>
            <View style={styles.estimateRow}>
              <View style={styles.estimateItem}>
                <Eye size={16} color={colors.primary} />
                <Text style={[styles.estimateValue, { color: colors.text }]}>{estimatedReach()}</Text>
                <Text style={[styles.estimateLabel, { color: colors.textTertiary }]}>Reach</Text>
              </View>
              <View style={styles.estimateItem}>
                <TrendingUp size={16} color={colors.success} />
                <Text style={[styles.estimateValue, { color: colors.text }]}>{estimatedClicks()}</Text>
                <Text style={[styles.estimateLabel, { color: colors.textTertiary }]}>Est. Clicks</Text>
              </View>
              <View style={styles.estimateItem}>
                <DollarSign size={16} color={colors.warning} />
                <Text style={[styles.estimateValue, { color: colors.text }]}>${totalCost()}</Text>
                <Text style={[styles.estimateLabel, { color: colors.textTertiary }]}>Total Cost</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.previewButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowPreview(true)}
        >
          <Eye size={20} color={colors.primary} />
          <Text style={[styles.previewButtonText, { color: colors.text }]}>Preview Ad</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Zap size={20} color="#FFF" />
          <Text style={styles.submitButtonText}>Submit Ad for Review</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Info size={16} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.textTertiary }]}>
            Ads are reviewed within 24 hours. You will be charged only when your ad is approved and running.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  { backgroundColor: selectedCategory === cat.id ? colors.primary + '15' : 'transparent' }
                ]}
                onPress={() => {
                  setSelectedCategory(cat.id);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryName, { color: colors.text }]}>{cat.name}</Text>
                {selectedCategory === cat.id && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showAudienceModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAudienceModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Target Audiences</Text>
            <TouchableOpacity onPress={() => setShowAudienceModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {targetAudiences.map((audience) => (
              <TouchableOpacity
                key={audience.id}
                style={[
                  styles.audienceOption,
                  { backgroundColor: selectedAudiences.includes(audience.id) ? colors.primary + '15' : 'transparent' }
                ]}
                onPress={() => toggleAudience(audience.id)}
              >
                <View style={styles.audienceInfo}>
                  <Text style={[styles.audienceName, { color: colors.text }]}>{audience.name}</Text>
                  <Text style={[styles.audienceCount, { color: colors.textTertiary }]}>{audience.count} users</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: selectedAudiences.includes(audience.id) ? colors.primary : 'transparent',
                    borderColor: selectedAudiences.includes(audience.id) ? colors.primary : colors.border
                  }
                ]}>
                  {selectedAudiences.includes(audience.id) && <Check size={14} color="#FFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.modalDoneBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowAudienceModal(false)}
          >
            <Text style={styles.modalDoneBtnText}>Done ({selectedAudiences.length} selected)</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showPlacementModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPlacementModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Ad Placements</Text>
            <TouchableOpacity onPress={() => setShowPlacementModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {adPlacements.map((placement) => (
              <TouchableOpacity
                key={placement.id}
                style={[
                  styles.placementOption,
                  { backgroundColor: selectedPlacements.includes(placement.id) ? colors.primary + '15' : 'transparent' }
                ]}
                onPress={() => togglePlacement(placement.id)}
              >
                <View style={[styles.placementIcon, { backgroundColor: colors.surface }]}>
                  {placement.icon}
                </View>
                <View style={styles.placementInfo}>
                  <Text style={[styles.placementName, { color: colors.text }]}>{placement.name}</Text>
                  <Text style={[styles.placementDesc, { color: colors.textTertiary }]}>{placement.description}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  { 
                    backgroundColor: selectedPlacements.includes(placement.id) ? colors.primary : 'transparent',
                    borderColor: selectedPlacements.includes(placement.id) ? colors.primary : colors.border
                  }
                ]}>
                  {selectedPlacements.includes(placement.id) && <Check size={14} color="#FFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={[styles.modalDoneBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowPlacementModal(false)}
          >
            <Text style={styles.modalDoneBtnText}>Done ({selectedPlacements.length} selected)</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={showPreview}
        animationType="fade"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Ad Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.previewContainer}>
            <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
              <View style={styles.previewHeader}>
                <View style={[styles.previewAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.previewAvatarText}>AD</Text>
                </View>
                <View>
                  <Text style={[styles.previewSponsor, { color: colors.text }]}>Sponsored</Text>
                  <Text style={[styles.previewCategory, { color: colors.textTertiary }]}>
                    {selectedCategoryData?.name || 'Category'}
                  </Text>
                </View>
              </View>
              <View style={[styles.previewImage, { backgroundColor: colors.background }]}>
                <ImageIcon size={48} color={colors.textTertiary} />
                <Text style={[styles.previewImageText, { color: colors.textTertiary }]}>Your ad image</Text>
              </View>
              <Text style={[styles.previewTitle, { color: colors.text }]}>
                {title || 'Your Ad Title Here'}
              </Text>
              <Text style={[styles.previewDesc, { color: colors.textSecondary }]}>
                {description || 'Your ad description will appear here...'}
              </Text>
              <TouchableOpacity style={[styles.previewCta, { backgroundColor: colors.primary }]}>
                <Text style={styles.previewCtaText}>{callToAction}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  heroCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginTop: 12, marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  formCard: { margin: 16, marginTop: 0, padding: 16, borderRadius: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 8 },
  input: { height: 48, borderRadius: 10, paddingHorizontal: 14, fontSize: 15 },
  textArea: { height: 100, borderRadius: 10, paddingHorizontal: 14, paddingTop: 12, fontSize: 15, textAlignVertical: 'top' as const },
  charCount: { fontSize: 11, textAlign: 'right' as const, marginTop: 4 },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16 },
  uploadText: { fontSize: 14, marginTop: 8 },
  uploadHint: { fontSize: 11, marginTop: 4 },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  selectText: { fontSize: 15 },
  selectedOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedIcon: { fontSize: 18 },
  selectedText: { fontSize: 15 },
  ctaOptions: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  ctaOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  ctaOptionText: { fontSize: 13, fontWeight: '500' as const },
  budgetInput: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  budgetText: { flex: 1, fontSize: 15, marginLeft: 8 },
  budgetSuffix: { fontSize: 14 },
  inputHint: { fontSize: 11, marginTop: 4 },
  durationOptions: { flexDirection: 'row', gap: 10 },
  durationOption: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  durationText: { fontSize: 13, fontWeight: '600' as const },
  estimateCard: { padding: 16, borderRadius: 12, marginTop: 8 },
  estimateTitle: { fontSize: 14, fontWeight: '600' as const, marginBottom: 12, textAlign: 'center' as const },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-around' },
  estimateItem: { alignItems: 'center', gap: 4 },
  estimateValue: { fontSize: 18, fontWeight: '700' as const },
  estimateLabel: { fontSize: 11 },
  previewButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, gap: 8, borderWidth: 1 },
  previewButtonText: { fontSize: 15, fontWeight: '600' as const },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, marginTop: 12, paddingVertical: 16, borderRadius: 14, gap: 8 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' as const },
  categoryOption: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  categoryIcon: { fontSize: 24 },
  categoryName: { flex: 1, fontSize: 15 },
  audienceOption: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  audienceInfo: { flex: 1 },
  audienceName: { fontSize: 15, fontWeight: '500' as const },
  audienceCount: { fontSize: 12, marginTop: 2 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  placementOption: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  placementIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  placementInfo: { flex: 1 },
  placementName: { fontSize: 15, fontWeight: '500' as const },
  placementDesc: { fontSize: 12, marginTop: 2 },
  modalDoneBtn: { margin: 16, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalDoneBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' as const },
  previewContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  previewCard: { borderRadius: 16, overflow: 'hidden' },
  previewHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  previewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  previewAvatarText: { color: '#FFF', fontSize: 12, fontWeight: '700' as const },
  previewSponsor: { fontSize: 13, fontWeight: '600' as const },
  previewCategory: { fontSize: 11 },
  previewImage: { height: 200, alignItems: 'center', justifyContent: 'center' },
  previewImageText: { fontSize: 13, marginTop: 8 },
  previewTitle: { fontSize: 16, fontWeight: '700' as const, paddingHorizontal: 12, marginTop: 12 },
  previewDesc: { fontSize: 14, paddingHorizontal: 12, marginTop: 6, lineHeight: 20 },
  previewCta: { margin: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  previewCtaText: { color: '#FFF', fontSize: 14, fontWeight: '600' as const },
});
