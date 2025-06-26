import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PopupMenu from '../../components/PopupMenu';
import ProfileModal from '../../components/ProfileModal';
import { useTheme } from '../../components/ThemeContext';

const Header = ({ menuOpen, setMenuOpen, onProfilePress }) => {
    const router = useRouter();
    const { themeColors } = useTheme();
    return (
        <View style={[styles.header, { backgroundColor: themeColors.background }] }>
            <View style={styles.headerLeft}>
            <TouchableOpacity>
                <Feather name="menu" size={28} color={themeColors.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setMenuOpen(open => !open)}>
                <Text style={[styles.logoText, { color: '#2E45A3' } ]}>News</Text>
                <Ionicons name={menuOpen ? "chevron-up" : "chevron-down"} size={18} color={themeColors.icon} />
            </TouchableOpacity>
            </View>
            <View style={styles.headerIcons}>
            <TouchableOpacity style={{marginRight: 16}}>
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

const NewsCard = ({ news, onUpvote, onDownvote }) => (
    <View style={styles.newsCard}>
        <View style={styles.newsHeader}>
            <View style={styles.newsMeta}>
                <Text style={styles.newsSource}>{news.source}</Text>
                <Text style={styles.newsTime}>• {news.time}</Text>
                <Text style={styles.newsCategory}>• {news.category}</Text>
            </View>
            <TouchableOpacity>
                <Feather name="more-horizontal" size={20} color="#888" />
            </TouchableOpacity>
        </View>
        
        <Text style={styles.newsTitle}>{news.title}</Text>
        {news.image && (
            <Image source={{ uri: news.image }} style={styles.newsImage} />
        )}
        <Text style={styles.newsExcerpt}>{news.excerpt}</Text>
        
        <View style={styles.newsActions}>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onUpvote(news.id)}>
                    <AntDesign 
                        name={news.upvoted ? 'heart' : 'hearto'} 
                        size={20} 
                        color={news.upvoted ? '#FF4500' : '#888'} 
                    />
                    <Text style={[styles.actionText, news.upvoted && { color: '#FF4500' }]}>
                        {news.upvotes}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onDownvote(news.id)}>
                    <MaterialIcons 
                        name="heart-broken" 
                        size={24} 
                        color={news.downvoted ? '#7193FF' : '#888'} 
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="message-circle" size={20} color="#888" />
                    <Text style={styles.actionText}>{news.comments}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="share-2" size={20} color="#888" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Feather name="bookmark" size={20} color="#888" />
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

    const filteredNews = selectedCategory === 'All' 
        ? news 
        : news.filter(item => item.category === selectedCategory);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} onProfilePress={() => { setLastTabPath(pathname); setProfileModalVisible(true); }} />
            <PopupMenu visible={menuOpen} router={router} />
            <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} onLogout={() => { setProfileModalVisible(false); if (lastTabPath) router.replace(lastTabPath); }} lastTabPath={lastTabPath} />
            
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
                    />
                )}
                ItemSeparatorComponent={() => <View style={{height: 8}} />}
                contentContainerStyle={styles.newsList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DAE0E6',
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
    newsMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    newsSource: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#1a1a1a',
    },
    newsTime: {
        fontSize: 12,
        color: '#657786',
        marginLeft: 4,
    },
    newsCategory: {
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