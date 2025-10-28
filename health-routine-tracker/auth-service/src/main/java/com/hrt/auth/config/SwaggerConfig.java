package com.hrt.auth.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI authOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Auth Service API")
                .version("v1")
                .description("Health Routine Tracker - Auth microservice"));
    }
}

