import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Switch,
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons, MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { userProfile, setUserProfile, logout } = useAppContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock data for user stats
  const userStats = [
    { label: 'Bookings', value: '12' },
    { label: 'Reviews', value: '8', rating: '4.8' },
    { label: 'Saved', value: '5' },
  ];

  const menuItems = [
    {
      id: 'account',
      title: 'Account',
      icon: <MaterialIcons name="person-outline" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('EditProfile' as never),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Ionicons name="notifications-outline" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('NotificationSettings' as never),
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#E5E7EB', true: '#D1E0FF' }}
          thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
        />
      ),
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Ionicons name="moon-outline" size={24} color="#6B7280" />,
      rightComponent: (
        <View style={styles.themeSwitchContainer}>
          <Ionicons 
            name="sunny-outline" 
            size={20} 
            color={!darkMode ? '#3B82F6' : '#9CA3AF'} 
          />
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#E5E7EB', true: '#D1E0FF' }}
            thumbColor={darkMode ? '#3B82F6' : '#9CA3AF'}
            style={styles.themeSwitch}
          />
          <Ionicons 
            name="moon" 
            size={18} 
            color={darkMode ? '#3B82F6' : '#9CA3AF'} 
          />
        </View>
      ),
    },
    {
      id: 'payment',
      title: 'Payment Methods',
      icon: <MaterialIcons name="payment" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('PaymentMethods' as never),
    },
    {
      id: 'security',
      title: 'Security',
      icon: <MaterialIcons name="security" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('SecuritySettings' as never),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: <MaterialIcons name="help-outline" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('HelpCenter' as never),
    },
    {
      id: 'about',
      icon: <MaterialIcons name="info-outline" size={24} color="#6B7280" />,
      onPress: () => navigation.navigate('AboutUs' as never),
    },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: () => {
            logout();
            navigation.navigate('Welcome' as never);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-3" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: userProfile?.profileImage || 'https://via.placeholder.com/100' }} 
              style={styles.avatar}
              defaultSource={{ uri: 'https://via.placeholder.com/100' }}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <MaterialIcons name="camera-alt" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>
            {userProfile?.firstName} {userProfile?.lastName}
          </Text>
          
          {userProfile?.businessName && (
            <Text style={styles.businessName}>
              {userProfile.businessName}
            </Text>
          )}
          
          <Text style={styles.userEmail}>
            {userProfile?.email}
          </Text>
          
          <View style={styles.statsContainer}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>
                  {stat.value}
                  {stat.rating && <Text style={styles.ratingText}>★</Text>}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              disabled={!item.onPress}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={styles.menuText}>{item.title}</Text>
              {item.rightComponent ? (
                item.rightComponent
              ) : (
                <MaterialIcons 
                  name="keyboard-arrow-right" 
                  size={24} 
                  color="#9CA3AF" 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            FixRx App v1.0.0
          </Text>
          <Text style={styles.copyrightText}>
            © 2023 FixRx. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingText: {
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSwitch: {
    marginHorizontal: 6,
    transform: Platform.OS === 'ios' ? [] : [{ scale: 0.8 }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});

export default ProfileScreen;
