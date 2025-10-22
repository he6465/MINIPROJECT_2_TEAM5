/**
 * 좋아요 엔티티 클래스
 * 
 * Health Routine Tracker 애플리케이션에서 루틴에 대한 좋아요 기능을 관리하는 JPA 엔티티입니다.
 * 사용자들이 다른 사용자의 루틴에 좋아요를 누르고 취소할 수 있는 기능을 제공합니다.
 * 
 * 주요 기능:
 * - 루틴에 대한 좋아요 등록 및 취소
 * - 사용자별 루틴별 중복 좋아요 방지 (유니크 제약조건)
 * - 좋아요 생성 시간 자동 관리
 * - 루틴과 사용자 간의 다대다 관계 관리
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */
// com/hrt/health_routine_tracker/domain/Like.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * JPA 엔티티로 좋아요 테이블과 매핑
 * 
 * @param name 데이터베이스 테이블명
 * @param uniqueConstraints 사용자별 루틴별 중복 좋아요 방지를 위한 유니크 제약조건
 */
@Entity
@Table(name="likes",
    uniqueConstraints = @UniqueConstraint(name="uk_likes_routine_user", columnNames={"routine_id","user_id"})
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
public class Like {
    
    /**
     * 좋아요 고유 식별자 (Primary Key)
     * 
     * 데이터베이스에서 자동으로 증가하는 BIGINT 타입의 기본키입니다.
     * GenerationType.IDENTITY를 사용하여 데이터베이스의 AUTO_INCREMENT 기능을 활용합니다.
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="like_id")
    private Long id;

    /**
     * 좋아요가 눌린 루틴
     * 
     * Routine 엔티티와 다대일(Many-to-One) 관계를 가집니다.
     * LAZY 로딩을 사용하여 성능을 최적화합니다.
     * 외래키 제약조건이 적용되어 데이터 무결성을 보장합니다.
     * 루틴이 삭제되면 관련 좋아요도 함께 삭제됩니다 (CASCADE).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="routine_id", nullable=false, foreignKey = @ForeignKey(name="fk_likes_routine"))
    private Routine routine;

    /**
     * 좋아요를 누른 사용자
     * 
     * User 엔티티와 다대일(Many-to-One) 관계를 가집니다.
     * LAZY 로딩을 사용하여 성능을 최적화합니다.
     * 외래키 제약조건이 적용되어 데이터 무결성을 보장합니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_likes_user"))
    private User user;

    /**
     * 좋아요 생성 시간
     * 
     * 좋아요가 처음 눌린 시간을 기록합니다.
     * 한 번 설정되면 수정할 수 없습니다 (updatable=false).
     * 기본값으로 현재 시간이 자동 설정됩니다.
     * 
     * 참고: 좋아요는 수정되지 않고 삭제/생성만 되므로 updatedAt 필드는 없습니다.
     */
    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * 엔티티 저장 전 실행되는 콜백 메서드
     * 
     * 새로운 좋아요 엔티티가 데이터베이스에 저장되기 전에
     * 생성 시간을 현재 시간으로 설정합니다.
     */
    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }
}
