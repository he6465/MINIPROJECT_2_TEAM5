// com/hrt/health_routine_tracker/dto/Routine/RoutineRes.java
package com.hrt.health_routine_tracker.dto.Routine;

import com.hrt.health_routine_tracker.domain.Routine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoutineRes {
    private Long id;
    private Long userId;
    @JsonProperty("date")
    private LocalDate routineDate;
    private BigDecimal sleepHours;
    private String exerciseType;
    private Integer exerciseMinutes;
    private String meals;
    private Integer waterMl;
    private String note;
    private Instant createdAt;
    private Instant updatedAt;

    /** 목록 응답용 요약 정보 */
    private Summary summary;

    public static RoutineRes from(Routine routine) {
        return new RoutineRes(
                routine.getId(),
                routine.getUser().getId(),
                routine.getRoutineDate(),
                routine.getSleepHours(),
                routine.getExerciseType(),
                routine.getExerciseMinutes(),
                routine.getMeals(),
                routine.getWaterMl(),
                routine.getNote(),
                routine.getCreatedAt(),
                routine.getUpdatedAt(),
                null
        );
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Summary {
        private long commentCount;
        private long likeCount;
        private boolean meLiked;
    }
}

