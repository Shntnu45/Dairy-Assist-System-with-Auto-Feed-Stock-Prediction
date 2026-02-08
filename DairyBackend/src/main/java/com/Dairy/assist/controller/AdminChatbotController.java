package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/admin/chatbot", "/admin/chatbot"})
@Tag(name = "Admin - Chatbot", description = "Read-only admin chatbot APIs")
public class AdminChatbotController {

    @PostMapping("/query")
    @Operation(summary = "Ask admin chatbot")
    public ApiResponse<String> askChatbot(@RequestParam String query) {
        String response = generateResponse(query.toLowerCase());
        return ApiResponse.success("Chatbot response", response);
    }

    @GetMapping("/faqs")
    @Operation(summary = "Get admin chatbot FAQs")
    public ApiResponse<List<Map<String, String>>> getFaqs() {
        List<Map<String, String>> faqs = Arrays.asList(
                Map.of("question", "How do I manage users?",
                        "answer", "Use the Admin > Users section to view, update, deactivate, or soft delete users."),
                Map.of("question", "How can I track orders and payments?",
                        "answer", "Use the Admin > Orders and Admin > Payments dashboards for full visibility."),
                Map.of("question", "How does feed prediction work?",
                        "answer", "Configure feed in Admin > Feed Config. The system logs daily usage and predicts depletion."),
                Map.of("question", "How are feed reorder alerts generated?",
                        "answer", "When stock goes below the threshold, the system generates a reorder and notifies admins.")
        );
        return ApiResponse.success("Admin FAQs", faqs);
    }

    private String generateResponse(String query) {
        if (query.contains("user")) {
            return "Use the Admin User Management dashboard to view and manage registered users.";
        } else if (query.contains("order") || query.contains("payment")) {
            return "Use the Admin Orders and Payments dashboards to review and update order/payment statuses.";
        } else if (query.contains("feed") || query.contains("prediction")) {
            return "Feed prediction is configured in Admin Feed Config and monitored via Feed Analytics and Reorders.";
        } else if (query.contains("reorder")) {
            return "Reorder requests are auto-generated when stock is low. Approve them from the Feed Reorders tab.";
        } else {
            return "I'm the admin assistant. Ask me about managing users, products, orders, payments, deliveries, or feed prediction.";
        }
    }
}


