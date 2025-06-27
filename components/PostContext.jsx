import React, { createContext, useContext, useState } from 'react';
import data from '../app/(tabs)/data.json';

const PostContext = createContext();

export function PostProvider({ children }) {
  // Initialize with demo posts
  const [posts, setPosts] = useState(data.posts.map(p => ({ ...p, liked: false, disliked: false, awarded: false })));

  // Add a new post
  const addPost = (post) => {
    setPosts(prev => [
      {
        ...post,
        id: Date.now().toString(),
        timestamp: new Date(),
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
    <PostContext.Provider value={{ posts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
} 