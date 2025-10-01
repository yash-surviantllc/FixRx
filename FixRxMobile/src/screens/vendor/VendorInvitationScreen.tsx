import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { MaterialIcons } from '@expo/vector-icons';

type VendorInvitationNavigationProp = StackNavigationProp<RootStackParamList, 'VendorInvitation'>;

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const VendorInvitationScreen: React.FC = () => {
  const navigation = useNavigation<VendorInvitationNavigationProp>();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const contacts: Contact[] = [
    { id: '1', name: 'Mike Johnson', phone: '(555) 123-4567' },
    { id: '2', name: 'Sarah Williams', phone: '(555) 234-5678' },
    { id: '3', name: 'David Brown', phone: '(555) 345-6789' },
    { id: '4', name: 'Lisa Anderson', phone: '(555) 456-7890' },
    { id: '5', name: 'Robert Wilson', phone: '(555) 567-8901' },
  ];

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSendInvites = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('No Contacts Selected', 'Please select at least one contact to invite');
      return;
    }

    const selectedNames = contacts
      .filter(c => selectedContacts.includes(c.id))
      .map(c => c.name)
      .join(', ');

    Alert.alert(
      'Invitations Sent!',
      `Invitations sent to: ${selectedNames}`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]
    );
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Invite Service Providers</Text>
        <Text style={styles.subtitle}>
          Know other contractors or service providers? Invite them to join FixRx!
        </Text>
      </View>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <MaterialIcons name="people" size={32} color="#0D6EFD" />
          <Text style={styles.statValue}>{selectedContacts.length}</Text>
          <Text style={styles.statLabel}>Selected</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons name="card-giftcard" size={32} color="#28A745" />
          <Text style={styles.statValue}>$50</Text>
          <Text style={styles.statLabel}>Referral Bonus</Text>
        </View>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <MaterialIcons name="info" size={20} color="#0D6EFD" />
        <Text style={styles.infoText}>
          Earn $50 for each service provider who joins and completes their first job!
        </Text>
      </View>

      {/* Contacts List */}
      <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Select Contacts</Text>
        {contacts.map(contact => {
          const isSelected = selectedContacts.includes(contact.id);
          return (
            <TouchableOpacity
              key={contact.id}
              style={[styles.contactCard, isSelected && styles.contactCardSelected]}
              onPress={() => toggleContact(contact.id)}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <View style={[styles.contactAvatar, isSelected && styles.contactAvatarSelected]}>
                  <Text style={[styles.contactAvatarText, isSelected && styles.contactAvatarTextSelected]}>
                    {contact.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <MaterialIcons name="check" size={18} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSendInvites}
          disabled={selectedContacts.length === 0}
          activeOpacity={0.8}
        >
          <MaterialIcons name="send" size={20} color="#FFFFFF" />
          <Text style={styles.buttonPrimaryText}>
            Send Invites ({selectedContacts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonSecondaryText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E9ECEF',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E7F5FF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0D6EFD',
    marginLeft: 8,
    lineHeight: 18,
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  contactCardSelected: {
    borderColor: '#0D6EFD',
    backgroundColor: '#F0F7FF',
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarSelected: {
    backgroundColor: '#0D6EFD',
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6C757D',
  },
  contactAvatarTextSelected: {
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: '#6C757D',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ADB5BD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#0D6EFD',
    borderColor: '#0D6EFD',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonPrimary: {
    backgroundColor: '#0D6EFD',
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
  },
  buttonSecondaryText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VendorInvitationScreen;
