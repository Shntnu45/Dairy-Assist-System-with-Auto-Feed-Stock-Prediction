package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.enums.OrderStatus;
import com.Dairy.assist.repository.OrderRepository;
import com.Dairy.assist.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/dashboard")
@Tag(name = "User Dashboard", description = "User dashboard overview APIs")
public class DashboardController {

    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;

    @GetMapping("/overview")
    @Operation(summary = "Dashboard overview summary")
    public ApiResponse<Map<String, Object>> overview(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        List<com.Dairy.assist.entity.Order> orders =
                orderRepository.findByUserUserIdOrderByOrderDateDesc(user.getUserId());

        long totalOrdersPlaced = orders.size();
        long activeOrdersCount = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.DELIVERED && o.getStatus() != OrderStatus.CANCELLED)
                .count();

        String lastOrderStatus = orders.isEmpty() ? null : orders.get(0).getStatus().name();

        Map<String, Object> data = new HashMap<>();
        data.put("welcome", "Welcome " + (user.getName() != null ? user.getName() : "User"));
        data.put("userName", user.getName());
        data.put("activeOrdersCount", activeOrdersCount);
        data.put("lastOrderStatus", lastOrderStatus);
        data.put("totalOrdersPlaced", totalOrdersPlaced);
        data.put("quickLinks", List.of(
                Map.of("label", "Browse Products", "path", "/products"),
                Map.of("label", "My Orders", "path", "/orders"),
                Map.of("label", "My Payments", "path", "/payments"),
                Map.of("label", "My Profile", "path", "/profile")
        ));

        return ApiResponse.success("Dashboard overview", data);
    }
}


