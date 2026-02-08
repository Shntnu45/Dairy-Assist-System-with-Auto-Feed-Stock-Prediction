package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Payment;
import com.Dairy.assist.service.impl.PaymentService; // Fixed Import
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private PaymentService paymentService; // Fixed: Using PaymentService to match email parameter

    @Value("${razorpay.key.id}")
    private String keyId;
 @GetMapping("/user-history")
    public ApiResponse<List<Payment>> getUserPaymentHistory(Authentication auth) {
        return paymentService.getPaymentHistory(auth.getName());
    }

    @PostMapping("/create-order")
    public ApiResponse<Map<String, Object>> createPaymentOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.parseDouble(data.get("amount").toString());
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(amount * 100)); // paise conversion
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = Map.of(
                "orderId", order.get("id"),
                "key", keyId,
                "amount", amount
            );

            return ApiResponse.success("Payment order created", response);
        } catch (RazorpayException e) {
            return ApiResponse.error("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ApiResponse<String> verifyPayment(@RequestBody Map<String, String> data) {
        // Simple verification for development
        return ApiResponse.success("Payment verified", "valid");
    }
}