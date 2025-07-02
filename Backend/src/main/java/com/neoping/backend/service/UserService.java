package com.neoping.backend.service;

import com.neoping.backend.model.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.neoping.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
// import org.springframework.security.core.userdetails.UserDetails;

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
}
