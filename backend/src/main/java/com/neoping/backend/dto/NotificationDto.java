package com.neoping.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String type;
    private String user;
    private String avatar;
    private String action;
    private String content;
    private String time;
    private boolean read;
    private String postId;
    private String commentId;
    private String awardType;
}