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
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(userRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found")));
                    return profileRepository.save(newProfile);
                });

        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setUsername(profile.getUser().getUsername());
        dto.setEmail(profile.getUser().getEmail());
        dto.setBio(profile.getBio());
        dto.setAvatar(profile.getAvatar());
        // ...other fields
        return dto;
    }

    public ProfileDto updateUserProfile(String username, ProfileDto profileDto) {
        Profile profile = profileRepository.findByUserUsername(username)
                .orElseGet(() -> {
                    Profile newProfile = new Profile();
                    newProfile.setUser(userRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found")));
                    return profileRepository.save(newProfile);
                });

        // Update bio and avatar
        profile.setBio(profileDto.getBio());
        profile.setAvatar(profileDto.getAvatar());

        // Only update displayName (profile username), not login username
        if (profileDto.getDisplayName() != null) {
            String displayName = profileDto.getDisplayName().trim();
            if (!displayName.startsWith("u/")) {
                displayName = "u/" + displayName;
            }
            profile.setDisplayName(displayName);
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

        // Ensure displayName always starts with "u/"
        String displayName = profileDto.getDisplayName();
        if (displayName == null || displayName.isBlank()) {
            displayName = "u/" + user.getUsername();
        } else {
            displayName = displayName.trim();
            if (!displayName.startsWith("u/")) {
                displayName = "u/" + displayName;
            }
        }
        profile.setDisplayName(displayName);

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
                .displayName(profile.getDisplayName())
                .build();
    }
}
