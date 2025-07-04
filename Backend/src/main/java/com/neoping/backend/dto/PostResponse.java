package com.neoping.backend.dto;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String postName;
    private String url;
    private String description;
    private String username;
    private Long voteCount;
    private Instant createdDate;
    // new fields
    private Integer commentCount;
    private String duration;

}
