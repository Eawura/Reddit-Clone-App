package com.neoping.backend.service;

import java.util.List;
import java.util.stream.Collectors;
import com.neoping.backend.dto.NotificationDto;
import com.neoping.backend.model.Notification;
import com.neoping.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<NotificationDto> getNotificationsForUser(String username) {
        return notificationRepository.findByRecipientOrderByTimeDesc(username)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void markAllAsRead(String username) {
        List<Notification> notifications = notificationRepository.findByRecipientOrderByTimeDesc(username);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void markAsRead(Long id, String username) {
        Notification n = notificationRepository.findById(id)
                .filter(notif -> notif.getRecipient().equals(username))
                .orElseThrow();
        n.setRead(true);
        notificationRepository.save(n);
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .type(n.getType())
                .user(n.getUser())
                .avatar(n.getAvatar())
                .action(n.getAction())
                .content(n.getContent())
                .time(n.getTime())
                .read(n.isRead())
                .postId(n.getPostId())
                .commentId(n.getCommentId())
                .awardType(n.getAwardType())
                .build();
    }
}