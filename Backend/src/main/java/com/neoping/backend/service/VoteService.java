package com.neoping.backend.service;

import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.Vote;
import com.neoping.backend.model.VoteType;
import com.neoping.backend.repository.PostRepository;
import com.neoping.backend.repository.VoteRepository;
import com.neoping.backend.dto.VoteDto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class VoteService {
private final AuthService authService;
private final PostRepository postRepository;
private final VoteRepository voteRepository;

    public void vote(VoteDto voteDto) {
        Post post = postRepository.findById(voteDto.getPostId())
            .orElseThrow(() -> new SpringRedditException("Post not found with id: " + voteDto.getPostId()));
        Optional<Vote> voteByPostAndUser = voteRepository.findTopByPostAndUserOrderByVoteIdDesc(post, authService.getCurrentUser());
        if(voteByPostAndUser.isPresent() && voteByPostAndUser.get().getVoteType().equals(voteDto.getVoteType())) {
            throw new SpringRedditException("You have already voted for this post");
        }
        if(VoteType.UPVOTE.equals(voteDto.getVoteType())) {
            post.setVoteCount(post.getVoteCount() + 1);
        } else {
            post.setVoteCount(post.getVoteCount() - 1);
        }
        voteRepository.save(mapToVote(voteDto, post));
        postRepository.save(post);
    }

    private Vote mapToVote(VoteDto voteDto, Post post) {
        return Vote.builder()
            .post(post)
            .user(authService.getCurrentUser())
            .voteType(voteDto.getVoteType())
            .build();
    }
}