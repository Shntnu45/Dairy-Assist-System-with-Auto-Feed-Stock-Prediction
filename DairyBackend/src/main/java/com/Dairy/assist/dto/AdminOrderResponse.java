package com.Dairy.assist.dto;

import com.Dairy.assist.enums.OrderStatus;
import java.time.LocalDateTime;

public class AdminOrderResponse {
    private Long orderId;
    private String customerName;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime orderDate;
    private Integer itemCount; // Added to fix the empty Items column

    public AdminOrderResponse(Long orderId, String customerName, Double totalAmount, OrderStatus status, LocalDateTime orderDate, Integer itemCount) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderDate = orderDate;
        this.itemCount = itemCount;
    }

    // Getters
    public Long getOrderId() { return orderId; }
    public String getCustomerName() { return customerName; }
    public Double getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public Integer getItemCount() { return itemCount; }
}