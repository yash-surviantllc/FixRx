import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';

type PortfolioUploadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const VendorPortfolioUploadScreen: React.FC = () => {
  const navigation = useNavigation<PortfolioUploadScreenNavigationProp>();
  const { userProfile, setUserProfile } = useAppContext();
  
  const [portfolioItems, setPortfolioItems] = useState<Array<{ id: string; uri: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newItem = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
        };
        setPortfolioItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    if (portfolioItems.length === 0) {
      Alert.alert('Portfolio Required', 'Please add at least one image to your portfolio');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the images to your backend here
      console.log('Uploading portfolio items:', portfolioItems);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile in context
      setUserProfile({
        ...userProfile,
        portfolio: portfolioItems,
        onboardingComplete: true,
      } as any);
      
      // Navigate to the main app
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      Alert.alert('Error', 'Failed to upload portfolio. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPortfolioItem = ({ item }: { item: { id: string; uri: string } }) => (
    <View style={styles.portfolioItem}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.portfolioImage}
        resizeMode="cover"
      />
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeImage(item.id)}
      >
        <MaterialIcons name="close" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }] 
            }
          ]}
        >
          <Text style={styles.title}>Your Portfolio</Text>
          <Text style={styles.subtitle}>Showcase your best work to attract more clients</Text>
          
          <View style={styles.portfolioContainer}>
            <Text style={styles.sectionTitle}>Add Photos of Your Work</Text>
            <Text style={styles.instruction}>
              Upload high-quality images that showcase your expertise and previous projects.
              You can add up to 10 photos.
            </Text>
            
            {portfolioItems.length > 0 ? (
              <FlatList
                data={portfolioItems}
                renderItem={renderPortfolioItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.portfolioGrid}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="photo-library" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No photos added yet</Text>
                <Text style={styles.emptyStateSubtext}>Add photos to showcase your work</Text>
              </View>
            )}
            
            {portfolioItems.length < 10 && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={pickImage}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add-a-photo" size={24} color="#3B82F6" />
                <Text style={styles.addButtonText}>
                  {portfolioItems.length > 0 ? 'Add More Photos' : 'Add Photos'}
                </Text>
                <Text style={styles.addButtonSubtext}>
                  {portfolioItems.length}/10 photos added
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (portfolioItems.length === 0 || isUploading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={portfolioItems.length === 0 || isUploading}
            activeOpacity={0.8}
          >
            {isUploading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            disabled={isUploading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
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
  portfolioContainer: {
    flex: 1,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  portfolioGrid: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  portfolioItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  addButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  addButtonSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VendorPortfolioUploadScreen;
