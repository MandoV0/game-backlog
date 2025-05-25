package com.gamebacklog.backend.repository;

import com.gamebacklog.backend.model.Image;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {
    Optional<Image> findByUrl(String url);
}
