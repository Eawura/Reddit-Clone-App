package com.neoping.backend.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsDto {
    private Long id;
    private String user;
    private String avatar;
    private String title;
    private String excerpt;
    private String image;
    private String category;
    private Instant timestamp;
    private int upvotes;
    private int comments;
    private boolean upvoted;
    private boolean downvoted;
    private boolean saved;
}
