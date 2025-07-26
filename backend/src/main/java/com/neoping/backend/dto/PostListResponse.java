package com.neoping.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostListResponse {
    private List<PostResponse> posts;
    private int total;
    private int limit;
    private int offset;
    private boolean hasMore;
    private boolean success;
    private String error;
}
