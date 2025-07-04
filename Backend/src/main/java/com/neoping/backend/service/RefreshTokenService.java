package com.neoping.backend.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.RefreshToken;
import com.neoping.backend.repository.RefreshTokenRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Generates a new refresh token with a 7-day expiration.
     */
    public RefreshToken generateRefreshToken() {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenValue(UUID.randomUUID().toString());
        refreshToken.setCreatedDate(Instant.now());
        refreshToken.setExpirationDate(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // 7 days
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Validates a refresh token's existence and expiration.
     * Throws an exception if invalid or expired.
     */
    public void validateRefreshToken(String tokenValue) {
        RefreshToken token = refreshTokenRepository.findByTokenValue(tokenValue)
            .orElseThrow(() -> new SpringRedditException("Invalid refresh token"));

        if (token.isExpired()) {
            refreshTokenRepository.delete(token); // optional: clean up expired token
            throw new SpringRedditException("Refresh token has expired. Please login again.");
        }
    }

    /**
     * Deletes a refresh token from the database.
     */
    public void deleteRefreshToken(String tokenValue) {
        refreshTokenRepository.deleteByTokenValue(tokenValue);
    }
}
