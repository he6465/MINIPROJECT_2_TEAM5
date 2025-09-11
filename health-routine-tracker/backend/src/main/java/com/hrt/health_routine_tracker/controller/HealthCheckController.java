// com/hrt/health_routine_tracker/controller/HealthCheckController.java
package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
public class HealthCheckController {
    @GetMapping
    public ApiResponse<?> health() {
        return ApiResponse.okMsg("OK"); // okMessage도 존재(호환)
    }
}
