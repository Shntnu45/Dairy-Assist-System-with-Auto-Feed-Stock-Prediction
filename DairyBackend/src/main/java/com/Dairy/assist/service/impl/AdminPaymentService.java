package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.entity.PaymentStatus;
import com.Dairy.assist.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminPaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public ApiResponse<List<Payment>> getAllPayments() {
        return ApiResponse.success("All payments", paymentRepository.findAll());
    }

    public ApiResponse<Payment> getPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ApiResponse.error("Payment not found");
        }
        return ApiResponse.success("Payment details", payment);
    }

    public ApiResponse<String> updateStatus(Long paymentId, PaymentStatus status) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ApiResponse.error("Payment not found");
        }
        payment.setStatus(status);
        paymentRepository.save(payment);
        return ApiResponse.success("Payment status updated", null);
    }

    public ApiResponse<String> verifyPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ApiResponse.error("Payment not found");
        }
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);
        return ApiResponse.success("Payment verified", null);
    }

    public ApiResponse<String> markRefunded(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null) {
            return ApiResponse.error("Payment not found");
        }
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);
        return ApiResponse.success("Refund marked successfully", null);
    }
}


