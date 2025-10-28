package com.hrt.auth.controller;

import com.hrt.auth.dto.ApiResponse;
import com.hrt.auth.dto.user.ChangePasswordReq;
import com.hrt.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Members", description = "계정 관리 API")
@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final UserService userService;

    @Operation(summary = "내 비밀번호 변경")
    @PatchMapping("/me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody ChangePasswordReq req) {
        if (userId == null) throw new IllegalArgumentException("X-User-Id header required");
        userService.changePassword(userId, req.getCurrentPassword(), req.getNewPassword());
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/me")
    public ApiResponse<Void> deleteAccount(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        if (userId == null) throw new IllegalArgumentException("X-User-Id header required");
        userService.deleteAccount(userId);
        return ApiResponse.ok(null, "Account deleted");
    }
}

