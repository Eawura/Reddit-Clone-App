import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommentModal from '../components/CommentModal';
import ImageModal from '../components/ImageModal';
import { usePosts } from '../components/PostContext';
import { useProfile } from '../components/ProfileContext';
import { useTheme } from '../components/ThemeContext';
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

// Helper function to format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
function formatCount(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

const ProfileView = () => {
  const { themeColors } = useTheme();
  const router = useRouter();
  const { user: userParam, from, newsPosts, selectedPost: selectedPostParam } = useLocalSearchParams();
  const { profile: currentUser } = useProfile();
  const { posts: globalPosts, setPosts } = usePosts();
  let user = {};
  try {
    user = typeof userParam === 'string' ? JSON.parse(userParam) : userParam || {};
  } catch {
    user = userParam || {};
  }
  // Get userId from params (could be id or username)
  const userId = user.id;
  const username = (user.user || user.author || user.id || '').trim();
  const normalizedUsername = username.toLowerCase();
  // Debug logs for filtering
  let allUserFields = [];
  let posts = [];
  if (newsPosts) {
    try {
      let parsedNewsPosts = typeof newsPosts === 'string' ? JSON.parse(newsPosts) : newsPosts;
      // Map likes to upvotes if upvotes is undefined
      parsedNewsPosts = Array.isArray(parsedNewsPosts)
        ? parsedNewsPosts.map(p => ({ ...p, upvotes: p.upvotes !== undefined ? p.upvotes : (p.likes !== undefined ? p.likes : 0) }))
        : [];
      allUserFields = Array.isArray(parsedNewsPosts) ? parsedNewsPosts.map(p => (p.user || '').trim().toLowerCase()) : [];
      posts = Array.isArray(parsedNewsPosts)
        ? parsedNewsPosts.filter(p => (p.user || '').trim().toLowerCase() === normalizedUsername)
        : [];
    } catch {
      posts = [];
    }
  } else {
    allUserFields = Array.isArray(globalPosts) ? globalPosts.map(p => (p.user || '').trim().toLowerCase()) : [];
    posts = Array.isArray(globalPosts)
      ? globalPosts.filter(p => (p.user || '').trim().toLowerCase() === normalizedUsername)
      : [];
  }
  console.log('DEBUG: Profile normalized username:', normalizedUsername);
  console.log('DEBUG: All compared user fields:', allUserFields);

  let selectedPostObj = null;
  try {
    selectedPostObj = selectedPostParam ? (typeof selectedPostParam === 'string' ? JSON.parse(selectedPostParam) : selectedPostParam) : null;
  } catch {
    selectedPostObj = null;
  }

  // Demo commenters for all posts
  const demoCommenters = [
    { username: 'u/Commenter1', avatar: 'commenter1.jpg', text: 'This is amazing! Love the content.', time: '2 hours ago', likes: 12 },
    { username: 'u/Commenter2', avatar: 'commenter2.jpg', text: 'Great post! Thanks for sharing this.', time: '1 hour ago', likes: 8 },
    { username: 'u/Commenter3', avatar: 'commenter3.jpg', text: 'I totally agree with this. Well said!', time: '30 minutes ago', likes: 5 },
  ];
  // Local state for profile posts (for button interactions)
  const [profilePosts, setProfilePosts] = useState(() => posts.map(post => ({ ...post, comments: 3, commentsList: demoCommenters.map((c, i) => ({ ...c, id: i + 1, liked: false })) })));

  // Handlers for actions
  const handleLike = (id) => {
    setPosts(posts => posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 0) - 1 : (p.likes || 0) + 1 } : p));
    setProfilePosts(posts => posts.map(p => {
      if (p.id === id) {
        const updated = { ...p, liked: !p.liked, likes: p.liked ? (p.likes || 0) - 1 : (p.likes || 0) + 1 };
        return updated;
      }
      return p;
    }));
  };
  const handleUpvote = (id) => {
    setPosts(posts => posts.map(p => {
      if (p.id === id) {
        if (p.upvoted) {
          return { ...p, upvoted: false, downvoted: false, upvotes: (p.upvotes ?? 0) - 1 };
        }
        if (p.downvoted) {
          return { ...p, upvoted: true, downvoted: false, upvotes: (p.upvotes ?? 0) + 1 };
        }
        return { ...p, upvoted: true, downvoted: false, upvotes: (p.upvotes ?? 0) + 1 };
      }
      return p;
    }));
    setProfilePosts(posts => posts.map(p => {
      if (p.id === id) {
        let updated;
        if (p.upvoted) {
          updated = { ...p, upvoted: false, downvoted: false, upvotes: (p.upvotes ?? 0) - 1 };
        } else if (p.downvoted) {
          updated = { ...p, upvoted: true, downvoted: false, upvotes: (p.upvotes ?? 0) + 1 };
        } else {
          updated = { ...p, upvoted: true, downvoted: false, upvotes: (p.upvotes ?? 0) + 1 };
        }
        return updated;
      }
      return p;
    }));
  };
  const handleDownvote = (id) => {
    setPosts(posts => posts.map(p => {
      if (p.id === id) {
        if (p.downvoted) {
          return { ...p, downvoted: false };
        }
        if (p.upvoted) {
          return { ...p, upvoted: false, downvoted: true, upvotes: (p.upvotes ?? 0) - 1 };
        }
        return { ...p, downvoted: true };
      }
      return p;
    }));
    setProfilePosts(posts => posts.map(p => {
      if (p.id === id) {
        let updated;
        if (p.downvoted) {
          updated = { ...p, downvoted: false };
        } else if (p.upvoted) {
          updated = { ...p, upvoted: false, downvoted: true, upvotes: (p.upvotes ?? 0) - 1 };
        } else {
          updated = { ...p, downvoted: true };
        }
        return updated;
      }
      return p;
    }));
  };
  const handleSave = (id) => {
    setPosts(posts => posts.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
    setProfilePosts(posts => posts.map(p => {
      if (p.id === id) {
        const updated = { ...p, saved: !p.saved };
        return updated;
      }
      return p;
    }));
  };
  const handleComment = (id) => {
    const post = profilePosts.find(p => p.id === id);
    setSelectedPost(post);
    setComments(post?.commentsList || []); // Use post.commentsList if available, else empty
    setCommentModalVisible(true);
  };
  const handleShare = (id) => {
    alert('Share post ' + id);
  };

  // Simulate dynamic followers/following and follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(user.followers || Math.floor(Math.random() * 1000) + 100);
  const [following] = useState(user.following || Math.floor(Math.random() * 200) + 50);
  const [profile, setProfile] = useState({
    username: user?.user || user?.author || 'User',
    bio: user.bio || 'No bio yet.',
    avatar: user.avatar || 'commenter1.jpg',
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [avatarUri, setAvatarUri] = useState(null);

  const handleFollow = () => {
    setIsFollowing(f => !f);
    setFollowers(f => isFollowing ? f - 1 : f + 1);
  };

  const openEditModal = () => {
    setEditUsername(profile.username);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatar);
    setAvatarUri(null);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    setProfile({
      username: editUsername,
      bio: editBio,
      avatar: avatarUri ? avatarUri : editAvatar,
    });
    setEditModalVisible(false);
  };

  const pickAvatar = async () => {
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

  const isCurrentUser = (user?.user || user?.author || 'User') === (currentUser?.username || 'User');

  // Get avatar and username for the profile header
  let displayAvatar = null;
  let displayUsername = null;
  let showInitials = false;
  let initials = '';
  let headerAvatarKey = '';
  if (selectedPostObj && selectedPostObj.avatar) {
    displayUsername = typeof selectedPostObj.user === 'object' ? selectedPostObj.user.name || profile.username : selectedPostObj.user;
    headerAvatarKey = (selectedPostObj.avatar || '').trim();
    if (headerAvatarKey && imageMap[headerAvatarKey]) {
      displayAvatar = imageMap[headerAvatarKey];
      showInitials = false;
    } else if (headerAvatarKey && headerAvatarKey.startsWith('http')) {
      displayAvatar = { uri: headerAvatarKey };
      showInitials = false;
    } else {
      showInitials = true;
    }
  } else if (posts[0] && posts[0].avatar) {
    displayUsername = typeof posts[0].user === 'object' ? posts[0].user.name || profile.username : posts[0].user;
    headerAvatarKey = (posts[0].avatar || '').trim();
    if (headerAvatarKey && imageMap[headerAvatarKey]) {
      displayAvatar = imageMap[headerAvatarKey];
      showInitials = false;
    } else if (headerAvatarKey && headerAvatarKey.startsWith('http')) {
      displayAvatar = { uri: headerAvatarKey };
      showInitials = false;
    } else {
      showInitials = true;
    }
  } else {
    displayUsername = profile.username;
    showInitials = true;
  }
  if (showInitials && displayUsername) {
    initials = displayUsername
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [pressedButton, setPressedButton] = useState({});

  // Add handlers for comment modal
  const handleAddComment = (text, replyingTo = null) => {
    const newComment = {
      id: Date.now(),
      username: displayUsername,
      text: text,
      time: 'Just now',
      likes: 0,
      liked: false,
      replyingTo: replyingTo
    };
    setComments(prev => [newComment, ...prev]);
    setProfilePosts(posts => posts.map(post => {
      if (post.id === selectedPost.id) {
        const updated = { ...post, comments: (post.comments ?? 0) + 1, commentsList: [newComment, ...(post.commentsList || [])] };
        return updated;
      }
      return post;
    }));
    setPosts(posts => posts.map(post => post.id === selectedPost.id ? { ...post, comments: (post.comments ?? 0) + 1 } : post));
  };
  const handleLikeComment = (commentId) => {
    setComments(comments => comments.map(comment => {
      if (comment.id === commentId) {
        if (comment.liked) {
          return { ...comment, liked: false, likes: comment.likes - 1 };
        } else {
          return { ...comment, liked: true, likes: comment.likes + 1 };
        }
      }
      return comment;
    }));
  };

  // userPosts is now always profilePosts
  const userPosts = profilePosts;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <LinearGradient
        colors={[themeColors.accent + '22', themeColors.background]}
        style={styles.gradientHeader}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <TouchableOpacity
          onPress={() => {
            const validTabs = ['popular', 'latest', 'news'];
            if (from === 'root') {
              router.replace('/(tabs)');
            } else if (from && validTabs.includes(from)) {
              router.replace('/(tabs)/' + from);
            } else {
              router.back();
            }
          }}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Text style={{ color: themeColors.accent, fontSize: 18 }}>{'< Back'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} accessibilityLabel="Settings">
          <Ionicons name="settings-outline" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={isCurrentUser ? pickAvatar : undefined} accessibilityLabel="Change avatar" disabled={!isCurrentUser}>
            {showInitials ? (
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: themeColors.accent + '33', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: themeColors.accent, fontWeight: 'bold', fontSize: 18 }}>{initials}</Text>
              </View>
            ) : (
              <Image source={displayAvatar} style={styles.avatar} />
            )}
          </TouchableOpacity>
          <Text style={[styles.username, { color: themeColors.text }]}>{displayUsername}</Text>
          <Text style={[styles.bio, { color: themeColors.textSecondary }]}>{profile.bio}</Text>
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
            accessibilityLabel={isFollowing ? 'Unfollow' : 'Follow'}
          > 
            <Text style={{ color: isFollowing ? themeColors.accent : '#fff', fontWeight: 'bold' }}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
          {isCurrentUser && (
            <TouchableOpacity style={styles.editButton} onPress={openEditModal} accessibilityLabel="Edit profile">
              <Text style={{ color: themeColors.accent, fontWeight: 'bold' }}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
      <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Posts</Text>
      {posts.length === 0 ? (
        <Text style={{ color: themeColors.textSecondary, textAlign: 'center', marginTop: 24 }}>No posts available.</Text>
      ) : (
      <FlatList
          data={userPosts}
          keyExtractor={(item, idx) => item.id ? item.id.toString() : idx.toString()}
          renderItem={({ item }) => {
            // Robust debug log for image and avatar lookup
            const avatarKey = (item.avatar || '').trim();
            const imageKey = (item.image || '').trim();
            const avatarSource = imageMap[avatarKey];
            const imageSource = imageMap[imageKey];
            console.log('DEBUG: Profile post', {
              id: item.id,
              user: item.user,
              avatar: avatarKey,
              avatarSource,
              image: imageKey,
              imageSource,
              imageMapKeys: Object.keys(imageMap),
            });
            const isNewsPost = !!newsPosts;
            return (
              <View style={[styles.postContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border, marginBottom: 16, borderWidth: 1 }]}>                {/* Post Header */}
                <View style={styles.userInfo}>
                  <Image
                    source={avatarSource ? avatarSource : require('../assets/images/Commenter1.jpg')}
                    style={styles.avatar}
                  />
                  <View style={styles.userDetails}>
                    <Text style={[styles.username, { color: themeColors.text }]}>{item.user || 'Unknown User'}</Text>
                    <Text style={[styles.postTime, { color: themeColors.textSecondary }]}>{getRelativeTime(item.timestamp)}</Text>
                  </View>
                </View>
                {/* Post Content */}
                <View style={styles.postContent}>
                  <Text style={[styles.postTitle, { color: themeColors.text }]}>{item.title || '[No Title]'}</Text>
                  {item.image && (
                    <TouchableOpacity onPress={() => { setSelectedImage(imageSource ? imageSource : require('../assets/images/Random.jpg')); setImageModalVisible(true); }} accessibilityLabel="View image">
                      <Image
                        source={imageSource ? imageSource : require('../assets/images/Random.jpg')}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {/* Post Actions */}
                <View style={styles.postActionsRow}>
                  <View style={styles.actionGroupLeft}>
                    {isNewsPost ? (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, pressedButton[item.id + '-upvote'] && { backgroundColor: '#e8f0fe' }]}
                          onPress={() => handleUpvote(item.id)}
                          onPressIn={() => setPressedButton(prev => ({ ...prev, [item.id + '-upvote']: true }))}
                          onPressOut={() => setPressedButton(prev => ({ ...prev, [item.id + '-upvote']: false }))}
                          accessibilityLabel={item.upvoted ? 'Remove upvote' : 'Upvote'}
                        >
                          <AntDesign
                            name="arrowup"
                            size={22}
                            color={item.upvoted ? '#2E45A3' : themeColors.textSecondary}
                          />
                          <Text style={[styles.actionText, { color: item.upvoted ? '#2E45A3' : themeColors.textSecondary }]}> {formatCount(item.upvotes ?? item.likes ?? 0)} </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, pressedButton[item.id + '-downvote'] && { backgroundColor: '#fdeaea' }]}
                          onPress={() => handleDownvote(item.id)}
                          onPressIn={() => setPressedButton(prev => ({ ...prev, [item.id + '-downvote']: true }))}
                          onPressOut={() => setPressedButton(prev => ({ ...prev, [item.id + '-downvote']: false }))}
                          accessibilityLabel={item.downvoted ? 'Remove downvote' : 'Downvote'}
                        >
                          <AntDesign
                            name="arrowdown"
                            size={22}
                            color={item.downvoted ? '#E74C3C' : themeColors.textSecondary}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[styles.actionButton, pressedButton[item.id + '-like'] && { backgroundColor: '#fdeaea' }]}
                        onPress={() => handleLike(item.id)}
                        onPressIn={() => setPressedButton(prev => ({ ...prev, [item.id + '-like']: true }))}
                        onPressOut={() => setPressedButton(prev => ({ ...prev, [item.id + '-like']: false }))}
                      >
                        <AntDesign 
                          name={item.liked ? 'heart' : 'hearto'} 
                          size={22} 
                          color={item.liked ? '#e74c3c' : themeColors.textSecondary} 
                        />
                        <Text style={[styles.actionText, { color: item.liked ? '#e74c3c' : themeColors.textSecondary }]}> {item.likes} </Text>
                      </TouchableOpacity>
                    )}
                    {isNewsPost && (
                      <TouchableOpacity
                        style={[styles.actionButton, pressedButton[item.id + '-comment'] && { backgroundColor: '#e8f0fe' }]}
                        onPress={() => handleComment(item.id)}
                        onPressIn={() => setPressedButton(prev => ({ ...prev, [item.id + '-comment']: true }))}
                        onPressOut={() => setPressedButton(prev => ({ ...prev, [item.id + '-comment']: false }))}
                      >
                        <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
                        <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{item.comments}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.actionGroupRight}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item.id)}>
                      <Feather name="share-2" size={20} color={themeColors.textSecondary} />
                      <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{item.shares}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, pressedButton[item.id + '-save'] && { backgroundColor: '#e8f0fe' }]}
                      onPress={() => handleSave(item.id)}
                      onPressIn={() => setPressedButton(prev => ({ ...prev, [item.id + '-save']: true }))}
                      onPressOut={() => setPressedButton(prev => ({ ...prev, [item.id + '-save']: false }))}
                    >
                      {item.saved ? (
                        <FontAwesome name="bookmark" size={20} color={themeColors.accent} />
                      ) : (
                        <Feather name="bookmark" size={20} color={themeColors.textSecondary} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
      {/* Edit Profile Modal */}
      {editModalVisible && (
        <View style={styles.editModalBackdrop}>
          <View style={[styles.editModal, { backgroundColor: themeColors.background }]}> 
            <Text style={[styles.editModalTitle, { color: themeColors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={pickAvatar} style={styles.editAvatarButton} accessibilityLabel="Pick new avatar">
              <Image source={avatarUri ? { uri: avatarUri } : (editAvatar && imageMap[editAvatar] ? imageMap[editAvatar] : require('../assets/images/Commenter1.jpg'))} style={styles.avatar} />
              <Text style={{ color: themeColors.accent, marginTop: 4 }}>Change Avatar</Text>
            </TouchableOpacity>
            <Text style={[styles.editLabel, { color: themeColors.textSecondary }]}>Username</Text>
            <TextInput
              style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.border }]}
              value={editUsername}
              onChangeText={setEditUsername}
              maxLength={30}
              accessibilityLabel="Edit username"
            />
            <Text style={[styles.editLabel, { color: themeColors.textSecondary }]}>Bio</Text>
            <TextInput
              style={[styles.editInput, { color: themeColors.text, borderColor: themeColors.border, height: 60 }]}
              value={editBio}
              onChangeText={setEditBio}
              maxLength={120}
              multiline
              accessibilityLabel="Edit bio"
            />
            <View style={styles.editModalActions}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.editCancelBtn} accessibilityLabel="Cancel edit">
                <Text style={{ color: themeColors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.editSaveBtn} accessibilityLabel="Save profile">
                <Text style={{ color: themeColors.accent, fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          </View>
        )}
      {/* Image Modal */}
      <ImageModal
        visible={imageModalVisible}
        imageSource={selectedImage}
        onClose={() => setImageModalVisible(false)}
        themeColors={themeColors}
      />
      {/* Comment Modal */}
      <CommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        post={selectedPost || {}}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onReplyComment={() => {}}
        themeColors={themeColors}
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