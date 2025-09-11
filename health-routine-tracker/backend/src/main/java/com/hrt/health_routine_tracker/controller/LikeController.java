package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleReq;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleRes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.hrt.health_routine_tracker.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Legacy 좋아요 API
 * @deprecated 계획서 명세에 따라 RoutineLikeController 사용 권장
 */
@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
@Deprecated
@Tag(name = "Likes (legacy)", description = "레거시 좋아요 API")
public class LikeController {

    private final LikeService likeService;

    /** 좋아요 토글 */
    @PostMapping("/toggle")
    @Operation(summary = "좋아요 토글")
    public ApiResponse<LikeToggleRes> toggle(@RequestBody LikeToggleReq req) {
        return ApiResponse.ok(likeService.toggle(req));
    }

    /** 특정 루틴의 좋아요 개수 */
    @GetMapping("/count")
    @Operation(summary = "좋아요 개수 조회")
    public ApiResponse<Long> count(@RequestParam Long routineId) {
        return ApiResponse.ok(likeService.countByRoutineId(routineId));
    }

    /** 내가 해당 루틴을 좋아요 눌렀는지 여부 */
    @GetMapping("/me")
    @Operation(summary = "내가 좋아요 눌렀는지 여부")
    public ApiResponse<Boolean> me(@RequestParam Long routineId,
                                   @RequestParam Long userId) {
        return ApiResponse.ok(likeService.existsByRoutineIdAndUserId(routineId, userId));
    }
}

