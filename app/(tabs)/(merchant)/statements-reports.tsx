import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  BarChart3,
  PieChart,
  Filter,
  ChevronRight,
  Share2,
  Printer,
  <Text>Mail</Text>
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'payroll' | 'tax' | 'financial';
  period: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'scheduled';
}

const mockReports: Report[] = [
  { id: '1', name: 'Monthly Sales Report', type: 'sales', period: 'January 2025', generatedAt: 'Jan 25, 2025', status: 'ready' },
  { id: '2', name: 'Inventory Valuation', type: 'inventory', period: 'Q4 2024', generatedAt: 'Jan 20, 2025', status: 'ready' },
  { id: '3', name: 'Payroll Summary', type: 'payroll', period: 'January 2025', generatedAt: 'Jan 15, 2025', status: 'ready' },
  { id: '4', name: 'Tax Report', type: 'tax', period: 'Q4 2024', generatedAt: 'Jan 10, 2025', status: 'ready' },
  { id: '5', name: 'Profit & Loss Statement', type: 'financial', period: 'January 2025', generatedAt: 'Generating...', status: 'generating' },
];

const reportTypes = [
  { id: 'sales', label: 'Sales', icon: ShoppingBag, color: Colors.primary },
  { id: 'inventory', label: 'Inventory', icon: BarChart3, color: Colors.accent },
  { id: 'payroll', label: 'Payroll', icon: Users, color: '#9B59B6' },
  { id: 'tax', label: 'Tax', icon: FileText, color: '#E74C3C' },
  { id: 'financial', label: 'Financial', icon: PieChart, color: '#3498DB' },
];

export default function StatementsReports() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const periods = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getReportIcon = (type: Report['type']) => {
    const reportType = reportTypes.find(r => r.id === type);
    return reportType || reportTypes[0];
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statements & Reports</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Business Overview</Text>
            <View style={styles.periodSelector}>
              <Calendar size={14} color="#1A5276" />
              <Text style={styles.periodText}>{selectedPeriod}</Text>
            </View>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <DollarSign size={16} color={Colors.accent} />
                <View style={styles.trendBadge}>
                  <TrendingUp size={10} color={Colors.accent} />
                  <Text style={styles.trendText}>+12%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>$24,580</Text>
              <Text style={styles.metricLabel}>Revenue</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <ShoppingBag size={16} color={Colors.primary} />
                <View style={styles.trendBadge}>
                  <TrendingUp size={10} color={Colors.accent} />
                  <Text style={styles.trendText}>+8%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>842</Text>
              <Text style={styles.metricLabel}>Orders</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Users size={16} color="#9B59B6" />
                <View style={styles.trendBadge}>
                  <TrendingUp size={10} color={Colors.accent} />
                  <Text style={styles.trendText}>+15%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>127</Text>
              <Text style={styles.metricLabel}>Customers</Text>
            </View>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <PieChart size={16} color="#E74C3C" />
                <View style={[styles.trendBadge, { backgroundColor: Colors.error + '15' }]}>
                  <TrendingDown size={10} color={Colors.error} />
                  <Text style={[styles.trendText, { color: Colors.error }]}>-3%</Text>
                </View>
              </View>
              <Text style={styles.metricValue}>$18,240</Text>
              <Text style={styles.metricLabel}>Expenses</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
          {periods.map(period => (
            <TouchableOpacity
              key={period}
              style={[styles.periodChip, selectedPeriod === period && styles.periodChipActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodChipText, selectedPeriod === period && styles.periodChipTextActive]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Generate Reports</Text>
          </View>
          <View style={styles.reportTypesGrid}>
            {reportTypes.map(type => (
              <TouchableOpacity key={type.id} style={styles.reportTypeCard}>
                <View style={[styles.reportTypeIcon, { backgroundColor: type.color + '20' }]}>
                  <type.icon size={22} color={type.color} />
                </View>
                <Text style={styles.reportTypeLabel}>{type.label}</Text>
                <ChevronRight size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {mockReports.map(report => {
            const typeInfo = getReportIcon(report.type);
            return (
              <TouchableOpacity key={report.id} style={styles.reportCard}>
                <View style={[styles.reportIcon, { backgroundColor: typeInfo.color + '15' }]}>
                  <typeInfo.icon size={20} color={typeInfo.color} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportName}>{report.name}</Text>
                  <Text style={styles.reportPeriod}>{report.period}</Text>
                  <Text style={styles.reportDate}>Generated: {report.generatedAt}</Text>
                </View>
                {report.status === 'ready' ? (
                  <View style={styles.reportActions}>
                    <TouchableOpacity style={styles.downloadBtn}>
                      <Download size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn}>
                      <Share2 size={16} color={Colors.accent} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.generatingBadge}>
                    <Text style={styles.generatingText}>Generating...</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Printer size={22} color={Colors.primary} />
            <Text style={styles.actionText}>Print Statement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Mail size={22} color={Colors.accent} />
            <Text style={styles.actionText}>Email Reports</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.scheduleBanner}>
          <View style={styles.scheduleContent}>
            <Calendar size={24} color={Colors.background} />
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Schedule Auto Reports</Text>
              <Text style={styles.scheduleDesc}>Get reports delivered weekly or monthly</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.background} />
        </TouchableOpacity>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginHorizontal: 16,
    backgroundColor: '#B5E5F5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D3B54',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(13,59,84,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A5276',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    padding: 14,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accent,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D3B54',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#1A5276',
  },
  periodScroll: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  periodChipActive: {
    backgroundColor: Colors.primary,
  },
  periodChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  periodChipTextActive: {
    color: Colors.background,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  reportTypesGrid: {
    gap: 10,
  },
  reportTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  reportTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportTypeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  reportPeriod: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatingBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  generatingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.warning,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  scheduleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
  },
  scheduleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
    marginBottom: 2,
  },
  scheduleDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
});
