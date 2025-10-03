import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const AboutUsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';

  const iconColor = darkMode ? '#9CA3AF' : '#6B7280';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About FixRx</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.logoSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>FixRx</Text>
          <Text style={[styles.version, { color: darkMode ? '#6B7280' : '#9CA3AF' }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.description, { color: iconColor }]}>
            FixRx connects homeowners with trusted, verified contractors for all their home service needs. 
            From plumbing to electrical work, we make finding and booking reliable professionals simple and secure.
          </Text>
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
          <Text style={[styles.sectionText, { color: iconColor }]}>
            To revolutionize home services by creating a transparent, trustworthy platform that empowers 
            homeowners and contractors alike.
          </Text>
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="description" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Terms of Service</Text>
            <MaterialIcons name="chevron-right" size={24} color={darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="privacy-tip" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color={darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <MaterialIcons name="gavel" size={24} color={colors.primary} />
            <Text style={[styles.linkText, { color: colors.text }]}>Licenses</Text>
            <MaterialIcons name="chevron-right" size={24} color={darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: iconColor }]}>© 2025 FixRx. All rights reserved.</Text>
          <Text style={[styles.footerSubtext, { color: darkMode ? '#6B7280' : '#9CA3AF' }]}>Made with ❤️ for homeowners</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default AboutUsScreen;
