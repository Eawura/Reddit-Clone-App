package com.neoping.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String title;
    private String url;
    private String description;
    private String category; // Added for post category support

    // --- Extended fields for create.jsx compatibility ---
    private String image; // image URL or filename
    private String video; // video URL or filename
    private String pollQuestion;
    private String pollOptions; // JSON or comma-separated
    private Integer pollDuration;
    private String linkUrl;
    private String linkTitle;
    private String community; // community name or id

    @Override
    public String toString() {
        return "PostRequest{" +
                "title='" + title + '\'' +
                ", url='" + url + '\'' +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", image='" + image + '\'' +
                ", video='" + video + '\'' +
                ", pollQuestion='" + pollQuestion + '\'' +
                ", pollOptions='" + pollOptions + '\'' +
                ", pollDuration='" + pollDuration + '\'' +
                ", linkUrl='" + linkUrl + '\'' +
                ", linkTitle='" + linkTitle + '\'' +
                ", community='" + community + '\'' +
                '}';
    }

}
