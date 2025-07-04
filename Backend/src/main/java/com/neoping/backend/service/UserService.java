package com.neoping.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neoping.backend.dto.UserProfile;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found: " + userDetails.getUsername()));
        }
        throw new IllegalStateException("No user is authenticated");
    }

    @Transactional
    public void updateUserProfile(UserProfile profile) {
        User user = getCurrentUser();
        if (profile.getEmail() != null && !profile.getEmail().equals(user.getEmail())) {
            user.setEmail(profile.getEmail());
        }
        userRepository.save(user);
    }
}
