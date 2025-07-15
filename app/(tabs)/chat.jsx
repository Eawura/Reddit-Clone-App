import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProfileModal from '../../components/ProfileModal';
import { useChatContext, useTheme } from '../../components/ThemeContext';

// Avatar image mapping
const imageMap = {
  'Random.jpg': require('../../assets/images/Random.jpg'),
  'danny-1.webp': require('../../assets/images/danny-1.webp'),
  'D.jpg': require('../../assets/images/D.jpg'),
  'MB.jpg': require('../../assets/images/MB.jpg'),
  'w1.jpg': require('../../assets/images/w1.jpg'),
  'K.jpg': require('../../assets/images/K.jpg'),
  'N.webp': require('../../assets/images/N.webp'),
  'yu.jpg': require('../../assets/images/yu.jpg'),
};

//Chat Header
const ChatHeader = ({ onProfilePress, onSearchPress, onNewChatPress }) => {
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Chats</Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={{ marginRight: 16 }} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 16 }} onPress={onNewChatPress}>
          <Ionicons name="add-circle-outline" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Enhanced Chat Row with more features
const ChatRow = ({ chat, onPress, onLongPress }) => {
  const { themeColors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  //  message status indicators
  const renderMessageStatus = () => {
    if (chat.messageStatus === 'received') {
      return null;
    }
    
    switch (chat.messageStatus) {
      case 'sent':
        return <Ionicons name="checkmark" size={16} color="#8E8E93" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={16} color="#8E8E93" />;
      case 'opened':
        return <Ionicons name="checkmark-done" size={16} color="#34C759" />;
      default:
        return null;
    }
  };

  // Format time for style
  const formatTime = (time) => {
    if (time === 'Yesterday') return 'Yesterday';
    if (time.includes(':')) return time;
    return time;
  };

  // Get chat type indicator
  const getChatTypeIcon = () => {
    if (chat.isGroup) return <Ionicons name="people" size={14} color="#8E8E93" />;
    if (chat.isBroadcast) return <Ionicons name="megaphone" size={14} color="#8E8E93" />;
    return null;
  };

  return (
    <TouchableOpacity 
      onPress={() => onPress(chat)}
      onLongPress={() => onLongPress(chat)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.chatRowContainer,
        isPressed && { backgroundColor: themeColors.border }
      ]}
    >
      <View style={[styles.chatRow, { backgroundColor: themeColors.card }]}>
        {/* Avatar with online status and typing indicator */}
        <View style={styles.avatarContainer}>
          <Image source={imageMap[chat.avatar]} style={[styles.avatar, { backgroundColor: themeColors.border }]} />
          {chat.isOnline && <View style={styles.onlineIndicator} />}
          {chat.isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>typing...</Text>
            </View>
          )}
        </View>
        
        {/* Chat info */}
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <View style={styles.nameContainer}>
              <Text style={[styles.chatName, { color: themeColors.text }]} numberOfLines={1}>
                {chat.name}
              </Text>
              {getChatTypeIcon()}
            </View>
            <View style={styles.timeContainer}>
              <Text style={[styles.chatTime, { color: chat.unread > 0 ? themeColors.accent : themeColors.textSecondary }]}>
                {formatTime(chat.time)}
              </Text>
              {chat.isPinned && (
                <Ionicons name="pin" size={12} color="#8E8E93" style={{ marginLeft: 4 }} />
              )}
            </View>
          </View>
          
          <View style={styles.messageRow}>
            <View style={styles.messageContainer}>
              {chat.messageStatus !== 'received' && (
                <View style={styles.statusContainer}>
                  {renderMessageStatus()}
                </View>
              )}
              <Text 
                style={[
                  styles.lastMessage, 
                  { 
                    color: chat.unread > 0 ? themeColors.text : themeColors.textSecondary,
                    fontWeight: chat.unread > 0 ? '600' : '400'
                  }
                ]} 
                numberOfLines={1}
              >
                {chat.lastMessage}
              </Text>
            </View>
            
            {/* Unread badge and mute indicator */}
            <View style={styles.rightContainer}>
              {chat.isMuted && (
                <Ionicons name="volume-mute" size={16} color="#8E8E93" style={{ marginBottom: 4 }} />
              )}
              {chat.unread > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: themeColors.accent }]}>
                  <Text style={[styles.unreadText, { color: themeColors.background }]}>
                    {chat.unread > 99 ? '99+' : chat.unread}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main Chat Screen
const Chat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { chats, setChats } = useChatContext();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { themeColors } = useTheme();
  // Add user modal state
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Filter chats by search text
  const filteredChats = searchText.trim() === '' ? chats : chats.filter(chat => {
    const q = searchText.toLowerCase();
    return (
      (chat.name && chat.name.toLowerCase().includes(q)) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(q))
    );
  });

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };
  const handleNewChat = () => {
    setAddUserModalVisible(true);
  };

  const handleChatPress = (chat) => {
    // Mark as read in context
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
    router.push({ pathname: '/chatDetail', params: { chat: JSON.stringify(chat) } });
  };

  const handleChatLongPress = (chat) => {
    console.log('Long press on chat:', chat.name);
    // Show context menu for chat options
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar 
        barStyle={themeColors.background === '#fff' ? 'dark-content' : 'light-content'} 
        backgroundColor={themeColors.background} 
      />
      
      {/* Search Bar */}
      {searchOpen ? (
        <View style={[styles.searchContainer, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
          <Ionicons name="search" size={20} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search or start new chat"
            placeholderTextColor={themeColors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={{ marginHorizontal: 4 }}>
              <Ionicons name="close-circle" size={20} color={themeColors.icon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleCancelSearch} style={{ marginLeft: 8 }}>
            <Text style={{ color: themeColors.accent, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      
      {/* Header */}
      {!searchOpen && (
        <ChatHeader 
          onProfilePress={() => { 
            setLastTabPath(pathname); 
            setProfileModalVisible(true); 
          }} 
          onSearchPress={handleSearchIcon}
          onNewChatPress={handleNewChat}
        />
      )}
      
      <ProfileModal 
        visible={profileModalVisible} 
        onClose={() => setProfileModalVisible(false)} 
        onLogout={() => { 
          setProfileModalVisible(false); 
          if (lastTabPath) router.replace(lastTabPath); 
        }} 
        lastTabPath={lastTabPath} 
      />
      
      <Modal
        visible={addUserModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: themeColors.card, padding: 24, borderRadius: 12, width: 300 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: themeColors.text }}>Add New User</Text>
            <TextInput
              placeholder="Enter user name"
              value={newUserName}
              onChangeText={setNewUserName}
              style={{ borderWidth: 1, borderColor: themeColors.border, borderRadius: 8, padding: 8, marginBottom: 16, color: themeColors.text }}
              placeholderTextColor={themeColors.textSecondary}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setAddUserModalVisible(false)} style={{ marginRight: 12 }}>
                <Text style={{ color: themeColors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (newUserName.trim()) {
                    setChats(prev => [
                      {
                        id: Date.now().toString(),
                        name: newUserName,
                        avatar: 'Random.jpg',
                        lastMessage: '',
                        unread: 0,
                        isOnline: false,
                        isGroup: false,
                        isBroadcast: false,
                        isPinned: false,
                        isMuted: false,
                        time: 'Now',
                        messageStatus: 'sent',
                      },
                      ...prev,
                    ]);
                    setNewUserName('');
                    setAddUserModalVisible(false);
                  }
                }}
              >
                <Text style={{ color: themeColors.accent, fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatRow 
            chat={item} 
            onPress={handleChatPress}
            onLongPress={handleChatLongPress}
          />
        )}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: themeColors.border }]} />}
        style={{ backgroundColor: themeColors.background }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  // Chat Row
  chatRowContainer: {
    paddingHorizontal: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#fff',
  },
  typingIndicator: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    backgroundColor: '#25D366',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  chatName: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  separator: {
    height: 0.5,
    marginLeft: 76,
  },
});

export default Chat; 