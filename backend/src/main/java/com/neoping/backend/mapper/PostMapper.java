package com.neoping.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.springframework.beans.factory.annotation.Autowired;

import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import com.neoping.backend.model.VoteType;
import com.neoping.backend.repository.CommentRepository;
import com.neoping.backend.repository.VoteRepository;
import com.neoping.backend.service.AuthService;

import lombok.extern.slf4j.Slf4j;

@Mapper(componentModel = "spring")
@Slf4j
public abstract class PostMapper {
    @Autowired
    protected CommentRepository commentRepository;
    @Autowired
    protected VoteRepository voteRepository;

    @Autowired
    protected AuthService authService;

    // Returns the number of comments for a post
    public int commentCount(Post post) {
        if (post == null || post.getId() == null)
            return 0;
        return (int) commentRepository.countByPostId(post.getId());
    }

    @Mappings({
            @Mapping(target = "postId", source = "id"),
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "title", source = "title"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "content", source = "description"),
            @Mapping(target = "url", source = "url"),
            @Mapping(target = "createdDate", source = "createdDate"),
            @Mapping(target = "timestamp", source = "createdDate"),
            @Mapping(target = "userName", source = "user.username"),
            @Mapping(target = "user", source = "user.username"),
            @Mapping(target = "username", source = "user.username"),
            @Mapping(target = "commentCount", expression = "java(commentCount(post))"),
            @Mapping(target = "comments", ignore = true),
            @Mapping(target = "voteCount", expression = "java(post.getVoteCount() != null ? post.getVoteCount().intValue() : 0)"),
            @Mapping(target = "image", source = "image"),
            @Mapping(target = "video", source = "video"),
            @Mapping(target = "pollQuestion", source = "pollQuestion"),
            @Mapping(target = "pollOptions", source = "pollOptions"),
            @Mapping(target = "pollDuration", source = "pollDuration"),
            @Mapping(target = "linkUrl", source = "linkUrl"),
            @Mapping(target = "linkTitle", source = "linkTitle"),
            @Mapping(target = "community", source = "community"),
            @Mapping(target = "likes", expression = "java(post.getVoteCount() != null ? post.getVoteCount().intValue() : 0)"),
            @Mapping(target = "upVote", expression = "java(isPostUpVoted(post))"),
            @Mapping(target = "downVote", expression = "java(isPostDownVoted(post))"),
            @Mapping(target = "duration", expression = "java(mapDuration(post.getCreatedDate()))"),
            @Mapping(target = "shares", constant = "0"),
            @Mapping(target = "imageUrl", constant = ""),
            @Mapping(target = "liked", constant = "false"),
            @Mapping(target = "saved", constant = "false"),
            @Mapping(target = "success", constant = "true"),
            @Mapping(target = "error", constant = ""),
            @Mapping(target = "message", constant = ""),
            @Mapping(target = "subredditName", constant = "")
    })
    public abstract PostResponse mapToDto(Post post);

    // POST REQUEST ➝ POST ENTITY
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdDate", expression = "java(java.time.Instant.now())"),
            @Mapping(target = "title", source = "postRequest.title"),
            @Mapping(target = "url", source = "postRequest.url"),
            @Mapping(target = "description", source = "postRequest.description"),
            @Mapping(target = "voteCount", constant = "0L"),
            @Mapping(target = "user", source = "user"),
            @Mapping(target = "comments", ignore = true),
            @Mapping(target = "image", source = "postRequest.image"),
            @Mapping(target = "video", source = "postRequest.video"),
            @Mapping(target = "pollQuestion", source = "postRequest.pollQuestion"),
            @Mapping(target = "pollOptions", source = "postRequest.pollOptions"),
            @Mapping(target = "pollDuration", source = "postRequest.pollDuration"),
            @Mapping(target = "linkUrl", source = "postRequest.linkUrl"),
            @Mapping(target = "linkTitle", source = "postRequest.linkTitle"),
            @Mapping(target = "community", source = "postRequest.community")
    })
    public abstract Post map(PostRequest postRequest, User user);

    // POST ENTITY ➝ POST RESPONSE DTO
    @Mappings({
            @Mapping(target = "postId", source = "id"),
            @Mapping(target = "id", source = "id"),
            @Mapping(target = "title", source = "title"),
            @Mapping(target = "description", source = "description"),
            @Mapping(target = "content", source = "description"),
            @Mapping(target = "url", source = "url"),
            @Mapping(target = "createdDate", source = "createdDate"),
            @Mapping(target = "timestamp", source = "createdDate"),
            @Mapping(target = "userName", source = "user.username"),
            @Mapping(target = "user", source = "user.username"),
            @Mapping(target = "username", source = "user.username"),
            @Mapping(target = "commentCount", expression = "java(commentCount(post))"),
            @Mapping(target = "comments", ignore = true),
            @Mapping(target = "voteCount", expression = "java(post.getVoteCount() != null ? post.getVoteCount().intValue() : 0)"),
            @Mapping(target = "image", source = "image"),
            @Mapping(target = "video", source = "video"),
            @Mapping(target = "pollQuestion", source = "pollQuestion"),
            @Mapping(target = "pollOptions", source = "pollOptions"),
            @Mapping(target = "pollDuration", source = "pollDuration"),
            @Mapping(target = "linkUrl", source = "linkUrl"),
            @Mapping(target = "linkTitle", source = "linkTitle"),
            @Mapping(target = "community", source = "community"),
            @Mapping(target = "likes", expression = "java(post.getVoteCount() != null ? post.getVoteCount().intValue() : 0)"),
            @Mapping(target = "upVote", expression = "java(isPostUpVoted(post))"),
            @Mapping(target = "downVote", expression = "java(isPostDownVoted(post))"),
            @Mapping(target = "duration", expression = "java(mapDuration(post.getCreatedDate()))"),
            @Mapping(target = "shares", constant = "0"),
            @Mapping(target = "imageUrl", constant = ""),
            @Mapping(target = "liked", constant = "false"),
            @Mapping(target = "saved", constant = "false"),
            @Mapping(target = "success", constant = "true"),
            @Mapping(target = "error", constant = ""),
            @Mapping(target = "message", constant = ""),
            @Mapping(target = "subredditName", constant = "")
    })
    // ✅ FIXED: Helper to check if post is upvoted by current user
    protected boolean isPostUpVoted(Post post) {
        try {
            User currentUser = authService.getCurrentUser();
            return voteRepository.findTopByPostAndUserOrderByVoteIdDesc(post, currentUser)
                    .map(vote -> vote.getVoteType().equals(VoteType.UPVOTE))
                    .orElse(false);
        } catch (Exception e) {
            // User not authenticated or other error - return false
            log.debug("Failed to check upvote status for post {}: {}", post.getId(), e.getMessage());
            return false;
        }
    }

    // ✅ FIXED: Helper to check if post is downvoted by current user
    protected boolean isPostDownVoted(Post post) {
        try {
            User currentUser = authService.getCurrentUser();
            return voteRepository.findTopByPostAndUserOrderByVoteIdDesc(post, currentUser)
                    .map(vote -> vote.getVoteType().equals(VoteType.DOWNVOTE))
                    .orElse(false);
        } catch (Exception e) {
            // User not authenticated or other error - return false
            log.debug("Failed to check downvote status for post {}: {}", post.getId(), e.getMessage());
            return false;
        }
    }

    // Helper for duration formatting
    protected String mapDuration(java.time.Instant createdDate) {
        try {
            return TimeAgo.using(createdDate.toEpochMilli());
        } catch (Exception e) {
            return "just now";
        }
    }
}
