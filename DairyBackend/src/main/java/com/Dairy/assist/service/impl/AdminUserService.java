package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.AccountStatus;
import com.Dairy.assist.entity.Order;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.OrderRepository;
import com.Dairy.assist.repository.PaymentRepository;
import com.Dairy.assist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(u -> !u.isDeleted())
                .collect(Collectors.toList());
        return ApiResponse.success("Users fetched successfully", users);
    }

    public ApiResponse<User> getUserById(Long userId) {
        // Corrected to match your Repository naming
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.isDeleted()) {
            return ApiResponse.error("User not found");
        }
        return ApiResponse.success("User details", user);
    }

    public ApiResponse<User> updateUser(Long userId, User updated) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        user.setName(updated.getName());
        user.setPhone(updated.getPhone());
        if (updated.getStatus() != null) {
            user.setStatus(updated.getStatus());
        }
        userRepository.save(user);
        return ApiResponse.success("User updated successfully", user);
    }

    public ApiResponse<String> updateStatus(Long userId, AccountStatus status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.error("User not found");
        
        user.setStatus(status);
        userRepository.save(user);
        return ApiResponse.success("User status updated", null);
    }

    public ApiResponse<String> softDeleteUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.error("User not found");
        
        user.setDeleted(true);
        user.setStatus(AccountStatus.DEACTIVATED);
        userRepository.save(user);
        return ApiResponse.success("User deleted successfully", null);
    }

    public ApiResponse<List<Order>> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserUserIdOrderByOrderDateDesc(userId);
        return ApiResponse.success("User orders", orders);
    }

    public ApiResponse<List<Payment>> getUserPayments(Long userId) {
        List<Payment> payments = paymentRepository.findByOrderUserUserIdOrderByPaymentDateDesc(userId);
        return ApiResponse.success("User payments", payments);
    }
}