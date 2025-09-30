import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import MetroAreaDropdown from '../../components/MetroAreaDropdown';

type VendorProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VendorProfileSetup'>;

const VendorProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<VendorProfileScreenNavigationProp>();
  const { userProfile, setUserProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : '',
    phone: userProfile?.phone || '',
    businessAddress: '',
    metroArea: userProfile?.metroArea || '',
    yearsInBusiness: '',
    about: '',
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.businessName || !formData.ownerName || !formData.phone) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update user profile in context
      setUserProfile({
        ...userProfile,
        ...formData,
        userType: 'vendor' as const,
        profileImage: profileImage || undefined,
      } as any);
      
      // In a real app, you would upload the image to your backend
      console.log('Saving vendor profile:', { ...formData, profileImage });
      
      // Navigate to the next screen
      navigation.navigate('VendorServiceSelection');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }] 
            }
          ]}
        >
          <Text style={styles.title}>Business Profile</Text>
          <Text style={styles.subtitle}>Set up your professional profile</Text>
          
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity 
                style={styles.avatarPlaceholder}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>Add Logo</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.avatarLabel}>Business Logo</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.businessName}
                onChangeText={(text) => handleInputChange('businessName', text)}
                placeholder="Your Business Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Owner's Full Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.ownerName}
                onChangeText={(text) => handleInputChange('ownerName', text)}
                placeholder="Your Name"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="(123) 456-7890"
                placeholderTextColor="9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Address</Text>
              <TextInput
                style={styles.input}
                value={formData.businessAddress}
                onChangeText={(text) => handleInputChange('businessAddress', text)}
                placeholder="123 Business St, City, State ZIP"
                placeholderTextColor="9CA3AF"
              />
            </View>
            
            <MetroAreaDropdown
              value={formData.metroArea}
              onSelect={(value) => handleInputChange('metroArea', value)}
              label="Service Area"
              required
              placeholder="Select your metropolitan area"
            />
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Years in Business</Text>
              <TextInput
                style={styles.input}
                value={formData.yearsInBusiness}
                onChangeText={(text) => handleInputChange('yearsInBusiness', text)}
                placeholder="e.g., 5"
                placeholderTextColor="9CA3AF"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>About Your Business</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.about}
                onChangeText={(text) => handleInputChange('about', text)}
                placeholder="Tell us about your business, experience, and what makes you unique..."
                placeholderTextColor="9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                (!formData.businessName || !formData.ownerName || !formData.phone) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!formData.businessName || !formData.ownerName || !formData.phone || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Saving...' : 'Continue to Services'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  avatarLabel: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VendorProfileSetupScreen;
