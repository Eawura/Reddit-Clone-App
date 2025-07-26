package com.neoping.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.neoping.backend.model.News;

public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<News> findByTitleContainingIgnoreCaseOrExcerptContainingIgnoreCase(String title, String excerpt,
            Pageable pageable);
}
