package com.neoping.backend.controller;

import java.security.Principal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.ChatMessageDto;
import com.neoping.backend.dto.SendChatMessageRequest;
import com.neoping.backend.model.ChatMessage;
import com.neoping.backend.service.ChatService;
import com.neoping.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final ChatService chatService;
    private final UserService userService;

    // Send a chat message
    @PostMapping("/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendMessage(@RequestBody SendChatMessageRequest request, Principal principal) {
        try {
            Long authenticatedUserId = userService.getCurrentUser().getId();
            // Always use authenticated user's ID as sender
            if (!authenticatedUserId.equals(request.getSenderId())) {
                return ResponseEntity.status(403).body("You can only send messages as yourself.");
            }
            ChatMessage message = chatService.sendMessage(authenticatedUserId, request.getReceiverId(),
                    request.getContent());
            logger.info("Message sent from {} to {}", authenticatedUserId, request.getReceiverId());
            ChatMessageDto dto = mapToDto(message);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            logger.error("Error sending chat message", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to send message"));
        }
    }

    // Get all messages between two users
    @GetMapping("/between/{user1Id}/{user2Id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMessagesBetweenUsers(@PathVariable Long user1Id, @PathVariable Long user2Id,
            Principal principal) {
        try {
            Long authenticatedUserId = userService.getCurrentUser().getId();
            // Only allow if the authenticated user is one of the participants
            if (!authenticatedUserId.equals(user1Id) && !authenticatedUserId.equals(user2Id)) {
                return ResponseEntity.status(403).body("You can only view conversations you are part of.");
            }
            List<ChatMessage> messages = chatService.getMessagesBetweenUsers(user1Id, user2Id);
            List<ChatMessageDto> dtos = messages.stream().map(this::mapToDto).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching messages between users", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to fetch messages"));
        }
    }

    // Get all messages for a user
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMessagesForUser(@PathVariable Long userId, Principal principal) {
        try {
            Long authenticatedUserId = userService.getCurrentUser().getId();
            if (!authenticatedUserId.equals(userId)) {
                return ResponseEntity.status(403).body("You can only view your own messages.");
            }
            List<ChatMessage> messages = chatService.getMessagesForUser(userId);
            List<ChatMessageDto> dtos = messages.stream().map(this::mapToDto).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            logger.error("Error fetching messages for user", e);
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Failed to fetch messages"));
        }
    }

    // Helper method to map entity to DTO
    private ChatMessageDto mapToDto(ChatMessage message) {
        return ChatMessageDto.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
