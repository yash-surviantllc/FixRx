import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';
import { MaterialIcons } from '@expo/vector-icons';

type VendorDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'VendorDashboard'>;

const VendorDashboard: React.FC = () => {
  const navigation = useNavigation<VendorDashboardNavigationProp>();
  const { userProfile } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequestSort, setSelectedRequestSort] = useState<'newest' | 'distance' | 'priority' | 'budget'>('newest');
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const upcomingAppointments = [
    { 
      id: '1', 
      customerName: 'John Smith', 
      service: 'AC Repair', 
      date: 'Today', 
      time: '2:00 PM - 4:00 PM',
      status: 'confirmed',
      amount: 120,
      phone: '(555) 123-4567',
      address: '123 Main St, Apt 4B'
    },
    { 
      id: '2', 
      customerName: 'Sarah Johnson', 
      service: 'AC Maintenance', 
      date: 'Tomorrow', 
      time: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      amount: 89,
      phone: '(555) 987-6543',
      address: '456 Oak Ave'
    },
  ];

  const recentMessages = [
    { id: '1', customerName: 'Michael Brown', message: 'Hi, I need to reschedule my appointment...', time: '2h ago', unread: true },
    { id: '2', customerName: 'Emily Davis', message: 'Thanks for the great service!', time: '1d ago', unread: false },
  ];

  const newRequests = [
    { id: '1', customerName: 'Jennifer Wilson', service: 'Plumbing Repair', location: '2.5 miles away', time: '15 min ago', budget: '$150-200', priority: 'high' },
    { id: '2', customerName: 'Robert Taylor', service: 'Electrical Work', location: '1.2 miles away', time: '1 hour ago', budget: '$100-150', priority: 'medium' },
    { id: '3', customerName: 'Amanda Clark', service: 'AC Installation', location: '4.8 miles away', time: '3 hours ago', budget: '$300-400', priority: 'low' },
  ];

  const sortedRequests = [...newRequests].sort((a, b) => {
    if (selectedRequestSort === 'newest') return 0; // Already in newest order
    if (selectedRequestSort === 'distance') {
      const distA = parseFloat(a.location);
      const distB = parseFloat(b.location);
      return distA - distB;
    }
    if (selectedRequestSort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    if (selectedRequestSort === 'budget') {
      const budgetA = parseInt(a.budget.replace(/[^0-9]/g, ''));
      const budgetB = parseInt(b.budget.replace(/[^0-9]/g, ''));
      return budgetB - budgetA; // Highest budget first
    }
    return 0;
  });

  const stats = [
    { label: 'This Week\'s Revenue', value: '$1,247', icon: 'attach-money', color: '#3B82F6', bg: '#EFF6FF', change: '+12%' },
    { label: 'Active Projects', value: '3', icon: 'work', color: '#3B82F6', bg: '#EFF6FF', change: '+1' },
    { label: 'Response Rate', value: '92%', icon: 'schedule', color: '#3B82F6', bg: '#EFF6FF', change: '+5%' },
    { label: 'Customer Satisfaction', value: '4.9', icon: 'emoji-events', color: '#3B82F6', bg: '#EFF6FF', change: '+0.2' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Good afternoon, {userProfile?.firstName || 'asfds'}!</Text>
          <View style={styles.headerMeta}>
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>4.9</Text>
            <Text style={styles.metaText}>2 appointments today</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => {
            const parentNav = navigation.getParent();
            if (parentNav) parentNav.navigate('VendorNotifications');
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons name="notifications-none" size={28} color="#1F2937" />
          {hasNewNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.bg }]}>
                <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <View style={styles.changeIndicator}>
                <MaterialIcons name="trending-up" size={12} color="#10B981" />
                <Text style={styles.changeText}>{stat.change}</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => {
            const parentNav = navigation.getParent();
            if (parentNav) parentNav.navigate('VendorAppointments');
          }}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <View 
              key={appointment.id} 
              style={styles.appointmentCard}
            >
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentService}>{appointment.service}</Text>
                <Text style={styles.appointmentCustomer}>{appointment.customerName}</Text>
                <View style={styles.appointmentTimeContainer}>
                  <Text style={styles.appointmentTime}>
                    {appointment.date} • {appointment.time}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    appointment.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
                  ]}>
                    <Text style={styles.statusText}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.appointmentAmount}>${appointment.amount}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => {
                    const parentNav = navigation.getParent();
                    if (parentNav) {
                      parentNav.navigate('Messaging', {
                        conversationId: appointment.id,
                        customerName: appointment.customerName,
                        serviceDetails: {
                          service: appointment.service,
                          date: appointment.date,
                          time: appointment.time,
                          status: appointment.status,
                          amount: appointment.amount,
                        },
                      });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="message" size={14} color="#0D6EFD" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => {
                    Alert.alert(
                      'Appointment Details',
                      `Service: ${appointment.service}\nCustomer: ${appointment.customerName}\nDate: ${appointment.date}\nTime: ${appointment.time}\nAmount: $${appointment.amount}\nStatus: ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}`,
                      [
                        { text: 'Call Customer', onPress: () => Alert.alert('Calling', appointment.phone || appointment.customerName) },
                        { text: 'Close', style: 'cancel' }
                      ]
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="visibility" size={14} color="#FFFFFF" />
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <Text style={styles.emptyStateSubtext}>Your upcoming appointments will appear here</Text>
          </View>
        )}
      </View>

      {/* New Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Requests</Text>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => {
              Alert.alert(
                'Sort By',
                'Choose sorting option',
                [
                  { text: 'Newest First', onPress: () => setSelectedRequestSort('newest') },
                  { text: 'Closest Distance', onPress: () => setSelectedRequestSort('distance') },
                  { text: 'Highest Priority', onPress: () => setSelectedRequestSort('priority') },
                  { text: 'Highest Budget', onPress: () => setSelectedRequestSort('budget') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="filter-list" size={18} color="#3B82F6" />
            <Text style={styles.sortButtonText}>Sort: Newest first</Text>
          </TouchableOpacity>
        </View>
        
        {sortedRequests.map(request => {
          const priorityColors = {
            high: { bg: '#FEE2E2', text: '#DC2626' },
            medium: { bg: '#FEF3C7', text: '#D97706' },
            low: { bg: '#DBEAFE', text: '#2563EB' }
          };
          const colors = priorityColors[request.priority as keyof typeof priorityColors];
          
          return (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.requestAvatar}>
                  <Text style={styles.requestAvatarText}>👤</Text>
                </View>
                <View style={styles.requestInfo}>
                  <View style={styles.requestNameRow}>
                    <Text style={styles.requestCustomer}>{request.customerName}</Text>
                    <View style={styles.distanceBadge}>
                      <MaterialIcons name="location-on" size={12} color="#6B7280" />
                      <Text style={styles.distanceText}>2.1 mi</Text>
                    </View>
                  </View>
                  <View style={styles.requestServiceRow}>
                    <Text style={styles.requestService}>{request.service}</Text>
                    <View style={[styles.asapBadge, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={styles.asapText}>ASAP</Text>
                    </View>
                  </View>
                  <Text style={styles.requestTime}>5 min ago</Text>
                </View>
              </View>
              
              <Text style={styles.requestDescription}>
                Kitchen sink is completely clogged, water backing up
              </Text>
              
              <View style={styles.requestFooter}>
                <View style={styles.budgetContainer}>
                  <Text style={styles.budgetLabel}>Budget:</Text>
                  <Text style={styles.budgetValue}>{request.budget}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewRequestButton}
                  onPress={() => {
                    const parentNav = navigation.getParent();
                    if (parentNav) parentNav.navigate('ServiceRequestDetail', { request });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewRequestButtonText}>View Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Refer Other Contractors */}
      <View style={styles.section}>
        <View style={styles.referCard}>
          <View style={styles.referContent}>
            <View style={styles.referIconContainer}>
              <MaterialIcons name="people" size={32} color="#3B82F6" />
            </View>
            <View style={styles.referTextContainer}>
              <Text style={styles.referTitle}>Refer other contractors</Text>
              <Text style={styles.referSubtitle}>Help fellow contractors join the platform</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.referButton}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorInvitation');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.referButtonText}>Send Invitations</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Messages */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Messages</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Messages', { conversationId: '1' })}>
            <Text style={styles.seeAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        {recentMessages.length > 0 ? (
          recentMessages.map(message => (
            <TouchableOpacity 
              key={message.id} 
              style={styles.messageCard}
              onPress={() => {
                const parentNav = navigation.getParent();
                if (parentNav) {
                  parentNav.navigate('Messaging', {
                    conversationId: message.id,
                    customerName: message.customerName,
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>
                  {message.customerName.charAt(0)}
                </Text>
                {message.unread && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>!</Text>
                  </View>
                )}
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text 
                    style={[
                      styles.messageCustomer,
                      message.unread && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                  >
                    {message.customerName}
                  </Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
                <Text 
                  style={[
                    styles.messageText,
                    message.unread && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {message.message}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recent messages</Text>
            <Text style={styles.emptyStateSubtext}>Your messages will appear here</Text>
          </View>
        )}
      </View>

      {/* Your Business */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Business</Text>
        
        {/* Response Time */}
        <View style={styles.businessCard}>
          <View style={styles.businessCardHeader}>
            <MaterialIcons name="schedule" size={24} color="#3B82F6" />
            <Text style={styles.businessCardTitle}>Response Time</Text>
          </View>
          <Text style={styles.businessCardValue}>Average 1.2 hours</Text>
          <Text style={styles.businessCardSubtext}>(Better than 78% of contractors)</Text>
        </View>
        
        {/* Growth Opportunity */}
        <View style={styles.businessCard}>
          <View style={styles.businessCardHeader}>
            <MaterialIcons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.businessCardTitle}>Growth Opportunity</Text>
          </View>
          <Text style={styles.businessCardSubtext}>Consider adding: Bathroom Remodeling (+40% potential revenue)</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorSchedule');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E7F5FF' }]}>
              <MaterialIcons name="event" size={24} color="#0D6EFD" />
            </View>
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorEarnings');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#D4EDDA' }]}>
              <MaterialIcons name="attach-money" size={24} color="#28A745" />
            </View>
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorClients');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFF3CD' }]}>
              <MaterialIcons name="people" size={24} color="#FFC107" />
            </View>
            <Text style={styles.quickActionText}>Clients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('Profile');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#E1E8F0' }]}>
              <MaterialIcons name="settings" size={24} color="#6C757D" />
            </View>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
    marginRight: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  seeAllText: {
    color: '#0D6EFD',
    fontSize: 14,
    fontWeight: '500',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentInfo: {
    marginBottom: 12,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  appointmentCustomer: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  appointmentTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusConfirmed: {
    backgroundColor: '#D4EDDA',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#155724',
  },
  appointmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 4,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0D6EFD',
    marginRight: 8,
    gap: 4,
  },
  messageButtonText: {
    color: '#0D6EFD',
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0D6EFD',
    gap: 4,
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC3545',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  messageCustomer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#212529',
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 10,
    color: '#ADB5BD',
  },
  messageText: {
    fontSize: 12,
    color: '#6C757D',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAction: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC3545',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestAvatarText: {
    fontSize: 24,
  },
  requestInfo: {
    flex: 1,
  },
  requestNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requestCustomer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  requestServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requestService: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  asapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  asapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  requestTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  requestDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  requestDetails: {
    marginBottom: 12,
  },
  requestDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requestDetailText: {
    fontSize: 13,
    color: '#495057',
    marginLeft: 6,
  },
  viewRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
    gap: 6,
  },
  viewRequestButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D6EFD',
  },
  referCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  referContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  referTextContainer: {
    flex: 1,
  },
  referTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  referSubtitle: {
    fontSize: 14,
    color: '#3B82F6',
  },
  referButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  businessCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  businessCardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  businessCardSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  inviteCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  inviteContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inviteTextContainer: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  inviteSubtitle: {
    fontSize: 14,
    color: '#15803D',
    lineHeight: 20,
  },
  inviteButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VendorDashboard;
