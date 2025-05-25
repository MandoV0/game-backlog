package com.gamebacklog.backend.service;

import com.gamebacklog.backend.dto.GameResponseDTO;
import com.gamebacklog.backend.mapper.GameMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gamebacklog.backend.repository.GameRepository;
import com.gamebacklog.backend.model.Game;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final GameMapper gameMapper;

    @Autowired
    public GameService(GameRepository gameRepository, GameMapper gameMapper) {
        this.gameRepository = gameRepository;
        this.gameMapper = gameMapper;
    }

    @Transactional(readOnly = true)
    public List<GameResponseDTO> getAllGames() {
        List<Game> games = gameRepository.findAllWithDetails();
        return gameMapper.toDtoList(games);
    }

    @Transactional(readOnly = true)
    public Optional<GameResponseDTO> getGameById(Integer id) {
        Optional<Game> game = gameRepository.findByIdWithDetails(id);
        return game.map(gameMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<GameResponseDTO> getGameByName(String name) {
        Optional<Game> game = gameRepository.findByNameWithDetails(name);
        return game.map(gameMapper::toDTO);
    }
}
