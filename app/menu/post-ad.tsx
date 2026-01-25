import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusCircle, Image, DollarSign, Target, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function PostAdScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Post Ad' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <PlusCircle size={40} color="#FFF" />
          <Text style={styles.heroTitle}>Create Your Ad</Text>
          <Text style={styles.heroSubtitle}>Reach thousands of crypto users</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Ad Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Enter ad title..."
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="Describe your ad..."
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={[styles.uploadArea, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Image size={32} color={colors.textTertiary} />
            <Text style={[styles.uploadText, { color: colors.textTertiary }]}>Upload Images</Text>
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Category</Text>
            <TouchableOpacity style={[styles.selectInput, { backgroundColor: colors.background }]}>
              <Text style={[styles.selectText, { color: colors.textTertiary }]}>Select category</Text>
              <ChevronDown size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Daily Budget</Text>
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
          </View>
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.submitButtonText}>Post Ad</Text>
        </TouchableOpacity>
      </ScrollView>
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
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, marginBottom: 8 },
  input: { height: 48, borderRadius: 10, paddingHorizontal: 14, fontSize: 15 },
  textArea: { height: 100, borderRadius: 10, paddingHorizontal: 14, paddingTop: 12, fontSize: 15, textAlignVertical: 'top' },
  uploadArea: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 16 },
  uploadText: { fontSize: 14, marginTop: 8 },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  selectText: { fontSize: 15 },
  budgetInput: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 10, paddingHorizontal: 14 },
  budgetText: { flex: 1, fontSize: 15, marginLeft: 8 },
  budgetSuffix: { fontSize: 14 },
  submitButton: { margin: 16, marginTop: 0, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' as const },
});
