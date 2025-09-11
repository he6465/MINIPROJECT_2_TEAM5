// com/hrt/health_routine_tracker/controller/RoutineController.java
package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.domain.Routine;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.PageResponse;
import com.hrt.health_routine_tracker.dto.Routine.RoutineRes;
import com.hrt.health_routine_tracker.dto.Routine.RoutineUpsertReq;
import com.hrt.health_routine_tracker.dto.Routine.RoutineUpdateReq;
import com.hrt.health_routine_tracker.service.RoutineService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
@Tag(name = "Routines", description = "루틴 CRUD API")
@Validated
public class RoutineController {
    private final RoutineService routineService;

    /** R-01: 루틴 생성 */
    @PostMapping
    @Operation(summary = "루틴 생성", description = "중복 날짜 생성시 409/ROUTINE_DUPLICATE")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RoutineRes> create(@Valid @RequestBody RoutineUpsertReq req) {
        Routine created = routineService.create(req);
        return ApiResponse.ok(RoutineRes.from(created), "CREATED");
    }

    /** R-02: 루틴 목록 (기간/페이지) */
    @GetMapping
    @Operation(summary = "루틴 목록 조회", description = "page=1 시작, sort=date,desc 지원")
    public ApiResponse<PageResponse<RoutineRes>> list(
            @Parameter(description = "유저 ID", required = true) @RequestParam @Positive Long userId,
            @Parameter(description = "시작일(YYYY-MM-DD)") @RequestParam(required = false) @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String from,
            @Parameter(description = "종료일(YYYY-MM-DD)") @RequestParam(required = false) @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String to,
            @Parameter(description = "페이지(1부터)") @RequestParam(defaultValue = "1") @Min(1) int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "20") @Min(1) int size,
            @Parameter(description = "정렬(예: date,desc)") @RequestParam(defaultValue = "date,desc") String sort) {
        // 1-based → 0-based 변환 (계획서 page=1 기본)
        int zeroBased = Math.max(page - 1, 0);
        return ApiResponse.ok(routineService.listByUser(userId, from, to, zeroBased, size, sort));
    }

    /** R-03: 루틴 상세 조회 */
    @GetMapping("/{id}")
    @Operation(summary = "루틴 상세 조회")
    public ApiResponse<RoutineRes> getById(@PathVariable @Positive Long id) {
        Routine routine = routineService.getById(id);
        return ApiResponse.ok(RoutineRes.from(routine));
    }

    /** R-04: 루틴 수정 */
    @PatchMapping("/{id}")
    @Operation(summary = "루틴 수정(부분)")
    public ApiResponse<RoutineRes> update(@PathVariable @Positive Long id,
                                          @Valid @RequestBody RoutineUpdateReq req) {
        Routine updated = routineService.updatePartial(id, req);
        return ApiResponse.ok(RoutineRes.from(updated));
    }

    /** R-05: 루틴 삭제 */
    @DeleteMapping("/{id}")
    @Operation(summary = "루틴 삭제", description = "성공 시 204 No Content")
    public ResponseEntity<Void> delete(@PathVariable @Positive Long id) {
        routineService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** 특정 유저의 특정 날짜 루틴 조회 (기존 기능 유지) */
    @GetMapping("/by-date")
    @Operation(summary = "특정 날짜 루틴 조회")
    public ApiResponse<RoutineRes> getByUserAndDate(@RequestParam @Positive Long userId,
                                                    @RequestParam @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String date) {
        Routine r = routineService.getByUserAndDate(userId, LocalDate.parse(date));
        return ApiResponse.ok(RoutineRes.from(r));
    }
}

