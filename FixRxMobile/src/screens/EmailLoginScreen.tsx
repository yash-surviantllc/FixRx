import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type EmailLoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EmailLogin'>;

const EmailLoginScreen: React.FC = () => {
  const navigation = useNavigation<EmailLoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(text));
  };

  const handleSendLink = () => {
    if (isValid) {
      navigation.navigate('CheckEmail', { email });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>What's your email?</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={validateEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {isValid && (
            <MaterialIcons name="check-circle" size={24} color="#10B981" style={styles.checkIcon} />
          )}
        </View>

        <Text style={styles.helperText}>We'll email you a secure link to sign in</Text>

        <TouchableOpacity 
          style={[styles.sendButton, !isValid && styles.sendButtonDisabled]}
          onPress={handleSendLink}
          disabled={!isValid}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>Send login link</Text>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  checkIcon: {
    marginLeft: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  sendButton: {
    backgroundColor: '#0D6EFD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmailLoginScreen;
