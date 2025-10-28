package com.hrt.auth.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordReq {
    @NotBlank
    private String currentPassword;
    @NotBlank
    private String newPassword;
}

