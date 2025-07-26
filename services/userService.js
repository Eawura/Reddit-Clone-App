// ✅ Import the correct userAPI object
import { userAPI } from "../utils/api";

/**
 * Get current user's profile
 * @returns {Promise<Object>} Current user profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    console.log("[UserService] 🔍 Getting current user profile...");

    const result = await userAPI.getCurrentUserProfile();

    if (result.success) {
      console.log(
        "[UserService] ✅ Profile fetched successfully:",
        result.data
      );
      return result.data; // Return just the data for compatibility
    } else {
      console.error("[UserService] ❌ Profile fetch failed:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(
      "[UserService] ❌ Error fetching current user profile:",
      error
    );
    throw error;
  }
};

/**
 * Update current user's profile
 * @param {Object} profileData - Updated profile data (username, bio, avatar)
 * @returns {Promise<Object>} Updated user profile
 */
export const updateCurrentUserProfile = async (profileData) => {
  try {
    console.log(
      "[UserService] 🔄 Updating current user profile...",
      profileData
    );

    const result = await userAPI.updateCurrentUserProfile(profileData);

    if (result.success) {
      console.log(
        "[UserService] ✅ Profile updated successfully:",
        result.data
      );
      return result.data; // Return just the data for compatibility
    } else {
      console.error("[UserService] ❌ Profile update failed:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("[UserService] ❌ Error updating user profile:", error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    console.log("[UserService] 🔍 Getting user profile by ID:", userId);

    const result = await userAPI.getUserById(userId);

    if (result.success) {
      console.log(
        "[UserService] ✅ User profile fetched successfully:",
        result.user
      );
      return result.user;
    } else {
      console.error(
        "[UserService] ❌ User profile fetch failed:",
        result.error
      );
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(`[UserService] ❌ Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - ID of the user to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    console.log("[UserService] 🔄 Updating user profile:", userId, userData);

    const result = await userAPI.updateProfile(userData);

    if (result.success) {
      console.log(
        "[UserService] ✅ User profile updated successfully:",
        result.user
      );
      return result.user;
    } else {
      console.error(
        "[UserService] ❌ User profile update failed:",
        result.error
      );
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(`[UserService] ❌ Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user's posts
 * @param {string} userId - ID of the user
 * @param {Object} params - Query parameters (page, size, sort, etc.)
 * @returns {Promise<Array>} List of user's posts
 */
export const getUserPosts = async (userId, params = {}) => {
  try {
    console.log("[UserService] 🔍 Getting user posts:", userId, params);

    // Import postsAPI for posts functionality
    const { postsAPI } = await import("../utils/api");
    const result = await postsAPI.getUserPosts(
      userId,
      params.size || 20,
      params.page || 0
    );

    if (result.success) {
      console.log(
        "[UserService] ✅ User posts fetched successfully:",
        result.posts.length,
        "posts"
      );
      return result.posts;
    } else {
      console.error("[UserService] ❌ User posts fetch failed:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error(
      `[UserService] ❌ Error fetching posts for user ${userId}:`,
      error
    );
    throw error;
  }
};

// Note: The remaining functions (uploadProfilePicture, getUserComments, followUser, unfollowUser)
// would need corresponding API functions in your api.js file to work properly.
// For now, they'll use the raw api instance as fallback:

import { api } from "../utils/api"; // Raw axios instance for unsupported endpoints

/**
 * Upload user profile picture
 * @param {string} userId - ID of the user
 * @param {Object} imageData - Image file data (usually from FormData)
 * @returns {Promise<Object>} Upload result with image URL
 */
export const uploadProfilePicture = async (userId, imageData) => {
  try {
    console.log("[UserService] 📷 Uploading profile picture for user:", userId);

    const response = await api.post(
      `/users/${userId}/profile-picture`,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("[UserService] ✅ Profile picture uploaded successfully");
    return response.data;
  } catch (error) {
    console.error("[UserService] ❌ Error uploading profile picture:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get user's comments
 * @param {string} userId - ID of the user
 * @param {Object} params - Query parameters (page, size, sort, etc.)
 * @returns {Promise<Array>} List of user's comments
 */
export const getUserComments = async (userId, params = {}) => {
  try {
    console.log("[UserService] 💬 Getting user comments:", userId, params);

    const response = await api.get(`/users/${userId}/comments`, { params });

    console.log("[UserService] ✅ User comments fetched successfully");
    return response.data;
  } catch (error) {
    console.error(
      `[UserService] ❌ Error fetching comments for user ${userId}:`,
      error
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Follow a user
 * @param {string} userId - ID of the user to follow
 * @returns {Promise<Object>} Follow status
 */
export const followUser = async (userId) => {
  try {
    console.log("[UserService] 👥 Following user:", userId);

    const response = await api.post(`/users/${userId}/follow`);

    console.log("[UserService] ✅ User followed successfully");
    return response.data;
  } catch (error) {
    console.error(`[UserService] ❌ Error following user ${userId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Unfollow a user
 * @param {string} userId - ID of the user to unfollow
 * @returns {Promise<Object>} Unfollow status
 */
export const unfollowUser = async (userId) => {
  try {
    console.log("[UserService] 👥 Unfollowing user:", userId);

    const response = await api.delete(`/users/${userId}/follow`);

    console.log("[UserService] ✅ User unfollowed successfully");
    return response.data;
  } catch (error) {
    console.error(`[UserService] ❌ Error unfollowing user ${userId}:`, error);
    throw error.response?.data || error.message;
  }
};
