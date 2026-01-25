import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Play, Clock, ChevronRight, Award, BookOpen, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  progress: number;
  category: string;
}

const courses: Course[] = [
  { id: '1', title: 'Crypto Basics', description: 'Learn the fundamentals of cryptocurrency', duration: '45 min', lessons: 8, progress: 60, category: 'Beginner' },
  { id: '2', title: 'DeFi Explained', description: 'Understanding decentralized finance', duration: '1h 20min', lessons: 12, progress: 0, category: 'Intermediate' },
  { id: '3', title: 'NFT Masterclass', description: 'Everything about NFTs and digital art', duration: '55 min', lessons: 10, progress: 30, category: 'Beginner' },
  { id: '4', title: 'Smart Contracts', description: 'Build and deploy smart contracts', duration: '2h', lessons: 15, progress: 0, category: 'Advanced' },
];

export default function LearnScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn</Text>
        <View style={styles.streakBadge}>
          <Sparkles size={14} color={Colors.warning} />
          <Text style={styles.streakText}>5 day streak</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primary + '30', Colors.accent + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCard}
        >
          <View style={styles.featuredBadge}>
            <Award size={14} color={Colors.primary} />
            <Text style={styles.featuredBadgeText}>Featured</Text>
          </View>
          <Text style={styles.featuredTitle}>Web3 & Blockchain Fundamentals</Text>
          <Text style={styles.featuredDesc}>Complete course to master blockchain technology</Text>
          <View style={styles.featuredMeta}>
            <View style={styles.metaItem}>
              <BookOpen size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>24 lessons</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>4h 30min</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.startBtn}>
            <Play size={16} color={Colors.background} />
            <Text style={styles.startBtnText}>Start Learning</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {courses.filter(c => c.progress > 0).map(course => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <View style={styles.courseContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{course.category}</Text>
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDesc}>{course.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{course.progress}%</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playBtn}>
                <Play size={20} color={Colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Courses</Text>
          </View>

          {courses.filter(c => c.progress === 0).map(course => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <View style={styles.courseContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{course.category}</Text>
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDesc}>{course.description}</Text>
                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <BookOpen size={12} color={Colors.textTertiary} />
                    <Text style={styles.metaSmall}>{course.lessons} lessons</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={12} color={Colors.textTertiary} />
                    <Text style={styles.metaSmall}>{course.duration}</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.warning,
  },
  featuredCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '30',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
  },
  courseContent: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  courseDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaSmall: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
