package com.hrt.comment.controller;

import com.hrt.comment.dto.CommentCreateReq;
import com.hrt.comment.dto.CommentRes;
import com.hrt.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
public class RoutineCommentAliasController {

    private final CommentService commentService;

    @PostMapping("/{routineId}/comments")
    public ResponseEntity<CommentRes> create(@PathVariable Long routineId,
                                             @RequestHeader(value = "X-User-Id", required = false) Long userId,
                                             @RequestBody CommentCreateReq req) {
        req.setRoutineId(routineId);
        Long uid = userId != null ? userId : 0L;
        return ResponseEntity.ok(commentService.createComment(uid, req));
    }

    @GetMapping("/{routineId}/comments")
    public ResponseEntity<List<CommentRes>> list(@PathVariable Long routineId) {
        return ResponseEntity.ok(commentService.getRoutineComments(routineId));
    }
}

