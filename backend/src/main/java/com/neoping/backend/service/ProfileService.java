package com.neoping.backend.service;

import org.springframework.stereotype.Service;

import com.neoping.backend.dto.ProfileDto;
import com.neoping.backend.model.Profile;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.ProfileRepository;
import com.neoping.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileDto getUserProfile(String username) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return toDto(profile);
    }

    public ProfileDto updateUserProfile(String username, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setAvatar(profileDto.getAvatar());
        profile.setBio(profileDto.getBio());

        // Update email
        if (profileDto.getEmail() != null && !profileDto.getEmail().isEmpty()) {
            profile.getUser().setEmail(profileDto.getEmail());
        }

        // Update password (make sure to hash it in a real app!)
        if (profileDto.getPassword() != null && !profileDto.getPassword().isEmpty()) {
            profile.getUser().setPassword(profileDto.getPassword());
        }

        profileRepository.save(profile);
        return toDto(profile);
    }

    // Create a new user profile
    public ProfileDto createProfile(ProfileDto profileDto) {
        Profile profile = new Profile();
        profile.setAvatar(profileDto.getAvatar());
        profile.setBio(profileDto.getBio());
        // You may need to set the User object here, depending on your model
        // For example, fetch the User by username and set it to profile
        // profile.setUser(userRepository.findByUsername(profileDto.getUsername()).orElseThrow(...));
        // Fetch the user by username
        User user = userRepository.findByUsername(profileDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + profileDto.getUsername()));

        profile.setUser(user);
        profile.setCreated(java.time.Instant.now());
        profileRepository.save(profile);
        return toDto(profile);
    }

    private ProfileDto toDto(Profile profile) {
        return ProfileDto.builder()
                .username(profile.getUser().getUsername())
                .email(profile.getUser().getEmail())
                .avatar(profile.getAvatar())
                .bio(profile.getBio())
                .created(profile.getCreated())
                .build();
    }
}
