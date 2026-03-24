import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText, Plus, Download, Share2, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function ResumeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const experiences = [
    { id: '1', title: 'Senior Blockchain Developer', company: 'CryptoTech Inc.', period: '2022 - Present', description: 'Leading smart contract development and DeFi integrations.' },
    { id: '2', title: 'Full Stack Developer', company: 'Web3 Startup', period: '2020 - 2022', description: 'Built decentralized applications and wallet integrations.' },
  ];

  const education = [
    { id: '1', degree: 'M.S. Computer Science', school: 'MIT', year: '2020' },
    { id: '2', degree: 'B.S. Software Engineering', school: 'Stanford University', year: '2018' },
  ];

  const skills = ['Solidity', 'React Native', 'TypeScript', 'Node.js', 'Web3.js', 'Smart Contracts', 'DeFi', 'NFTs'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Resume / CV' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerCard, { backgroundColor: colors.primary }]}>
          <View style={styles.headerTop}>
            <View style={styles.initialsCircle}>
              <Text style={styles.initials}>JD</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <Download size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Share2 size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction} onPress={() => setIsEditing(!isEditing)}>
                <Edit2 size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerName}>John Doe</Text>
          <Text style={styles.headerTitle}>Blockchain Developer & DeFi Specialist</Text>
          <View style={styles.contactRow}>
            <View style={styles.contactItem}>
              <Mail size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.contactText}>john@example.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.contactText}>+1 555-0123</Text>
            </View>
          </View>
          <View style={styles.contactItem}>
            <MapPin size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.contactText}>New York, NY</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Briefcase size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Experience</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary + '15' }]}>
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          {experiences.map((exp) => (
            <View key={exp.id} style={[styles.itemCard, { backgroundColor: colors.surface }]}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{exp.title}</Text>
                  <Text style={[styles.itemSubtitle, { color: colors.primary }]}>{exp.company}</Text>
                  <Text style={[styles.itemPeriod, { color: colors.textTertiary }]}>{exp.period}</Text>
                </View>
                {isEditing && (
                  <TouchableOpacity>
                    <Trash2 size={18} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.itemDescription, { color: colors.textSecondary }]}>{exp.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <GraduationCap size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Education</Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary + '15' }]}>
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          {education.map((edu) => (
            <View key={edu.id} style={[styles.itemCard, { backgroundColor: colors.surface }]}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{edu.degree}</Text>
                  <Text style={[styles.itemSubtitle, { color: colors.primary }]}>{edu.school}</Text>
                  <Text style={[styles.itemPeriod, { color: colors.textTertiary }]}>{edu.year}</Text>
                </View>
                {isEditing && (
                  <TouchableOpacity>
                    <Trash2 size={18} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Award size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
            </View>
          </View>
          <View style={[styles.skillsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.skillsGrid}>
              {skills.map((skill) => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.skillText, { color: colors.primary }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  initialsCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFF',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  itemPeriod: {
    fontSize: 12,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  skillsCard: {
    padding: 16,
    borderRadius: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
});
