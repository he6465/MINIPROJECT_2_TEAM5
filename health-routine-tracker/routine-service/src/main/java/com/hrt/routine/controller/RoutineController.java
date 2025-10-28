package com.hrt.routine.controller;

import com.hrt.routine.dto.RoutineCreateReq;
import com.hrt.routine.dto.RoutineRes;
import com.hrt.routine.service.RoutineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Routines", description = "루틴 CRUD API")
@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
public class RoutineController {

    private final RoutineService routineService;

    @GetMapping("/health")
    @Operation(summary = "헬스체크")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "routine-service");
    }

    @PostMapping
    @Operation(summary = "루틴 생성")
    public ResponseEntity<Map<String, Object>> createRoutine(
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody RoutineCreateReq req) {
        RoutineRes routine = routineService.createRoutine(userId, req);
        return ResponseEntity.ok(Map.of("success", true, "data", routine));
    }

    @GetMapping
    @Operation(summary = "루틴 목록 조회")
    public ResponseEntity<Map<String, Object>> getUserRoutines(
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID(옵션)")
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String type,
            @RequestParam(required = false, name = "userId") Long queryUserId) {
        Long effectiveUserId = (queryUserId != null) ? queryUserId : headerUserId;
        var p = routineService.listPage(effectiveUserId, from, to, type, page, size, sort);
        var content = p.getContent().stream().map(r -> RoutineRes.builder()
                .id(r.getId())
                .userId(r.getUserId())
                .routineDate(r.getRoutineDate())
                .sleepHours(r.getSleepHours())
                .exerciseType(r.getExerciseType())
                .exerciseMinutes(r.getExerciseMinutes())
                .meals(r.getMeals())
                .waterMl(r.getWaterMl())
                .note(r.getNote())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build()).toList();
        Map<String, Object> pageObj = Map.of(
                "content", content,
                "totalElements", p.getTotalElements(),
                "totalPages", p.getTotalPages(),
                "page", p.getNumber() + 1,
                "size", p.getSize()
        );
        return ResponseEntity.ok(Map.of("success", true, "data", pageObj));
    }

    @GetMapping("/public")
    @Operation(summary = "공개 루틴 목록 조회")
    public ResponseEntity<Map<String, Object>> getPublicRoutines(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String type) {
        var p = routineService.listPage(null, from, to, type, page, size, sort);
        var content = p.getContent().stream().map(r -> RoutineRes.builder()
                .id(r.getId())
                .userId(r.getUserId())
                .routineDate(r.getRoutineDate())
                .sleepHours(r.getSleepHours())
                .exerciseType(r.getExerciseType())
                .exerciseMinutes(r.getExerciseMinutes())
                .meals(r.getMeals())
                .waterMl(r.getWaterMl())
                .note(r.getNote())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build()).toList();
        Map<String, Object> pageObj = Map.of(
                "content", content,
                "totalElements", p.getTotalElements(),
                "totalPages", p.getTotalPages(),
                "page", p.getNumber() + 1,
                "size", p.getSize()
        );
        return ResponseEntity.ok(Map.of("success", true, "data", pageObj));
    }

    @GetMapping("/{id}")
    @Operation(summary = "루틴 상세 조회")
    public ResponseEntity<Map<String, Object>> getRoutine(@PathVariable Long id) {
        RoutineRes routine = routineService.getRoutineById(id);
        return ResponseEntity.ok(Map.of("success", true, "data", routine));
    }

    @PutMapping("/{id}")
    @Operation(summary = "루틴 수정")
    public ResponseEntity<Map<String, Object>> updateRoutine(
            @PathVariable Long id,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody RoutineCreateReq req) {
        RoutineRes routine = routineService.updateRoutine(id, userId, req);
        return ResponseEntity.ok(Map.of("success", true, "data", routine));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "루틴 삭제")
    public ResponseEntity<Map<String, Object>> deleteRoutine(
            @PathVariable Long id,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId) {
        routineService.deleteRoutine(id, userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Routine deleted"));
    }
}

