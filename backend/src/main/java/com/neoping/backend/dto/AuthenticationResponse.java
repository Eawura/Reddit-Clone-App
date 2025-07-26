package com.neoping.backend.dto;

import java.time.Instant;

public class AuthenticationResponse {
    private String token;
    private String username;
    private Instant expiresAt;
    private String refreshToken;

    public AuthenticationResponse() {
        // Default constructor
    }

    public AuthenticationResponse(String token, String username, Instant expiresAt, String refreshToken) {
        this.token = token;
        this.username = username;
        this.expiresAt = expiresAt;
        this.refreshToken = refreshToken;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
