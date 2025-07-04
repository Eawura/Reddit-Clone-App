package com.neoping.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private Long id;
    private String content; // Changed from 'text' to 'content'
    private Long postId;
    private long userId;
    private String userName;
    private LocalDateTime createdAt;
    private Long parentCommentId; // nullable

}
