package com.hrt.like.repository;

import com.hrt.like.domain.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    Optional<Like> findByRoutineIdAndUserId(Long routineId, Long userId);
    
    List<Like> findByRoutineId(Long routineId);
    
    List<Like> findByUserId(Long userId);
    
    long countByRoutineId(Long routineId);
    
    boolean existsByRoutineIdAndUserId(Long routineId, Long userId);
    
    void deleteByRoutineIdAndUserId(Long routineId, Long userId);
}

