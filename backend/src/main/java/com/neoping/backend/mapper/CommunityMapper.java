package com.neoping.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.neoping.backend.dto.CommunityDto;
import com.neoping.backend.model.Community;

@Mapper(componentModel = "spring")
public interface CommunityMapper {
    @Mapping(target = "creatorId", source = "creator.id")
    @Mapping(target = "creatorName", source = "creator.username")
    @Mapping(target = "displayName", source = "displayName")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "avatar", source = "avatar")
    @Mapping(target = "members", source = "members")
    @Mapping(target = "rules", source = "rules")
    CommunityDto toDto(Community community);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "creator", ignore = true) // Set in service
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "displayName", source = "displayName")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "avatar", source = "avatar")
    @Mapping(target = "members", source = "members")
    @Mapping(target = "rules", source = "rules")
    Community fromDto(CommunityDto dto);
}
