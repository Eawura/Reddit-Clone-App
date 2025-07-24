import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChatContext, useTheme } from '../components/ThemeContext';

const EMOJIS = ['😀','😂','😍','😎','😭','😡','👍','🙏','🎉','🔥','❤️','😅','😇','😜','🤔','🥳','😏','😬','😱','😴'];

// Helper to get initials from name
function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
// Helper to get a color from a string
function getColorFromName(name) {
  const colors = ['#2E45A3', '#25D366', '#FF8C00', '#FF5A5F', '#8E44AD', '#16A085', '#E67E22', '#C0392B'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const ChatDetail = () => {
  const router = useRouter();
  const { id, name, messages: messagesParam } = useLocalSearchParams();
  const { chats, setChats } = useChatContext();
  console.log('ChatDetails params:', { id, name, messages: messagesParam });
  let initialMessages = [];
  try {
    initialMessages = messagesParam ? JSON.parse(messagesParam) : [];
    if (!Array.isArray(initialMessages)) initialMessages = [];
  } catch {
    initialMessages = [];
  }
  // If no messages, use dummy conversation
  if (!initialMessages || initialMessages.length === 0) {
    initialMessages = [
      { text: 'Hey! Long time no see 😊', sender: 'Recky', timestamp: '2024-06-01T10:00:00Z' },
      { text: 'Recky! It really has been a while. How have you been?', sender: 'me', timestamp: '2024-06-01T10:01:00Z' },
      { text: "I’ve been great, just started a new job!", sender: 'Recky', timestamp: '2024-06-01T10:02:00Z' },
      { text: 'Congrats! What are you working on?', sender: 'me', timestamp: '2024-06-01T10:03:00Z' },
      { text: 'Thanks! I’m doing mobile app development now. 🚀', sender: 'Recky', timestamp: '2024-06-01T10:04:00Z' },
      { text: 'That’s awesome. We should catch up soon!', sender: 'me', timestamp: '2024-06-01T10:05:00Z' },
      { text: 'Definitely! Let me know when you’re free.', sender: 'Recky', timestamp: '2024-06-01T10:06:00Z' },
    ];
  }
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // now means 'them' is typing
  const [showEmojis, setShowEmojis] = useState(false);
  const flatListRef = useRef(null);
  const { themeColors } = useTheme();

  // Send chat message (front-end only)
  const sendMessage = () => {
    if (input.trim()) {
      const newMsg = {
        text: input,
        sender: 'me',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => {
        const updated = [...prev, newMsg];
        // Update parent chat list
        setChats(prevChats => prevChats.map(chat =>
          chat.id === id ? { ...chat, messages: updated } : chat
        ));
        return updated;
      });
      setInput('');
      setShowEmojis(false);
      // Simulate 'Recky' typing after you send a message
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
        setIsTyping(false);
          // Simulate a reply from 'Recky'
          const reply = {
            text: getAutoReply(input),
            sender: 'Recky',
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => {
            const updated = [...prev, reply];
            setChats(prevChats => prevChats.map(chat =>
              chat.id === id ? { ...chat, messages: updated } : chat
            ));
            return updated;
          });
        }, 1500);
      }, 500);
    }
  };

  // Handle camera/image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const newMsg = {
        image: imageUri,
        sender: 'me',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => {
        const updated = [...prev, newMsg];
        setChats(prevChats => prevChats.map(chat =>
          chat.id === id ? { ...chat, messages: updated } : chat
        ));
        return updated;
      });
    }
  };

  // Helper to generate a simple auto-reply
  function getAutoReply(userMsg) {
    const replies = [
      "That's interesting!",
      "Tell me more.",
      "👍",
      "Haha, good one!",
      "I'm here!",
      "Let's keep chatting!",
      "😊"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  // Typing indicator logic
  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(false); // Remove this line
    }
  }, [input]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
        <View style={[styles.bubble, isMe ? { ...styles.bubbleMe, backgroundColor: themeColors.accent } : { ...styles.bubbleOther, backgroundColor: themeColors.card }] }>
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: 160, height: 120, borderRadius: 10, marginBottom: 6 }} />
          ) : null}
          {item.text && (
            <Text style={[styles.messageText, isMe ? { color: '#fff' } : { color: themeColors.text }]}>{item.text}</Text>
          )}
          <Text style={[styles.timestamp, { color: themeColors.textSecondary }]}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  // Header component
  const Header = () => (
    <View style={[styles.header, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/(tabs)/chat')}>
        <Ionicons name="arrow-back" size={24} color={themeColors.accent} />
      </TouchableOpacity>
      <View style={[styles.avatar, { backgroundColor: getColorFromName(name), justifyContent: 'center', alignItems: 'center', marginRight: 12 }] }>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{getInitials(name)}</Text>
      </View>
      <Text style={[styles.headerTitle, { color: themeColors.accent }]} numberOfLines={1}>{name || 'Chat'}</Text>
      <View style={{ width: 32 }} /> {/* Placeholder for spacing/alignment */}
    </View>
  );

  // Emoji panel
  const EmojiPanel = () => (
    <View style={[styles.emojiPanel, { backgroundColor: themeColors.card, borderColor: themeColors.border }] }>
      {EMOJIS.map((emoji, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.emojiBtn}
          onPress={() => {
            setInput(input + emoji);
            setShowEmojis(false);
          }}
        >
          <Text style={styles.emoji}>{emoji}</Text>
      </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
    >
      <Header />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color={themeColors.textSecondary} />
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No messages yet. Start the conversation!</Text>
          </View>
        )}
      />
      {showEmojis && <EmojiPanel />}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={pickImage} style={styles.cameraBtn}>
          <Ionicons name="camera" size={26} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEmojis(e => !e)} style={styles.emojiToggleBtn}>
          <Text style={{ fontSize: 26 }}>😊</Text>
        </TouchableOpacity>
          <TextInput
          value={input}
          onChangeText={setInput}
          style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="Type a message"
            placeholderTextColor={themeColors.textSecondary}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, { backgroundColor: themeColors.accent }] }>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {isTyping && (
        <View style={styles.typingIndicatorRow}>
          <Text style={[styles.typingIndicator, { color: themeColors.textSecondary }]}>Recky is typing...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    elevation: 2,
    zIndex: 10,
  },
  backBtn: {
    marginRight: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatList: { flexGrow: 1, padding: 12, justifyContent: 'flex-end' },
  messageRow: { flexDirection: 'row', marginBottom: 10 },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowOther: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: {
    borderTopRightRadius: 6,
    alignSelf: 'flex-end',
  },
  bubbleOther: {
    borderTopLeftRadius: 6,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  emojiToggleBtn: {
    marginRight: 6,
    padding: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendBtn: {
    borderRadius: 24,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'flex-start',
    zIndex: 20,
  },
  emojiBtn: {
    padding: 6,
    margin: 2,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 26,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  typingIndicatorRow: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'flex-start',
  },
  typingIndicator: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  cameraBtn: {
    marginRight: 6,
    padding: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 

export default ChatDetail; 