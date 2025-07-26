package com.neoping.backend.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    public Long id;
    public String sender; // username or userId as String
    public String recipient; // username or userId as String
    public String content;
    public String time; // String for formatted time
    public boolean unread;

}
