import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  ChevronRight, 
  Settings, 
  HelpCircle,
  Link2,
  Calculator,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Wallet,
  Receipt,
  Shield
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface TaxIntegration {
  id: string;
  name: string;
  logo: string;
  description: string;
  connected: boolean;
  category: 'tax-software' | 'crypto-tracker';
}

const taxIntegrations: TaxIntegration[] = [
  { id: '1', name: 'CoinTracker', logo: '📊', description: 'Portfolio & Tax Tracking', connected: true, category: 'crypto-tracker' },
  { id: '2', name: 'Koinly', logo: '🪙', description: 'Crypto Tax Calculator', connected: false, category: 'crypto-tracker' },
  { id: '3', name: 'TokenTax', logo: '💹', description: 'DeFi Tax Reports', connected: false, category: 'crypto-tracker' },
  { id: '4', name: 'TurboTax', logo: '🟢', description: 'Intuit Tax Software', connected: true, category: 'tax-software' },
  { id: '5', name: 'H&R Block', logo: '🟩', description: 'Tax Preparation', connected: false, category: 'tax-software' },
  { id: '6', name: 'TaxAct', logo: '📑', description: 'Online Tax Filing', connected: false, category: 'tax-software' },
];

const taxForms = [
  { id: '1', name: 'Form 8949', description: 'Sales and Dispositions of Capital Assets', status: 'ready', year: '2025' },
  { id: '2', name: 'Schedule D', description: 'Capital Gains and Losses', status: 'ready', year: '2025' },
  { id: '3', name: 'Form 1099-B', description: 'Proceeds from Broker Transactions', status: 'pending', year: '2025' },
  { id: '4', name: 'FBAR Report', description: 'Foreign Bank Account Report', status: 'not_required', year: '2025' },
];

const taxReports = [
  { id: '1', name: 'Capital Gains Report', format: 'PDF', date: 'Jan 20, 2026', size: '2.4 MB' },
  { id: '2', name: 'Transaction History', format: 'CSV', date: 'Jan 20, 2026', size: '1.1 MB' },
  { id: '3', name: 'Cost Basis Report', format: 'PDF', date: 'Jan 18, 2026', size: '856 KB' },
  { id: '4', name: 'Income Summary', format: 'PDF', date: 'Jan 15, 2026', size: '420 KB' },
];

const taxableActivities = [
  { type: 'Trades', count: 156, gain: 8420, loss: 2100 },
  { type: 'Staking Rewards', count: 48, gain: 1250, loss: 0 },
  { type: 'Airdrops', count: 3, gain: 580, loss: 0 },
  { type: 'NFT Sales', count: 12, gain: 2200, loss: 1100 },
];

export default function TaxCenterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'forms' | 'integrations' | 'settings'>('overview');

  const totalGains = 12450;
  const totalLosses = 3200;
  const netGain = totalGains - totalLosses;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return colors.success;
      case 'pending': return colors.warning;
      case 'not_required': return colors.textTertiary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} color={colors.success} />;
      case 'pending': return <Clock size={16} color={colors.warning} />;
      case 'not_required': return <AlertCircle size={16} color={colors.textTertiary} />;
      default: return null;
    }
  };

  const renderOverview = () => (
    <>
      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
        <View style={styles.summaryHeader}>
          <Calculator size={32} color="#FFF" />
          <Text style={styles.summaryYear}>2025 Tax Summary</Text>
        </View>
        <View style={styles.summaryStats}>
          <View style={styles.statBlock}>
            <View style={styles.statIconRow}>
              <TrendingUp size={18} color="#4ADE80" />
              <Text style={styles.statLabel}>Total Gains</Text>
            </View>
            <Text style={styles.statValue}>${totalGains.toLocaleString()}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
          <View style={styles.statBlock}>
            <View style={styles.statIconRow}>
              <TrendingDown size={18} color="#F87171" />
              <Text style={styles.statLabel}>Total Losses</Text>
            </View>
            <Text style={styles.statValue}>${totalLosses.toLocaleString()}</Text>
          </View>
        </View>
        <View style={[styles.netGainBanner, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Text style={styles.netGainLabel}>Net Capital Gain</Text>
          <Text style={styles.netGainValue}>${netGain.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Taxable Activities</Text>
        <View style={[styles.activitiesCard, { backgroundColor: colors.surface }]}>
          {taxableActivities.map((activity, index) => (
            <View 
              key={activity.type} 
              style={[
                styles.activityRow,
                { borderBottomColor: colors.border },
                index === taxableActivities.length - 1 && styles.lastRow
              ]}
            >
              <View style={styles.activityInfo}>
                <Text style={[styles.activityType, { color: colors.text }]}>{activity.type}</Text>
                <Text style={[styles.activityCount, { color: colors.textTertiary }]}>
                  {activity.count} transactions
                </Text>
              </View>
              <View style={styles.activityGains}>
                <Text style={[styles.gainText, { color: colors.success }]}>
                  +${activity.gain.toLocaleString()}
                </Text>
                {activity.loss > 0 && (
                  <Text style={[styles.lossText, { color: colors.error }]}>
                    -${activity.loss.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Generated Reports</Text>
        <View style={[styles.reportsCard, { backgroundColor: colors.surface }]}>
          {taxReports.map((report, index) => (
            <TouchableOpacity
              key={report.id}
              style={[
                styles.reportRow,
                { borderBottomColor: colors.border },
                index === taxReports.length - 1 && styles.lastRow
              ]}
            >
              <View style={[styles.reportIcon, { backgroundColor: colors.primary + '15' }]}>
                <FileText size={18} color={colors.primary} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={[styles.reportName, { color: colors.text }]}>{report.name}</Text>
                <Text style={[styles.reportMeta, { color: colors.textTertiary }]}>
                  {report.format} • {report.size} • {report.date}
                </Text>
              </View>
              <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: colors.success + '15' }]}>
                <Download size={18} color={colors.success} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: colors.primary }]}>
          <FileSpreadsheet size={20} color="#FFF" />
          <Text style={styles.generateBtnText}>Generate New Report</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderForms = () => (
    <>
      <View style={[styles.infoCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
        <AlertCircle size={20} color={colors.warning} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          Tax forms for 2025 are being prepared. Some forms may not be final until Feb 15, 2026.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Available Tax Forms</Text>
        {taxForms.map((form) => (
          <TouchableOpacity
            key={form.id}
            style={[styles.formCard, { backgroundColor: colors.surface }]}
          >
            <View style={[styles.formIcon, { backgroundColor: colors.primary + '15' }]}>
              <Receipt size={22} color={colors.primary} />
            </View>
            <View style={styles.formInfo}>
              <Text style={[styles.formName, { color: colors.text }]}>{form.name}</Text>
              <Text style={[styles.formDesc, { color: colors.textTertiary }]}>{form.description}</Text>
            </View>
            <View style={styles.formStatus}>
              {getStatusIcon(form.status)}
              <Text style={[styles.formStatusText, { color: getStatusColor(form.status) }]}>
                {form.status === 'ready' ? 'Ready' : form.status === 'pending' ? 'Pending' : 'N/A'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '15' }]}>
              <Download size={20} color={colors.success} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Download All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickAction, { backgroundColor: colors.surface }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Link2 size={20} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Export to App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderIntegrations = () => (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Crypto Tax Trackers</Text>
        {taxIntegrations.filter(i => i.category === 'crypto-tracker').map((integration) => (
          <TouchableOpacity
            key={integration.id}
            style={[styles.integrationCard, { backgroundColor: colors.surface }]}
          >
            <Text style={styles.integrationLogo}>{integration.logo}</Text>
            <View style={styles.integrationInfo}>
              <Text style={[styles.integrationName, { color: colors.text }]}>{integration.name}</Text>
              <Text style={[styles.integrationDesc, { color: colors.textTertiary }]}>{integration.description}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.connectBtn, 
                { 
                  backgroundColor: integration.connected ? colors.success + '15' : colors.primary,
                  borderWidth: integration.connected ? 1 : 0,
                  borderColor: colors.success
                }
              ]}
            >
              <Text style={[
                styles.connectBtnText, 
                { color: integration.connected ? colors.success : '#FFF' }
              ]}>
                {integration.connected ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Tax Software</Text>
        {taxIntegrations.filter(i => i.category === 'tax-software').map((integration) => (
          <TouchableOpacity
            key={integration.id}
            style={[styles.integrationCard, { backgroundColor: colors.surface }]}
          >
            <Text style={styles.integrationLogo}>{integration.logo}</Text>
            <View style={styles.integrationInfo}>
              <Text style={[styles.integrationName, { color: colors.text }]}>{integration.name}</Text>
              <Text style={[styles.integrationDesc, { color: colors.textTertiary }]}>{integration.description}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.connectBtn, 
                { 
                  backgroundColor: integration.connected ? colors.success + '15' : colors.primary,
                  borderWidth: integration.connected ? 1 : 0,
                  borderColor: colors.success
                }
              ]}
            >
              <Text style={[
                styles.connectBtnText, 
                { color: integration.connected ? colors.success : '#FFF' }
              ]}>
                {integration.connected ? 'Connected' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.apiCard, { backgroundColor: colors.surface }]}>
        <Shield size={24} color={colors.primary} />
        <View style={styles.apiInfo}>
          <Text style={[styles.apiTitle, { color: colors.text }]}>API Access</Text>
          <Text style={[styles.apiDesc, { color: colors.textTertiary }]}>
            <Text>Connect your own tax software via API</Text>
          </Text>
        </View>
        <ChevronRight size={20} color={colors.textTertiary} />
      </View>
    </>
  );

  const renderSettings = () => (
    <>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Tax Settings</Text>
        
        <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
            <Building2 size={20} color={colors.primary} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, { color: colors.text }]}>Tax Jurisdiction</Text>
            <Text style={[styles.settingValue, { color: colors.textTertiary }]}>United States</Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.warning + '15' }]}>
            <Calculator size={20} color={colors.warning} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, { color: colors.text }]}>Cost Basis Method</Text>
            <Text style={[styles.settingValue, { color: colors.textTertiary }]}>FIFO (First In, First Out)</Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.success + '15' }]}>
            <Wallet size={20} color={colors.success} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, { color: colors.text }]}>Reporting Currency</Text>
            <Text style={[styles.settingValue, { color: colors.textTertiary }]}>USD ($)</Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.settingIcon, { backgroundColor: colors.error + '15' }]}>
            <AlertCircle size={20} color={colors.error} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingName, { color: colors.text }]}>Tax Loss Harvesting</Text>
            <Text style={[styles.settingValue, { color: colors.textTertiary }]}>Alerts Enabled</Text>
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Get Help</Text>
        
        <TouchableOpacity style={[styles.helpCard, { backgroundColor: colors.primary + '10' }]}>
          <HelpCircle size={28} color={colors.primary} />
          <View style={styles.helpInfo}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Tax Help & Support</Text>
            <Text style={[styles.helpDesc, { color: colors.textTertiary }]}>
              <Text>Chat with our tax specialists or schedule a consultation</Text>
            </Text>
          </View>
          <ChevronRight size={20} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.helpCard, { backgroundColor: colors.success + '10' }]}>
          <FileText size={28} color={colors.success} />
          <View style={styles.helpInfo}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Tax Guide</Text>
            <Text style={[styles.helpDesc, { color: colors.textTertiary }]}>
              <Text>Learn about crypto tax rules and best practices</Text>
            </Text>
          </View>
          <ChevronRight size={20} color={colors.success} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.helpCard, { backgroundColor: colors.warning + '10' }]}>
          <Building2 size={28} color={colors.warning} />
          <View style={styles.helpInfo}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Find a CPA</Text>
            <Text style={[styles.helpDesc, { color: colors.textTertiary }]}>
              <Text>Connect with crypto-savvy tax professionals</Text>
            </Text>
          </View>
          <ChevronRight size={20} color={colors.warning} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Tax Center' }} />
      
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'forms', label: 'Forms' },
          { key: 'integrations', label: 'Apps' },
          { key: 'settings', label: 'Settings' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && [styles.tabActive, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab(tab.key as typeof activeTab)}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.key ? colors.primary : colors.textTertiary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'forms' && renderForms()}
        {activeTab === 'integrations' && renderIntegrations()}
        {activeTab === 'settings' && renderSettings()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  summaryYear: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  summaryStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  netGainBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  netGainLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500' as const,
  },
  netGainValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  activitiesCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  activityCount: {
    fontSize: 12,
  },
  activityGains: {
    alignItems: 'flex-end',
  },
  gainText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  lossText: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 2,
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
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 10,
  },
  generateBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  formIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  formInfo: {
    flex: 1,
  },
  formName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  formDesc: {
    fontSize: 12,
  },
  formStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
  },
  formStatusText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  integrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  integrationLogo: {
    fontSize: 28,
    marginRight: 12,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  integrationDesc: {
    fontSize: 12,
  },
  connectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  apiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    gap: 14,
  },
  apiInfo: {
    flex: 1,
  },
  apiTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  apiDesc: {
    fontSize: 13,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 15,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    gap: 14,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  helpDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
