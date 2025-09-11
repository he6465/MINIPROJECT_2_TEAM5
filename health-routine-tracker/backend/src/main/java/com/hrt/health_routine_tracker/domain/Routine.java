// com/hrt/health_routine_tracker/domain/Routine.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name="routines",
    uniqueConstraints = @UniqueConstraint(name="uk_routines_user_date", columnNames = {"user_id","routine_date"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Routine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="routine_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_routines_user"))
    private User user;

    @Column(name="routine_date", nullable=false)
    private LocalDate routineDate;

    // BigDecimal + precision/scale → DDL 생성 시 DECIMAL(3,1)
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
    private String note; // 길이 검증은 DTO에서 수행 (0~1000자)

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

