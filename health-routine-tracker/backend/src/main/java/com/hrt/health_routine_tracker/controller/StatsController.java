package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.stats.MonthlyCalendarRes;
import com.hrt.health_routine_tracker.dto.stats.WeeklyStatsRes;
import com.hrt.health_routine_tracker.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@Tag(name = "Stats", description = "주간/월간 통계 API")
@Validated
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/weekly")
    @Operation(summary = "주간 통계 조회", description = "startDate(YYYY-MM-DD) 기준 7일간 통계")
    public ApiResponse<WeeklyStatsRes> weekly(
            @Parameter(description = "유저 ID", required = true) @RequestParam @Positive Long userId,
            @Parameter(description = "주 시작일 (YYYY-MM-DD)", required = true) @RequestParam @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String startDate) {
        return ApiResponse.ok(statsService.getWeekly(userId, startDate));
    }

    @GetMapping("/monthly")
    @Operation(summary = "월간 달력 통계 조회", description = "month(YYYY-MM) 기준 달력 응답")
    public ApiResponse<MonthlyCalendarRes> monthly(
            @Parameter(description = "유저 ID", required = true) @RequestParam @Positive Long userId,
            @Parameter(description = "대상 월 (YYYY-MM)", required = true) @RequestParam @Pattern(regexp = "\\d{4}-\\d{2}") String month) {
        return ApiResponse.ok(statsService.getMonthly(userId, month));
    }
}


