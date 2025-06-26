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
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                    <Text style={[styles.logoText, { color: '#2E45A3' } ]}>News</Text>
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

const CategoryButton = ({ title, active, onPress }) => (
    <TouchableOpacity 
        style={[styles.categoryButton, active && styles.activeCategoryButton]} 
        onPress={onPress}
    >
        <Text style={[styles.categoryText, active && styles.activeCategoryText]}>{title}</Text>
    </TouchableOpacity>
);

const NewsCard = ({ news, onUpvote, onDownvote, onComment, themeColors }) => (
    <View style={[styles.newsCard, { backgroundColor: themeColors.card }]}>
        <View style={styles.newsHeader}>
            <View style={styles.newsSource}>
                <Text style={[styles.sourceText, { color: themeColors.textSecondary }]}>{news.source}</Text>
                <Text style={[styles.timeText, { color: themeColors.textSecondary }]}>• {news.time}</Text>
            </View>
            <TouchableOpacity>
                <Feather name="more-horizontal" size={20} color={themeColors.icon} />
            </TouchableOpacity>
        </View>
        
        <Text style={[styles.newsTitle, { color: themeColors.text }]}>{news.title}</Text>
        <Text style={[styles.newsExcerpt, { color: themeColors.textSecondary }]}>{news.excerpt}</Text>
        
        {news.image && (
            <Image source={{ uri: news.image }} style={styles.newsImage} />
        )}
        
        <View style={styles.newsActions}>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onUpvote(news.id)}>
                    <AntDesign 
                        name={news.upvoted ? 'arrowup' : 'arrowup'} 
                        size={20} 
                        color={news.upvoted ? '#FF4500' : themeColors.icon} 
                    />
                    <Text style={[styles.actionText, { color: news.upvoted ? '#FF4500' : themeColors.textSecondary }]}>{news.upvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onDownvote(news.id)}>
                    <MaterialIcons 
                        name="heart-broken" 
                        size={24} 
                        color={news.downvoted ? '#7193FF' : themeColors.icon} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onComment(news.id)}>
                    <Feather name="message-circle" size={20} color={themeColors.icon} />
                    <Text style={[styles.actionText, { color: themeColors.textSecondary }]}>{news.comments}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="share-2" size={20} color={themeColors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="bookmark" size={20} color={themeColors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const News = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const router = useRouter();
    const pathname = usePathname();
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [lastTabPath, setLastTabPath] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [comments, setComments] = useState([
      {
        id: 1,
        username: 'u/NewsReader1',
        text: 'This is a significant development. Thanks for sharing!',
        time: '1h ago',
        likes: 18,
        liked: false
      },
      {
        id: 2,
        username: 'u/InformedUser',
        text: 'I\'ve been following this story. Great coverage.',
        time: '45m ago',
        likes: 12,
        liked: false
      },
      {
        id: 3,
        username: 'u/CurrentEvents',
        text: 'This will have major implications for the industry.',
        time: '30m ago',
        likes: 9,
        liked: false
      }
    ]);
    const { themeColors } = useTheme();

    const categories = ['All', 'Technology', 'Politics', 'Sports', 'Entertainment', 'Science', 'Business'];

    const newsData = [
        {
            id: '1',
            title: 'Major Tech Breakthrough: AI Achieves Human-Level Understanding',
            excerpt: 'Researchers have developed a new artificial intelligence system that demonstrates unprecedented levels of comprehension and reasoning capabilities...',
            source: 'TechCrunch',
            time: '2h',
            category: 'Technology',
            upvotes: 1247,
            comments: 89,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'
        },
        {
            id: '2',
            title: 'Global Climate Summit Reaches Historic Agreement',
            excerpt: 'World leaders have agreed on ambitious new targets to combat climate change, marking a significant step forward in international cooperation...',
            source: 'Reuters',
            time: '4h',
            category: 'Politics',
            upvotes: 892,
            comments: 156,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
        },
        {
            id: '3',
            title: 'Championship Finals Set for Record-Breaking Viewership',
            excerpt: 'This year\'s championship series is expected to draw the largest audience in sports history, with unprecedented global interest...',
            source: 'ESPN',
            time: '6h',
            category: 'Sports',
            upvotes: 567,
            comments: 234,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
        },
        {
            id: '4',
            title: 'New Study Reveals Benefits of Plant-Based Diets',
            excerpt: 'Comprehensive research shows significant health and environmental benefits associated with plant-based eating patterns...',
            source: 'Nature',
            time: '8h',
            category: 'Science',
            upvotes: 445,
            comments: 78,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'
        },
        {
            id: '5',
            title: 'Stock Market Reaches New All-Time High',
            excerpt: 'Major indices have surged to record levels, driven by strong corporate earnings and optimistic economic forecasts...',
            source: 'Bloomberg',
            time: '10h',
            category: 'Business',
            upvotes: 334,
            comments: 45,
            upvoted: false,
            downvoted: false,
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
        }
    ];

    const [news, setNews] = useState(newsData);

    const handleUpvote = (id) => {
        setNews(news => news.map(item => {
            if (item.id === id) {
                return { 
                    ...item, 
                    upvoted: !item.upvoted, 
                    upvotes: item.upvoted ? item.upvotes - 1 : item.upvotes + 1,
                    downvoted: false 
                };
            }
            return item;
        }));
    };

    const handleDownvote = (id) => {
        setNews(news => news.map(item => {
            if (item.id === id) {
                const wasUpvoted = item.upvoted;
                const newUpvotes = wasUpvoted ? item.upvotes - 1 : item.upvotes;
                return { 
                    ...item, 
                    downvoted: !item.downvoted, 
                    upvoted: false,
                    upvotes: newUpvotes
                };
            }
            return item;
        }));
    };

    const handleComment = (id) => {
      const newsItem = news.find(n => n.id === id);
      setSelectedNews(newsItem);
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
      
      // Update news comment count
      setNews(news => news.map(item => {
        if (item.id === selectedNews.id) {
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

    const filteredNews = searchText.trim() === '' ? news : news.filter(item => {
        const q = searchText.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            item.source.toLowerCase().includes(q) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(q))
        );
    });

    const handleSearchIcon = () => setSearchOpen(true);
    const handleCancelSearch = () => { setSearchOpen(false); setSearchText(''); };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }] }>
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
                        <Text style={{ color: themeColors.accent || '#2E45A3', fontSize: 16 }}>Cancel</Text>
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
            
            <View style={styles.categoriesContainer}>
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
                        news={item} 
                        onUpvote={handleUpvote} 
                        onDownvote={handleDownvote}
                        onComment={handleComment}
                        themeColors={themeColors}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: 12}} />}
                contentContainerStyle={styles.newsList}
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
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed',
    },
    categoriesList: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#f7f9fa',
    },
    activeCategoryButton: {
        backgroundColor: '#2E45A3',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#657786',
    },
    activeCategoryText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    newsList: {
        padding: 8,
    },
    newsCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
    },
    newsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    newsSource: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    sourceText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1a1a1a',
    },
    timeText: {
        fontSize: 12,
        color: '#657786',
        marginLeft: 4,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 22,
        marginBottom: 8,
        color: '#1a1a1a',
    },
    newsImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    newsExcerpt: {
        fontSize: 14,
        lineHeight: 20,
        color: '#657786',
        marginBottom: 12,
    },
    newsActions: {
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

export default News; 