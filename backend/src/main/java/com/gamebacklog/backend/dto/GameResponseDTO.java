package com.gamebacklog.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResponseDTO {
    private Integer gameId;
    private String name;
    private String description;
    private String developerName;
    private LocalDate releaseDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> genres;
    private List<String> imageUrls;
}
