package com.neoping.backend.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.PostListResponse;
import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.service.AuthService;
import com.neoping.backend.service.CommentService;
import com.neoping.backend.service.PostService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/posts")
@AllArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:8081",
        "http://192.168.100.6:8081",
        "http://192.168.100.6:19000",
        "exp://192.168.100.6:8081"
})
@Slf4j
public class PostController {
    private final PostService postService;

    private final AuthService authService;
    private final CommentService commentService;

    // PUT /api/posts/{id} — Update a post
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        try {
            String currentUsername = authService.getCurrentUser().getUsername();
            PostResponse updated = postService.updatePost(id, postRequest, currentUsername);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update post: " + e.getMessage()));
        }
    }

    // POST /api/posts — Create a new post
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> createPost(@RequestBody PostRequest postRequest) {
        postService.save(postRequest);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // GET /api/posts — List all posts (supports pagination, category)
    @GetMapping
    public ResponseEntity<PostListResponse> getAllPosts(
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) String category,
            HttpServletRequest request) {
        try {
            log.info("📡 Getting all posts - limit: {}, offset: {}, category: {}", limit, offset, category);
            String currentUsername = null;
            try {
                currentUsername = authService.getCurrentUser().getUsername();
            } catch (Exception e) {
                log.debug("User not authenticated, showing public posts");
            }
            List<PostResponse> posts = postService.getAllPosts(limit, offset, category, currentUsername);
            int total = postService.getTotalPostsCount(category);
            PostListResponse response = PostListResponse.builder()
                    .posts(posts)
                    .total(total)
                    .limit(limit)
                    .offset(offset)
                    .hasMore(offset + limit < total)
                    .success(true)
                    .build();
            log.info("✅ Found {} posts", posts.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Error getting posts: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PostListResponse.builder()
                            .posts(Collections.emptyList())
                            .total(0)
                            .limit(limit)
                            .offset(offset)
                            .success(false)
                            .error("Failed to fetch posts: " + e.getMessage())
                            .build());
        }
    }

    // GET /api/posts/{id} — Get a single post by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id, HttpServletRequest request) {
        try {
            log.info("🎯 Getting post by ID: {}", id);
            String currentUsername = null;
            try {
                currentUsername = authService.getCurrentUser().getUsername();
            } catch (Exception e) {
                log.debug("User not authenticated");
            }
            PostResponse post = postService.getPostById(id, currentUsername);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            log.error("❌ Error getting post: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Post not found");
            errorResponse.put("success", false);
            errorResponse.put("id", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // PUT /api/posts/{id} — Update a post
    // TODO: Implement update post endpoint

    // DELETE /api/posts/{id} — Delete a post
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        try {
            String currentUsername = authService.getCurrentUser().getUsername();
            postService.deletePost(id, currentUsername);
            return ResponseEntity.ok(Map.of("success", true, "message", "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete post: " + e.getMessage()));
        }
    }

    // GET /api/posts/popular — Get popular posts (sorted by vote count)
    @GetMapping("/popular")
    public ResponseEntity<List<PostResponse>> getPopularPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String category) {
        List<PostResponse> posts = postService.getPopularPosts(page, limit, category);
        return ResponseEntity.ok(posts);
    }

    // GET /api/posts/latest — Get latest posts (sorted by date)
    @GetMapping("/latest")
    public ResponseEntity<List<PostResponse>> getLatestPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        List<PostResponse> posts = postService.getLatestPosts(page, limit, search);
        return ResponseEntity.ok(posts);
    }

    // GET /api/posts/new — Get new posts
    @GetMapping("/new")
    public ResponseEntity<List<PostResponse>> getNewPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        List<PostResponse> posts = postService.getLatestPosts(page, limit, null);
        return ResponseEntity.ok(posts);
    }

    // GET /api/posts/category/{category} — Get posts by category
    @GetMapping("/category/{category}")
    public ResponseEntity<PostListResponse> getPostsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "0") int offset,
            HttpServletRequest request) {
        try {
            log.info("� Getting posts by category: {} - limit: {}, offset: {}", category, limit, offset);
            String currentUsername = null;
            try {
                currentUsername = authService.getCurrentUser().getUsername();
            } catch (Exception e) {
                log.debug("User not authenticated, showing public posts");
            }
            List<PostResponse> posts = postService.getPostsByCategory(category, limit, offset, currentUsername);
            int total = postService.getTotalPostsByCategoryCount(category);
            PostListResponse response = PostListResponse.builder()
                    .posts(posts)
                    .total(total)
                    .limit(limit)
                    .offset(offset)
                    .hasMore(offset + limit < total)
                    .success(true)
                    .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("❌ Error getting posts by category: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(PostListResponse.builder()
                            .posts(Collections.emptyList())
                            .total(0)
                            .limit(limit)
                            .offset(offset)
                            .success(false)
                            .error("Failed to fetch posts by category: " + e.getMessage())
                            .build());
        }
    }

    // GET /api/posts/user/{username} — Get posts by user
    @GetMapping("/by-user/{name}")
    public ResponseEntity<List<PostResponse>> getPostsByUser(@PathVariable("name") String username) {
        return ResponseEntity.ok(postService.getPostsByUsername(username));
    }

    // ...existing code for comments, likes, etc...
}
