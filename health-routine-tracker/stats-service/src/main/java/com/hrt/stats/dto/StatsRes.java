package com.hrt.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsRes {
    private Long totalRoutines;
    private Long totalComments;
    private Long totalLikes;
    private String message;
}

