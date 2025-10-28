package com.hrt.routine.service;

import com.hrt.routine.domain.Routine;
import com.hrt.routine.dto.RoutineCreateReq;
import com.hrt.routine.dto.RoutineRes;
import com.hrt.routine.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoutineService {
    
    private final RoutineRepository routineRepository;
    
    @Transactional
    public RoutineRes createRoutine(Long userId, RoutineCreateReq req) {
        // 중복 체크
        if (routineRepository.existsByUserIdAndRoutineDate(userId, req.getRoutineDate())) {
            throw new RuntimeException("Routine already exists for this date");
        }
        
        Routine routine = Routine.builder()
                .userId(userId)
                .routineDate(req.getRoutineDate())
                .sleepHours(req.getSleepHours())
                .exerciseType(req.getExerciseType())
                .exerciseMinutes(req.getExerciseMinutes())
                .meals(req.getMeals())
                .waterMl(req.getWaterMl())
                .note(req.getNote())
                .build();
        
        routine = routineRepository.save(routine);
        log.info("Routine created: id={}, userId={}, date={}", routine.getId(), userId, req.getRoutineDate());
        
        return toDto(routine);
    }
    
    @Transactional(readOnly = true)
    public List<RoutineRes> getUserRoutines(Long userId) {
        return routineRepository.findByUserIdOrderByRoutineDateDesc(userId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<Routine> listPage(Long userId, String from, String to, String exerciseType, int page, int size, String sort) {
        int zero = Math.max(0, page - 1);
        String prop = "routineDate";
        boolean desc = true;
        if (sort != null && !sort.isBlank()) {
            String[] parts = sort.split(",");
            if (parts.length > 0 && !parts[0].isBlank()) {
                prop = parts[0].equals("date") ? "routineDate" : parts[0];
            }
            if (parts.length > 1) {
                desc = parts[1].equalsIgnoreCase("desc");
            }
        }
        Pageable pageable = PageRequest.of(zero, size, desc ? Sort.by(prop).descending() : Sort.by(prop).ascending());

        LocalDate fromDate = null;
        LocalDate toDate = null;
        try {
            if (from != null && !from.isBlank()) fromDate = LocalDate.parse(from);
            if (to != null && !to.isBlank()) toDate = LocalDate.parse(to);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("Invalid period: from is after to");
        }

        Specification<com.hrt.routine.domain.Routine> spec = Specification.where(null);
        if (userId != null) {
            Long uid = userId;
            spec = spec.and((root, q, cb) -> cb.equal(root.get("userId"), uid));
        }
        if (exerciseType != null && !exerciseType.isBlank()) {
            String type = exerciseType;
            spec = spec.and((root, q, cb) -> cb.equal(root.get("exerciseType"), type));
        }
        if (fromDate != null) {
            LocalDate fd = fromDate;
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("routineDate"), fd));
        }
        if (toDate != null) {
            LocalDate td = toDate;
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("routineDate"), td));
        }

        return routineRepository.findAll(spec, pageable);
    }
    
    @Transactional(readOnly = true)
    public RoutineRes getRoutineById(Long id) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Routine not found"));
        return toDto(routine);
    }
    
    @Transactional
    public RoutineRes updateRoutine(Long id, Long userId, RoutineCreateReq req) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Routine not found"));
        
        if (!routine.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        routine.setRoutineDate(req.getRoutineDate());
        routine.setSleepHours(req.getSleepHours());
        routine.setExerciseType(req.getExerciseType());
        routine.setExerciseMinutes(req.getExerciseMinutes());
        routine.setMeals(req.getMeals());
        routine.setWaterMl(req.getWaterMl());
        routine.setNote(req.getNote());
        
        routine = routineRepository.save(routine);
        log.info("Routine updated: id={}, userId={}", id, userId);
        
        return toDto(routine);
    }
    
    @Transactional
    public void deleteRoutine(Long id, Long userId) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Routine not found"));
        
        if (!routine.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        routineRepository.delete(routine);
        log.info("Routine deleted: id={}, userId={}", id, userId);
    }
    
    private RoutineRes toDto(Routine routine) {
        return RoutineRes.builder()
                .id(routine.getId())
                .userId(routine.getUserId())
                .routineDate(routine.getRoutineDate())
                .sleepHours(routine.getSleepHours())
                .exerciseType(routine.getExerciseType())
                .exerciseMinutes(routine.getExerciseMinutes())
                .meals(routine.getMeals())
                .waterMl(routine.getWaterMl())
                .note(routine.getNote())
                .createdAt(routine.getCreatedAt())
                .updatedAt(routine.getUpdatedAt())
                .build();
    }
}

