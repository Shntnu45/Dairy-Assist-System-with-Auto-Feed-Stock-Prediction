package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Notification;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.UserRepository;
import com.Dairy.assist.service.impl.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/admin/notifications", "/admin/notifications"})
@Tag(name = "Admin - Notifications", description = "Admin feed notification APIs")
public class AdminNotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get admin notifications")
    public ApiResponse<List<Notification>> getNotifications(Authentication auth) {
        if (auth == null) {
            return ApiResponse.error("Unauthorized");
        }
        User admin = userRepository.findByEmail(auth.getName()).orElse(null);
        if (admin == null) {
            return ApiResponse.error("Admin not found");
        }
        // reuse existing service logic
        return notificationService.getUserNotifications(admin.getEmail());
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark admin notification as read")
    public ApiResponse<String> markAsRead(Authentication auth, @PathVariable Long id) {
        if (auth == null) {
            return ApiResponse.error("Unauthorized");
        }
        User admin = userRepository.findByEmail(auth.getName()).orElse(null);
        if (admin == null) {
            return ApiResponse.error("Admin not found");
        }
        return notificationService.markAsRead(admin.getEmail(), id);
    }
}


