// com/hrt/health_routine_tracker/dto/comment/CommentUpdateReq.java
package com.hrt.health_routine_tracker.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentUpdateReq {
    // PathVariable로 전달되므로 본문에서는 필수가 아님
    private Long commentId;
    @NotNull
    private Long userId;
    @NotBlank
    @Size(min=1, max=500)
    private String content;
}
