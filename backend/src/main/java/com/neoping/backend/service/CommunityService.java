package com.neoping.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.neoping.backend.dto.CommunityDto;
import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.mapper.CommunityMapper;
import com.neoping.backend.model.Community;
import com.neoping.backend.model.User;
import com.neoping.backend.repository.CommunityRepository;
import com.neoping.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {
    private final CommunityRepository communityRepository;
    private final CommunityMapper communityMapper;
    private final UserRepository userRepository;

    @Transactional
    public CommunityDto createCommunity(CommunityDto dto, String creatorUsername) {
        if (communityRepository.existsByName(dto.getName())) {
            throw new SpringRedditException("Community name already exists");
        }
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new SpringRedditException("User not found: " + creatorUsername));
        Community community = communityMapper.fromDto(dto);
        community.setCreator(creator);
        Community saved = communityRepository.save(community);
        return communityMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CommunityDto> getAllCommunities() {
        return communityRepository.findAll().stream()
                .map(communityMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CommunityDto getCommunity(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new SpringRedditException("Community not found with id: " + id));
        return communityMapper.toDto(community);
    }
}
