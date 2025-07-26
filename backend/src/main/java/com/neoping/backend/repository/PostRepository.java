package com.neoping.backend.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import com.neoping.backend.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserUsername(String username);

    Page<Post> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title, String description, org.springframework.data.domain.Pageable pageable);

    Page<Post> findByCategoryIgnoreCase(String category, org.springframework.data.domain.Pageable pageable);

}
