import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/ThemeContext';

const backgroundImg = require('../../assets/images/background.jpg');

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

  // Map avatar name to image
  const avatarMap = {
    'Random.jpg': require('../../assets/images/Random.jpg'),
    'danny-1.webp': require('../../assets/images/danny-1.webp'),
    'D.jpg': require('../../assets/images/D.jpg'),
    'MB.jpg': require('../../assets/images/MB.jpg'),
    'w1.jpg': require('../../assets/images/w1.jpg'),
    'K.jpg': require('../../assets/images/K.jpg'),
    'N.webp': require('../../assets/images/N.webp'),
    'yu.jpg': require('../../assets/images/yu.jpg'),
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>  
      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{chat.lastMessage || 'Heyy'}</Text>
          </View>
        </View>
      </View>
      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
        style={styles.inputBarWrapper}
      >
        <View style={[styles.inputBar, { backgroundColor: themeColors.card }]}> 
          <Feather name="camera" size={24} color="#bbb" style={{ marginHorizontal: 8 }} />
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
    backgroundColor: '#fff',
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
    color: '#111',
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
}); 