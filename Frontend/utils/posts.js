// Utility for fetching posts from backend
import axios from "axios";

export async function fetchPosts(token) {
  const response = await axios.get("http://localhost:8082/api/posts", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return response.data;
}
