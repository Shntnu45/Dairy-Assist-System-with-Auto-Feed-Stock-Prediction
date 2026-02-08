package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.AccountStatus;
import com.Dairy.assist.entity.Order;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.service.impl.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/admin/users", "/admin/users"})
@Tag(name = "Admin - Users", description = "Admin user management APIs")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    @Operation(summary = "List all users")
    public ApiResponse<List<User>> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get user details")
    public ApiResponse<User> getUserById(@PathVariable Long userId) {
        return adminUserService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update user details")
    public ApiResponse<User> updateUser(@PathVariable Long userId, @RequestBody User updated) {
        return adminUserService.updateUser(userId, updated);
    }

    @PatchMapping("/{userId}/status")
    @Operation(summary = "Update user account status")
    public ApiResponse<String> updateStatus(@PathVariable Long userId, @RequestParam AccountStatus status) {
        return adminUserService.updateStatus(userId, status);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Soft delete user")
    public ApiResponse<String> deleteUser(@PathVariable Long userId) {
        return adminUserService.softDeleteUser(userId);
    }

    @GetMapping("/{userId}/orders")
    @Operation(summary = "Get user order history")
    public ApiResponse<List<Order>> getUserOrders(@PathVariable Long userId) {
        return adminUserService.getUserOrders(userId);
    }

    @GetMapping("/{userId}/payments")
    @Operation(summary = "Get user payment history")
    public ApiResponse<List<Payment>> getUserPayments(@PathVariable Long userId) {
        return adminUserService.getUserPayments(userId);
    }
}


