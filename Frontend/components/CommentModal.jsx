import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const imageMap = {
  'harry logo.webp': require('../assets/images/harry logo.webp'),
  'daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp': require('../assets/images/daniel-radcliffes-acting-v0-zhahfgw6fj5f1.webp'),
  'Logo-NBA.png': require('../assets/images/Logo-NBA.png'),
  'curry.jpg': require('../assets/images/curry.jpg'),
  'fifa logo.jpg': require('../assets/images/fifa logo.jpg'),
  'Messi.jpg': require('../assets/images/Messi.jpg'),
  'Grand.jpeg': require('../assets/images/Grand.jpeg'),
  'Ramen.jpeg': require('../assets/images/Ramen.jpeg'),
  'Penguin.jpg': require('../assets/images/Penguin.jpg'),
  'w1.jpg': require('../assets/images/w1.jpg'),
  'T1.jpg': require('../assets/images/T1.jpg'),
  'yu.jpg': require('../assets/images/yu.jpg'),
  'Ronaldo.jpg': require('../assets/images/Ronaldo.jpg'),
  'SGA.jpg': require('../assets/images/SGA.jpg'),
  "euro's league logo.jpg": require("../assets/images/euro's league logo.jpg"),
};

// Comment Component
const Comment = ({ comment, onLike, onReply, themeColors }) => (
  <View style={[styles.commentContainer, { borderBottomColor: themeColors.border }]}>
    <View style={styles.commentHeader}>
      <View style={styles.commentAvatar}>
        <Text style={[styles.avatarText, { color: themeColors.text }]}>
          {comment.username.charAt(2).toUpperCase()}
        </Text>
      </View>
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
                <AntDesign name="close" size={24} color={themeColors.icon} />
              </TouchableOpacity>
              <Text style={[styles.commentModalTitle, { color: themeColors.text }]}>Comments</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Post Preview */}
            <View style={[styles.postPreview, { borderBottomColor: themeColors.border }]}>
              <View style={styles.postPreviewHeader}>
                <View style={styles.postPreviewAvatar}>
                  <Text style={[styles.avatarText, { color: themeColors.text }]}>
                    {post.user ? post.user.charAt(0).toUpperCase() : 'U'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.postPreviewUser, { color: themeColors.text }]}>{post.user || post.author}</Text>
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
                  <AntDesign name="close" size={20} color={themeColors.icon} />
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

const styles = StyleSheet.create({
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
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
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

export default CommentModal; 