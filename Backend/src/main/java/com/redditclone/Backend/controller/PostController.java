package com.redditclone.Backend.controller;

import com.redditclone.Backend.dto.PostRequest;
import com.redditclone.Backend.dto.PostResponse;
import com.redditclone.Backend.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostRequest postRequest, HttpServletRequest request) {
        postService.createPost(postRequest, request);
        return ResponseEntity.ok("Post created successfully ✅");
    }

    @GetMapping
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }
}
