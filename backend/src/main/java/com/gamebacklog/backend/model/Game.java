package com.gamebacklog.backend.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.awt.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "games")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gameid")
    private Integer gameId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "releasedate")
    private LocalDate releaseDate;

    @Column(name = "createdat", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedat")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "developerid", nullable = false)
    @JsonManagedReference
    private Developer developer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "gamegenres",
            joinColumns = @JoinColumn(name = "gameid"),
            inverseJoinColumns = @JoinColumn(name = "genreid")
    )
    @JsonManagedReference
    private Set<Genre> genres = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "gameimages",
            joinColumns = @JoinColumn(name = "gameid"),
            inverseJoinColumns = @JoinColumn(name = "imageid")
    )
    @JsonManagedReference
    private Set<Image> images = new HashSet<>();



    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}