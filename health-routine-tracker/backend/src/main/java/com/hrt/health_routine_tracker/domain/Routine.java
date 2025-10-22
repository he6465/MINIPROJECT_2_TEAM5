/**
 * 루틴 엔티티 클래스
 * 
 * Health Routine Tracker 애플리케이션의 핵심 엔티티로, 사용자의 일일 건강 루틴 정보를 관리합니다.
 * 수면, 운동, 식사, 물 섭취량 등의 건강 관련 데이터를 저장하고 관리합니다.
 * 
 * 주요 기능:
 * - 일일 건강 루틴 데이터 저장
 * - 사용자별 날짜별 유니크 제약조건 (하루에 하나의 루틴만 허용)
 * - 다양한 건강 지표 관리 (수면, 운동, 식사, 물 섭취량)
 * - 생성/수정 시간 자동 관리
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */
// com/hrt/health_routine_tracker/domain/Routine.java
package com.hrt.health_routine_tracker.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * JPA 엔티티로 루틴 테이블과 매핑
 * 
 * @param name 데이터베이스 테이블명
 * @param uniqueConstraints 사용자별 날짜별 유니크 제약조건 (하루에 하나의 루틴만 허용)
 */
@Entity
@Table(name="routines",
    uniqueConstraints = @UniqueConstraint(name="uk_routines_user_date", columnNames = {"user_id","routine_date"})
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
public class Routine {
    
    /**
     * 루틴 고유 식별자 (Primary Key)
     * 
     * 데이터베이스에서 자동으로 증가하는 BIGINT 타입의 기본키입니다.
     * GenerationType.IDENTITY를 사용하여 데이터베이스의 AUTO_INCREMENT 기능을 활용합니다.
     */
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="routine_id")
    private Long id;

    /**
     * 루틴을 소유한 사용자
     * 
     * User 엔티티와 다대일(Many-to-One) 관계를 가집니다.
     * LAZY 로딩을 사용하여 성능을 최적화합니다.
     * 외래키 제약조건이 적용되어 데이터 무결성을 보장합니다.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false, foreignKey = @ForeignKey(name="fk_routines_user"))
    private User user;

    /**
     * 루틴 날짜
     * 
     * 해당 루틴이 적용되는 날짜를 저장합니다.
     * LocalDate 타입을 사용하여 날짜만 저장합니다 (시간 정보 제외).
     * 사용자별로 동일한 날짜에 하나의 루틴만 허용됩니다.
     */
    @Column(name="routine_date", nullable=false)
    private LocalDate routineDate;

    /**
     * 수면 시간 (시간 단위)
     * 
     * 사용자가 잠을 잔 시간을 소수점 첫째 자리까지 저장합니다.
     * BigDecimal 타입을 사용하여 정확한 소수점 계산을 보장합니다.
     * precision=3, scale=1로 설정하여 최대 99.9시간까지 저장 가능합니다.
     */
    @Column(name="sleep_hours", precision = 3, scale = 1)
    private BigDecimal sleepHours;

    /**
     * 운동 종류
     * 
     * 사용자가 수행한 운동의 종류를 문자열로 저장합니다.
     * 예: "RUN", "WALK", "GYM", "ETC" 등
     * 최대 30자까지 입력 가능합니다.
     */
    @Column(name="exercise_type", length=30)
    private String exerciseType;

    /**
     * 운동 시간 (분 단위)
     * 
     * 사용자가 운동한 시간을 분 단위로 저장합니다.
     * Integer 타입을 사용하여 정수 값만 저장합니다.
     */
    @Column(name="exercise_minutes")
    private Integer exerciseMinutes;

    /**
     * 식사 내용
     * 
     * 사용자가 섭취한 식사 내용을 텍스트로 저장합니다.
     * 최대 1000자까지 입력 가능합니다.
     * JSON 형태나 쉼표로 구분된 문자열로 저장할 수 있습니다.
     */
    @Column(length=1000)
    private String meals;

    /**
     * 물 섭취량 (밀리리터 단위)
     * 
     * 사용자가 하루 동안 섭취한 물의 양을 밀리리터 단위로 저장합니다.
     * Integer 타입을 사용하여 정수 값만 저장합니다.
     */
    @Column(name="water_ml")
    private Integer waterMl;

    /**
     * 루틴 메모
     * 
     * 사용자가 작성한 루틴에 대한 추가 메모나 노트를 저장합니다.
     * TEXT 타입을 사용하여 긴 텍스트도 저장 가능합니다.
     * 길이 검증은 DTO 레벨에서 수행됩니다 (0~1000자).
     */
    @Column(columnDefinition = "TEXT")
    private String note;

    /**
     * 루틴 생성 시간
     * 
     * 루틴이 처음 생성된 시간을 기록합니다.
     * 한 번 설정되면 수정할 수 없습니다 (updatable=false).
     * 기본값으로 현재 시간이 자동 설정됩니다.
     */
    @Column(name="created_at", nullable=false, updatable=false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    /**
     * 루틴 수정 시간
     * 
     * 루틴 정보가 마지막으로 수정된 시간을 기록합니다.
     * 정보가 수정될 때마다 자동으로 현재 시간으로 업데이트됩니다.
     * 기본값으로 현재 시간이 자동 설정됩니다.
     */
    @Column(name="updated_at", nullable=false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    /**
     * 엔티티 저장 전 실행되는 콜백 메서드
     * 
     * 새로운 루틴 엔티티가 데이터베이스에 저장되기 전에
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
     * 기존 루틴 엔티티가 수정되기 전에
     * 수정 시간을 현재 시간으로 업데이트합니다.
     */
    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }
}

