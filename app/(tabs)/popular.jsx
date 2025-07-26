import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CollectionModal from '../../components/CollectionModal';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import { usePosts } from '../../components/PostContext';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { formatNumber } from '../../utils/numberUtils';
import { getRelativeTime } from '../../utils/timeUtils';
import popularData from './popular_data.json';


// Example trending stories data (replace with your own images/titles)
// const trendingStoriesData = [
//   { id: '1', image: require('../../assets/images/Commenter1.jpg'), title: 'Cell Appreciation' },
//   { id: '2', image: require('../../assets/images/Commenter2.jpg'), title: 'Invasive Wild Orchid' },
//   { id: '3', image: require('../../assets/images/Commenter3.jpg'), title: 'Chat Summit Details' },
//   { id: '4', image: require('../../assets/images/Commenter4.jpg'), title: 'NBA Playoffs' },
//   { id: '5', image: require('../../assets/images/Commenter5.jpg'), title: 'Tech Innovations' },
//   { id: '6', image: require('../../assets/images/Commenter6.jpg'), title: 'World Cup Qualifiers' },
// ];

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
  'Cole Palmer.jpg': require('../../assets/images/Cole Palmer.jpg'),
  'CWC.jpg': require('../../assets/images/CWC.jpg'),
  'myStory1.jpg': require('../../assets/images/myStory1.jpg'),
  'myStory2.jpg': require('../../assets/images/myStory2.jpg'),
  'myStory3.jpg': require('../../assets/images/myStory3.jpg'),
  'myStory4.jpg': require('../../assets/images/myStory4.jpg'),
  'myStory5.jpg': require('../../assets/images/myStory5.jpg'),
  'myStory6.jpg': require('../../assets/images/myStory6.jpg'),
  'Tech.png': require('../../assets/images/Tech.png'),
  'Science1.png': require('../../assets/images/Science1.png'),
  'AnimalA.png': require('../../assets/images/AnimalA.png'),
  'TravelA.png': require('../../assets/images/TravelA.png'),
  'Ai.png': require('../../assets/images/Ai.png'),
  'Travel.png': require('../../assets/images/Travel.png'),
  'Monkey.png': require('../../assets/images/Monkey.png'),
  'BM.png': require('../../assets/images/BM.png'),
  'p.png': require('../../assets/images/p.png'),
  'Dis.png': require('../../assets/images/Dis.png'),
};

// Main Post Component - Displays individual posts in the popular feed
const Post = ({ post, onLike, onDislike, onComment, onImagePress, onSave, onAward, onShare, themeColors, onMore, onBookmarkLongPress, isBookmarked, DEFAULT_COLLECTION, onProfilePress }) => {
  // Debug logs for avatar and image lookups
  console.log('DEBUG: Post ID', post.id, 'avatar lookup:', post.avatar, '->', imageMap[post.avatar]);
  console.log('DEBUG: Post ID', post.id, 'image lookup:', post.image, '->', imageMap[post.image]);
  return (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      {/* Post Header - User info and more options */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={() => onProfilePress(post)}>
          <Image
            source={imageMap[post.avatar] ? imageMap[post.avatar] : require('../../assets/images/Commenter1.jpg')}
            style={styles.avatar}
          />
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
              source={imageMap[post.image] ? imageMap[post.image] : require('../../assets/images/Random.jpg')}
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
              {formatNumber(post.likes ?? post.upvotes ?? 0)}
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
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatNumber(post.comments ?? 0)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionGroup}>
          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatNumber(post.shares)}</Text>
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
};

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
    style={{
      backgroundColor: themeColors.card,
      borderBottomColor: themeColors.border,
      borderRadius: 18,
      marginHorizontal: 16,
      marginTop: 18,
      marginBottom: 0,
      paddingHorizontal: 20,
      paddingVertical: 18,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    }}
  >
    <Ionicons name="flame" size={26} color="#FF4500" style={{ marginRight: 14 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ color: themeColors.text, fontWeight: 'bold', fontSize: 22, letterSpacing: 0.2, marginBottom: 2 }}>Trending Today</Text>
      <Text style={{ color: themeColors.textSecondary, fontSize: 14, fontWeight: '500' }}>Top stories and conversations right now</Text>
    </View>
  </View>
);

const TrendingStories = ({ stories, themeColors, onStoryPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    snapToInterval={170}
    decelerationRate="fast"
    style={[
      styles.trendingStoriesContainer,
      { backgroundColor: 'transparent', borderBottomColor: 'transparent', marginBottom: 8 }
    ]}
    contentContainerStyle={{ paddingHorizontal: 16 }}
  >
    {stories.map((story, idx) => (
      <TouchableOpacity
        key={idx}
        style={{
          width: 160,
          marginRight: 18,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.10,
          shadowRadius: 12,
          elevation: 4,
        }}
        onPress={() => onStoryPress(story)}
        activeOpacity={0.88}
      >
        <View style={{
          width: 150,
          height: 100,
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'transparent',
        }}>
          <Image
            source={imageMap[story.image] ? imageMap[story.image] : require('../../assets/images/Random.jpg')}
            style={{ width: '100%', height: '100%', borderRadius: 18 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 48,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }} />
          <Text style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 14,
            color: '#fff',
            fontSize: 17,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
            zIndex: 2,
            letterSpacing: 0.1,
          }} numberOfLines={2}>
            {story.title}
          </Text>
        </View>
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
    const [selectedTrendingStory, setSelectedTrendingStory] = useState(null);
    const [trendingModalVisible, setTrendingModalVisible] = useState(false);
    const [trendingStoryVotes, setTrendingStoryVotes] = useState({}); // { [storyId]: { upvoted, downvoted, upvotes } }
    const [trendingStoryComments, setTrendingStoryComments] = useState({}); // { [storyId]: [comments] }
    const [trendingCommentText, setTrendingCommentText] = useState('');
    
    // Sample comments data for the comment modal
    const demoCommenters = [
      { username: 'u/Commenter1', avatar: 'commenter1.jpg', text: 'This is amazing! Love the content.', time: '2 hours ago', likes: 12 },
      { username: 'u/Commenter2', avatar: 'commenter2.jpg', text: 'Great post! Thanks for sharing this.', time: '1 hour ago', likes: 8 },
      { username: 'u/Commenter3', avatar: 'commenter3.jpg', text: 'I totally agree with this. Well said!', time: '30 minutes ago', likes: 5 },
    ];
    const [comments, setComments] = useState(demoCommenters.map((c, i) => ({ ...c, id: i + 1, liked: false })));
    const router = useRouter();
    const pathname = usePathname();
    const { themeColors } = useTheme();
    const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();
    const { posts, setPosts } = usePosts();

    // Filter and sort posts for Popular feed
    const filteredPosts = posts
      .map(post => ({ ...post, comments: 3 }))
      .filter(post => post.likes >= 10)
      .sort((a, b) => b.likes - a.likes);

    // Trending topics data for the horizontal scroll section
    const trendingTopics = [
      { id: 1, title: 'Sports', image: 'curry.jpg' },
      { id: 2, title: 'Gaming', image: 'Messi.jpg' },
      { id: 3, title: 'Tech', image: 'harry logo.webp' },
      { id: 4, title: 'Music', image: 'Penguin.jpg' },
    ];

    // Remove the hardcoded trendingStoriesData array
    const trendingStories = (popularData.trendingStories || []).map(story => ({
      ...story,
      image: story.image, // keep as string for imageMap lookup
    }));

    // Handle like button press - toggles like state and updates count
    const handleLike = (id) => {
        setPosts(posts => posts.map(post => {
          if (post.id === id) {
          // If already upvoted, remove upvote
            if (post.liked) {
            return { ...post, liked: false, disliked: false, likes: (post.likes ?? 0) - 1 };
          }
          // If downvoted, remove downvote and add upvote (net +2)
          if (post.disliked) {
            return { ...post, liked: true, disliked: false, likes: (post.likes ?? 0) + 1 };
            }
          // If neutral, add upvote
          return { ...post, liked: true, disliked: false, likes: (post.likes ?? 0) + 1 };
          }
          return post;
        }));
    };

    const handleDislike = (id) => {
        setPosts(posts => posts.map(post => {
          if (post.id === id) {
          // If already downvoted, remove downvote
            if (post.disliked) {
              return { ...post, disliked: false };
          }
          // If upvoted, remove upvote and add downvote (net -1)
          if (post.liked) {
            return { ...post, liked: false, disliked: true, likes: (post.likes ?? 0) - 1 };
            }
          // If neutral, add downvote (no change to likes)
          return { ...post, disliked: true };
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

    const handleTrendingStoryPress = (story) => {
      setSelectedTrendingStory(story);
      setTrendingModalVisible(true);
    };

    const handleProfilePress = (post) => {
      router.push({
        pathname: '/profile',
        params: {
          userId: post.id,
          username: post.user,
          avatar: post.avatar,
        },
      });
    };

    // Helper to get votes/comments for selected story
    const getStoryVotes = (story) => trendingStoryVotes[story.id] || { upvoted: false, downvoted: false, upvotes: 0 };
    const getStoryComments = (story) => trendingStoryComments[story.id] || demoCommenters;

    // Upvote/Downvote handlers
    const handleTrendingUpvote = (story) => {
      setTrendingStoryVotes(votes => {
        const prev = votes[story.id] || { upvoted: false, downvoted: false, upvotes: 0 };
        return {
          ...votes,
          [story.id]: {
            upvoted: !prev.upvoted,
            downvoted: false,
            upvotes: prev.upvoted ? prev.upvotes - 1 : prev.upvotes + 1
          }
        };
      });
    };
    const handleTrendingDownvote = (story) => {
      setTrendingStoryVotes(votes => {
        const prev = votes[story.id] || { upvoted: false, downvoted: false, upvotes: 0 };
        return {
          ...votes,
          [story.id]: {
            upvoted: false,
            downvoted: !prev.downvoted,
            upvotes: prev.downvoted ? prev.upvotes : prev.upvotes - 1
          }
        };
      });
    };
    // Comment handler
    const handleTrendingAddComment = (story) => {
      if (!trendingCommentText.trim()) return;
      setTrendingStoryComments(comments => {
        const prev = comments[story.id] || demoCommenters;
        return {
          ...comments,
          [story.id]: [
            {
              id: Date.now(),
              username: 'u/CurrentUser',
              avatar: 'commenter1.jpg',
              text: trendingCommentText,
              time: 'Just now',
              likes: 0,
              liked: false
            },
            ...prev
          ]
        };
      });
      setTrendingCommentText('');
    };
    // Share handler
    const handleTrendingShare = (story) => {
      alert('Share: ' + story.title);
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

            {/* Trending Story Modal */}
            <Modal
              visible={trendingModalVisible}
              animationType="fade"
              transparent={false}
              onRequestClose={() => setTrendingModalVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Close Button */}
                <TouchableOpacity onPress={() => setTrendingModalVisible(false)} style={{ position: 'absolute', top: 36, right: 18, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 18, padding: 6 }}>
                  <Ionicons name="close" size={28} color="#888" />
                </TouchableOpacity>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                  {selectedTrendingStory && (
                    <>
                      {/* Image */}
                      <TouchableOpacity onPress={() => {
                        setSelectedImage(imageMap[selectedTrendingStory.image] || require('../../assets/images/Random.jpg'));
                        setImageModalVisible(true);
                      }} accessibilityLabel="View image">
                        <Image
                          source={imageMap[selectedTrendingStory.image] || require('../../assets/images/Random.jpg')}
                          style={{ width: '100%', height: 240, backgroundColor: '#eee' }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      {/* Title and Meta */}
                      <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 }}>
                        <Text style={{ fontSize: 21, fontWeight: 'bold', color: '#222', marginBottom: 6, textAlign: 'left', lineHeight: 26 }}>{selectedTrendingStory.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                          <Ionicons name="trending-up" size={16} color="#FF4500" style={{ marginRight: 5 }} />
                          <Text style={{ color: '#888', fontSize: 13, marginRight: 10 }}>Trending</Text>
                          <Text style={{ color: '#bbb', fontSize: 13 }}>n/popular</Text>
                        </View>
                        <Text style={{ fontSize: 15, color: '#222', textAlign: 'left', lineHeight: 22 }}>{selectedTrendingStory.description}</Text>
                      </View>
                      {/* Actions */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, marginTop: 8, marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TouchableOpacity onPress={() => handleTrendingUpvote(selectedTrendingStory)} style={{ marginRight: 16 }}>
                            <AntDesign name="arrowup" size={22} color={getStoryVotes(selectedTrendingStory).upvoted ? '#2E45A3' : '#888'} />
                          </TouchableOpacity>
                          <Text style={{ fontWeight: 'bold', fontSize: 16, marginRight: 16 }}>{getStoryVotes(selectedTrendingStory).upvotes || 0}</Text>
                          <TouchableOpacity onPress={() => handleTrendingDownvote(selectedTrendingStory)} style={{ marginRight: 16 }}>
                            <AntDesign name="arrowdown" size={22} color={getStoryVotes(selectedTrendingStory).downvoted ? '#E74C3C' : '#888'} />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => {}} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                            <Feather name="message-circle" size={20} color="#888" />
                            <Text style={{ fontSize: 15, color: '#888', marginLeft: 4 }}>{getStoryComments(selectedTrendingStory).length}</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleTrendingShare(selectedTrendingStory)}>
                          <Feather name="share-2" size={20} color="#888" />
                        </TouchableOpacity>
                      </View>
                      {/* Comments Section */}
                      <View style={{ borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 8, paddingHorizontal: 18, paddingTop: 18 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 12 }}>Comments</Text>
                        {selectedTrendingStory && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <TextInput
                              style={{ flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 15, marginRight: 8 }}
                              placeholder="Add a comment..."
                              value={trendingCommentText}
                              onChangeText={setTrendingCommentText}
                            />
                            <TouchableOpacity onPress={() => handleTrendingAddComment(selectedTrendingStory)} style={{ backgroundColor: trendingCommentText.trim() ? '#2E45A3' : '#eee', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }} disabled={!trendingCommentText.trim()}>
                              <Text style={{ color: trendingCommentText.trim() ? '#fff' : '#888', fontWeight: 'bold' }}>Post</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        {getStoryComments(selectedTrendingStory).map((c, i) => (
                          <View key={c.id || i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 }}>
                            <Image source={imageMap[c.avatar] || require('../../assets/images/Commenter1.jpg')} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 10, backgroundColor: '#eee' }} />
                            <View style={{ flex: 1 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 14 }}>{c.username}</Text>
                                <Text style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>{c.time}</Text>
                              </View>
                              <Text style={{ color: '#222', fontSize: 15, marginBottom: 4 }}>{c.text}</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                                  <AntDesign name={c.liked ? 'heart' : 'hearto'} size={16} color={c.liked ? '#e74c3c' : '#888'} />
                                  <Text style={{ color: c.liked ? '#e74c3c' : '#888', fontSize: 13, marginLeft: 4 }}>{c.likes}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Feather name="message-circle" size={15} color="#888" />
                                  <Text style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>Reply</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </ScrollView>
              </View>
            </Modal>

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
                      stories={trendingStories}
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
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    trendingStoryImageWrapper: {
        width: 150,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#eee',
    },
    trendingStoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    trendingStoryGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 48,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    trendingStoryTitle: {
        position: 'absolute',
        left: 10,
        right: 10,
        bottom: 10,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        zIndex: 2,
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