package com.Dairy.assist.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.FeedConfigRequest;
import com.Dairy.assist.entity.FeedAnalytics;
import com.Dairy.assist.entity.FeedConfiguration;
import com.Dairy.assist.entity.FeedReorder;
import com.Dairy.assist.entity.ReorderStatus;
import com.Dairy.assist.service.impl.AdminFeedService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping({"/api/admin/feed", "/admin/feed"})
@Tag(name = "Admin - Feed Prediction", description = "Admin feed configuration & analytics APIs")
public class AdminFeedController {

    @Autowired
    private AdminFeedService adminFeedService;

    // --- Configuration ---

    @GetMapping("/config")
    @Operation(summary = "Get current feed configuration")
    public ApiResponse<FeedConfiguration> getConfig() {
        return adminFeedService.getCurrentConfig();
    }

    @PostMapping("/config")
    @Operation(summary = "Create/Update feed configuration (POST)")
    public ApiResponse<FeedConfiguration> saveConfig(@RequestBody FeedConfigRequest request) {
        return adminFeedService.saveConfig(request);
    }

    // FIX: This explicitly handles the PUT request from your frontend
    @PutMapping("/config")
    @Operation(summary = "Update feed configuration (PUT)")
    public ApiResponse<FeedConfiguration> updateConfigDirect(@RequestBody FeedConfigRequest request) {
        return adminFeedService.saveConfig(request);
    }

    @PutMapping("/config/{configId}")
    @Operation(summary = "Update feed configuration by ID")
    public ApiResponse<FeedConfiguration> updateConfig(@PathVariable Long configId,
                                                       @RequestBody FeedConfigRequest request) {
        return adminFeedService.updateConfig(configId, request);
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset feed cycle")
    public ApiResponse<String> resetFeedCycle() {
        return adminFeedService.resetFeedCycle();
    }

    // --- Analytics ---

    @GetMapping("/analytics")
    @Operation(summary = "Get feed analytics history")
    public ApiResponse<List<FeedAnalytics>> getAnalytics() {
        return adminFeedService.getAnalytics();
    }

    @GetMapping("/history")
    public ApiResponse<List<FeedAnalytics>> getHistory() {
        return adminFeedService.getAnalytics();
    }

    @GetMapping("/prediction")
    @Operation(summary = "Get latest feed prediction")
    public ApiResponse<FeedAnalytics> getPrediction() {
        return adminFeedService.getLatestPrediction();
    }

    // --- Reorders ---

    @GetMapping("/reorders")
    @Operation(summary = "Get feed reorder list")
    public ApiResponse<List<FeedReorder>> getReorders() {
        return adminFeedService.getReorders();
    }

    @PatchMapping("/reorders/{reorderId}/approve")
    public ApiResponse<String> approveReorder(@PathVariable Long reorderId) {
        return adminFeedService.updateReorderStatus(reorderId, ReorderStatus.APPROVED);
    }

    @PatchMapping("/reorders/{reorderId}/ignore")
    public ApiResponse<String> ignoreReorder(@PathVariable Long reorderId) {
        return adminFeedService.updateReorderStatus(reorderId, ReorderStatus.REJECTED);
    }

    @PatchMapping("/reorders/{reorderId}/status")
    public ApiResponse<String> updateReorderStatus(@PathVariable Long reorderId,
                                                   @RequestParam ReorderStatus status) {
        return adminFeedService.updateReorderStatus(reorderId, status);
    }

    @GetMapping("/summary")
    public ApiResponse<Map<String, Object>> getSummary() {
        return adminFeedService.getFeedSummary();
    }
}