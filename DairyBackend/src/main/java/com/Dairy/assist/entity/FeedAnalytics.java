package com.Dairy.assist.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "feed_analytics")
public class FeedAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analyticsId;

    private LocalDate date;
    private Double dailyConsumption;
    private Double remainingStock;
    private LocalDate predictedDepletionDate;

    // FIX: Add this field to solve the "setNotes" undefined error
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Getter and Setter for notes
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // Existing Getters and Setters
    public Long getAnalyticsId() { return analyticsId; }
    public void setAnalyticsId(Long analyticsId) { this.analyticsId = analyticsId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getDailyConsumption() { return dailyConsumption; }
    public void setDailyConsumption(Double dailyConsumption) { this.dailyConsumption = dailyConsumption; }

    public Double getRemainingStock() { return remainingStock; }
    public void setRemainingStock(Double remainingStock) { this.remainingStock = remainingStock; }

    public LocalDate getPredictedDepletionDate() { return predictedDepletionDate; }
    public void setPredictedDepletionDate(LocalDate predictedDepletionDate) { this.predictedDepletionDate = predictedDepletionDate; }
}