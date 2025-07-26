package com.neoping.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neoping.backend.model.ChatMessage;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // Get all messages between two users (ordered by timestamp)
    List<ChatMessage> findBySenderIdAndReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);

    // Get all messages for a user (as sender or receiver)
    List<ChatMessage> findBySenderIdOrReceiverIdOrderByTimestampAsc(Long senderId, Long receiverId);
}
