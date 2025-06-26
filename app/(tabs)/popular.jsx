import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommentModal from '../../components/CommentModal';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';

import data from './popular_data.json';

const imageMap = {
  'harry logo.webp': require('../../assets/images/harry logo.webp'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'Logo-NBA.png': require('../../assets/images/Logo-NBA.png'),
  'curry.jpg': require('../../assets/images/curry.jpg'),
  'fifa logo.jpg': require('../../assets/images/fifa logo.jpg'),
  'Messi.jpg': require('../../assets/images/Messi.jpg'),
  'Grand.jpeg': require('../../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../../assets/images/Ramen.jpeg'),
  'w1.jpg': require('../../assets/images/w1.jpg'),
  'T1.jpg': require('../../assets/images/T1.jpg'),
  'yu.jpg': require('../../assets/images/yu.jpg'),
  'Ronaldo.jpg': require('../../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../../assets/images/SGA.jpg'),
  "euro's league logo.jpg": require("../../assets/images/euro's league logo.jpg"),
};

const formatLikes = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  };

const Post = ({ post, onLike, onDislike, onComment, themeColors }) => (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      <View style={styles.postHeader}>
        <Image source={imageMap[post.avatar]} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.postUser, { color: themeColors.text }]}>{post.user} <Text style={styles.postTime}>• {post.time}</Text></Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={20} color={themeColors.icon} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.postTitle, { color: themeColors.text }]}>{post.title}</Text>
      {post.image && <Image source={imageMap[post.image]} style={styles.postImage} />}
      <View style={styles.postActions}>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post.id)}>
            <AntDesign name={post.liked ? 'heart' : 'hearto'} size={20} color={post.liked ? '#e74c3c' : '#ccc'} />
            <Text style={[styles.actionText, post.liked && { color: '#e74c3c'}]}>{formatLikes(post.likes)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDislike(post.id)}>
            <MaterialIcons name="heart-broken" size={24} color={post.disliked ? '#e74c3c' : '#ccc'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color="#ccc" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionGroup}>
            <TouchableOpacity style={styles.actionBtn}>
                <FontAwesome5 name="award" size={20} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Feather name="share-2" size={20} color="#ccc" />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
    const router = useRouter();
    const { themeColors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: themeColors.background }] }>
            <View style={styles.headerLeft}>
                {/* Remove menu icon */}
                {/* <TouchableOpacity>
                    <Feather name="menu" size={28} color={themeColors.icon} />
                </TouchableOpacity> */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                    <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Popular</Text>
                    <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerIcons}>
                <TouchableOpacity style={{marginRight: 16}} onPress={onSearchPress}>
                    <Ionicons name="search" size={24} color={themeColors.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onProfilePress}>
                    <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    )
};

const TrendingCard = ({ item }) => (
    <ImageBackground source={imageMap[item.image]} style={styles.trendingCard} imageStyle={{ borderRadius: 12 }}>
        <View style={styles.trendingOverlay} />
        <Text style={styles.trendingText}>{item.title}</Text>
    </ImageBackground>
  );

const PopularScreen = () => {
    const [posts, setPosts] = useState(data.posts.map(p => ({ ...p, liked: false, disliked: false })));
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [lastTabPath, setLastTabPath] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([
      {
        id: 1,
        username: 'u/PopularUser1',
        text: 'This is trending for a reason! Great content.',
        time: '1h ago',
        likes: 15,
        liked: false
      },
      {
        id: 2,
        username: 'u/TrendingFan',
        text: 'Love seeing this kind of content on the front page.',
        time: '45m ago',
        likes: 12,
        liked: false
      },
      {
        id: 3,
        username: 'u/CommunityMember',
        text: 'This deserves all the upvotes it\'s getting!',
        time: '30m ago',
        likes: 8,
        liked: false
      }
    ]);
    const router = useRouter();
    const pathname = usePathname();
    const { themeColors } = useTheme();

    // Filter posts by search text
    const filteredPosts = searchText.trim() === '' ? posts : posts.filter(post => {
      const q = searchText.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.user.toLowerCase().includes(q) ||
        (post.content && post.content.toLowerCase().includes(q))
      );
    });

    const handleSearchIcon = () => setSearchOpen(true);
    const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

    const handleLike = (id) => {
        setPosts(posts => posts.map(post => {
          if (post.id === id) {
            return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1, disliked: false };
          }
          return post;
        }));
      };
    
      const handleDislike = (id) => {
        setPosts(posts => posts.map(post => {
          if (post.id === id) {
            const wasLiked = post.liked;
            const newLikes = wasLiked ? post.likes - 1 : post.likes;
            return { ...post, disliked: !post.disliked, liked: false, likes: newLikes };
          }
          return post;
        }));
      };

    const handleComment = (id) => {
      const post = posts.find(p => p.id === id);
      setSelectedPost(post);
      setCommentModalVisible(true);
    };

    const handleAddComment = (text, replyingTo = null) => {
      const newComment = {
        id: Date.now(),
        username: 'u/CurrentUser',
        text: text,
        time: 'Just now',
        likes: 0,
        liked: false,
        replyingTo: replyingTo
      };
      setComments(prev => [newComment, ...prev]);
      
      // Update post comment count
      setPosts(posts => posts.map(post => {
        if (post.id === selectedPost.id) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      }));
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

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }] }>
            <Stack.Screen options={{ headerShown: false }} />
            {/* Search Bar */}
            {searchOpen ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 40, backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }}>
                <Ionicons name="search" size={22} color={themeColors.icon} style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, fontSize: 18, color: themeColors.text, paddingVertical: 8 }}
                  placeholder="Search posts"
                  placeholderTextColor={themeColors.textSecondary}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')} style={{ marginHorizontal: 4 }}>
                    <Ionicons name="close-circle" size={22} color={themeColors.icon} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleCancelSearch} style={{ marginLeft: 8 }}>
                  <Text style={{ color: themeColors.accent || '#2E45A3', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {/* Header */}
            {!searchOpen && (
              <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} onSearchPress={handleSearchIcon} />
            )}
            <PopupMenu visible={menuOpen} router={router} />
            <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
            
            {/* Comment Modal */}
            {selectedPost && (
              <CommentModal
                visible={commentModalVisible}
                onClose={() => setCommentModalVisible(false)}
                post={selectedPost}
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReplyComment={() => {}}
                themeColors={themeColors}
              />
            )}

            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Post 
                        post={item} 
                        onLike={handleLike} 
                        onDislike={handleDislike} 
                        onComment={handleComment}
                        themeColors={themeColors}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
                contentContainerStyle={styles.postsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        color: '#2E45A3',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    trendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    trendingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    trendingCard: {
        width: 150,
        height: 100,
        marginRight: 10,
        justifyContent: 'flex-end',
        padding: 8,
    },
    trendingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
    },
    trendingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    postContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
      },
      postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
      },
      avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 12,
      },
      postUser: {
        fontWeight: 'bold',
        fontSize: 14,
      },
      postTime: {
        color: '#657786',
        fontWeight: 'normal',
        fontSize: 12,
      },
      postTitle: {
        fontSize: 16,
        lineHeight: 22,
        paddingHorizontal: 16,
        marginBottom: 8,
      },
      postImage: {
        width: '100%',
        height: 250,
        borderRadius: 0,
        marginTop: 8,
      },
      postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 16,
      },
      actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
      },
      actionText: {
        marginLeft: 6,
        color: '#657786',
        fontWeight: 'bold',
      },
    postsList: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
});

export default PopularScreen; 