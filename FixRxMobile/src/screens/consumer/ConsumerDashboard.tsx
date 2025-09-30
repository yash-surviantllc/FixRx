import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';

type ConsumerDashboardNavigationProp = StackNavigationProp<RootStackParamList, 'ConsumerDashboard'>;

const ConsumerDashboard: React.FC = () => {
  const navigation = useNavigation<ConsumerDashboardNavigationProp>();
  const { userProfile } = useAppContext();

  // Mock data for recommended contractors
  const recommendedContractors = [
    { id: '1', name: 'Elite Plumbing', rating: 4.8, category: 'Plumbing', image: 'https://example.com/plumber.jpg' },
    { id: '2', name: 'Bright Electric', rating: 4.9, category: 'Electrical', image: 'https://example.com/electrician.jpg' },
    { id: '3', name: 'Cool Breeze HVAC', rating: 4.7, category: 'HVAC', image: 'https://example.com/hvac.jpg' },
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: '1', type: 'booking', title: 'Appointment Confirmed', description: 'Your appointment with Elite Plumbing is confirmed for tomorrow at 2 PM', time: '2 hours ago' },
    { id: '2', type: 'message', title: 'New Message', description: 'You have a new message from Bright Electric', time: '5 hours ago' },
    { id: '3', type: 'reminder', title: 'Upcoming Service', description: 'Your AC maintenance with Cool Breeze is scheduled in 3 days', time: '1 day ago' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userProfile?.firstName || 'there'}</Text>
          <Text style={styles.subtitle}>What would you like to do today?</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={{ uri: userProfile?.profileImage || 'https://via.placeholder.com/50' }} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={[styles.actionEmoji, { color: '#1976D2' }]}>🔍</Text>
            </View>
            <Text style={styles.actionText}>Find a Pro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.actionEmoji, { color: '#388E3C' }]}>💬</Text>
            </View>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.actionEmoji, { color: '#F57C00' }]}>📅</Text>
            </View>
            <Text style={styles.actionText}>Bookings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommended Contractors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contractorsList}
        >
          {recommendedContractors.map(contractor => (
            <TouchableOpacity 
              key={contractor.id} 
              style={styles.contractorCard}
              onPress={() => navigation.navigate('ServiceRequestDetail', { requestId: contractor.id })}
            >
              <Image 
                source={{ uri: contractor.image }} 
                style={styles.contractorImage}
                defaultSource={{ uri: 'https://via.placeholder.com/100' }}
              />
              <Text style={styles.contractorName} numberOfLines={1}>{contractor.name}</Text>
              <Text style={styles.contractorCategory}>{contractor.category}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>★ {contractor.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityList}>
          {recentActivity.map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityItem}
              onPress={() => {
                if (activity.type === 'message') {
                  navigation.navigate('Messages', { conversationId: '1' });
                } else if (activity.type === 'booking') {
                  // Navigate to bookings
                }
              }}
            >
              <View style={styles.activityIcon}>
                {activity.type === 'message' && <Text>💬</Text>}
                {activity.type === 'booking' && <Text>✅</Text>}
                {activity.type === 'reminder' && <Text>⏰</Text>}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription} numberOfLines={1}>
                  {activity.description}
                </Text>
              </View>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Promo Banner */}
      <TouchableOpacity style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Get 20% Off</Text>
          <Text style={styles.promoDescription}>On your first booking with a new pro</Text>
          <Text style={styles.promoCode}>Use code: WELCOME20</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
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
  section: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: '#495057',
    textAlign: 'center',
  },
  contractorsList: {
    paddingBottom: 8,
  },
  contractorCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  contractorImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F1F3F5',
  },
  contractorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginTop: 8,
    marginHorizontal: 12,
  },
  contractorCategory: {
    fontSize: 12,
    color: '#6C757D',
    marginHorizontal: 12,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    marginHorizontal: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFC107',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6C757D',
  },
  activityTime: {
    fontSize: 10,
    color: '#ADB5BD',
    marginLeft: 8,
  },
  promoBanner: {
    margin: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  promoContent: {
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
    textAlign: 'center',
  },
  promoCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6EFD',
    backgroundColor: '#E7F1FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

export default ConsumerDashboard;
