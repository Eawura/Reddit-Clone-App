package com.neoping.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.mapper.PostMapper;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.PostRepository;
import com.neoping.backend.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Transactional // ✅ Restore this - it's safe now with authenticated users
@Slf4j
public class PostService {
    // ✅ NEW: LikeResult helper class
    public static class LikeResult {
        private final boolean liked;
        private final int likesCount;

        public LikeResult(boolean liked, int likesCount) {
            this.liked = liked;
            this.likesCount = likesCount;
        }

        public boolean isLiked() {
            return liked;
        }

        public int getLikesCount() {
            return likesCount;
        }
    }

    private final PostRepository postRepository;

    private final UserRepository userRepository;
    private final AuthService authService;
    private final PostMapper postMapper;

    // ✅ NEW: Delete post by ID
    public void deletePost(Long postId, String currentUsername) {
        try {
            log.info("🗑️ PostService: Deleting post {} by user {}", postId, currentUsername);
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
            if (currentUsername != null && !post.getUser().getUsername().equals(currentUsername)) {
                throw new RuntimeException("User not authorized to delete this post");
            }
            postRepository.delete(post);
            log.info("✅ Post deleted: {}", postId);
        } catch (Exception e) {
            log.error("❌ Error deleting post: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete post", e);
        }
    }

    // ✅ EXISTING: Basic get all posts
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPopularPosts(int page, int limit, String category) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "voteCount"));
        Page<Post> postPage;
        if (category != null && !category.isEmpty()) {
            postPage = postRepository.findByCategoryIgnoreCase(category, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }
        return postPage.getContent().stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getLatestPosts(int page, int limit, String search) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<Post> postPage;
        if (search != null && !search.isEmpty()) {
            postPage = postRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    search, search, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }
        return postPage.getContent().stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ NEW: Get all posts with pagination and optional category filtering (WITH
    // DEBUG)
    public List<PostResponse> getAllPosts(int limit, int offset, String category, String currentUsername) {
        try {
            log.info("📊 PostService: Getting posts - limit: {}, offset: {}, category: {}", limit, offset, category);

            // ✅ Add debug logging
            log.info("🔍 Debug: Step 1 - Fetching all posts from repository...");
            List<Post> allPosts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdDate"));
            log.info("🔍 Debug: Step 2 - Found {} posts from repository", allPosts.size());

            // Apply pagination manually
            int startIndex = Math.min(offset, allPosts.size());
            int endIndex = Math.min(startIndex + limit, allPosts.size());
            List<Post> paginatedPosts = allPosts.subList(startIndex, endIndex);
            log.info("🔍 Debug: Step 3 - Paginated to {} posts (start: {}, end: {})", paginatedPosts.size(), startIndex,
                    endIndex);

            log.info("🔍 Debug: Step 4 - Starting to map posts to DTOs...");
            List<PostResponse> result = paginatedPosts.stream()
                    .map(post -> {
                        try {
                            log.info("🔍 Debug: Step 4a - Mapping post with ID: {}", post.getId());
                            PostResponse response = postMapper.mapToDto(post);
                            log.info("🔍 Debug: Step 4b - Successfully mapped post ID: {}", post.getId());
                            return response;
                        } catch (Exception e) {
                            log.error("❌ Debug: Error mapping post ID {}: {}", post.getId(), e.getMessage(), e);
                            throw new RuntimeException("PostMapper failed for post " + post.getId(), e);
                        }
                    })
                    .collect(Collectors.toList());

            log.info("🔍 Debug: Step 5 - Successfully mapped {} posts", result.size());
            return result;

        } catch (Exception e) {
            log.error("❌ Error in getAllPosts: {}", e.getMessage(), e);
            log.error("❌ Full stack trace: ", e);
            throw new RuntimeException("Failed to fetch posts", e);
        }
    }

    // ✅ NEW: Get total posts count
    public int getTotalPostsCount(String category) {
        try {
            // For now, return total count ignoring category
            return (int) postRepository.count();
        } catch (Exception e) {
            log.error("❌ Error getting total posts count: {}", e.getMessage());
            return 0;
        }
    }

    // ✅ NEW: Get posts by category with pagination
    public List<PostResponse> getPostsByCategory(String category, int limit, int offset, String currentUsername) {
        try {
            log.info("📂 PostService: Getting posts by category: {}", category);

            // For now, return all posts (implement category filtering later)
            return getAllPosts(limit, offset, category, currentUsername);

        } catch (Exception e) {
            log.error("❌ Error getting posts by category: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch posts by category", e);
        }
    }

    // ✅ NEW: Get total posts count by category
    public int getTotalPostsByCategoryCount(String category) {
        try {
            // For now, return total count ignoring category
            return getTotalPostsCount(category);
        } catch (Exception e) {
            log.error("❌ Error getting total posts count by category: {}", e.getMessage());
            return 0;
        }
    }

    // ✅ NEW: Get popular posts
    public List<PostResponse> getPopularPosts(int limit, String timeframe, String currentUsername) {
        try {
            log.info("🏆 PostService: Getting popular posts - limit: {}, timeframe: {}", limit, timeframe);

            // For now, return posts sorted by vote count (implement real popularity logic
            // later)
            List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "voteCount"));

            return posts.stream()
                    .limit(limit)
                    .map(postMapper::mapToDto)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("❌ Error getting popular posts: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch popular posts", e);
        }
    }

    // ✅ UPDATED: Get post by ID with optional current user context
    public PostResponse getPostById(Long id, String currentUsername) {
        try {
            Post post = postRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
            return postMapper.mapToDto(post);
        } catch (Exception e) {
            log.error("❌ Error getting post by ID: {}", e.getMessage(), e);
            throw new RuntimeException("Post not found", e);
        }
    }

    // ✅ EXISTING: Get post by ID (keep for backward compatibility)
    public PostResponse getPostById(Long id) {
        return getPostById(id, null);
    }

    // ✅ NEW: Toggle like functionality (mock implementation for now)
    // Update your PostService.java toggleLike method to be real, not mock:

    public LikeResult toggleLike(Long postId, String username) {
        try {
            log.info("👍 PostService: Toggling like for post {} by user {}", postId, username);

            // Find the post
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

            // Find the user
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

            // Check if user already liked this post (you'll need to implement this)
            // For now, let's do a simple toggle:
            Long currentVotes = post.getVoteCount();
            boolean isLiked;

            // Simple toggle logic - in production you'd check a separate likes table
            if (currentVotes == null)
                currentVotes = 0L;

            // Toggle the like (simplified - you should use a proper likes table)
            if (currentVotes > 0) {
                // Unlike
                post.setVoteCount(currentVotes - 1);
                isLiked = false;
            } else {
                // Like
                post.setVoteCount(currentVotes + 1);
                isLiked = true;
            }

            postRepository.save(post);

            log.info("✅ Like toggled: post {} now has {} votes, liked: {}", postId, post.getVoteCount(), isLiked);

            return new LikeResult(isLiked, post.getVoteCount().intValue());

        } catch (Exception e) {
            log.error("❌ Error toggling like: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to toggle like", e);
        }
    }

    // ✅ EXISTING: Save post (keep as is)
    public void save(PostRequest postRequest) {
        User currentUser = authService.getCurrentUser();
        Post post = postMapper.map(postRequest, currentUser);
        postRepository.save(post);
    }

    // ✅ EXISTING: Get posts by username (FIXED)
    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // ✅ FIX: Use the correct repository method that actually exists
        return postRepository.findByUserUsername(username) // ← This method exists in your repository
                .stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ NEW: Update post by ID
    public PostResponse updatePost(Long postId, PostRequest postRequest, String currentUsername) {
        try {
            log.info("✏️ PostService: Updating post {} by user {}", postId, currentUsername);

            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

            // Optionally, check if current user is allowed to update
            if (currentUsername != null && !post.getUser().getUsername().equals(currentUsername)) {
                throw new RuntimeException("User not authorized to update this post");
            }

            // Update fields (only those allowed)
            post.setTitle(postRequest.getTitle());
            post.setDescription(postRequest.getDescription());
            post.setCategory(postRequest.getCategory());
            // Add more fields as needed

            postRepository.save(post);
            log.info("✅ Post updated: {}", postId);
            return postMapper.mapToDto(post);
        } catch (Exception e) {
            log.error("❌ Error updating post: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update post", e);
        }
    }
}
