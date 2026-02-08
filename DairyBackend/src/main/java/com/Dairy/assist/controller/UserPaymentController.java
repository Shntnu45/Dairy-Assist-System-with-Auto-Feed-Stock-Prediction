package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.service.impl.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/payments")
@Tag(name = "User Payments", description = "User payment history APIs")
public class UserPaymentController {

    @Autowired private PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Get payment history (alias)")
    public ApiResponse<List<Payment>> getPaymentHistory(Authentication auth) {
        return paymentService.getPaymentHistory(auth.getName());
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment details (alias)")
    public ApiResponse<Payment> getPaymentById(Authentication auth, @PathVariable Long paymentId) {
        return paymentService.getPaymentById(auth.getName(), paymentId);
    }
}


