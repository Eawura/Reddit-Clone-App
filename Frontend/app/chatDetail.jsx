import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  };
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);

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
      setImage(result.assets[0].uri);
      // Optionally: Alert.alert('Photo Selected', result.assets[0].uri);
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
      setImage(result.assets[0].uri);
      // Optionally: Alert.alert('Photo Selected', result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>  
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}> 
        <TouchableOpacity onPress={() => router.replace('/(tabs)/chat')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={themeColors.icon} />
        </TouchableOpacity>
        <Image source={avatarMap[chat.avatar] || avatarMap['Random.jpg']} style={styles.avatar} />
        <Text style={[styles.name, { color: themeColors.text }]}>{chat.name}</Text>
      </View>
      {/* Background */}
      <Image source={backgroundImg} style={styles.bg} resizeMode="cover" />
      {/* Messages */}
      <View style={styles.messagesContainer}>
        <View style={styles.messageRow}>
          <View style={[styles.messageBubble, { backgroundColor: themeColors.card }] }>
            <Text style={[styles.messageText, { color: themeColors.text }]}>{chat.lastMessage || 'Heyy'}</Text>
          </View>
        </View>
        {image && (
          <View style={styles.messageRow}>
            <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 12, marginTop: 8 }} />
          </View>
        )}
      </View>
      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputBarWrapper}
      >
        <View style={[styles.inputBar, { backgroundColor: themeColors.card }]}> 
          <TouchableOpacity onPress={handleCameraPress}>
            <Feather name="camera" size={24} color="#bbb" style={{ marginHorizontal: 8 }} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Message"
            placeholderTextColor="#bbb"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity>
            <Ionicons name="send" size={24} color="#bbb" style={{ marginHorizontal: 8 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
            <Feather name="camera" size={22} color="#2E45A3" />
            <Text style={styles.pickerText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pickerButton} onPress={pickFromGallery}>
            <Feather name="image" size={22} color="#2E45A3" />
            <Text style={styles.pickerText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pickerButton, { borderTopWidth: 1, borderColor: '#eee' }]} onPress={() => setPickerVisible(false)}>
            <Text style={[styles.pickerText, { color: '#e74c3c' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
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
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.18,
  },
  messagesContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    zIndex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  messageBubble: {
    backgroundColor: undefined,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 18,
    color: undefined,
  },
  inputBarWrapper: {
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    margin: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    minHeight: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#222',
  },
  // Modal styles
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
    color: '#2E45A3',
    fontWeight: '500',
  },
  someShadowStyle: {
    ...Platform.select({
      web: {
        boxShadow: '0px 1px 2px rgba(0,0,0,0.07)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
}); 