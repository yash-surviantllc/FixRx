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
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

type ChatListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

// Helper to style the small status chip based on conversation/service status
const getStatusChipStyle = (
  status?: string,
  colors?: { primary: string; border: string }
) => {
  const base = { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' } as const;
  if (!status) return base;
  const s = status.toLowerCase();
  if (s.includes('completed')) return { borderColor: '#10B981', backgroundColor: '#ECFDF5' };
  if (s.includes('scheduled') || s.includes('confirmed')) return { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' };
  if (s.includes('quoted')) return { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' };
  if (s.includes('pending')) return { borderColor: '#D1D5DB', backgroundColor: '#F3F4F6' };
  return base;
};

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();
  const { theme, colors } = useTheme();
  const { conversations } = useAppContext();
  const darkMode = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState(conversations);

  // Simulate loading conversations from centralized store
  useEffect(() => {
    const timer = setTimeout(() => {
      setList(conversations);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [conversations]);

  // Filter conversations based on search query
  const filteredConversations = list.filter(conversation => 
    (conversation.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each conversation item
  const renderConversation = ({ item }: { item: typeof list[0] }) => (
    <TouchableOpacity 
      style={[
        styles.conversationItem,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={() => {
        navigation.navigate('Messaging', { 
          conversationId: item.id,
          customerName: item.customerName,
          serviceDetails: item.serviceDetails,
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
          defaultSource={{ uri: 'https://via.placeholder.com/50' }}
        />
        {/* We can add presence later */}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text 
            style={[
              styles.userName,
              { color: colors.text },
              item.unread && styles.unreadUserName
            ]}
            numberOfLines={1}
          >
            {item.customerName}
          </Text>
          <View style={styles.headerRight}>
            {!!item.serviceDetails?.status && (
              <View style={[styles.statusChip, getStatusChipStyle(item.serviceDetails?.status, colors)]}>
                <Text style={styles.statusChipText}>
                  {item.serviceDetails?.status}
                </Text>
              </View>
            )}
            <Text 
              style={[
                styles.time,
                { color: darkMode ? '#9CA3AF' : '#ADB5BD' },
                item.unread && { color: colors.primary }
              ]}
            >
              {item.time}
            </Text>
          </View>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.lastMessage,
              { color: darkMode ? '#9CA3AF' : '#6C757D' },
              item.unread && { color: colors.text, fontWeight: '500' }
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} >
              <Text style={styles.unreadCount}>•</Text>
            </View>
          )}
        </View>
        {/* Presence info can be re-added later */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.secondary, color: colors.text }]}
          placeholder="Search conversations..."
          placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* New Message Button */}
      <TouchableOpacity 
        style={[styles.newMessageButton, { backgroundColor: colors.primary }]}
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
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: darkMode ? '#9CA3AF' : '#6C757D' }]}>Loading conversations...</Text>
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
          <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No conversations found</Text>
          <Text style={[styles.emptyStateText, { color: darkMode ? '#9CA3AF' : '#6C757D' }]}>
            {searchQuery 
              ? 'No conversations match your search.' 
              : 'Start a new conversation to get started!'
            }
          </Text>
          <TouchableOpacity 
            style={[styles.startChatButton, { backgroundColor: colors.primary }]}
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
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
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
