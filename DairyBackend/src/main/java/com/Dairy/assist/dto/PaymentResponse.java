package com.Dairy.assist.dto;

import com.Dairy.assist.entity.PaymentStatus;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long paymentId;
    private Long orderId;
    private String customerName;
    private Double amount;
    private String razorpayTxnId;
    private LocalDateTime paymentDate;
    private PaymentStatus status;

    public PaymentResponse(Long paymentId, Long orderId, String customerName, Double amount, 
                           String razorpayTxnId, LocalDateTime paymentDate, PaymentStatus status) {
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.customerName = customerName;
        this.amount = amount;
        this.razorpayTxnId = razorpayTxnId;
        this.paymentDate = paymentDate;
        this.status = status;
    }

    // Getters
    public Long getPaymentId() { return paymentId; }
    public Long getOrderId() { return orderId; }
    public String getCustomerName() { return customerName; }
    public Double getAmount() { return amount; }
    public String getRazorpayTxnId() { return razorpayTxnId; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public PaymentStatus getStatus() { return status; }
}