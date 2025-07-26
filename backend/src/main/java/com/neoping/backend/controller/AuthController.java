package com.neoping.backend.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.AuthenticationResponse;
import com.neoping.backend.dto.LoginRequest;
import com.neoping.backend.dto.RefreshTokenRequest;
import com.neoping.backend.dto.RegisterRequest;
import com.neoping.backend.model.User;
import com.neoping.backend.service.AuthService;
import com.neoping.backend.service.RefreshTokenService;
import com.neoping.backend.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("Signup attempt for user: {}", registerRequest.getUsername());
            authService.signup(registerRequest);
            logger.info("Signup successful for user: {}", registerRequest.getUsername());
            return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Signup failed for user: {}", registerRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Signup failed: " + e.getMessage());
        }
    }

    @GetMapping("/accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        // return ResponseEntity.ok("Account activated successfully");
        return new ResponseEntity<>("Account activated successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for user: {}", loginRequest.getUsername());
            AuthenticationResponse response = authService.login(loginRequest);
            logger.info("Login successful for user: {}", loginRequest.getUsername());
            logger.info("Response body: {}", response);
            return ResponseEntity.ok(response);
        } catch (com.neoping.backend.exception.SpringRedditException e) {
            logger.error("Login failed for user: {} - {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "timestamp", System.currentTimeMillis(),
                            "status", HttpStatus.UNAUTHORIZED.value(),
                            "error", "Unauthorized",
                            "message", "Invalid username or password",
                            "path", "/api/auth/login"));
        } catch (Exception e) {
            logger.error("Unexpected error during login for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "timestamp", System.currentTimeMillis(),
                            "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "error", "Internal Server Error",
                            "message", "An unexpected error occurred during login",
                            "path", "/api/auth/login"));
        }
    }

    @PostMapping("/refresh/token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            AuthenticationResponse response = authService.refreshToken(refreshTokenRequest);
            logger.info("Refresh token successful for user: {}", refreshTokenRequest.getUsername());
            logger.info("Response body: {}", response);
            return ResponseEntity.ok(response);
        } catch (com.neoping.backend.exception.RefreshTokenExpiredException e) {
            logger.warn("Refresh token expired for user: {}", refreshTokenRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of(
                            "timestamp", System.currentTimeMillis(),
                            "status", HttpStatus.UNAUTHORIZED.value(),
                            "error", "Unauthorized",
                            "message", e.getMessage(),
                            "path", "/api/auth/refresh/token"));
        } catch (com.neoping.backend.exception.SpringRedditException e) {
            logger.info("Refresh token deleted for user: {}", refreshTokenRequest.getUsername());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of(
                            "timestamp", System.currentTimeMillis(),
                            "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "error", "Internal Server Error",
                            "message", e.getMessage(),
                            "path", "/api/auth/refresh/token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok("Logout successful");
    }

    @GetMapping("/debug/user/{username}")
    public ResponseEntity<?> checkUserExists(@PathVariable String username) {
        try {
            boolean exists = userService.userExists(username);
            return ResponseEntity.ok(Map.of(
                    "username", username,
                    "exists", exists,
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            logger.error("Error checking user existence for: {}", username, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error checking user existence"));
        }
    }

    @GetMapping("/debug/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = userService.getAllUsersBasicInfo();
            return ResponseEntity.ok(Map.of(
                    "users", users,
                    "count", users.size(),
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            logger.error("Error getting all users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error getting users"));
        }
    }

}