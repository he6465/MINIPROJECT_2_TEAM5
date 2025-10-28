package com.hrt.auth.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class UserRes {
    private Long id;
    private String email;
    private String username;
    private String nickname;
    private Instant createdAt;
}

