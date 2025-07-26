package com.neoping.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendChatMessageRequest {
    private Long senderId;
    private Long receiverId;
    private String content;
}
