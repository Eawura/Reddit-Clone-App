import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, KeyboardAvoidingView, Modal, PanResponder, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from './BookmarkContext';
import { useTheme } from './ThemeContext';

const { width } = Dimensions.get('window');
const MODAL_WIDTH = width * 0.8;

// Image mapping for profile pictures and post images
const imageMap = {
  'curry.jpg': require('../assets/images/curry.jpg'),
  'Messi.jpg': require('../assets/images/Messi.jpg'),
  'harry logo.webp': require('../assets/images/harry logo.webp'),
  'Penguin.jpg': require('../assets/images/Penguin.jpg'),
  'D.jpg': require('../assets/images/D.jpg'),
  'K.jpg': require('../assets/images/K.jpg'),
  'MB.jpg': require('../assets/images/MB.jpg'),
  'N.webp': require('../assets/images/N.webp'),
  'Ronaldo.jpg': require('../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../assets/images/SGA.jpg'),
  'T1.jpg': require('../assets/images/T1.jpg'),
  'w1.jpg': require('../assets/images/w1.jpg'),
  'yu.jpg': require('../assets/images/yu.jpg'),
  'Random.jpg': require('../assets/images/Random.jpg'),
  'Grand.jpeg': require('../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../assets/images/Ramen.jpeg'),
  'M8 bmw.jpg': require('../assets/images/M8 bmw.jpg'),
  "euro's league logo.jpg": require("../assets/images/euro's league logo.jpg"),
  'fifa logo.jpg': require('../assets/images/fifa logo.jpg'),
  'Logo-NBA.png': require('../assets/images/Logo-NBA.png'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'danny-1.webp': require('../assets/images/danny-1.webp'),
  // Commenter profile images
  'commenter1.jpg': require('../assets/images/Commenter1.jpg'),
  'commenter2.jpg': require('../assets/images/Commenter2.jpg'),
  'commenter3.jpg': require('../assets/images/Commenter3.jpg'),
  'commenter4.jpg': require('../assets/images/Commenter4.jpg'),
  'commenter5.jpg': require('../assets/images/Commenter5.jpg'),
  'commenter6.jpg': require('../assets/images/Commenter6.jpg'),
  'commenter7.jpg': require('../assets/images/Commenter7.jpg'),
  'commenter8.jpg': require('../assets/images/Commenter8.jpg'),
  'commenter9.jpg': require('../assets/images/Commenter9.jpg'),
  'commenter10.jpg': require('../assets/images/Commenter10.jpg'),
};

export default function ProfileModal({ visible, onClose, onLogout, bookmarks = [], onUnbookmark }) {
  const translateX = useRef(new Animated.Value(MODAL_WIDTH)).current;
  const [online, setOnline] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const { theme, toggleTheme, themeColors } = useTheme();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [editUsername, setEditUsername] = useState('u/User');
  const [editBio, setEditBio] = useState('This is my bio.');
  const { collections, removeBookmark } = useBookmarks();

  // FAQ data
  const faqData = [
    {
      question: "How do I create a new post?",
      answer: "Tap the '+' button in the bottom navigation bar to create a new post. You can add text, images, and choose which community to post to."
    },
    {
      question: "How do I join a community?",
      answer: "Navigate to the Communities tab, search for a community you're interested in, and tap the 'Join' button to become a member."
    },
    {
      question: "How do I change my profile picture?",
      answer: "Go to your profile settings and tap on your current profile picture to upload a new one from your device."
    },
    {
      question: "How do I enable dark mode?",
      answer: "Open your profile modal and tap the 'Dark Mode' toggle at the bottom of the menu to switch between light and dark themes."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Tap the three dots menu on any post or comment and select 'Report' to flag content that violates our community guidelines."
    },
    {
      question: "How do I block a user?",
      answer: "Go to the user's profile, tap the three dots menu, and select 'Block User' to prevent them from interacting with you."
    },
    {
      question: "How do I save posts for later?",
      answer: "Tap the bookmark icon on any post to save it. You can view all your saved posts in the Bookmarks section of your profile."
    },
    {
      question: "How do I edit my post?",
      answer: "Tap the three dots menu on your own post and select 'Edit' to modify the content. Note that edited posts will show an 'edited' indicator."
    }
  ];

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

  // Image Picker Handlers
  const pickImage = async () => {
    setShowAvatarPicker(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    setShowAvatarPicker(false);
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <>
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
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
            <Image
              source={avatarUri ? { uri: avatarUri } : require('../assets/images/Penguin.jpg')}
              style={styles.avatar}
            />
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.username, { color: themeColors.text }]}>u/User</Text>
          {/* Online Status */}
          <TouchableOpacity style={[styles.statusContainer, { borderColor: online ? '#00E676' : '#ccc' }]} onPress={() => setOnline(o => !o)}>
            <View style={[styles.statusDot, { backgroundColor: online ? '#00E676' : '#ccc' }]} />
            <Text style={[styles.statusText, { color: online ? '#00E676' : '#ccc' }]}>Online Status: {online ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
          {/* Menu */}
          <View style={[styles.menu, { backgroundColor: themeColors.card }]}> 
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowProfileDetails(true)}>
              <Ionicons name="person-circle-outline" size={28} color="#ccc" />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowBookmarks(true)}>
              <Feather name="bookmark" size={26} color="#bbb" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Bookmarks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
              <Feather name="settings" size={26} color="#bbb" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowFAQ(true)}>
              <Entypo name="help" size={26} color="#bbb" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>FAQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, {marginTop: 16, flexDirection: 'row', alignItems: 'center'}]} onPress={toggleTheme}>
              <MaterialIcons name="nightlight-round" size={26} color={themeColors.icon} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text, marginLeft: 12 }]}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <TouchableOpacity style={styles.avatarPickerBackdrop} activeOpacity={1} onPress={() => setShowAvatarPicker(false)} />
        <View style={[styles.avatarPickerModal, { backgroundColor: themeColors.card }]}> 
          <Text style={[styles.avatarPickerTitle, { color: themeColors.text }]}>Change Profile Picture</Text>
          <TouchableOpacity style={styles.avatarPickerOption} onPress={takePhoto}>
            <Feather name="camera" size={22} color={themeColors.icon} />
            <Text style={[styles.avatarPickerText, { color: themeColors.text }]}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarPickerOption} onPress={pickImage}>
            <Feather name="image" size={22} color={themeColors.icon} />
            <Text style={[styles.avatarPickerText, { color: themeColors.text }]}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarPickerCancel} onPress={() => setShowAvatarPicker(false)}>
            <Text style={[styles.avatarPickerCancelText, { color: themeColors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        visible={showFAQ}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFAQ(false)}
      >
        <View style={[styles.faqBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.faqModal, { backgroundColor: themeColors.background }]}>
            <View style={styles.faqHeader}>
              <Text style={[styles.faqTitle, { color: themeColors.text }]}>Frequently Asked Questions</Text>
              <TouchableOpacity onPress={() => setShowFAQ(false)}>
                <Ionicons name="close" size={28} color={themeColors.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.faqContent} showsVerticalScrollIndicator={false}>
              {faqData.map((item, index) => (
                <View key={index} style={[styles.faqItem, { borderBottomColor: themeColors.border }]}>
                  <Text style={[styles.faqQuestion, { color: themeColors.text }]}>{item.question}</Text>
                  <Text style={[styles.faqAnswer, { color: themeColors.textSecondary }]}>{item.answer}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bookmarks Modal */}
      <Modal
        visible={showBookmarks}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookmarks(false)}
      >
        <View style={[styles.faqBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}> 
          <View style={[styles.faqModal, { backgroundColor: themeColors.background }]}> 
            <View className="faqHeader">
              <Text style={[styles.faqTitle, { color: themeColors.text }]}>Bookmarks</Text>
              <TouchableOpacity onPress={() => setShowBookmarks(false)}>
                <Ionicons name="close" size={28} color={themeColors.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.faqContent} showsVerticalScrollIndicator={false}>
              {Object.keys(collections).length === 0 || Object.values(collections).every(arr => arr.length === 0) ? (
                <View style={styles.emptyState}>
                  <Feather name="bookmark" size={48} color={themeColors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: themeColors.textSecondary }]}>No bookmarks yet</Text>
                  <Text style={[styles.emptyStateSubtext, { color: themeColors.textSecondary }]}>Save posts you want to read later</Text>
                </View>
              ) : (
                Object.entries(collections).map(([collection, posts]) => (
                  posts.length === 0 ? null : (
                    <View key={collection} style={{ marginBottom: 18 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: themeColors.text }}>{collection}</Text>
                      {posts.map(post => (
                        <View key={post.id} style={styles.bookmarkItem}>
                          <Image source={post.image ? (post.image.startsWith('http') ? { uri: post.image } : imageMap[post.image]) : null} style={styles.bookmarkImage} />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.bookmarkTitle} numberOfLines={1}>{post.title}</Text>
                            <Text style={styles.bookmarkUser} numberOfLines={1}>{post.user}</Text>
                          </View>
                          <TouchableOpacity onPress={() => removeBookmark(post.id, collection)}>
                            <Feather name="bookmark" size={22} color="#2E45A3" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={[styles.faqBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.faqModal, { backgroundColor: themeColors.background }]}>
            <View style={styles.faqHeader}>
              <Text style={[styles.faqTitle, { color: themeColors.text }]}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={28} color={themeColors.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.faqContent} showsVerticalScrollIndicator={false}>
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Notifications</Text>
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="notifications" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Push Notifications</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Receive notifications for new posts and comments</Text>
                    </View>
                  </View>
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={notifications ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Content</Text>
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="play-circle" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Auto-play Videos</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Automatically play videos in your feed</Text>
                    </View>
                  </View>
                  <Switch
                    value={autoPlay}
                    onValueChange={setAutoPlay}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={autoPlay ? '#fff' : '#f4f3f4'}
                  />
                </View>
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="cellular" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Data Saver</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Reduce data usage by loading lower quality images</Text>
                    </View>
                  </View>
                  <Switch
                    value={dataSaver}
                    onValueChange={setDataSaver}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={dataSaver ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Account</Text>
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]} onPress={() => { setShowSettings(false); setShowProfileDetails(true); }}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="person" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Edit Profile</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Change your username, bio, and profile picture</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="shield-checkmark" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Privacy & Security</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Manage your privacy settings and security</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile Details Modal */}
      <Modal
        visible={showProfileDetails}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProfileDetails(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={[styles.faqBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}> 
            <View style={[styles.profileDetailsModal, { backgroundColor: themeColors.background }]}> 
              <View style={styles.faqHeader}>
                <Text style={[styles.faqTitle, { color: themeColors.text }]}>Profile Details</Text>
                <TouchableOpacity onPress={() => setShowProfileDetails(false)}>
                  <Ionicons name="close" size={28} color={themeColors.icon} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                  <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
                    <Image
                      source={avatarUri ? { uri: avatarUri } : require('../assets/images/Penguin.jpg')}
                      style={styles.profileDetailsAvatar}
                    />
                    <View style={styles.cameraBadge}>
                      <Feather name="camera" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.inputLabel, { color: themeColors.text }]}>Username</Text>
                <TextInput
                  style={[styles.input, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.card }]}
                  value={editUsername}
                  onChangeText={setEditUsername}
                  placeholder="Username"
                  placeholderTextColor={themeColors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={[styles.inputLabel, { color: themeColors.text, marginTop: 20 }]}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.inputBio, { color: themeColors.text, borderColor: themeColors.border, backgroundColor: themeColors.card }]}
                  value={editBio}
                  onChangeText={setEditBio}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                  numberOfLines={3}
                  maxLength={120}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 32 }}>
                  <TouchableOpacity style={styles.profileDetailsCancel} onPress={() => setShowProfileDetails(false)}>
                    <Text style={[styles.profileDetailsCancelText, { color: themeColors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileDetailsSave} onPress={() => { setShowProfileDetails(false); }}>
                    <Text style={[styles.profileDetailsSaveText, { color: '#fff' }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
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
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 0,
    ...Platform.select({
      web: {
        boxShadow: '-2px 0px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
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
  // FAQ Modal Styles
  faqBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 0,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  faqContent: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Bookmarks Styles
  bookmarkItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  bookmarkImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 22,
  },
  bookmarkUser: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Settings Styles
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FF4500',
    borderRadius: 14,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  avatarPickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  avatarPickerModal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px -2px 8px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  avatarPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 18,
  },
  avatarPickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    width: '100%',
  },
  avatarPickerText: {
    fontSize: 16,
    marginLeft: 16,
  },
  avatarPickerCancel: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  avatarPickerCancelText: {
    fontSize: 16,
    color: '#888',
  },
  profileDetailsModal: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 16,
    padding: 0,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  profileDetailsAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputBio: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  profileDetailsCancel: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginRight: 12,
  },
  profileDetailsCancelText: {
    fontSize: 16,
  },
  profileDetailsSave: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#FF4500',
  },
  profileDetailsSaveText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 