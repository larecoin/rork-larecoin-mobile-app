import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileSpreadsheet, Download, Calendar, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

const taxYears = [
  { year: '2025', gains: '$12,450', losses: '$3,200', netGain: '$9,250', status: 'ready' },
  { year: '2024', gains: '$8,900', losses: '$2,100', netGain: '$6,800', status: 'filed' },
  { year: '2023', gains: '$5,600', losses: '$1,500', netGain: '$4,100', status: 'filed' },
];

const reports = [
  { id: '1', name: 'Capital Gains Report', format: 'PDF', date: 'Jan 20, 2026' },
  { id: '2', name: 'Transaction History', format: 'CSV', date: 'Jan 20, 2026' },
  { id: '3', name: 'Form 8949', format: 'PDF', date: 'Jan 20, 2026' },
];

export default function TaxReportsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Tax & Reports' }} />
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <FileSpreadsheet size={40} color="#FFF" />
          <Text style={styles.summaryTitle}>2025 Tax Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <TrendingUp size={18} color="#4CAF50" />
              <Text style={styles.summaryLabel}>Gains</Text>
              <Text style={styles.summaryValue}>$12,450</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <TrendingDown size={18} color="#F44336" />
              <Text style={styles.summaryLabel}>Losses</Text>
              <Text style={styles.summaryValue}>$3,200</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Tax Years</Text>
          {taxYears.map((year) => (
            <TouchableOpacity
              key={year.year}
              style={[styles.yearCard, { backgroundColor: colors.surface }]}
            >
              <View style={[styles.yearIcon, { backgroundColor: colors.primary + '15' }]}>
                <Calendar size={20} color={colors.primary} />
              </View>
              <View style={styles.yearInfo}>
                <Text style={[styles.yearText, { color: colors.text }]}>{year.year}</Text>
                <Text style={[styles.yearNet, { color: colors.success }]}>Net: {year.netGain}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: year.status === 'ready' ? colors.warning + '20' : colors.success + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: year.status === 'ready' ? colors.warning : colors.success }
                ]}>
                  {year.status === 'ready' ? 'Ready' : 'Filed'}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Available Reports</Text>
          <View style={[styles.reportsCard, { backgroundColor: colors.surface }]}>
            {reports.map((report, index) => (
              <TouchableOpacity
                key={report.id}
                style={[
                  styles.reportRow,
                  { borderBottomColor: colors.border },
                  index === reports.length - 1 && styles.reportRowLast,
                ]}
              >
                <View style={styles.reportInfo}>
                  <Text style={[styles.reportName, { color: colors.text }]}>{report.name}</Text>
                  <Text style={[styles.reportMeta, { color: colors.textTertiary }]}>
                    {report.format} • {report.date}
                  </Text>
                </View>
                <TouchableOpacity style={[styles.downloadButton, { backgroundColor: colors.primary + '15' }]}>
                  <Download size={18} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.generateButton, { backgroundColor: colors.primary }]}>
          <FileSpreadsheet size={20} color="#FFF" />
          <Text style={styles.generateButtonText}>Generate New Report</Text>
        </TouchableOpacity>
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
  summaryCard: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFF',
    marginTop: 12,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    width: '100%',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFF',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  yearCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  yearIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  yearInfo: {
    flex: 1,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  yearNet: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  reportsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  reportRowLast: {
    borderBottomWidth: 0,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 15,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  reportMeta: {
    fontSize: 12,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
