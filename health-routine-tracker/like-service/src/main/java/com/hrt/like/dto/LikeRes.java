package com.hrt.like.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LikeRes {
    private Long id;
    private Long routineId;
    private Long userId;
    private Instant createdAt;
}

