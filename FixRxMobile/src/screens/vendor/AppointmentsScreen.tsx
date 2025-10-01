import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  address: string;
  phone: string;
}

const AppointmentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<AppointmentStatus>('upcoming');

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const allAppointments: Appointment[] = [
    // Upcoming appointments
    {
      id: '1',
      customerName: 'John Smith',
      service: 'AC Repair',
      date: 'Today',
      time: '2:00 PM - 4:00 PM',
      status: 'confirmed',
      amount: 120,
      address: '123 Main St, Apt 4B',
      phone: '(555) 123-4567',
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      service: 'AC Maintenance',
      date: 'Tomorrow',
      time: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      amount: 89,
      address: '456 Oak Ave',
      phone: '(555) 987-6543',
    },
    {
      id: '3',
      customerName: 'Michael Brown',
      service: 'Plumbing Repair',
      date: 'Dec 25',
      time: '3:00 PM - 5:00 PM',
      status: 'pending',
      amount: 150,
      address: '789 Pine Rd',
      phone: '(555) 456-7890',
    },
    // Completed appointments
    {
      id: '4',
      customerName: 'Emily Davis',
      service: 'Kitchen Sink Repair',
      date: 'Dec 15',
      time: '9:00 AM - 11:00 AM',
      status: 'completed',
      amount: 285,
      address: '321 Elm St',
      phone: '(555) 234-5678',
    },
    {
      id: '5',
      customerName: 'David Wilson',
      service: 'HVAC Service',
      date: 'Dec 10',
      time: '1:00 PM - 4:00 PM',
      status: 'completed',
      amount: 350,
      address: '654 Maple Dr',
      phone: '(555) 345-6789',
    },
    {
      id: '6',
      customerName: 'Lisa Anderson',
      service: 'Bathroom Plumbing',
      date: 'Dec 8',
      time: '10:00 AM - 12:00 PM',
      status: 'completed',
      amount: 425,
      address: '987 Oak Ln',
      phone: '(555) 456-7891',
    },
    // Cancelled appointments
    {
      id: '7',
      customerName: 'Robert Taylor',
      service: 'AC Repair',
      date: 'Dec 12',
      time: '2:00 PM - 4:00 PM',
      status: 'cancelled',
      amount: 120,
      address: '147 Pine Ave',
      phone: '(555) 567-8901',
    },
    {
      id: '8',
      customerName: 'Jennifer Martinez',
      service: 'Electrical Inspection',
      date: 'Dec 5',
      time: '11:00 AM - 1:00 PM',
      status: 'cancelled',
      amount: 95,
      address: '258 Cedar Rd',
      phone: '(555) 678-9012',
    },
  ];

  // Filter appointments based on selected tab - memoized
  const appointments = useMemo(() => {
    return allAppointments.filter(apt => {
      if (selectedFilter === 'upcoming') {
        return apt.status === 'confirmed' || apt.status === 'pending';
      } else if (selectedFilter === 'completed') {
        return apt.status === 'completed';
      } else if (selectedFilter === 'cancelled') {
        return apt.status === 'cancelled';
      }
      return true;
    });
  }, [selectedFilter]);

  const filters = [
    { 
      key: 'upcoming' as AppointmentStatus, 
      label: 'Upcoming', 
      count: allAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'pending').length 
    },
    { 
      key: 'completed' as AppointmentStatus, 
      label: 'Completed', 
      count: allAppointments.filter(apt => apt.status === 'completed').length 
    },
    { 
      key: 'cancelled' as AppointmentStatus, 
      label: 'Cancelled', 
      count: allAppointments.filter(apt => apt.status === 'cancelled').length 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#D4EDDA', text: '#155724' };
      case 'pending':
        return { bg: '#FFF3CD', text: '#856404' };
      case 'completed':
        return { bg: '#D1ECF1', text: '#0C5460' };
      case 'cancelled':
        return { bg: '#F8D7DA', text: '#721C24' };
      default:
        return { bg: '#E9ECEF', text: '#495057' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color="#212529" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
            <View
              style={[
                styles.filterBadge,
                selectedFilter === filter.key && styles.filterBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  selectedFilter === filter.key && styles.filterBadgeTextActive,
                ]}
              >
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointments List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {appointments.map((appointment) => {
          const statusColors = getStatusColor(appointment.status);
          
          return (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              {/* Status Indicator */}
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: statusColors.text },
                ]}
              />

              <View style={styles.cardContent}>
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.customerInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {appointment.customerName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.customerDetails}>
                      <Text style={styles.customerName}>{appointment.customerName}</Text>
                      <Text style={styles.service}>{appointment.service}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors.bg },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={16} color="#6C757D" />
                    <Text style={styles.detailText}>
                      {appointment.date} • {appointment.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="location-on" size={16} color="#6C757D" />
                    <Text style={styles.detailText}>{appointment.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="phone" size={16} color="#6C757D" />
                    <Text style={styles.detailText}>{appointment.phone}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>${appointment.amount}</Text>
                  <View style={styles.actions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => {
                        navigation.navigate('Messaging' as never, {
                          conversationId: appointment.id,
                          customerName: appointment.customerName,
                          serviceDetails: {
                            service: appointment.service,
                            date: appointment.date,
                            time: appointment.time,
                            status: appointment.status,
                            amount: appointment.amount,
                          },
                        } as never);
                      }}
                    >
                      <MaterialIcons name="message" size={18} color="#0D6EFD" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => Alert.alert('Call', `Call ${appointment.phone}`)}
                    >
                      <MaterialIcons name="call" size={18} color="#0D6EFD" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => {
                        navigation.navigate('Messaging' as never, {
                          conversationId: appointment.id,
                          customerName: appointment.customerName,
                          serviceDetails: {
                            service: appointment.service,
                            date: appointment.date,
                            time: appointment.time,
                            status: appointment.status,
                            amount: appointment.amount,
                          },
                        } as never);
                      }}
                    >
                      <Text style={styles.primaryButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  filterTabActive: {
    backgroundColor: '#0D6EFD',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
    marginRight: 6,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  filterBadgeTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  statusIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    padding: 16,
    paddingLeft: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D6EFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  service: {
    fontSize: 14,
    color: '#6C757D',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#0D6EFD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default AppointmentsScreen;
