package com.Dairy.assist.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.FeedConfigRequest;
import com.Dairy.assist.entity.FeedAnalytics;
import com.Dairy.assist.entity.FeedConfiguration;
import com.Dairy.assist.entity.FeedReorder;
import com.Dairy.assist.entity.ReorderStatus;
import com.Dairy.assist.repository.FeedAnalyticsRepository;
import com.Dairy.assist.repository.FeedConfigurationRepository;
import com.Dairy.assist.repository.FeedReorderRepository;

@Service
@Transactional
public class AdminFeedService {

    @Autowired
    private FeedConfigurationRepository configRepository;

    @Autowired
    private FeedAnalyticsRepository analyticsRepository;

    @Autowired
    private FeedReorderRepository reorderRepository;

    public ApiResponse<FeedConfiguration> getCurrentConfig() {
        FeedConfiguration config = configRepository.findTopByOrderByLastUpdatedDesc();
        if (config == null) {
            return ApiResponse.success("No config found", new FeedConfiguration()); 
        }
        return ApiResponse.success("Current feed configuration", config);
    }

    /**
     * Saves configuration and triggers both Analytics and Auto-Reorder logic.
     */
    public ApiResponse<FeedConfiguration> saveConfig(FeedConfigRequest request) {
        // 1. Update or Create Configuration
        FeedConfiguration config = configRepository.findTopByOrderByLastUpdatedDesc();
        if (config == null) {
            config = new FeedConfiguration();
        }
        config.setTotalAnimals(request.getTotalAnimals());
        config.setFeedPerAnimal(request.getFeedPerAnimal());
        config.setTotalStock(request.getTotalStock());
        config.setThresholdLimit(request.getThresholdLimit());
        config.setLastUpdated(LocalDateTime.now());
        FeedConfiguration savedConfig = configRepository.save(config);

        // 2. Generate Analytics Prediction
        double dailyUsage = request.getTotalAnimals() * request.getFeedPerAnimal();
        long remainingDays = (dailyUsage > 0) ? (long) (request.getTotalStock() / dailyUsage) : 0;
        
        FeedAnalytics analytics = new FeedAnalytics();
        analytics.setDate(LocalDate.now());
        analytics.setDailyConsumption(dailyUsage);
        analytics.setRemainingStock(request.getTotalStock());
        analytics.setPredictedDepletionDate(LocalDate.now().plusDays(remainingDays));
        analytics.setNotes("Automatic update: " + LocalDateTime.now());
        analyticsRepository.save(analytics);

        // 3. Auto-Reorder Check: Trigger if stock is below threshold
        if (request.getTotalStock() <= request.getThresholdLimit()) {
            // Only create if a reorder isn't already GENERATED or PENDING
            boolean alreadyPending = reorderRepository.findAll().stream()
                    .anyMatch(r -> r.getStatus() == ReorderStatus.GENERATED);
            
            if (!alreadyPending) {
                FeedReorder reorder = new FeedReorder();
                reorder.setQuantityToOrder(request.getThresholdLimit() * 2); 
                reorder.setRequestDate(LocalDateTime.now());
                reorder.setStatus(ReorderStatus.GENERATED);
                reorder.setNotes("Auto-triggered: Stock (" + request.getTotalStock() + "kg) below threshold.");
                reorderRepository.save(reorder);
            }
        }

        return ApiResponse.success("Feed configuration, Analytics, and Reorder check updated", savedConfig);
    }

    public ApiResponse<FeedConfiguration> updateConfig(Long configId, FeedConfigRequest request) {
        return saveConfig(request);
    }

    public ApiResponse<String> resetFeedCycle() {
        analyticsRepository.deleteAll();
        reorderRepository.deleteAll();
        return ApiResponse.success("Feed cycle reset successfully", null);
    }

    public ApiResponse<List<FeedAnalytics>> getAnalytics() {
        List<FeedAnalytics> list = analyticsRepository.findAllByOrderByDateDesc();
        return ApiResponse.success("Feed analytics fetched", list);
    }

    public ApiResponse<FeedAnalytics> getLatestPrediction() {
        FeedAnalytics latest = analyticsRepository.findTopByOrderByDateDesc();
        return ApiResponse.success("Latest prediction", latest);
    }

    public ApiResponse<List<FeedReorder>> getReorders() {
        List<FeedReorder> list = reorderRepository.findAllByOrderByRequestDateDesc();
        return ApiResponse.success("Feed reorders", list);
    }

    public ApiResponse<String> updateReorderStatus(Long reorderId, ReorderStatus status) {
        FeedReorder reorder = reorderRepository.findById(reorderId).orElse(null);
        if (reorder == null) return ApiResponse.error("Reorder not found");
        reorder.setStatus(status);
        reorder.setAdminActionDate(LocalDateTime.now());
        reorderRepository.save(reorder);
        return ApiResponse.success("Reorder status updated", null);
    }

    public ApiResponse<Map<String, Object>> getFeedSummary() {
        Map<String, Object> data = new HashMap<>();
        FeedConfiguration config = configRepository.findTopByOrderByLastUpdatedDesc();
        FeedAnalytics latest = analyticsRepository.findTopByOrderByDateDesc();

        if (config != null) {
            data.put("totalAnimals", config.getTotalAnimals());
            data.put("currentStock", config.getTotalStock());
        }

        if (latest != null) {
            data.put("dailyFeedUsage", latest.getDailyConsumption());
            if (latest.getPredictedDepletionDate() != null) {
                long days = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), latest.getPredictedDepletionDate());
                data.put("remainingFeedDays", Math.max(0, days));
            }
        }

        boolean hasAlert = reorderRepository.findAll().stream()
                .anyMatch(r -> r.getStatus() == ReorderStatus.GENERATED);
        data.put("reorderAlert", hasAlert);

        return ApiResponse.success("Feed summary fetched", data);
    }
}