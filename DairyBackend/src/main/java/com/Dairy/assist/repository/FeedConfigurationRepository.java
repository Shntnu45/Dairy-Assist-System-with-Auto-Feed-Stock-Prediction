package com.Dairy.assist.repository;

import com.Dairy.assist.entity.FeedConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedConfigurationRepository extends JpaRepository<FeedConfiguration, Long> {
    
    // Gets the most recently updated configuration
    FeedConfiguration findTopByOrderByLastUpdatedDesc();
}