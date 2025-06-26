import { AntDesign, Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import data from './data.json';

const imageMap = {
  'harry logo.webp': require('../../assets/images/harry logo.webp'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'Logo-NBA.png': require('../../assets/images/Logo-NBA.png'),
  'curry.jpg': require('../../assets/images/curry.jpg'),
  'fifa logo.jpg': require('../../assets/images/fifa logo.jpg'),
  'Messi.jpg': require('../../assets/images/Messi.jpg'),
  'Grand.jpeg': require('../../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../../assets/images/Ramen.jpeg'),
  // Add more mappings as needed
};

const Post = ({ post, onLike, onDislike, onComment, onShare }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={imageMap[post.avatar] ? imageMap[post.avatar] : { uri: post.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.postUser}>{post.user} <Text style={styles.postTime}>• {post.time}</Text></Text>
        <Text style={styles.postTitle}>{post.title}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={20} color="#000" />
      </TouchableOpacity>
    </View>
    <Image source={imageMap[post.image] ? imageMap[post.image] : { uri: post.image }} style={styles.postImage} />
    <View style={styles.postActions}>
      <View style={styles.actionGroup}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post.id)}>
          <AntDesign name={post.liked ? 'heart' : 'hearto'} size={20} color={post.liked ? '#e74c3c' : '#ccc'} />
          <Text style={[styles.actionText, post.liked && { color: '#e74c3c', fontWeight: 'bold' }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onDislike(post.id)}>
          <MaterialIcons name="heart-broken" size={24} color={post.disliked ? '#e74c3c' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onComment(post.id)}>
          <Feather name="message-circle" size={20} color="#ccc" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onShare(post.id)}>
        <Feather name="share-2" size={20} color="#ccc" />
        <Text style={styles.actionText}>{post.shares}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Header = ({ menuOpen, setMenuOpen, onProfilePress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background }] }>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => setMenuOpen(open => !open)}>
          <Feather name="menu" size={28} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
          <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Neoping </Text>
          <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={{marginRight: 16}}>
          <Ionicons name="search" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const index = () => {
  const [posts, setPosts] = useState(data.posts.map(p => ({ ...p, liked: false, disliked: false })));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLike = (id) => {
    setPosts(posts => posts.map(post => {
      if (post.id === id) {
        if (post.liked) {
          return { ...post, liked: false, likes: post.likes - 1 };
        } else {
          return { ...post, liked: true, disliked: false, likes: post.likes + 1 };
        }
      }
      return post;
    }));
  };

  const handleDislike = (id) => {
    setPosts(posts => posts.map(post => {
      if (post.id === id) {
        if (post.disliked) {
          return { ...post, disliked: false };
        } else {
          return { ...post, disliked: true, liked: false, likes: post.liked ? post.likes - 1 : post.likes };
        }
      }
      return post;
    }));
  };

  const handleComment = (id) => {
    // Placeholder: In a real app, open comment modal or navigate
    alert('Open comments for post ' + id);
  };

  const handleShare = (id) => {
    // Placeholder: In a real app, open share dialog
    alert('Share post ' + id);
  };

  const handleShowUrlInput = () => setShowUrlInput(true);
  const handleRemoveUrlInput = () => {
    setShowUrlInput(false);
    setUrl('');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(data.posts.map(p => ({ ...p, liked: false, disliked: false })));
      setRefreshing(false);
    }, 1200);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }] }>
        <ActivityIndicator size="large" color="#2E45A3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => setProfileModalVisible(true)} />
      <PopupMenu visible={menuOpen} router={router} />
      <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); router.replace('/'); }} />
      {pathname === '/watch' ? (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 40, paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, marginLeft: 6 }}>There is no content to display</Text>
          <Text style={{ fontWeight: '500', fontSize: 16, marginLeft: 6 }}>We were unable to find any content for this page</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Post post={item} onLike={handleLike} onDislike={handleDislike} onComment={handleComment} onShare={handleShare} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#888', fontSize: 16 }}>No posts to show. Pull to refresh!</Text>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 0,
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postUser: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
  },
  postTime: {
    color: '#888',
    fontWeight: 'normal',
    fontSize: 12,
  },
  postTitle: {
    color: '#111',
    fontSize: 15,
    marginTop: 2,
    marginBottom: 4,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    color: '#bbb',
    fontSize: 14,
  },
  separator: {
    height: 10,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#2E45A3',
    fontWeight: 'bold',
    fontSize: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default index;