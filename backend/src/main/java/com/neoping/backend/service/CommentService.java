package com.neoping.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.neoping.backend.dto.CommentDto;
import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.mapper.CommentMapper;
import com.neoping.backend.model.Comment;
import com.neoping.backend.model.NotificationEmail;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.CommentRepository;
import com.neoping.backend.repository.PostRepository;
import com.neoping.backend.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class CommentService {
        private static final String POST_URL = "http://localhost:8082/api/posts/";

        private final PostRepository postRepository;

        private final UserRepository userRepository;

        private final CommentRepository commentRepository;
        private final CommentMapper commentMapper;
        private final MailContentBuilder mailContentBuilder;
        private final MailService mailService;

        // ✅ NEW: Update a comment by ID
        public void updateComment(Long id, CommentDto commentDto) {
                Comment comment = commentRepository.findById(id)
                                .orElseThrow(() -> new SpringRedditException("Comment not found with id: " + id));
                // Update allowed fields (e.g., content)
                comment.setContent(commentDto.getContent());
                comment.setUpdatedAt(LocalDateTime.now());
                commentRepository.save(comment);
        }

        // ✅ NEW: Delete a comment by ID
        public void deleteComment(Long id) {
                Comment comment = commentRepository.findById(id)
                                .orElseThrow(() -> new SpringRedditException("Comment not found with id: " + id));
                commentRepository.delete(comment);
        }

        public void save(CommentDto commentDto) {
                Post post = postRepository.findById(commentDto.getPostId())
                                .orElseThrow(() -> new SpringRedditException(
                                                "Post not found with id: " + commentDto.getPostId()));

                post.getUser().getUsername(); // Force load user

                User user = userRepository.findByUsername(commentDto.getUserName())
                                .orElseThrow(() -> new SpringRedditException(
                                                "User not found: " + commentDto.getUserName()));

                Comment comment = commentMapper.map(commentDto, post, user);
                comment.setCreatedAt(LocalDateTime.now());

                // Handle nested comment
                if (commentDto.getParentCommentId() != null) {
                        Comment parentComment = commentRepository.findById(commentDto.getParentCommentId())
                                        .orElseThrow(() -> new SpringRedditException(
                                                        "Parent comment not found with id: "
                                                                        + commentDto.getParentCommentId()));
                        comment.setParentComment(parentComment);
                }

                commentRepository.save(comment);

                // Send notification if commenter is not post owner
                if (!user.getUsername().equals(post.getUser().getUsername())) {
                        String message = mailContentBuilder.build(user.getUsername() +
                                        " commented on your post. View it here: " + POST_URL + post.getId());
                        sendCommentNotification(post.getUser(), message);
                }
        }

        public List<CommentDto> getAllCommentsForPost(Long postId) {
                // Use repository method that fetches by postId for reliability
                List<Comment> comments;
                try {
                        comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
                } catch (Exception e) {
                        // Fallback to custom query if needed
                        comments = commentRepository.findCommentsByPostId(postId);
                }
                if (comments == null) {
                        return List.of();
                }
                // Map to DTOs, handle possible serialization issues
                return comments.stream()
                                .map(commentMapper::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<CommentDto> getAllCommentsForUser(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new SpringRedditException("User not found: " + username));

                return commentRepository.findAllByUser(user).stream()
                                .map(commentMapper::mapToDto)
                                .collect(Collectors.toList());
        }

        public List<Comment> getCommentsByPostId(Long postId) {
                try {
                        log.info("📖 Getting comments for post ID: {}", postId);

                        // Try the direct method first, fallback to query if needed
                        try {
                                return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
                        } catch (Exception e) {
                                log.warn("Direct method failed, trying query method: {}", e.getMessage());
                                return commentRepository.findCommentsByPostId(postId);
                        }

                } catch (Exception e) {
                        log.error("❌ Error getting comments for post {}: {}", postId, e.getMessage());
                        throw new RuntimeException("Failed to get comments", e);
                }
        }

        public Comment addComment(Long postId, String content, String username) {
                try {
                        log.info("💬 Adding comment to post {} by user: {}", postId, username);

                        // Find the post
                        Post post = postRepository.findById(postId)
                                        .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

                        // Find the user
                        User user = userRepository.findByUsername(username)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "User not found with username: " + username));

                        // Create comment using your existing Comment entity
                        Comment comment = Comment.builder()
                                        .content(content)
                                        .post(post)
                                        .user(user)
                                        .build();

                        // Save using your existing repository
                        Comment savedComment = commentRepository.save(comment);
                        log.info("✅ Comment saved with ID: {}", savedComment.getId());

                        return savedComment;

                } catch (Exception e) {
                        log.error("❌ Error adding comment: {}", e.getMessage());
                        throw new RuntimeException("Failed to add comment", e);
                }
        }

        private void sendCommentNotification(User user, String message) {
                log.info("Sending comment email to: {}", user.getEmail());
                mailService.sendMail(new NotificationEmail(
                                "Someone commented on your post",
                                user.getEmail(),
                                message));
        }
}
