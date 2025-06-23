package com.redditclone.Backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.redditclone.Backend.model.Comment;
import com.redditclone.Backend.model.Post;
import com.redditclone.Backend.model.User;
import com.redditclone.Backend.repository.CommentRepository;
import com.redditclone.Backend.repository.PostRepository;
import com.redditclone.Backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Comment saveComment(Long postId, Comment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        // For now, we attach a static user (until you implement JWT/auth context)
        User user = userRepository.findById(1L) // hardcoded example
                .orElseThrow(() -> new RuntimeException("User not found"));

        comment.setCreatedDate(Instant.now());
        comment.setPost(post);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        return commentRepository.findByPost(post);
    }

    public Comment getCommentById(Long id) {
    return commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
}

public List<Comment> getAllComments() {
    return commentRepository.findAll();
}

}
