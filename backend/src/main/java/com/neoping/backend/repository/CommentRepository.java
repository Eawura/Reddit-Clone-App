package com.neoping.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.neoping.backend.model.Comment;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Fetch all comments for a post (optional: fetch only top-level)
    List<Comment> findByPost(Post post);

    // Fetch only top-level comments (parentComment IS NULL)
    List<Comment> findByPostAndParentCommentIsNull(Post post);

    // Fetch replies for a given parent comment
    List<Comment> findByParentComment(Comment parentComment);

    List<Comment> findAllByUser(User user);

    Long countByPost(Post post);

    // Add these methods to your existing CommentRepository.java if they don't exist
    List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

    // Alternative query if the above doesn't work
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId ORDER BY c.createdAt DESC")
    List<Comment> findCommentsByPostId(@Param("postId") Long postId);

    List<Comment> findByPostId(Long postId);

    long countByPostId(Long postId);
}
