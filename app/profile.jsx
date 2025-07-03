import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../components/ThemeContext';

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
  // Add more as needed
};

const ProfileView = () => {
  const { themeColors } = useTheme();
  const router = useRouter();
  const { user: userParam } = useLocalSearchParams();
  let user = {};
  try {
    user = typeof userParam === 'string' ? JSON.parse(userParam) : userParam || {};
  } catch {
    user = userParam || {};
  }
  const posts = user?.posts || [];
  // Simulate dynamic followers/following and follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(user.followers || Math.floor(Math.random() * 1000) + 100);
  const [following] = useState(user.following || Math.floor(Math.random() * 200) + 50);
  const bio = user.bio || 'No bio yet.';

  const handleFollow = () => {
    setIsFollowing(f => !f);
    setFollowers(f => isFollowing ? f - 1 : f + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <LinearGradient
        colors={[themeColors.accent + '22', themeColors.background]}
        style={styles.gradientHeader}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: themeColors.accent, fontSize: 18 }}>{'< Back'}</Text>
        </TouchableOpacity>
        <View style={styles.profileCard}>
          <Image source={user?.avatar && imageMap[user.avatar] ? imageMap[user.avatar] : require('../assets/images/Commenter1.jpg')} style={styles.avatar} />
          <Text style={[styles.username, { color: themeColors.text }]}>{user?.user || user?.author || 'User'}</Text>
          <Text style={[styles.bio, { color: themeColors.textSecondary }]}>{bio}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: themeColors.text }]}>{posts.length}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Posts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: themeColors.text }]}>{followers}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Followers</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: themeColors.text }]}>{following}</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Following</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.followButton, { backgroundColor: isFollowing ? themeColors.background : themeColors.accent, borderWidth: 1, borderColor: themeColors.accent }]}
            onPress={handleFollow}
          > 
            <Text style={{ color: isFollowing ? themeColors.accent : '#fff', fontWeight: 'bold' }}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Posts</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.postCard, { backgroundColor: themeColors.card }]}> 
            <Text style={[styles.postTitle, { color: themeColors.text }]}>{item.title}</Text>
            <Text style={[styles.postContent, { color: themeColors.textSecondary }]} numberOfLines={2}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: themeColors.textSecondary, textAlign: 'center', marginTop: 24 }}>No posts yet.</Text>}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
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
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12, borderWidth: 3, borderColor: '#fff' },
  username: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  bio: { fontSize: 15, marginBottom: 12, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, marginTop: 8 },
  statBox: { alignItems: 'center', marginHorizontal: 18 },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 13, opacity: 0.7 },
  followButton: { paddingHorizontal: 32, paddingVertical: 8, borderRadius: 20, marginBottom: 0, marginTop: 8 },
  divider: { height: 1, width: '100%', marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 16, marginBottom: 8 },
  postCard: { marginHorizontal: 16, marginBottom: 12, borderRadius: 10, padding: 14 },
  postTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  postContent: { fontSize: 14 },
});

export default ProfileView; 