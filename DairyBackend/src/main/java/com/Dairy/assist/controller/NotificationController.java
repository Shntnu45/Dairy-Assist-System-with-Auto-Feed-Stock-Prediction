package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Notification;
import com.Dairy.assist.service.impl.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user/notifications")
@Tag(name = "Notifications", description = "User notification APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ApiResponse<List<Notification>> getNotifications(Authentication auth) {
        return notificationService.getUserNotifications(auth.getName());
    }

    @PutMapping("/read/{id}")
    @Operation(summary = "Mark notification as read")
    public ApiResponse<String> markAsRead(Authentication auth, @PathVariable Long id) {
        return notificationService.markAsRead(auth.getName(), id);
    }
}