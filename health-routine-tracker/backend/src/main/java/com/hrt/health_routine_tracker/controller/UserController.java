// com/hrt/health_routine_tracker/controller/UserController.java
package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.User.UserCreateReq;
import com.hrt.health_routine_tracker.dto.User.UserRes;
import com.hrt.health_routine_tracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "회원 API (임시)")
@Validated
public class UserController {
    private final UserService userService;

    /** 회원 생성 (계획서: /auth/register) */
    @PostMapping(path = "/register", value = "/register") // 유지: /members/register (동작), 별도 AuthController 추가 예정
    @Operation(summary = "회원 생성(임시)")
    public ApiResponse<UserRes> create(@RequestBody @Valid UserCreateReq req) {
        User u = userService.create(req);
        return ApiResponse.ok(new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ), "CREATED");
    }

    /** 단건 조회 */
    @GetMapping("/{id}")
    @Operation(summary = "회원 단건 조회")
    public ApiResponse<UserRes> get(@PathVariable @Positive Long id) {
        User u = userService.get(id);
        return ApiResponse.ok(new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ));
    }

    /** 마이페이지(임시): JWT 도입 전까지 쿼리 파라미터로 id 사용 */
    @GetMapping("/me")
    @Operation(summary = "마이페이지(임시)", description = "JWT 도입 전: id 쿼리파라미터")
    public ApiResponse<UserRes> me(@RequestParam @Positive Long id) {
        User u = userService.get(id);
        return ApiResponse.ok(new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ));
    }
}

