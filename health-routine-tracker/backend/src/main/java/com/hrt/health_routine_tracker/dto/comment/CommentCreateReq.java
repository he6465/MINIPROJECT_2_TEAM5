package com.hrt.health_routine_tracker.dto.comment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentCreateReq {
    // URL 경로 변수에서 세팅하므로 필수 검증을 제거
    private Long routineId;

    @NotNull
    private Long userId;

    @NotBlank
    @Size(min = 1, max = 500)
    private String content;
}
