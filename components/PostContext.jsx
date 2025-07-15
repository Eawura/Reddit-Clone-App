import React, { createContext, useContext, useState } from 'react';
import data from '../app/(tabs)/data.json';

const PostContext = createContext();

export function PostProvider({ children }) {
  // Initialize with demo posts
  const [posts, setPosts] = useState(
    data.posts.map((p, i) => {
      let ts = p.timestamp ? new Date(p.timestamp) : new Date();
      if (isNaN(ts.getTime())) {
        // If invalid, use now minus i*10 minutes
        ts = new Date(Date.now() - i * 10 * 60 * 1000);
      }
      return {
        ...p,
        timestamp: ts,
        liked: false,
        disliked: false,
        awarded: false,
      };
    })
  );

  // Add a new post
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
    <PostContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
} 