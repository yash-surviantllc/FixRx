import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const HelpCenterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';

  const helpTopics = [
    { id: 1, title: 'Getting Started', icon: 'play-circle-outline' },
    { id: 2, title: 'Account & Settings', icon: 'settings' },
    { id: 3, title: 'Booking Services', icon: 'calendar-today' },
    { id: 4, title: 'Payments & Billing', icon: 'payment' },
    { id: 5, title: 'Safety & Trust', icon: 'verified-user' },
    { id: 6, title: 'Troubleshooting', icon: 'build' },
  ];

  const iconColor = darkMode ? '#9CA3AF' : '#6B7280';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: colors.secondary }]}>
            <MaterialIcons name="search" size={20} color={darkMode ? '#6B7280' : '#9CA3AF'} />
            <Text style={[styles.searchPlaceholder, { color: darkMode ? '#6B7280' : '#9CA3AF' }]}>Search for help...</Text>
          </View>
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: iconColor }]}>Browse Topics</Text>
          {helpTopics.map((topic) => (
            <TouchableOpacity key={topic.id} style={[styles.topicItem, { backgroundColor: colors.background }]}>
              <MaterialIcons name={topic.icon as any} size={24} color={colors.primary} />
              <Text style={[styles.topicText, { color: colors.text }]}>{topic.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color={darkMode ? '#6B7280' : '#9CA3AF'} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: iconColor }]}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="email" size={24} color={iconColor} />
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>Email Support</Text>
              <Text style={[styles.contactSubtitle, { color: iconColor }]}>support@fixrx.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="phone" size={24} color={iconColor} />
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>Phone Support</Text>
              <Text style={[styles.contactSubtitle, { color: iconColor }]}>1-800-FIXRX-HELP</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <MaterialIcons name="chat" size={24} color={iconColor} />
            <View style={styles.contactText}>
              <Text style={[styles.contactTitle, { color: colors.text }]}>Live Chat</Text>
              <Text style={[styles.contactSubtitle, { color: iconColor }]}>Available 24/7</Text>
            </View>
          </TouchableOpacity>
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
  searchSection: {
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    color: '#9CA3AF',
  },
  section: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  topicText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default HelpCenterScreen;
