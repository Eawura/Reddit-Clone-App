package com.neoping.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.CommentRepository;
import com.neoping.backend.repository.VoteRepository;
import com.neoping.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import com.github.marlonlom.utilities.timeago.TimeAgo;

@Mapper(componentModel = "spring")
public abstract class PostMapper {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private AuthService authService;

    @Mapping(target = "id", ignore = true) // 👈 ADD THIS

    @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())")

    @Mapping(target = "postName", source = "postRequest.postName")
    @Mapping(target = "url", source = "postRequest.url")
    @Mapping(target = "description", source = "postRequest.description")
    @Mapping(target = "voteCount", constant = "0L")
    @Mapping(target = "user", source = "user")
    public abstract Post map(PostRequest postRequest, User user);

    


    @Mapping(target = "username", source = "user.username")
    // @Mapping(target = "id", source = "postId")
    @Mapping(target = "postName", source = "postName")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "commentCount", expression = "java(commentCount(post))")
    @Mapping(target = "duration", expression = "java(mapDuration(post.getCreatedDate()))")
    public abstract PostResponse mapToDto(Post post);

    Integer commentCount(Post post) {return commentRepository.findByPost(post).size();}

    String mapDuration(java.time.Instant createdDate) {
        return TimeAgo.using(createdDate.toEpochMilli());
    }

}
