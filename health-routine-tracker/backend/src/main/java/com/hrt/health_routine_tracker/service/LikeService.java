package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.Like;
import com.hrt.health_routine_tracker.domain.Routine;
import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleReq;
import com.hrt.health_routine_tracker.dto.Like.LikeToggleRes;
import com.hrt.health_routine_tracker.repository.LikeRepository;
import com.hrt.health_routine_tracker.repository.RoutineRepository;
import com.hrt.health_routine_tracker.repository.UserRepository;
import com.hrt.health_routine_tracker.exception.BusinessException;
import com.hrt.health_routine_tracker.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;

    @Transactional
    public LikeToggleRes toggle(LikeToggleReq req) {
        Routine routine = routineRepository.findById(req.getRoutineId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Routine not found"));
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        // 이미 좋아요가 있으면 삭제(해제), 없으면 생성
        var existing = likeRepository.findByRoutineIdAndUserId(routine.getId(), user.getId());
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            liked = false;
        } else {
            Like like = new Like();
            like.setRoutine(routine);
            like.setUser(user);
            likeRepository.save(like);
            liked = true;
        }
        long count = likeRepository.countByRoutineId(routine.getId());
        return new LikeToggleRes(routine.getId(), liked, count);
    }

    @Transactional(readOnly = true)
    public long countByRoutineId(Long routineId) {
        return likeRepository.countByRoutineId(routineId);
    }

    @Transactional(readOnly = true)
    public boolean existsByRoutineIdAndUserId(Long routineId, Long userId) {
        return likeRepository.existsByRoutineIdAndUserId(routineId, userId);
    }
}

