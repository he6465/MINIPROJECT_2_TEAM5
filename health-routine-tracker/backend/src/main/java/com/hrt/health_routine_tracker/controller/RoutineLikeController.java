package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleReq;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleRes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import com.hrt.health_routine_tracker.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
@Tag(name = "Routine Likes", description = "루틴 좋아요 API")
@Validated
public class RoutineLikeController {

    private final LikeService likeService;

    /** L-01: 좋아요 토글 */
    @PostMapping("/{routineId}/like")
    @Operation(summary = "좋아요 토글")
    public ApiResponse<LikeToggleRes> toggle(@PathVariable @Positive Long routineId,
                                             @RequestParam @Positive Long userId) {
        LikeToggleReq req = new LikeToggleReq();
        req.setRoutineId(routineId);
        req.setUserId(userId);
        return ApiResponse.ok(likeService.toggle(req));
    }

    /** L-02: 좋아요 개수 조회 */
    @GetMapping("/{routineId}/likes")
    @Operation(summary = "좋아요 개수 조회")
    public ApiResponse<Long> getLikeCount(@PathVariable @Positive Long routineId) {
        return ApiResponse.ok(likeService.countByRoutineId(routineId));
    }

    /** 내가 해당 루틴을 좋아요 눌렀는지 여부 */
    @GetMapping("/{routineId}/like/me")
    @Operation(summary = "내가 좋아요 눌렀는지 여부")
    public ApiResponse<Boolean> isLikedByMe(@PathVariable @Positive Long routineId,
                                            @RequestParam @Positive Long userId) {
        return ApiResponse.ok(likeService.existsByRoutineIdAndUserId(routineId, userId));
    }
}
