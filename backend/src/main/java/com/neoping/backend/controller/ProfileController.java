package com.neoping.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.ProfileDto;
import com.neoping.backend.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/{username}")
    public ResponseEntity<ProfileDto> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(profileService.getUserProfile(username));
    }

    @PutMapping("/{username}")
    public ResponseEntity<ProfileDto> updateUserProfile(
            @PathVariable String username,
            @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.updateUserProfile(username, profileDto));
    }

    // POST /api/profile - Create a new user profile
    @PostMapping
    public ResponseEntity<ProfileDto> createUserProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.createProfile(profileDto));
    }
}
