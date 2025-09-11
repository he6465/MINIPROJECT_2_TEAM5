// com/hrt/health_routine_tracker/domain/User.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name="users",
        uniqueConstraints = {
                @UniqueConstraint(name="uk_users_email", columnNames = "email"),
                @UniqueConstraint(name="uk_users_nickname", columnNames = "nickname")
        })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    private Long id;

    @Column(nullable=false, length=100)
    private String email;

    @Column(nullable=false, length=50)
    private String username;

    @Column(nullable=false, length=50)
    private String nickname;

    @Column(name="password_hash", nullable=false, length=200)
    private String passwordHash;

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

