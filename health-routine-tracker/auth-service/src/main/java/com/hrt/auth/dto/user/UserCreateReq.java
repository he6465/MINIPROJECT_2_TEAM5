package com.hrt.auth.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateReq {
    @Email @NotBlank
    private String email;

    @NotBlank @Size(max=50)
    private String username;

    @NotBlank @Size(max=50)
    private String nickname;

    @NotBlank @Size(min=4, max=100)
    private String password;
}

