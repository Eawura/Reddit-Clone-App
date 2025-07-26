package com.neoping.backend.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private Long postId; // Alternative ID field for compatibility
    private String title;
    private String description;
    private String subredditName;
    private String userName;
    private Instant createdDate;
    private String url;
    private Integer voteCount;
    private Integer commentCount;
    private String duration;
    private boolean upVote;
    private boolean downVote;

    // Add these fields for frontend compatibility
    private String content; // Alternative to description
    private String user; // Alternative to userName
    private String username; // Another alternative
    private Instant timestamp; // Alternative to createdDate
    private Integer likes; // Alternative to voteCount
    private Integer comments; // Alternative to commentCount
    private Integer shares; // For share functionality
    private String image; // For post images
    private String imageUrl; // Alternative image field
    private boolean liked; // For like status
    private boolean saved; // For bookmark status

    // Error handling field
    private String error; // ✅ This fixes the builder() error
    private boolean success; // Success status
    private String message; // Success/error message
    // --- Extended fields for create.jsx compatibility ---
    private String video; // video URL or filename
    private String pollQuestion;
    private String pollOptions; // JSON or comma-separated
    private Integer pollDuration;
    private String linkUrl;
    private String linkTitle;
    private String community; // community name or id
}
