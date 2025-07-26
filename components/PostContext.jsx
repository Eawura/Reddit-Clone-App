import React, { createContext, useContext, useState, useCallback } from 'react';
import data from '../app/(tabs)/data.json';
import { Alert } from 'react-native';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load posts from data source
  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loadedPosts = data.posts.map((p, i) => {
        let ts = p.timestamp ? new Date(p.timestamp) : new Date();
        if (isNaN(ts.getTime())) {
          ts = new Date(Date.now() - i * 10 * 60 * 1000);
        }
        return {
          ...p,
          timestamp: ts,
          liked: false,
          disliked: false,
          awarded: false,
        };
      });
      
      setPosts(loadedPosts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Failed to load posts. Please try again later.');
      Alert.alert('Error', 'Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts();
  }, [loadPosts]);

  // Add a new post
  const addPost = useCallback((post) => {
    try {
      const newPost = {
        ...post,
        id: Date.now().toString(),
        timestamp: post.timestamp ? new Date(post.timestamp) : new Date(),
        liked: false,
        disliked: false,
        awarded: false,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      
      setPosts(prev => [newPost, ...prev]);
      return { success: true };
    } catch (err) {
      console.error('Failed to add post:', err);
      Alert.alert('Error', 'Failed to add post. Please try again.');
      return { success: false, error: err.message };
    }
  }, []);

  // Initialize posts on first render
  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <PostContext.Provider value={{ 
      posts, 
      setPosts, 
      addPost, 
      isLoading, 
      error, 
      refreshing,
      onRefresh: handleRefresh,
      retry: loadPosts
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
}