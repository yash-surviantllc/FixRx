import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAppContext } from '../../context/AppContext';

// Mock service categories - in a real app, this would come from your backend
const SERVICE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'hvac', name: 'HVAC' },
  { id: 'cleaning', name: 'Cleaning' },
  { id: 'landscaping', name: 'Landscaping' },
  { id: 'painting', name: 'Painting' },
  { id: 'carpentry', name: 'Carpentry' },
  { id: 'appliance', name: 'Appliance Repair' },
  { id: 'handyman', name: 'Handyman Services' },
  { id: 'other', name: 'Other' },
];

type ServiceSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceSelection'>;

const VendorServiceSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ServiceSelectionScreenNavigationProp>();
  const { userProfile, setUserProfile } = useAppContext();
  
  const [selectedServices, setSelectedServices] = useState<string[]>(userProfile?.services || []);
  const [customService, setCustomService] = useState('');
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

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const addCustomService = () => {
    if (customService.trim() && !selectedServices.includes(customService.trim())) {
      setSelectedServices(prev => [...prev, customService.trim()]);
      setCustomService('');
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(id => id !== serviceId));
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      Alert.alert('Select Services', 'Please select at least one service you offer');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update user profile in context
      setUserProfile({
        ...userProfile,
        services: selectedServices,
      } as any);
      
      // In a real app, you would save this to your backend
      console.log('Saving services:', selectedServices);
      
      // Navigate to the next screen
      navigation.navigate('VendorPortfolioUpload');
    } catch (error) {
      console.error('Error saving services:', error);
      Alert.alert('Error', 'Failed to save services. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderServiceItem = ({ item }: { item: { id: string; name: string } }) => {
    const isSelected = selectedServices.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
        onPress={() => toggleService(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.serviceText, isSelected && styles.serviceTextSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
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
          <Text style={styles.title}>Your Services</Text>
          <Text style={styles.subtitle}>Select the services you offer</Text>
          
          <View style={styles.selectedServicesContainer}>
            <Text style={styles.sectionTitle}>Selected Services</Text>
            {selectedServices.length === 0 ? (
              <Text style={styles.noServicesText}>No services selected yet</Text>
            ) : (
              <View style={styles.selectedServicesList}>
                {selectedServices.map(serviceId => {
                  const service = SERVICE_CATEGORIES.find(s => s.id === serviceId) || { id: serviceId, name: serviceId };
                  return (
                    <View key={service.id} style={styles.selectedService}>
                      <Text style={styles.selectedServiceText}>{service.name}</Text>
                      <TouchableOpacity 
                        onPress={() => removeService(service.id)}
                        style={styles.removeServiceButton}
                      >
                        <Text style={styles.removeServiceText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
          
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <FlatList
              data={SERVICE_CATEGORIES}
              renderItem={renderServiceItem}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesGrid}
            />
          </View>
          
          <View style={styles.customServiceContainer}>
            <Text style={styles.sectionTitle}>Add Custom Service</Text>
            <View style={styles.customServiceInputContainer}>
              <TextInput
                style={styles.customServiceInput}
                value={customService}
                onChangeText={setCustomService}
                placeholder="Enter a service not listed"
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={addCustomService}
              />
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  (!customService.trim() || selectedServices.includes(customService.trim())) && styles.addButtonDisabled
                ]}
                onPress={addCustomService}
                disabled={!customService.trim() || selectedServices.includes(customService.trim())}
                activeOpacity={0.7}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              selectedServices.length === 0 && styles.buttonDisabled
            ]}
            onPress={handleSubmit}
            disabled={selectedServices.length === 0 || isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Saving...' : 'Continue to Portfolio'}
            </Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedServicesContainer: {
    marginBottom: 24,
  },
  noServicesText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  selectedServicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedService: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedServiceText: {
    color: '#1E40AF',
    fontSize: 14,
    marginRight: 6,
  },
  removeServiceButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeServiceText: {
    color: '#1E40AF',
    fontSize: 16,
    lineHeight: 18,
    marginTop: -1,
  },
  servicesContainer: {
    marginBottom: 24,
  },
  servicesGrid: {
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  serviceItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  serviceText: {
    color: '#4B5563',
    textAlign: 'center',
    fontSize: 14,
  },
  serviceTextSelected: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  customServiceContainer: {
    marginBottom: 24,
  },
  customServiceInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  customServiceInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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

export default VendorServiceSelectionScreen;
