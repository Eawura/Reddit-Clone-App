package com.neoping.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.neoping.backend.dto.CommentDto;
import com.neoping.backend.model.Comment;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "post", source = "post")
    @Mapping(target = "user", source = "user") // ✅ This was missing
    @Mapping(target = "parentComment", ignore = true) // Set manually in service to avoid partial loading issues
    Comment map(CommentDto commentDto, Post post, User user);

    @Mapping(target = "postId", expression = "java(comment.getPost().getId())")
    @Mapping(target = "userName", expression = "java(comment.getUser().getUsername())")
    @Mapping(target = "userId", expression = "java(comment.getUser().getId())")
    @Mapping(target = "parentCommentId", source = "parentComment.id", defaultValue = "0L") 
    CommentDto mapToDto(Comment comment);
}
