package com.hrt.routine.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI routineOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Routine Service API")
                .version("v1")
                .description("Health Routine Tracker - Routine microservice"));
    }
}

