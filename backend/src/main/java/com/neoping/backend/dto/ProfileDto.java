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
    private String username;
    private String email;
    private String avatar; // URL or filename for profile picture
    private String bio; // Short user bio
    private Instant created; // Account creation date
    private String password;
}
