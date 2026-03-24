import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Plus,
  ChevronRight,
  UserPlus,
  Briefcase,
  Award,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: 'active' | 'on-leave' | 'terminated';
  startDate: string;
  avatar?: string;
  hoursThisWeek: number;
}

const mockEmployees: Employee[] = [
  { id: '1', name: 'Sarah Johnson', role: 'Store Manager', department: 'Management', salary: 4500, status: 'active', startDate: '2022-03-15', hoursThisWeek: 42 },
  { id: '2', name: 'Mike Chen', role: 'Barista', department: 'Operations', salary: 2800, status: 'active', startDate: '2023-01-10', hoursThisWeek: 38 },
  { id: '3', name: 'Emily Davis', role: 'Barista', department: 'Operations', salary: 2600, status: 'on-leave', startDate: '2023-06-20', hoursThisWeek: 0 },
  { id: '4', name: 'James Wilson', role: 'Shift Lead', department: 'Operations', salary: 3200, status: 'active', startDate: '2022-09-01', hoursThisWeek: 40 },
  { id: '5', name: 'Lisa Park', role: 'Part-time Barista', department: 'Operations', salary: 1400, status: 'active', startDate: '2024-01-05', hoursThisWeek: 20 },
];

const CURRENCY = 'LUSD';

const upcomingPayrolls = [
  { id: '1', date: 'Jan 31, 2025', amount: 14500, employees: 5, status: 'pending' },
  { id: '2', date: 'Feb 15, 2025', amount: 14500, employees: 5, status: 'scheduled' },
];

export default function HRPayroll() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');

  const totalPayroll = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const onLeave = mockEmployees.filter(emp => emp.status === 'on-leave').length;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active': return Colors.accent;
      case 'on-leave': return Colors.warning;
      case 'terminated': return Colors.error;
      default: return Colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HR & Payroll</Text>
        <TouchableOpacity style={styles.addButton}>
          <UserPlus size={20} color={Colors.background} />
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
            <View>
              <Text style={styles.summaryTitle}>Payroll Summary</Text>
              <View style={styles.lusdBadge}>
                <Text style={styles.lusdBadgeText}>All payroll paid in LUSD</Text>
              </View>
            </View>
            <Text style={styles.summaryPeriod}>January 2025</Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{totalPayroll.toLocaleString()} {CURRENCY}</Text>
              <Text style={styles.summaryStatLabel}>Monthly Payroll</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{activeEmployees}</Text>
              <Text style={styles.summaryStatLabel}>Active Staff</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>{onLeave}</Text>
              <Text style={styles.summaryStatLabel}>On Leave</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'employees' && styles.tabActive]}
            onPress={() => setActiveTab('employees')}
          >
            <Users size={16} color={activeTab === 'employees' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'employees' && styles.tabTextActive]}>
              <Text>Employees</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'payroll' && styles.tabActive]}
            onPress={() => setActiveTab('payroll')}
          >
            <DollarSign size={16} color={activeTab === 'payroll' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'payroll' && styles.tabTextActive]}>
              <Text>Payroll</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'employees' ? (
          <>
            <View style={styles.quickStats}>
              <View style={styles.quickStatCard}>
                <View style={[styles.quickStatIcon, { backgroundColor: Colors.accent + '20' }]}>
                  <Clock size={18} color={Colors.accent} />
                </View>
                <Text style={styles.quickStatValue}>140h</Text>
                <Text style={styles.quickStatLabel}>Hours This Week</Text>
              </View>
              <View style={styles.quickStatCard}>
                <View style={[styles.quickStatIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <TrendingUp size={18} color={Colors.primary} />
                </View>
                <Text style={styles.quickStatValue}>92%</Text>
                <Text style={styles.quickStatLabel}>Attendance</Text>
              </View>
              <View style={styles.quickStatCard}>
                <View style={[styles.quickStatIcon, { backgroundColor: '#9B59B6' + '20' }]}>
                  <Award size={18} color="#9B59B6" />
                </View>
                <Text style={styles.quickStatValue}>4.8</Text>
                <Text style={styles.quickStatLabel}>Avg Rating</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Team Members</Text>
                <TouchableOpacity style={styles.viewAll}>
                  <Text style={styles.viewAllText}>Add New</Text>
                  <Plus size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {mockEmployees.map(employee => (
                <TouchableOpacity key={employee.id} style={styles.employeeCard}>
                  <View style={styles.employeeAvatar}>
                    <Text style={styles.employeeInitials}>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                    <Text style={styles.employeeRole}>{employee.role}</Text>
                    <View style={styles.employeeMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(employee.status) + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(employee.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(employee.status) }]}>
                          {employee.status === 'on-leave' ? 'On Leave' : employee.status}
                        </Text>
                      </View>
                      <Text style={styles.hoursText}>{employee.hoursThisWeek}h this week</Text>
                    </View>
                  </View>
                  <View style={styles.employeeSalary}>
                    <Text style={styles.salaryAmount}>{employee.salary} {CURRENCY}</Text>
                    <Text style={styles.salaryPeriod}>/month</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Payrolls</Text>
              </View>

              {upcomingPayrolls.map(payroll => (
                <TouchableOpacity key={payroll.id} style={styles.payrollCard}>
                  <View style={styles.payrollIcon}>
                    <Calendar size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.payrollInfo}>
                    <Text style={styles.payrollDate}>{payroll.date}</Text>
                    <Text style={styles.payrollDetails}>{payroll.employees} employees</Text>
                  </View>
                  <View style={styles.payrollAmount}>
                    <Text style={styles.payrollValue}>{payroll.amount.toLocaleString()} {CURRENCY}</Text>
                    <View style={[
                      styles.payrollStatus,
                      { backgroundColor: payroll.status === 'pending' ? Colors.warning + '20' : Colors.accent + '20' }
                    ]}>
                      {payroll.status === 'pending' ? (
                        <AlertCircle size={12} color={Colors.warning} />
                      ) : (
                        <CheckCircle size={12} color={Colors.accent} />
                      )}
                      <Text style={[
                        styles.payrollStatusText,
                        { color: payroll.status === 'pending' ? Colors.warning : Colors.accent }
                      ]}>
                        {payroll.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionCard}>
                <CreditCard size={22} color={Colors.primary} />
                <Text style={styles.actionText}>Run Payroll</Text>
                <ChevronRight size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <FileText size={22} color={Colors.accent} />
                <Text style={styles.actionText}>Payroll History</Text>
                <ChevronRight size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <Briefcase size={22} color="#9B59B6" />
                <Text style={styles.actionText}>Tax Documents</Text>
                <ChevronRight size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </>
        )}

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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
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
  lusdBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  lusdBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryPeriod: {
    fontSize: 13,
    color: '#1A5276',
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,59,84,0.1)',
    borderRadius: 14,
    padding: 14,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D3B54',
    marginBottom: 2,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#1A5276',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(13,59,84,0.2)',
    marginHorizontal: 8,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  quickStatLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
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
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employeeInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  employeeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  employeeSalary: {
    alignItems: 'flex-end',
  },
  salaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  salaryPeriod: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  payrollCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  payrollIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  payrollInfo: {
    flex: 1,
  },
  payrollDate: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  payrollDetails: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  payrollAmount: {
    alignItems: 'flex-end',
  },
  payrollValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  payrollStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payrollStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  quickActions: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
});
