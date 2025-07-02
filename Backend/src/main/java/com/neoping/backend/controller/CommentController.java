package com.neoping.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.CommentDto;
import com.neoping.backend.mapper.CommentMapper;
import com.neoping.backend.repository.CommentRepository;
import com.neoping.backend.repository.UserRepository;
import com.neoping.backend.service.CommentService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;

    @PostMapping
    public ResponseEntity<Void> createComment(@RequestBody CommentDto commentDto) {
        commentService.save(commentDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/by-post/{postId}")
    public ResponseEntity<Object> getAllCommentsForPost(@PathVariable Long postId) {
        return new ResponseEntity<>(commentService.getAllCommentsForPost(postId), HttpStatus.OK);
    }

    @GetMapping("/by-user/{username}")
    public ResponseEntity<List<CommentDto>> getCommentsByUser(@PathVariable String username) {
        return new ResponseEntity<>(commentService.getAllCommentsForUser(username), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<String> handleCommentsRoot() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Please use /by-post/{postId} or /by-user/{username} to fetch comments.");
    }

}
