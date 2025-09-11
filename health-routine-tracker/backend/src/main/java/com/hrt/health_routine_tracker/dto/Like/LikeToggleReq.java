package com.hrt.health_routine_tracker.dto.Like;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LikeToggleReq {
    @NotNull
    private Long routineId;
    @NotNull
    private Long userId;
}
