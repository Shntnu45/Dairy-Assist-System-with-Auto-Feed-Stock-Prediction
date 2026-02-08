package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.*;
import com.Dairy.assist.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // REQUIRED

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PaymentService {
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CartRepository cartRepository;

    @Value("${razorpay.key:your_razorpay_key}")
    private String razorpayKey;

    @Value("${razorpay.secret:your_razorpay_secret}")
    private String razorpaySecret;

    private final Map<String, String> verifiedPayments = new ConcurrentHashMap<>();

    
    @Transactional(readOnly = true)
    public ApiResponse<List<Payment>> getPaymentHistory(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        List<Payment> payments = paymentRepository.findByOrderUserUserIdOrderByPaymentDateDesc(user.getUserId());
        return ApiResponse.success("Payment history fetched successfully", payments);
    }

    @Transactional(readOnly = true)
    public ApiResponse<Payment> getPaymentById(String email, Long paymentId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        Payment payment = paymentRepository.findById(paymentId).orElse(null);
        if (payment == null || !payment.getOrder().getUser().getUserId().equals(user.getUserId())) {
            return ApiResponse.error("Payment not found");
        }

        return ApiResponse.success("Payment details", payment);
    }

    public ApiResponse<Map<String, Object>> createRazorpayOrder(String email) {
        try {
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) return ApiResponse.error("User not found");

            List<Cart> cartItems = cartRepository.findByUserUserId(user.getUserId());
            if (cartItems.isEmpty()) return ApiResponse.error("Cart is empty");

            double total = cartItems.stream()
                    .mapToDouble(item -> item.getVariant().getPrice() * item.getQuantity())
                    .sum();

            RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(total * 100)); 
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());

            Order razorpayOrder = client.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", total);
            response.put("currency", "INR");
            response.put("key", razorpayKey);

            return ApiResponse.success("Razorpay order created", response);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create payment order");
        }
    }

    public ApiResponse<String> verifyPayment(String email, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String expected = hmacSha256(payload, razorpaySecret);
            if (!constantTimeEquals(expected, razorpaySignature)) {
                return ApiResponse.error("Payment verification failed");
            }
            verifiedPayments.put(razorpayPaymentId, email);
            return ApiResponse.success("Payment verified", razorpayPaymentId);
        } catch (Exception e) {
            return ApiResponse.error("Payment verification failed");
        }
    }

    public boolean isVerifiedPayment(String email, String razorpayPaymentId) {
        String storedEmail = verifiedPayments.remove(razorpayPaymentId);
        return storedEmail != null && storedEmail.equalsIgnoreCase(email);
    }

    private String hmacSha256(String data, String secret) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(data.getBytes());
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) return false;
        if (a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}