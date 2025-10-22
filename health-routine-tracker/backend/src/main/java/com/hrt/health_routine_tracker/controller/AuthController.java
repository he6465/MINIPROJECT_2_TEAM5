package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.User.LoginReq;
import com.hrt.health_routine_tracker.dto.User.LoginRes;
import com.hrt.health_routine_tracker.dto.User.UserCreateReq;
import com.hrt.health_routine_tracker.dto.User.UserRes;
import com.hrt.health_routine_tracker.service.UserService;
import com.hrt.health_routine_tracker.config.JwtTokenProvider;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "회원가입/로그인 API")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /** 회원가입: /auth/register */
    @PostMapping("/register")
    @Operation(summary = "회원가입", description = "중복시 409/USER_DUPLICATE 반환")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<UserRes> register(@RequestBody @Valid UserCreateReq req) {
        User u = userService.create(req);
        return ApiResponse.ok(new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ), "CREATED");
    }

    /** 로그인: /auth/login (JWT 발급) */
    @PostMapping("/login")
    @Operation(summary = "로그인", description = "JWT 반환")
    public ApiResponse<LoginRes> login(@RequestBody @Valid LoginReq req) {
        User u = userService.login(req.getEmail(), req.getPassword());
        String token = jwtTokenProvider.createToken(u.getId(), u.getEmail(), u.getNickname());
        LoginRes res = new LoginRes(token, new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ));
        return ApiResponse.ok(res);
    }
}


