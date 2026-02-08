package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.AdminOrderResponse;
import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Order;
import com.Dairy.assist.enums.OrderStatus;
import com.Dairy.assist.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    @Autowired 
    private OrderRepository orderRepository;

    /**
     * Fetches all orders and converts them to AdminOrderResponse DTOs.
     * Extracts customer name and item counts to prevent LazyInitialization errors.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<AdminOrderResponse>> getAllOrders() {
        // Fetch all order entities from the database
        List<Order> orders = orderRepository.findAll();
        
        // Map Order entities to AdminOrderResponse DTOs with item counts
        List<AdminOrderResponse> response = orders.stream().map(order -> new AdminOrderResponse(
                order.getOrderId(),
                order.getUser() != null ? order.getUser().getName() : "Unknown Customer", // Fixes "N/A"
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getOrderItems() != null ? order.getOrderItems().size() : 0 // Fixes empty Items column
        )).collect(Collectors.toList());

        return ApiResponse.success("Admin orders fetched successfully", response);
    }

    @Transactional(readOnly = true)
    public ApiResponse<Order> getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ApiResponse.error("Order not found");
        }
        return ApiResponse.success("Order details fetched", order);
    }

    @Transactional
    public ApiResponse<String> updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ApiResponse.error("Order not found");
        }
        
        order.setStatus(status);
        orderRepository.save(order);
        return ApiResponse.success("Order status updated successfully", "New Status: " + status);
    }

    @Transactional
    public ApiResponse<String> cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ApiResponse.error("Order not found");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return ApiResponse.success("Order cancelled successfully", null);
    }
}