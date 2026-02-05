import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Camera, Image as ImageIcon, DollarSign, ChevronDown, 
  X, Check, MapPin, Tag, Package, Info, ChevronRight,
  Sparkles, Clock, Shield, Phone, Mail, MessageSquare, Plus, Trash2
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const categories = [
  { id: 'for-sale', name: 'For Sale', icon: '🏷️', subcategories: ['Electronics', 'Furniture', 'Clothing', 'Vehicles', 'Collectibles', 'Sports', 'Tools', 'Other'] },
  { id: 'services', name: 'Services', icon: '🔧', subcategories: ['Home Improvement', 'Computer', 'Creative', 'Tutoring', 'Cleaning', 'Moving', 'Beauty', 'Other'] },
  { id: 'rentals', name: 'Rentals', icon: '🏠', subcategories: ['Apartment', 'Room', 'House', 'Office', 'Parking', 'Storage', 'Equipment', 'Other'] },
  { id: 'jobs', name: 'Jobs', icon: '💼', subcategories: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote', 'Other'] },
  { id: 'community', name: 'Community', icon: '👥', subcategories: ['Events', 'Classes', 'Lost & Found', 'Volunteers', 'Groups', 'Other'] },
  { id: 'automotive', name: 'Automotive', icon: '🚗', subcategories: ['Cars', 'Motorcycles', 'Parts', 'Repair', 'Tires', 'Detailing', 'Other'] },
  { id: 'real-estate', name: 'Real Estate', icon: '🏢', subcategories: ['Residential', 'Commercial', 'Land', 'Industrial', 'Other'] },
];

const conditions = [
  { id: 'new', label: 'New', description: 'Brand new, unused' },
  { id: 'like-new', label: 'Like New', description: 'Barely used, excellent condition' },
  { id: 'good', label: 'Good', description: 'Minor wear, fully functional' },
  { id: 'fair', label: 'Fair', description: 'Visible wear, works well' },
  { id: 'parts', label: 'For Parts', description: 'Not fully functional' },
];

const listingTypes = [
  { id: 'fixed', label: 'Fixed Price', icon: <DollarSign size={18} color="#22C55E" /> },
  { id: 'negotiable', label: 'Negotiable', icon: <MessageSquare size={18} color="#3B82F6" /> },
  { id: 'free', label: 'Free', icon: <Sparkles size={18} color="#F59E0B" /> },
  { id: 'trade', label: 'Trade/Swap', icon: <Package size={18} color="#8B5CF6" /> },
];

export default function PostAdScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [listingType, setListingType] = useState('fixed');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState(true);
  const [contactEmail, setContactEmail] = useState(true);
  const [contactChat, setContactChat] = useState(true);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const isService = selectedCategory === 'services' || selectedCategory === 'jobs';

  const addMockImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400',
    ];
    if (images.length < 8) {
      setImages([...images, mockImages[images.length % mockImages.length]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your listing');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Description', 'Please describe what you\'re offering');
      return;
    }
    if (!selectedCategory || !selectedSubcategory) {
      Alert.alert('Missing Category', 'Please select a category and subcategory');
      return;
    }
    if (listingType === 'fixed' && (!price || parseFloat(price) <= 0)) {
      Alert.alert('Missing Price', 'Please enter a valid price');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Missing Location', 'Please enter your location');
      return;
    }

    Alert.alert(
      'Post Listing',
      'Your listing will be live within a few minutes after review.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Post', 
          onPress: () => {
            Alert.alert('Success', 'Your listing has been posted!');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Post Listing' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Tag size={36} color="#FFF" />
          <Text style={styles.heroTitle}>Create Your Listing</Text>
          <Text style={styles.heroSubtitle}>Reach thousands of local buyers</Text>
        </View>

        {/* Images Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
          <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
            <Text>Add up to 8 photos. First photo will be the cover.</Text>
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            <View style={styles.imagesContainer}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.uploadedImage} />
                  <TouchableOpacity 
                    style={styles.removeImageBtn}
                    onPress={() => removeImage(index)}
                  >
                    <X size={14} color="#FFF" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.coverBadge}>
                      <Text style={styles.coverBadgeText}>Cover</Text>
                    </View>
                  )}
                </View>
              ))}
              {images.length < 8 && (
                <TouchableOpacity 
                  style={[styles.addImageBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={addMockImage}
                >
                  <Camera size={24} color={colors.textTertiary} />
                  <Text style={[styles.addImageText, { color: colors.textTertiary }]}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Basic Info Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="What are you selling or offering?"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>{title.length}/80</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Describe your item or service in detail..."
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              maxLength={2000}
            />
            <Text style={[styles.charCount, { color: colors.textTertiary }]}>{description.length}/2000</Text>
          </View>

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

          {selectedCategory && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Subcategory *</Text>
              <TouchableOpacity 
                style={[styles.selectInput, { backgroundColor: colors.background }]}
                onPress={() => setShowSubcategoryModal(true)}
              >
                {selectedSubcategory ? (
                  <Text style={[styles.selectedText, { color: colors.text }]}>{selectedSubcategory}</Text>
                ) : (
                  <Text style={[styles.selectText, { color: colors.textTertiary }]}>Select subcategory</Text>
                )}
                <ChevronDown size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          )}

          {!isService && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Condition *</Text>
              <TouchableOpacity 
                style={[styles.selectInput, { backgroundColor: colors.background }]}
                onPress={() => setShowConditionModal(true)}
              >
                {selectedCondition ? (
                  <Text style={[styles.selectedText, { color: colors.text }]}>
                    {conditions.find(c => c.id === selectedCondition)?.label}
                  </Text>
                ) : (
                  <Text style={[styles.selectText, { color: colors.textTertiary }]}>Select condition</Text>
                )}
                <ChevronDown size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Pricing Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pricing</Text>

          <View style={styles.listingTypes}>
            {listingTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.listingTypeBtn,
                  { 
                    backgroundColor: listingType === type.id ? colors.primary + '15' : colors.background,
                    borderColor: listingType === type.id ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setListingType(type.id)}
              >
                {type.icon}
                <Text style={[
                  styles.listingTypeText,
                  { color: listingType === type.id ? colors.primary : colors.text }
                ]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {(listingType === 'fixed' || listingType === 'negotiable') && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Price {listingType === 'fixed' ? '*' : '(Starting)'}
              </Text>
              <View style={[styles.priceInput, { backgroundColor: colors.background }]}>
                <DollarSign size={20} color={colors.textTertiary} />
                <TextInput
                  style={[styles.priceText, { color: colors.text }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
                {isService && (
                  <View style={[styles.perHourBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.perHourText, { color: colors.primary }]}>/hour</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {listingType === 'trade' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>What do you want in exchange?</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder="e.g., Similar value electronics, furniture..."
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Location Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
          
          <View style={styles.inputGroup}>
            <View style={[styles.locationInput, { backgroundColor: colors.background }]}>
              <MapPin size={20} color={colors.textTertiary} />
              <TextInput
                style={[styles.locationText, { color: colors.text }]}
                placeholder="Enter your city or neighborhood"
                placeholderTextColor={colors.textTertiary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            <Text style={[styles.inputHint, { color: colors.textTertiary }]}>
              <Text>Your exact address won't be shown publicly</Text>
            </Text>
          </View>
        </View>

        {/* Contact Preferences */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Preferences</Text>
          <Text style={[styles.sectionHint, { color: colors.textSecondary }]}>
            How can buyers reach you?
          </Text>

          <View style={styles.contactOptions}>
            <TouchableOpacity 
              style={[
                styles.contactOption,
                { 
                  backgroundColor: contactChat ? colors.primary + '15' : colors.background,
                  borderColor: contactChat ? colors.primary : colors.border
                }
              ]}
              onPress={() => setContactChat(!contactChat)}
            >
              <MessageSquare size={20} color={contactChat ? colors.primary : colors.textTertiary} />
              <Text style={[styles.contactOptionText, { color: contactChat ? colors.primary : colors.text }]}>
                <Text>In-App Chat</Text>
              </Text>
              {contactChat && <Check size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.contactOption,
                { 
                  backgroundColor: contactPhone ? colors.primary + '15' : colors.background,
                  borderColor: contactPhone ? colors.primary : colors.border
                }
              ]}
              onPress={() => setContactPhone(!contactPhone)}
            >
              <Phone size={20} color={contactPhone ? colors.primary : colors.textTertiary} />
              <Text style={[styles.contactOptionText, { color: contactPhone ? colors.primary : colors.text }]}>
                <Text>Phone Call</Text>
              </Text>
              {contactPhone && <Check size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.contactOption,
                { 
                  backgroundColor: contactEmail ? colors.primary + '15' : colors.background,
                  borderColor: contactEmail ? colors.primary : colors.border
                }
              ]}
              onPress={() => setContactEmail(!contactEmail)}
            >
              <Mail size={20} color={contactEmail ? colors.primary : colors.textTertiary} />
              <Text style={[styles.contactOptionText, { color: contactEmail ? colors.primary : colors.text }]}>
                <Text>Email</Text>
              </Text>
              {contactEmail && <Check size={16} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Boost Option */}
        <TouchableOpacity style={[styles.boostCard, { backgroundColor: '#FF6B00' + '15' }]}>
          <View style={styles.boostIcon}>
            <Sparkles size={24} color="#FF6B00" />
          </View>
          <View style={styles.boostContent}>
            <Text style={[styles.boostTitle, { color: colors.text }]}>Boost Your Listing</Text>
            <Text style={[styles.boostText, { color: colors.textSecondary }]}>
              <Text>Get up to 5x more views with a featured placement</Text>
            </Text>
          </View>
          <ChevronRight size={20} color="#FF6B00" />
        </TouchableOpacity>

        {/* Preview & Submit */}
        <TouchableOpacity 
          style={[styles.previewBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => setShowPreview(true)}
        >
          <ImageIcon size={20} color={colors.primary} />
          <Text style={[styles.previewBtnText, { color: colors.text }]}>Preview Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
        >
          <Tag size={20} color="#FFF" />
          <Text style={styles.submitBtnText}>Post Listing</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Shield size={16} color={colors.textTertiary} />
          <Text style={[styles.infoText, { color: colors.textTertiary }]}>
            <Text>All listings are reviewed to ensure they meet our community guidelines. Your listing will be live within minutes.</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Category Modal */}
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
                  setSelectedSubcategory(null);
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

      {/* Subcategory Modal */}
      <Modal
        visible={showSubcategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSubcategoryModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Subcategory</Text>
            <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {selectedCategoryData?.subcategories.map((sub) => (
              <TouchableOpacity
                key={sub}
                style={[
                  styles.subcategoryOption,
                  { backgroundColor: selectedSubcategory === sub ? colors.primary + '15' : 'transparent' }
                ]}
                onPress={() => {
                  setSelectedSubcategory(sub);
                  setShowSubcategoryModal(false);
                }}
              >
                <Text style={[styles.subcategoryName, { color: colors.text }]}>{sub}</Text>
                {selectedSubcategory === sub && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Condition Modal */}
      <Modal
        visible={showConditionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowConditionModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Condition</Text>
            <TouchableOpacity onPress={() => setShowConditionModal(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond.id}
                style={[
                  styles.conditionOption,
                  { backgroundColor: selectedCondition === cond.id ? colors.primary + '15' : 'transparent' }
                ]}
                onPress={() => {
                  setSelectedCondition(cond.id);
                  setShowConditionModal(false);
                }}
              >
                <View style={styles.conditionInfo}>
                  <Text style={[styles.conditionLabel, { color: colors.text }]}>{cond.label}</Text>
                  <Text style={[styles.conditionDesc, { color: colors.textSecondary }]}>{cond.description}</Text>
                </View>
                {selectedCondition === cond.id && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="fade"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Preview</Text>
            <TouchableOpacity onPress={() => setShowPreview(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.previewContent}>
            <View style={[styles.previewCard, { backgroundColor: colors.surface }]}>
              {images.length > 0 ? (
                <Image source={{ uri: images[0] }} style={styles.previewImage} />
              ) : (
                <View style={[styles.previewImagePlaceholder, { backgroundColor: colors.background }]}>
                  <ImageIcon size={48} color={colors.textTertiary} />
                  <Text style={[styles.previewImageText, { color: colors.textTertiary }]}>No images added</Text>
                </View>
              )}
              <View style={styles.previewInfo}>
                <Text style={[styles.previewTitle, { color: colors.text }]}>
                  {title || 'Your listing title'}
                </Text>
                <Text style={[styles.previewPrice, { color: colors.primary }]}>
                  {listingType === 'free' ? 'FREE' : 
                   listingType === 'trade' ? 'Trade/Swap' :
                   price ? `$${price}${isService ? '/hr' : ''}` : '$0.00'}
                  {listingType === 'negotiable' && price && ' (Negotiable)'}
                </Text>
                <View style={styles.previewMeta}>
                  <View style={styles.previewMetaItem}>
                    <MapPin size={14} color={colors.textTertiary} />
                    <Text style={[styles.previewMetaText, { color: colors.textSecondary }]}>
                      {location || 'Location'}
                    </Text>
                  </View>
                  <View style={styles.previewMetaItem}>
                    <Clock size={14} color={colors.textTertiary} />
                    <Text style={[styles.previewMetaText, { color: colors.textSecondary }]}>
                      <Text>Just now</Text>
                    </Text>
                  </View>
                </View>
                <Text style={[styles.previewDesc, { color: colors.textSecondary }]} numberOfLines={3}>
                  {description || 'Your listing description will appear here...'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  heroCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginTop: 12, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  section: { margin: 16, marginTop: 0, padding: 16, borderRadius: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700' as const, marginBottom: 4 },
  sectionHint: { fontSize: 13, marginBottom: 12 },
  imagesScroll: { marginTop: 8 },
  imagesContainer: { flexDirection: 'row', gap: 10 },
  imageWrapper: { position: 'relative' },
  uploadedImage: { width: 100, height: 100, borderRadius: 12 },
  removeImageBtn: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  coverBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  coverBadgeText: { fontSize: 10, fontWeight: '600' as const, color: '#FFF' },
  addImageBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addImageText: { fontSize: 11, fontWeight: '500' as const },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 8 },
  input: { height: 48, borderRadius: 10, paddingHorizontal: 14, fontSize: 15 },
  textArea: { height: 120, borderRadius: 10, paddingHorizontal: 14, paddingTop: 12, fontSize: 15, textAlignVertical: 'top' as const },
  charCount: { fontSize: 11, textAlign: 'right' as const, marginTop: 4 },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  selectText: { fontSize: 15 },
  selectedOption: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedIcon: { fontSize: 18 },
  selectedText: { fontSize: 15 },
  listingTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  listingTypeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, gap: 6 },
  listingTypeText: { fontSize: 13, fontWeight: '500' as const },
  priceInput: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  priceText: { flex: 1, fontSize: 18, fontWeight: '600' as const, marginLeft: 8 },
  perHourBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  perHourText: { fontSize: 13, fontWeight: '600' as const },
  locationInput: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  locationText: { flex: 1, fontSize: 15, marginLeft: 8 },
  inputHint: { fontSize: 11, marginTop: 6 },
  contactOptions: { gap: 10 },
  contactOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, gap: 12 },
  contactOptionText: { flex: 1, fontSize: 15, fontWeight: '500' as const },
  boostCard: { flexDirection: 'row', alignItems: 'center', margin: 16, marginTop: 0, padding: 16, borderRadius: 14, gap: 12 },
  boostIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FF6B00' + '20', alignItems: 'center', justifyContent: 'center' },
  boostContent: { flex: 1 },
  boostTitle: { fontSize: 15, fontWeight: '600' as const },
  boostText: { fontSize: 12, marginTop: 2 },
  previewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, paddingVertical: 14, borderRadius: 12, gap: 8, borderWidth: 1 },
  previewBtnText: { fontSize: 15, fontWeight: '600' as const },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 16, marginTop: 12, paddingVertical: 16, borderRadius: 14, gap: 8 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  infoText: { flex: 1, fontSize: 12, lineHeight: 18 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' as const },
  categoryOption: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  categoryIcon: { fontSize: 24 },
  categoryName: { flex: 1, fontSize: 15 },
  subcategoryOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  subcategoryName: { fontSize: 15 },
  conditionOption: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  conditionInfo: { flex: 1 },
  conditionLabel: { fontSize: 15, fontWeight: '500' as const },
  conditionDesc: { fontSize: 12, marginTop: 2 },
  previewContent: { flex: 1, padding: 16 },
  previewCard: { borderRadius: 16, overflow: 'hidden' },
  previewImage: { width: '100%', height: 250 },
  previewImagePlaceholder: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  previewImageText: { fontSize: 13, marginTop: 8 },
  previewInfo: { padding: 16 },
  previewTitle: { fontSize: 18, fontWeight: '700' as const },
  previewPrice: { fontSize: 22, fontWeight: '700' as const, marginTop: 4 },
  previewMeta: { flexDirection: 'row', gap: 16, marginTop: 10 },
  previewMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewMetaText: { fontSize: 13 },
  previewDesc: { fontSize: 14, lineHeight: 20, marginTop: 12 },
});
