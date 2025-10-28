package com.hrt.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentRes {
    private Long id;
    private Long routineId;
    private Long userId;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}

