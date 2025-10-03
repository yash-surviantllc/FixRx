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
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAppContext } from '../context/AppContext';

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
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';
  const { conversationId, customerName, serviceDetails } = route.params || {};
  const { addMessageToConversation } = useAppContext();
  
  // Generate conversation content based on service request data
  const getConversationContent = () => {
    const conversations = {
      'req_1': {
        service: 'Kitchen Sink Repair',
        initialMessage: 'Hi! I need help with my kitchen sink. It\'s been leaking for a few days and water is backing up.',
        image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
        imageCaption: 'Here\'s the leak under the sink',
        quote: { amount: 175, description: 'Kitchen sink repair and pipe replacement' },
      },
      'req_2': {
        service: 'Electrical Work',
        initialMessage: 'Hello! Multiple outlets in my home office stopped working. I need urgent repair.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        imageCaption: 'These outlets are not working',
        quote: { amount: 125, description: 'Electrical outlet repair and wiring inspection' },
      },
      'req_3': {
        service: 'Plumbing Repair',
        initialMessage: 'Emergency! My bathroom pipe burst and water damage is spreading rapidly. Please help ASAP!',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
        imageCaption: 'Water damage from burst pipe',
        quote: { amount: 350, description: 'Emergency plumbing repair and water damage assessment' },
      },
      'req_4': {
        service: 'HVAC Service',
        initialMessage: 'My heating system is making loud noises and not warming the house properly.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
        imageCaption: 'HVAC unit making strange noises',
        quote: { amount: 200, description: 'HVAC system diagnosis and repair' },
      },
      'req_5': {
        service: 'Appliance Repair',
        initialMessage: 'My dishwasher is leaking and not draining properly. Kitchen floor is getting wet.',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        imageCaption: 'Dishwasher leaking water',
        quote: { amount: 150, description: 'Dishwasher repair and drainage fix' },
      },
      'req_6': {
        service: 'General Maintenance',
        initialMessage: 'I have several small repairs needed around the house. Flexible on timing.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
        imageCaption: 'Various maintenance items',
        quote: { amount: 100, description: 'General home maintenance and repairs' },
      },
      'conv_4': {
        service: 'HVAC Service',
        initialMessage: 'Thanks for fixing my HVAC system! It\'s working perfectly now.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
        imageCaption: 'HVAC system running smoothly',
        quote: { amount: 200, description: 'HVAC system repair completed' },
      },
      'conv_5': {
        service: 'Appliance Repair',
        initialMessage: 'Can you come tomorrow at 2 PM for the dishwasher repair?',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        imageCaption: 'Dishwasher needs repair',
        quote: { amount: 150, description: 'Dishwasher repair and maintenance' },
      },
      'conv_6': {
        service: 'General Maintenance',
        initialMessage: 'I\'ve sent you the quote details. Let me know if you have any questions.',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
        imageCaption: 'General maintenance quote',
        quote: { amount: 100, description: 'General home maintenance package' },
      },
      'conv_7': {
        service: 'AC Maintenance',
        initialMessage: 'Great work on the AC maintenance! Cooling much better now.',
        image: 'https://images.unsplash.com/photo-1631545806609-4c036b0d2e0e?w=400',
        imageCaption: 'AC working perfectly',
        quote: { amount: 89, description: 'AC maintenance completed' },
      },
      'conv_8': {
        service: 'Emergency Plumbing',
        initialMessage: 'Do you provide emergency plumbing services? I have a water leak.',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
        imageCaption: 'Emergency water leak',
        quote: { amount: 250, description: 'Emergency plumbing repair' },
      },
    };

    return conversations[conversationId as keyof typeof conversations] || conversations['req_1'];
  };

  const conversationContent = getConversationContent();
  const [stage, setStage] = useState<'quoted' | 'scheduled' | 'completed' | undefined>(
    (serviceDetails?.status?.toLowerCase() as any) || undefined
  );
  const status = stage || serviceDetails?.status?.toLowerCase();
  const statusStep = (status as 'quoted' | 'scheduled' | 'completed') || undefined;

  // Determine message flow based on service status
  const getMessagesForStatus = () => {
    // For new/pending requests - only show customer's initial message
    if (status === 'pending' || !status) {
      const pendingMsgs: Message[] = [
        {
          id: '1',
          text: conversationContent.initialMessage,
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
          image: conversationContent.image,
          text: conversationContent.imageCaption,
        },
      ];
      return pendingMsgs;
    }

    // For quoted/scheduled/completed - show full conversation
    const baseMessages: Message[] = [
      {
        id: '1',
        text: conversationContent.initialMessage,
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
        image: conversationContent.image,
        text: conversationContent.imageCaption,
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
        quote: conversationContent.quote,
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
            service: conversationContent.service,
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
          id: '12',
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
          id: '13',
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

  // Ensure no duplicate IDs make it into the list
  const dedupeById = useCallback((arr: Message[]) => {
    const map = new Map<string, Message>();
    for (const m of arr) {
      // Later entries overwrite earlier ones with same id
      map.set(String(m.id), m);
    }
    return Array.from(map.values());
  }, []);

  const initialMessages = useMemo(() => dedupeById(getMessagesForStatus()), [dedupeById, status, serviceDetails?.service]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Keep messages in sync when status or service details change
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  
  const [inputText, setInputText] = useState('');
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const userName = useMemo(() => customerName || 'John Smith', [customerName]);
  // Use a safe placeholder for avatar to avoid missing property issues
  const userImage = useMemo(() => (
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  ), []);
  
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

    // Update centralized conversation preview (last message/time)
    if (conversationId) {
      try {
        addMessageToConversation(String(conversationId), newMessage.text || '');
      } catch (e) {
        // no-op: keep UI responsive even if context update fails
      }
    }
    
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
          <View style={[styles.quoteCard, { backgroundColor: isMe ? colors.primary : (darkMode ? '#1F2937' : '#F3F4F6'), borderColor: isMe ? colors.primary : colors.border }]}>
            <View style={styles.quoteHeader}>
              <MaterialIcons name="description" size={20} color={isMe ? '#FFFFFF' : colors.primary} />
              <Text style={[styles.quoteTitle, { color: isMe ? '#FFFFFF' : colors.text }]}>Quote</Text>
            </View>
            <Text style={[styles.quoteAmount, { color: isMe ? '#FFFFFF' : colors.text }]}>${item.quote.amount}</Text>
            <Text style={[styles.quoteDescription, { color: isMe ? 'rgba(255, 255, 255, 0.9)' : (darkMode ? '#D1D5DB' : '#6B7280') }]}>{item.quote.description}</Text>
            <TouchableOpacity style={[styles.viewQuoteButton, { backgroundColor: isMe ? 'rgba(255, 255, 255, 0.2)' : colors.primary }]} activeOpacity={0.7}>
              <Text style={[styles.viewQuoteText, { color: '#FFFFFF' }]}>View Quote</Text>
            </TouchableOpacity>
            <Text style={[styles.messageTime, { color: isMe ? 'rgba(255, 255, 255, 0.8)' : (darkMode ? '#9CA3AF' : '#6B7280') }]}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
    
    // Render Appointment Card
    if (item.type === 'appointment' && item.appointment) {
      return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
          <View style={[styles.appointmentCard, { backgroundColor: isMe ? colors.primary : (darkMode ? '#1F2937' : '#F3F4F6'), borderColor: isMe ? colors.primary : colors.border }]}>
            <View style={styles.appointmentHeader}>
              <MaterialIcons name="event" size={20} color={isMe ? '#FFFFFF' : colors.primary} />
              <Text style={[styles.appointmentTitle, { color: isMe ? '#FFFFFF' : colors.text }]}>Appointment</Text>
            </View>
            <Text style={[styles.appointmentDate, { color: isMe ? '#FFFFFF' : colors.text }]}>{item.appointment.date}</Text>
            <Text style={[styles.appointmentTime, { color: isMe ? 'rgba(255, 255, 255, 0.9)' : (darkMode ? '#D1D5DB' : '#6B7280') }]}>{item.appointment.time}</Text>
            <Text style={[styles.appointmentService, { color: isMe ? 'rgba(255, 255, 255, 0.9)' : (darkMode ? '#D1D5DB' : '#6B7280') }]}>{item.appointment.service}</Text>
            <Text style={[styles.messageTime, { color: isMe ? 'rgba(255, 255, 255, 0.8)' : (darkMode ? '#9CA3AF' : '#6B7280') }]}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
    
    // Render Image Message
    if (item.type === 'image' && item.image) {
      return (
        <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
          <View style={[styles.imageMessageContainer, { backgroundColor: isMe ? colors.primary : (darkMode ? '#1F2937' : '#F3F4F6') }]}>
            <Image source={{ uri: item.image }} style={styles.messageImage} />
            {item.text && <Text style={[styles.imageCaption, { color: isMe ? '#FFFFFF' : colors.text }]}>{item.text}</Text>}
            <Text style={[styles.messageTime, { color: isMe ? 'rgba(255, 255, 255, 0.8)' : (darkMode ? '#9CA3AF' : '#6B7280') }]}>{formatTime(item.timestamp)}</Text>
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
            isMe ? { backgroundColor: colors.primary } : { backgroundColor: darkMode ? '#1F2937' : '#F3F4F6' },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isMe ? '#FFFFFF' : colors.text },
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                { color: isMe ? 'rgba(255, 255, 255, 0.8)' : (darkMode ? '#9CA3AF' : '#6B7280') },
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
                color="rgba(255, 255, 255, 0.8)"
                style={styles.statusIcon}
              />
            )}
      </View>
        </View>
      </View>
    );
  }, [formatTime, colors, darkMode]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#111827' : '#F8F9FA' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={{ uri: userImage }} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={[styles.headerName, { color: colors.text }]}>{userName}</Text>
            <Text style={[styles.headerStatus, { color: darkMode ? '#9CA3AF' : '#6C757D' }]}>
              {conversationContent.service}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => {
          const t = item.timestamp instanceof Date ? item.timestamp.getTime() : index;
          return `${String(item.id)}_${t}_${index}`;
        }}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
            <MaterialIcons name="attach-file" size={24} color="#6C757D" />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: darkMode ? '#F3F4F6' : '#212529' }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={darkMode ? '#6B7280' : '#ADB5BD'}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Quote Modal */}
      <Modal
        visible={quoteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQuoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Quote</Text>
              <TouchableOpacity onPress={() => setQuoteModalVisible(false)}>
                <MaterialIcons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalAmount}>${conversationContent.quote.amount}</Text>
            <Text style={[styles.modalDescription, { color: darkMode ? '#D1D5DB' : '#6B7280' }]}>
              {conversationContent.quote.description}
            </Text>
            <TouchableOpacity
              style={[styles.modalPrimary, { backgroundColor: colors.primary }]}
              onPress={() => setQuoteModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalPrimaryText}>Mark as Accepted</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F3F5',
  },
  tabActive: {
    backgroundColor: '#0D6EFD',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#FFFFFF',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginVertical: 6,
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  modalPrimary: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
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
