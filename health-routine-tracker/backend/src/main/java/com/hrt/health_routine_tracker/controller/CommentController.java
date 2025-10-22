package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.comment.*;
import com.hrt.health_routine_tracker.service.CommentService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments (legacy)", description = "댓글 개별 API")
@Validated
public class CommentController {

    private final CommentService commentService;

    /** C-03: 댓글 수정 */
    @PatchMapping("/{id}")
    @Operation(summary = "댓글 수정")
    public ApiResponse<CommentRes> update(@PathVariable @Positive Long id,
                                          @RequestBody @Valid CommentUpdateReq req) {
        // id를 req에 설정
        req.setCommentId(id);
        return ApiResponse.ok(commentService.update(req));
    }

    /** C-04: 댓글 삭제 */
    @DeleteMapping("/{id}")
    @Operation(summary = "댓글 삭제", description = "성공 시 204 No Content")
    public org.springframework.http.ResponseEntity<Void> delete(@PathVariable @Positive Long id,
                                    @RequestParam @Positive Long userId) {
        commentService.delete(id, userId);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
