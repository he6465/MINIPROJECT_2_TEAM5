package com.hrt.health_routine_tracker.dto.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginReq {
    @Email @NotBlank
    private String email;
    @NotBlank
    private String password;
}


