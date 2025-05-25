package com.gamebacklog.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.Set;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "imageid")
    private Integer imageId;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "alttext")
    private String altText;

    @Column(name = "caption")
    private String caption;

    @ManyToMany(mappedBy = "images")
    @JsonBackReference
    private Set<Game> games;

    @Override
    public String toString() {
        return "Image{" +
                "imageId=" + imageId +
                ", url='" + url + '\'' +
                ", altText='" + altText + '\'' +
                '}';
    }
}