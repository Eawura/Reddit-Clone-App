package com.neoping.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.AuthenticationResponse;
import com.neoping.backend.dto.LoginRequest;
import com.neoping.backend.dto.RefreshTokenRequest;
import com.neoping.backend.dto.RegisterRequest;
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
        authService.signup(registerRequest);
        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @GetMapping("/accountVerification/{token}")
    public ResponseEntity<String> verifyAccount(@PathVariable String token) {
        authService.verifyAccount(token);
        // return ResponseEntity.ok("Account activated successfully");
        return new ResponseEntity<>("Account activated successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthenticationResponse response = authService.login(loginRequest);
        logger.info("Login successful for user: {}", loginRequest.getUsername());
        logger.info("Response body: {}", response);
        return ResponseEntity.ok(response);
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
                    "path", "/api/auth/refresh/token"
                ));
        } catch (com.neoping.backend.exception.SpringRedditException e) {
            logger.info("Refresh token deleted for user: {}", refreshTokenRequest.getUsername());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(java.util.Map.of(
                    "timestamp", System.currentTimeMillis(),
                    "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "error", "Internal Server Error",
                    "message", e.getMessage(),
                    "path", "/api/auth/refresh/token"
                ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok("Logout successful");
    }

}
