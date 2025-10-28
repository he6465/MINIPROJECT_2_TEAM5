package com.example.project_scg.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> {}) // 🔑 CORS 활성화 (아래 CorsWebFilter 빈과 함께 동작)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(ex -> ex
                        // 프리플라이트 전부 허용
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 인증 없이 열어둘 엔드포인트
                        .pathMatchers("/v1/auth/**").permitAll()
                        // 나머지는 인증 (원하면 permitAll로 바꿔도 됨)
                        .pathMatchers("/actuator/**").permitAll()
                        .anyExchange().permitAll() 
                )
                .build();
    }

    /**
     * 🔑 전역 CORS 설정 (게이트웨이 레벨)
     * 운영에서는 allowedOrigins를 실제 프론트 도메인으로 제한 권장.
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // 프론트 도메인으로 제한 권장: config.setAllowedOrigins(List.of("https://your-frontend.example.com"));
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("*"));
        config.setAllowCredentials(false); // 쿠키/자격증명 필요하면 true + 정확한 origin 지정

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
