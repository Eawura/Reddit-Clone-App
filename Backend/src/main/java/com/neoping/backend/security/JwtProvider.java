package com.neoping.backend.security;

import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.time.Instant;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.neoping.backend.exception.SpringRedditException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtProvider {

    private KeyStore keyStore;
    
    @Value("${jwt.expiration.time}")
    private Long jwtExpirationInMillis;

    @Value("${jwt.refresh.expiration.time}")
    private Long jwtRefreshExpirationInMillis;

    @PostConstruct
    public void init() {
        try {
            keyStore = KeyStore.getInstance("JKS");
            InputStream resourceStream = getClass().getResourceAsStream("/springblog.jks");
            keyStore.load(resourceStream, "secret".toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | java.io.IOException e) {
            throw new SpringRedditException("Failed to initialize keystore", e);
        }
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(Date.from(Instant.now().plusMillis(jwtExpirationInMillis)))
            .signWith(getPrivateKey(), SignatureAlgorithm.RS256)
            .compact();
    }

    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(Date.from(Instant.now().plusMillis(jwtRefreshExpirationInMillis)))
            .signWith(getPrivateKey(), SignatureAlgorithm.RS256)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getPublicKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(getPublicKey())
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

            Date expiration = claims.getExpiration();
            if (expiration.before(new Date())) {
                throw new com.neoping.backend.exception.RefreshTokenExpiredException("Your refresh token has expired");
            }
            return true;
        } catch (com.neoping.backend.exception.RefreshTokenExpiredException e) {
            throw e;
        } catch (Exception e) {
            throw new com.neoping.backend.exception.SpringRedditException("Invalid refresh token");
        }
    }

    public String getUsernameFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getPublicKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }

    public long getJwtExpirationInMillis() {
        return jwtExpirationInMillis;
    }

    private PrivateKey getPrivateKey() {
        try {
            return (PrivateKey) keyStore.getKey("springblog", "password".toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            throw new SpringRedditException("Failed to retrieve private key", e);
        }
    }

    private PublicKey getPublicKey() {
        try {
            return keyStore.getCertificate("springblog").getPublicKey();
        } catch (KeyStoreException e) {
            throw new SpringRedditException("Failed to retrieve public key", e);
        }
    }
}
