import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type UserTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserType'>;

const UserTypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<UserTypeScreenNavigationProp>();
  const { setUserType, userEmail } = useAppContext();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';
  const [selectedType, setSelectedType] = useState<'consumer' | 'vendor' | null>(null);

  console.log('UserTypeSelectionScreen rendered with theme:', theme, 'colors:', colors, 'userEmail:', userEmail);

  const handleUserTypeSelect = (type: 'consumer' | 'vendor') => {
    console.log('User selected type:', type);
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    
    console.log('Continue pressed with selectedType:', selectedType, 'userEmail:', userEmail);
    setUserType(selectedType);
    
    if (selectedType === 'consumer') {
      (navigation as any).navigate('ConsumerProfile');
    } else {
      (navigation as any).navigate('VendorProfileSetup', { email: userEmail });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.paginationDot, { backgroundColor: colors.primary }]} />
          <View style={[styles.paginationDot, { backgroundColor: darkMode ? '#374151' : '#D1D5DB' }]} />
        </View>
        
        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>How will you use FixRx?</Text>
        <Text style={[styles.subtitle, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>Choose the option that best describes you</Text>
        
        {/* Option Cards */}
        <View style={styles.optionsContainer}>
          {/* I need services card */}
          <TouchableOpacity 
            style={[
              styles.optionCard, 
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedType === 'consumer' && { borderColor: colors.primary, borderWidth: 2 }
            ]}
            onPress={() => handleUserTypeSelect('consumer')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="home-outline" size={32} color={selectedType === 'consumer' ? colors.primary : '#6B7280'} />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>I need services</Text>
            <Text style={[styles.optionDescription, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Find trusted contractors through friends
            </Text>
            {selectedType === 'consumer' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
          
          {/* I provide services card */}
          <TouchableOpacity 
            style={[
              styles.optionCard, 
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedType === 'vendor' && { borderColor: '#F97316', borderWidth: 2 }
            ]}
            onPress={() => handleUserTypeSelect('vendor')}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="hammer-outline" size={32} color={selectedType === 'vendor' ? '#F97316' : '#6B7280'} />
            </View>
            <Text style={[styles.optionTitle, { color: colors.text }]}>I provide services</Text>
            <Text style={[styles.optionDescription, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Connect with homeowners who need help
            </Text>
            {selectedType === 'vendor' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#F97316" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        {selectedType && (
          <TouchableOpacity 
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  paginationDotActive: {
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 50,
  },
  optionsContainer: {
    flex: 1,
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 32,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserTypeSelectionScreen;
