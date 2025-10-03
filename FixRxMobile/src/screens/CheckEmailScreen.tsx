import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';

type CheckEmailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckEmail'>;

const CheckEmailScreen: React.FC = () => {
  const navigation = useNavigation<CheckEmailScreenNavigationProp>();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';
  const { setUserEmail } = useAppContext();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const handleDemoLink = () => {
    // Simulate email verification and set email in context
    console.log('Demo link clicked, setting email in context:', email);
    setUserEmail(email);
    navigation.navigate('UserType');
  };

  const handleResend = () => {
    // Resend email logic
  };

  const handleDifferentEmail = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="check-circle" size={64} color="#10B981" />
        </View>

        <Text style={styles.title}>Check your email</Text>
        
        <Text style={styles.description}>
          We sent a login link to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Text style={styles.instruction}>
          Click the link to continue to FixRx
        </Text>

        <TouchableOpacity 
          style={styles.demoLink}
          onPress={handleDemoLink}
          activeOpacity={0.7}
        >
          <Text style={styles.demoLinkText}>(Demo: Simulate email verified)</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>Links typically arrive within 30 seconds</Text>

        <TouchableOpacity 
          style={styles.resendButton}
          onPress={handleResend}
          activeOpacity={0.7}
        >
          <Text style={styles.resendButtonText}>Didn't get it? Send again</Text>
        </TouchableOpacity>

        <View style={styles.quickAccess}>
          <Text style={styles.quickAccessTitle}>Quick access:</Text>
          <View style={styles.emailApps}>
            <TouchableOpacity 
              style={styles.emailApp}
              onPress={() => Linking.openURL('mailto:')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="email" size={32} color="#EA4335" />
              <Text style={styles.emailAppText}>Gmail</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.emailApp}
              onPress={() => Linking.openURL('mailto:')}
              activeOpacity={0.7}
            >
              <MaterialIcons name="mail" size={32} color="#0078D4" />
              <Text style={styles.emailAppText}>Mail</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.differentEmailButton}
          onPress={handleDifferentEmail}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={16} color="#6B7280" />
          <Text style={styles.differentEmailText}>Use different email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 16,
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  email: {
    fontWeight: '600',
    color: '#1F2937',
  },
  instruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  demoLink: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  demoLinkText: {
    fontSize: 14,
    color: '#0D6EFD',
    textDecorationLine: 'underline',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  resendButton: {
    paddingVertical: 12,
    marginBottom: 40,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#0D6EFD',
    fontWeight: '500',
  },
  quickAccess: {
    alignItems: 'center',
    marginBottom: 40,
  },
  quickAccessTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  emailApps: {
    flexDirection: 'row',
    gap: 32,
  },
  emailApp: {
    alignItems: 'center',
  },
  emailAppText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  differentEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  differentEmailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
});

export default CheckEmailScreen;
