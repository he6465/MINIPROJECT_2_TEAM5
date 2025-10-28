package com.hrt.like.controller;

import com.hrt.like.dto.LikeRes;
import com.hrt.like.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Likes", description = "좋아요 API")
@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {
    
    private final LikeService likeService;
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "like-service");
    }
    
    @PostMapping("/routine/{routineId}")
    @Operation(summary = "좋아요 토글", description = "X-User-Id 헤더로 식별된 사용자의 좋아요 토글")
    public ResponseEntity<LikeRes> toggleLike(
            @PathVariable Long routineId,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId) {
        LikeRes result = likeService.toggleLike(userId, routineId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/routine/{routineId}/count")
    public ResponseEntity<Map<String, Long>> countLikes(@PathVariable Long routineId) {
        return ResponseEntity.ok(Map.of("count", likeService.countLikes(routineId)));
    }
    
    @GetMapping("/routine/{routineId}/check")
    @Operation(summary = "내가 좋아요 눌렀는지 확인")
    public ResponseEntity<Map<String, Boolean>> checkLike(
            @PathVariable Long routineId,
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(Map.of("liked", likeService.hasLiked(userId, routineId)));
    }
}

