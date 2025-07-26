package com.neoping.backend.controller;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:8081",
        "http://192.168.100.6:8081",
        "http://192.168.100.6:19000",
        "exp://192.168.100.6:8081"
})
@Slf4j
public class HealthController {

    // GET /api/health - Critical for your frontend connection testing
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "healthy");
            response.put("message", "NeoPing backend is running");
            response.put("timestamp", Instant.now());
            response.put("version", "1.0.0");

            log.info("✅ Health check passed");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Health check failed: {}", e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("status", "unhealthy");
            response.put("message", "Backend service error");
            response.put("timestamp", Instant.now());
            response.put("error", e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "online");
        status.put("timestamp", Instant.now());

        return ResponseEntity.ok(status);
    }
}
