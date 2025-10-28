package com.hrt.routine.repository;

import com.hrt.routine.domain.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long>, JpaSpecificationExecutor<Routine> {

    List<Routine> findByUserIdOrderByRoutineDateDesc(Long userId);
    
    Optional<Routine> findByUserIdAndRoutineDate(Long userId, LocalDate routineDate);
    
    List<Routine> findByRoutineDateBetween(LocalDate startDate, LocalDate endDate);
    
    boolean existsByUserIdAndRoutineDate(Long userId, LocalDate routineDate);

    // Paging variants (for new listing endpoints)
    Page<Routine> findAllByOrderByRoutineDateDesc(Pageable pageable);
    Page<Routine> findByUserIdOrderByRoutineDateDesc(Long userId, Pageable pageable);
    Page<Routine> findByUserIdAndRoutineDateBetween(Long userId, LocalDate start, LocalDate end, Pageable pageable);
    Page<Routine> findByRoutineDateBetween(LocalDate start, LocalDate end, Pageable pageable);
}

