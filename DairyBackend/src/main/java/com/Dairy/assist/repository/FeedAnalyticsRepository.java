package com.Dairy.assist.repository;

import com.Dairy.assist.entity.FeedAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedAnalyticsRepository extends JpaRepository<FeedAnalytics, Long> {
    
    // FIX: This method is required by AdminFeedService
    List<FeedAnalytics> findAllByOrderByDateDesc();

    // FIX: This method is required for the "Latest Prediction"
    FeedAnalytics findTopByOrderByDateDesc();
}