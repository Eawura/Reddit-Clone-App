import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { MOCK_COMMUNITIES } from './communities.jsx';

// Image mapping for notification avatars
const imageMap = {
  'Penguin.jpg': require('../../assets/images/Penguin.jpg'),
  'Commenter1.jpg': require('../../assets/images/Commenter1.jpg'),
  'Commenter2.jpg': require('../../assets/images/Commenter2.jpg'),
  'Commenter3.jpg': require('../../assets/images/Commenter3.jpg'),
  'Commenter4.jpg': require('../../assets/images/Commenter4.jpg'),
  'Commenter5.jpg': require('../../assets/images/Commenter5.jpg'),
  'Commenter6.jpg': require('../../assets/images/Commenter6.jpg'),
  'Commenter7.jpg': require('../../assets/images/Commenter7.jpg'),
  'Commenter8.jpg': require('../../assets/images/Commenter8.jpg'),
  'Commenter9.jpg': require('../../assets/images/Commenter9.jpg'),
  'Commenter10.jpg': require('../../assets/images/Commenter10.jpg'),
};

// Sample notification data with different types
const notifications = [
  {
    id: '1',
    type: 'upvote',
    user: 'u/tech_enthusiast',
    avatar: 'Commenter1.jpg',
    action: 'upvoted your post',
    content: 'Just finished building my first React Native app! Here\'s what I learned',
    time: '2m ago',
    read: false,
    postId: 'post_123'
  },
  {
    id: '2',
    type: 'comment',
    user: 'u/code_master',
    avatar: 'Commenter2.jpg',
    action: 'commented on your post',
    content: 'Great insights! I especially liked the part about state management.',
    time: '5m ago',
    read: false,
    postId: 'post_123',
    commentId: 'comment_456'
  },
  {
    id: '3',
    type: 'award',
    user: 'u/helpful_user',
    avatar: 'Commenter3.jpg',
    action: 'gave you a Gold award',
    content: 'My cat just discovered the laser pointer for the first time',
    time: '12m ago',
    read: false,
    postId: 'post_124',
    awardType: 'gold'
  },
  {
    id: '4',
    type: 'follow',
    user: 'u/new_follower',
    avatar: 'Commenter4.jpg',
    action: 'followed you',
    content: '',
    time: '1h ago',
    read: false
  },
  {
    id: '5',
    type: 'reply',
    user: 'u/discussion_starter',
    avatar: 'Commenter5.jpg',
    action: 'replied to your comment',
    content: 'You\'re absolutely right! This approach is much better.',
    time: '2h ago',
    read: true,
    postId: 'post_125',
    commentId: 'comment_789'
  },
  {
    id: '6',
    type: 'mention',
    user: 'u/community_member',
    avatar: 'Commenter6.jpg',
    action: 'mentioned you in a comment',
    content: 'Hey @u/your_username, what do you think about this?',
    time: '3h ago',
    read: false,
    postId: 'post_126'
  },
  {
    id: '7',
    type: 'moderator',
    user: 'u/mod_team',
    avatar: 'Commenter7.jpg',
    action: 'sent you a moderator message',
    content: 'Your post has been approved and is now live in the community!',
    time: '5h ago',
    read: false
  },
  {
    id: '8',
    type: 'upvote',
    user: 'u/design_lover',
    avatar: 'Commenter8.jpg',
    action: 'upvoted your comment',
    content: 'This is exactly what I needed to see right now.',
    time: '1d ago',
    read: true,
    commentId: 'comment_101'
  }
];

// Replace messages with community conversations
const communityConversations = MOCK_COMMUNITIES.map((community, idx) => ({
  id: community.id,
  user: community.displayName,
  avatar: community.avatar,
  lastMessage: `Welcome to ${community.displayName}! Start a conversation.`,
  time: `${idx + 1}h ago`,
  unread: idx % 2 === 0 // Alternate unread for demo
}));

// Notification type icons
const getNotificationIcon = (type) => {
  switch (type) {
    case 'upvote':
      return { name: 'arrow-up', color: '#FF4500' };
    case 'comment':
      return { name: 'chatbubble-outline', color: '#0079D3' };
    case 'reply':
      return { name: 'chatbubble-ellipses-outline', color: '#0079D3' };
    case 'award':
      return { name: 'trophy', color: '#FFD700' };
    case 'follow':
      return { name: 'person-add', color: '#46D160' };
    case 'mention':
      return { name: 'at', color: '#FF4500' };
    case 'moderator':
      return { name: 'shield-checkmark', color: '#FF4500' };
    default:
      return { name: 'notifications', color: '#0079D3' };
  }
};

// Notification component
const NotificationItem = ({ notification, onPress, themeColors }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: notification.read ? themeColors.card : (themeColors.unreadBg || themeColors.background) },
        !notification.read && styles.unreadNotification
      ]}
      onPress={() => onPress(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Image 
            source={imageMap[notification.avatar]} 
            style={styles.notificationAvatar} 
          />
          <View style={styles.notificationInfo}>
            <Text style={[styles.notificationUser, { color: themeColors.text }]}>
              {notification.user}
            </Text>
            <Text style={[styles.notificationAction, { color: themeColors.textSecondary }]}>
              {notification.action}
            </Text>
          </View>
          <View style={styles.notificationMeta}>
            <Text style={[styles.notificationTime, { color: themeColors.textSecondary }]}>
              {notification.time}
            </Text>
            {!notification.read && (
              <View style={[styles.unreadDot, { backgroundColor: themeColors.accent }]} />
            )}
          </View>
        </View>
        
        <Text style={[styles.notificationContentText, { color: themeColors.textSecondary }]}>
            {notification.content}
          </Text>
      </View>
    </TouchableOpacity>
  );
};

// Message component
const MessageItem = ({ message, onPress, themeColors }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.messageItem, 
        { backgroundColor: themeColors.card },
        message.unread && styles.unreadMessage
      ]}
      onPress={() => onPress(message)}
    >
      <Image source={imageMap[message.avatar]} style={styles.messageAvatar} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.messageUser, { color: themeColors.text }]}>
            {message.user}
          </Text>
          <Text style={[styles.messageTime, { color: themeColors.textSecondary }]}>
            {message.time}
          </Text>
        </View>
        <Text style={[styles.messageText, { color: themeColors.textSecondary }]} numberOfLines={2}>
          {message.lastMessage}
        </Text>
        {message.unread && (
          <View style={[styles.unreadBadge, { backgroundColor: themeColors.accent }]} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const InboxHeader = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background, paddingTop: Platform.OS === 'ios' ? 56 : 32 }] }>
      <Text style={[styles.headerTitle, { color: '#2E45A3' }]}>Inbox</Text>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={{ marginRight: 16 }} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Inbox = () => {
  const [tab, setTab] = useState('Notifications');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [messagesList, setMessagesList] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();

  // Filter notifications by search text
  const filteredNotifications = searchText.trim() === '' ? notificationsList : notificationsList.filter(notification => {
    const q = searchText.toLowerCase();
    return (
      (typeof notification.user === 'string' && notification.user.toLowerCase().includes(q)) ||
      (typeof notification.content === 'string' && notification.content.toLowerCase().includes(q)) ||
      (typeof notification.action === 'string' && notification.action.toLowerCase().includes(q))
    );
  });

  // Filter messages by search text
  const filteredMessages = searchText.trim() === '' ? messagesList : messagesList.filter(message => {
    const q = searchText.toLowerCase();
    return (
      (typeof message.user === 'string' && message.user.toLowerCase().includes(q)) ||
      (typeof message.lastMessage === 'string' && message.lastMessage.toLowerCase().includes(q))
    );
  });

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotificationsList(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Handle different notification types
    switch (notification.type) {
      case 'upvote':
      case 'comment':
      case 'reply':
      case 'mention':
        Alert.alert('View Post', `Navigate to post: ${notification.postId}`);
        break;
      case 'award':
        Alert.alert('Award Received!', `You received a ${notification.awardType} award!`);
        break;
      case 'follow':
        Alert.alert('New Follower', `@${notification.user} started following you!`);
        break;
      case 'moderator':
        Alert.alert('Moderator Message', notification.content);
        break;
      default:
        Alert.alert('Notification', 'Notification details');
    }
  };

  const handleMessagePress = (message) => {
    // Mark as read
    setMessagesList(prev => 
      prev.map(m => m.id === message.id ? { ...m, unread: false } : m)
    );
    
    Alert.alert('Open Chat', `Open chat with ${message.user}`);
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    setMessagesList(prev => prev.map(m => ({ ...m, unread: false })));
  };

  const getUnreadCount = () => {
    const notificationCount = notificationsList.filter(n => !n.read).length;
    const messageCount = messagesList.filter(m => m.unread).length;
    return tab === 'Notifications' ? notificationCount : messageCount;
  };

  const handleJoinCommunity = (community) => {
    setNotificationsList(prev => [
      {
        id: Date.now().toString(),
        type: 'join',
        user: 'You',
        avatar: community.avatar,
        action: `joined n/${community.name}`,
        content: `Welcome to n/${community.name}!`,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Search Bar */}
      {searchOpen ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 40, backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }}>
          <Ionicons name="search" size={22} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 18, color: themeColors.text, paddingVertical: 8 }}
            placeholder={`Search ${tab.toLowerCase()}`}
            placeholderTextColor={themeColors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={{ marginHorizontal: 4 }}>
              <Ionicons name="close-circle" size={22} color={themeColors.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleCancelSearch} style={{ marginLeft: 8 }}>
            <Text style={{ color: themeColors.accent || '#2E45A3', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      {/* Header */}
      {!searchOpen && (
        <InboxHeader 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} 
          onSearchPress={handleSearchIcon} 
        />
      )}
      
      <ProfileModal 
        visible={profileModalVisible} 
        onClose={() => setProfileModalVisible(false)} 
        onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} 
        lastTabPath={lastTabPath} 
      />
      
      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.background }}>
        <TouchableOpacity 
          style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }} 
          onPress={() => setTab('Notifications')}
        >
          <Text style={{ 
            color: tab === 'Notifications' ? themeColors.text : themeColors.textSecondary, 
            fontWeight: 'bold', 
            fontSize: 16 
          }}>
            Notifications
          </Text>
          {tab === 'Notifications' && (
            <View style={{ 
              height: 2, 
              backgroundColor: themeColors.accent || '#3a4bb7', 
              width: 32, 
              marginTop: 4, 
              borderRadius: 1 
            }} />
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }} 
          onPress={() => setTab('Messages')}
        >
          <Text style={{ 
            color: tab === 'Messages' ? themeColors.text : themeColors.textSecondary, 
            fontWeight: 'bold', 
            fontSize: 16 
          }}>
            Messages
          </Text>
          {tab === 'Messages' && (
            <View style={{ 
              height: 2, 
              backgroundColor: themeColors.accent || '#3a4bb7', 
              width: 32, 
              marginTop: 4, 
              borderRadius: 1 
            }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      {getUnreadCount() > 0 && (
        <View style={[styles.actionBar, { backgroundColor: themeColors.card }]}>
          <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>
            {getUnreadCount()} unread {tab === 'Notifications' ? 'notifications' : 'messages'}
          </Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={[styles.markReadText, { color: themeColors.accent }]}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {tab === 'Notifications' ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NotificationItem 
              notification={item} 
              onPress={handleNotificationPress}
              themeColors={themeColors}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>
                No notifications yet
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: themeColors.textSecondary }]}>
                When you get notifications, they'll show up here
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MessageItem 
              message={item} 
              onPress={handleMessagePress}
              themeColors={themeColors}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>
                No messages yet
              </Text>
              <Text style={[styles.emptyStateSubtitle, { color: themeColors.textSecondary }]}>
                When you receive messages, they'll show up here
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  headerTitle: {
    color: '#2946d7',
    fontWeight: 'bold',
    fontSize: 22,
    flex: 1,
    textAlign: 'center',
    marginLeft: -28,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionText: {
    fontSize: 14,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadNotification: {
    borderLeftColor: '#0079D3',
  },
  notificationContent: {
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationUser: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationAction: {
    fontSize: 14,
    color: '#666',
  },
  notificationMeta: {
    alignItems: 'flex-end',
  },
  notificationTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationContentText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 52,
  },
  messageItem: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  unreadMessage: {
    borderLeftColor: '#0079D3',
    backgroundColor: '#f8f9fa',
  },
  messageAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    position: 'relative',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default Inbox; 