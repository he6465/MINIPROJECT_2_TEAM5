package com.hrt.routine.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RoutineCreateReq {
    private LocalDate routineDate;
    private BigDecimal sleepHours;
    private String exerciseType;
    private Integer exerciseMinutes;
    private String meals;
    private Integer waterMl;
    private String note;
}

