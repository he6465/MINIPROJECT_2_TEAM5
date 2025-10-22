// com/hrt/health_routine_tracker/repository/CommentRepository.java
package com.hrt.health_routine_tracker.repository;

import com.hrt.health_routine_tracker.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    Page<Comment> findByRoutineId(Long routineId, Pageable pageable);
    long countByRoutineId(Long routineId);
    void deleteByRoutineIdIn(java.util.List<Long> routineIds);
    void deleteByUserId(Long userId);
}
