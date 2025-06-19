package com.redditclone.Backend.service;

import com.redditclone.Backend.dto.LoginRequest;
import com.redditclone.Backend.model.User;
import com.redditclone.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<String> signup(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists ❌");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully ✅");
    }

    public ResponseEntity<String> login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.ok("Login successful ✅");
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password ❌");
    }
}
