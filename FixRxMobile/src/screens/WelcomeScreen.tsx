import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleEmailContinue = () => {
    navigation.navigate('EmailAuth');
  };

  const handleGoogleContinue = () => {
    // TODO: Implement Google authentication
    console.log('Continue with Google');
  };

  const handleFacebookContinue = () => {
    // TODO: Implement Facebook authentication
    console.log('Continue with Facebook');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>
        
        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to FixRx</Text>
          <Text style={styles.subtitle}>
            Connect with trusted contractors and manage your home services with ease
          </Text>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Email Button */}
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={handleEmailContinue}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          </TouchableOpacity>
          
          {/* Google Button */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleContinue}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          {/* Facebook Button */}
          <TouchableOpacity 
            style={styles.facebookButton}
            onPress={handleFacebookContinue}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-facebook" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
        
        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 340,
    marginBottom: 30,
  },
  emailButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 0,
  },
  termsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  termsText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
