package com.Dairy.assist.service.impl;

import com.Dairy.assist.entity.*;
import com.Dairy.assist.entity.Role;
import com.Dairy.assist.entity.ReorderStatus;
import com.Dairy.assist.repository.FeedConfigurationRepository;
import com.Dairy.assist.repository.FeedAnalyticsRepository;
import com.Dairy.assist.repository.FeedReorderRepository;
import com.Dairy.assist.repository.UserRepository;
import com.Dairy.assist.service.impl.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class FeedSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(FeedSchedulerService.class);

    @Autowired private FeedConfigurationRepository configRepository;
    @Autowired private FeedAnalyticsRepository analyticsRepository;
    @Autowired private FeedReorderRepository reorderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private NotificationService notificationService;

    @Scheduled(cron = "0 0 1 * * ?")
    public void calculateDailyFeedConsumption() {
        FeedConfiguration config = configRepository.findTopByOrderByLastUpdatedDesc();
        if (config == null) return;

        double dailyConsumption = config.getTotalAnimals() * config.getFeedPerAnimal();
        FeedAnalytics lastAnalytics = analyticsRepository.findTopByOrderByDateDesc();
        
        double currentStock = lastAnalytics != null ? 
            lastAnalytics.getRemainingStock() - dailyConsumption : 
            config.getTotalStock() - dailyConsumption;

        currentStock = Math.max(0, currentStock);

        LocalDate depletionDate = (currentStock > 0 && dailyConsumption > 0) ? 
            LocalDate.now().plusDays((long) Math.ceil(currentStock / dailyConsumption)) : null;

        FeedAnalytics analytics = new FeedAnalytics();
        analytics.setDate(LocalDate.now());
        analytics.setDailyConsumption(dailyConsumption);
        analytics.setRemainingStock(currentStock);
        analytics.setPredictedDepletionDate(depletionDate);
        analyticsRepository.save(analytics);

        if (currentStock <= config.getThresholdLimit()) {
            notifyAdmins("Low stock", "Stock is at " + currentStock);
            generateReorderRequest(config, currentStock);
        }
    }

    private void generateReorderRequest(FeedConfiguration config, double currentStock) {
        boolean hasPending = reorderRepository.findAllByOrderByRequestDateDesc().stream()
                .anyMatch(r -> r.getStatus() == ReorderStatus.GENERATED);

        if (!hasPending) {
            FeedReorder reorder = new FeedReorder();
            reorder.setQuantityRequested((config.getThresholdLimit() * 2) - currentStock);
            reorder.setStatus(ReorderStatus.GENERATED);
            reorder.setRequestDate(LocalDateTime.now());
            reorderRepository.save(reorder);
        }
    }

    private void notifyAdmins(String title, String message) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN && !u.isDeleted())
                .forEach(admin -> notificationService.createNotification(admin, title, message));
    }
}