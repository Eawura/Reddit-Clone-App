import axios from "axios";
import { Platform } from "react-native";
import storage from "./storage";

// Only set your local IP here
const getApiUrl = () => {
  const LOCAL_IP = "192.168.200.160"; // Update if your IP changes
  const PORT = "8082";
  if (Platform.OS === "web") {
    return `http://localhost:${PORT}/api`;
  } else {
    return `http://${LOCAL_IP}:${PORT}/api`;
  }
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
    try {
      const response = await api.post("/auth/login", {
        username: usernameOrEmail,
        password,
      });
      if (response.data && response.data.token) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: "Invalid response format from server" };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
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

// Export api instance if you need to set headers in AuthContext
export { api };
