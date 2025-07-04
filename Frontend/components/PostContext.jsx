import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchPosts } from '../utils/posts';
import { getAuthToken } from '../utils/auth';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from backend
  const refreshPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      const data = await fetchPosts(token);
      // Optionally massage data here if needed
      setPosts(
        data.map((p, i) => ({
          ...p,
          timestamp: p.timestamp ? new Date(p.timestamp) : new Date(),
          liked: false,
          disliked: false,
          awarded: false,
        }))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // Add a new post locally (optional, for optimistic update)
  const addPost = (post) => {
    setPosts(prev => [
      {
        ...post,
        id: Date.now().toString(),
        timestamp: post.timestamp ? new Date(post.timestamp) : new Date(),
        liked: false,
        disliked: false,
        awarded: false,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      ...prev,
    ]);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, refreshPosts, loading, error }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}