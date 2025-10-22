// com/hrt/health_routine_tracker/repository/LikeRepository.java
package com.hrt.health_routine_tracker.repository;

import com.hrt.health_routine_tracker.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like,Long> {
    Optional<Like> findByRoutineIdAndUserId(Long routineId, Long userId);
    long countByRoutineId(Long routineId);
    boolean existsByRoutineIdAndUserId(Long routineId, Long userId);
    void deleteByRoutineIdIn(java.util.List<Long> routineIds);
    void deleteByUserId(Long userId);
}
