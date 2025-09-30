import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

// Mock data for chat conversations
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Hi there! I was wondering about the availability for next week...',
    time: '2h ago',
    unreadCount: 2,
    isOnline: true,
    lastActive: '2h ago'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'Thanks for the great service!',
    time: '1d ago',
    unreadCount: 0,
    isOnline: false,
    lastActive: '5h ago'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael Brown',
    userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'Can we reschedule our appointment?',
    time: '2d ago',
    unreadCount: 1,
    isOnline: true,
    lastActive: '30m ago'
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emily Davis',
    userImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    lastMessage: 'I\'ve sent the payment. Please confirm once received.',
    time: '3d ago',
    unreadCount: 0,
    isOnline: false,
    lastActive: '1d ago'
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'David Wilson',
    userImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    lastMessage: 'The work looks great, thank you!',
    time: '1w ago',
    unreadCount: 0,
    isOnline: true,
    lastActive: '2h ago'
  },
];

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<typeof MOCK_CONVERSATIONS>([]);

  // Simulate loading conversations
  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => 
    conversation.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each conversation item
  const renderConversation = ({ item }: { item: typeof MOCK_CONVERSATIONS[0] }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => {
        navigation.navigate('Messaging', { 
          conversationId: item.id
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.userImage }} 
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/50' }}
        />
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text 
            style={[
              styles.userName,
              item.unreadCount > 0 && styles.unreadUserName
            ]}
            numberOfLines={1}
          >
            {item.userName}
          </Text>
          <Text 
            style={[
              styles.time,
              item.unreadCount > 0 && styles.unreadTime
            ]}
          >
            {item.time}
          </Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        {!item.isOnline && item.lastActive && (
          <Text style={styles.lastSeenText}>
            Last active {item.lastActive}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* New Message Button */}
      <TouchableOpacity 
        style={styles.newMessageButton}
        onPress={() => {
          // Navigate to new message screen
          // navigation.navigate('NewMessage');
        }}
      >
        <Text style={styles.newMessageButtonText}>+ New Message</Text>
      </TouchableOpacity>
      
      {/* Conversations List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0D6EFD" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No conversations found</Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? 'No conversations match your search.' 
              : 'Start a new conversation to get started!'
            }
          </Text>
          <TouchableOpacity 
            style={styles.startChatButton}
            onPress={() => {
              // Navigate to new message screen
              // navigation.navigate('NewMessage');
            }}
          >
            <Text style={styles.startChatButtonText}>Start a Chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
  },
  newMessageButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#0D6EFD',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newMessageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6C757D',
  },
  listContent: {
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F3F5',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#28A745',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  unreadUserName: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  unreadTime: {
    color: '#0D6EFD',
    fontWeight: '500',
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6C757D',
    marginRight: 8,
  },
  unreadMessage: {
    color: '#212529',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#0D6EFD',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  lastSeenText: {
    fontSize: 11,
    color: '#ADB5BD',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
  },
  startChatButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#0D6EFD',
    borderRadius: 8,
  },
  startChatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatListScreen;
