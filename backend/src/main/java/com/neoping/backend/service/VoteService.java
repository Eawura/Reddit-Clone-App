package com.neoping.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neoping.backend.dto.VoteDto;
import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.Comment;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.Vote;
import com.neoping.backend.model.VoteType;
import com.neoping.backend.repository.CommentRepository;
import com.neoping.backend.repository.PostRepository;
import com.neoping.backend.repository.VoteRepository;

import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class VoteService {
    private final AuthService authService;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;

    public void vote(VoteDto voteDto) {
        if ("POST".equalsIgnoreCase(voteDto.getTargetType())) {
            Post post = postRepository.findById(voteDto.getTargetId())
                    .orElseThrow(() -> new SpringRedditException("Post not found with id: " + voteDto.getTargetId()));
            Optional<Vote> voteByPostAndUser = voteRepository.findTopByPostAndUserOrderByVoteIdDesc(post,
                    authService.getCurrentUser());
            if (voteByPostAndUser.isPresent() && voteByPostAndUser.get().getVoteType().equals(voteDto.getVoteType())) {
                throw new SpringRedditException("You have already voted for this post");
            }
            if (VoteType.UPVOTE.equals(voteDto.getVoteType())) {
                post.setVoteCount(post.getVoteCount() + 1);
            } else {
                post.setVoteCount(post.getVoteCount() - 1);
            }
            voteRepository.save(mapToVoteForPost(voteDto, post));
            postRepository.save(post);
        } else if ("COMMENT".equalsIgnoreCase(voteDto.getTargetType())) {
            Comment comment = commentRepository.findById(voteDto.getTargetId())
                    .orElseThrow(
                            () -> new SpringRedditException("Comment not found with id: " + voteDto.getTargetId()));
            Optional<Vote> voteByCommentAndUser = voteRepository.findTopByPostAndUserOrderByVoteIdDesc(comment,
                    authService.getCurrentUser());
            if (voteByCommentAndUser.isPresent()
                    && voteByCommentAndUser.get().getVoteType().equals(voteDto.getVoteType())) {
                throw new SpringRedditException("You have already voted for this comment");
            }
            if (VoteType.UPVOTE.equals(voteDto.getVoteType())) {
                comment.setVoteCount(comment.getVoteCount() + 1);
            } else {
                comment.setVoteCount(comment.getVoteCount() - 1);
            }
            voteRepository.save(mapToVoteForComment(voteDto, comment));
            commentRepository.save(comment);
        } else {
            throw new IllegalArgumentException("Unknown vote target type");
        }
    }

    private Vote mapToVoteForPost(VoteDto voteDto, Post post) {
        return Vote.builder()
                .post(post)
                .user(authService.getCurrentUser())
                .voteType(voteDto.getVoteType())
                .build();
    }

    private Vote mapToVoteForComment(VoteDto voteDto, Comment comment) {
        return Vote.builder()
                .comment(comment)
                .user(authService.getCurrentUser())
                .voteType(voteDto.getVoteType())
                .build();
    }
}