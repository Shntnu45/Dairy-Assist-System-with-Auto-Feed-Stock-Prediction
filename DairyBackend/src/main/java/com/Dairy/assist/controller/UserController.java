package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.ChangePasswordRequest;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.service.impl.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public ApiResponse getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    @PutMapping("/profile")
    public ApiResponse updateProfile(
            Principal principal,
            @RequestBody User user
    ) {
        return userService.updateProfile(principal.getName(), user);
    }

    @PutMapping("/change-password")
    public ApiResponse<String> changePassword(Principal principal, @Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(principal.getName(), request.getOldPassword(), request.getNewPassword());
    }
}
