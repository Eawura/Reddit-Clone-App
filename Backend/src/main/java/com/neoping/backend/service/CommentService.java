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

    public void save(CommentDto commentDto) {
        Post post = postRepository.findById(commentDto.getPostId())
                .orElseThrow(() -> new SpringRedditException("Post not found with id: " + commentDto.getPostId()));

        post.getUser().getUsername(); // Force load user

        User user = userRepository.findByUsername(commentDto.getUserName())
                .orElseThrow(() -> new SpringRedditException("User not found: " + commentDto.getUserName()));

        Comment comment = commentMapper.map(commentDto, post, user);
        comment.setCreatedAt(LocalDateTime.now());

        // Handle nested comment
        if (commentDto.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentDto.getParentCommentId())
                    .orElseThrow(() -> new SpringRedditException("Parent comment not found with id: " + commentDto.getParentCommentId()));
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
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new SpringRedditException("Post not found with id " + postId));

        // Fetch only top-level comments
        List<Comment> topLevelComments = commentRepository.findByPostAndParentCommentIsNull(post);

        // Map to DTO (assuming mapper can handle nested replies or you do it here)
        return topLevelComments.stream()
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

    private void sendCommentNotification(User user, String message) {
        log.info("Sending comment email to: {}", user.getEmail());
        mailService.sendMail(new NotificationEmail(
                "Someone commented on your post",
                user.getEmail(),
                message));
    }
}
