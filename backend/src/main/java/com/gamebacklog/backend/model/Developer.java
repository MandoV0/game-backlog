package com.gamebacklog.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "developers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Developer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer developerId;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private Set<Game> games;

    @Override
    public String toString() {
        return "Developer{" +
                "developerId=" + developerId +
                ", name='" + name + '\'' +
                '}';
    }
}
