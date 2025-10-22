package com.hrt.health_routine_tracker.dto.stats;

import com.hrt.health_routine_tracker.domain.Routine;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class WeeklyStatsRes {
    private List<String> range;
    private Summary summary;
    private List<DayItem> byDay;

    @Data
    @AllArgsConstructor
    public static class Summary {
        private double sleepAvg;
        private int exerciseCount;
        private int waterTotal;
    }

    @Data
    @AllArgsConstructor
    public static class DayItem {
        private String date;
        private Double sleep;
        private boolean exercise;
        private Integer water;
    }

    public static WeeklyStatsRes fromRange(LocalDate start, LocalDate end, List<Routine> routines) {
        Map<LocalDate, Routine> map = routines.stream().collect(Collectors.toMap(Routine::getRoutineDate, r -> r));
        List<DayItem> items = new ArrayList<>();
        double sleepSum = 0;
        int sleepDays = 0;
        int exerciseCount = 0;
        int waterTotal = 0;
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            Routine r = map.get(d);
            Double sleep = null;
            boolean exercised = false;
            Integer water = null;
            if (r != null) {
                if (r.getSleepHours() != null) {
                    sleep = r.getSleepHours().doubleValue();
                    sleepSum += sleep;
                    sleepDays += 1;
                }
                exercised = r.getExerciseMinutes() != null && r.getExerciseMinutes() > 0;
                if (exercised) exerciseCount += 1;
                if (r.getWaterMl() != null) {
                    water = r.getWaterMl();
                    waterTotal += water;
                }
            }
            items.add(new DayItem(d.toString(), sleep, exercised, water));
        }

        double sleepAvg = sleepDays > 0 ? Math.round((sleepSum / sleepDays) * 10.0) / 10.0 : 0.0;
        Summary summary = new Summary(sleepAvg, exerciseCount, waterTotal);
        List<String> range = List.of(start.toString(), end.toString());
        return new WeeklyStatsRes(range, summary, items);
    }
}


