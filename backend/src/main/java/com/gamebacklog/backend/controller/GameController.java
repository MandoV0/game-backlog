package com.gamebacklog.backend.controller;

import com.gamebacklog.backend.dto.GameResponseDTO;
import com.gamebacklog.backend.model.Game;
import com.gamebacklog.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<GameResponseDTO> getAllGames() {
        return gameService.getAllGames();
    }
}
