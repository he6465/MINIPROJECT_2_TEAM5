package com.hrt.comment.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * 댓글 엔티티 (MSA 버전)
 * Routine과 User는 ID로만 참조
 */
@Entity
@Table(name="comments",
    indexes = @Index(name="idx_comments_routine", columnList = "routine_id")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="comment_id")
    private Long id;

    /**
     * 루틴 ID (Routine Service의 Routine 참조)
     */
    @Column(name="routine_id", nullable=false)
    private Long routineId;

    /**
     * 사용자 ID (Auth Service의 User 참조)
     */
    @Column(name="user_id", nullable=false)
    private Long userId;

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
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}

