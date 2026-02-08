package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@Tag(name = "AI Chatbot", description = "Chatbot APIs for user assistance")
public class ChatbotController {

    @PostMapping("/query")
    @Operation(summary = "Ask chatbot")
    public ApiResponse<String> askChatbot(@RequestParam String query) {
        // Simple rule-based responses for demo
        String response = generateResponse(query.toLowerCase());
        return ApiResponse.success("Chatbot response", response);
    }

    @GetMapping("/faqs")
    @Operation(summary = "Get predefined FAQs")
    public ApiResponse<List<Map<String, String>>> getFaqs() {
        List<Map<String, String>> faqs = Arrays.asList(
            Map.of("question", "How to place an order?", 
                   "answer", "Add products to cart, select address, and proceed to payment."),
            Map.of("question", "How to track my order?", 
                   "answer", "Go to My Orders section and click on your order to see delivery status."),
            Map.of("question", "What payment methods are accepted?", 
                   "answer", "We accept all major credit/debit cards and UPI through Razorpay."),
            Map.of("question", "How to change delivery address?", 
                   "answer", "You can add/edit addresses in your profile before placing an order.")
        );
        return ApiResponse.success("FAQs", faqs);
    }

    private String generateResponse(String query) {
        if (query.contains("order") && query.contains("track")) {
            return "You can track your order by going to 'My Orders' section in your dashboard.";
        } else if (query.contains("payment")) {
            return "We accept all major payment methods through Razorpay. Your payments are secure.";
        } else if (query.contains("delivery")) {
            return "We deliver fresh dairy products to your doorstep. Delivery time is usually 1-2 days.";
        } else if (query.contains("product")) {
            return "Browse our wide range of fresh dairy products including milk, cheese, butter, and more.";
        } else if (query.contains("account") || query.contains("profile")) {
            return "You can manage your profile, addresses, and view order history in your account section.";
        } else {
            return "I'm here to help! You can ask me about orders, payments, products, or account management.";
        }
    }
}