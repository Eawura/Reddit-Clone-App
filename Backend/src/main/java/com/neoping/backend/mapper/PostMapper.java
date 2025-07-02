package com.neoping.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "id", ignore = true) // 👈 ADD THIS

    @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())")

    @Mapping(target = "postName", source = "postRequest.postName")
    @Mapping(target = "url", source = "postRequest.url")
    @Mapping(target = "description", source = "postRequest.description")
    @Mapping(target = "voteCount", constant = "0L")
    @Mapping(target = "user", source = "user")
    Post map(PostRequest postRequest, User user);

    @Mapping(target = "username", source = "user.username")
    // @Mapping(target = "id", source = "postId")
    @Mapping(target = "postName", source = "postName")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "voteCount", source = "voteCount")
    @Mapping(target = "createdDate", source = "createdDate")
    PostResponse mapToDto(Post post);

    @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())")
    @Mapping(target = "voteCount", constant = "0L")
    Post mapToEntity(PostRequest postRequest);
}
