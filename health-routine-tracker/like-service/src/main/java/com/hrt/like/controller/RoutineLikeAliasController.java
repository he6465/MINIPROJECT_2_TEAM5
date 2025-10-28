package com.hrt.like.controller;

import com.hrt.like.dto.LikeRes;
import com.hrt.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/routines")
@RequiredArgsConstructor
public class RoutineLikeAliasController {

    private final LikeService likeService;

    @PostMapping("/{routineId}/like")
    public ResponseEntity<LikeRes> toggleLike(@PathVariable Long routineId,
                                              @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long uid = userId != null ? userId : 0L;
        return ResponseEntity.ok(likeService.toggleLike(uid, routineId));
    }

    @GetMapping("/{routineId}/likes")
    public ResponseEntity<Map<String, Long>> countLikes(@PathVariable Long routineId) {
        return ResponseEntity.ok(Map.of("count", likeService.countLikes(routineId)));
    }

    @GetMapping("/{routineId}/like/me")
    public ResponseEntity<Map<String, Boolean>> checkLike(@PathVariable Long routineId,
                                                          @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        Long uid = userId != null ? userId : 0L;
        return ResponseEntity.ok(Map.of("liked", likeService.hasLiked(uid, routineId)));
    }
}

