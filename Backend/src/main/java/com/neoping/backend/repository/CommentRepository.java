package com.neoping.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neoping.backend.model.Comment;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;

import java.util.List;

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
}
