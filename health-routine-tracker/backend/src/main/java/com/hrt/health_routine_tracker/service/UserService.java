// com/hrt/health_routine_tracker/service/UserService.java
package com.hrt.health_routine_tracker.service;

import com.hrt.health_routine_tracker.domain.User;
import com.hrt.health_routine_tracker.dto.User.UserCreateReq;
import com.hrt.health_routine_tracker.repository.UserRepository;
import com.hrt.health_routine_tracker.exception.BusinessException;
import com.hrt.health_routine_tracker.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public User create(UserCreateReq req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Email exists");
        if (userRepository.existsByNickname(req.getNickname()))
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Nickname exists");

        // 데모: 평문 저장 (실서비스는 반드시 BCRYPT 등 사용)
        User user = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .nickname(req.getNickname())
                .passwordHash(req.getPassword())
                .build();
        return userRepository.save(user);
    }

    public User get(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
    }

    /** 데모 로그인: email + password 평문 비교 (실서비스는 BCRYPT + JWT) */
    public User login(String email, String password) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REQUIRED, "invalid credentials"));
        if (!u.getPasswordHash().equals(password)) {
            throw new BusinessException(ErrorCode.AUTH_REQUIRED, "invalid credentials");
        }
        return u;
    }
}

