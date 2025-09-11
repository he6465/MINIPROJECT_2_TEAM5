package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.Routine;
import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.Routine.RoutineRes;         // ← dto.routine 패키지
import com.hrt.health_routine_tracker.dto.Routine.RoutineUpsertReq;   // ← dto.routine 패키지
import com.hrt.health_routine_tracker.dto.Routine.RoutineUpdateReq;
import com.hrt.health_routine_tracker.repository.CommentRepository;
import com.hrt.health_routine_tracker.repository.LikeRepository;
import com.hrt.health_routine_tracker.repository.RoutineRepository;
import com.hrt.health_routine_tracker.repository.UserRepository;
import com.hrt.health_routine_tracker.exception.BusinessException;
import com.hrt.health_routine_tracker.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import com.hrt.health_routine_tracker.dto.PageResponse;

@Service
@RequiredArgsConstructor
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    /**
     * upsert: (userId, routineDate)로 존재하면 수정, 없으면 생성
     */
    @Transactional
    public Routine upsert(RoutineUpsertReq req) {
        // user 존재 확인
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        // 날짜 파싱 (yyyy-MM-dd)
        LocalDate date = LocalDate.parse(req.getRoutineDate());

        // 기존 루틴 조회 or 신규 생성
        Routine routine = routineRepository.findByUserIdAndRoutineDate(user.getId(), date)
                .orElseGet(() -> Routine.builder()
                        .user(user)
                        .routineDate(date)
                        .build()
                );

        // 요청값으로 필드 갱신 (sleepHours는 BigDecimal)
        if (req.getSleepHours() != null) {
            routine.setSleepHours(req.getSleepHours());
        }
        routine.setExerciseType(req.getExerciseType());
        routine.setExerciseMinutes(req.getExerciseMinutes());
        routine.setMeals(req.getMeals());
        routine.setWaterMl(req.getWaterMl());
        routine.setNote(req.getNote());

        return routineRepository.save(routine);
    }

    /**
     * Controller의 create 호출과 호환용. 내부적으로 upsert를 사용함.
     */
    @Transactional
    public Routine create(RoutineUpsertReq req) {
        // user 확인
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        // 날짜 파싱
        LocalDate date = LocalDate.parse(req.getRoutineDate());

        // (userId, date) 중복 검사 → 계획서 요구사항: 409 ROUTINE_DUPLICATE
        boolean exists = routineRepository.findByUserIdAndRoutineDate(user.getId(), date).isPresent();
        if (exists) {
            java.util.Map<String, Object> details = new java.util.HashMap<>();
            details.put("date", date.toString());
            throw new BusinessException(ErrorCode.ROUTINE_DUPLICATE, ErrorCode.ROUTINE_DUPLICATE.getDefaultMessage(), details);
        }

        // 유효 exerciseType 값 검증 (업데이트와 동일 규칙 적용)
        if (req.getExerciseType() != null) {
            String type = req.getExerciseType();
            if (!("WALK".equals(type) || "RUN".equals(type) || "GYM".equals(type) || "ETC".equals(type))) {
                throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Invalid exercise type. Must be one of: WALK, RUN, GYM, ETC");
            }
        }

        // 신규 생성
        Routine routine = Routine.builder()
                .user(user)
                .routineDate(date)
                .build();

        if (req.getSleepHours() != null) routine.setSleepHours(req.getSleepHours());
        routine.setExerciseType(req.getExerciseType());
        routine.setExerciseMinutes(req.getExerciseMinutes());
        routine.setMeals(req.getMeals());
        routine.setWaterMl(req.getWaterMl());
        routine.setNote(req.getNote());

        return routineRepository.save(routine);
    }

    /**
     * 단건 조회 (id)
     */
    @Transactional(readOnly = true)
    public Routine getById(Long id) {
        return routineRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Routine not found"));
    }

    /**
     * 삭제 (id)
     */
    @Transactional
    public void delete(Long id) {
        if (!routineRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Routine not found");
        }
        routineRepository.deleteById(id);
    }

    /**
     * 목록 조회 (기간/페이지/정렬)
     * Controller 요구 시그니처에 맞춤. 기간이 없으면 기본 최근 날짜 내림차순.
     */
    @Transactional(readOnly = true)
    public PageResponse<RoutineRes> listByUser(Long userId,
                                               String from,
                                               String to,
                                               int page,
                                               int size,
                                               String sort) {
        // 기간 파싱
        LocalDate fromDate = (from != null && !from.isEmpty()) ? LocalDate.parse(from) : null;
        LocalDate toDate = (to != null && !to.isEmpty()) ? LocalDate.parse(to) : null;

        // 정렬 파싱 (e.g., "date,desc" 또는 "routineDate,desc")
        Sort springSort = Sort.by("routineDate").descending();
        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(",");
            String prop = parts.length > 0 && !parts[0].isEmpty() ? parts[0] : "routineDate";
            // alias: date → routineDate
            if ("date".equals(prop)) prop = "routineDate";
            boolean desc = parts.length > 1 && "desc".equalsIgnoreCase(parts[1]);
            springSort = desc ? Sort.by(prop).descending() : Sort.by(prop).ascending();
        }

        Page<Routine> pageResult;
        if (fromDate != null && toDate != null) {
            if (fromDate.isAfter(toDate)) {
                throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Invalid period: from is after to");
            }
            pageResult = routineRepository.findByUserIdAndRoutineDateBetween(
                    userId, fromDate, toDate, PageRequest.of(page, size, springSort)
            );
        } else {
            // 기본 메서드는 routineDate desc 고정
            pageResult = routineRepository.findAllByUserIdOrderByRoutineDateDesc(
                    userId, PageRequest.of(page, size)
            );
        }

        List<RoutineRes> content = pageResult.getContent().stream()
                .map(r -> {
                    RoutineRes res = RoutineRes.from(r);
                    long commentCount = commentRepository.countByRoutineId(r.getId());
                    long likeCount = likeRepository.countByRoutineId(r.getId());
                    // meLiked 계산: 목록 API에는 userId가 필수 파라미터
                    boolean meLiked = likeRepository.existsByRoutineIdAndUserId(r.getId(), userId);
                    res.setSummary(new RoutineRes.Summary(commentCount, likeCount, meLiked));
                    return res;
                })
                .collect(Collectors.toList());

        // 응답 page는 1-based로 반환 (계획서 규칙)
        return new PageResponse<>(
                content,
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.getNumber() + 1,
                pageResult.getSize()
        );
    }

    /**
     * 단건 조회: (userId, date) 기준
     */
    @Transactional(readOnly = true)
    public Routine getByUserAndDate(Long userId, LocalDate date) {
        return routineRepository.findByUserIdAndRoutineDate(userId, date)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Routine not found"));
    }

    /**
     * 목록 조회: userId 기준 페이지네이션 (정렬/기간은 컨트롤러 확장 분기에 맞춰 리포지토리에서 처리)
     */
    @Transactional(readOnly = true)
    public Page<Routine> listByUser(Long userId, int page, int size) {
        return routineRepository.findAllByUserIdOrderByRoutineDateDesc(userId, PageRequest.of(page, size));
    }

    /**
     * 엔티티 → 응답 DTO 변환 (컨트롤러에서 사용하므로 public)
     */
    public RoutineRes toRes(Routine r) {
        return RoutineRes.from(r);
    }

    /** 부분 수정 */
    @Transactional
    public Routine updatePartial(Long id, RoutineUpdateReq req) {
        Routine routine = routineRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Routine not found"));

        if (req.getExerciseType() != null) {
            String type = req.getExerciseType();
            if (!("WALK".equals(type) || "RUN".equals(type) || "GYM".equals(type) || "ETC".equals(type))) {
                throw new BusinessException(ErrorCode.VALIDATION_FAILED, "Invalid exercise type. Must be one of: WALK, RUN, GYM, ETC");
            }
            routine.setExerciseType(type);
        }
        if (req.getSleepHours() != null) routine.setSleepHours(req.getSleepHours());
        if (req.getExerciseMinutes() != null) routine.setExerciseMinutes(req.getExerciseMinutes());
        if (req.getMeals() != null) routine.setMeals(req.getMeals());
        if (req.getWaterMl() != null) routine.setWaterMl(req.getWaterMl());
        if (req.getNote() != null) routine.setNote(req.getNote());

        return routine; // dirty checking
    }
}

