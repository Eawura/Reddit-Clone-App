import api from "../utils/api";

/**
 * Fetch all posts
 * @param {Object} params - Query parameters (page, size, sort, etc.)
 * @returns {Promise<Array>} List of posts
 */
export const getPosts = async (params = {}) => {
  try {
    const response = await api.get("/posts", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Fetch a single post by ID
 * @param {string} postId - ID of the post to fetch
 * @returns {Promise<Object>} Post data
 */
export const getPostById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new post
 * @param {Object} postData - Post data to create
 * @returns {Promise<Object>} Created post data
 */
export const createPost = async (postData) => {
  try {
    const response = await api.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Update a post
 * @param {string} postId - ID of the post to update
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} Updated post data
 */
export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a post
 * @param {string} postId - ID of the post to delete
 * @returns {Promise<Object>} Deletion status
 */
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Upload an image for a post
 * @param {string} postId - ID of the post
 * @param {Object} imageData - Image file data (usually from FormData)
 * @returns {Promise<Object>} Upload result
 */
export const uploadPostImage = async (postId, imageData) => {
  try {
    const response = await api.post(`/posts/${postId}/images`, imageData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading post image:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Vote on a post
 * @param {string} postId - ID of the post to vote on
 * @param {number} voteType - Type of vote (e.g., 1 for upvote, -1 for downvote)
 * @returns {Promise<Object>} Updated vote count
 */
export const voteOnPost = async (postId, voteType) => {
  try {
    const response = await api.post(`/posts/${postId}/vote`, { voteType });
    return response.data;
  } catch (error) {
    console.error(`Error voting on post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};
