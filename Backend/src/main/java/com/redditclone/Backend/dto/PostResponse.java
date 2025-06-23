package com.redditclone.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String postName;
    private String description;
    private String url;
    private String username;
}
