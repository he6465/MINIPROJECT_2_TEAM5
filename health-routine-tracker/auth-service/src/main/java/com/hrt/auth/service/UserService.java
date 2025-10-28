package com.hrt.auth.service;

import com.hrt.auth.config.JwtTokenProvider;
import com.hrt.auth.config.JwtUserPrincipal;
import com.hrt.auth.domain.User;
import com.hrt.auth.dto.user.*;
import com.hrt.auth.exception.BusinessException;
import com.hrt.auth.exception.ErrorCode;
import com.hrt.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return new JwtUserPrincipal(user);
    }

    @Transactional
    public UserRes register(UserCreateReq req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Email already in use");
        }
        if (userRepository.existsByNickname(req.getNickname())) {
            throw new BusinessException(ErrorCode.USER_DUPLICATE, "Nickname already in use");
        }

        User user = User.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .nickname(req.getNickname())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        return new UserRes(user.getId(), user.getEmail(), user.getUsername(), user.getNickname(), user.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public LoginRes login(LoginReq req) {
        // 사용자 조회
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_REQUIRED, "Invalid email or password"));

        // 비밀번호 검증
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_REQUIRED, "Invalid email or password");
        }

        // JWT 토큰 생성
        JwtUserPrincipal principal = new JwtUserPrincipal(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()
        );
        String token = jwtTokenProvider.generateToken(authentication);

        UserRes userRes = new UserRes(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getNickname(),
                user.getCreatedAt()
        );

        log.info("User logged in: {}", req.getEmail());
        return new LoginRes(token, userRes);
    }

    @Transactional(readOnly = true)
    public UserRes getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
        return new UserRes(user.getId(), user.getEmail(), user.getUsername(), user.getNickname(), user.getCreatedAt());
    }

    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND, "User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.AUTH_REQUIRED, "Current password does not match");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed: userId={}", userId);
    }

    @Transactional
    public void deleteAccount(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(userId);
        log.info("Account deleted: userId={}", userId);
    }
}
