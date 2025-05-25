package com.gamebacklog.backend.repository;

import com.gamebacklog.backend.model.Developer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeveloperRepository extends JpaRepository<Developer, Integer> {
    Optional<Developer> findByName(String name);
}
