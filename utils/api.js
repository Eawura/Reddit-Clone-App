import axios from "axios";
import { Platform } from "react-native";
import storage from "./storage";

// Get the correct API URL based on environment
const getApiUrl = () => {
  // For production, you would use your production API URL
  // For development:
  if (__DEV__) {
    const webUrl = "http://localhost:8082/api";
    const mobileUrl = "http://172.20.10.2:8082/api";

    console.log(`[API] Running in ${Platform.OS} environment`);

    // When running on web in development
    if (Platform.OS === "web") {
      console.log(`[API] Using web URL: ${webUrl}`);
      return webUrl;
    }
    // When running on mobile device in development
    console.log(`[API] Using mobile URL: ${mobileUrl}`);
    return mobileUrl;
  }

  // For production (update with your production URL)
  return "https://your-production-api.com/api";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
  withCredentials: true,
});

// <-- PUT THE INTERCEPTOR CODE HERE
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem("auth_token");
    console.log("Attaching token:", token); // <--- Add this line
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.getBaseURL = () => api.defaults.baseURL;
// Export the API URL for use in other parts of the app

// Attach token to requests if present
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH API ONLY
export const authAPI = {
  async login(usernameOrEmail, password) {
    console.log("[API] Attempting login...");
    console.log(`[API] Base URL: ${api.defaults.baseURL}`);

    try {
      const response = await api.post("/auth/login", {
        username: usernameOrEmail,
        password,
      });

      console.log("[API] Login response:", response.status, response.data);

      if (response.data && response.data.token) {
        console.log("[API] Login successful");
        return { success: true, data: response.data };
      } else {
        console.log("[API] Invalid response format:", response.data);
        return {
          success: false,
          error:
            response.data?.message || "Invalid response format from server",
        };
      }
    } catch (error) {
      console.error("[API] Login error:", {
        message: error.message,
        response: error.response?.data,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      let errorMessage = "Login failed";
      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code,
        status: error.response?.status,
      };
    }
  },

  async signup(userData) {
    try {
      const response = await api.post("/auth/signup", userData);
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.data?.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  },

  async isAuthenticated() {
    try {
      const token = await storage.getItem("auth_token");
      if (!token) {
        return { success: false, authenticated: false };
      }
      const response = await api.get("/auth/me");
      if (response.data) {
        return { success: true, authenticated: true, user: response.data };
      } else {
        return { success: false, authenticated: false };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await storage.deleteItem("auth_token");
        await storage.deleteItem("refresh_token");
      }
      return {
        success: false,
        authenticated: false,
        error: error.message,
      };
    }
  },

  async logout() {
    try {
      await storage.deleteItem("auth_token");
      await storage.deleteItem("refresh_token");
      await storage.deleteItem("user");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export const getCommunities = async () => {
  const res = await api.get("/communities");
  return res.data;
};

export const createCommunity = async (data) => {
  const res = await api.post("/communities", data);
  return res.data;
};

export const joinCommunity = async (id) => {
  const res = await api.post(`/communities/${id}/join`);
  return res.data;
};

export const leaveCommunity = async (id) => {
  const res = await api.post(`/communities/${id}/leave`);
  return res.data;
};

export const getCommunityMessages = async () => {
  const res = await api.get("/messages"); // Adjust endpoint if needed
  return res.data;
};

// Get current user's profile
export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

// Update current user's profile
export const updateProfile = async (profileData) => {
  const res = await api.put("/profile", profileData);
  return res.data;
};

// Export api instance if you need to set headers in AuthContext
export { api };
