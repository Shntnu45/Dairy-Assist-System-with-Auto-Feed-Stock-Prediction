package com.Dairy.assist.controller;

import com.Dairy.assist.dto.AdminOrderResponse;
import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Order;
import com.Dairy.assist.enums.OrderStatus;
import com.Dairy.assist.service.impl.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@Tag(name = "Admin - Orders", description = "Order management APIs")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    @GetMapping
    @Operation(summary = "Get all orders")
    public ApiResponse<List<AdminOrderResponse>> getAllOrders() {
        return adminOrderService.getAllOrders();
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Get order details")
    public ApiResponse<Order> getOrderById(@PathVariable Long orderId) {
        return adminOrderService.getOrderById(orderId);
    }

    @PatchMapping("/{orderId}/status")
    @Operation(summary = "Update order status")
    public ApiResponse<String> updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return adminOrderService.updateStatus(orderId, status);
    }

    @DeleteMapping("/{orderId}")
    @Operation(summary = "Cancel order")
    public ApiResponse<String> cancelOrder(@PathVariable Long orderId) {
        return adminOrderService.cancelOrder(orderId);
    }
}