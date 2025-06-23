package com.redditclone.Backend.service;

import com.redditclone.Backend.dto.PostRequest;
import com.redditclone.Backend.dto.PostResponse;
import com.redditclone.Backend.model.Post;
import com.redditclone.Backend.repository.PostRepository;
import com.redditclone.Backend.security.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final JwtProvider jwtProvider;

    public void createPost(PostRequest postRequest, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String username = jwtProvider.getUsernameFromJwt(token);

        Post post = Post.builder()
                .postName(postRequest.getPostName())
                .description(postRequest.getDescription())
                .url(postRequest.getUrl())
                .createdDate(Instant.now())
                .username(username)
                .build();

        postRepository.save(post);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream().map(post -> new PostResponse(
                post.getId(),
                post.getPostName(),
                post.getDescription(),
                post.getUrl(),
                post.getUsername()
        )).collect(Collectors.toList());
    }
}
