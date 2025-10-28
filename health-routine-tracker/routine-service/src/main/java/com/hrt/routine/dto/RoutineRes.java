package com.hrt.routine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineRes {
    private Long id;
    private Long userId;
    private LocalDate routineDate;
    private BigDecimal sleepHours;
    private String exerciseType;
    private Integer exerciseMinutes;
    private String meals;
    private Integer waterMl;
    private String note;
    private Instant createdAt;
    private Instant updatedAt;
}

