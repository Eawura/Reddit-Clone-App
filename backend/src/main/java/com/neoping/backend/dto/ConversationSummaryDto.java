package com.neoping.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationSummaryDto {
    public Long id;
    public String user; // Other participant or group name
    public String avatar;
    public String lastMessage;
    public String time;
    public boolean unread;
}
