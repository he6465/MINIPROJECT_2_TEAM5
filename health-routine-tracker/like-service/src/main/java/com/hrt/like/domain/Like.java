package com.hrt.like.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * 좋아요 엔티티 (MSA 버전)
 */
@Entity
@Table(name="likes",
    uniqueConstraints = @UniqueConstraint(name="uk_likes_routine_user", columnNames={"routine_id","user_id"}),
    indexes = @Index(name="idx_likes_routine", columnList = "routine_id")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Like {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="like_id")
    private Long id;

    @Column(name="routine_id", nullable=false)
    private Long routineId;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }
}

