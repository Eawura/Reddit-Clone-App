import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProfileModal from '../../components/ProfileModal';
import { useChatContext, useTheme } from '../../components/ThemeContext';

// This object maps avatar file names to their actual image files in the assets folder
const imageMap = {
  'Random.jpg': require('../../assets/images/Random.jpg'),
  'danny-1.webp': require('../../assets/images/danny-1.webp'),
  'D.jpg': require('../../assets/images/D.jpg'),
  'MB.jpg': require('../../assets/images/MB.jpg'),
  'w1.jpg': require('../../assets/images/w1.jpg'),
  'K.jpg': require('../../assets/images/K.jpg'),
  'N.webp': require('../../assets/images/N.webp'),
  'yu.jpg': require('../../assets/images/yu.jpg'),
  // Add more mappings as needed
};


//  represents a chat with a user
const initialChats = [
  {
    id: '1', // Unique identifier for the chat
    name: 'Tommie Francis', // Name of the contact
    avatar: 'Random.jpg', // Avatar image file name
    lastMessage: 'Heyyy', // Last message sent or received
    time: '19:22', // Time of the last message
    unread: 1, // Number of unread messages
  },
  {
    id: '2',
    name: 'Recky',
    avatar: 'danny-1.webp',
    lastMessage: 'Good evening. Where are you ...',
    time: '19:15',
    unread: 0,
  },
  {
    id: '3',
    name: 'Dad❤️❤️',
    avatar: 'D.jpg',
    lastMessage: "What's up?",
    time: '18:52',
    unread: 1,
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: 'MB.jpg',
    lastMessage: 'Try exercising a lot.',
    time: '18:00',
    unread: 0,
  },
  {
    id: '5',
    name: 'Suzette Brewer',
    avatar: 'w1.jpg',
    lastMessage: '📷 Photo',
    time: '12:01',
    unread: 4,
  },
  {
    id: '6',
    name: 'Kelly Fletcher',
    avatar: 'K.jpg',
    lastMessage: '😂😂😂',
    time: '10:33',
    unread: 0,
  },
  {
    id: '7',
    name: 'Neal Mcintosh',
    avatar: 'N.webp',
    lastMessage: 'lol',
    time: '7:59',
    unread: 0,
  },
  {
    id: '8',
    name: 'Darius Yu',
    avatar: 'yu.jpg',
    lastMessage: 'Thank you 😊',
    time: '6:06',
    unread: 1,
  },
  {
    id: '9',
    name: 'Mary',
    avatar: 'w1.jpg',
    lastMessage: 'Photo',
    time: 'Yesterday',
    unread: 0,
  },
];

// This component renders the top header bar of the chat screen
// Includes a menu button, the title, and some action icons
const ChatHeader = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background }] }>
      {/* Remove menu icon */}
      {/* <TouchableOpacity onPress={() => setMenuOpen(open => !open)}>
        <Feather name="menu" size={28} color={themeColors.icon} />
      </TouchableOpacity> */}
      <Text style={[styles.headerTitle, { color: '#2E45A3' }]}>Chat</Text>
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

// This component represents a single row in the chat list
// It shows the avatar, name, last message, time, and unread badge if needed
const ChatRow = ({ chat, onPress }) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(chat)}>
      <View style={[styles.row, { backgroundColor: themeColors.card }] }>
        {/* User avatar */}
        <Image source={imageMap[chat.avatar]} style={styles.avatar} />
        {/* Name and last message */}
        <View style={styles.textContainer}>
          <Text style={[styles.name, { color: themeColors.text }]}>{chat.name}</Text>
          {/* Only show one line of the last message, truncate if too long */}
          <Text style={[styles.lastMessage, { color: themeColors.textSecondary }]} numberOfLines={1}>{chat.lastMessage}</Text>
        </View>
        {/* Time and unread badge on the right */}
        <View style={styles.rightContainer}>
          <Text style={[styles.time, { color: chat.unread === 0 ? themeColors.textSecondary : themeColors.accent || '#2946d7' }]}>{chat.time}</Text>
          {/* Only show unread badge if there are unread messages */}
          {chat.unread > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: themeColors.accent || '#2946d7' }] }>
              <Text style={[styles.unreadText, { color: themeColors.background }]}>{chat.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// The main Chat component brings everything together
// It renders the header and the list of chats
const Chat = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { chats, setChats } = useChatContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { themeColors } = useTheme();

  // Filter chats by search text
  const filteredChats = searchText.trim() === '' ? chats : chats.filter(chat => {
    const q = searchText.toLowerCase();
    return (
      chat.name.toLowerCase().includes(q) ||
      chat.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

  const handleChatPress = (chat) => {
    // Mark as read in context
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
    router.push({ pathname: '/chatDetail', params: { chat: JSON.stringify(chat) } });
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {searchOpen ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 40, backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }}>
          <Ionicons name="search" size={22} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 18, color: themeColors.text, paddingVertical: 8 }}
            placeholder="Search chats"
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
        <ChatHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} onSearchPress={handleSearchIcon} />
      )}
      <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
      {/* List of chats using FlatList for performance */}
      <FlatList
        data={filteredChats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow chat={item} onPress={() => handleChatPress(item)} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

// All the styles for our components live here
// This keeps our UI looking clean and consistent
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: undefined, // will be set by parent
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40, // Space for status bar
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111', // Dark header background
  },
  headerTitle: {
    color: '#2946d7', // Blue accent color
    fontWeight: 'bold',
    fontSize: 22,
    flex: 1,
    textAlign: 'center',
    marginLeft: -28, // To visually center between icons
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: undefined, // will be set by ChatRow
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22, // Makes the avatar round
    marginRight: 14,
    backgroundColor: '#eee', // Placeholder color
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: undefined, // will be set by ChatRow
    marginBottom: 2,
  },
  lastMessage: {
    color: undefined, // will be set by ChatRow
    fontSize: 14,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 48,
  },
  time: {
    color: undefined, // will be set by ChatRow
    fontSize: 13,
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: undefined, // will be set by ChatRow
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: undefined, // will be set by ChatRow
    fontWeight: 'bold',
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: undefined, // will be set by parent if needed
    marginLeft: 74, // Indent so it doesn't go under the avatar
  },
});
export default Chat;