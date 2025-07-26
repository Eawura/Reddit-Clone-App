package com.neoping.backend.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 1000)
    private String tokenValue;

    @Column(nullable = false)
    private Instant createdDate;

    @Column(nullable = false)
    private Instant expirationDate;

    public RefreshToken() {
    }

    public RefreshToken(String tokenValue, Instant createdDate, Instant expirationDate) {
        this.tokenValue = tokenValue;
        this.createdDate = createdDate;
        this.expirationDate = expirationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenValue() {
        return tokenValue;
    }

    public void setTokenValue(String tokenValue) {
        this.tokenValue = tokenValue;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Instant expirationDate) {
        this.expirationDate = expirationDate;
    }

    public boolean isExpired() {
        return Instant.now().isAfter(expirationDate);
    }
}
