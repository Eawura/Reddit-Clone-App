import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBookmarks } from '../../components/BookmarkContext';
import CommentModal from '../../components/CommentModal';
import ImageModal from '../../components/ImageModal';
import MoreMenu from '../../components/MoreMenu';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';
import { getRandomRecentTimestamp, getRelativeTime } from '../../utils/timeUtils';

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

const Header = ({ menuOpen, setMenuOpen, onProfilePress, onSearchPress }) => {
    const router = useRouter();
    const { themeColors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: themeColors.background }] }>
            <View style={styles.headerLeft}>
                {/* Remove menu icon */}
                {/* <TouchableOpacity>
                    <Feather name="menu" size={28} color={themeColors.icon} />
                </TouchableOpacity> */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                    <Text style={[styles.logoText, { color: '#2E45A3' } ]}>Latest</Text>
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
    )
};

const SortButton = ({ title, active, onPress }) => (
    <TouchableOpacity 
        style={[styles.sortButton, active && styles.activeSortButton]} 
        onPress={onPress}
    >
        <Text style={[styles.sortText, active && styles.activeSortText]}>{title}</Text>
    </TouchableOpacity>
);

const Post = ({ post, onLike, onDislike, onComment, onImagePress, onSave, onAward, onShare, themeColors, onMore, isBookmarked }) => (
    <View style={[styles.postContainer, { backgroundColor: themeColors.card }]}>
      {/* Post Header */}
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

      {/* Post Content */}
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
              {post.likes}
            </Text>
          </TouchableOpacity>
          
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
          
          <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
            <Feather name="message-circle" size={20} color={themeColors.textSecondary} />
            <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
            <Feather name="share-2" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAward(post.id)}>
            <MaterialIcons name={post.awarded ? 'emoji-events' : 'emoji-events'} size={22} color={post.awarded ? '#FFD700' : themeColors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={() => onSave(post.id)}>
            <Feather name={isBookmarked(post.id) ? 'bookmark' : 'bookmark'} size={20} color={isBookmarked(post.id) ? '#2E45A3' : themeColors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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

    const sortOptions = ['New', 'Hot', 'Top', 'Rising'];

    const latestData = [
        {
            id: '1',
            title: 'Just finished building my first React Native app! Here\'s what I learned',
            content: 'After 3 months of learning and building, I finally completed my first mobile app. The journey was incredible and I wanted to share some key insights...',
            subreddit: 'reactnative',
            author: 'dev_newbie',
            time: '5m',
            upvotes: 23,
            comments: 8,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400'
        },
        {
            id: '2',
            title: 'My cat just discovered the laser pointer for the first time',
            content: 'The pure joy and confusion on his face was priceless. I think I\'ve created a monster though - he won\'t stop looking for the red dot everywhere!',
            subreddit: 'aww',
            author: 'catlover42',
            time: '12m',
            upvotes: 156,
            comments: 23,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
        },
        {
            id: '3',
            title: 'Found this amazing coffee shop in downtown. Best latte I\'ve ever had!',
            content: 'Hidden gem alert! This place has the most incredible coffee and the atmosphere is perfect for working. Highly recommend checking it out.',
            subreddit: 'coffee',
            author: 'coffee_enthusiast',
            time: '18m',
            upvotes: 89,
            comments: 15,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
        },
        {
            id: '4',
            title: 'Just got my dream job offer! After 6 months of job hunting',
            content: 'I can\'t believe it finally happened! The interview process was intense but totally worth it. For anyone struggling with job search - keep going!',
            subreddit: 'jobs',
            author: 'jobseeker2024',
            time: '25m',
            upvotes: 234,
            comments: 67,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400'
        },
        {
            id: '5',
            title: 'My homemade pizza turned out perfect tonight',
            content: 'Been practicing my pizza-making skills for months. Tonight everything came together - perfect crust, sauce, and toppings. So satisfying!',
            subreddit: 'food',
            author: 'pizzamaster',
            time: '32m',
            upvotes: 445,
            comments: 89,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
        },
        {
            id: '6',
            title: 'Just finished reading "The Midnight Library" - absolutely mind-blowing',
            content: 'This book completely changed my perspective on life choices and regrets. Has anyone else read it? I need to discuss the ending!',
            subreddit: 'books',
            author: 'bookworm_reader',
            time: '41m',
            upvotes: 78,
            comments: 34,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'
        },
        {
            id: '7',
            title: 'My plant collection is finally complete! Here\'s my indoor jungle',
            content: 'After months of collecting and caring for these beauties, I think I\'ve reached the perfect balance. Each one has its own personality!',
            subreddit: 'houseplants',
            author: 'plant_parent',
            time: '48m',
            upvotes: 567,
            comments: 123,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400'
        },
        {
            id: '8',
            title: 'Just completed my first 10K run! Never thought I could do it',
            content: 'Started running 6 months ago and today I finally hit this milestone. The feeling of accomplishment is incredible. Next goal: half marathon!',
            subreddit: 'running',
            author: 'runner_in_progress',
            time: '55m',
            upvotes: 189,
            comments: 45,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400'
        }
    ];

    const [posts, setPosts] = useState(
      latestData.map(p => ({
        ...p,
        liked: false,
        disliked: false,
        awarded: false,
        timestamp: getRandomRecentTimestamp(),
      }))
    );

    const handleUpvote = (id) => {
        setPosts(posts => posts.map(post => {
            if (post.id === id) {
                return { 
                    ...post, 
                    upvoted: !post.upvoted, 
                    upvotes: post.upvoted ? post.upvotes - 1 : post.upvotes + 1,
                    downvoted: false 
                };
            }
            return post;
        }));
    };

    const handleDownvote = (id) => {
        setPosts(posts => posts.map(post => {
            if (post.id === id) {
                if (post.downvoted) {
                    return { ...post, downvoted: false };
                } else {
                    return { 
                        ...post, 
                        downvoted: true, 
                        upvoted: false,
                        upvotes: post.upvotes - 1
                    };
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

    // Filter posts by search text
    const filteredPosts = searchText.trim() === '' ? posts : posts.filter(post => {
      const q = searchText.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        (post.content && post.content.toLowerCase().includes(q))
      );
    });

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
        toggleBookmark({
          id: post.id,
          title: post.title,
          image: post.image,
          user: post.user,
        });
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
            
            <View style={styles.sortContainer}>
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
                        post={{...item, saved: isBookmarked(item.id, DEFAULT_COLLECTION)}}
                        onLike={handleUpvote} 
                        onDislike={handleDownvote}
                        onComment={handleComment}
                        onImagePress={handleImagePress}
                        onSave={handleSave}
                        onAward={handleAward}
                        onShare={handleShare}
                        onMore={handleMorePress}
                        themeColors={themeColors}
                        isBookmarked={isBookmarked}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.postsList}
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
        backgroundColor: '#f7f7f7',
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
    sortContainer: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    sortList: {
        paddingHorizontal: 16,
    },
    sortButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f7f9fa',
    },
    activeSortButton: {
        backgroundColor: '#2E45A3',
    },
    sortText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#657786',
    },
    activeSortText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    postsList: {
        padding: 8,
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
    separator: {
        height: 8,
        backgroundColor: 'transparent',
    },
});

export default Latest; 