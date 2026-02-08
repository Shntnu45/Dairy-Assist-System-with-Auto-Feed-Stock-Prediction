package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.entity.PaymentStatus; // Ensure you have this enum
import com.Dairy.assist.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/admin/payments", "/admin/payments"})
@Tag(name = "Admin - Payments", description = "Admin payment APIs")
public class AdminPaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping
    @Operation(summary = "List all payments")
    public ApiResponse<List<Payment>> getAllPayments() {
        return ApiResponse.success("All payments", paymentRepository.findAll());
    }

    @PatchMapping("/{paymentId}/status")
    @Operation(summary = "Update payment status")
    public ApiResponse<String> updateStatus(@PathVariable Long paymentId, 
                                            @RequestParam PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if(payment == null) return ApiResponse.error("Payment not found");
        
        payment.setStatus(status);
        paymentRepository.save(payment);
        return ApiResponse.success("Status updated", null);
    }
}