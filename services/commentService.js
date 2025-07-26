import api from "../utils/api";

/**
 * Fetch comments for a post
 * @param {string} postId - ID of the post
 * @param {Object} params - Query parameters (page, size, sort, etc.)
 * @returns {Promise<Array>} List of comments
 */
export const getComments = async (postId, params = {}) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Add a comment to a post
 * @param {string} postId - ID of the post to comment on
 * @param {string} content - Comment content
 * @returns {Promise<Object>} Created comment data
 */
export const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Update a comment
 * @param {string} commentId - ID of the comment to update
 * @param {string} content - Updated comment content
 * @returns {Promise<Object>} Updated comment data
 */
export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a comment
 * @param {string} commentId - ID of the comment to delete
 * @returns {Promise<Object>} Deletion status
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Vote on a comment
 * @param {string} commentId - ID of the comment to vote on
 * @param {number} voteType - Type of vote (e.g., 1 for upvote, -1 for downvote)
 * @returns {Promise<Object>} Updated vote count
 */
export const voteOnComment = async (commentId, voteType) => {
  try {
    const response = await api.post(`/comments/${commentId}/vote`, {
      voteType,
    });
    return response.data;
  } catch (error) {
    console.error(`Error voting on comment ${commentId}:`, error);
    throw error.response?.data || error.message;
  }
};
