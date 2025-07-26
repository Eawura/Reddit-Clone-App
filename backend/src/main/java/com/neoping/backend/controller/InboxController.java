package com.neoping.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neoping.backend.dto.ConversationSummaryDto;
import com.neoping.backend.dto.MessageDto;
import com.neoping.backend.service.InboxService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inbox")
@RequiredArgsConstructor
public class InboxController {
    private final InboxService inboxService;

    @GetMapping
    public ResponseEntity<List<ConversationSummaryDto>> getInbox(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(inboxService.getInboxForUser(username));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<MessageDto>> getConversation(
            @PathVariable Long conversationId, Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(inboxService.getMessagesInConversation(conversationId, username));
    }

    @PostMapping("/{conversationId}/message")
    public ResponseEntity<MessageDto> sendMessage(
            @PathVariable Long conversationId,
            @RequestBody MessageDto messageDto,
            Principal principal) {
        String username = principal.getName();
        MessageDto sent = inboxService.sendMessage(conversationId, username, messageDto);
        return ResponseEntity.status(201).body(sent);
    }

    @PostMapping("/{conversationId}/mark-read")
    public ResponseEntity<Void> markConversationAsRead(
            @PathVariable Long conversationId, Principal principal) {
        String username = principal.getName();
        inboxService.markConversationAsRead(conversationId, username);
        return ResponseEntity.ok().build();
    }
}
