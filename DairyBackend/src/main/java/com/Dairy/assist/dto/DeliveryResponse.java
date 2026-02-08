package com.Dairy.assist.dto;

import com.Dairy.assist.entity.DeliveryStatus;
import java.time.LocalDateTime;

public class DeliveryResponse {
    private Long id;
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String fullAddress;
    private DeliveryStatus status;
    private LocalDateTime assignedDate;

    public DeliveryResponse(Long id, Long orderId, String customerName, String customerPhone, 
                            String fullAddress, DeliveryStatus status, LocalDateTime assignedDate) {
        this.id = id;
        this.orderId = orderId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.fullAddress = fullAddress;
        this.status = status;
        this.assignedDate = assignedDate;
    }

    // Getters
    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public String getCustomerName() { return customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public String getFullAddress() { return fullAddress; }
    public DeliveryStatus getStatus() { return status; }
    public LocalDateTime getAssignedDate() { return assignedDate; }
}