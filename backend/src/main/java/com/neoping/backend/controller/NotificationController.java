package com.neoping.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.NotificationDto;
import com.neoping.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(notificationService.getNotificationsForUser(username));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        String username = principal.getName();
        notificationService.markAllAsRead(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        notificationService.markAsRead(id, username);
        return ResponseEntity.ok().build();
    }
}
