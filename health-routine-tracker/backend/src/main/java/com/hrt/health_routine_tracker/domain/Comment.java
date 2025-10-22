/**
 * 댓글 엔티티 클래스
 * 
 * Health Routine Tracker 애플리케이션에서 루틴에 대한 댓글을 관리하는 JPA 엔티티입니다.
 * 사용자들이 다른 사용자의 루틴에 댓글을 달고, 댓글을 수정할 수 있는 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 루틴에 대한 댓글 작성 및 관리
 * - 댓글 작성자와 루틴 소유자 간의 관계 관리
 * - 댓글 생성/수정 시간 자동 관리
 * - 루틴별 댓글 조회 성능 최적화를 위한 인덱스
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */
// com/hrt/health_routine_tracker/domain/Comment.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * JPA 엔티티로 댓글 테이블과 매핑
 * 
 * @param name 데이터베이스 테이블명
 * @param indexes 루틴별 댓글 조회 성능 최적화를 위한 인덱스 설정
 */
@Entity
@Table(name="comments",
    indexes = @Index(name="idx_comments_routine", columnList = "routine_id")
)
/**
 * Lombok 어노테이션으로 보일러플레이트 코드 자동 생성
 * - @Getter: 모든 필드에 대한 getter 메서드 생성
 * - @Setter: 모든 필드에 대한 setter 메서드 생성
 * - @NoArgsConstructor: 기본 생성자 생성
 * - @AllArgsConstructor: 모든 필드를 매개변수로 받는 생성자 생성
 * - @Builder: 빌더 패턴 구현
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {
    
    /**
     * 댓글 고유 식별자 (Primary Key)
     * 
     * 데이터베이스에서 자동으로 증가하는 BIGINT 타입의 기본키입니다.
     * GenerationType.IDENTITY를 사용하여 데이터베이스의 AUTO_INCREMENT 기능을 활용합니다.
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="comment_id")
    private Long id;

    /**
     * 댓글이 달린 루틴
     * 
     * Routine 엔티티와 다대일(Many-to-One) 관계를 가집니다.
     * LAZY 로딩을 사용하여 성능을 최적화합니다.
     * 외래키 제약조건이 적용되어 데이터 무결성을 보장합니다.
     * 루틴이 삭제되면 관련 댓글도 함께 삭제됩니다 (CASCADE).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="routine_id", nullable=false, foreignKey = @ForeignKey(name="fk_comments_routine"))
    private Routine routine;

    /**
     * 댓글 작성자
     * 
     * User 엔티티와 다대일(Many-to-One) 관계를 가집니다.
     * LAZY 로딩을 사용하여 성능을 최적화합니다.
     * 외래키 제약조건이 적용되어 데이터 무결성을 보장합니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_comments_user"))
    private User user;

    /**
     * 댓글 내용
     * 
     * 사용자가 작성한 댓글의 실제 내용을 저장합니다.
     * 최대 2000자까지 입력 가능하며, NULL을 허용하지 않습니다.
     * HTML 태그나 특수 문자도 포함할 수 있습니다.
     */
    @Column(nullable=false, length=2000)
    private String content;

    /**
     * 댓글 생성 시간
     * 
     * 댓글이 처음 작성된 시간을 기록합니다.
     * 한 번 설정되면 수정할 수 없습니다 (updatable=false).
     * 기본값으로 현재 시간이 자동 설정됩니다.
     */
    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * 댓글 수정 시간
     * 
     * 댓글 내용이 마지막으로 수정된 시간을 기록합니다.
     * 댓글이 수정될 때마다 자동으로 현재 시간으로 업데이트됩니다.
     * 기본값으로 현재 시간이 자동 설정됩니다.
     */
    @Column(name="updated_at", nullable=false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    /**
     * 엔티티 저장 전 실행되는 콜백 메서드
     * 
     * 새로운 댓글 엔티티가 데이터베이스에 저장되기 전에
     * 생성 시간과 수정 시간을 현재 시간으로 설정합니다.
     */
    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    /**
     * 엔티티 수정 전 실행되는 콜백 메서드
     * 
     * 기존 댓글 엔티티가 수정되기 전에
     * 수정 시간을 현재 시간으로 업데이트합니다.
     */
    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }
}

