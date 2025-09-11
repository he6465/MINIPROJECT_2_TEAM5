// com/hrt/health_routine_tracker/HealthRoutineTrackerApplication.java
package com.hrt.health_routine_tracker;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(title = "Health Routine Tracker API", version = "v1", description = "Health Routine Tracker 백엔드 API 문서"),
        servers = {
                @Server(url = "/", description = "base path resolved by context-path")
        }
)
public class HealthRoutineTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(HealthRoutineTrackerApplication.class, args);
    }
}
