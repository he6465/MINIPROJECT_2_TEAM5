package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import com.hrt.health_routine_tracker.dto.comment.*;
import com.hrt.health_routine_tracker.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
@Tag(name = "Routine Comments", description = "루틴 댓글 API")
@Validated
public class RoutineCommentController {

    private final CommentService commentService;

    /** C-01: 댓글 작성 */
    @PostMapping("/{routineId}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "댓글 작성")
    public ApiResponse<CommentRes> create(@PathVariable @Positive Long routineId,
                                          @RequestBody @Valid CommentCreateReq req) {
        // routineId를 req에 설정
        req.setRoutineId(routineId);
        return ApiResponse.ok(commentService.create(req), "CREATED");
    }

    /** C-02: 댓글 목록 */
    @GetMapping("/{routineId}/comments")
    @Operation(summary = "댓글 목록 조회")
    public ApiResponse<PageResponse<CommentRes>> list(@PathVariable @Positive Long routineId,
                                                      @RequestParam(defaultValue = "0") @Min(0) int page,
                                                      @RequestParam(defaultValue = "10") @Min(1) int size) {
        return ApiResponse.ok(commentService.listByRoutine(routineId, page, size));
    }
}
