package com.neoping.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String postName;
    private String url;
    private String description;

    @Override
    public String toString() {
        return "PostRequest{" +
                "postName='" + postName + '\'' +
                ", url='" + url + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

}
