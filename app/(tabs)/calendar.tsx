import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, 
  Video, Wallet, Heart, Gift, ShoppingBag, Calendar as CalendarIcon,
  Bell, Star, CreditCard, ArrowUpRight, Cloud, Sun, CloudRain, Wind, Droplets, Thermometer
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

type EventType = 'social' | 'payment' | 'invitation' | 'meeting' | 'reminder' | 'shopping';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: EventType;
  location?: string;
  attendees?: number;
  amount?: string;
  sender?: string;
  senderAvatar?: string;
  description?: string;
  isConfirmed?: boolean;
}

const mockEvents: Record<string, CalendarEvent[]> = {
  '2026-01-25': [
    { id: '1', title: 'Crypto Trading Webinar', time: '10:00 AM', duration: '1h', type: 'meeting', location: 'Virtual', attendees: 150, description: 'Learn advanced DeFi strategies' },
    { id: '2', title: 'Payment from Alex', time: '2:30 PM', duration: '', type: 'payment', amount: '0.5 SOL', sender: 'Alex Chen', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', isConfirmed: true },
    { id: '3', title: 'Date with Sarah', time: '7:00 PM', duration: '2h', type: 'social', location: 'Downtown Cafe', description: 'Coffee meetup' },
  ],
  '2026-01-26': [
    { id: '4', title: 'Birthday Party Invitation', time: '6:00 PM', duration: '4h', type: 'invitation', location: 'Mike\'s Place', attendees: 25, sender: 'Mike Johnson', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', isConfirmed: false },
    { id: '5', title: 'Scheduled Payment', time: '9:00 AM', duration: '', type: 'payment', amount: '100 USDC', description: 'Monthly subscription' },
  ],
  '2026-01-28': [
    { id: '6', title: 'NFT Drop Reminder', time: '12:00 PM', duration: '', type: 'reminder', description: 'Limited edition collection launch' },
    { id: '7', title: 'Group Meetup', time: '3:00 PM', duration: '2h', type: 'social', location: 'Tech Hub', attendees: 8 },
  ],
  '2026-01-30': [
    { id: '8', title: 'Flash Sale Alert', time: '10:00 AM', duration: '24h', type: 'shopping', description: '50% off electronics' },
  ],
  '2026-02-01': [
    { id: '9', title: 'Rent Payment Due', time: '12:00 AM', duration: '', type: 'payment', amount: '1,500 USDC', description: 'Monthly rent' },
  ],
  '2026-02-05': [
    { id: '10', title: 'Wedding Invitation', time: '4:00 PM', duration: '5h', type: 'invitation', location: 'Grand Ballroom', attendees: 200, sender: 'Emma & James', isConfirmed: false },
  ],
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  humidity: number;
  wind: number;
  high: number;
  low: number;
  location: string;
  hourly: { time: string; temp: number; condition: 'sunny' | 'cloudy' | 'rainy' }[];
}

const mockWeather: WeatherData = {
  temp: 72,
  condition: 'sunny',
  humidity: 45,
  wind: 8,
  high: 78,
  low: 62,
  location: 'San Francisco, CA',
  hourly: [
    { time: '9AM', temp: 65, condition: 'cloudy' },
    { time: '12PM', temp: 72, condition: 'sunny' },
    { time: '3PM', temp: 76, condition: 'sunny' },
    { time: '6PM', temp: 74, condition: 'sunny' },
    { time: '9PM', temp: 68, condition: 'cloudy' },
  ],
};

const getWeatherIcon = (condition: 'sunny' | 'cloudy' | 'rainy') => {
  switch (condition) {
    case 'sunny': return Sun;
    case 'cloudy': return Cloud;
    case 'rainy': return CloudRain;
  }
};

const getEventIcon = (type: EventType) => {
  switch (type) {
    case 'payment': return CreditCard;
    case 'invitation': return Gift;
    case 'meeting': return Video;
    case 'social': return Heart;
    case 'reminder': return Bell;
    case 'shopping': return ShoppingBag;
    default: return CalendarIcon;
  }
};

const getEventColor = (type: EventType) => {
  switch (type) {
    case 'payment': return '#10B981';
    case 'invitation': return '#F59E0B';
    case 'meeting': return '#3B82F6';
    case 'social': return '#EC4899';
    case 'reminder': return '#8B5CF6';
    case 'shopping': return '#EF4444';
    default: return '#6B7280';
  }
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const [selectedDate, setSelectedDate] = useState(25);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [showWeather, setShowWeather] = useState(false);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (day: number, month: number, year: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const selectedDateKey = formatDateKey(selectedDate, currentMonth, currentYear);
  const selectedEvents = mockEvents[selectedDateKey] || [];

  const daysWithEvents = useMemo(() => {
    const eventDays = new Set<number>();
    Object.keys(mockEvents).forEach(key => {
      const [year, month, day] = key.split('-').map(Number);
      if (year === currentYear && month - 1 === currentMonth) {
        eventDays.add(day);
      }
    });
    return eventDays;
  }, [currentMonth, currentYear]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1);
  };

  const upcomingEvents = useMemo(() => {
    const upcoming: (CalendarEvent & { date: string })[] = [];
    Object.entries(mockEvents).forEach(([date, events]) => {
      events.forEach(event => {
        if (event.type === 'invitation' && !event.isConfirmed) {
          upcoming.push({ ...event, date });
        }
      });
    });
    return upcoming.slice(0, 3);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 10, backgroundColor: colors.surface }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Calendar</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Events & Invitations
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.weatherToggle,
              { backgroundColor: showWeather ? colors.primary : colors.background }
            ]}
            onPress={() => setShowWeather(!showWeather)}
          >
            <Cloud size={18} color={showWeather ? '#FFF' : colors.textSecondary} />
            <Text style={[
              styles.weatherToggleText,
              { color: showWeather ? '#FFF' : colors.textSecondary }
            ]}>
              Weather
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {showWeather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.surface }]}>
            <View style={styles.weatherHeader}>
              <View style={styles.weatherLocation}>
                <MapPin size={14} color={colors.primary} />
                <Text style={[styles.weatherLocationText, { color: colors.text }]}>
                  {mockWeather.location}
                </Text>
              </View>
              <Text style={[styles.weatherDate, { color: colors.textSecondary }]}>
                {months[currentMonth]} {selectedDate}, {currentYear}
              </Text>
            </View>
            
            <View style={styles.weatherMain}>
              <View style={styles.weatherTemp}>
                {(() => {
                  const WeatherIcon = getWeatherIcon(mockWeather.condition);
                  return <WeatherIcon size={48} color="#F59E0B" />;
                })()}
                <Text style={[styles.tempText, { color: colors.text }]}>{mockWeather.temp}°</Text>
                <Text style={[styles.conditionText, { color: colors.textSecondary }]}>
                  {mockWeather.condition.charAt(0).toUpperCase() + mockWeather.condition.slice(1)}
                </Text>
              </View>
              
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetailRow}>
                  <Thermometer size={16} color={colors.textTertiary} />
                  <Text style={[styles.weatherDetailLabel, { color: colors.textSecondary }]}>H/L</Text>
                  <Text style={[styles.weatherDetailValue, { color: colors.text }]}>
                    {mockWeather.high}° / {mockWeather.low}°
                  </Text>
                </View>
                <View style={styles.weatherDetailRow}>
                  <Droplets size={16} color={colors.textTertiary} />
                  <Text style={[styles.weatherDetailLabel, { color: colors.textSecondary }]}>Humidity</Text>
                  <Text style={[styles.weatherDetailValue, { color: colors.text }]}>{mockWeather.humidity}%</Text>
                </View>
                <View style={styles.weatherDetailRow}>
                  <Wind size={16} color={colors.textTertiary} />
                  <Text style={[styles.weatherDetailLabel, { color: colors.textSecondary }]}>Wind</Text>
                  <Text style={[styles.weatherDetailValue, { color: colors.text }]}>{mockWeather.wind} mph</Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.hourlyForecast, { borderTopColor: colors.border }]}>
              {mockWeather.hourly.map((hour, index) => {
                const HourIcon = getWeatherIcon(hour.condition);
                return (
                  <View key={index} style={styles.hourlyItem}>
                    <Text style={[styles.hourlyTime, { color: colors.textSecondary }]}>{hour.time}</Text>
                    <HourIcon size={20} color={hour.condition === 'sunny' ? '#F59E0B' : colors.textTertiary} />
                    <Text style={[styles.hourlyTemp, { color: colors.text }]}>{hour.temp}°</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View style={styles.invitationsSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PENDING INVITATIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.invitationsScroll}>
              {upcomingEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.invitationCard, { backgroundColor: colors.surface }]}
                >
                  <View style={[styles.invitationBadge, { backgroundColor: getEventColor(event.type) + '20' }]}>
                    <Gift size={18} color={getEventColor(event.type)} />
                  </View>
                  <Text style={[styles.invitationTitle, { color: colors.text }]} numberOfLines={1}>
                    {event.title}
                  </Text>
                  {event.sender && (
                    <View style={styles.invitationSender}>
                      {event.senderAvatar && (
                        <Image source={{ uri: event.senderAvatar }} style={styles.senderAvatar} />
                      )}
                      <Text style={[styles.senderName, { color: colors.textSecondary }]} numberOfLines={1}>
                        {event.sender}
                      </Text>
                    </View>
                  )}
                  <View style={styles.invitationActions}>
                    <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: colors.primary }]}>
                      <Text style={styles.acceptBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.declineBtn, { borderColor: colors.border }]}>
                      <Text style={[styles.declineBtnText, { color: colors.textSecondary }]}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={[styles.calendarCard, { backgroundColor: colors.surface }]}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={[styles.navButton, { backgroundColor: colors.background }]}>
              <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.monthYear, { color: colors.text }]}>
              {months[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={[styles.navButton, { backgroundColor: colors.background }]}>
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {weekDays.map((day) => (
              <Text key={day} style={[styles.weekDay, { color: colors.textTertiary }]}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {emptyDays.map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}
            {days.map((day) => {
              const isSelected = selectedDate === day;
              const hasEvents = daysWithEvents.has(day);
              const isToday = day === 25 && currentMonth === 0 && currentYear === 2026;
              
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && { backgroundColor: colors.primary },
                    isToday && !isSelected && { borderWidth: 2, borderColor: colors.primary },
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text style={[
                    styles.dayText,
                    { color: isSelected ? '#FFF' : colors.text },
                    isToday && !isSelected && { color: colors.primary, fontWeight: '700' as const },
                  ]}>
                    {day}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventDots}>
                      <View style={[styles.eventDot, { backgroundColor: isSelected ? '#FFF' : colors.primary }]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {months[currentMonth]} {selectedDate}
              </Text>
              <Text style={[styles.eventCount, { color: colors.textSecondary }]}>
                {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}
              </Text>
            </View>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]}>
              <Plus size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {selectedEvents.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <CalendarIcon size={40} color={colors.textTertiary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Events</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Your schedule is clear for this day
              </Text>
            </View>
          ) : (
            selectedEvents.map((event) => {
              const EventIcon = getEventIcon(event.type);
              const eventColor = getEventColor(event.type);
              
              return (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.eventCard, { backgroundColor: colors.surface }]}
                >
                  <View style={[styles.eventIconContainer, { backgroundColor: eventColor + '20' }]}>
                    <EventIcon size={20} color={eventColor} />
                  </View>
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                      {event.amount && (
                        <Text style={[styles.eventAmount, { color: '#10B981' }]}>{event.amount}</Text>
                      )}
                    </View>
                    
                    <View style={styles.eventDetails}>
                      {event.time && (
                        <View style={styles.eventDetail}>
                          <Clock size={12} color={colors.textTertiary} />
                          <Text style={[styles.eventDetailText, { color: colors.textTertiary }]}>
                            {event.time} {event.duration && `(${event.duration})`}
                          </Text>
                        </View>
                      )}
                      {event.location && (
                        <View style={styles.eventDetail}>
                          <MapPin size={12} color={colors.textTertiary} />
                          <Text style={[styles.eventDetailText, { color: colors.textTertiary }]}>
                            {event.location}
                          </Text>
                        </View>
                      )}
                      {event.attendees && (
                        <View style={styles.eventDetail}>
                          <Users size={12} color={colors.textTertiary} />
                          <Text style={[styles.eventDetailText, { color: colors.textTertiary }]}>
                            {event.attendees} attending
                          </Text>
                        </View>
                      )}
                    </View>

                    {event.sender && (
                      <View style={styles.eventSender}>
                        {event.senderAvatar && (
                          <Image source={{ uri: event.senderAvatar }} style={styles.smallAvatar} />
                        )}
                        <Text style={[styles.senderText, { color: colors.textSecondary }]}>
                          {event.type === 'payment' ? 'From ' : 'By '}{event.sender}
                        </Text>
                      </View>
                    )}

                    {event.description && (
                      <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={1}>
                        {event.description}
                      </Text>
                    )}
                  </View>
                  <ArrowUpRight size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  weatherToggleText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  weatherCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    padding: 16,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherLocationText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  weatherDate: {
    fontSize: 12,
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTemp: {
    alignItems: 'center',
  },
  tempText: {
    fontSize: 48,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  conditionText: {
    fontSize: 14,
    marginTop: 2,
  },
  weatherDetails: {
    gap: 10,
  },
  weatherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherDetailLabel: {
    fontSize: 12,
    width: 60,
  },
  weatherDetailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  hourlyForecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  hourlyItem: {
    alignItems: 'center',
    gap: 6,
  },
  hourlyTime: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  hourlyTemp: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  invitationsSection: {
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  invitationsScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  invitationCard: {
    width: 180,
    padding: 14,
    borderRadius: 16,
    marginRight: 4,
  },
  invitationBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  invitationTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  invitationSender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  senderAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  senderName: {
    fontSize: 12,
    flex: 1,
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  calendarCard: {
    margin: 16,
    borderRadius: 20,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  eventCount: {
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  eventIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  eventAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
  },
  eventSender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  smallAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  senderText: {
    fontSize: 12,
  },
  eventDescription: {
    fontSize: 12,
    marginTop: 4,
  },
});
