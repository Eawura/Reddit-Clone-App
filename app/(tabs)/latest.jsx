import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import { usePosts } from '../../components/PostContext';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { getRelativeTime } from '../../utils/timeUtils';

// Image mapping for profile pictures and post images
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
  "euro's league logo.jpg": require("../../assets/images/euro's league logo.jpg"),
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

const formatCount = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num;
};

const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
  const { themeColors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
          <Text style={[styles.logoText, { color: themeColors.accent } ]}>Latest</Text>
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

const SortButton = ({ title, active, onPress }) => {
  const { themeColors } = useTheme();
  return (
    <TouchableOpacity 
      style={[
        styles.sortButton, 
        { backgroundColor: themeColors.card, borderColor: themeColors.border },
        active && { backgroundColor: themeColors.accent }
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.sortText, 
        { color: themeColors.textSecondary },
        active && { color: themeColors.background }
      ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const Post = ({ post, onUpvote, onDownvote, onComment, onImagePress, onSave, onShare, themeColors, onMore, isBookmarked, DEFAULT_COLLECTION, onProfilePress }) => {
  return (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }] }>
      {/* Post Header */}
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
      {/* Post Content */}
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
      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onUpvote(post.id)}>
            <AntDesign 
              name="arrowup"
              size={22}
              color={post.upvoted ? '#2E45A3' : themeColors.textSecondary}
            />
            <Text style={[styles.actionText, { color: post.upvoted ? '#2E45A3' : themeColors.textSecondary }]}> 
              {formatCount(post.upvotes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDownvote(post.id)}>
            <AntDesign
              name="arrowdown"
              size={22}
              color={post.downvoted ? '#E74C3C' : themeColors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatCount(post.comments)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{formatCount(post.shares)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(post.id)}>
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

const Latest = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('New');
  const router = useRouter();
  const pathname = usePathname();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [lastTabPath, setLastTabPath] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: 'u/LatestUser1',
      avatar: 'commenter10.jpg',
      text: 'This is so fresh! Thanks for sharing this.',
      time: '5m ago',
      likes: 12,
      liked: false
    },
    {
      id: 2,
      username: 'u/NewContentFan',
      avatar: 'commenter1.jpg',
      text: 'Just saw this too. Great timing!',
      time: '3m ago',
      likes: 8,
      liked: false
    },
    {
      id: 3,
      username: 'u/CommunityMember',
      avatar: 'commenter2.jpg',
      text: 'This is exactly what I needed to see right now.',
      time: '1m ago',
      likes: 15,
      liked: false
    }
  ]);
  const { themeColors } = useTheme();
  const { bookmarks, toggleBookmark, isBookmarked, collections, DEFAULT_COLLECTION } = useBookmarks();
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [selectedMorePost, setSelectedMorePost] = useState(null);
  const { posts } = usePosts();

  const sortOptions = ['New', 'Hot', 'Top', 'Rising'];

  // Show posts from the last 7 days
  const now = Date.now();
  let filteredPosts = posts
    .filter(post => now - new Date(post.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000);

  if (selectedSort === 'New') {
    filteredPosts = filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (selectedSort === 'Hot') {
    filteredPosts = filteredPosts.sort((a, b) => (b.comments ?? 0) - (a.comments ?? 0));
  } else if (selectedSort === 'Top') {
    filteredPosts = filteredPosts.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  } else if (selectedSort === 'Rising') {
    filteredPosts = filteredPosts.sort((a, b) => (b.shares ?? 0) - (a.shares ?? 0));
  }

  const handleUpvote = (id) => {
    // ... upvote logic ...
  };
  // ... rest of the logic ...

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
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
          <TouchableOpacity onPress={() => setSearchOpen(false)} style={{ marginLeft: 8 }}>
            <Text style={{ color: themeColors.accent, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* Header */}
      {!searchOpen && (
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} onSearchPress={() => setSearchOpen(true)} />
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
      <View style={[styles.sortContainer, { backgroundColor: themeColors.background, borderColor: themeColors.border }] }>
        <FlatList
          horizontal
          data={sortOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <SortButton
              title={item}
              active={selectedSort === item}
              onPress={() => setSelectedSort(item)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post 
            post={item}
            onUpvote={handleUpvote} 
            onDownvote={handleDownvote}
            onComment={handleComment}
            onImagePress={handleImagePress}
            onSave={handleSave}
            onShare={handleShare}
            themeColors={themeColors}
            onMore={handleMorePress}
            isBookmarked={isBookmarked}
            DEFAULT_COLLECTION={DEFAULT_COLLECTION}
            onProfilePress={handleProfilePress}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#888', fontSize: 16 }}>No posts to show. Pull to refresh!</Text>
          </View>
        )}
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
  sortContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  sortList: {
    paddingHorizontal: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  activeSortButton: {
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeSortText: {
    fontWeight: 'bold',
  },
  postsList: {
    padding: 8,
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
});

export default Latest; 