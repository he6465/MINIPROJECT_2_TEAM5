package com.hrt.stats.controller;

import com.hrt.stats.dto.MonthlyCalendarRes;
import com.hrt.stats.dto.StatsRes;
import com.hrt.stats.dto.WeeklyStatsRes;
import com.hrt.stats.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Stats", description = "통계/달력 API")
@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatsController {
    
    private final StatsService statsService;
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "stats-service");
    }
    
    @GetMapping("/global")
    @Operation(summary = "전체 통계")
    public ResponseEntity<StatsRes> getGlobalStats() {
        return ResponseEntity.ok(statsService.getGlobalStats());
    }
    
    @GetMapping("/user")
    @Operation(summary = "내 통계 조회")
    public ResponseEntity<StatsRes> getUserStats(
            @Parameter(name = "X-User-Id", description = "호출자 사용자 ID", required = true)
            @RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(statsService.getUserStats(userId));
    }
    
    @GetMapping("/weekly")
    @Operation(summary = "주간 통계", description = "userId와 startDate(YYYY-MM-DD)로 주간 통계 조회")
    public ResponseEntity<Map<String, Object>> getWeeklyStats(
            @Parameter(description = "대상 사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "시작 날짜(YYYY-MM-DD)", required = true) @RequestParam String startDate) {
        WeeklyStatsRes stats = statsService.getWeeklyStats(userId, startDate);
        return ResponseEntity.ok(Map.of("success", true, "data", stats));
    }
    
    @GetMapping("/monthly")
    @Operation(summary = "월간 달력", description = "userId와 month(YYYY-MM)로 월간 달력 조회")
    public ResponseEntity<Map<String, Object>> getMonthlyCalendar(
            @Parameter(description = "대상 사용자 ID", required = true) @RequestParam Long userId,
            @Parameter(description = "월(YYYY-MM)", required = true) @RequestParam String month) {
        MonthlyCalendarRes calendar = statsService.getMonthlyCalendar(userId, month);
        return ResponseEntity.ok(Map.of("success", true, "data", calendar));
    }
}

