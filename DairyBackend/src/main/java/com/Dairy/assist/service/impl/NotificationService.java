package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Notification;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.NotificationRepository;
import com.Dairy.assist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<List<Notification>> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return new ApiResponse<>(false, "User not found", null);
        }

        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
        return new ApiResponse<>(true, "Notifications retrieved", notifications);
    }

    public ApiResponse<String> markAsRead(String email, Long notificationId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return new ApiResponse<>(false, "User not found", null);
        }

        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification == null || !notification.getUser().getUserId().equals(user.getUserId())) {
            return new ApiResponse<>(false, "Notification not found", null);
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return new ApiResponse<>(true, "Notification marked as read", null);
    }

    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}