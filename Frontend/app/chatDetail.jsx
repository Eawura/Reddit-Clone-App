import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useChatContext, useTheme } from '../components/ThemeContext';

const backgroundImg = require('../assets/images/background.jpg');

export default function ChatDetail() {
  const { themeColors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const chat = params.chat ? JSON.parse(params.chat) : {
    name: 'Tommie Francis',
    avatar: 'Random.jpg',
    lastMessage: 'Heyy',
    unread: 1,
  };
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [originalUnreadCount, setOriginalUnreadCount] = useState(chat.unread || 1);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesGenerated = useRef(false);
  const scrollViewRef = useRef();
  const recordingTimer = useRef(null);
  const typingTimer = useRef(null);

  // Mark as read in context when this screen mounts
  const { chats, setChats } = useChatContext();
  useEffect(() => {
    if (!chat.id) return;
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
  }, [chat.id, setChats]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      typingTimer.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    }
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [isTyping]);

  // Simulate online status
  useEffect(() => {
    const onlineTimer = setInterval(() => {
      setIsOnline(Math.random() > 0.3); // 70% chance of being online
    }, 10000);
    return () => clearInterval(onlineTimer);
  }, []);

  // Generate and store messages only once when component mounts
  useEffect(() => {
    if (messagesGenerated.current) return;
    
    const generateMessages = () => {
      const messages = [];
      
      const messageTemplates = {
     
        'Tommie Francis': ['Hello'],
        'Recky': ['Good evening.'],
    
      };
      
      const templates = messageTemplates[chat.name] || [chat.lastMessage || 'Heyy'];
      const lastMessage = chat.lastMessage || 'Heyy';
      
      for (let i = 0; i < originalUnreadCount - 1; i++) {
        const messageText = templates[i] || templates[templates.length - 1];
        messages.push({
          id: i,
          text: messageText,
          isPhoto: messageText.includes('📷'),
          timestamp: new Date(Date.now() - (originalUnreadCount - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isReceived: true,
          reactions: [],
        });
      }
      
      messages.push({
        id: originalUnreadCount - 1,
        text: lastMessage,
        isPhoto: lastMessage.includes('📷'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReceived: true,
        reactions: [],
      });
      
      return messages;
    };

    setChatMessages(generateMessages());
    messagesGenerated.current = true;
  }, [chat.name, chat.lastMessage, originalUnreadCount]);

  // Map avatar name to image
  const avatarMap = {
    'Random.jpg': require('../assets/images/Random.jpg'),
    'danny-1.webp': require('../assets/images/danny-1.webp'),
    'D.jpg': require('../assets/images/D.jpg'),
    'MB.jpg': require('../assets/images/MB.jpg'),
    'w1.jpg': require('../assets/images/w1.jpg'),
    'K.jpg': require('../assets/images/K.jpg'),
    'N.webp': require('../assets/images/N.webp'),
    'yu.jpg': require('../assets/images/yu.jpg'),
  };

  // WhatsApp-style Header
  const ChatHeader = () => (
    <View style={[styles.header, { backgroundColor: themeColors.accent }]}> 
      <TouchableOpacity onPress={() => router.replace('/(tabs)/chat')} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={themeColors.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerInfo}>
        <Image source={avatarMap[chat.avatar] || avatarMap['Random.jpg']} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: themeColors.text }]}>{chat.name}</Text>
          <Text style={[styles.status, { color: themeColors.textSecondary }]}>
            {isTyping ? 'typing...' : isOnline ? 'online' : 'last seen recently'}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerAction} onPress={handleVideoCall}>
          <Ionicons name="videocam" size={20} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction} onPress={handleVoiceCall}>
          <Ionicons name="call" size={20} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // WhatsApp-style Message Bubble with reactions
  const MessageBubble = ({ msg, index }) => {
    const isLastMessage = index === chatMessages.length - 1;
    const receivedBubbleColor = themeColors.card;
    const sentBubbleColor = themeColors.accent + '22';
    const receivedTextColor = themeColors.text;
    const sentTextColor = themeColors.text;
    
    const handleMessageLongPress = () => {
      setSelectedMessage(msg);
      setShowMessageOptions(true);
    };

    return (
      <TouchableOpacity 
        onLongPress={handleMessageLongPress}
        style={[styles.messageRow, msg.isReceived ? styles.receivedMessage : styles.sentMessage]}
      >
        <View style={[
          styles.messageBubble, 
          msg.isReceived ? { backgroundColor: receivedBubbleColor, borderTopLeftRadius: 4 } : { backgroundColor: sentBubbleColor, borderTopRightRadius: 4 }
        ]}>
          {msg.isPhoto ? (
            <View style={styles.photoMessage}>
              {msg.photoUri ? (
                <Image source={{ uri: msg.photoUri }} style={styles.photoImage} />
              ) : (
                <View style={[styles.photoPlaceholder, { backgroundColor: themeColors.card }]}> 
                  <Ionicons name="image" size={40} color={themeColors.icon} />
                </View>
              )}
              <Text style={[styles.photoText, { color: themeColors.textSecondary }]}>📷 Photo</Text>
            </View>
          ) : msg.isVoice ? (
            <View style={styles.voiceMessage}>
              <Ionicons name="play-circle" size={24} color={themeColors.accent} />
              <Text style={[styles.voiceText, { color: themeColors.textSecondary }]}>🎤 Voice message</Text>
            </View>
          ) : (
            <View style={styles.textMessageContainer}>
              <Text style={[
                styles.messageText, 
                { color: msg.isReceived ? receivedTextColor : sentTextColor }
              ]}>
                {msg.text}
              </Text>
            </View>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp, 
              { color: themeColors.textSecondary }
            ]}>
              {msg.timestamp}
            </Text>
            {!msg.isReceived && (
              <View style={styles.messageStatus}>
                <Ionicons name="checkmark-done" size={14} color={themeColors.accent} />
              </View>
            )}
          </View>
          
          {msg.reactions.length > 0 && (
            <View style={styles.reactionsContainer}>
              {msg.reactions.map((reaction, idx) => (
                <View key={idx} style={[styles.reaction, { backgroundColor: themeColors.card }]}> 
                  <Text style={[styles.reactionText, { color: themeColors.text }]}>{reaction.emoji}</Text>
                  <Text style={[styles.reactionCount, { color: themeColors.textSecondary }]}>{reaction.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Emoji Picker Component
  const EmojiPicker = () => {
    const emojis = ['😀', '😂', '❤️', '👍', '👎', '😍', '😭', '😡', '🤔', '👏'];
    
    return (
      <View style={styles.emojiPicker}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {emojis.map((emoji, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.emojiButton}
              onPress={() => {
                if (selectedMessage) {
                  addReactionToMessage(selectedMessage.id, emoji);
                  setShowMessageOptions(false);
                  setSelectedMessage(null);
                } else {
                  // Add emoji to current message
                  setMessage(prev => prev + emoji);
                }
              }}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Voice Recording Component
  const VoiceRecording = () => (
    <View style={styles.voiceRecording}>
      <View style={styles.recordingIndicator}>
        <Ionicons name="radio-button-on" size={20} color="#ff4444" />
        <Text style={styles.recordingText}>Recording... {recordingTime}s</Text>
      </View>
      <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
        <Ionicons name="stop" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // WhatsApp-style Input Bar
  const InputBar = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      style={[styles.inputBarWrapper, { backgroundColor: themeColors.background, borderTopColor: themeColors.border }]}
    >
      {isRecording && <VoiceRecording />}
      <View style={[styles.inputBar, { backgroundColor: themeColors.card, shadowColor: themeColors.shadow }]}> 
        <TouchableOpacity style={styles.inputAction} onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Ionicons name="happy" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inputAction} onPress={handleAttachmentPress}>
          <Ionicons name="attach" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Type a message"
            placeholderTextColor={themeColors.textSecondary}
            value={message}
            onChangeText={(text) => {
              setMessage(text);
              if (text.trim() && !isTyping) {
                setIsTyping(true);
              }
            }}
            multiline
            maxLength={1000}
            textAlignVertical="center"
          />
        </View>
        {message.trim() ? (
          <TouchableOpacity style={[styles.sendButton, { backgroundColor: themeColors.accent }]} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color={themeColors.buttonText || '#fff'} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton} onPress={startRecording}>
            <Ionicons name="mic" size={20} color={themeColors.icon} />
          </TouchableOpacity>
        )}
      </View>
      {showEmojiPicker && <EmojiPicker />}
    </KeyboardAvoidingView>
  );

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatMessages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  // Functional handlers
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatMessages.length,
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReceived: false,
        reactions: [],
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
      setIsTyping(false);
      
      // Simulate received message after 2 seconds
      setTimeout(() => {
        const replyMessage = {
          id: chatMessages.length + 1,
          text: getRandomReply(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isReceived: true,
          reactions: [],
        };
        setChatMessages(prev => [...prev, replyMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getRandomReply = () => {
    const replies = [
      'Okay! 👍',
      'Sure thing!',
      'Got it!',
      'Thanks! 😊',
      'Will do!',
      'Perfect!',
      'Sounds good!',
      'Noted! 📝'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingTimer.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    setRecordingTime(0);
    // Add voice message to chat
    const voiceMessage = {
      id: chatMessages.length,
      text: '🎤 Voice message',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isReceived: false,
      reactions: [],
      isVoice: true,
    };
    setChatMessages([...chatMessages, voiceMessage]);
  };

  const handleAttachmentPress = () => {
    setPickerVisible(true);
  };

  const handleVideoCall = () => {
    Alert.alert('Video Call', `Calling ${chat.name}...`);
  };

  const handleVoiceCall = () => {
    Alert.alert('Voice Call', `Calling ${chat.name}...`);
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'More options', [
      { text: 'View Contact', onPress: () => console.log('View Contact') },
      { text: 'Media, links, and docs', onPress: () => console.log('Media') },
      { text: 'Search', onPress: () => console.log('Search') },
      { text: 'Mute notifications', onPress: () => console.log('Mute') },
      { text: 'Clear chat', onPress: () => console.log('Clear chat') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const addReactionToMessage = (messageId, emoji) => {
    setChatMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const existingReaction = m.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...m,
            reactions: m.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...m,
            reactions: [...m.reactions, { emoji, count: 1 }]
          };
        }
      }
      return m;
    }));
  };

  // Camera/gallery picker
  const handleCameraPress = () => {
    setPickerVisible(true);
  };

  const pickFromCamera = async () => {
    setPickerVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoMessage = {
        id: chatMessages.length,
        text: '📷 Photo',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReceived: false,
        reactions: [],
        isPhoto: true,
        photoUri: result.assets[0].uri,
      };
      setChatMessages([...chatMessages, photoMessage]);
    }
  };

  const pickFromGallery = async () => {
    setPickerVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Media library permission is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const photoMessage = {
        id: chatMessages.length,
        text: '📷 Photo',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReceived: false,
        reactions: [],
        isPhoto: true,
        photoUri: result.assets[0].uri,
      };
      setChatMessages([...chatMessages, photoMessage]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Background image with overlay */}
      <Image source={backgroundImg} style={styles.bg} resizeMode="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: themeColors.background + (themeColors.background.length === 7 ? 'CC' : 'CC') }]} pointerEvents="none" />
      {/* Main chat content */}
      <ChatHeader />
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {chatMessages.map((msg, index) => (
          <MessageBubble key={msg.id} msg={msg} index={index} />
        ))}
        {image && (
          <View style={styles.messageRow}>
            <Image source={{ uri: image }} style={styles.selectedImage} />
          </View>
        )}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              {chat.name} is typing...
            </Text>
          </View>
        )}
      </ScrollView>
      <InputBar />
      
      {/* Camera/Gallery Picker Modal */}
      <Modal
        visible={pickerVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerVisible(false)} />
        <View style={styles.pickerModal}>
          <TouchableOpacity style={styles.pickerButton} onPress={pickFromCamera}>
            <Ionicons name="camera" size={22} color="#075E54" />
            <Text style={styles.pickerText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickerButton} onPress={pickFromGallery}>
            <Ionicons name="image" size={22} color="#075E54" />
            <Text style={styles.pickerText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pickerButton, { borderTopWidth: 1, borderColor: '#eee' }]} onPress={() => setPickerVisible(false)}>
            <Text style={[styles.pickerText, { color: '#e74c3c' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Message Options Modal */}
      <Modal
        visible={showMessageOptions}
        animationType="fade"
        transparent
        onRequestClose={() => setShowMessageOptions(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowMessageOptions(false)} />
        <View style={styles.messageOptionsModal}>
          <Text style={styles.messageOptionsTitle}>Message Options</Text>
          
          {/* Quick Reactions */}
          <View style={styles.quickReactions}>
            <Text style={styles.reactionsTitle}>Quick Reactions</Text>
            <View style={styles.reactionsRow}>
              {['👍', '❤️', '😂', '😡', '👏'].map((emoji, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.quickReactionButton}
                  onPress={() => {
                    addReactionToMessage(selectedMessage.id, emoji);
                    setShowMessageOptions(false);
                    setSelectedMessage(null);
                  }}
                >
                  <Text style={styles.quickReactionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity style={styles.messageOption} onPress={() => {
            // Copy message text to clipboard
            if (selectedMessage) {
              // In a real app, you'd use Clipboard API
              Alert.alert('Copied', 'Message copied to clipboard');
            }
            setShowMessageOptions(false);
          }}>
            <Ionicons name="copy-outline" size={20} color="#075E54" />
            <Text style={styles.messageOptionText}>Copy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.messageOption} onPress={() => {
            Alert.alert('Reply', 'Reply functionality would be implemented here');
            setShowMessageOptions(false);
          }}>
            <Ionicons name="arrow-undo-outline" size={20} color="#075E54" />
            <Text style={styles.messageOptionText}>Reply</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.messageOption} onPress={() => {
            Alert.alert('Forward', 'Forward functionality would be implemented here');
            setShowMessageOptions(false);
          }}>
            <Ionicons name="arrow-redo-outline" size={20} color="#075E54" />
            <Text style={styles.messageOptionText}>Forward</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.messageOption} onPress={() => {
            Alert.alert('Delete', 'Are you sure you want to delete this message?', [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Delete', 
                style: 'destructive',
                onPress: () => {
                  setChatMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
                  setShowMessageOptions(false);
                  setSelectedMessage(null);
                }
              }
            ]);
          }}>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            <Text style={[styles.messageOptionText, { color: '#e74c3c' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

// Enhanced WhatsApp-style styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  backBtn: {
    marginRight: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  status: {
    fontSize: 13,
    color: '#E8E8E8',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 20,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.3,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    zIndex: 1,
  },
  messageRow: {
    marginBottom: 8,
  },
  receivedMessage: {
    alignItems: 'flex-start',
  },
  sentMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  receivedBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
  },
  sentBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 4,
  },
  textMessageContainer: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  receivedText: {
    color: '#111',
  },
  sentText: {
    color: '#111',
  },
  photoMessage: {
    alignItems: 'center',
    marginBottom: 4,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  photoText: {
    fontSize: 14,
    color: '#666',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
  },
  receivedTimestamp: {
    color: '#667781',
  },
  sentTimestamp: {
    color: '#667781',
  },
  messageStatus: {
    marginLeft: 4,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  reactionText: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    marginLeft: 2,
    color: '#666',
    fontWeight: '500',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginTop: 8,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#667781',
  },
  inputBarWrapper: {
    zIndex: 2,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputAction: {
    padding: 8,
    marginHorizontal: 2,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 4,
    color: '#111',
    maxHeight: 100,
    minHeight: 20,
  },
  sendButton: {
    backgroundColor: '#2E45A3',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    elevation: 2,
  },
  micButton: {
    padding: 8,
    marginLeft: 4,
  },
  // Voice Recording
  voiceRecording: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 20,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingText: {
    marginLeft: 8,
    color: '#ff4444',
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: '#ff4444',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Emoji Picker
  emojiPicker: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  emojiButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  // Message Options Modal
  messageOptionsModal: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  messageOptionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  messageOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  pickerModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 18,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  pickerText: {
    fontSize: 17,
    marginLeft: 12,
    color: '#075E54',
    fontWeight: '500',
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  voiceText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#2E45A3',
  },
  quickReactions: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reactionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickReactionButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#075E54',
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  quickReactionText: {
    fontSize: 16,
  },
}); 