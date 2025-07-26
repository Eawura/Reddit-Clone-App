import { useCallback, useEffect, useState } from "react";
import { authAPI, pingAPI, postsAPI, userAPI } from "../app/utils/api";

// =============================================
// AUTH HOOKS
// =============================================

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Updated to use username instead of email
  const login = useCallback(async (username, password) => {
    setLoading(true);
    const result = await authAPI.login(username, password); // Using username now

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }

    setLoading(false);
    return result;
  }, []);

  const signup = useCallback(async (userData) => {
    setLoading(true);
    const result = await authAPI.signup(userData);

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }

    setLoading(false);
    return result;
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    const result = await authAPI.logout();

    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
    return result;
  }, []);

  const getCurrentUser = useCallback(async () => {
    setLoading(true);
    const result = await authAPI.getCurrentUser();

    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
    return result;
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authAPI.isAuthenticated();
      if (isAuth) {
        await getCurrentUser();
      } else {
        setLoading(false);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [getCurrentUser]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    getCurrentUser,
  };
};

// =============================================
// POSTS HOOKS
// =============================================

export const usePosts = (category = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (!reset && !hasMore) return;

      setLoading(true);
      setError(null);

      const offset = reset ? 0 : posts.length;
      const result = await postsAPI.getPosts(20, offset, category);

      if (result.success) {
        if (reset) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }
        setHasMore(result.posts.length === 20);
      } else {
        setError(result.error);
      }

      setLoading(false);
    },
    [posts.length, hasMore, category]
  );

  const refreshPosts = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  const createPost = useCallback(async (postData) => {
    const result = await postsAPI.createPost(postData);

    if (result.success) {
      setPosts((prev) => [result.post, ...prev]);
    }

    return result;
  }, []);

  const toggleLike = useCallback(async (postId) => {
    const result = await postsAPI.toggleLike(postId);

    if (result.success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked: result.liked, likesCount: result.likesCount }
            : post
        )
      );
    }

    return result;
  }, []);

  useEffect(() => {
    fetchPosts(true);
  }, [category]);

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchPosts,
    refreshPosts,
    createPost,
    toggleLike,
  };
};

// =============================================
// PINGS HOOKS
// =============================================

export const usePings = () => {
  const [receivedPings, setReceivedPings] = useState([]);
  const [sentPings, setSentPings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReceivedPings = useCallback(async () => {
    setLoading(true);
    const result = await pingAPI.getReceivedPings();

    if (result.success) {
      setReceivedPings(result.pings);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, []);

  const fetchSentPings = useCallback(async () => {
    setLoading(true);
    const result = await pingAPI.getSentPings();

    if (result.success) {
      setSentPings(result.pings);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, []);

  const sendPing = useCallback(async (recipientIds, message, location) => {
    const result = await pingAPI.sendPing(recipientIds, message, location);

    if (result.success) {
      setSentPings((prev) => [result.ping, ...prev]);
    }

    return result;
  }, []);

  const markAsRead = useCallback(async (pingId) => {
    const result = await pingAPI.markPingAsRead(pingId);

    if (result.success) {
      setReceivedPings((prev) =>
        prev.map((ping) =>
          ping.id === pingId ? { ...ping, read: true } : ping
        )
      );
    }

    return result;
  }, []);

  useEffect(() => {
    fetchReceivedPings();
    fetchSentPings();
  }, []);

  return {
    receivedPings,
    sentPings,
    loading,
    error,
    sendPing,
    markAsRead,
    refreshPings: () => {
      fetchReceivedPings();
      fetchSentPings();
    },
  };
};

// =============================================
// USERS HOOKS
// =============================================

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await userAPI.searchUsers(query);

    if (result.success) {
      setUsers(result.users);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (userData) => {
    const result = await userAPI.updateProfile(userData);
    return result;
  }, []);

  return {
    users,
    loading,
    error,
    searchUsers,
    updateProfile,
  };
};
