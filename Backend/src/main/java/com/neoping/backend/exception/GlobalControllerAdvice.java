package com.neoping.backend.exception;

import com.neoping.backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalControllerAdvice {

    private static final Logger logger = LoggerFactory.getLogger(GlobalControllerAdvice.class);

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        // Optional: customize request parameter binding here
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<?> handleRefreshTokenExpired(RefreshTokenExpiredException ex, HttpServletRequest request) {
        logger.warn("Refresh token expired: {}", ex.getMessage());
        java.util.Map<String, Object> error = new java.util.HashMap<>();
        error.put("status", 401);
        error.put("message", ex.getMessage());
        error.put("timestamp", System.currentTimeMillis());
        error.put("expiration", "expired");
        error.put("path", request.getRequestURI());
        return ResponseEntity.status(401).body(error);
    }

    @ExceptionHandler(SpringRedditException.class)
    public ResponseEntity<ErrorResponse> handleSpringReddit(SpringRedditException ex, HttpServletRequest request) {
        logger.info("SpringRedditException: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
            HttpStatus.UNAUTHORIZED.value(),
            ex.getMessage(),
            request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex, HttpServletRequest request) {
        logger.error("Exception caught in GlobalControllerAdvice: ", ex);

        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Error: " + ex.getMessage(),
            request.getRequestURI()
        );

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
