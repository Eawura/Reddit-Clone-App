import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, PanResponder, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from './BookmarkContext';
import { usePosts } from './PostContext';
import { useProfile } from './ProfileContext';
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
  const { profile, setProfile } = useProfile();
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const { theme, toggleTheme, themeColors } = useTheme();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [avatarUri, setAvatarUri] = useState(profile.avatar);
  const { collections, removeBookmark } = useBookmarks();
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [allowChatRequests, setAllowChatRequests] = useState(true);
  const [allowFollowRequests, setAllowFollowRequests] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [allowProfileViews, setAllowProfileViews] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [markdownEnabled, setMarkdownEnabled] = useState(true);
  const [autoExpandMedia, setAutoExpandMedia] = useState(true);
  const [showTrendingCommunities, setShowTrendingCommunities] = useState(true);
  const [showRecommendedPosts, setShowRecommendedPosts] = useState(true);
  const [allowPersonalizedAds, setAllowPersonalizedAds] = useState(false);
  const [allowDataCollection, setAllowDataCollection] = useState(false);
  const { posts } = usePosts();
  const [followers] = useState(0);
  const [following] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const userPosts = posts.filter(p => p.user === profile.username);

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
      mediaTypes: [ImagePicker.MediaType.IMAGE],
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
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    const newProfileData = {
      username: editUsername,
      bio: editBio,
      avatar: avatarUri
    };
    setProfile(newProfileData);
    setShowProfileDetails(false);
    
    // Show success message
    Alert.alert('Success', 'Profile updated successfully!');
  };

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings();
  }, [
    notifications, autoPlay, dataSaver, profile, online, emailNotifications,
    markdownEnabled, autoExpandMedia, showTrendingCommunities, showRecommendedPosts,
    profileVisible, allowDirectMessages, allowChatRequests, allowFollowRequests,
    showOnlineStatus, allowSearchEngines, allowProfileViews, twoFactorEnabled,
    allowPersonalizedAds, allowDataCollection
  ]);

  // Save settings to AsyncStorage
  const saveSettings = async () => {
    try {
      const settings = {
        notifications,
        autoPlay,
        dataSaver,
        profile,
        online,
        emailNotifications,
        markdownEnabled,
        autoExpandMedia,
        showTrendingCommunities,
        showRecommendedPosts,
        profileVisible,
        allowDirectMessages,
        allowChatRequests,
        allowFollowRequests,
        showOnlineStatus,
        allowSearchEngines,
        allowProfileViews,
        twoFactorEnabled,
        allowPersonalizedAds,
        allowDataCollection
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotifications(parsed.notifications ?? true);
        setAutoPlay(parsed.autoPlay ?? false);
        setDataSaver(parsed.dataSaver ?? false);
        setProfile(parsed.profile ?? { username: 'u/User', bio: 'This is my bio.', avatar: null });
        setOnline(parsed.online ?? true);
        setEmailNotifications(parsed.emailNotifications ?? true);
        setMarkdownEnabled(parsed.markdownEnabled ?? true);
        setAutoExpandMedia(parsed.autoExpandMedia ?? true);
        setShowTrendingCommunities(parsed.showTrendingCommunities ?? true);
        setShowRecommendedPosts(parsed.showRecommendedPosts ?? true);
        setProfileVisible(parsed.profileVisible ?? true);
        setAllowDirectMessages(parsed.allowDirectMessages ?? true);
        setAllowChatRequests(parsed.allowChatRequests ?? true);
        setAllowFollowRequests(parsed.allowFollowRequests ?? true);
        setShowOnlineStatus(parsed.showOnlineStatus ?? true);
        setAllowSearchEngines(parsed.allowSearchEngines ?? false);
        setAllowProfileViews(parsed.allowProfileViews ?? true);
        setTwoFactorEnabled(parsed.twoFactorEnabled ?? false);
        setAllowPersonalizedAds(parsed.allowPersonalizedAds ?? false);
        setAllowDataCollection(parsed.allowDataCollection ?? false);
        
        // Update edit fields
        setEditUsername(parsed.username ?? 'u/User');
        setEditBio(parsed.bio ?? 'This is my bio.');
        setAvatarUri(parsed.avatar ?? null);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
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
            { backgroundColor: themeColors.background, paddingTop: Platform.OS === 'ios' ? 56 : 32 }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Logout Icon */}
          <TouchableOpacity style={styles.logout} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={28} color={themeColors.icon} />
          </TouchableOpacity>
          {/* Avatar */}
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
            <View style={styles.redditAvatarContainer}>
              <Image
                source={avatarUri ? { uri: avatarUri } : require('../assets/images/Penguin.png')}
                style={styles.redditAvatar}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cameraBadge}>
              <Feather name="camera" size={20} color={themeColors.text} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.username, { color: themeColors.text }]}>{profile.username}</Text>
          {/* Online Status */}
          <TouchableOpacity style={[styles.statusContainer, { borderColor: online ? '#46D160' : themeColors.border }]} onPress={() => setOnline(o => !o)}>
            <View style={[styles.statusDot, { backgroundColor: online ? '#46D160' : themeColors.border }]} />
            <Text style={[styles.statusText, { color: online ? '#46D160' : themeColors.border }]}>Online Status: {online ? 'On' : 'Off'}</Text>
          </TouchableOpacity>
          {/* Menu */}
          <View style={[styles.menu, { backgroundColor: themeColors.card }]}> 
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowProfileDetails(true)}>
              <Ionicons name="person-circle-outline" size={28} color={themeColors.text} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowBookmarks(true)}>
              <Feather name="bookmark" size={26} color={themeColors.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Bookmarks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
              <Feather name="settings" size={26} color={themeColors.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: themeColors.text }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setShowFAQ(true)}>
              <Entypo name="help" size={26} color={themeColors.text} style={styles.menuIcon} />
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
                            <Feather name="bookmark" size={22} color={themeColors.accent} />
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
                <TouchableOpacity 
                  style={[styles.settingItem, { borderBottomColor: themeColors.border }]}
                  onPress={() => setShowPrivacySettings(true)}
                >
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
                      <Feather name="camera" size={20} color={themeColors.text} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.text }}>{userPosts.length}</Text>
                    <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>Posts</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.text }}>{followers}</Text>
                    <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>Followers</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.text }}>{following}</Text>
                    <Text style={{ fontSize: 13, color: themeColors.textSecondary, marginTop: 2 }}>Following</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: themeColors.border, marginBottom: 18 }} />
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
                  <TouchableOpacity style={styles.profileDetailsSave} onPress={handleSaveProfile}>
                    <Text style={[styles.profileDetailsSaveText, { color: '#fff' }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacySettings}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPrivacySettings(false)}
      >
        <View style={[styles.faqBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.faqModal, { backgroundColor: themeColors.background }]}>
            <View style={styles.faqHeader}>
              <Text style={[styles.faqTitle, { color: themeColors.text }]}>Privacy & Security</Text>
              <TouchableOpacity onPress={() => setShowPrivacySettings(false)}>
                <Ionicons name="close" size={28} color={themeColors.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.faqContent} showsVerticalScrollIndicator={false}>
              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Privacy</Text>
                
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="eye" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Profile Visibility</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Who can see your profile</Text>
                    </View>
                  </View>
                  <Switch
                    value={profileVisible}
                    onValueChange={setProfileVisible}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={profileVisible ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="chatbubble" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Direct Messages</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow users to send you direct messages</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowDirectMessages}
                    onValueChange={setAllowDirectMessages}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowDirectMessages ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="chatbubbles" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Chat Requests</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow users to start chat conversations</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowChatRequests}
                    onValueChange={setAllowChatRequests}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowChatRequests ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="person-add" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Follow Requests</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow users to follow your profile</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowFollowRequests}
                    onValueChange={setAllowFollowRequests}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowFollowRequests ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="radio-button-on" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Show Online Status</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Display when you're active on the platform</Text>
                    </View>
                  </View>
                  <Switch
                    value={showOnlineStatus}
                    onValueChange={setShowOnlineStatus}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={showOnlineStatus ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="search" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Search Engine Indexing</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow search engines to index your profile</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowSearchEngines}
                    onValueChange={setAllowSearchEngines}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowSearchEngines ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Security</Text>
                
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="shield-checkmark" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Two-Factor Authentication</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Add an extra layer of security to your account</Text>
                    </View>
                  </View>
                  <Switch
                    value={twoFactorEnabled}
                    onValueChange={setTwoFactorEnabled}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={twoFactorEnabled ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="key" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Change Password</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Update your account password</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="phone-portrait" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Active Sessions</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Manage devices logged into your account</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Content & Display</Text>
                
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="mail" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Email Notifications</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Receive email updates about your account</Text>
                    </View>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={emailNotifications ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="code" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Markdown Support</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Enable markdown formatting in posts and comments</Text>
                    </View>
                  </View>
                  <Switch
                    value={markdownEnabled}
                    onValueChange={setMarkdownEnabled}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={markdownEnabled ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="play-circle" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Auto-Expand Media</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Automatically expand images and videos in posts</Text>
                    </View>
                  </View>
                  <Switch
                    value={autoExpandMedia}
                    onValueChange={setAutoExpandMedia}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={autoExpandMedia ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="trending-up" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Trending Communities</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Show trending communities in your feed</Text>
                    </View>
                  </View>
                  <Switch
                    value={showTrendingCommunities}
                    onValueChange={setShowTrendingCommunities}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={showTrendingCommunities ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="bulb" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Recommended Posts</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Show personalized post recommendations</Text>
                    </View>
                  </View>
                  <Switch
                    value={showRecommendedPosts}
                    onValueChange={setShowRecommendedPosts}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={showRecommendedPosts ? '#fff' : '#f4f3f4'}
                  />
                </View>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Data & Privacy</Text>
                
                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="megaphone" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Personalized Ads</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow personalized advertising based on your activity</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowPersonalizedAds}
                    onValueChange={setAllowPersonalizedAds}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowPersonalizedAds ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <View style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="analytics" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Data Collection</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Allow collection of usage data to improve the app</Text>
                    </View>
                  </View>
                  <Switch
                    value={allowDataCollection}
                    onValueChange={setAllowDataCollection}
                    trackColor={{ false: '#767577', true: '#FF4500' }}
                    thumbColor={allowDataCollection ? '#fff' : '#f4f3f4'}
                  />
                </View>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="download" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Download My Data</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Request a copy of your personal data</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="trash" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Delete Account</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Permanently delete your account and all data</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>
              </View>

              <View style={styles.settingsSection}>
                <Text style={[styles.settingsSectionTitle, { color: themeColors.text }]}>Account Actions</Text>
                
                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="log-out" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Sign Out</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Sign out of your account on this device</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { borderBottomColor: themeColors.border }]}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="help-circle" size={24} color={themeColors.icon} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingTitle, { color: themeColors.text }]}>Privacy Policy</Text>
                      <Text style={[styles.settingDescription, { color: themeColors.textSecondary }]}>Read our privacy policy and terms of service</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themeColors.icon} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
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
    top: 32,
    right: 16,
    marginTop: 12,
    zIndex: 10,
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
  redditAvatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f6f7f8', // Reddit's soft ash/gray
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
  },
  redditAvatar: {
    width: 90,
    height: 90,
  },
}); 