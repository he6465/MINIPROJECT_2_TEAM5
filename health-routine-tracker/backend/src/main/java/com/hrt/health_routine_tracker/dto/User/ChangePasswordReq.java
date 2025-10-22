// com/hrt/health_routine_tracker/dto/User/ChangePasswordReq.java
package com.hrt.health_routine_tracker.dto.User;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordReq {
    @NotBlank
    private String currentPassword;

    @NotBlank @Size(min = 6, max = 100)
    private String newPassword;
}


