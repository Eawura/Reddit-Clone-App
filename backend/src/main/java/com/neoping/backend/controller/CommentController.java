package com.neoping.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.CommentDto;
import com.neoping.backend.service.CommentService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/comments")
@AllArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // POST /api/comments — Add a comment to a post
    @PostMapping
    public ResponseEntity<Void> createComment(@RequestBody CommentDto commentDto) {
        commentService.save(commentDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // GET /api/comments/{postId} — Get comments for a post
    @GetMapping("/{postId}")
    public ResponseEntity<List<CommentDto>> getAllCommentsForPost(@PathVariable Long postId) {
        return new ResponseEntity<>(commentService.getAllCommentsForPost(postId), HttpStatus.OK);
    }

    // PUT /api/comments/{id} — Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateComment(@PathVariable Long id, @RequestBody CommentDto commentDto) {
        commentService.updateComment(id, commentDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // DELETE /api/comments/{id} — Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // GET /api/comments/by-user/{username} — Get comments by user (optional)
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
