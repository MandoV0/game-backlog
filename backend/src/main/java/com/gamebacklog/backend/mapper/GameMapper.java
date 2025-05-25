package com.gamebacklog.backend.mapper;

import com.gamebacklog.backend.dto.GameResponseDTO;
import com.gamebacklog.backend.model.Game;
import com.gamebacklog.backend.model.Genre;
import com.gamebacklog.backend.model.Image;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GameMapper {
    public GameResponseDTO toDTO(Game game) {
        if (game == null) {
            return null;
        }

        GameResponseDTO dto = new GameResponseDTO();
        dto.setGameId(game.getGameId());
        dto.setName(game.getName());
        dto.setDescription(game.getDescription());
        dto.setReleaseDate(game.getReleaseDate());
        dto.setCreatedAt(game.getCreatedAt());
        dto.setUpdatedAt(game.getUpdatedAt());

        if (game.getDeveloper() != null) {
            dto.setDeveloperName(game.getDeveloper().getName());
        }

        if (game.getGenres() != null && !game.getGenres().isEmpty()) {
            List<String> genres = game.getGenres().stream().map(Genre::getName).toList();

            dto.setGenres(genres);
        } else {
            dto.setGenres(List.of());
        }

        if (game.getImages() != null && !game.getImages().isEmpty()) {
            List<String> images = game.getImages().stream().map(Image::getUrl).toList();

            dto.setImageUrls(images);
        } else {
            dto.setImageUrls(List.of());
        }

        return dto;
    }

    public List<GameResponseDTO> toDtoList(List<Game> games) {
        return games.stream().map(this::toDTO).toList();
    }
}
