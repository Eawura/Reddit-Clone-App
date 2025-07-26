package com.neoping.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.neoping.backend.model.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Page<Video> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description,
            Pageable pageable);

    Page<Video> findByCategoryIgnoreCase(String category, Pageable pageable);
}
