import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CollectionModal from '../../components/CollectionModal';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import { usePosts } from '../../components/PostContext';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { getRelativeTime } from '../../utils/timeUtils';


// Example trending stories data (replace with your own images/titles)
const trendingStoriesData = [
  { image: require('../../assets/images/Commenter1.jpg'), title: 'Cell Appreciation' },
  { image: require('../../assets/images/Commenter2.jpg'), title: 'Invasive Wild Orchid' },
  { image: require('../../assets/images/Commenter3.jpg'), title: 'Chat Summit Details' },
  { image: require('../../assets/images/Commenter4.jpg'), title: 'NBA Playoffs' },
  { image: require('../../assets/images/Commenter5.jpg'), title: 'Tech Innovations' },
  { image: require('../../assets/images/Commenter6.jpg'), title: 'World Cup Qualifiers' },
  { image: require('../../assets/images/Commenter7.jpg'), title: 'Movie Premieres' },
  { image: require('../../assets/images/Commenter8.jpg'), title: 'Crypto Trends' },
  { image: require('../../assets/images/Commenter9.jpg'), title: 'SpaceX Launch' },
  { image: require('../../assets/images/Commenter10.jpg'), title: 'Fashion Week' },
  // Add more as needed
];

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

// Helper function to format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
const formatCount = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
};

// Main Post Component - Displays individual posts in the popular feed
const Post = ({ post, onLike, onDislike, onComment, onImagePress, onSave, onAward, onShare, themeColors, onMore, onBookmarkLongPress, isBookmarked, DEFAULT_COLLECTION, onProfilePress }) => (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      {/* Post Header - User info and more options */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={() => onProfilePress(post)}>
          <Image source={imageMap[post.avatar] ? imageMap[post.avatar] : require('../../assets/images/Commenter1.jpg')} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: themeColors.text }]}>{post.user}</Text>
            <Text style={[styles.postTime, { color: themeColors.textSecondary }]}>{getRelativeTime(post.timestamp)}</Text>
          </View>
        </TouchableOpacity>
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

      {/* Divider above actions */}
      <View style={{ height: 1, backgroundColor: themeColors.border, marginVertical: 8 }} />

      {/* Post Actions - Like, dislike, comment, share, bookmark buttons */}
      <View style={styles.postActions}>
        <View style={styles.actionGroup}>
          {/* Like Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
            <AntDesign 
              name="arrowup"
              size={22}
              color={post.liked ? '#2E45A3' : themeColors.textSecondary}
            />
            <Text style={[styles.actionText, { color: post.liked ? '#2E45A3' : themeColors.textSecondary }]}>
              {formatCount(post.likes)}
            </Text>
          </TouchableOpacity>
          {/* Dislike Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onDislike(post.id)}>
            <AntDesign
              name="arrowdown"
              size={22}
              color={post.disliked ? '#E74C3C' : themeColors.textSecondary}
            />
          </TouchableOpacity>
          {/* Comment Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatCount(post.comments)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionGroup}>
          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatCount(post.shares)}</Text>
          </TouchableOpacity>
          {/* Save/Bookmark Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(post.id)}
            onLongPress={() => onBookmarkLongPress(post.id)}
          >
            {isBookmarked(post.id, DEFAULT_COLLECTION) ? (
              <FontAwesome name="bookmark" size={20} color={themeColors.accent} />
            ) : (
              <Feather name="bookmark" size={20} color={themeColors.textSecondary} />
            )}
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

// Trending Bar Component
const TrendingBar = ({ themeColors }) => (
  <View
    style={[
      styles.trendingBar,
      { backgroundColor: themeColors.background, borderBottomColor: themeColors.border }
    ]}
  >
    <Ionicons name="flame" size={18} color="#FF4500" style={{ marginRight: 6 }} />
    <Text style={[styles.trendingBarText, { color: themeColors.text, fontWeight: 'bold' }]}>
      Trending Today
    </Text>
  </View>
);

// Trending Stories Carousel
const TrendingStories = ({ stories, themeColors, onStoryPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={[styles.trendingStoriesContainer, { backgroundColor: themeColors.background, borderBottomColor: themeColors.border }]}
    contentContainerStyle={{ paddingHorizontal: 8 }}
  >
    {stories.map((story, idx) => (
      <TouchableOpacity
        key={idx}
        style={styles.trendingStoryCard}
        onPress={() => onStoryPress(story)}
        activeOpacity={0.8}
      >
        <Image
          source={story.image}
          style={styles.trendingStoryImage}
          resizeMode="cover"
        />
        <Text style={[styles.trendingStoryTitle, { color: themeColors.text }]} numberOfLines={2}>
          {story.title}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);


// Main Popular Screen Component
const PopularScreen = () => {
    // State management for posts and UI
    const [selectedCategory, setSelectedCategory] = useState('all');
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
    
    // Comments state, loading, and error for backend integration
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const { themeColors } = useTheme();
    const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();
    const { posts } = usePosts();

    // Filter and sort posts for Popular feed
    const filteredPosts = posts
      .filter(post => post.likes >= 10)
      .sort((a, b) => b.likes - a.likes);

    // Trending topics data for the horizontal scroll section
    const trendingTopics = [
      { id: 1, title: 'Sports', image: 'curry.jpg' },
      { id: 2, title: 'Gaming', image: 'Messi.jpg' },
      { id: 3, title: 'Tech', image: 'harry logo.webp' },
      { id: 4, title: 'Music', image: 'Penguin.jpg' },
    ];

    // Handle like button press - toggles like state and updates count
    const handleLike = async (id) => {
      // Optimistically update UI
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
      // Backend call
      try {
        const axios = (await import('axios')).default;
        const { getAuthToken } = await import('../../utils/auth');
        const token = await getAuthToken();
        await axios.post(
          'http://localhost:8082/api/votes',
          { postId: id, voteType: 'UPVOTE' },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('Failed to upvote:', error?.response?.data || error);
        // Optionally: revert optimistic update or show error
      }
    };

    // Handle dislike button press - decreases likes and toggles dislike state
    const handleDislike = async (id) => {
      // Optimistically update UI
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
      // Backend call
      try {
        const axios = (await import('axios')).default;
        const { getAuthToken } = await import('../../utils/auth');
        const token = await getAuthToken();
        await axios.post(
          'http://localhost:8082/api/votes',
          { postId: id, voteType: 'DOWNVOTE' },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.error('Failed to downvote:', error?.response?.data || error);
        // Optionally: revert optimistic update or show error
      }
    };

    // Handle comment button press - fetch comments and open modal
    const handleComment = async (id) => {
      const post = posts.find(p => p.id === id);
      setSelectedPost(post);
      setComments([]);
      setCommentsError(null);
      setCommentsLoading(true);
      setCommentModalVisible(true);
      try {
        const { fetchComments } = await import('../../utils/comments');
        const backendComments = await fetchComments(post.id);
        // Map backend comments to UI format if needed
        setComments(backendComments.map(c => ({
          id: c.id,
          username: c.userName,
          avatar: c.avatar || 'commenter1.jpg', // fallback
          text: c.content,
          time: new Date(c.createdAt).toLocaleString(), // or use relative time
          likes: c.likes || 0,
          liked: false // TODO: backend support
        })));
        setCommentsError(null);
      } catch (err) {
        setCommentsError('Failed to load comments.');
      } finally {
        setCommentsLoading(false);
      }
    };

    // Handle adding a new comment (post to backend)
    const handleAddComment = async (text, replyingTo = null) => {
      if (!selectedPost) return;
      const userName = 'u/CurrentUser'; // TODO: Replace with real user
      const tempId = Date.now();
      const optimisticComment = {
        id: tempId,
        username: userName,
        avatar: 'commenter1.jpg',
        text,
        time: 'Just now',
        likes: 0,
        liked: false,
        replyingTo
      };
      setComments(prev => [optimisticComment, ...prev]);
      setCommentsError(null);
      try {
        const { postComment } = await import('../../utils/comments');
        await postComment({
          postId: selectedPost.id,
          content: text,
          userName,
          parentCommentId: replyingTo
        });
        // Optionally: refetch comments or update count
        setPosts(posts => posts.map(post => {
          if (post.id === selectedPost.id) {
            return { ...post, comments: post.comments + 1 };
          }
          return post;
        }));
      } catch (err) {
        setCommentsError('Failed to post comment.');
        // Remove optimistic comment
        setComments(prev => prev.filter(c => c.id !== tempId));
      }
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

    const handleTrendingStoryPress = (story) => {
      // You can navigate, open a modal, or just show an alert for now
      alert(`You tapped: ${story.title}`);
    };

    const handleProfilePress = (post) => {
      const userPosts = posts.filter(p => p.user === post.user);
      router.navigate('profile', {
        user: {
          avatar: post.avatar,
          user: post.user,
          posts: userPosts,
        }
      });
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
                loading={commentsLoading}
                error={commentsError}
                onRetry={() => handleComment(selectedPost.id)}
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
                        post={item}
                        onLike={handleLike} 
                        onDislike={handleDislike} 
                        onComment={handleComment}
                        onImagePress={handleImagePress}
                        onSave={handleSave}
                        onAward={handleAward}
                        onShare={handleShare}
                        themeColors={themeColors}
                        onMore={handleMorePress}
                        onBookmarkLongPress={handleBookmarkLongPress}
                        isBookmarked={isBookmarked}
                        DEFAULT_COLLECTION={DEFAULT_COLLECTION}
                        onProfilePress={handleProfilePress}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
                contentContainerStyle={styles.postsList}
                ListHeaderComponent={() => (
                  <View>
                    <TrendingBar themeColors={themeColors} />
                    <TrendingStories
                      stories={trendingStoriesData}
                      themeColors={themeColors}
                      onStoryPress={handleTrendingStoryPress}
                    />
                  </View>
                )}
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
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 8,
        padding: 12,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
            },
            default: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: 2,
            },
        }),
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
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
        marginBottom: 8,
    },
    postTitle: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 8,
    },
    postImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 2,
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
        marginRight: 12,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '500',
    },
    saveButton: {
        padding: 4,
    },
    postsList: {
        paddingHorizontal: 16,
    },
    trendingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
        minHeight: 60,
        borderBottomWidth: 0.5,
    },
    trendingBarText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
    trendingStoriesContainer: {
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        minHeight: 140,
    },
    trendingStoryCard: {
        width: 160,
        marginRight: 18,
        alignItems: 'center',
    },
    trendingStoryImage: {
        width: 150,
        height: 80,
        borderRadius: 10,
        marginBottom: 8,
        backgroundColor: '#eee',
    },
    trendingStoryTitle: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600',
        color: '#222',
        maxWidth: 140,
    },
    redditAvatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
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
    cameraBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        padding: 2,
    },
});

export default PopularScreen; 