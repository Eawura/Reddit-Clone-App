import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import { useTheme } from '../../components/ThemeContext';
import { formatNumber } from '../../utils/numberUtils';
import { getRelativeTime } from '../../utils/timeUtils';

const ACCENT = '#2E45A3';

// Image mapping for profile pictures and post images
const imageMap = {
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
  'Random.jpg': require('../../assets/images/Random.jpg'),
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

const demoPosts = [
  {
    id: 'l1',
    user: 'Recky',
    avatar: 'commenter1.jpg',
    title: 'Expo Router 2.0 Released!',
    excerpt: 'The latest version of Expo Router brings new features and improved navigation for React Native apps.',
    image: 'Tech.png',
    category: 'Hot',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    upvotes: 321,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'l2',
    user: 'Jane Doe',
    avatar: 'commenter2.jpg',
    title: 'Best Science Podcasts of 2024',
    excerpt: 'A curated list of the most insightful and entertaining science podcasts this year.',
    image: 'Science1.png',
    category: 'New',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    upvotes: 210,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'l3',
    user: 'Alex',
    avatar: 'commenter3.jpg',
    title: 'Traveling with AI: The Future of Smart Trips',
    excerpt: 'How artificial intelligence is changing the way we plan and experience travel.',
    image: 'TravelA.png',
    category: 'Hot',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    upvotes: 98,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'l4',
    user: 'Monkey',
    avatar: 'Monkey.png',
    title: 'Banana Prices Hit All-Time High',
    excerpt: 'Banana lovers are in for a surprise as prices soar due to global shortages.',
    image: 'BM.png',
    category: 'Hot',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    upvotes: 56,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'l5',
    user: 'Penguin',
    avatar: 'Penguin.png',
    title: 'Penguins Spotted in Unexpected Places',
    excerpt: 'A group of penguins was seen wandering in a city park, delighting onlookers.',
    image: 'Penguin.jpg',
    category: 'New',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    upvotes: 44,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
];

const categories = ['All', 'Hot', 'New'];

const LatestCard = ({ post, onUpvote, onDownvote, onComment, onSave, themeColors, isBookmarked, DEFAULT_COLLECTION, onImagePress, onMore, onProfilePress }) => {
  const [imgError, setImgError] = useState(false);
  const upvoteScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const [pressedButton, setPressedButton] = useState({});

  const animateIcon = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
};

  const handleUpvote = () => {
    animateIcon(upvoteScale);
    onUpvote(post.id);
  };
  const handleBookmark = () => {
    animateIcon(bookmarkScale);
    onSave(post.id);
  };

  return (
    <View style={[styles.newsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>  
      {post.category && (
        <View style={[styles.categoryBadge, { backgroundColor: themeColors.accent + '22', borderColor: themeColors.accent }]}> 
          <Text style={[styles.categoryBadgeText, { color: themeColors.accent }]}>{post.category}</Text>
        </View>
      )}
      <View style={styles.newsHeader}>
        <TouchableOpacity
          style={styles.newsUserInfo}
          onPress={() => onProfilePress(post)}
          accessible accessibilityLabel={`View profile for ${post.user}`}
        >
          <Image
            source={post.avatar && post.avatar.startsWith('http') ? { uri: post.avatar } : (imageMap[post.avatar] ? imageMap[post.avatar] : imageMap['Random.jpg'])}
            style={styles.newsAvatar}
            accessible accessibilityLabel={`Avatar for ${post.user}`}
          />
          <View style={styles.newsUserDetails}>
            <Text style={[styles.newsUsername, { color: themeColors.text }]}>{post.user}</Text>
            <Text style={[styles.newsTime, { color: themeColors.textSecondary }]}>{getRelativeTime(post.timestamp)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} onPress={() => onMore(post)} accessible accessibilityLabel="Show more options">
          <Feather name="more-horizontal" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { color: themeColors.text }]}>{post.title}</Text>
        {post.excerpt && (
          <Text style={[styles.newsExcerpt, { color: themeColors.textSecondary }]}>{post.excerpt}</Text>
        )}
        {post.image && (
          <TouchableOpacity
            onPress={() => onImagePress(post.image)}
            accessible accessibilityLabel={`View image for ${post.title}`}
          >
            <Image
              source={imgError ? imageMap['Random.jpg'] : imageMap[post.image] ? imageMap[post.image] : imageMap['Random.jpg']}
              style={styles.newsImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
              accessible accessibilityLabel={post.title}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.newsActions}>
        <View style={styles.newsActionGroup}>
          <TouchableOpacity
            style={[styles.newsActionButton, pressedButton[post.id + '-upvote'] && { backgroundColor: '#e8f0fe' }]}
            onPress={handleUpvote}
            onPressIn={() => setPressedButton(prev => ({ ...prev, [post.id + '-upvote']: true }))}
            onPressOut={() => setPressedButton(prev => ({ ...prev, [post.id + '-upvote']: false }))}
            accessible accessibilityLabel={post.upvoted ? 'Remove upvote' : 'Upvote'}
          >
            <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
              <AntDesign name={post.upvoted ? 'arrowup' : 'arrowup'} size={20} color={post.upvoted ? '#2E45A3' : themeColors.textSecondary} />
            </Animated.View>
            <Text style={[styles.newsActionText, { color: post.upvoted ? '#2E45A3' : themeColors.textSecondary }]}>{formatNumber(post.upvotes)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.newsActionButton, pressedButton[post.id + '-downvote'] && { backgroundColor: '#fdeaea' }]}
            onPress={() => onDownvote(post.id)}
            onPressIn={() => setPressedButton(prev => ({ ...prev, [post.id + '-downvote']: true }))}
            onPressOut={() => setPressedButton(prev => ({ ...prev, [post.id + '-downvote']: false }))}
            accessible accessibilityLabel={post.downvoted ? 'Remove downvote' : 'Downvote'}
          >
            <AntDesign name="arrowdown" size={22} color={post.downvoted ? '#E74C3C' : themeColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.newsActionButton} onPress={() => onComment(post.id)} accessible accessibilityLabel="Comment on post">
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.newsActionText, { color: themeColors.textSecondary }]}>{formatNumber(post.comments)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newsActionGroup}>
          <TouchableOpacity style={styles.newsSaveButton} onPress={handleBookmark} accessible accessibilityLabel={isBookmarked(post.id, DEFAULT_COLLECTION) ? 'Remove bookmark' : 'Bookmark post'}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
            {isBookmarked(post.id, DEFAULT_COLLECTION) ? (
              <FontAwesome name="bookmark" size={20} color={themeColors.accent} />
            ) : (
              <Feather name="bookmark" size={20} color={themeColors.textSecondary} />
            )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Latest = () => {
  const { themeColors } = useTheme();
  const { isBookmarked, toggleBookmark, DEFAULT_COLLECTION } = useBookmarks();
  const [posts, setPosts] = useState(demoPosts);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Modals and popups state
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedMorePost, setSelectedMorePost] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'u/LatestFan',
      avatar: 'commenter7.jpg',
      text: 'This is a great update! Loving the new features.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      likes: 10,
      liked: false
    },
    {
      id: 2,
      username: 'u/ReactNativeDev',
      avatar: 'commenter8.jpg',
      text: 'Expo Router 2.0 is a game changer.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      likes: 7,
      liked: false
    }
  ]);

  // Removed useEffect with window.addEventListener and window.removeEventListener as it is not supported in React Native.

  const handleUpvote = (id) => {
    setPosts(posts => posts.map(item => {
      if (item.id === id) {
        if (item.upvoted) {
          return { ...item, upvoted: false, upvotes: item.upvotes - 1 };
        } else {
          return { ...item, upvoted: true, downvoted: false, upvotes: item.upvotes + 1 };
        }
      }
      return item;
    }));
  };

  const handleDownvote = (id) => {
    setPosts(posts => posts.map(item => {
      if (item.id === id) {
        if (item.downvoted) {
          return { ...item, downvoted: false };
        } else {
          return { ...item, downvoted: true, upvoted: false, upvotes: item.upvotes - 1 };
        }
      }
      return item;
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
      timestamp: new Date(Date.now()),
      likes: 0,
      liked: false,
      replyingTo: replyingTo
    };
    setComments(prev => [newComment, ...prev]);
    setPosts(posts => posts.map(item => {
      if (item.id === selectedPost.id) {
        return { ...item, comments: item.comments + 1 };
      }
      return item;
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

  const handleSave = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      toggleBookmark(post, DEFAULT_COLLECTION);
    }
  };

  const handleImagePress = (imageName) => {
    setSelectedImage(imageMap[imageName] || { uri: imageName });
    setImageModalVisible(true);
  };

  const handleMorePress = (post) => {
    setSelectedMorePost(post);
    setMoreMenuVisible(true);
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

  const filteredPosts = posts
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(posts => posts.map(item => ({ ...item, upvoted: false, downvoted: false })));
      setRefreshing(false);
    }, 1200);
  };

  // Updated LatestCard with all button handlers
  const renderLatestCard = ({ item }) => (
    <LatestCard
      post={item}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onComment={handleComment}
      onSave={handleSave}
      themeColors={themeColors}
      isBookmarked={isBookmarked}
      DEFAULT_COLLECTION={DEFAULT_COLLECTION}
      onImagePress={handleImagePress}
      onMore={handleMorePress}
      onProfilePress={handleProfilePress}
    />
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
        <View style={[styles.header, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setMenuOpen(open => !open)}
            activeOpacity={0.7}
          >
            <Text style={[styles.headerTitle, { color: themeColors.accent }]}>Latest</Text>
            <Animated.View style={{ marginLeft: 4, marginTop: 2, transform: [{ rotate: menuOpen ? '180deg' : '0deg' }] }}>
              <Ionicons name="chevron-down" size={20} color={themeColors.icon} />
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.headerIcons} />
        </View>
        <PopupMenu visible={menuOpen} router={router} />
        {/* Category Bar */}
        <View style={[styles.categoriesContainer, { backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }] }>
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  { backgroundColor: themeColors.card },
                  selectedCategory === item && { backgroundColor: themeColors.accent }
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: themeColors.textSecondary },
                  selectedCategory === item && { color: themeColors.background }
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={renderLatestCard}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.newsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={64} color={themeColors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>No posts found</Text>
              <Text style={[styles.emptyStateSubtitle, { color: themeColors.textSecondary }]}>Try adjusting your search or category</Text>
            </View>
          )}
        />
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
        {/* More Menu */}
      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onReport={() => { setMoreMenuVisible(false); alert('Reported!'); }}
        onHide={() => { setMoreMenuVisible(false); alert('Post hidden!'); }}
        onCopyLink={() => {
          setMoreMenuVisible(false);
            alert('Link copied: https://neoping.app/latest/' + (selectedMorePost?.id || ''));
        }}
        onShare={() => {
          setMoreMenuVisible(false);
          alert('Share: ' + (selectedMorePost?.title || ''));
        }}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
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
  categoriesContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  newsList: {
    padding: 8,
  },
  newsCard: {
    marginBottom: 12,
    borderRadius: 16,
    marginHorizontal: 12,
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
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  newsUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  newsAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  newsUserDetails: {
    flex: 1,
  },
  newsUsername: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },
  newsTime: {
    fontSize: 13,
    opacity: 0.7,
  },
  moreButton: {
    padding: 4,
  },
  newsContent: {
    marginBottom: 16,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 12,
  },
  newsExcerpt: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  newsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  newsActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  newsActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  newsSaveButton: {
    padding: 4,
  },
  separator: {
    height: 8,
    backgroundColor: 'transparent',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    marginLeft: 2,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ACCENT,
    marginBottom: 18,
    marginTop: 8, // Add this if needed
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default Latest; 
