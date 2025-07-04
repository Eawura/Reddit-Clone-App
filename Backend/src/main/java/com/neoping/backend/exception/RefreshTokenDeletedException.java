package com.neoping.backend.exception;

public class RefreshTokenDeletedException extends RuntimeException {
    public RefreshTokenDeletedException(String message) {
        super(message);
    }
}
