// com/hrt/health_routine_tracker/service/UserService.java
package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.User.UserCreateReq;
import com.hrt.health_routine_tracker.repository.UserRepository;
import com.hrt.health_routine_tracker.repository.RoutineRepository;
import com.hrt.health_routine_tracker.repository.CommentRepository;
import com.hrt.health_routine_tracker.repository.LikeRepository;
import com.hrt.health_routine_tracker.exception.BusinessException;
import com.hrt.health_routine_tracker.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoutineRepository routineRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    @Transactional
    public User create(UserCreateReq req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Email exists");
        if (userRepository.existsByNickname(req.getNickname()))
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Nickname exists");

        // BCRYPT 해시 저장
        User user = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .nickname(req.getNickname())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();
        return userRepository.save(user);
    }

    public User get(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
    }

    /** 로그인: email + password 검증(BCrypt) */
    public User login(String email, String password) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REQUIRED, "invalid credentials"));
        if (!passwordEncoder.matches(password, u.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_REQUIRED, "invalid credentials");
        }
        return u;
    }

    /** 비밀번호 변경 */
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
        boolean matches;
        try {
            matches = passwordEncoder.matches(currentPassword, u.getPasswordHash());
        } catch (IllegalArgumentException ex) { // 잘못된 해시 형식 등
            matches = false;
        }
        if (!matches) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "current password not match");
        }
        u.setPasswordHash(passwordEncoder.encode(newPassword));
    }

    /** 회원 탈퇴(완전 삭제) */
    @Transactional
    public void deleteMe(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));

        // 사용자의 모든 루틴 조회
        java.util.List<com.hrt.health_routine_tracker.domain.Routine> routines = routineRepository.findByUserId(userId);
        java.util.List<Long> routineIds = routines.stream().map(com.hrt.health_routine_tracker.domain.Routine::getId).toList();

        // 관련 좋아요/댓글 선삭제
        if (!routineIds.isEmpty()) {
            likeRepository.deleteByRoutineIdIn(routineIds);
            commentRepository.deleteByRoutineIdIn(routineIds);
        }
        // 사용자가 남긴 댓글/좋아요(타인의 루틴)에 대한 데이터도 삭제
        likeRepository.deleteByUserId(userId);
        commentRepository.deleteByUserId(userId);

        // 루틴 삭제
        routineRepository.deleteAll(routines);
        // 마지막으로 사용자 삭제
        userRepository.delete(u);
    }
}

