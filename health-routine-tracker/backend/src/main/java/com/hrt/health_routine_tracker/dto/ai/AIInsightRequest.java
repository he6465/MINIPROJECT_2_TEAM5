package com.hrt.health_routine_tracker.dto.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AIInsightRequest {
    @Min(0) @Max(16)
    private double avgSleep;

    @Min(0) @Max(7)
    private int exerciseDays;

    @Min(0) @Max(10000)
    private int avgWater;

    private String exerciseType;
}


