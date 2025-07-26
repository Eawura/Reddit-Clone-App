package com.neoping.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.NewsDto;
import com.neoping.backend.service.NewsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    private final NewsService newsService;

    // Create a news article
    @PostMapping
    public ResponseEntity<NewsDto> createNews(@RequestBody NewsDto newsDto) {
        NewsDto created = newsService.createNews(newsDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // 1. Add a comment to a news article
    @PostMapping("/{id}/comment")
    public ResponseEntity<Void> addComment(
            @PathVariable Long id,
            @RequestBody String comment,
            Principal principal) {
        newsService.addComment(id, principal.getName(), comment);
        return ResponseEntity.ok().build();
    }

    // 2. Get comments for a news article
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<String>> getCommentsForNews(@PathVariable Long id) {
        List<String> comments = newsService.getCommentsForNews(id);
        return ResponseEntity.ok(comments);
    }

    // 3. List news articles (supports search, category, pagination)
    @GetMapping
    public ResponseEntity<List<NewsDto>> getNews(
            @RequestParam(defaultValue = "All") String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(newsService.getNews(category, search, page, limit));
    }

    // 4. Get news article by ID
    @GetMapping("/{id}")
    public ResponseEntity<NewsDto> getNewsById(@PathVariable Long id) {
        NewsDto news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    // 5. Upvote a news article
    @PostMapping("/{id}/upvote")
    public ResponseEntity<Void> upvoteNews(@PathVariable Long id, Principal principal) {
        newsService.upvoteNews(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    // 6. Downvote a news article
    @PostMapping("/{id}/downvote")
    public ResponseEntity<Void> downvoteNews(@PathVariable Long id, Principal principal) {
        newsService.downvoteNews(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    // 7. Bookmark a news article
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<String> bookmarkNews(@PathVariable Long id, Principal principal) {
        newsService.bookmarkNews(id, principal.getName());
        return ResponseEntity.ok("Bookmarked successfully");
    }
}
