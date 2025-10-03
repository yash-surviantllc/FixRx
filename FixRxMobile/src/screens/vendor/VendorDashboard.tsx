import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

type VendorDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'VendorDashboard'>;

const VendorDashboard: React.FC = () => {
  const navigation = useNavigation<VendorDashboardNavigationProp>();
  const { userProfile, conversations, serviceRequests } = useAppContext();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequestSort, setSelectedRequestSort] = useState<'newest' | 'distance' | 'priority' | 'budget'>('newest');
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Rendering VendorDashboard

  const appointments = [
    {
      id: '1',
      customerName: 'Jennifer Wilson',
      service: 'Kitchen Sink Repair',
      date: 'Today',
      time: '2:00 PM - 4:00 PM',
      amount: 175,
      status: 'confirmed' as const,
      phone: '(555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      customerName: 'Lisa Martinez',
      service: 'Appliance Repair',
      date: 'Tomorrow',
      time: '2:00 PM - 4:00 PM',
      amount: 150,
      status: 'confirmed' as const,
      phone: '(555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '3',
      customerName: 'David Thompson',
      service: 'General Maintenance',
      date: 'Friday',
      time: '9:00 AM - 11:00 AM',
      amount: 100,
      status: 'confirmed' as const,
      phone: '(555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  // Use the mock appointments as upcoming appointments for now
  const upcomingAppointments = appointments;

  // Derive recent messages from centralized conversations in AppContext (show latest 2)
  const recentMessages = (conversations || [])
    .slice(0, 2)
    .map((c: any) => ({
      id: c.id,
      customerName: c.customerName,
      message: c.lastMessage,
      time: c.time,
      unread: !!c.unread,
      avatar: c.avatar,
      serviceDetails: c.serviceDetails,
    }));
  
  // Conversations and service requests are now centralized and automated

  // Use centralized service requests from AppContext (limit to first 3)
  const newRequests = (serviceRequests || []).slice(0, 3).map(req => ({
    id: req.id,
    customerName: req.customerName,
    service: req.title,
    location: req.distance,
    time: req.date,
    budget: `$${req.budget - 25}-${req.budget + 25}`,
    priority: req.priority,
    description: req.description,
    avatar: `https://images.unsplash.com/photo-${req.id === 'req_1' ? '1494790108755-2616b612b786' : req.id === 'req_2' ? '1472099645785-5658abf4ff4e' : '1438761681033-6461ffad8d80'}?w=150&h=150&fit=crop&crop=face`,
    timeRange: req.timeRange,
    status: req.status,
  }));

  // Apply sorting based on selectedRequestSort
  const sortedRequests = [...newRequests].sort((a, b) => {
    switch (selectedRequestSort) {
      case 'newest':
        // Parse time strings for sorting (5 min ago < 15 min ago < 1 hr ago < 2 hrs ago)
        const parseTime = (timeStr: string) => {
          if (timeStr.includes('min')) return parseInt(timeStr);
          if (timeStr.includes('hr')) return parseInt(timeStr) * 60;
          return 0;
        };
        return parseTime(a.time) - parseTime(b.time);
      case 'distance':
        return parseFloat(a.location) - parseFloat(b.location);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      case 'budget':
        const getBudgetMax = (budgetStr: string) => parseInt(budgetStr.split('-')[1].replace('$', ''));
        return getBudgetMax(b.budget) - getBudgetMax(a.budget);
      default:
        return 0;
    }
  });

  const stats = [
    { label: 'This Week\'s Revenue', value: '$1,247', icon: 'attach-money', color: '#3B82F6', bg: '#EFF6FF', change: '+12%' },
    { label: 'Active Projects', value: '3', icon: 'work', color: '#3B82F6', bg: '#EFF6FF', change: '+1' },
    { label: 'Response Rate', value: '92%', icon: 'schedule', color: '#3B82F6', bg: '#EFF6FF', change: '+5%' },
    { label: 'Customer Satisfaction', value: '4.9', icon: 'emoji-events', color: '#3B82F6', bg: '#EFF6FF', change: '+0.2' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.text }]}>Good afternoon, {userProfile?.firstName || 'asfds'}!</Text>
          <View style={styles.headerMeta}>
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text style={[styles.rating, { color: colors.text }]}>4.9</Text>
            <Text style={[styles.metaText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>2 appointments today</Text>
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
          <MaterialIcons name="notifications-none" size={28} color={colors.text} />
          {hasNewNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: darkMode ? '#1E3A8A' : stat.bg }]}>
                <MaterialIcons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <View style={styles.changeIndicator}>
                <MaterialIcons name="trending-up" size={12} color="#10B981" />
                <Text style={[styles.changeText, { color: '#10B981' }]}>{stat.change}</Text>
              </View>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => {
            const parentNav = navigation.getParent();
            if (parentNav) parentNav.navigate('VendorAppointments');
          }}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(appointment => (
            <View 
              key={appointment.id} 
              style={[styles.appointmentCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.appointmentInfo}>
                <Text style={[styles.appointmentService, { color: colors.text }]}>{appointment.service}</Text>
                <Text style={[styles.appointmentCustomer, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{appointment.customerName}</Text>
                <View style={styles.appointmentTimeContainer}>
                  <Text style={[styles.appointmentTime, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>
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
                <Text style={[styles.appointmentAmount, { color: colors.text }]}>${appointment.amount}</Text>
              </View>
              <View style={styles.appointmentActions}>
                <TouchableOpacity 
                  style={[styles.messageButton, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}
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
                  <MaterialIcons name="message" size={14} color={colors.primary} />
                  <Text style={[styles.messageButtonText, { color: colors.primary }]}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.viewButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    const parentNav = navigation.getParent();
                    if (parentNav) {
                      parentNav.navigate('Messaging', {
                        conversationId: appointment.id,
                        customerName: appointment.customerName,
                        serviceDetails: {
                          service: appointment.service,
                          status: appointment.status,
                          amount: appointment.amount,
                          date: appointment.date,
                          time: appointment.time,
                        },
                      });
                    }
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
            <Text style={[styles.emptyStateText, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>No upcoming appointments</Text>
            <Text style={[styles.emptyStateSubtext, { color: darkMode ? '#9CA3AF' : '#9CA3AF' }]}>Your upcoming appointments will appear here</Text>
          </View>
        )}
      </View>

      {/* New Requests */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>New Requests</Text>
          <TouchableOpacity 
            style={[styles.sortButton, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}
            onPress={() => {
              // Cycle through sort options
              const sortOptions: Array<'newest' | 'distance' | 'priority' | 'budget'> = ['newest', 'distance', 'priority', 'budget'];
              const currentIndex = sortOptions.indexOf(selectedRequestSort);
              const nextIndex = (currentIndex + 1) % sortOptions.length;
              const nextSort = sortOptions[nextIndex];
              setSelectedRequestSort(nextSort);
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="filter-list" size={18} color={colors.primary} />
            <Text style={[styles.sortButtonText, { color: colors.primary }]}>Sort: {selectedRequestSort === 'newest' ? 'Newest first' : selectedRequestSort === 'distance' ? 'Closest first' : selectedRequestSort === 'priority' ? 'Highest priority' : 'Highest budget'}</Text>
          </TouchableOpacity>
        </View>
        
        {sortedRequests.map(request => {
          const priorityColors = {
            high: { bg: '#FEE2E2', text: '#DC2626' },
            medium: { bg: '#FEF3C7', text: '#D97706' },
            low: { bg: '#DBEAFE', text: '#2563EB' }
          };
          const priorityColor = priorityColors[request.priority as keyof typeof priorityColors];
          
          return (
            <View key={request.id} style={[styles.requestCard, { backgroundColor: colors.card }]}>
              <View style={styles.requestHeader}>
                <Image 
                  source={{ uri: request.avatar }} 
                  style={styles.requestAvatar}
                />
                <View style={styles.requestInfo}>
                  <View style={styles.requestNameRow}>
                    <Text style={[styles.requestCustomer, { color: colors.text }]}>{request.customerName}</Text>
                    <View style={[styles.distanceBadge, { backgroundColor: colors.secondary }]}>
                      <MaterialIcons name="location-on" size={12} color={darkMode ? '#9CA3AF' : '#6B7280'} />
                      <Text style={[styles.distanceText, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{request.location}</Text>
                    </View>
                  </View>
                  <View style={styles.requestServiceRow}>
                    <Text style={[styles.requestService, { color: darkMode ? '#D1D5DB' : '#374151' }]}>{request.service}</Text>
                    <View style={[styles.asapBadge, { backgroundColor: '#FEE2E2' }]}>
                      <Text style={styles.asapText}>ASAP</Text>
                    </View>
                  </View>
                  <Text style={[styles.requestTime, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{request.time}</Text>
                </View>
              </View>
              
              <Text style={[styles.requestDescription, { color: darkMode ? '#D1D5DB' : '#374151' }]}>
                {request.description}
              </Text>
              
              <View style={styles.requestFooter}>
                <View style={styles.budgetContainer}>
                  <Text style={[styles.budgetLabel, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>Budget:</Text>
                  <Text style={[styles.budgetValue, { color: colors.text }]}>{request.budget}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.viewRequestButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    const parentNav = navigation.getParent();
                    // Find the full service request data from context
                    const fullRequest = serviceRequests.find(sr => sr.id === request.id);
                    if (parentNav && fullRequest) {
                      parentNav.navigate('ServiceRequestDetail', { request: fullRequest });
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
                  <Text style={styles.viewRequestButtonText}>View Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Refer Other Contractors */}
      <View style={styles.section}>
        <View style={[styles.referCard, { backgroundColor: colors.card }]}>
          <View style={styles.referContent}>
            <View style={[styles.referIconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
              <MaterialIcons name="people" size={32} color={colors.primary} />
            </View>
            <View style={styles.referTextContainer}>
              <Text style={[styles.referTitle, { color: colors.text }]}>Refer other contractors</Text>
              <Text style={[styles.referSubtitle, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>Help fellow contractors join the platform</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.referButton, { backgroundColor: colors.primary }]}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Messages</Text>
          <TouchableOpacity onPress={() => {
            const parentNav = navigation.getParent();
            // Navigate to first conversation or show a message list
            if (parentNav && recentMessages.length > 0) {
              parentNav.navigate('Messaging', {
                conversationId: recentMessages[0].id,
                customerName: recentMessages[0].customerName,
                serviceDetails: recentMessages[0].serviceDetails
              });
            }
          }}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>
        
        {recentMessages.length > 0 ? (
          recentMessages.map((message: any) => (
            <TouchableOpacity 
              key={message.id} 
              style={[styles.messageContainer, { backgroundColor: colors.card }]}
              onPress={() => {
                const parentNav = navigation.getParent();
                if (parentNav) {
                  parentNav.navigate('Messaging', {
                    conversationId: message.id,
                    customerName: message.customerName,
                    serviceDetails: message.serviceDetails,
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.messageAvatarContainer}>
                <Image 
                  source={{ uri: message.avatar }} 
                  style={styles.messageAvatar}
                />
                {message.unread && (
                  <View style={styles.messageCard}>
                    <Text style={styles.unreadBadgeText}>!</Text>
                  </View>
                )}
              </View>
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text 
                    style={[
                      styles.messageCustomer,
                      { color: colors.text },
                      message.unread && { fontWeight: '600' }
                    ]}
                    numberOfLines={1}
                  >
                    {message.customerName}
                  </Text>
                  <Text style={[styles.messageTime, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>{message.time}</Text>
                </View>
                <Text 
                  style={[
                    styles.messageText,
                    { color: darkMode ? '#E5E7EB' : '#6B7280' },
                    message.unread && { fontWeight: '500', color: colors.text }
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
            <Text style={[styles.emptyStateText, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>No recent messages</Text>
            <Text style={[styles.emptyStateSubtext, { color: darkMode ? '#9CA3AF' : '#9CA3AF' }]}>Your messages will appear here</Text>
          </View>
        )}
      </View>

      {/* Your Business */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Business</Text>
        
        {/* Response Time */}
        <View style={[styles.businessCard, { backgroundColor: colors.card }]}>
          <View style={styles.businessCardHeader}>
            <MaterialIcons name="schedule" size={24} color={colors.primary} />
            <Text style={[styles.businessCardTitle, { color: colors.text }]}>Response Time</Text>
          </View>
          <Text style={[styles.businessCardValue, { color: colors.text }]}>Average 1.2 hours</Text>
          <Text style={[styles.businessCardSubtext, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>(Better than 78% of contractors)</Text>
        </View>
        
        {/* Growth Opportunity */}
        <View style={[styles.businessCard, { backgroundColor: colors.card }]}>
          <View style={styles.businessCardHeader}>
            <MaterialIcons name="trending-up" size={24} color="#10B981" />
            <Text style={[styles.businessCardTitle, { color: colors.text }]}>Growth Opportunity</Text>
          </View>
          <Text style={[styles.businessCardSubtext, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>Consider adding: Bathroom Remodeling (+40% potential revenue)</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorSchedule');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: darkMode ? '#1E3A8A' : '#E7F5FF' }]}>
              <MaterialIcons name="event" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorEarnings');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: darkMode ? '#064E3B' : '#D4EDDA' }]}>
              <MaterialIcons name="attach-money" size={24} color="#28A745" />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Earnings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('VendorClients');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: darkMode ? '#78350F' : '#FFF3CD' }]}>
              <MaterialIcons name="people" size={24} color="#FFC107" />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Clients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => {
              const parentNav = navigation.getParent();
              if (parentNav) parentNav.navigate('Profile');
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.secondary }]}>
              <MaterialIcons name="settings" size={24} color={darkMode ? '#9CA3AF' : '#6C757D'} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Settings</Text>
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
  messageContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageCard: {
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
  messageAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  viewRequestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
