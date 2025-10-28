package com.hrt.comment.repository;

import com.hrt.comment.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByRoutineIdOrderByCreatedAtDesc(Long routineId);
    
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    long countByRoutineId(Long routineId);
}

