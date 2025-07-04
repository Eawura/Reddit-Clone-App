import React, { createContext, useCallback, useContext, useState } from 'react';

const BookmarkContext = createContext();

const DEFAULT_COLLECTION = 'All';

export function BookmarkProvider({ children }) {
  // Bookmarks: { collectionName: [post, ...] }
  const [collections, setCollections] = useState({ [DEFAULT_COLLECTION]: [] });

  // Add post to a collection (default: 'All')
  const addBookmark = useCallback((post, collection = DEFAULT_COLLECTION) => {
    setCollections(prev => {
      const exists = prev[collection]?.some(p => p.id === post.id);
      if (exists) return prev;
      return {
        ...prev,
        [collection]: [post, ...(prev[collection] || [])],
      };
    });
  }, []);

  // Remove post from a collection (default: 'All')
  const removeBookmark = useCallback((postId, collection = DEFAULT_COLLECTION) => {
    setCollections(prev => ({
      ...prev,
      [collection]: (prev[collection] || []).filter(p => p.id !== postId),
    }));
  }, []);

  // Toggle bookmark in a collection (default: 'All')
  const toggleBookmark = useCallback((post, collection = DEFAULT_COLLECTION) => {
    setCollections(prev => {
      const exists = prev[collection]?.some(p => p.id === post.id);
      if (exists) {
        return {
          ...prev,
          [collection]: prev[collection].filter(p => p.id !== post.id),
        };
      } else {
        return {
          ...prev,
          [collection]: [post, ...(prev[collection] || [])],
        };
      }
    });
  }, []);

  // Check if a post is bookmarked in any or a specific collection
  const isBookmarked = useCallback((postId, collection) => {
    if (collection) {
      return (collections[collection] || []).some(p => p.id === postId);
    }
    // Check all collections
    return Object.values(collections).some(posts => posts.some(p => p.id === postId));
  }, [collections]);

  // Create a new collection
  const createCollection = useCallback((name) => {
    setCollections(prev => {
      if (prev[name]) return prev; // already exists
      return { ...prev, [name]: [] };
    });
  }, []);

  // Delete a collection (except 'All')
  const deleteCollection = useCallback((name) => {
    if (name === DEFAULT_COLLECTION) return;
    setCollections(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Rename a collection (except 'All')
  const renameCollection = useCallback((oldName, newName) => {
    if (oldName === DEFAULT_COLLECTION || newName === DEFAULT_COLLECTION) return;
    setCollections(prev => {
      if (!prev[oldName] || prev[newName]) return prev;
      const { [oldName]: posts, ...rest } = prev;
      return { ...rest, [newName]: posts };
    });
  }, []);

  // Move a post from one collection to another
  const moveBookmark = useCallback((postId, fromCollection, toCollection) => {
    setCollections(prev => {
      const post = (prev[fromCollection] || []).find(p => p.id === postId);
      if (!post) return prev;
      // Remove from old, add to new
      return {
        ...prev,
        [fromCollection]: prev[fromCollection].filter(p => p.id !== postId),
        [toCollection]: [post, ...(prev[toCollection] || [])],
      };
    });
  }, []);

  return (
    <BookmarkContext.Provider value={{
      collections,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      isBookmarked,
      createCollection,
      deleteCollection,
      renameCollection,
      moveBookmark,
      DEFAULT_COLLECTION,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
} 