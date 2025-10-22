package com.hrt.health_routine_tracker.dto.stats;

import com.hrt.health_routine_tracker.domain.Routine;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class MonthlyCalendarRes {
    private String month;
    private List<DayBadge> days;

    @Data
    @AllArgsConstructor
    public static class DayBadge {
        private String date;
        private boolean hasRoutine;
    }

    public static MonthlyCalendarRes fromMonth(YearMonth ym, List<Routine> routines) {
        Map<String, Boolean> hasMap = routines.stream()
                .collect(Collectors.toMap(r -> r.getRoutineDate().toString(), r -> true, (a,b)->a));
        // BUGFIX: 월의 모든 날짜를 포함해야 하므로 시작을 1일로 지정
        List<DayBadge> badges = ym.atDay(1)
                .datesUntil(ym.atEndOfMonth().plusDays(1))
                .map(d -> new DayBadge(d.toString(), hasMap.getOrDefault(d.toString(), false)))
                .toList();
        return new MonthlyCalendarRes(ym.toString(), badges);
    }
}


