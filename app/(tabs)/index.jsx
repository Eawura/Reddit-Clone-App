import { AntDesign, Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Modal, Platform, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

// Comment Component
const Comment = ({ comment, onLike, onReply, themeColors }) => (
  <View style={[styles.commentContainer, { borderBottomColor: themeColors.border }]}>
    <View style={styles.commentHeader}>
      <Image source={imageMap[comment.avatar] ? imageMap[comment.avatar] : { uri: comment.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentInfo}>
        <Text style={[styles.commentUsername, { color: themeColors.text }]}>{comment.username}</Text>
        <Text style={[styles.commentTime, { color: themeColors.textSecondary }]}>{comment.time}</Text>
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

// Comment Modal Component
const CommentModal = ({ visible, onClose, post, comments, onAddComment, onLikeComment, onReplyComment, themeColors }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, replyingTo);
      setNewComment('');
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
                <Image source={imageMap[post.avatar] ? imageMap[post.avatar] : { uri: post.avatar }} style={styles.postPreviewAvatar} />
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
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.commentSubmit, { backgroundColor: newComment.trim() ? '#FF4500' : themeColors.border }]}
                onPress={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <Text style={[styles.commentSubmitText, { color: newComment.trim() ? '#fff' : themeColors.textSecondary }]}>
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

const Post = ({ post, onLike, onDislike, onComment, onShare, themeColors }) => (
  <View style={[styles.postContainer, { backgroundColor: themeColors.card }] }>
    <View style={styles.postHeader}>
      <Image source={imageMap[post.avatar] ? imageMap[post.avatar] : { uri: post.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.postUser, { color: themeColors.text }]}>{post.user} <Text style={styles.postTime}>• {post.time}</Text></Text>
        <Text style={[styles.postTitle, { color: themeColors.text }]}>{post.title}</Text>
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
  const [posts, setPosts] = useState(data.posts.map(p => ({ ...p, liked: false, disliked: false })));
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
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'u/RedditUser1',
      avatar: 'curry.jpg',
      text: 'This is amazing! Love the content.',
      time: '2h ago',
      likes: 12,
      liked: false
    },
    {
      id: 2,
      username: 'u/SportsFan',
      avatar: 'Messi.jpg',
      text: 'Great post! Thanks for sharing this.',
      time: '1h ago',
      likes: 8,
      liked: false
    },
    {
      id: 3,
      username: 'u/CommunityMember',
      avatar: 'harry logo.webp',
      text: 'I totally agree with this. Well said!',
      time: '30m ago',
      likes: 5,
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

  const handleSearchIcon = () => setSearchOpen(true);
  const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

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
      <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); router.replace('/'); }} />
      
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

      {pathname === '/watch' ? (
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 40, paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8, marginLeft: 6 }}>There is no content to display</Text>
          <Text style={{ fontWeight: '500', fontSize: 16, marginLeft: 6 }}>We were unable to find any content for this page</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Post post={item} onLike={handleLike} onDislike={handleDislike} onComment={handleComment} onShare={handleShare} themeColors={themeColors} />}
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
  // Comment Modal Styles
  commentModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  commentModal: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
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