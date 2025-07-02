package com.neoping.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neoping.backend.dto.PostRequest;
import com.neoping.backend.dto.PostResponse;
import com.neoping.backend.mapper.PostMapper;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.PostRepository;
import com.neoping.backend.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final AuthService authService;
    private final UserRepository userRepository;

    public void save(PostRequest postRequest) {
        System.out.println("Saving post: " + postRequest); // 👈 Add this line

        User currentUser = authService.getCurrentUser(); // 👈 Get the logged-in user
        Post post = postMapper.map(postRequest, currentUser);
        postRepository.save(post);
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return postMapper.mapToDto(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return postRepository.findByUserUsername(username)
                .stream()
                .map(postMapper::mapToDto)
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return toDto(post);
    }

    private PostResponse toDto(Post post) {
        return postMapper.mapToDto(post);
    }
}
