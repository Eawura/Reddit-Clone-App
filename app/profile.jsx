import { AntDesign } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePosts } from '../components/PostContext';
import { useTheme } from '../components/ThemeContext';
import { formatNumber } from '../utils/numberUtils';
import { getRelativeTime } from '../utils/timeUtils';

const imageMap = {
  'harry logo.webp': require('../assets/images/harry logo.webp'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'Logo-NBA.png': require('../assets/images/Logo-NBA.png'),
  'curry.jpg': require('../assets/images/curry.jpg'),
  'fifa logo.jpg': require('../assets/images/fifa logo.jpg'),
  'Messi.jpg': require('../assets/images/Messi.jpg'),
  'Grand.jpeg': require('../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../assets/images/Ramen.jpeg'),
  'w1.jpg': require('../assets/images/w1.jpg'),
  'T1.jpg': require('../assets/images/T1.jpg'),
  'yu.jpg': require('../assets/images/yu.jpg'),
  'Ronaldo.jpg': require('../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../assets/images/SGA.jpg'),
  "euro's league logo.jpg": require("../assets/images/euro's league logo.jpg"),
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
  'Cole Palmer.jpg': require('../assets/images/Cole Palmer.jpg'),
  'CWC.jpg': require('../assets/images/CWC.jpg'),
  // --- merged from news.jsx ---
  'Penguin.jpg': require('../assets/images/Penguin.jpg'),
  'D.jpg': require('../assets/images/D.jpg'),
  'K.jpg': require('../assets/images/K.jpg'),
  'MB.jpg': require('../assets/images/MB.jpg'),
  'N.webp': require('../assets/images/N.webp'),
  'Random.jpg': require('../assets/images/Random.jpg'),
  'M8 bmw.jpg': require('../assets/images/M8 bmw.jpg'),
  'science.jpg': require('../assets/images/science.jpg'),
  'ESPN.jpg': require('../assets/images/ESPN.jpg'),
  'Pulse-on-Global-Health.jpg': require('../assets/images/Pulse-on-Global-Health.jpg'),
  'ai-breakthrough-tech.jpg': require('../assets/images/ai-breakthrough-tech.jpg'),
  'underdog-championship-sports.jpg': require('../assets/images/underdog-championship-sports.jpg'),
  'exercise-study-science.jpg': require('../assets/images/exercise-study-science.jpg'),
  'director-blockbuster-entertainment.jpg': require('../assets/images/director-blockbuster-entertainment.jpg'),
  'global-markets-business.jpg': require('../assets/images/global-markets-business.jpg'),
  'climate-legislation-politics.jpg': require('../assets/images/climate-legislation-politics.jpg'),
  'cancer-treatment-health.jpg': require('../assets/images/cancer-treatment-health.jpg'),
  'quantum-computing-technology.jpg': require('../assets/images/quantum-computing-technology.jpg'),
  'image-fallback.jpg': require('../assets/images/Random.jpg'),
  'danny-1.webp': require('../assets/images/danny-1.webp'),
  'Tech.png': require('../assets/images/Tech.png'),
  'Science1.png': require('../assets/images/Science1.png'),
  'AnimalA.png': require('../assets/images/AnimalA.png'),
  'TravelA.png': require('../assets/images/TravelA.png'),
  'Ai.png': require('../assets/images/Ai.png'),
  'Travel.png': require('../assets/images/Travel.png'),
  'Monkey.png': require('../assets/images/Monkey.png'),
  'BM.png': require('../assets/images/BM.png'),
  'p.png': require('../assets/images/p.png'),
  'Dis.png': require('../assets/images/Dis.png'),
};

const ProfileView = () => {
  const { themeColors } = useTheme();
  const router = useRouter();
  const { userId, username, avatar, followers: followersParam, following: followingParam } = useLocalSearchParams();
  const { posts: globalPosts } = usePosts();
  const [activeTab, setActiveTab] = useState('Posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers] = useState(followersParam ? parseInt(followersParam, 10) : 1234);
  const [following] = useState(followingParam ? parseInt(followingParam, 10) : 56);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const joinedDate = 'Joined Jan 2022';
  const fullName = username ? username.replace(/^u\//, '').replace(/_/g, ' ') : 'User';
  const atUsername = username ? `@${username.replace(/^u\//, '').replace(/\s+/g, '').toLowerCase()}` : '@user';
  const bio = 'This is a sample bio. You can add more info here.';
  const userPosts = globalPosts.filter(p => (p.user || '').toLowerCase() === (username || '').toLowerCase());
  const bannerHeight = 140;
  const avatarSize = 96;
  const flatListRef = useRef(null);

  // Header for FlatList
  const renderHeader = () => (
    <>
      {/* Back Icon */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ position: 'absolute', top: 36, left: 16, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 20, padding: 4 }}
        activeOpacity={0.7}
      >
        <AntDesign name="arrowleft" size={26} color="#222" />
      </TouchableOpacity>
      {/* Banner */}
      <View style={{ height: bannerHeight, backgroundColor: '#d9d9d9', width: '100%' }} />
      {/* Avatar - overlaps banner */}
      <View style={{ position: 'absolute', top: bannerHeight - avatarSize / 2, left: 16, zIndex: 2 }}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setAvatarModalVisible(true)}>
          <Image source={avatar && imageMap[avatar] ? imageMap[avatar] : require('../assets/images/Commenter1.jpg')} style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2, borderWidth: 4, borderColor: themeColors.background, backgroundColor: '#eee' }} />
        </TouchableOpacity>
      </View>
      {/* Avatar Fullscreen Modal */}
      <Modal visible={avatarModalVisible} transparent animationType="fade" onRequestClose={() => setAvatarModalVisible(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => setAvatarModalVisible(false)}>
          <Image source={avatar && imageMap[avatar] ? imageMap[avatar] : require('../assets/images/Commenter1.jpg')} style={{ width: 280, height: 280, borderRadius: 140, borderWidth: 4, borderColor: '#fff', backgroundColor: '#eee' }} />
        </TouchableOpacity>
      </Modal>
      {/* Profile Info */}
      <View style={{ marginTop: avatarSize / 2 + 12, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: themeColors.text }}>{fullName}</Text>
        <Text style={{ color: themeColors.textSecondary, fontSize: 16, marginTop: 2 }}>{atUsername}</Text>
        <Text style={{ color: themeColors.textSecondary, fontSize: 14, marginTop: 2 }}>{joinedDate}</Text>
        <Text style={{ color: themeColors.text, fontSize: 15, marginTop: 10 }}>{bio}</Text>
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', marginTop: 14, marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: themeColors.text, fontSize: 15 }}>{formatNumber(following)}</Text>
          <Text style={{ color: themeColors.textSecondary, fontSize: 15, marginRight: 18, marginLeft: 4 }}>Following</Text>
          <Text style={{ fontWeight: 'bold', color: themeColors.text, fontSize: 15 }}>{formatNumber(followers)}</Text>
          <Text style={{ color: themeColors.textSecondary, fontSize: 15, marginLeft: 4 }}>Followers</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <TouchableOpacity style={{ backgroundColor: themeColors.accent, borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8, marginRight: 10 }} onPress={() => setIsFollowing(f => !f)}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#e0e0e0', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8 }}>
            <Text style={{ color: themeColors.text, fontWeight: 'bold' }}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Top Tab Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderColor: '#eee', marginTop: 18, marginBottom: 8 }}>
        {['Posts', 'Replies', 'Media', 'Likes'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              if (tab === 'Posts' && flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
              }
            }}
            style={{ paddingVertical: 12, borderBottomWidth: 2, borderColor: activeTab === tab ? themeColors.accent : 'transparent', flex: 1, alignItems: 'center' }}
          >
            <Text style={{ color: activeTab === tab ? themeColors.accent : themeColors.textSecondary, fontWeight: 'bold', fontSize: 16 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  // Data and render logic for FlatList
  let data = [];
  let emptyComponent = null;
  if (activeTab === 'Posts') {
    data = userPosts;
    emptyComponent = <View style={{ alignItems: 'center', marginTop: 32 }}><Text style={{ color: themeColors.textSecondary }}>No posts yet.</Text></View>;
  } else if (activeTab === 'Replies') {
    data = [];
    emptyComponent = <View style={{ alignItems: 'center', marginTop: 32 }}><Text style={{ color: themeColors.textSecondary }}>No replies yet.</Text></View>;
  } else if (activeTab === 'Media') {
    data = [];
    emptyComponent = <View style={{ alignItems: 'center', marginTop: 32 }}><Text style={{ color: themeColors.textSecondary }}>No media yet.</Text></View>;
  } else if (activeTab === 'Likes') {
    data = [];
    emptyComponent = <View style={{ alignItems: 'center', marginTop: 32 }}><Text style={{ color: themeColors.textSecondary }}>No liked posts yet.</Text></View>;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: themeColors.card, marginHorizontal: 0, marginBottom: 12, borderRadius: 10, padding: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: themeColors.text }}>{item.title}</Text>
            {item.content && <Text style={{ color: themeColors.text, marginTop: 4 }}>{item.content}</Text>}
            {item.image && <Image source={imageMap[item.image] ? imageMap[item.image] : require('../assets/images/Random.jpg')} style={{ width: '100%', height: 180, borderRadius: 8, marginTop: 8 }} />}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ color: themeColors.textSecondary, fontSize: 12, marginRight: 12 }}>{getRelativeTime(item.timestamp)}</Text>
              {item.likes !== undefined && (
                <Text style={{ color: themeColors.textSecondary, fontSize: 12, marginRight: 12 }}>Likes: {formatNumber(item.likes)}</Text>
              )}
              {item.comments !== undefined && (
                <Text style={{ color: themeColors.textSecondary, fontSize: 12 }}>Comments: {formatNumber(item.comments)}</Text>
              )}
            </View>
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={emptyComponent}
        contentContainerStyle={{ paddingBottom: 32 }}
        style={{ flex: 1, backgroundColor: themeColors.background }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientHeader: { paddingBottom: 24, paddingTop: 0 },
  profileCard: {
    alignItems: 'center',
    marginTop: 48,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  backButton: { position: 'absolute', left: 16, top: 48, zIndex: 2 },
  settingsButton: { position: 'absolute', right: 16, top: 48, zIndex: 2 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  bio: { fontSize: 15, marginBottom: 12, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, marginTop: 8 },
  statBox: { alignItems: 'center', marginHorizontal: 18 },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 13, opacity: 0.7 },
  followButton: { paddingHorizontal: 32, paddingVertical: 8, borderRadius: 20, marginBottom: 0, marginTop: 8 },
  divider: { height: 1, width: '100%', marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 16, marginBottom: 8 },
  postContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  postText: {
    fontSize: 15,
  },
  editButton: { marginTop: 10, paddingHorizontal: 18, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fff', alignSelf: 'center' },
  editModalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  editModal: { width: '85%', borderRadius: 18, padding: 20, alignItems: 'center', elevation: 4 },
  editModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  editAvatarButton: { alignItems: 'center', marginBottom: 12 },
  editLabel: { fontSize: 14, marginTop: 8, marginBottom: 2, alignSelf: 'flex-start' },
  editInput: { width: '100%', borderWidth: 1, borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 8 },
  editModalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  editCancelBtn: { flex: 1, alignItems: 'center', padding: 10 },
  editSaveBtn: { flex: 1, alignItems: 'center', padding: 10 },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDetails: {
    marginLeft: 4,
  },
  postTime: {
    fontSize: 12,
  },
  postContent: {
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginTop: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    // Remove marginTop/marginBottom to keep text beside icon
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4, // Add left margin to separate number from icon
    // Remove marginTop to keep text beside icon
  },
  saveButton: {
    marginLeft: 16,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  actionGroupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionGroupRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default ProfileView; 