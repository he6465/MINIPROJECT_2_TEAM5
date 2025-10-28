package com.hrt.like.service;

import com.hrt.like.domain.Like;
import com.hrt.like.dto.LikeRes;
import com.hrt.like.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {
    
    private final LikeRepository likeRepository;
    
    @Transactional
    public LikeRes toggleLike(Long userId, Long routineId) {
        // 이미 좋아요가 있으면 삭제
        if (likeRepository.existsByRoutineIdAndUserId(routineId, userId)) {
            likeRepository.deleteByRoutineIdAndUserId(routineId, userId);
            log.info("Like removed: userId={}, routineId={}", userId, routineId);
            return null;
        }
        
        // 없으면 생성
        Like like = Like.builder()
                .routineId(routineId)
                .userId(userId)
                .build();
        
        like = likeRepository.save(like);
        log.info("Like created: id={}, userId={}, routineId={}", like.getId(), userId, routineId);
        
        return toDto(like);
    }
    
    @Transactional(readOnly = true)
    public long countLikes(Long routineId) {
        return likeRepository.countByRoutineId(routineId);
    }
    
    @Transactional(readOnly = true)
    public boolean hasLiked(Long userId, Long routineId) {
        return likeRepository.existsByRoutineIdAndUserId(routineId, userId);
    }
    
    private LikeRes toDto(Like like) {
        return LikeRes.builder()
                .id(like.getId())
                .routineId(like.getRoutineId())
                .userId(like.getUserId())
                .createdAt(like.getCreatedAt())
                .build();
    }
}

