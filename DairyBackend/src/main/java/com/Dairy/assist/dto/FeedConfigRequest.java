package com.Dairy.assist.dto;

public class FeedConfigRequest {
    private Integer totalAnimals;
    private Double feedPerAnimal;
    private Double totalStock;
    private Double thresholdLimit;

    public Integer getTotalAnimals() { return totalAnimals; }
    public void setTotalAnimals(Integer totalAnimals) { this.totalAnimals = totalAnimals; }
    public Double getFeedPerAnimal() { return feedPerAnimal; }
    public void setFeedPerAnimal(Double feedPerAnimal) { this.feedPerAnimal = feedPerAnimal; }
    public Double getTotalStock() { return totalStock; }
    public void setTotalStock(Double totalStock) { this.totalStock = totalStock; }
    public Double getThresholdLimit() { return thresholdLimit; }
    public void setThresholdLimit(Double thresholdLimit) { this.thresholdLimit = thresholdLimit; }
}