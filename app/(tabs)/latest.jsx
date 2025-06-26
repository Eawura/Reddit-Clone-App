import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CommentModal from '../../components/CommentModal';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';

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

const LatestPost = ({ post, onUpvote, onDownvote, onComment, themeColors }) => (
    <View style={[styles.postCard, { backgroundColor: themeColors.card }]}>
        <View style={styles.postHeader}>
            <View style={styles.postMeta}>
                <Text style={[styles.subredditText, { color: themeColors.accent || '#FF4500' }]}>r/{post.subreddit}</Text>
                <Text style={[styles.authorText, { color: themeColors.textSecondary }]}>• Posted by u/{post.author}</Text>
                <Text style={[styles.timeText, { color: themeColors.textSecondary }]}>• {post.time}</Text>
            </View>
            <TouchableOpacity>
                <Feather name="more-horizontal" size={20} color={themeColors.icon} />
            </TouchableOpacity>
        </View>
        
        <Text style={[styles.postTitle, { color: themeColors.text }]}>{post.title}</Text>
        <Text style={[styles.postContent, { color: themeColors.textSecondary }]}>{post.content}</Text>
        
        {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} />
        )}
        
        <View style={styles.postActions}>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onUpvote(post.id)}>
                    <AntDesign 
                        name={post.upvoted ? 'arrowup' : 'arrowup'} 
                        size={20} 
                        color={post.upvoted ? '#FF4500' : themeColors.icon} 
                    />
                    <Text style={[styles.actionText, { color: post.upvoted ? '#FF4500' : themeColors.textSecondary }]}>{post.upvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onDownvote(post.id)}>
                    <MaterialIcons 
                        name="heart-broken" 
                        size={24} 
                        color={post.downvoted ? '#7193FF' : themeColors.icon} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onComment(post.id)}>
                    <Feather name="message-circle" size={20} color={themeColors.icon} />
                    <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="share-2" size={20} color={themeColors.icon} />
                    <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>Share</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
                <Feather name="bookmark" size={20} color={themeColors.icon} />
            </TouchableOpacity>
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
    const [comments, setComments] = useState([
      {
        id: 1,
        username: 'u/LatestUser1',
        text: 'This is so fresh! Thanks for sharing this.',
        time: '5m ago',
        likes: 12,
        liked: false
      },
      {
        id: 2,
        username: 'u/NewContentFan',
        text: 'Just saw this too. Great timing!',
        time: '3m ago',
        likes: 8,
        liked: false
      },
      {
        id: 3,
        username: 'u/CommunityMember',
        text: 'This is exactly what I needed to see right now.',
        time: '1m ago',
        likes: 15,
        liked: false
      }
    ]);
    const { themeColors } = useTheme();

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

    const [posts, setPosts] = useState(latestData);

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
                const wasUpvoted = post.upvoted;
                const newUpvotes = wasUpvoted ? post.upvotes - 1 : post.upvotes;
                return { 
                    ...post, 
                    downvoted: !post.downvoted, 
                    upvoted: false,
                    upvotes: newUpvotes
                };
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
                    <LatestPost 
                        post={item} 
                        onUpvote={handleUpvote} 
                        onDownvote={handleDownvote}
                        onComment={handleComment}
                        themeColors={themeColors}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: 12}} />}
                contentContainerStyle={styles.postsList}
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
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerIcons: {
        flexDirection: 'row',
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
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    postMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    subredditText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1a1a1a',
    },
    authorText: {
        fontSize: 12,
        color: '#657786',
        marginLeft: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#657786',
        marginLeft: 4,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
        marginBottom: 8,
        color: '#1a1a1a',
    },
    postContent: {
        fontSize: 14,
        lineHeight: 20,
        color: '#657786',
        marginBottom: 8,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    actionText: {
        marginLeft: 6,
        color: '#657786',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default Latest; 