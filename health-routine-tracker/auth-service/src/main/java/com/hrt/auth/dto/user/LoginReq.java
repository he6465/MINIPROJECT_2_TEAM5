package com.hrt.auth.dto.user;

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

