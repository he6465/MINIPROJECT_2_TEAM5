package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.Routine;
import com.hrt.health_routine_tracker.dto.stats.MonthlyCalendarRes;
import com.hrt.health_routine_tracker.dto.stats.WeeklyStatsRes;
import com.hrt.health_routine_tracker.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final RoutineRepository routineRepository;

    public WeeklyStatsRes getWeekly(Long userId, String startDateStr) {
        LocalDate start = LocalDate.parse(startDateStr);
        LocalDate end = start.plusDays(6);
        List<Routine> routines = routineRepository
                .findByUserIdAndRoutineDateBetweenOrderByRoutineDateAsc(userId, start, end);

        return WeeklyStatsRes.fromRange(start, end, routines);
    }

    public MonthlyCalendarRes getMonthly(Long userId, String monthStr) {
        YearMonth ym = YearMonth.parse(monthStr); // e.g. 2025-09
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<Routine> routines = routineRepository
                .findByUserIdAndRoutineDateBetweenOrderByRoutineDateAsc(userId, start, end);

        return MonthlyCalendarRes.fromMonth(ym, routines);
    }
}


