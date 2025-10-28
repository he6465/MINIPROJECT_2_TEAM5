package com.hrt.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyStatsRes {
    private List<String> range; // ["2025-10-20", "2025-10-26"]
    private Summary summary;
    private List<DayData> byDay;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Summary {
        private Double sleepAvg;
        private Integer waterTotal;
        private Integer exerciseCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayData {
        private String date;
        private Double sleep;
        private Integer water;
        private String exerciseType;
        private Integer exerciseMinutes;
        private Boolean exercise;
    }
}

