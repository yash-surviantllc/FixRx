import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useAppContext } from '../context/AppContext';

type UserTypeSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserTypeSelection'>;

const UserTypeSelectionScreen: React.FC = () => {
  const navigation = useNavigation<UserTypeSelectionScreenNavigationProp>();
  const route = useRoute();
  const { email } = route.params as { email: string };
  const { setUserType } = useAppContext();
  const [selectedType, setSelectedType] = useState<'customer' | 'vendor' | null>(null);

  const handleContinue = useCallback(() => {
    if (!selectedType) return;
    
    if (selectedType === 'vendor') {
      setUserType('vendor');
      navigation.navigate('VendorProfileSetup', { email });
    } else {
      setUserType('consumer');
      navigation.navigate('MainTabs');
    }
  }, [selectedType, setUserType, navigation, email]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How will you use FixRx?</Text>
        <Text style={styles.subtitle}>Choose the option that best describes you</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[
              styles.optionCard,
              selectedType === 'customer' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedType('customer')}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              selectedType === 'customer' && { backgroundColor: '#DBEAFE' }
            ]}>
              <MaterialIcons 
                name="home" 
                size={32} 
                color={selectedType === 'customer' ? '#0D6EFD' : '#6B7280'} 
              />
            </View>
            <Text style={[
              styles.optionTitle,
              selectedType === 'customer' && { color: '#0D6EFD' }
            ]}>
              I need services
            </Text>
            <Text style={styles.optionDescription}>
              Find trusted contractors through friends
            </Text>
            {selectedType === 'customer' && (
              <View style={styles.checkmark}>
                <MaterialIcons name="check-circle" size={24} color="#0D6EFD" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.optionCard,
              selectedType === 'vendor' && styles.optionCardSelectedVendor
            ]}
            onPress={() => setSelectedType('vendor')}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              selectedType === 'vendor' && { backgroundColor: '#FFEDD5' }
            ]}>
              <MaterialIcons 
                name="build" 
                size={32} 
                color={selectedType === 'vendor' ? '#FF6B35' : '#6B7280'} 
              />
            </View>
            <Text style={[
              styles.optionTitle,
              selectedType === 'vendor' && { color: '#FF6B35' }
            ]}>
              I provide services
            </Text>
            <Text style={styles.optionDescription}>
              Connect with homeowners who need help
            </Text>
            {selectedType === 'vendor' && (
              <View style={styles.checkmark}>
                <MaterialIcons name="check-circle" size={24} color="#FF6B35" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {selectedType && (
          <TouchableOpacity 
            style={styles.continueButton}
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
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: '#0D6EFD',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  optionCardSelected: {
    borderColor: '#0D6EFD',
    backgroundColor: '#EFF6FF',
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  optionCardSelectedVendor: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF4ED',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerSelected: {
    backgroundColor: '#DBEAFE',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  optionTitleSelected: {
    color: '#0D6EFD',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  continueButton: {
    backgroundColor: '#0D6EFD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserTypeSelectionScreen;
