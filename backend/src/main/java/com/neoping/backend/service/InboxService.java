package com.neoping.backend.service;

import com.neoping.backend.dto.ConversationSummaryDto;
import com.neoping.backend.dto.MessageDto;
import com.neoping.backend.model.Conversation;
import com.neoping.backend.model.Message;
import com.neoping.backend.repository.ConversationRepository;
import com.neoping.backend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InboxService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public List<ConversationSummaryDto> getInboxForUser(String username) {
        List<Conversation> conversations = conversationRepository.findByUser1OrUser2(username, username);
        return conversations.stream().map(conv -> {
            List<Message> messages = messageRepository.findByConversationIdOrderByTimeAsc(conv.getId());
            Message last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
            boolean unread = messages.stream().anyMatch(m -> m.getRecipient().equals(username) && m.isUnread());
            String otherUser = conv.getUser1().equals(username) ? conv.getUser2() : conv.getUser1();
            String avatar = conv.getUser1().equals(username) ? conv.getAvatar2() : conv.getAvatar1();
            return ConversationSummaryDto.builder()
                    .id(conv.getId())
                    .user(otherUser)
                    .avatar(avatar)
                    .lastMessage(last != null ? last.getContent() : "")
                    .time(last != null ? last.getTime() : "")
                    .unread(unread)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<MessageDto> getMessagesInConversation(Long conversationId, String username) {
        return messageRepository.findByConversationIdOrderByTimeAsc(conversationId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MessageDto sendMessage(Long conversationId, String sender, MessageDto dto) {
        Conversation conv = conversationRepository.findById(conversationId).orElseThrow();
        String recipient = conv.getUser1().equals(sender) ? conv.getUser2() : conv.getUser1();
        Message message = Message.builder()
                .conversation(conv)
                .sender(sender)
                .recipient(recipient)
                .content(dto.getContent())
                .time(LocalDateTime.now().toString())
                .unread(true)
                .build();
        message = messageRepository.save(message);
        return toDto(message);
    }

    public void markConversationAsRead(Long conversationId, String username) {
        List<Message> messages = messageRepository.findByConversationIdOrderByTimeAsc(conversationId);
        messages.stream()
                .filter(m -> m.getRecipient().equals(username))
                .forEach(m -> m.setUnread(false));
        messageRepository.saveAll(messages);
    }

    private MessageDto toDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .sender(m.getSender())
                .recipient(m.getRecipient())
                .content(m.getContent())
                .time(m.getTime())
                .unread(m.isUnread())
                .build();
    }
}