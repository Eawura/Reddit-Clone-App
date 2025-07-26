package com.neoping.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neoping.backend.model.News;
import com.neoping.backend.model.NewsComment;

public interface NewsCommentRepository extends JpaRepository<NewsComment, Long> {
    List<NewsComment> findByNews(News news);
}
