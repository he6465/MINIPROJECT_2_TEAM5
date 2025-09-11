package com.hrt.health_routine_tracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .csrf(csrf -> csrf.disable())
          .authorizeHttpRequests(auth -> auth
              .anyRequest().permitAll()           // ⚠️ 개발단계: 전부 허용
          )
          .httpBasic(Customizer.withDefaults());   // 남겨두어도 전부 허용이므로 영향 없음
        return http.build();
    }
}
