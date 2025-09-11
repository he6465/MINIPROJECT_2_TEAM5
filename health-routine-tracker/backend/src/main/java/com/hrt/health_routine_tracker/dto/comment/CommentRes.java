package com.hrt.health_routine_tracker.dto.comment;

import com.hrt.health_routine_tracker.domain.Comment;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class CommentRes {
    Long id;
    Long routineId;
    Long userId;
    String content;
    Instant createdAt;
    Instant updatedAt;

    public static CommentRes from(Comment c) {
        return CommentRes.builder()
                .id(c.getId())
                .routineId(c.getRoutine().getId())
                .userId(c.getUser().getId())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}

