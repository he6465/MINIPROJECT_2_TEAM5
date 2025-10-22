// com/hrt/health_routine_tracker/repository/RoutineRepository.java
package com.hrt.health_routine_tracker.repository;

import com.hrt.health_routine_tracker.domain.Routine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface RoutineRepository extends JpaRepository<Routine,Long> {
    Optional<Routine> findByUserIdAndRoutineDate(Long userId, LocalDate routineDate);
    
    Page<Routine> findAllByUserIdOrderByRoutineDateDesc(Long userId, Pageable pageable);
    
    // 기간별 조회를 위한 메서드 추가
    Page<Routine> findByUserIdAndRoutineDateBetween(Long userId, LocalDate from, LocalDate to, Pageable pageable);

    // 통계용: 페이징 없이 기간 전체 조회 (오름차순)
    List<Routine> findByUserIdAndRoutineDateBetweenOrderByRoutineDateAsc(Long userId, LocalDate from, LocalDate to);

    List<Routine> findByUserId(Long userId);
}
