package com.neoping.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommunityDto {
    private Long id;
    private String name;
    private String displayName;
    private String description;
    private String category;
    private String avatar;
    private boolean isPublic;
    private int members;
    private String rules;
    private Long creatorId;
    private String creatorName;
    private LocalDateTime createdAt;
}
