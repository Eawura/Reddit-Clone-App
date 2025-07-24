import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Image, Platform, RefreshControl, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CollectionModal from '../../components/CollectionModal';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import { useNews } from '../../components/NewsContext';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { formatNumber } from '../../utils/numberUtils';
import { getRelativeTime } from '../../utils/timeUtils';

// Image mapping for profile pictures and news images
const imageMap = {
  'curry.jpg': require('../../assets/images/curry.jpg'),
  'Messi.jpg': require('../../assets/images/Messi.jpg'),
  'harry logo.webp': require('../../assets/images/harry logo.webp'),
  'Penguin.jpg': require('../../assets/images/Penguin.jpg'),
  'D.jpg': require('../../assets/images/D.jpg'),
  'K.jpg': require('../../assets/images/K.jpg'),
  'MB.jpg': require('../../assets/images/MB.jpg'),
  'N.webp': require('../../assets/images/N.webp'),
  'Ronaldo.jpg': require('../../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../../assets/images/SGA.jpg'),
  'T1.jpg': require('../../assets/images/T1.jpg'),
  'w1.jpg': require('../../assets/images/w1.jpg'),
  'yu.jpg': require('../../assets/images/yu.jpg'),
  'Random.jpg': require('../../assets/images/Random.jpg'),
  'Grand.jpeg': require('../../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../../assets/images/Ramen.jpeg'),
  'M8 bmw.jpg': require('../../assets/images/M8 bmw.jpg'),
  'euro\'s league logo.jpg': require('../../assets/images/euro\'s league logo.jpg'),
  'fifa logo.jpg': require('../../assets/images/fifa logo.jpg'),
  'Logo-NBA.png': require('../../assets/images/Logo-NBA.png'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'danny-1.webp': require('../../assets/images/danny-1.webp'),
  // Commenter profile images
  'BBC.jpg': require('../../assets/images/BBC.jpg'),
  'science.jpg': require('../../assets/images/science.jpg'),
  'ESPN.jpg': require('../../assets/images/ESPN.jpg'),
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
  'Pulse-on-Global-Health.jpg': require('../../assets/images/Pulse-on-Global-Health.jpg'),
  'ai-breakthrough-tech.jpg': require('../../assets/images/ai-breakthrough-tech.jpg'),
  'underdog-championship-sports.jpg': require('../../assets/images/underdog-championship-sports.jpg'),
  'exercise-study-science.jpg': require('../../assets/images/exercise-study-science.jpg'),
  'director-blockbuster-entertainment.jpg': require('../../assets/images/director-blockbuster-entertainment.jpg'),
  'global-markets-business.jpg': require('../../assets/images/global-markets-business.jpg'),
  'climate-legislation-politics.jpg': require('../../assets/images/climate-legislation-politics.jpg'),
  'cancer-treatment-health.jpg': require('../../assets/images/cancer-treatment-health.jpg'),
  'quantum-computing-technology.jpg': require('../../assets/images/quantum-computing-technology.jpg'),
  // Add a default fallback image to imageMap
  'image-fallback.jpg': require('../../assets/images/Random.jpg'),
  'Cole Palmer.jpg': require('../../assets/images/Cole Palmer.jpg'),
  'CWC.jpg': require('../../assets/images/CWC.jpg'),
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

// Header Component - App logo and navigation icons
const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
    const router = useRouter();
  const { themeColors } = useTheme();
    return (
    <View style={[styles.header, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
            <View style={styles.headerLeft}>
        {/* App Logo and Menu Toggle */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
          <Text style={[styles.logoText, { color: themeColors.accent } ]}>News</Text>
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
  );
};

// Category Button Component - For filtering news by category
const CategoryButton = ({ title, active, onPress }) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity 
        style={[
          styles.categoryButton, 
          { backgroundColor: themeColors.card },
          active && { backgroundColor: themeColors.accent }
        ]} 
        onPress={onPress}
    >
        <Text style={[
          styles.categoryText, 
          { color: themeColors.textSecondary },
          active && { color: themeColors.background }
        ]}>{title}</Text>
    </TouchableOpacity>
  );
};

// News Card Component - Displays news articles with source attribution
const NewsCard = ({ news, onUpvote, onDownvote, onComment, onShare, onImagePress, onSave, onAward, themeColors, onMore, isBookmarked, DEFAULT_COLLECTION, onProfilePress }) => {
  // Debug logs for avatar and image lookups
  console.log('DEBUG: News ID', news.id, 'avatar lookup:', news.avatar, '->', imageMap[news.avatar]);
  console.log('DEBUG: News ID', news.id, 'image lookup:', news.image, '->', imageMap[news.image]);
  const [imgError, setImgError] = useState(false);
  const upvoteScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const [pressedButton, setPressedButton] = useState({});

  // Robust avatar resolution
  const avatarKey = (news.avatar || '').trim();
  let avatarSource = imageMap[avatarKey];
  if (!avatarSource && avatarKey.toLowerCase().endsWith('.jpg')) {
    avatarSource = imageMap[avatarKey.replace(/\.jpg$/i, '.jpeg')];
  } else if (!avatarSource && avatarKey.toLowerCase().endsWith('.jpeg')) {
    avatarSource = imageMap[avatarKey.replace(/\.jpeg$/i, '.jpg')];
  }
  if (!avatarSource) {
    avatarSource = imageMap['Random.jpg'];
  }

  const animateIcon = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handleUpvote = () => {
    animateIcon(upvoteScale);
    onUpvote(news.id);
  };
  const handleBookmark = () => {
    animateIcon(bookmarkScale);
    onSave(news.id);
  };

  return (
    <View style={[styles.newsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border, shadowColor: themeColors.shadow || '#000' }]}>  
      {/* Category Badge */}
      {news.category && (
        <View style={[styles.categoryBadge, { backgroundColor: themeColors.accent + '22', borderColor: themeColors.accent }]}> 
          <Text style={[styles.categoryBadgeText, { color: themeColors.accent }]}>{news.category}</Text>
        </View>
      )}
    {/* News Header - Source info and timestamp */}
    <View style={styles.newsHeader}>
        <TouchableOpacity
          style={styles.newsUserInfo}
          onPress={() => onProfilePress(news)}
          accessible accessibilityLabel={`View profile for ${news.user}`}
        >
          <Image
            source={avatarSource}
            style={styles.newsAvatar}
            accessible accessibilityLabel={`Avatar for ${news.user}`}
          />
          <View style={styles.newsUserDetails}>
            <Text style={[styles.newsUsername, { color: themeColors.text }]}>n/{news.user}</Text>
            <Text style={[styles.newsTime, { color: themeColors.textSecondary }]}>{getRelativeTime(news.timestamp)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onMore(news)}
          accessible accessibilityLabel="Show more options"
        >
        <Feather name="more-horizontal" size={20} color={themeColors.textSecondary} />
      </TouchableOpacity>
    </View>

    {/* News Content - Title, excerpt, and image */}
    <View style={styles.newsContent}>
      <Text style={[styles.newsTitle, { color: themeColors.text }]}>{news.title}</Text>
      {news.excerpt && (
        <Text style={[styles.newsExcerpt, { color: themeColors.textSecondary }]}>{news.excerpt}</Text>
      )}
      {news.image && (
          <TouchableOpacity
            onPress={() => onImagePress(news.image)}
            accessible accessibilityLabel={`View image for ${news.title}`}
          >
          <Image 
              source={imgError ? imageMap['image-fallback.jpg'] : imageMap[news.image] ? imageMap[news.image] : require('../../assets/images/Random.jpg')}
            style={styles.newsImage}
            resizeMode="cover"
              onError={() => setImgError(true)}
              accessible accessibilityLabel={news.title}
          />
        </TouchableOpacity>
      )}
    </View>

    {/* News Actions - Upvote, downvote, comment, share, bookmark buttons */}
    <View style={styles.newsActions}>
      <View style={styles.newsActionGroup}>
          <TouchableOpacity
            style={[styles.newsActionButton, pressedButton[news.id + '-upvote'] && { backgroundColor: '#e8f0fe' }]}
            onPress={handleUpvote}
            onPressIn={() => setPressedButton(prev => ({ ...prev, [news.id + '-upvote']: true }))}
            onPressOut={() => setPressedButton(prev => ({ ...prev, [news.id + '-upvote']: false }))}
            accessible accessibilityLabel={news.upvoted ? 'Remove upvote' : 'Upvote'}
          >
            <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
          <AntDesign 
            name={news.upvoted ? 'arrowup' : 'arrowup'} 
            size={20} 
                color={news.upvoted ? '#2E45A3' : themeColors.textSecondary}
          />
            </Animated.View>
            <Text style={[styles.newsActionText, { color: news.upvoted ? '#2E45A3' : themeColors.textSecondary }]}> {formatNumber(news.upvotes)} </Text>
        </TouchableOpacity>
          <TouchableOpacity
            style={[styles.newsActionButton, pressedButton[news.id + '-downvote'] && { backgroundColor: '#fdeaea' }]}
            onPress={() => onDownvote(news.id)}
            onPressIn={() => setPressedButton(prev => ({ ...prev, [news.id + '-downvote']: true }))}
            onPressOut={() => setPressedButton(prev => ({ ...prev, [news.id + '-downvote']: false }))}
            accessible accessibilityLabel={news.downvoted ? 'Remove downvote' : 'Downvote'}
          >
          <AntDesign 
            name="arrowdown" 
              size={22}
              color={news.downvoted ? '#E74C3C' : themeColors.textSecondary}
          />
        </TouchableOpacity>
          <TouchableOpacity
            style={styles.newsActionButton}
            onPress={() => onComment(news.id)}
            accessible accessibilityLabel="Comment on news"
          >
          <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
          <Text style={[styles.newsActionText, { color: themeColors.textSecondary }]}>{formatNumber(news.comments)}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newsActionGroup}>
          <TouchableOpacity
            style={styles.newsActionButton}
            onPress={() => onShare(news.id)}
            accessible accessibilityLabel="Share news"
          >
          <Feather name="share-2" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
          <TouchableOpacity
            style={styles.newsSaveButton}
            onPress={handleBookmark}
            accessible accessibilityLabel={isBookmarked(news.id, DEFAULT_COLLECTION) ? 'Remove bookmark' : 'Bookmark news'}
          >
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
          {isBookmarked(news.id, DEFAULT_COLLECTION) ? (
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

// Add demo news data with categories at the top of the News component
const demoNews = [
  {
    id: 'n1',
    user: 'BBC News',
    avatar: 'BBC.jpg',
    title: 'Quantum Computing Milestone Achieved by Research Team (UPDATED)', // Updated title as a placeholder
    excerpt: 'A major breakthrough in quantum computing could revolutionize technology as we know it.',
    image: 'ai-breakthrough-tech.jpg',
    category: 'Technology',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    upvotes: 1234,
    comments: 56,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n2',
    user: 'ESPN',
    avatar: 'ESPN.jpg',
    title: 'Underdog Team Chelsea FC wins Club world cup in Stunning Upset',
    excerpt: 'Fans celebrate as the underdog team clinches the title in a dramatic final match.',
    image: 'underdog-championship-sports.jpg',
    category: 'Sports',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    upvotes: 987,
    comments: 34,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n3',
    user: 'Science Daily',
    avatar: 'science.jpg',
    title: 'New Study Reveals Benefits of Daily Exercise',
    excerpt: 'Researchers find that even moderate daily exercise can have significant health benefits.',
    image: 'exercise-study-science.jpg',
    category: 'Health',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    upvotes: 654,
    comments: 21,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n4',
    user: 'Variety',
    avatar: 'commenter4.jpg',
    title: 'Award-Winning Director Announces New Blockbuster',
    excerpt: 'The acclaimed director teases fans with details of an upcoming film project.',
    image: 'director-blockbuster-entertainment.jpg',
    category: 'Entertainment',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    upvotes: 432,
    comments: 12,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n5',
    user: 'Bloomberg',
    avatar: 'commenter5.jpg',
    title: 'Global Markets Rally After Economic Report',
    excerpt: 'Stock markets around the world surged following positive economic news.',
    image: 'global-markets-business.jpg',
    category: 'Business',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    upvotes: 321,
    comments: 8,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n6',
    user: 'Reuters',
    avatar: 'commenter6.jpg',
    title: 'New Climate Legislation Passed by Parliament',
    excerpt: 'Lawmakers have approved sweeping new measures to address climate change.',
    image: 'climate-legislation-politics.jpg',
    category: 'Politics',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    upvotes: 210,
    comments: 5,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n7',
    user: 'Healthline',
    avatar: 'Pulse-on-Global-Health.jpg',
    title: 'Breakthrough in Cancer Treatment Announced',
    excerpt: 'A new therapy shows promise in treating certain types of cancer.',
    image: 'cancer-treatment-health.jpg',
    category: 'Health',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
    upvotes: 198,
    comments: 3,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
  {
    id: 'n8',
    user: 'TechCrunch',
    avatar: 'commenter8.jpg',
    title: 'Quantum Computing: The Next Big Leap',
    excerpt: 'Experts discuss the future of quantum computing and its potential impact.',
    image: 'quantum-computing-technology.jpg',
    category: 'Technology',
    timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
    upvotes: 150,
    comments: 2,
    upvoted: false,
    downvoted: false,
    saved: false,
  },
];

// Skeleton Loader Component
const NewsCardSkeleton = ({ themeColors }) => (
  <View style={[styles.newsCard, { backgroundColor: themeColors.card, borderColor: themeColors.border, opacity: 0.7 }]}>  
    <View style={[styles.skeletonBadge, { backgroundColor: themeColors.accent + '22' }]} />
    <View style={styles.skeletonHeader}>
      <View style={[styles.skeletonAvatar, { backgroundColor: themeColors.border }]} />
      <View style={styles.skeletonUserDetails}>
        <View style={[styles.skeletonLine, { width: 80, backgroundColor: themeColors.border }]} />
        <View style={[styles.skeletonLine, { width: 50, backgroundColor: themeColors.border, marginTop: 4 }]} />
      </View>
    </View>
    <View style={[styles.skeletonLine, { width: '70%', height: 18, backgroundColor: themeColors.border, marginVertical: 12 }]} />
    <View style={[styles.skeletonImage, { backgroundColor: themeColors.border }]} />
    <View style={[styles.skeletonActions, { backgroundColor: themeColors.background }]} />
  </View>
);

// Main News Screen Component
const News = () => {
  // State management for news and UI
  const { newsList, setNewsList } = useNews();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedMorePost, setSelectedMorePost] = useState(null);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [collectionModalPost, setCollectionModalPost] = useState(null);
  // In News component, add loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []); // Only for loading skeleton, not for resetting newsList
  
  // Sample comments data for the comment modal
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'u/NewsReader1',
      avatar: 'commenter7.jpg',
      text: 'This is really important news. Thanks for sharing!',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      likes: 23,
      liked: false
    },
    {
      id: 2,
      username: 'u/InformedUser',
      avatar: 'commenter8.jpg',
      text: 'I\'ve been following this story. Great coverage.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      likes: 18,
      liked: false
    },
    {
      id: 3,
      username: 'u/NewsEnthusiast',
      avatar: 'commenter9.jpg',
      text: 'This will have major implications for the industry.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      likes: 12,
      liked: false
    }
  ]);
  
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();
  const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();

  // Force re-render every minute to update timestamps
  const [, setTimeUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Removed useEffect with window.addEventListener and window.removeEventListener as it is not supported in React Native.

  // News categories for filtering
  const categories = ['All', 'Technology', 'Sports', 'Science', 'Entertainment', 'Business', 'Politics', 'Health'];

  // Handle upvote button press - increases upvotes and toggles upvote state
    const handleUpvote = (id) => {
        setNewsList(newsList => newsList.map(item => {
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

  // Handle downvote button press - decreases upvotes and toggles downvote state
    const handleDownvote = (id) => {
        setNewsList(newsList => newsList.map(item => {
            if (item.id === id) {
        if (item.downvoted) {
          return { ...item, downvoted: false };
        } else {
                return { 
                    ...item, 
            downvoted: true, 
                    upvoted: false,
            upvotes: item.upvotes - 1
          };
        }
      }
      return item;
    }));
  };

  // Handle comment button press - opens comment modal
  const handleComment = (id) => {
    const newsItem = newsList.find(n => n.id === id);
    setSelectedNews(newsItem);
    setCommentModalVisible(true);
  };

  // Handle adding a new comment
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
    
    // Update news comment count
    setNewsList(newsList => newsList.map(item => {
      if (item.id === selectedNews.id) {
        return { ...item, comments: item.comments + 1 };
            }
            return item;
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

  // Handle share functionality
  const handleShare = async (id) => {
    try {
      const newsItem = newsList.find(n => n.id === id);
      if (!newsItem) return;

      const shareContent = {
        title: newsItem.title,
        message: `${newsItem.title}\n\n${newsItem.excerpt || ''}\n\nSource: ${newsItem.user}\n\nCheck out this news on Neoping!`,
        url: `https://neoping.app/news/${id}`, // In a real app, this would be the actual news URL
      };

      // Platform-specific share options
      const shareOptions = Platform.OS === 'ios' ? {
        excludedActivityTypes: ['com.apple.UIKit.activity.Print', 'com.apple.UIKit.activity.AssignToContact'],
      } : {
        dialogTitle: 'Share this news',
      };

      const result = await Share.share(shareContent, shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with: ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share news');
    }
  };

  // Filter and sort posts for News feed
  const filteredNews = newsList
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .filter(item => {
      const matchesSearch = searchText.trim() === '' || 
        (typeof item.title === 'string' && item.title.toLowerCase().includes(searchText.toLowerCase())) ||
        (typeof item.excerpt === 'string' && item.excerpt.toLowerCase().includes(searchText.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Search functionality handlers
  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

  // Pull to refresh functionality
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNewsList(newsList => newsList.map(item => ({ ...item, upvoted: false, downvoted: false })));
      setRefreshing(false);
    }, 1500);
  };

  // Handle image press for full-screen viewing
  const handleImagePress = (imageName) => {
    setSelectedImage(imageMap[imageName] || { uri: imageName });
    setImageModalVisible(true);
  };

  const handleSave = (id) => {
    const newsItem = newsList.find(n => n.id === id);
    if (newsItem) {
      toggleBookmark(newsItem, DEFAULT_COLLECTION);
    }
  };
  const handleAward = (id) => {
    setNewsList(newsList => newsList.map(item => item.id === id ? { ...item, awarded: !item.awarded } : item));
  };

  const handleMorePress = (news) => {
    setSelectedMorePost(news);
    setMoreMenuVisible(true);
  };

  // Handler for long-press (open collection modal)
  const handleBookmarkLongPress = (id) => {
    const newsItem = newsList.find(n => n.id === id);
    if (newsItem) {
      setCollectionModalPost(newsItem);
      setCollectionModalVisible(true);
    }
  };

  const handleProfilePress = (news) => {
    router.push({
      pathname: '/profile',
      params: {
        userId: news.id,
        username: news.user,
        avatar: news.avatar,
      },
    });
  };

    return (
    <View style={[styles.container, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
            <Stack.Screen options={{ headerShown: false }} />
      {searchOpen ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 40, backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }}>
          <Ionicons name="search" size={22} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 18, color: themeColors.text, paddingVertical: 8 }}
            placeholder="Search news"
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
            <Text style={{ color: themeColors.accent, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {!searchOpen && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} onSearchPress={handleSearchIcon} />
      )}
            <PopupMenu visible={menuOpen} router={router} />
      <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
      
      {/* Comment Modal */}
      {selectedNews && (
        <CommentModal
          visible={commentModalVisible}
          onClose={() => setCommentModalVisible(false)}
          post={selectedNews}
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
            
            <View style={[styles.categoriesContainer, { backgroundColor: themeColors.background, borderBottomWidth: 1, borderColor: themeColors.border }]}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <CategoryButton
                            title={item}
                            active={selectedCategory === item}
                            onPress={() => setSelectedCategory(item)}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

            {loading ? (
  <FlatList
    data={[1,2,3,4,5]}
    keyExtractor={item => item.toString()}
    renderItem={() => <NewsCardSkeleton themeColors={themeColors} />}
    contentContainerStyle={styles.newsList}
  />
) : (
            <FlatList
                data={filteredNews}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NewsCard 
                        news={{...item, saved: isBookmarked(item.id, DEFAULT_COLLECTION)}}
                        onUpvote={handleUpvote} 
                        onDownvote={handleDownvote} 
                        onComment={handleComment}
                        onShare={handleShare}
                        onImagePress={handleImagePress}
                        onSave={handleSave}
                        onAward={handleAward}
                        themeColors={themeColors}
                        onMore={handleMorePress}
                        isBookmarked={isBookmarked}
                        DEFAULT_COLLECTION={DEFAULT_COLLECTION}
                        onProfilePress={handleProfilePress}
                    />
                )}
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
        <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>No news found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: themeColors.textSecondary }]}>
              {searchText.trim() ? 'Try adjusting your search terms' : 'Try selecting a different category'}
            </Text>
          </View>
        )}
            />
)}

      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onReport={() => { setMoreMenuVisible(false); alert('Reported!'); }}
        onHide={() => { setMoreMenuVisible(false); alert('Post hidden!'); }}
        onCopyLink={() => {
          setMoreMenuVisible(false);
          alert('Link copied: https://neoping.app/news/' + (selectedMorePost?.id || ''));
        }}
        onShare={() => {
          setMoreMenuVisible(false);
          alert('Share: ' + (selectedMorePost?.title || ''));
        }}
      />

      {/* Collection Modal */}
      <CollectionModal
        visible={collectionModalVisible}
        onClose={() => setCollectionModalVisible(false)}
        post={collectionModalPost}
      />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    paddingTop: 50,
        paddingHorizontal: 16,
    paddingBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
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
    activeCategoryButton: {
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeCategoryText: {
        fontWeight: 'bold',
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
    height: 300,
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
  skeletonBadge: {
  width: 60,
  height: 20,
  borderRadius: 10,
  marginBottom: 8,
},
skeletonHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
skeletonAvatar: {
  width: 28,
  height: 28,
  borderRadius: 14,
  marginRight: 8,
},
skeletonUserDetails: {
  flex: 1,
},
skeletonLine: {
  height: 12,
  borderRadius: 6,
  marginBottom: 6,
},
skeletonImage: {
  width: '100%',
  height: 180,
  borderRadius: 12,
  marginTop: 8,
  marginBottom: 4,
},
skeletonActions: {
  height: 24,
  borderRadius: 6,
  marginTop: 12,
    },
});

export default News; 