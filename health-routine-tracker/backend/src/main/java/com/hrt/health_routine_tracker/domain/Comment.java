// com/hrt/health_routine_tracker/domain/Comment.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="comments",
    indexes = @Index(name="idx_comments_routine", columnList = "routine_id")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="comment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="routine_id", nullable=false, foreignKey = @ForeignKey(name="fk_comments_routine"))
    private Routine routine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_comments_user"))
    private User user;

    @Column(nullable=false, length=2000)
    private String content;

    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name="updated_at", nullable=false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }
}

