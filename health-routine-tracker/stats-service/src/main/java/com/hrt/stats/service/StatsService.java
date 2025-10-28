package com.hrt.stats.service;

import com.hrt.stats.dto.MonthlyCalendarRes;
import com.hrt.stats.dto.StatsRes;
import com.hrt.stats.dto.WeeklyStatsRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatsService {
    
    private final JdbcTemplate jdbcTemplate;
    
    public StatsRes getGlobalStats() {
        Long totalRoutines = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM routines", Long.class);
        Long totalComments = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM comments", Long.class);
        Long totalLikes = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM likes", Long.class);
        
        return StatsRes.builder()
                .totalRoutines(totalRoutines != null ? totalRoutines : 0L)
                .totalComments(totalComments != null ? totalComments : 0L)
                .totalLikes(totalLikes != null ? totalLikes : 0L)
                .message("Global statistics")
                .build();
    }
    
    public StatsRes getUserStats(Long userId) {
        Long totalRoutines = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM routines WHERE user_id = ?", Long.class, userId);
        Long totalComments = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM comments WHERE user_id = ?", Long.class, userId);
        Long totalLikes = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM likes WHERE user_id = ?", Long.class, userId);
        
        return StatsRes.builder()
                .totalRoutines(totalRoutines != null ? totalRoutines : 0L)
                .totalComments(totalComments != null ? totalComments : 0L)
                .totalLikes(totalLikes != null ? totalLikes : 0L)
                .message("User statistics for userId=" + userId)
                .build();
    }
    
    public WeeklyStatsRes getWeeklyStats(Long userId, String startDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = start.plusDays(6);
        
        String sql = "SELECT routine_date, sleep_hours, water_ml, exercise_type, exercise_minutes " +
                     "FROM routines WHERE user_id = ? AND routine_date BETWEEN ? AND ? ORDER BY routine_date";
        
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId, start, end);
        
        // Summary 계산
        double sleepSum = 0;
        int waterSum = 0;
        int exerciseCount = 0;
        
        for (Map<String, Object> row : rows) {
            BigDecimal sleepHours = (BigDecimal) row.get("sleep_hours");
            if (sleepHours != null) {
                sleepSum += sleepHours.doubleValue();
            }
            Integer waterMl = (Integer) row.get("water_ml");
            if (waterMl != null) {
                waterSum += waterMl;
            }
            if (row.get("exercise_type") != null || row.get("exercise_minutes") != null) {
                exerciseCount++;
            }
        }
        
        double sleepAvg = rows.isEmpty() ? 0 : sleepSum / rows.size();
        
        // ByDay 데이터 생성
        List<WeeklyStatsRes.DayData> byDay = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            Map<String, Object> row = rows.stream()
                    .filter(r -> r.get("routine_date").toString().equals(currentDate.toString()))
                    .findFirst()
                    .orElse(null);
            
            if (row != null) {
                BigDecimal sleepHours = (BigDecimal) row.get("sleep_hours");
                byDay.add(WeeklyStatsRes.DayData.builder()
                        .date(currentDate.toString())
                        .sleep(sleepHours != null ? sleepHours.doubleValue() : null)
                        .water((Integer) row.get("water_ml"))
                        .exerciseType((String) row.get("exercise_type"))
                        .exerciseMinutes((Integer) row.get("exercise_minutes"))
                        .exercise(row.get("exercise_type") != null || row.get("exercise_minutes") != null)
                        .build());
            } else {
                byDay.add(WeeklyStatsRes.DayData.builder()
                        .date(currentDate.toString())
                        .sleep(null)
                        .water(null)
                        .exerciseType(null)
                        .exerciseMinutes(null)
                        .exercise(false)
                        .build());
            }
        }
        
        return WeeklyStatsRes.builder()
                .range(List.of(start.toString(), end.toString()))
                .summary(WeeklyStatsRes.Summary.builder()
                        .sleepAvg(sleepAvg)
                        .waterTotal(waterSum)
                        .exerciseCount(exerciseCount)
                        .build())
                .byDay(byDay)
                .build();
    }
    
    public MonthlyCalendarRes getMonthlyCalendar(Long userId, String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        
        String sql = "SELECT DISTINCT routine_date FROM routines WHERE user_id = ? AND routine_date BETWEEN ? AND ?";
        List<LocalDate> routineDates = jdbcTemplate.queryForList(sql, LocalDate.class, userId, start, end);
        
        List<MonthlyCalendarRes.DayInfo> days = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            boolean hasRoutine = routineDates.stream().anyMatch(d -> d.equals(currentDate));
            days.add(MonthlyCalendarRes.DayInfo.builder()
                    .date(currentDate.toString())
                    .hasRoutine(hasRoutine)
                    .build());
        }
        
        return MonthlyCalendarRes.builder()
                .days(days)
                .build();
    }
}

