// com/hrt/health_routine_tracker/service/CommentService.java
package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.Comment;
import com.hrt.health_routine_tracker.domain.Routine;
import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.PageResponse;
import com.hrt.health_routine_tracker.dto.comment.CommentCreateReq;
import com.hrt.health_routine_tracker.dto.comment.CommentRes;
import com.hrt.health_routine_tracker.dto.comment.CommentUpdateReq;
import com.hrt.health_routine_tracker.repository.CommentRepository;
import com.hrt.health_routine_tracker.exception.BusinessException;
import com.hrt.health_routine_tracker.exception.ErrorCode;
import com.hrt.health_routine_tracker.repository.RoutineRepository;
import com.hrt.health_routine_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final RoutineRepository routineRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentRes create(CommentCreateReq req) {
        Routine routine = routineRepository.findById(req.getRoutineId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Routine not found"));
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
        Comment c = Comment.builder()
                .routine(routine)
                .user(user)
                .content(req.getContent())
                .build();
        Comment saved = commentRepository.save(c);
        return CommentRes.from(saved);
    }

    @Transactional
    public CommentRes update(CommentUpdateReq req) {
        Comment c = commentRepository.findById(req.getCommentId())
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Comment not found"));
        if (!c.getUser().getId().equals(req.getUserId()))
            throw new BusinessException(ErrorCode.FORBIDDEN, "not owner");
        c.setContent(req.getContent());
        return CommentRes.from(c); // @Transactional + dirty checking
    }

    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "Comment not found"));
        if (!c.getUser().getId().equals(userId))
            throw new BusinessException(ErrorCode.FORBIDDEN, "not owner");
        commentRepository.delete(c);
    }

    public PageResponse<CommentRes> listByRoutine(Long routineId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Comment> p = commentRepository.findByRoutineId(routineId, pageable);
        var content = p.getContent().stream()
                .map(CommentRes::from)
                .toList();
        return new PageResponse<>(content, p.getTotalElements(), p.getTotalPages(), p.getNumber(), p.getSize());
    }

    public long countByRoutine(Long routineId) {
        return commentRepository.countByRoutineId(routineId);
    }
}
