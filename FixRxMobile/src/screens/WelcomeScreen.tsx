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
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';

  const handleEmailContinue = () => {
    navigation.navigate('EmailLogin');
  };

  const handleGoogleContinue = () => {
    // Google authentication to be implemented
  };

  const handleFacebookContinue = () => {
    // Facebook authentication to be implemented
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔧 fixrx</Text>
        </View>
        
        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to FixRx</Text>
          <Text style={styles.subtitle}>
            Connect with trusted contractors through your network
          </Text>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {/* Google Button */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={handleGoogleContinue}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          {/* Facebook Button */}
          <TouchableOpacity 
            style={styles.facebookButton}
            onPress={handleFacebookContinue}
            activeOpacity={0.8}
          >
            <MaterialIcons name="facebook" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
          </TouchableOpacity>
          
          {/* Email Button */}
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={handleEmailContinue}
            activeOpacity={0.8}
          >
            <MaterialIcons name="email" size={20} color="#0D6EFD" style={styles.buttonIcon} />
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          </TouchableOpacity>
        </View>
        
        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy</Text>
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
    marginBottom: 60,
  },
  logo: {
    fontSize: 32,
    fontWeight: '600',
    color: '#0D6EFD',
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
  googleButton: {
    backgroundColor: '#0D6EFD',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  facebookButton: {
    backgroundColor: '#0D6EFD',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facebookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emailButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#0D6EFD',
  },
  emailButtonText: {
    color: '#0D6EFD',
    fontSize: 16,
    fontWeight: '600',
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
