// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { api, authAPI } from "../utils/api";
import storage from "../utils/storage";

const AuthContext = createContext();

// Export useAuth hook at the top for better organization
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check for existing session on app load (KEEP THIS ONE)
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        setLoading(true);
        console.log("[AUTH] 🔍 Loading user from storage...");

        const token = await storage.getItem("auth_token");
        const userJson = await storage.getItem("user");

        if (token && userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsAuthenticated(true);

          // Set the default Authorization header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          console.log("[AUTH] ✅ User loaded from storage:", userData.username);
        } else {
          console.log("[AUTH] ❌ No valid session found in storage");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("[AUTH] ❌ Failed to load user from storage:", error);
        // Clear invalid data
        await storage.removeItem("auth_token");
        await storage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log("[AUTH] 🏁 Auth initialization complete");
      }
    };

    loadUserFromStorage();
  }, []); // Empty dependency array - only run once

  // Login function
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      console.log("[AUTH] 🔐 Attempting login...");
      const result = await authAPI.login(emailOrUsername, password);

      if (result.success && result.data) {
        // Store the token and user data
        await storage.setItem("auth_token", result.data.token);
        if (result.data.refreshToken) {
          await storage.setItem("refresh_token", result.data.refreshToken);
        }

        // Set the user data in state
        const userData = {
          id: result.data.userId || result.data.id,
          username: result.data.username,
          email: result.data.email,
          ...result.data.user,
        };

        setUser(userData);
        setIsAuthenticated(true);

        // Also store user data in storage for persistence
        await storage.setItem("user", JSON.stringify(userData));

        // Set the default Authorization header for future requests
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${result.data.token}`;

        console.log("[AUTH] ✅ Login successful:", userData.username);
      }

      setLoading(false);
      return result;
    } catch (error) {
      console.error("[AUTH] ❌ Login error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      console.log("[AUTH] 🚪 Logging out...");

      // Clear storage
      await storage.removeItem("auth_token");
      await storage.removeItem("refresh_token");
      await storage.removeItem("user");

      // Clear state
      setUser(null);
      setIsAuthenticated(false);

      // Clear auth header
      delete api.defaults.headers.common["Authorization"];

      console.log("[AUTH] ✅ Logout successful");
      setLoading(false);

      return { success: true };
    } catch (error) {
      console.error("[AUTH] ❌ Logout error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Logout failed",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      console.log("[AUTH] 📝 Attempting registration...");
      const result = await authAPI.signup(userData);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        console.log("[AUTH] ✅ Registration successful");
      }

      setLoading(false);
      return result;
    } catch (error) {
      console.error("[AUTH] ❌ Registration error:", error);
      setLoading(false);
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    }
  };

  // Manual auth check (only when needed)
  const checkAuth = async () => {
    try {
      console.log("[AUTH] 🔍 Manual auth check...");
      const result = await authAPI.isAuthenticated();

      if (result.success && result.authenticated) {
        setUser(result.user);
        setIsAuthenticated(true);
        console.log("[AUTH] ✅ Auth check passed");
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("[AUTH] ❌ Auth check failed");
      }

      return result;
    } catch (error) {
      console.error("[AUTH] ❌ Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    initialized,
    login,
    register,
    logout,
    checkAuth, // Manual auth check only
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialized ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 12,
    color: "#333",
  },
});

// Default export for convenience
export default AuthContext;
