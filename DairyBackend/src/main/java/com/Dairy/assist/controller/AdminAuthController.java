package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.AuthRequest;
import com.Dairy.assist.entity.Role;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.UserRepository;
import com.Dairy.assist.service.impl.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@RestController
@RequestMapping({"/api/admin/auth", "/admin/auth"})
@Tag(name = "Admin - Auth", description = "Admin authentication & profile APIs")
public class AdminAuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    @Operation(summary = "Admin login")
    public ApiResponse<String> adminLogin(@RequestBody AuthRequest request) {
        String email = request.getEmail() == null ? null : request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getRole() != Role.ADMIN) {
            return ApiResponse.error("Admin account not found or not authorized");
        }
        // Reuse existing login logic (validates password and generates JWT with role)
        return authService.login(request);
    }

    @PostMapping("/logout")
    @Operation(summary = "Admin logout")
    public ApiResponse<String> adminLogout() {
        // JWT is stateless; client should discard token
        return ApiResponse.success("Admin logged out successfully", null);
    }

    @GetMapping("/profile")
    @Operation(summary = "Get current admin profile")
    public ApiResponse<User> profile(Authentication auth) {
        if (auth == null) {
            return ApiResponse.error("Unauthorized");
        }
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null || user.getRole() != Role.ADMIN) {
            return ApiResponse.error("Admin not found");
        }
        return ApiResponse.success("Admin profile", user);
    }
}


