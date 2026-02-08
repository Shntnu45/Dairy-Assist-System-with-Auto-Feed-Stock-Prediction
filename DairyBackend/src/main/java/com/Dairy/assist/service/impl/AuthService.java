package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.AuthRequest;
import com.Dairy.assist.dto.RegisterRequest;
import com.Dairy.assist.entity.AccountStatus;
import com.Dairy.assist.entity.OtpStorage;
import com.Dairy.assist.entity.Role;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.OtpStorageRepository;
import com.Dairy.assist.repository.UserRepository;
import com.Dairy.assist.service.EmailService;
import com.Dairy.assist.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpStorageRepository otpStorageRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    public ApiResponse<String> register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            return ApiResponse.error("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(email);
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        // Email must be verified via OTP
        user.setStatus(AccountStatus.DEACTIVATED);
        userRepository.save(user);

        // Send OTP for verification
        String otp = generateOtp();
        upsertOtp(email, otp);
        emailService.sendOtp(email, otp);

        return ApiResponse.success("Registered successfully. Please verify OTP sent to email.", null);
    }

    public ApiResponse<String> sendOtp(String email) {
        String normalized = normalizeEmail(email);
        User user = userRepository.findByEmail(normalized).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        String otp = generateOtp();
        upsertOtp(normalized, otp);
        emailService.sendOtp(normalized, otp);

        return ApiResponse.success("OTP sent to email", null);
    }

    @Transactional
    public ApiResponse<String> verifyOtp(String email, String otp) {
        String normalized = normalizeEmail(email);
        otpStorageRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        OtpStorage record = otpStorageRepository.findByEmail(normalized).orElse(null);
        if (record == null) return ApiResponse.error("OTP not found. Please request a new OTP.");
        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpStorageRepository.deleteByEmail(normalized);
            return ApiResponse.error("OTP expired. Please request a new OTP.");
        }
        if (!record.getOtp().equals(otp)) {
            return ApiResponse.error("Invalid OTP");
        }

        otpStorageRepository.deleteByEmail(normalized);

        User user = userRepository.findByEmail(normalized).orElse(null);
        if (user == null) return ApiResponse.error("User not found");
        user.setStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        return ApiResponse.success("Email verified successfully", null);
    }

    public ApiResponse<String> login(AuthRequest request) {
        String email = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("Invalid email or password");
        if (user.getStatus() != AccountStatus.ACTIVE) {
            return ApiResponse.error("Email not verified. Please verify OTP before login.");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.error("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole() != null ? user.getRole().name() : "USER");
        return ApiResponse.success("Login successful", token);
    }

    public ApiResponse<String> validateToken(String token) {
        try {
            String email = jwtUtil.extractEmail(token);
            if (!jwtUtil.validateToken(token, email)) {
                return ApiResponse.error("Invalid or expired token");
            }
            return ApiResponse.success("Token is valid", email);
        } catch (Exception e) {
            return ApiResponse.error("Invalid or expired token");
        }
    }

    public ApiResponse<String> setPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ApiResponse.success("Password updated successfully", null);
    }

    public ApiResponse<String> changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ApiResponse.error("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ApiResponse.success("Password changed successfully", null);
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
    }

    private String generateOtp() {
        int n = secureRandom.nextInt(1_000_000);
        return String.format("%06d", n);
    }

    private void upsertOtp(String email, String otp) {
        otpStorageRepository.deleteByEmail(email);
        OtpStorage record = new OtpStorage();
        record.setEmail(email);
        record.setOtp(otp);
        record.setCreatedAt(LocalDateTime.now());
        record.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpStorageRepository.save(record);
    }
}
