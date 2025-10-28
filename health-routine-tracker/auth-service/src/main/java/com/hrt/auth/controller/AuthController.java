package com.hrt.auth.controller;

import com.hrt.auth.dto.ApiResponse;
import com.hrt.auth.dto.user.*;
import com.hrt.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Auth", description = "인증/인가 API")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @Operation(summary = "헬스체크")
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "auth-service");
    }

    @Operation(summary = "회원가입")
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserRes> register(@Valid @RequestBody UserCreateReq req) {
        UserRes user = userService.register(req);
        return ApiResponse.ok(user, "User registered successfully");
    }

    @Operation(summary = "로그인")
    @PostMapping("/login")
    public ApiResponse<LoginRes> login(@Valid @RequestBody LoginReq req) {
        LoginRes loginRes = userService.login(req);
        return ApiResponse.ok(loginRes, "Login successful");
    }

    @Operation(summary = "사용자 정보 조회")
    @GetMapping("/users/{userId}")
    public ApiResponse<UserRes> getUserById(@PathVariable Long userId) {
        UserRes user = userService.getUserById(userId);
        return ApiResponse.ok(user);
    }
}

