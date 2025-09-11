// com/hrt/health_routine_tracker/domain/Like.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="likes",
    uniqueConstraints = @UniqueConstraint(name="uk_likes_routine_user", columnNames={"routine_id","user_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Like {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="like_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="routine_id", nullable=false, foreignKey = @ForeignKey(name="fk_likes_routine"))
    private Routine routine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_likes_user"))
    private User user;

    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }
}
