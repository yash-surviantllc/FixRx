import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type MessagingScreenRouteProp = RouteProp<RootStackParamList, 'Messaging'>;

interface Message {
  id: string;
  text?: string;
  sender: 'me' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'quote' | 'appointment' | 'image';
  quote?: {
    amount: number;
    description: string;
  };
  appointment?: {
    date: string;
    time: string;
    service: string;
  };
  image?: string;
}

interface ServiceDetails {
  service: string;
  date: string;
  time: string;
  status: string;
  amount?: number;
}

const MessagingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<MessagingScreenRouteProp>();
  const { conversationId, customerName, serviceDetails } = route.params || {};
  
  // Determine message flow based on service status
  const getMessagesForStatus = () => {
    const status = serviceDetails?.status?.toLowerCase();
    
    // For new/pending requests - only show customer's initial message
    if (status === 'pending' || !status) {
      return [
        {
          id: '1',
          text: serviceDetails?.service === 'HVAC Service' 
            ? 'Hi! My AC stopped working. Can you help?' 
            : 'Hi! I need help with my kitchen sink. It\'s been leaking for a few days.',
          sender: 'other' as const,
          timestamp: new Date(Date.now() - 3600000),
          status: 'read' as const,
          type: 'text' as const,
        },
        {
          id: '2',
          sender: 'other' as const,
          timestamp: new Date(Date.now() - 3500000),
          status: 'read' as const,
          type: 'image' as const,
          image: serviceDetails?.service === 'HVAC Service'
            ? 'https://images.unsplash.com/photo-1631545806609-4c036b0d2e0e?w=400'
            : 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
          text: serviceDetails?.service === 'HVAC Service' 
            ? 'AC unit not cooling at all' 
            : 'Here\'s the leak under the sink',
        },
      ];
    }

    // For quoted/scheduled/completed - show full conversation
    const baseMessages = [
      {
        id: '1',
        text: serviceDetails?.service === 'HVAC Service' 
          ? 'Hi! My AC stopped working. Can you help?' 
          : 'Hi! I need help with my kitchen sink. It\'s been leaking for a few days.',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 7200000),
        status: 'read' as const,
        type: 'text' as const,
      },
      {
        id: '2',
        text: 'Hello! I can definitely help with that. Can you send me a photo of the issue?',
        sender: 'me' as const,
        timestamp: new Date(Date.now() - 6900000),
        status: 'read' as const,
        type: 'text' as const,
      },
      {
        id: '3',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 6600000),
        status: 'read' as const,
        type: 'image' as const,
        image: serviceDetails?.service === 'HVAC Service'
          ? 'https://images.unsplash.com/photo-1631545806609-4c036b0d2e0e?w=400'
          : 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
        text: serviceDetails?.service === 'HVAC Service' 
          ? 'AC unit not cooling at all' 
          : 'Here\'s the leak under the sink',
      },
      {
        id: '4',
        text: 'I can fix this. Let me send you a quote.',
        sender: 'me' as const,
        timestamp: new Date(Date.now() - 6300000),
        status: 'read' as const,
        type: 'text' as const,
      },
      {
        id: '5',
        sender: 'me' as const,
        timestamp: new Date(Date.now() - 6000000),
        status: 'read' as const,
        type: 'quote' as const,
        quote: {
          amount: serviceDetails?.amount || 285,
          description: serviceDetails?.service || 'Kitchen sink leak repair + pipe replacement',
        },
      },
      {
        id: '6',
        text: 'Perfect! When can you come?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 5400000),
        status: 'read' as const,
        type: 'text' as const,
      },
      {
        id: '7',
        sender: 'me' as const,
        timestamp: new Date(Date.now() - 4800000),
        status: 'read' as const,
        type: 'appointment' as const,
        appointment: {
          date: serviceDetails?.date || 'Tomorrow, Sep 16',
          time: serviceDetails?.time || '2:00 PM - 4:00 PM',
          service: serviceDetails?.service || 'Kitchen Sink Repair',
        },
      },
      {
        id: '8',
        text: 'Great! See you then',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 4200000),
        status: 'read' as const,
        type: 'text' as const,
      },
    ];

    // Add appointment messages if scheduled or completed
    if (status === 'scheduled' || status === 'confirmed' || status === 'completed') {
      baseMessages.push(
        {
          id: '6',
          text: 'Perfect! When can you come?',
          sender: 'other' as const,
          timestamp: new Date(Date.now() - 5400000),
          status: 'read' as const,
          type: 'text' as const,
        },
        {
          id: '7',
          sender: 'me' as const,
          timestamp: new Date(Date.now() - 4800000),
          status: 'read' as const,
          type: 'appointment' as const,
          appointment: {
            date: serviceDetails?.date || 'Tomorrow, Sep 16',
            time: serviceDetails?.time || '2:00 PM - 4:00 PM',
            service: serviceDetails?.service || 'Kitchen Sink Repair',
          },
        },
        {
          id: '8',
          text: 'Great! See you then',
          sender: 'other' as const,
          timestamp: new Date(Date.now() - 4200000),
          status: 'read' as const,
          type: 'text' as const,
        }
      );
    }

    // Only add completion photos if status is 'completed'
    if (status === 'completed') {
      baseMessages.push(
        {
          id: '9',
          sender: 'me' as const,
          timestamp: new Date(Date.now() - 1800000),
          status: 'read' as const,
          type: 'image' as const,
          image: serviceDetails?.service === 'HVAC Service'
            ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
            : 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
          text: 'All done! Work completed successfully',
        },
        {
          id: '10',
          sender: 'me' as const,
          timestamp: new Date(Date.now() - 1200000),
          status: 'read' as const,
          type: 'image' as const,
          image: serviceDetails?.service === 'HVAC Service'
            ? 'https://images.unsplash.com/photo-1635274831481-c3a7e2a0c3f5?w=400'
            : 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
          text: 'Everything working perfectly now',
        }
      );
    }

    return baseMessages;
  };

  const initialMessages = useMemo(() => getMessagesForStatus(), [serviceDetails?.status, serviceDetails?.service]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const userName = useMemo(() => customerName || 'John Smith', [customerName]);
  const userImage = useMemo(() => 'https://randomuser.me/api/portraits/men/1.jpg', []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSend = useCallback(() => {
    if (inputText.trim().length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date(),
      status: 'sent',
      type: 'text',
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 1000);
  }, [inputText]);
  
  const formatTime = useCallback((date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }, []);
  
  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    
    // Render Quote Card
    if (item.type === 'quote' && item.quote) {
      return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <MaterialIcons name="description" size={20} color="#0D6EFD" />
              <Text style={styles.quoteTitle}>Quote</Text>
            </View>
            <Text style={styles.quoteAmount}>${item.quote.amount}</Text>
            <Text style={styles.quoteDescription}>{item.quote.description}</Text>
            <TouchableOpacity style={styles.viewQuoteButton} activeOpacity={0.7}>
              <Text style={styles.viewQuoteText}>View Quote</Text>
            </TouchableOpacity>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
    
    // Render Appointment Card
    if (item.type === 'appointment' && item.appointment) {
      return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <MaterialIcons name="event" size={20} color="#0D6EFD" />
              <Text style={styles.appointmentTitle}>Appointment</Text>
            </View>
            <Text style={styles.appointmentDate}>{item.appointment.date}</Text>
            <Text style={styles.appointmentTime}>{item.appointment.time}</Text>
            <Text style={styles.appointmentService}>{item.appointment.service}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
    
    // Render Image Message
    if (item.type === 'image' && item.image) {
      return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
          <View style={styles.imageMessageContainer}>
            <Image source={{ uri: item.image }} style={styles.messageImage} />
            {item.text && <Text style={styles.imageCaption}>{item.text}</Text>}
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
    
    // Render Text Message
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                isMe ? styles.myMessageTime : styles.otherMessageTime,
              ]}
            >
              {formatTime(item.timestamp)}
            </Text>
            {isMe && item.status && (
              <MaterialIcons
                name={
                  item.status === 'read'
                    ? 'done-all'
                    : item.status === 'delivered'
                    ? 'done-all'
                    : 'done'
                }
                size={14}
                color={item.status === 'read' ? '#0D6EFD' : '#9CA3AF'}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, [formatTime]);

  const keyExtractor = useCallback((item: Message) => item.id, []);
  
  // Determine current status step
  const getStatusStep = () => {
    const status = serviceDetails?.status?.toLowerCase();
    if (status === 'pending' || !status) return 0; // No progress bar for pending
    if (status === 'completed') return 3;
    if (status === 'scheduled' || status === 'confirmed') return 2;
    return 1; // quoted
  };

  const statusStep = getStatusStep();
  const showStatusBar = statusStep > 0; // Only show if not pending

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#212529" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Image source={{ uri: userImage }} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerStatus}>
              {serviceDetails?.service || 'Service'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.headerAction}
          onPress={() => Alert.alert('Call', `Call ${userName}`)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call" size={24} color="#0D6EFD" />
        </TouchableOpacity>
      </View>

      {/* Status Progress Bar - only show if not pending */}
      {serviceDetails && showStatusBar && (
        <View style={styles.statusBar}>
          <View style={styles.statusStep}>
            <View style={[styles.statusCircle, statusStep >= 1 && styles.statusCircleActive]}>
              <MaterialIcons name="check" size={16} color="#FFFFFF" />
            </View>
            <Text style={[styles.statusLabel, statusStep >= 1 && styles.statusLabelActive]}>
              Quoted
            </Text>
          </View>
          <View style={[styles.statusLine, statusStep >= 2 && styles.statusLineActive]} />
          <View style={styles.statusStep}>
            <View style={[styles.statusCircle, statusStep >= 2 && styles.statusCircleActive]}>
              {statusStep >= 2 && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[styles.statusLabel, statusStep >= 2 && styles.statusLabelActive]}>
              Scheduled
            </Text>
          </View>
          <View style={[styles.statusLine, statusStep >= 3 && styles.statusLineActive]} />
          <View style={styles.statusStep}>
            <View style={[styles.statusCircle, statusStep >= 3 && styles.statusCircleActive]}>
              {statusStep >= 3 && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </View>
            <Text style={[styles.statusLabel, statusStep >= 3 && styles.statusLabelActive]}>
              Completed
            </Text>
          </View>
        </View>
      )}
      
      {/* Service Details Banner (if provided) */}
      {serviceDetails && (
        <View style={styles.serviceDetailsBanner}>
          <MaterialIcons name="info-outline" size={20} color="#0D6EFD" />
          <View style={styles.serviceDetailsContent}>
            <Text style={styles.serviceDetailsTitle}>
              {serviceDetails.service}
            </Text>
            <Text style={styles.serviceDetailsText}>
              {serviceDetails.date} • {serviceDetails.time} • {serviceDetails.status}
              {serviceDetails.amount && ` • $${serviceDetails.amount}`}
            </Text>
          </View>
        </View>
      )}
      
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />
      
      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => Alert.alert('Attach', 'Attach files')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="attach-file" size={24} color="#6C757D" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={inputText.trim().length === 0}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={inputText.trim().length > 0 ? '#FFFFFF' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  headerStatus: {
    fontSize: 12,
    color: '#28A745',
    marginTop: 2,
  },
  headerAction: {
    padding: 4,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statusStep: {
    alignItems: 'center',
  },
  statusCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusCircleActive: {
    backgroundColor: '#10B981',
  },
  statusLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  statusLabelActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  statusLineActive: {
    backgroundColor: '#10B981',
  },
  serviceDetailsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F5FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#B8DAFF',
  },
  serviceDetailsContent: {
    flex: 1,
    marginLeft: 12,
  },
  serviceDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginBottom: 2,
  },
  serviceDetailsText: {
    fontSize: 12,
    color: '#495057',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#0D6EFD',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#212529',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212529',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0D6EFD',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginLeft: 8,
  },
  quoteAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  quoteDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  viewQuoteButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  viewQuoteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    maxWidth: '85%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginLeft: 8,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D6EFD',
    marginBottom: 8,
  },
  appointmentService: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  imageMessageContainer: {
    maxWidth: '75%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageCaption: {
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
});

export default MessagingScreen;
