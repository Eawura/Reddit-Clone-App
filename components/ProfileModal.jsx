import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.8;

export default function ProfileModal({ visible, onClose, onLogout }) {
  const translateX = useRef(new Animated.Value(MODAL_WIDTH)).current;
  const [online, setOnline] = useState(true);
  const { theme, toggleTheme, themeColors } = useTheme();

  // Slide in from right animation
  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: MODAL_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // PanResponder for swipe left to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx < -10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.min(0, gestureState.dx));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          onClose();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View
        style={[
          styles.modal,
          { 
            transform: [{ translateX }],
            backgroundColor: themeColors.background,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Logout Icon */}
        <TouchableOpacity style={styles.logout} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={28} color={themeColors.icon} />
        </TouchableOpacity>
        {/* Avatar */}
        <Image
          source={require('../assets/images/Penguin.jpg')}
          style={styles.avatar}
        />
        <Text style={[styles.username, { color: themeColors.text }]}>u/User</Text>
        {/* Online Status */}
        <TouchableOpacity style={[styles.statusContainer, { borderColor: online ? '#00E676' : '#ccc' }]} onPress={() => setOnline(o => !o)}>
          <View style={[styles.statusDot, { backgroundColor: online ? '#00E676' : '#ccc' }]} />
          <Text style={[styles.statusText, { color: online ? '#00E676' : '#ccc' }]}>Online Status: {online ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        {/* Menu */}
        <View style={[styles.menu, { backgroundColor: themeColors.card }]}> 
          <TouchableOpacity style={styles.menuItem} onPress={() => { /* handle profile press */ }}>
            <Ionicons name="person-circle-outline" size={28} color="#ccc" />
            <Text style={[styles.menuText, { color: themeColors.text }]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { /* handle bookmarks press */ }}>
            <Feather name="bookmark" size={26} color="#bbb" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: themeColors.text }]}>Bookmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { /* handle settings press */ }}>
            <Feather name="settings" size={26} color="#bbb" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: themeColors.text }]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { /* handle help center press */ }}>
            <Entypo name="help" size={26} color="#bbb" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: themeColors.text }]}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, {marginTop: 16, flexDirection: 'row', alignItems: 'center'}]} onPress={toggleTheme}>
            <MaterialIcons name="nightlight-round" size={26} color={themeColors.icon} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: themeColors.text, marginLeft: 12 }]}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: MODAL_WIDTH,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  logout: {
    position: 'absolute',
    left: 24,
    top: 24,
    zIndex: 2,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginTop: 8,
    marginBottom: 8,
  },
  username: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 18,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  menu: {
    width: '100%',
    backgroundColor: '#fafafa',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  menuText: {
    fontSize: 17,
    marginLeft: 18,
    color: '#222',
  },
  menuIcon: {
    marginRight: 0,
  },
}); 