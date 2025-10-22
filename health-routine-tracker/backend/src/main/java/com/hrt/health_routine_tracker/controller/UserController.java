// com/hrt/health_routine_tracker/controller/UserController.java
package com.hrt.health_routine_tracker.controller;

import com.hrt.health_routine_tracker.domain.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.hrt.health_routine_tracker.dto.ApiResponse;
import com.hrt.health_routine_tracker.dto.User.UserCreateReq;
import com.hrt.health_routine_tracker.dto.User.ChangePasswordReq;
import com.hrt.health_routine_tracker.dto.User.UserRes;
import com.hrt.health_routine_tracker.service.UserService;
import com.hrt.health_routine_tracker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.validation.constraints.Positive;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.hrt.health_routine_tracker.config.JwtUserPrincipal;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Tag(name = "Members", description = "회원 API (임시)")
@Validated
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

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

    /** 마이페이지: 인증 사용자 정보 반환 */
    @GetMapping("/me")
    @Operation(summary = "마이페이지")
    public ApiResponse<UserRes> me(@AuthenticationPrincipal JwtUserPrincipal principal) {
        User u = userService.get(principal.userId());
        return ApiResponse.ok(new UserRes(
                u.getId(), u.getEmail(), u.getUsername(), u.getNickname(), u.getCreatedAt()
        ));
    }

    /** 공개: 닉네임으로 사용자 ID 조회 (검색용) */
    @GetMapping("/lookup")
    @Operation(summary = "닉네임으로 사용자 조회", description = "닉네임으로 사용자 id 반환")
    public ApiResponse<java.util.Map<String, Object>> lookupByNickname(@RequestParam String nickname) {
        var u = userRepository.findByNickname(nickname)
                .orElseThrow(() -> new com.hrt.health_routine_tracker.exception.BusinessException(
                        com.hrt.health_routine_tracker.exception.ErrorCode.NOT_FOUND, "User not found"));
        return ApiResponse.ok(java.util.Map.of("id", u.getId(), "nickname", u.getNickname()));
    }

    /** 비밀번호 변경 */
    @PatchMapping("/me/password")
    @Operation(summary = "비밀번호 변경")
    public ApiResponse<Void> changePassword(@AuthenticationPrincipal JwtUserPrincipal principal,
                                            @RequestBody @Valid ChangePasswordReq req) {
        if (principal == null) {
            throw new com.hrt.health_routine_tracker.exception.BusinessException(
                    com.hrt.health_routine_tracker.exception.ErrorCode.AUTH_REQUIRED,
                    "Authentication required");
        }
        userService.changePassword(principal.userId(), req.getCurrentPassword(), req.getNewPassword());
        return ApiResponse.ok(null, "PASSWORD_CHANGED");
    }

    /** 회원 탈퇴(완전 삭제) */
    @DeleteMapping("/me")
    @Operation(summary = "회원 탈퇴")
    public org.springframework.http.ResponseEntity<Void> deleteMe(@AuthenticationPrincipal JwtUserPrincipal principal) {
        userService.deleteMe(principal.userId());
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}

