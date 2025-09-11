package com.hrt.health_routine_tracker.dto.User;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRes {
    private String token;
    private UserRes user;
}


