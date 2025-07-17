import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo for icons
import HomeAppBar from '../Components/HomeAppBar';


// Chat Item Component to render each conversation
const ChatItem = ({ avatarUri, name, lastMessage, time, unreadCount, isOnline }) => (
  <TouchableOpacity style={styles.chatItem}>
    {/* Avatar */}
    <View style={styles.avatarContainer}>
      <Image source={avatarUri } style={styles.avatar} />
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>

    {/* Message Content */}
    <View style={styles.messageContent}>
      <Text style={styles.chatName}>{name}</Text>
      <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
    </View>

    {/* Time and Unread Count */}
    <View style={styles.timeAndUnread}>
      <Text style={styles.time}>{time}</Text>
      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// Main Chat List Screen Component
export default function ChatListScreen() {
  // Sample Data for chat conversations
  const chatData = [
    {
      id: '1',
      avatarUri: require('../assets/harry.png'), // Placeholder for Tommie Francis
      name: 'Tommie Francis',
      lastMessage: 'Heyyy',
      time: '19:22',
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: '2',
      avatarUri: 'https://placehold.co/60x60/8BC34A/FFFFFF?text=RE', // Placeholder for Recky
      name: 'Recky',
      lastMessage: 'Good evening. Where are you ...',
      time: '19:15',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '3',
      avatarUri: 'https://placehold.co/60x60/CDDC39/FFFFFF?text=D', // Placeholder for Dad
      name: 'Dad❤️❤️',
      lastMessage: 'What\'s up?.',
      time: '18:52',
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: '4',
      avatarUri: 'https://placehold.co/60x60/9E9E9E/FFFFFF?text=MB', // Placeholder for Michael Brown
      name: 'Michael Brown',
      lastMessage: 'Try exercising a lot.',
      time: '18:00',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '5',
      avatarUri: 'https://placehold.co/60x60/F44336/FFFFFF?text=SB', // Placeholder for Suzette Brewer
      name: 'Suzette Brewer',
      lastMessage: '📷 Photo',
      time: '12:01',
      unreadCount: 4,
      isOnline: false,
    },
    {
      id: '6',
      avatarUri: 'https://placehold.co/60x60/607D8B/FFFFFF?text=KF', // Placeholder for Kelly Fletcher
      name: 'Kelly Fletcher',
      lastMessage: '🤣🤣🤣',
      time: '10:33',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '7',
      avatarUri: 'https://placehold.co/60x60/795548/FFFFFF?text=NM', // Placeholder for Neal McIntosh
      name: 'Neal McIntosh',
      lastMessage: 'lol',
      time: '7:59',
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: '8',
      avatarUri: 'https://placehold.co/60x60/FFEB3B/333333?text=DY', // Placeholder for Darius Yu
      name: 'Darius Yu',
      lastMessage: 'Thank you 😊',
      time: '6:06',
      unreadCount: 1,
      isOnline: false,
    },
    {
      id: '9',
      avatarUri: 'https://placehold.co/60x60/2196F3/FFFFFF?text=SB', // Placeholder for Suzette Brewer (again, for "Yesterday")
      name: 'Suzette Brewer',
      lastMessage: 'Yesterday', // Special case for "Yesterday"
      time: '', // No time for "Yesterday"
      unreadCount: 0,
      isOnline: false,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeAppBar 
       title="Chat"
      />
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatItem {...item} />}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

// Stylesheet for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E0E8F8', // Light blue background matching previous designs
    // paddingTop: Platform.OS === 'android' ? 30 : 0, // Adjust for Android status bar
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Lighter border for separation
    backgroundColor: '#FFFFFF', // White background for each item
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height for perfect circle
    backgroundColor: '#E0E0E0', // Fallback background
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Green color for online
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#777777',
  },
  timeAndUnread: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  time: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: '#3F51B5', // Blue background for unread count
    borderRadius: 10,
    minWidth: 20, // Ensure it's wide enough for single digit
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    // Add padding if needed for overall list
    paddingHorizontal: 0, // Matches the overall app design padding
    paddingVertical: 0,
  }
});
