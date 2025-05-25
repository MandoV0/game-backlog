package com.gamebacklog.backend.repository;

import com.gamebacklog.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {
    Optional<Game> findByName(String name);

    @Query("SELECT DISTINCT g FROM Game g JOIN FETCH g.developer LEFT JOIN FETCH g.genres LEFT JOIN FETCH g.images")
    List<Game> findAllWithDetails();

    @Query("SELECT DISTINCT g FROM Game g JOIN FETCH g.developer LEFT JOIN FETCH g.genres LEFT JOIN FETCH g.images WHERE g.gameId = :id")
    Optional<Game> findByIdWithDetails(Integer id);

    @Query("SELECT DISTINCT g FROM Game g JOIN FETCH g.developer LEFT JOIN FETCH g.genres LEFT JOIN FETCH g.images WHERE g.name = :name")
    Optional<Game> findByNameWithDetails(String name);
}
