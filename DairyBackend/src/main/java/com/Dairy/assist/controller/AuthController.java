package com.Dairy.assist.controller;

import com.Dairy.assist.dto.*;
import com.Dairy.assist.service.impl.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "User registration")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send OTP to email")
    public ApiResponse<String> sendOtp(@RequestParam String email) {
        return authService.sendOtp(email);
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify email OTP")
    public ApiResponse<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        return authService.verifyOtp(email, otp);
    }

    @PostMapping("/login")
    @Operation(summary = "User login")
    public ApiResponse<String> login(@Valid @RequestBody AuthRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout")
    public ApiResponse<String> logout() {
        return ApiResponse.success("Logged out successfully", null);
    }

    @GetMapping("/validate-token")
    @Operation(summary = "Validate JWT token")
    public ApiResponse<String> validateToken(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return authService.validateToken(token);
    }
}