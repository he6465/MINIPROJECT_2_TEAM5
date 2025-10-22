/**
 * Health Routine Tracker 애플리케이션의 메인 진입점
 * 
 * 이 클래스는 Spring Boot 애플리케이션을 시작하는 메인 클래스입니다.
 * 
 * 주요 기능:
 * - Spring Boot 자동 설정 활성화 (@SpringBootApplication)
 * - OpenAPI/Swagger 문서화 설정
 * - 애플리케이션 컨텍스트 경로를 /v1으로 설정
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */
// com/hrt/health_routine_tracker/HealthRoutineTrackerApplication.java
package com.hrt.health_routine_tracker;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 애플리케이션의 메인 클래스
 * 
 * @SpringBootApplication 어노테이션은 다음을 포함합니다:
 * - @Configuration: 설정 클래스임을 나타냄
 * - @EnableAutoConfiguration: Spring Boot 자동 설정 활성화
 * - @ComponentScan: 컴포넌트 스캔 활성화
 */
@SpringBootApplication
/**
 * OpenAPI 3.0 스펙을 사용한 API 문서화 설정
 * 
 * @param info API 문서의 기본 정보 (제목, 버전, 설명)
 * @param servers API 서버 정보 (기본 컨텍스트 경로)
 */
@OpenAPIDefinition(
        info = @Info(title = "Health Routine Tracker API", version = "v1", description = "Health Routine Tracker 백엔드 API 문서"),
        servers = {
                @Server(url = "/v1", description = "Context path /v1")
        }
)
public class HealthRoutineTrackerApplication {
    
    /**
     * 애플리케이션의 메인 진입점
     * 
     * Spring Boot 애플리케이션을 시작하고, 모든 자동 설정과 컴포넌트 스캔을 수행합니다.
     * 
     * @param args 명령행 인수 (현재 사용하지 않음)
     */
    public static void main(String[] args) {
        SpringApplication.run(HealthRoutineTrackerApplication.class, args);
    }
}
