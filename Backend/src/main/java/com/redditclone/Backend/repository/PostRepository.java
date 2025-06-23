package com.redditclone.Backend.repository;

import com.redditclone.Backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
