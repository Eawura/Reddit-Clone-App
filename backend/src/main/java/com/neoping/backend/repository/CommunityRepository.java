package com.neoping.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neoping.backend.model.Community;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {
    boolean existsByName(String name);
}
