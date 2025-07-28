package com.neoping.backend.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private String username; // For display only, not for editing
    private String email; // For display only, not for editing
    private String avatar; // Profile picture
    private String bio; // Short user bio
    private Instant created; // Profile creation date
    private String displayName; // Profile/display username (editable)
}
