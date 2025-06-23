package com.redditclone.Backend.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String postName;
    private String description;
    private String url;
}
