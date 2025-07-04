import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useBookmarks } from "../../components/BookmarkContext";
import CollectionModal from "../../components/CollectionModal";
import CommentModal from "../../components/CommentModal";
import ImageModal from "../../components/ImageModal";
import MoreMenu from "../../components/MoreMenu";
import PopupMenu from "../../components/PopupMenu";
import { usePosts } from "../../components/PostContext";
import ProfileModal from "../../components/ProfileModal";
import { useTheme } from "../../components/ThemeContext";
import { getRelativeTime } from "../../utils/timeUtils";

// Image mapping for profile pictures and news images
const imageMap = {
  "curry.jpg": require("../../assets/images/curry.jpg"),
  "Messi.jpg": require("../../assets/images/Messi.jpg"),
  "harry logo.webp": require("../../assets/images/harry logo.webp"),
  "Penguin.jpg": require("../../assets/images/Penguin.jpg"),
  "D.jpg": require("../../assets/images/D.jpg"),
  "K.jpg": require("../../assets/images/K.jpg"),
  "MB.jpg": require("../../assets/images/MB.jpg"),
  "N.webp": require("../../assets/images/N.webp"),
  "Ronaldo.jpg": require("../../assets/images/Ronaldo.jpg"),
  "SGA.jpg": require("../../assets/images/SGA.jpg"),
  "T1.jpg": require("../../assets/images/T1.jpg"),
  "w1.jpg": require("../../assets/images/w1.jpg"),
  "yu.jpg": require("../../assets/images/yu.jpg"),
  "Random.jpg": require("../../assets/images/Random.jpg"),
  "Grand.jpeg": require("../../assets/images/Grand.jpeg"),
  "Ramen.jpeg": require("../../assets/images/Ramen.jpeg"),
  "M8 bmw.jpg": require("../../assets/images/M8 bmw.jpg"),
  "euro's league logo.jpg": require("../../assets/images/euro's league logo.jpg"),
  "fifa logo.jpg": require("../../assets/images/fifa logo.jpg"),
  "Logo-NBA.png": require("../../assets/images/Logo-NBA.png"),
  "daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp": require("../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp"),
  "danny-1.webp": require("../../assets/images/danny-1.webp"),
  // Commenter profile images
  "commenter1.jpg": require("../../assets/images/Commenter1.jpg"),
  "commenter2.jpg": require("../../assets/images/Commenter2.jpg"),
  "commenter3.jpg": require("../../assets/images/Commenter3.jpg"),
  "commenter4.jpg": require("../../assets/images/Commenter4.jpg"),
  "commenter5.jpg": require("../../assets/images/Commenter5.jpg"),
  "commenter6.jpg": require("../../assets/images/Commenter6.jpg"),
  "commenter7.jpg": require("../../assets/images/Commenter7.jpg"),
  "commenter8.jpg": require("../../assets/images/Commenter8.jpg"),
  "commenter9.jpg": require("../../assets/images/Commenter9.jpg"),
  "commenter10.jpg": require("../../assets/images/Commenter10.jpg"),
};

// Header Component - App logo and navigation icons
const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.headerLeft}>
        {/* App Logo and Menu Toggle */}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setMenuOpen((open) => !open)}
        >
          <Text style={[styles.logoText, { color: themeColors.accent }]}>
            News
          </Text>
          <Ionicons
            name={menuOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={themeColors.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerIcons}>
        {/* Search Icon */}
        <TouchableOpacity style={{ marginRight: 16 }} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color={themeColors.icon} />
        </TouchableOpacity>
        {/* Profile Icon */}
        <TouchableOpacity onPress={onProfilePress}>
          <Ionicons
            name="person-circle-outline"
            size={28}
            color={themeColors.icon}
          />
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
        active && { backgroundColor: themeColors.accent },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.categoryText,
          { color: themeColors.textSecondary },
          active && { color: themeColors.background },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Main Post Component - Displays individual posts in the news feed
const Post = ({ post, onLike, onDislike, onComment, themeColors }) => (
  <View
    style={[
      styles.postContainer,
      { backgroundColor: themeColors.card, borderColor: themeColors.border },
    ]}
  >
    {/* Post Header - User info and more options */}
    <View style={styles.postHeader}>
      <View style={styles.userInfo}>
        <Image
          source={
            imageMap[post.avatar]
              ? imageMap[post.avatar]
              : require("../../assets/images/Commenter1.jpg")
          }
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={[styles.username, { color: themeColors.text }]}>
            {post.user}
          </Text>
          <Text style={[styles.postTime, { color: themeColors.textSecondary }]}>
            {getRelativeTime(post.time)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Feather
          name="more-horizontal"
          size={20}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>
    </View>

    {/* Post Content - Title and image */}
    <View style={styles.postContent}>
      <Text style={[styles.postTitle, { color: themeColors.text }]}>
        {post.title}
      </Text>
      {post.image && (
        <Image
          source={imageMap[post.image]}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
    </View>

    {/* Post Actions - Like, dislike, comment, share, bookmark buttons */}
    <View style={styles.postActions}>
      <View style={styles.actionGroup}>
        {/* Like Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <AntDesign
            name={post.liked ? "heart" : "hearto"}
            size={22}
            color={post.liked ? "#e74c3c" : themeColors.textSecondary}
          />
          <Text
            style={[
              styles.actionText,
              { color: post.liked ? "#e74c3c" : themeColors.textSecondary },
            ]}
          >
            {post.likes}
          </Text>
        </TouchableOpacity>
        {/* Dislike Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDislike(post.id)}
        >
          <View style={{ position: "relative" }}>
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
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            )}
          </View>
        </TouchableOpacity>
        {/* Comment Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment(post.id)}
        >
          <Feather
            name="message-circle"
            size={20}
            color={themeColors.textSecondary}
          />
          <Text
            style={[styles.actionText, { color: themeColors.textSecondary }]}
          >
            {post.comments}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionGroup}>
        {/* Share Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
        {/* Save/Bookmark Button */}
        <TouchableOpacity style={styles.saveButton}>
          {post.saved ? (
            <FontAwesome name="bookmark" size={20} color={themeColors.accent} />
          ) : (
            <Feather
              name="bookmark"
              size={20}
              color={themeColors.textSecondary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Helper function to format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
const formatCount = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

// News Card Component - Displays news articles with source attribution
const NewsCard = ({
  news,
  onUpvote,
  onDownvote,
  onComment,
  onShare,
  onImagePress,
  onSave,
  onAward,
  themeColors,
  onMore,
  isBookmarked,
  DEFAULT_COLLECTION,
  onProfilePress,
}) => (
  <View
    style={[
      styles.newsCard,
      { backgroundColor: themeColors.card, borderColor: themeColors.border },
    ]}
  >
    {/* News Header - Source info and timestamp */}
    <View style={styles.newsHeader}>
      <TouchableOpacity
        style={styles.newsUserInfo}
        onPress={() => onProfilePress(news)}
      >
        <Image source={imageMap[news.avatar]} style={styles.newsAvatar} />
        <View style={styles.newsUserDetails}>
          <Text style={[styles.newsUsername, { color: themeColors.text }]}>
            {news.user}
          </Text>
          <Text style={[styles.newsTime, { color: themeColors.textSecondary }]}>
            {getRelativeTime(news.timestamp)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton} onPress={() => onMore(news)}>
        <Feather
          name="more-horizontal"
          size={20}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>
    </View>

    {/* News Content - Title, excerpt, and image */}
    <View style={styles.newsContent}>
      <Text style={[styles.newsTitle, { color: themeColors.text }]}>
        {news.title}
      </Text>
      {news.excerpt && (
        <Text
          style={[styles.newsExcerpt, { color: themeColors.textSecondary }]}
        >
          {news.excerpt}
        </Text>
      )}
      {news.image && (
        <TouchableOpacity onPress={() => onImagePress(news.image)}>
          <Image
            source={imageMap[news.image]}
            style={styles.newsImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    </View>

    {/* News Actions - Upvote, downvote, comment, share, bookmark buttons */}
    <View style={styles.newsActions}>
      <View style={styles.newsActionGroup}>
        <TouchableOpacity
          style={styles.newsActionButton}
          onPress={() => onUpvote(news.id)}
        >
          <AntDesign
            name={news.upvoted ? "arrowup" : "arrowup"}
            size={20}
            color={news.upvoted ? "#FF4500" : themeColors.textSecondary}
          />
          <Text
            style={[
              styles.newsActionText,
              { color: news.upvoted ? "#FF4500" : themeColors.textSecondary },
            ]}
          >
            {" "}
            {formatCount(news.upvotes)}{" "}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newsActionButton}
          onPress={() => onDownvote(news.id)}
        >
          <AntDesign
            name="arrowdown"
            size={20}
            color={news.downvoted ? "#7193FF" : themeColors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newsActionButton}
          onPress={() => onComment(news.id)}
        >
          <Feather
            name="message-circle"
            size={20}
            color={themeColors.textSecondary}
          />
          <Text
            style={[
              styles.newsActionText,
              { color: themeColors.textSecondary },
            ]}
          >
            {formatCount(news.comments)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.newsActionGroup}>
        <TouchableOpacity
          style={styles.newsActionButton}
          onPress={() => onShare(news.id)}
        >
          <Feather name="share-2" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newsSaveButton}
          onPress={() => onSave(news.id)}
        >
          {isBookmarked(news.id, DEFAULT_COLLECTION) ? (
            <FontAwesome name="bookmark" size={20} color={themeColors.accent} />
          ) : (
            <Feather
              name="bookmark"
              size={20}
              color={themeColors.textSecondary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Main News Screen Component
const News = () => {
  // State management for news and UI
  const { posts } = usePosts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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
  const {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    collections,
    DEFAULT_COLLECTION,
  } = useBookmarks();

  // Force re-render every minute to update timestamps
  const [, setTimeUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // News categories for filtering
  const categories = [
    "All",
    "Technology",
    "Sports",
    "Science",
    "Entertainment",
    "Business",
    "Politics",
    "Health",
  ];

  // Handle upvote button press - increases upvotes and toggles upvote state
  const handleUpvote = (id) => {
    setPosts((posts) =>
      posts.map((item) => {
        if (item.id === id) {
          if (item.upvoted) {
            return { ...item, upvoted: false, upvotes: item.upvotes - 1 };
          } else {
            return {
              ...item,
              upvoted: true,
              downvoted: false,
              upvotes: item.upvotes + 1,
            };
          }
        }
        return item;
      })
    );
  };

  // Handle downvote button press - decreases upvotes and toggles downvote state
  const handleDownvote = (id) => {
    setPosts((posts) =>
      posts.map((item) => {
        if (item.id === id) {
          if (item.downvoted) {
            return { ...item, downvoted: false };
          } else {
            return {
              ...item,
              downvoted: true,
              upvoted: false,
              upvotes: item.upvotes - 1,
            };
          }
        }
        return item;
      })
    );
  };

  // Handle comment button press - fetch comments and open modal
  const handleComment = async (id) => {
    const newsItem = posts.find((n) => n.id === id);
    setSelectedNews(newsItem);
    setComments([]);
    setCommentsError(null);
    setCommentsLoading(true);
    setCommentModalVisible(true);
    try {
      const { fetchComments } = await import('../../utils/comments');
      const backendComments = await fetchComments(newsItem.id);
      setComments(backendComments.map(c => ({
        id: c.id,
        username: c.userName,
        avatar: c.avatar || 'commenter1.jpg',
        text: c.content,
        time: new Date(c.createdAt).toLocaleString(),
        likes: c.likes || 0,
        liked: false
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
    if (!selectedNews) return;
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
        postId: selectedNews.id,
        content: text,
        userName,
        parentCommentId: replyingTo
      });
      setPosts(posts => posts.map(post => {
        if (post.id === selectedNews.id) {
          return { ...post, comments: post.comments + 1 };
        }
        return post;
      }));
    } catch (err) {
      setCommentsError('Failed to post comment.');
      setComments(prev => prev.filter(c => c.id !== tempId));
    }
  };

  // Handle liking a comment
  const handleLikeComment = (commentId) => {
    setComments((comments) =>
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (comment.liked) {
            return { ...comment, liked: false, likes: comment.likes - 1 };
          } else {
            return { ...comment, liked: true, likes: comment.likes + 1 };
          }
        }
        return comment;
      })
    );
  };

  // Handle share functionality
  const handleShare = async (id) => {
    try {
      const newsItem = posts.find((n) => n.id === id);
      if (!newsItem) return;

      const shareContent = {
        title: newsItem.title,
        message: `${newsItem.title}\n\n${newsItem.excerpt || ""}\n\nSource: ${
          newsItem.source
        }\n\nCheck out this news on Neoping!`,
        url: `https://neoping.app/news/${id}`, // In a real app, this would be the actual news URL
      };

      // Platform-specific share options
      const shareOptions =
        Platform.OS === "ios"
          ? {
              excludedActivityTypes: [
                "com.apple.UIKit.activity.Print",
                "com.apple.UIKit.activity.AssignToContact",
              ],
            }
          : {
              dialogTitle: "Share this news",
            };

      const result = await Share.share(shareContent, shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with: ${result.activityType}`);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Failed to share news");
    }
  };

  // Filter and sort posts for News feed
  const filteredNews = posts
    .filter((post) => (post.category || "").toLowerCase() === "news")
    .filter((item) => {
      const matchesSearch =
        searchText.trim() === "" ||
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.content &&
          item.content.toLowerCase().includes(searchText.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Search functionality handlers
  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };

  // Pull to refresh functionality
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts((posts) =>
        posts.map((item) => ({ ...item, upvoted: false, downvoted: false }))
      );
      setRefreshing(false);
    }, 1500);
  };

  // Handle image press for full-screen viewing
  const handleImagePress = (imageName) => {
    setSelectedImage(imageMap[imageName] || { uri: imageName });
    setImageModalVisible(true);
  };

  const handleSave = (id) => {
    const newsItem = posts.find((n) => n.id === id);
    if (newsItem) {
      toggleBookmark(newsItem, DEFAULT_COLLECTION);
    }
  };
  const handleAward = (id) => {
    setPosts((posts) =>
      posts.map((item) =>
        item.id === id ? { ...item, awarded: !item.awarded } : item
      )
    );
  };

  const handleMorePress = (news) => {
    setSelectedMorePost(news);
    setMoreMenuVisible(true);
  };

  // Handler for long-press (open collection modal)
  const handleBookmarkLongPress = (id) => {
    const newsItem = posts.find((n) => n.id === id);
    if (newsItem) {
      setCollectionModalPost(newsItem);
      setCollectionModalVisible(true);
    }
  };

  const handleProfilePress = (news) => {
    const userPosts = posts.filter((n) => n.user === news.user);
    router.navigate("profile", {
      user: {
        avatar: news.avatar,
        user: news.user,
        posts: userPosts,
      },
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {searchOpen ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingTop: 40,
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <Ionicons
            name="search"
            size={22}
            color={themeColors.icon}
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              fontSize: 18,
              color: themeColors.text,
              paddingVertical: 8,
            }}
            placeholder="Search news"
            placeholderTextColor={themeColors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={{ marginHorizontal: 4 }}
            >
              <Ionicons
                name="close-circle"
                size={22}
                color={themeColors.icon}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleCancelSearch}
            style={{ marginLeft: 8 }}
          >
            <Text style={{ color: themeColors.accent, fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {!searchOpen && (
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          onProfilePress={() => {
            setLastTabPath(pathname);
            setProfileModalVisible(true);
          }}
          onSearchPress={handleSearchIcon}
        />
      )}
      <PopupMenu visible={menuOpen} router={router} />
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onLogout={() => {
          setProfileModalVisible(false);
          if (lastTabPath) router.replace(lastTabPath);
        }}
        lastTabPath={lastTabPath}
      />

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
          loading={commentsLoading}
          error={commentsError}
          onRetry={() => handleComment(selectedNews.id)}
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

      <View
        style={[
          styles.categoriesContainer,
          {
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderColor: themeColors.border,
          },
        ]}
      >
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

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NewsCard
            news={{ ...item, saved: isBookmarked(item.id, DEFAULT_COLLECTION) }}
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
        onRefresh={onRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons
              name="newspaper-outline"
              size={64}
              color={themeColors.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: themeColors.text }]}>
              No news found
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              {searchText.trim()
                ? "Try adjusting your search terms"
                : "Try selecting a different category"}
            </Text>
          </View>
        )}
      />

      <MoreMenu
        visible={moreMenuVisible}
        onClose={() => setMoreMenuVisible(false)}
        onReport={() => {
          setMoreMenuVisible(false);
          alert("Reported!");
        }}
        onHide={() => {
          setMoreMenuVisible(false);
          alert("Post hidden!");
        }}
        onCopyLink={() => {
          setMoreMenuVisible(false);
          alert(
            "Link copied: https://neoping.app/news/" +
              (selectedMorePost?.id || "")
          );
        }}
        onShare={() => {
          setMoreMenuVisible(false);
          alert("Share: " + (selectedMorePost?.title || ""));
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
        boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
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
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 2,
    backgroundColor: "#f0f0f0",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "500",
  },
  saveButton: {
    padding: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 22,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
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
  activeCategoryButton: {},
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeCategoryText: {
    fontWeight: "bold",
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
        boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  newsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  newsUserInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
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
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 12,
  },
  newsExcerpt: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  newsImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  newsActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  newsActionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  newsActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  newsActionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  newsSaveButton: {
    padding: 4,
  },
  separator: {
    height: 8,
    backgroundColor: "transparent",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});

export default News;
