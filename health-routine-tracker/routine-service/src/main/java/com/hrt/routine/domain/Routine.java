package com.hrt.routine.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * 루틴 엔티티 (MSA 버전)
 * User 엔티티 대신 userId로 참조
 */
@Entity
@Table(name="routines",
    uniqueConstraints = @UniqueConstraint(name="uk_routines_user_date", columnNames = {"user_id","routine_date"}),
    indexes = @Index(name="idx_routines_user", columnList = "user_id")
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Routine {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="routine_id")
    private Long id;

    /**
     * 사용자 ID (Auth Service의 User 참조)
     * MSA 환경에서는 외래키 대신 ID만 저장
     */
    @Column(name="user_id", nullable=false)
    private Long userId;

    @Column(name="routine_date", nullable=false)
    private LocalDate routineDate;

    @Column(name="sleep_hours", precision = 3, scale = 1)
    private BigDecimal sleepHours;

    @Column(name="exercise_type", length=30)
    private String exerciseType;

    @Column(name="exercise_minutes")
    private Integer exerciseMinutes;

    @Column(length=1000)
    private String meals;

    @Column(name="water_ml")
    private Integer waterMl;

    @Column(columnDefinition = "TEXT")
    private String note;

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

