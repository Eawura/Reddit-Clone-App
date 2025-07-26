package com.neoping.backend.exception;

import java.time.Instant;

public class ErrorResponseUtil {
    public static String generateErrorJson(int status, String message, String path) {
        String timestamp = Instant.now().toString();
        return String.format(
            "{" +
                "\"timestamp\": \"%s\"," +
                "\"status\": %d," +
                "\"message\": \"%s\"," +
                "\"path\": \"%s\"" +
            "}", timestamp, status, escapeJson(message), escapeJson(path)
        );
    }

    // Optional: Escapes quotes and slashes for safe JSON output
    private static String escapeJson(String input) {
        return input.replace("\"", "\\\"").replace("\\", "\\\\");
    }
}
