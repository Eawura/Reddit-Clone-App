import axios from 'axios';
import { getAuthToken } from './auth';

const BASE_URL = 'http://localhost:8082/api/comments';

// Fetch comments for a post
export async function fetchComments(postId) {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}/by-post/${postId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
}

// Post a new comment
export async function postComment({ postId, content, userName, parentCommentId }) {
  const token = await getAuthToken();
  const payload = { postId, content, userName };
  if (parentCommentId) payload.parentCommentId = parentCommentId;
  const response = await axios.post(BASE_URL, payload, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}
