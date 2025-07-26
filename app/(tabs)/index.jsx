import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CollectionModal from '../../components/CollectionModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import { usePosts } from '../../components/PostContext';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { formatNumber } from '../../utils/numberUtils';
import { getRelativeTime } from '../../utils/timeUtils';

// Image mapping for profile pictures and post images
const imageMap = {
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
  'Cole Palmer.jpg': require('../../assets/images/Cole Palmer.jpg'),
  'CWC.jpg': require('../../assets/images/CWC.jpg'),
  'Ramen.jpeg': require('../../assets/images/Ramen.jpeg'),
  'M8 bmw.jpg': require('../../assets/images/M8 bmw.jpg'),
  'euro\'s league logo.jpg': require('../../assets/images/euro\'s league logo.jpg'),
  'fifa logo.jpg': require('../../assets/images/fifa logo.jpg'),
  'Logo-NBA.png': require('../../assets/images/Logo-NBA.png'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'danny-1.webp': require('../../assets/images/danny-1.webp'),
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

// Comment Component
const Comment = ({ comment, onLike, onReply, themeColors }) => {
  const router = useRouter();
  return (
    <View style={[styles.commentContainer, { borderBottomColor: themeColors.border }]}>
      <View style={styles.commentHeader}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/profile', params: { userId: comment.id, username: comment.username, avatar: comment.avatar } })}>
          <Image source={imageMap[comment.avatar] ? imageMap[comment.avatar] : require('../../assets/images/Commenter1.jpg')} style={styles.commentAvatar} />
        </TouchableOpacity>
        <View style={styles.commentInfo}>
          <Text style={[styles.commentUsername, { color: themeColors.text }]}>{comment.username}</Text>
          <Text style={[styles.commentTime, { color: themeColors.textSecondary }]}>{getRelativeTime(comment.timestamp)}</Text>
        </View>
      </View>
      <Text style={[styles.commentText, { color: themeColors.text }]}>{comment.text}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.commentAction} onPress={() => onLike(comment.id)}>
          <AntDesign name={comment.liked ? 'heart' : 'hearto'} size={16} color={comment.liked ? '#e74c3c' : themeColors.icon} />
          <Text style={[styles.commentActionText, { color: comment.liked ? '#e74c3c' : themeColors.textSecondary }]}>{comment.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentAction} onPress={() => onReply(comment.id)}>
          <Feather name="message-circle" size={16} color={themeColors.icon} />
          <Text style={[styles.commentActionText, { color: themeColors.textSecondary }]}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Comment Modal Component
const CommentModal = ({ visible, onClose, post, comments, onAddComment, onLikeComment, onReplyComment, themeColors }) => {
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText, replyingTo);
      setCommentText('');
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={[styles.commentModalBackdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.commentModal, { backgroundColor: themeColors.background }]}>
            {/* Header */}
            <View style={[styles.commentModalHeader, { borderBottomColor: themeColors.border }]}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={themeColors.icon} />
              </TouchableOpacity>
              <Text style={[styles.commentModalTitle, { color: themeColors.text }]}>Comments</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Post Preview */}
            <View style={[styles.postPreview, { borderBottomColor: themeColors.border }]}>
              <View style={styles.postPreviewHeader}>
                <Image source={imageMap[post.avatar] ? imageMap[post.avatar] : require('../../assets/images/Commenter1.jpg')} style={styles.postPreviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.postPreviewUser, { color: themeColors.text }]}>{post.user}</Text>
                  <Text style={[styles.postPreviewTitle, { color: themeColors.text }]}>{post.title}</Text>
                </View>
              </View>
            </View>

            {/* Comments List */}
            <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onLike={onLikeComment}
                    onReply={handleReply}
                    themeColors={themeColors}
                  />
                ))
              ) : (
                <View style={styles.emptyComments}>
                  <Feather name="message-circle" size={48} color={themeColors.textSecondary} />
                  <Text style={[styles.emptyCommentsText, { color: themeColors.textSecondary }]}>No comments yet</Text>
                  <Text style={[styles.emptyCommentsSubtext, { color: themeColors.textSecondary }]}>Be the first to comment!</Text>
                </View>
              )}
            </ScrollView>

            {/* Reply Indicator */}
            {replyingTo && (
              <View style={[styles.replyIndicator, { backgroundColor: themeColors.card }]}>
                <Text style={[styles.replyText, { color: themeColors.textSecondary }]}>
                  Replying to {comments.find(c => c.id === replyingTo)?.username}
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
                  <Ionicons name="close" size={20} color={themeColors.icon} />
                </TouchableOpacity>
              </View>
            )}

            {/* Comment Input */}
            <View style={[styles.commentInputContainer, { borderTopColor: themeColors.border }]}>
              <TextInput
                style={[styles.commentInput, { color: themeColors.text, backgroundColor: themeColors.card }]}
                placeholder="Add a comment..."
                placeholderTextColor={themeColors.textSecondary}
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.commentSubmit, { backgroundColor: commentText.trim() ? '#FF4500' : themeColors.border }]}
                onPress={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                <Text style={[styles.commentSubmitText, { color: commentText.trim() ? '#fff' : themeColors.textSecondary }]}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const Post = ({ post, onLike, onDislike, onComment, onShare, onImagePress, onSave, onAward, themeColors, onMore, isBookmarked, DEFAULT_COLLECTION, onProfilePress }) => {
  // Debug logs for avatar and image lookups
  console.log('DEBUG: Post ID', post.id, 'avatar lookup:', post.avatar, '->', imageMap[post.avatar]);
  console.log('DEBUG: Post ID', post.id, 'image lookup:', post.image, '->', imageMap[post.image]);
  // Double-tap logic using ref
  const lastTap = useRef(null);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap.current && (now - lastTap.current) < 300) {
      onLike(post.id);
    }
    lastTap.current = now;
  };

  return (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity style={styles.userInfo} onPress={() => onProfilePress(post)}>
          <TouchableOpacity onPress={() => onProfilePress(post)}>
            <Image
              source={imageMap[post.avatar] ? imageMap[post.avatar] : require('../../assets/images/Commenter1.jpg')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: themeColors.text }]}>{post.user}</Text>
            <Text style={[styles.postTime, { color: themeColors.textSecondary }]}>{getRelativeTime(post.timestamp)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} onPress={() => onMore(post)}>
          <Feather name="more-horizontal" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </View>
      {/* Post Content with double-tap to like, but NOT profile navigation */}
      <Pressable onPress={handleDoubleTap}>
        <View style={styles.postContent}>
          <Text style={[styles.postTitle, { color: themeColors.text }]}>{post.title}</Text>
          {post.content && (
            <Text style={[styles.postBody, { color: themeColors.text }]}>{post.content}</Text>
          )}
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
      </Pressable>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
            <AntDesign 
              name={post.liked ? 'heart' : 'hearto'} 
              size={22} 
              color={post.liked ? '#e74c3c' : themeColors.textSecondary} 
            />
            <Text style={[styles.actionText, { color: post.liked ? '#e74c3c' : themeColors.textSecondary }]}> 
              {formatNumber(post.likes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatNumber(post.comments)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatNumber(post.shares)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => onSave(post.id)}
            onLongPress={() => handleBookmarkLongPress(post.id)}
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

const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
  const router = useRouter();
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background }] }>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
          <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Neoping </Text>
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
  );
};

const index = () => {
  const { posts, setPosts } = usePosts();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'u/RedditUser1',
      avatar: 'commenter1.jpg',
      text: 'This is amazing! Love the content.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 12,
      liked: false
    },
    {
      id: 2,
      username: 'u/SportsFan',
      avatar: 'commenter2.jpg',
      text: 'Great post! Thanks for sharing this.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      likes: 8,
      liked: false
    },
    {
      id: 3,
      username: 'u/CommunityMember',
      avatar: 'commenter3.jpg',
      text: 'I totally agree with this. Well said!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      likes: 5,
      liked: false
    }
  ]);
  const router = useRouter();
  const pathname = usePathname();
  const { themeColors } = useTheme();
  const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedMorePost, setSelectedMorePost] = useState(null);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [collectionModalPost, setCollectionModalPost] = useState(null);

  // Force re-render every minute to update timestamps
  const [, setTimeUpdate] = useState(0);
  // Removed useEffect with window.addEventListener and window.removeEventListener as it is not supported in React Native.

  // Filter and sort posts for Home feed
  const filteredPosts = posts
    .filter(post => {
      const q = (searchText || '').toLowerCase();
      return (
        (post.title || '').toLowerCase().includes(q) ||
        (post.content || '').toLowerCase().includes(q) ||
        (post.user || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
          return { ...post, disliked: true, liked: false, likes: post.likes - 1 };
        }
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
      avatar: 'Penguin.jpg',
      text: text,
      timestamp: new Date(),
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

  const handleShare = async (id) => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const shareContent = {
        title: post.title,
        message: `${post.title}\n\nCheck out this post on Neoping!`,
        url: `https://neoping.app/post/${id}`, // In a real app, this would be the actual post URL
      };

      // Platform-specific share options
      const shareOptions = Platform.OS === 'ios' ? {
        excludedActivityTypes: ['com.apple.UIKit.activity.Print', 'com.apple.UIKit.activity.AssignToContact'],
      } : {
        dialogTitle: 'Share this post',
      };

      const result = await Share.share(shareContent, shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with specific app
          console.log(`Shared with: ${result.activityType}`);
        } else {
          // Shared, but no specific activity type
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share post');
    }
  };

  const handleImagePress = (imageName) => {
    setSelectedImage(imageMap[imageName] || { uri: imageName });
    setImageModalVisible(true);
  };

  const handleShowUrlInput = () => setShowUrlInput(true);
  const handleRemoveUrlInput = () => {
    setShowUrlInput(false);
    setUrl('');
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(posts => posts.map(post => ({ ...post, liked: false, disliked: false, saved: false, awarded: false })));
      setRefreshing(false);
    }, 1200);
  };

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

  const handleSave = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      toggleBookmark({
        id: post.id,
        title: post.title,
        image: post.image,
        user: post.user,
      }, DEFAULT_COLLECTION);
    }
  };

  const handleAward = (id) => {
    setPosts(posts => posts.map(post => post.id === id ? { ...post, awarded: !post.awarded } : post));
  };

  const handleMorePress = (post) => {
    setSelectedMorePost(post);
    setMoreMenuVisible(true);
  };

  const handleBookmarkLongPress = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setCollectionModalPost(post);
      setCollectionModalVisible(true);
    }
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }] }>
        <ActivityIndicator size="large" color="#2E45A3" />
      </View>
    );
  }

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
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => setProfileModalVisible(true)} onSearchPress={handleSearchIcon} />
      )}
      <PopupMenu visible={menuOpen} router={router} />
      <ProfileModal 
        visible={profileModalVisible} 
        onClose={() => setProfileModalVisible(false)} 
        onLogout={() => { setProfileModalVisible(false); router.replace('/'); }} 
        bookmarks={bookmarks}
        onUnbookmark={toggleBookmark}
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

      {pathname === '/watch' ? (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 40, paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, marginLeft: 6 }}>There is no content to display</Text>
          <Text style={{ fontWeight: '500', fontSize: 16, marginLeft: 6 }}>We were unable to find any content for this page</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Post
              post={{...item, saved: isBookmarked(item.id)}}
              onLike={handleLike}
              onDislike={handleDislike}
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
  postBody: {
    fontSize: 15,
    lineHeight: 22,
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
    paddingTop: 12,
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
  separator: {
    height: 8,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    paddingTop: Platform.OS === 'ios' ? 64 : 36,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
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
  // Comment Modal Styles
  commentModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentModal: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: '0px -2px 8px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
      },
    }),
  },
  commentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  commentModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postPreview: {
    padding: 16,
    borderBottomWidth: 1,
  },
  postPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  postPreviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  postPreviewUser: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  postPreviewTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
  },
  commentInfo: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    marginTop: 2,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  replyText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 12,
  },
  commentSubmit: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  commentSubmitText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default index;