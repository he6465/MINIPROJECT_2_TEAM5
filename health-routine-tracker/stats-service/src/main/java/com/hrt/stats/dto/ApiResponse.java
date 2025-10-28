package com.hrt.stats.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String code;
    private Object details;

    public static <T> ApiResponse<T> ok(T data) { return new ApiResponse<>(true, data, null, null, null); }
    public static <T> ApiResponse<T> ok(T data, String message) { return new ApiResponse<>(true, data, message, null, null); }
    public static <T> ApiResponse<T> error(String code, String message) { return new ApiResponse<>(false, null, message, code, null); }
    public static <T> ApiResponse<T> error(String code, String message, Object details) { return new ApiResponse<>(false, null, message, code, details); }
}

