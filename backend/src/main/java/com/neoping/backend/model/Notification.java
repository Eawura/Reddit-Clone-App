package com.neoping.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; // upvote, comment, reply, award, follow, mention, moderator, etc.
    private String user; // who triggered the notification
    private String avatar;
    private String action;
    private String content;
    private String time;
    @Column(name = "is_read", nullable = false)
    private boolean read;
    private String postId;
    private String commentId;
    private String awardType;
    private String recipient; // username of the notification recipient
}
