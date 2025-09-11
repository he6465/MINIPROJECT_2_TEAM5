// com/hrt/health_routine_tracker/dto/Routine/RoutineUpdateReq.java
package com.hrt.health_routine_tracker.dto.Routine;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 루틴 부분 수정용 요청 DTO.
 * - 모든 필드는 선택 사항(null 허용)이며, 제공된 필드만 업데이트됩니다.
 */
@Data
public class RoutineUpdateReq {
    @DecimalMin(value="0.0", inclusive = true) @DecimalMax(value="16.0", inclusive = true)
    @Digits(integer=2, fraction=1)
    private BigDecimal sleepHours;

    @Size(max=30)
    private String exerciseType; // WALK/RUN/GYM/ETC (서비스 레이어에서 유효값 검증)

    @Min(0) @Max(600)
    private Integer exerciseMinutes;

    @Size(max=1000)
    private String meals;

    @Min(0) @Max(10000)
    private Integer waterMl;

    private String note;
}


