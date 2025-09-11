// com/hrt/health_routine_tracker/dto/Routine/RoutineUpsertReq.java
package com.hrt.health_routine_tracker.dto.Routine;

import jakarta.validation.constraints.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;

import java.math.BigDecimal;

/**
 * 루틴 업서트 요청.
 * - sleepHours: BigDecimal(소수 1자리, 0.0 ~ 16.0)
 * - routineDate: yyyy-MM-dd
 */
@Data
public class RoutineUpsertReq {
    @NotNull
    private Long userId;

    @NotBlank
    @JsonAlias("date")
    private String routineDate;

    @DecimalMin(value="0.0") @DecimalMax(value="16.0")
    @Digits(integer=2, fraction=1)
    private BigDecimal sleepHours;

    @Size(max=30)
    private String exerciseType;

    @Min(0) @Max(600)
    private Integer exerciseMinutes;

    @Size(max=1000)
    private String meals;

    @Min(0) @Max(10000)
    private Integer waterMl;

    @Size(max=1000)
    private String note;
}
