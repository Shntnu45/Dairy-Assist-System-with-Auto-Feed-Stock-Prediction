package com.Dairy.assist.dto;

import com.Dairy.assist.enums.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long orderId;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private int itemCount;

    public OrderResponse(Long orderId, Double totalAmount, OrderStatus status, LocalDateTime orderDate, int itemCount) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.itemCount = itemCount;
    }

    // Getters
    public Long getOrderId() { return orderId; }
    public Double getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public int getItemCount() { return itemCount; }
}