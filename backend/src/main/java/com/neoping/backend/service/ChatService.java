package com.neoping.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.neoping.backend.model.ChatMessage;
import com.neoping.backend.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;

    // Send a message
    public ChatMessage sendMessage(Long senderId, Long receiverId, String content) {
        ChatMessage message = ChatMessage.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .content(content)
                .timestamp(Instant.now())
                .build();
        return chatMessageRepository.save(message);
    }

    // Get all messages between two users
    public List<ChatMessage> getMessagesBetweenUsers(Long senderId, Long receiverId) {
        return chatMessageRepository.findBySenderIdAndReceiverIdOrderByTimestampAsc(senderId, receiverId);
    }

    // Get all messages for a user (sent or received)
    public List<ChatMessage> getMessagesForUser(Long userId) {
        return chatMessageRepository.findBySenderIdOrReceiverIdOrderByTimestampAsc(userId, userId);
    }
}
