package com.hrt.comment.service;

import com.hrt.comment.domain.Comment;
import com.hrt.comment.dto.CommentCreateReq;
import com.hrt.comment.dto.CommentRes;
import com.hrt.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    
    @Transactional
    public CommentRes createComment(Long userId, CommentCreateReq req) {
        Comment comment = Comment.builder()
                .routineId(req.getRoutineId())
                .userId(userId)
                .content(req.getContent())
                .build();
        
        comment = commentRepository.save(comment);
        log.info("Comment created: id={}, userId={}, routineId={}", comment.getId(), userId, req.getRoutineId());
        
        return toDto(comment);
    }
    
    @Transactional(readOnly = true)
    public List<CommentRes> getRoutineComments(Long routineId) {
        return commentRepository.findByRoutineIdOrderByCreatedAtDesc(routineId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentRes updateComment(Long id, Long userId, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the owner of this comment");
        }
        
        comment.setContent(content);
        comment = commentRepository.save(comment);
        log.info("Comment updated: id={}, userId={}", id, userId);
        
        return toDto(comment);
    }
    
    @Transactional
    public void deleteComment(Long id, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the owner of this comment");
        }
        
        commentRepository.delete(comment);
        log.info("Comment deleted: id={}, userId={}", id, userId);
    }
    
    private CommentRes toDto(Comment comment) {
        return CommentRes.builder()
                .id(comment.getId())
                .routineId(comment.getRoutineId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}

