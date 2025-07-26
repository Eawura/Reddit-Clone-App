package com.neoping.backend.model;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Post name cannot be empty")
    private String title;

    private String url;

    @Lob
    private String description;

    @Builder.Default
    private Long voteCount = 0L;

    private Instant createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Comment> comments = new HashSet<>();

    // --- Extended fields for create.jsx compatibility ---
    private String image; // image URL or filename

    private String video; // video URL or filename
    private String pollQuestion;
    private String pollOptions; // JSON or comma-separated
    private Integer pollDuration;
    private String linkUrl;
    private String linkTitle;
    private String community; // community name or id

    private String category; // <-- Add this line for category support

    @PrePersist
    protected void onCreate() {
        this.createdDate = Instant.now();
    }
}
