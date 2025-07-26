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
public class VideoDto {
    private Long id;
    private String title;
    private String description;
    private String url;
    private String thumbnail;
    private String category;
    private Instant uploadedAt;
    private String uploader;
    private int views;
}
