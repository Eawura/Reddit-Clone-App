package com.neoping.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.neoping.backend.dto.NewsDto;
import com.neoping.backend.model.Bookmark;
import com.neoping.backend.model.News;
import com.neoping.backend.repository.BookmarkRepository;
import com.neoping.backend.repository.NewsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NewsService {
    @Autowired
    private com.neoping.backend.repository.NewsCommentRepository newsCommentRepository;
    private final NewsRepository newsRepository;
    @Autowired
    private BookmarkRepository bookmarkRepository;

    // Create a news article
    public NewsDto createNews(NewsDto newsDto) {
        News news = News.builder()
                .user(newsDto.getUser())
                .avatar(newsDto.getAvatar())
                .title(newsDto.getTitle())
                .excerpt(newsDto.getExcerpt())
                .image(newsDto.getImage())
                .category(newsDto.getCategory())
                .timestamp(newsDto.getTimestamp() != null ? newsDto.getTimestamp() : Instant.now())
                .upvotes(0)
                .comments(0)
                .build();
        News saved = newsRepository.save(news);
        return toDto(saved);
    }

    // Get all comments for a news article
    public List<String> getCommentsForNews(Long newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        List<com.neoping.backend.model.NewsComment> comments = newsCommentRepository.findByNews(news);
        return comments.stream().map(com.neoping.backend.model.NewsComment::getContent).collect(Collectors.toList());
    }

    // Get a single news article by ID
    public NewsDto getNewsById(Long newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        return toDto(news);
    }

    public List<NewsDto> getNews(String category, String search, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<News> newsPage;
        if (category != null && !category.equalsIgnoreCase("All")) {
            newsPage = newsRepository.findByCategoryIgnoreCase(category, pageable);
        } else if (search != null && !search.isEmpty()) {
            newsPage = newsRepository.findByTitleContainingIgnoreCaseOrExcerptContainingIgnoreCase(search, search,
                    pageable);
        } else {
            newsPage = newsRepository.findAll(pageable);
        }
        return newsPage.getContent().stream().map(this::toDto).collect(Collectors.toList());
    }

    public void upvoteNews(Long newsId, String username) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        news.setUpvotes(news.getUpvotes() + 1);
        newsRepository.save(news);
        // Optionally: track which users have upvoted to prevent multiple upvotes
    }

    public void downvoteNews(Long newsId, String username) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        news.setUpvotes(news.getUpvotes() - 1);
        newsRepository.save(news);
        // Optionally: track which users have downvoted
    }

    public void addComment(Long newsId, String username, String commentText) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        com.neoping.backend.model.NewsComment comment = com.neoping.backend.model.NewsComment.builder()
                .news(news)
                .username(username)
                .content(commentText)
                .createdAt(Instant.now())
                .build();
        newsCommentRepository.save(comment);
        news.setComments(news.getComments() + 1);
        newsRepository.save(news);
    }

    public void bookmarkNews(Long newsId, String username) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        if (!bookmarkRepository.existsByUsernameAndNewsId(username, newsId)) {
            Bookmark bookmark = Bookmark.builder()
                    .username(username)
                    .news(news)
                    .bookmarkedAt(Instant.now())
                    .build();
            bookmarkRepository.save(bookmark);
        }
    }

    private NewsDto toDto(News n) {
        return NewsDto.builder()
                .id(n.getId())
                .user(n.getUser())
                .avatar(n.getAvatar())
                .title(n.getTitle())
                .excerpt(n.getExcerpt())
                .image(n.getImage())
                .category(n.getCategory())
                .timestamp(n.getTimestamp())
                .upvotes(n.getUpvotes())
                .comments(n.getComments())

                // TODO: set upvoted, downvoted, saved based on user interaction
                .upvoted(false)
                .downvoted(false)
                .saved(false)
                .build();
    }
}
