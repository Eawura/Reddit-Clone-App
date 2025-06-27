import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CollectionModal from '../../components/CollectionModal';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { getRandomRecentTimestamp, getRelativeTime } from '../../utils/timeUtils';

import data from './popular_data.json';

// Image mapping for profile pictures and post images
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
  // Commenter profile images
  'commenter1.jpg': require('../../assets/images/Commenter1.jpg'),
  'commenter2.jpg': require('../../assets/images/Commenter2.jpg'),
  'commenter3.jpg': require('../../assets/images/Commenter3.jpg'),
  'commenter4.jpg': require('../../assets/images/Commenter4.jpg'),
  'commenter5.jpg': require('../../assets/images/Commenter5.jpg'),
  'commenter6.jpg': require('../../assets/images/Commenter6.jpg'),
  'commenter7.jpg': require('../../assets/images/Commenter7.jpg'),
  'commenter8.jpg': require('../../assets/images/Commenter8.jpg'),
  'commenter9.jpg': require('../../assets/images/Commenter9.jpg'),
  'commenter10.jpg': require('../../assets/images/Commenter10.jpg'),
};

// Helper function to format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
const formatLikes = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  };

// Main Post Component - Displays individual posts in the popular feed
const Post = ({ post, onLike, onDislike, onComment, onImagePress, onSave, onAward, onShare, themeColors, onMore, onBookmarkLongPress, isBookmarked }) => (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      {/* Post Header - User info and more options */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={imageMap[post.avatar]} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: themeColors.text }]}>{post.user}</Text>
            <Text style={[styles.postTime, { color: themeColors.textSecondary }]}>{getRelativeTime(post.timestamp)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => onMore(post)}>
          <Feather name="more-horizontal" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content - Title and image */}
      <View style={styles.postContent}>
        <Text style={[styles.postTitle, { color: themeColors.text }]}>{post.title}</Text>
        {post.image && (
          <TouchableOpacity onPress={() => onImagePress(post.image)}>
            <Image 
              source={imageMap[post.image]} 
              style={styles.postImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Post Actions - Like, dislike, comment, award, share, bookmark buttons */}
      <View style={styles.postActions}>
        <View style={styles.actionGroup}>
          {/* Like Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
            <AntDesign 
              name={post.liked ? 'heart' : 'hearto'} 
              size={22} 
              color={post.liked ? '#e74c3c' : themeColors.textSecondary} 
            />
            <Text style={[styles.actionText, { color: post.liked ? '#e74c3c' : themeColors.textSecondary }]}>
              {formatLikes(post.likes)}
            </Text>
          </TouchableOpacity>
          
          {/* Dislike Button - Uses layered heartbroken icon for outlined/solid effect */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onDislike(post.id)}>
            <View style={{ position: 'relative' }}>
              <MaterialIcons 
                name="heart-broken" 
                size={24} 
                color={themeColors.textSecondary} 
                style={{ opacity: 0.3 }}
              />
              {post.disliked && (
                <MaterialIcons 
                  name="heart-broken" 
                  size={24} 
                  color="#e74c3c" 
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              )}
            </View>
          </TouchableOpacity>
          
          {/* Comment Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{post.comments}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionGroup}>
          {/* Award Button - Reddit-style award system */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onAward(post.id)}>
            <FontAwesome5 name="award" size={20} color={post.awarded ? '#FFD700' : themeColors.textSecondary} />
          </TouchableOpacity>
          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
          {/* Save/Bookmark Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(post.id)}
            onLongPress={() => onBookmarkLongPress(post.id)}
          >
            <Feather name={post.saved ? 'bookmark' : 'bookmark'} size={20} color={post.saved ? '#2E45A3' : themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

// Header Component - App logo and navigation icons
const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
    const router = useRouter();
    const { themeColors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: themeColors.background }] }>
            <View style={styles.headerLeft}>
                {/* App Logo and Menu Toggle */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                    <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Popular</Text>
                    <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.headerIcons}>
                {/* Search Icon */}
                <TouchableOpacity style={{marginRight: 16}} onPress={onSearchPress}>
                    <Ionicons name="search" size={24} color={themeColors.icon} />
                </TouchableOpacity>
                {/* Profile Icon */}
                <TouchableOpacity onPress={onProfilePress}>
                    <Ionicons name="person-circle-outline" size={28} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    )
};

// Trending Card Component - Shows trending topics at the top with background images
const TrendingCard = ({ item }) => (
    <ImageBackground source={imageMap[item.image]} style={styles.trendingCard} imageStyle={{ borderRadius: 12 }}>
        <View style={styles.trendingOverlay} />
        <Text style={styles.trendingText}>{item.title}</Text>
    </ImageBackground>
  );

// Main Popular Screen Component
const PopularScreen = () => {
    // State management for posts and UI
    const [posts, setPosts] = useState(
      data.posts.map(p => ({
        ...p,
        liked: false,
        disliked: false,
        awarded: false,
        timestamp: getRandomRecentTimestamp(),
      }))
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [lastTabPath, setLastTabPath] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [moreMenuVisible, setMoreMenuVisible] = useState(false);
    const [selectedMorePost, setSelectedMorePost] = useState(null);
    const [collectionModalVisible, setCollectionModalVisible] = useState(false);
    const [collectionModalPost, setCollectionModalPost] = useState(null);
    
    // Sample comments data for the comment modal
    const [comments, setComments] = useState([
      {
        id: 1,
        username: 'u/PopularUser1',
        avatar: 'commenter4.jpg',
        text: 'This is trending for a reason! Great content.',
        time: '1h ago',
        likes: 15,
        liked: false
      },
      {
        id: 2,
        username: 'u/TrendingFan',
        avatar: 'commenter5.jpg',
        text: 'Love seeing this kind of content on the front page.',
        time: '45m ago',
        likes: 12,
        liked: false
      },
      {
        id: 3,
        username: 'u/CommunityMember',
        avatar: 'commenter6.jpg',
        text: 'This deserves all the upvotes it\'s getting!',
        time: '30m ago',
        likes: 8,
        liked: false
      }
    ]);
    const router = useRouter();
    const pathname = usePathname();
    const { themeColors } = useTheme();
    const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();

    // Filter posts by search text
    const filteredPosts = searchText.trim() === '' ? posts : posts.filter(post => {
      const q = searchText.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.user.toLowerCase().includes(q) ||
        (post.content && post.content.toLowerCase().includes(q))
      );
    });

    // Trending topics data for the horizontal scroll section
    const trendingTopics = [
      { id: 1, title: 'Sports', image: 'curry.jpg' },
      { id: 2, title: 'Gaming', image: 'Messi.jpg' },
      { id: 3, title: 'Tech', image: 'harry logo.webp' },
      { id: 4, title: 'Music', image: 'Penguin.jpg' },
    ];

    // Handle like button press - toggles like state and updates count
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

    // Handle dislike button press - decreases likes and toggles dislike state
    const handleDislike = (id) => {
        setPosts(posts => posts.map(post => {
          if (post.id === id) {
            if (post.disliked) {
              return { ...post, disliked: false };
            } else {
              return { ...post, disliked: true, liked: false, likes: post.likes - 1 };
            }
          }
          return post;
        }));
    };

    // Handle comment button press - opens comment modal
    const handleComment = (id) => {
      const post = posts.find(p => p.id === id);
      setSelectedPost(post);
      setCommentModalVisible(true);
    };

    // Handle adding a new comment
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

    // Handle liking a comment
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

    // Search functionality handlers
    const handleSearchIcon = () => setSearchOpen(true);
    const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

    // Handle image press for full-screen viewing
    const handleImagePress = (imageName) => {
      setSelectedImage(imageMap[imageName] || { uri: imageName });
      setImageModalVisible(true);
    };

    const handleSave = (id) => {
      const post = posts.find(p => p.id === id);
      if (post) {
        toggleBookmark(post, DEFAULT_COLLECTION);
      }
    };

    const handleBookmarkLongPress = (id) => {
      const post = posts.find(p => p.id === id);
      if (post) {
        setCollectionModalPost(post);
        setCollectionModalVisible(true);
      }
    };

    const handleAward = (id) => {
      setPosts(posts => posts.map(post => post.id === id ? { ...post, awarded: !post.awarded } : post));
    };

    const handleShare = (id) => {
      // Frontend only: show alert or feedback
      alert('Share post ' + id);
    };

    const handleMorePress = (post) => {
      setSelectedMorePost(post);
      setMoreMenuVisible(true);
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

            {/* Image Modal */}
            <ImageModal
              visible={imageModalVisible}
              imageSource={selectedImage}
              onClose={() => {
                setImageModalVisible(false);
                setSelectedImage(null);
              }}
              themeColors={themeColors}
            />

            <MoreMenu
              visible={moreMenuVisible}
              onClose={() => setMoreMenuVisible(false)}
              onReport={() => { setMoreMenuVisible(false); alert('Reported!'); }}
              onHide={() => { setMoreMenuVisible(false); alert('Post hidden!'); }}
              onCopyLink={() => {
                setMoreMenuVisible(false);
                alert('Link copied: https://neoping.app/post/' + (selectedMorePost?.id || ''));
              }}
              onShare={() => {
                setMoreMenuVisible(false);
                alert('Share: ' + (selectedMorePost?.title || ''));
              }}
            />

            <CollectionModal
              visible={collectionModalVisible}
              onClose={() => setCollectionModalVisible(false)}
              post={collectionModalPost}
            />

            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Post 
                        post={{...item, saved: isBookmarked(item.id, DEFAULT_COLLECTION)}}
                        onLike={handleLike} 
                        onDislike={handleDislike} 
                        onComment={handleComment}
                        onImagePress={handleImagePress}
                        onSave={handleSave}
                        onAward={handleAward}
                        onShare={handleShare}
                        onMore={handleMorePress}
                        onBookmarkLongPress={handleBookmarkLongPress}
                        themeColors={themeColors}
                        isBookmarked={isBookmarked}
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
        width: 120,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        justifyContent: 'flex-end',
        padding: 8,
    },
    trendingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
    },
    trendingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 8,
        borderRadius: 8,
        marginHorizontal: 8,
        padding: 16,
        ...Platform.select({
            web: {
                boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 2,
            },
        }),
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    username: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 2,
    },
    postTime: {
        fontSize: 13,
        opacity: 0.7,
    },
    moreButton: {
        padding: 4,
    },
    postContent: {
        marginBottom: 12,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        padding: 4,
    },
    postsList: {
        paddingHorizontal: 16,
    },
});

export default PopularScreen; 