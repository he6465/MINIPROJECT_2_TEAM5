package com.hrt.health_routine_tracker.dto.Like;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LikeToggleRes {
    private Long routineId;
    /** true면 ‘좋아요됨’, false면 ‘좋아요 해제됨’ */
    private boolean liked;
    /** 현재 루틴의 총 좋아요 수 */
    private long likeCount;
}
