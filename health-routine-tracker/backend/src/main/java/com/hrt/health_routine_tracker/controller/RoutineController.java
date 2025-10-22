/**
 * 루틴 컨트롤러 클래스
 * 
 * Health Routine Tracker 애플리케이션의 루틴 관련 REST API 엔드포인트를 제공하는 컨트롤러입니다.
 * 루틴의 생성, 조회, 수정, 삭제 기능과 관련된 HTTP 요청을 처리합니다.
 * 
 * 주요 기능:
 * - 루틴 생성 (POST /routines)
 * - 루틴 업서트 (POST /routines/upsert) - 있으면 수정, 없으면 생성
 * - 루틴 목록 조회 (GET /routines) - 페이지네이션, 정렬, 기간 필터링 지원
 * - 루틴 상세 조회 (GET /routines/{id})
 * - 루틴 수정 (PATCH /routines/{id})
 * - 루틴 삭제 (DELETE /routines/{id})
 * - 특정 날짜 루틴 조회 (GET /routines/by-date)
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.hrt.health_routine_tracker.config.JwtUserPrincipal;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

/**
 * REST 컨트롤러로 루틴 관련 API 엔드포인트 제공
 * 
 * @param RequestMapping("/routines") 기본 경로를 /routines로 설정
 * @param RequiredArgsConstructor final 필드들에 대한 생성자를 자동 생성
 * @param Tag Swagger 문서화를 위한 태그 설정
 * @param Validated 메서드 레벨 유효성 검증 활성화
 */
@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
@Tag(name = "Routines", description = "루틴 CRUD API")
@Validated
public class RoutineController {
    
    /** 루틴 비즈니스 로직을 처리하는 서비스 */
    private final RoutineService routineService;

    /**
     * 루틴 생성 API
     * 
     * 새로운 루틴을 생성합니다. 동일한 사용자의 동일한 날짜에 루틴이 이미 존재하는 경우
     * 409 Conflict 에러를 반환합니다.
     * 
     * @param req 루틴 생성 요청 DTO (사용자 ID, 날짜, 루틴 정보 포함)
     * @return 생성된 루틴 정보를 담은 API 응답
     * @throws BusinessException 중복 날짜 루틴이 존재하는 경우 (409 ROUTINE_DUPLICATE)
     */
    @PostMapping
    @Operation(summary = "루틴 생성", description = "중복 날짜 생성시 409/ROUTINE_DUPLICATE")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RoutineRes> create(@Valid @RequestBody RoutineUpsertReq req) {
        Routine created = routineService.create(req);
        return ApiResponse.ok(RoutineRes.from(created), "CREATED");
    }

    /** R-01b: 루틴 업서트(있으면 수정, 없으면 생성) */
    @PostMapping("/upsert")
    @Operation(summary = "루틴 업서트", description = "(userId, date) 존재 시 갱신, 없으면 생성")
    public ApiResponse<RoutineRes> upsert(@AuthenticationPrincipal JwtUserPrincipal principal,
                                          @Valid @RequestBody RoutineUpsertReq req) {
        // 인증 사용자의 userId를 강제 주입하여 바디와 불일치로 인한 오류 방지
        req.setUserId(principal.userId());
        Routine saved = routineService.upsert(req);
        return ApiResponse.ok(RoutineRes.from(saved), "UPSERTED");
    }

    /** R-02: 루틴 목록 (기간/페이지) */
    @GetMapping
    @Operation(summary = "루틴 목록 조회", description = "page=1 시작, sort=date,desc 지원")
    public ApiResponse<PageResponse<RoutineRes>> list(
            @Parameter(description = "유저 ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "시작일(YYYY-MM-DD)") @RequestParam(required = false) @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String from,
            @Parameter(description = "종료일(YYYY-MM-DD)") @RequestParam(required = false) @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String to,
            @Parameter(description = "페이지(1부터)") @RequestParam(defaultValue = "1") @Min(1) int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "20") @Min(1) int size,
            @Parameter(description = "정렬(예: date,desc)") @RequestParam(defaultValue = "date,desc") String sort) {
        // 공개 모드: userId 없으면 전체 목록 반환
        int zeroBased = Math.max(page - 1, 0);
        if (userId == null) {
            return ApiResponse.ok(routineService.listPublic(zeroBased, size, sort));
        }
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
    public ApiResponse<RoutineRes> update(@AuthenticationPrincipal JwtUserPrincipal principal,
                                          @PathVariable @Positive Long id,
                                          @Valid @RequestBody RoutineUpdateReq req) {
        Routine updated = routineService.updatePartial(id, req, principal.userId());
        return ApiResponse.ok(RoutineRes.from(updated));
    }

    /** R-05: 루틴 삭제 */
    @DeleteMapping("/{id}")
    @Operation(summary = "루틴 삭제", description = "성공 시 204 No Content")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal JwtUserPrincipal principal,
                                       @PathVariable @Positive Long id) {
        routineService.deleteOwned(id, principal.userId());
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

