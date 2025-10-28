package com.hrt.comment.controller;

import com.hrt.comment.dto.CommentCreateReq;
import com.hrt.comment.dto.CommentRes;
import com.hrt.comment.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Comments", description = "댓글 API")
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "comment-service");
    }
    
    @PostMapping
    @Operation(summary = "댓글 작성", description = "X-User-Id 헤더로 호출자 식별 후 댓글 생성")
    public ResponseEntity<CommentRes> createComment(
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody CommentCreateReq req) {
        return ResponseEntity.ok(commentService.createComment(userId, req));
    }
    
    @GetMapping("/routine/{routineId}")
    public ResponseEntity<List<CommentRes>> getRoutineComments(@PathVariable Long routineId) {
        return ResponseEntity.ok(commentService.getRoutineComments(routineId));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "댓글 수정", description = "X-User-Id가 댓글 소유자와 일치해야 수정")
    public ResponseEntity<CommentRes> updateComment(
            @PathVariable Long id,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(commentService.updateComment(id, userId, body.get("content")));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "댓글 삭제", description = "X-User-Id가 댓글 소유자와 일치해야 삭제")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId) {
        commentService.deleteComment(id, userId);
        return ResponseEntity.noContent().build();
    }
}

