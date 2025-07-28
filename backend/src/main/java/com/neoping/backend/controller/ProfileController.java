package com.neoping.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.ProfileDto;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.UserRepository;
import com.neoping.backend.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final UserRepository userRepository;

    // Get any user's profile by username
    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(profileService.getUserProfile(username));
    }

    // Update any user's profile by username (optional, for admin or self-edit)
    @PutMapping("/{username}")
    public ResponseEntity<ProfileDto> updateUserProfile(
            @PathVariable String username,
            @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.updateUserProfile(username, profileDto));
    }

    // Get current authenticated user's profile
    @GetMapping
    public ResponseEntity<ProfileDto> getCurrentProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(profileService.getUserProfile(user.getUsername()));
    }

    // Update current authenticated user's profile
    @PutMapping
    public ResponseEntity<ProfileDto> updateCurrentProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileDto profileDto) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(profileService.updateUserProfile(user.getUsername(), profileDto));
    }
}
