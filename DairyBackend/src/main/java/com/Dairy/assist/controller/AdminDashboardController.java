package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.FeedAnalytics;
import com.Dairy.assist.entity.FeedConfiguration;
import com.Dairy.assist.repository.FeedAnalyticsRepository;
import com.Dairy.assist.repository.FeedConfigurationRepository;
import com.Dairy.assist.repository.OrderRepository;
import com.Dairy.assist.repository.ProductRepository;
import com.Dairy.assist.repository.UserRepository;
import com.Dairy.assist.enums.OrderStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin - Dashboard", description = "Dashboard Overview APIs")
public class AdminDashboardController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private FeedConfigurationRepository feedConfigRepo;
    @Autowired private FeedAnalyticsRepository feedAnalyticsRepo;

    @GetMapping("/overview")
    @Operation(summary = "Get dashboard overview stats")
    public ApiResponse<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // *****************************************************************
        // FIX: Changed countByIsDeletedFalse() to countByDeletedFalse()
        // This matches the updated naming in UserRepository and User entity.
        // *****************************************************************
        stats.put("totalUsers", userRepository.countByDeletedFalse());
        
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("pendingOrders", orderRepository.countByStatus(OrderStatus.PENDING));

        // Feed Stats
        FeedConfiguration config = feedConfigRepo.findTopByOrderByLastUpdatedDesc();
        FeedAnalytics analytics = feedAnalyticsRepo.findTopByOrderByDateDesc();

        if (config != null) {
            stats.put("totalAnimals", config.getTotalAnimals());
            stats.put("totalStock", config.getTotalStock());
        }

        if (analytics != null) {
            stats.put("currentStock", analytics.getRemainingStock());
            stats.put("predictedDepletion", analytics.getPredictedDepletionDate());
        }

        return ApiResponse.success("Dashboard stats", stats);
    }
}