import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userProfile, setUserProfile } = useAppContext();
  const { colors, theme } = useTheme();
  const darkMode = theme === 'dark';

  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [businessName, setBusinessName] = useState(userProfile?.businessName || '');
  const [bio, setBio] = useState((userProfile as any)?.bio || '');
  const [profileImage, setProfileImage] = useState(userProfile?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Required Fields', 'Please enter your first and last name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile in context
      const updatedProfile = {
        ...userProfile,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        bio: bio.trim(),
        profileImage,
      };

      setUserProfile(updatedProfile as any);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image 
              source={{ uri: profileImage || 'https://via.placeholder.com/150' }} 
              style={styles.profileImage}
            />
            <View style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="camera-alt" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.changePhotoText, { color: colors.primary }]}>
            Change Photo
          </Text>
        </View>

        {/* Form Fields */}
        <View style={[styles.formSection, { backgroundColor: colors.card }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              First Name *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Last Name *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Email *
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Phone
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
              keyboardType="phone-pad"
            />
          </View>

          {(userProfile as any)?.userType === 'vendor' && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
                Business Name
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Enter business name"
                placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: darkMode ? '#9CA3AF' : '#6B7280' }]}>
              Bio
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: darkMode ? '#1F2937' : '#F3F4F6',
                color: colors.text,
                borderColor: colors.border 
              }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Delete Account */}
        <TouchableOpacity 
          style={[styles.deleteButton, { borderColor: '#EF4444' }]}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                  // Handle account deletion
                  Alert.alert('Account Deleted', 'Your account has been deleted.');
                }}
              ]
            );
          }}
        >
          <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default EditProfileScreen;
