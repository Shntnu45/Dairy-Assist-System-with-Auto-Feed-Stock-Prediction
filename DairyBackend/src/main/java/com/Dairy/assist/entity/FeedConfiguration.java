package com.Dairy.assist.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_configuration")
public class FeedConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long configId;

    @Column(nullable = false)
    private Integer totalAnimals;

    @Column(nullable = false)
    private Double feedPerAnimal;

    @Column(nullable = false)
    private Double totalStock;

    @Column(nullable = false)
    private Double thresholdLimit;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public Long getConfigId() { return configId; }
    public void setConfigId(Long configId) { this.configId = configId; }
    public Integer getTotalAnimals() { return totalAnimals; }
    public void setTotalAnimals(Integer totalAnimals) { this.totalAnimals = totalAnimals; }
    public Double getFeedPerAnimal() { return feedPerAnimal; }
    public void setFeedPerAnimal(Double feedPerAnimal) { this.feedPerAnimal = feedPerAnimal; }
    public Double getTotalStock() { return totalStock; }
    public void setTotalStock(Double totalStock) { this.totalStock = totalStock; }
    public Double getThresholdLimit() { return thresholdLimit; }
    public void setThresholdLimit(Double thresholdLimit) { this.thresholdLimit = thresholdLimit; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}