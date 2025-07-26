package com.neoping.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neoping.backend.model.Bookmark;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    boolean existsByUsernameAndNewsId(String username, Long newsId);

    void deleteByUsernameAndNewsId(String username, Long newsId);
}
