package com.hrt.routine;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
@OpenAPIDefinition(
        info = @Info(
                title = "Routine Service API",
                version = "v1",
                description = "루틴 CRUD API"
        )
)
public class RoutineServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(RoutineServiceApplication.class, args);
    }
}

