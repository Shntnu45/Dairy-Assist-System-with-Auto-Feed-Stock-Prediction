package com.Dairy.assist.dto;

import com.fasterxml.jackson.annotation.JsonProperty; // Import this!
import java.util.List;

public class ProductRequest {
    private String name;
    private String description;
    private String category;
    
    // ************************************************************************
    // FIX: @JsonProperty("image") tells Spring: 
    // "When the frontend sends 'image', put it into this 'imageUrl' variable."
    // ************************************************************************
    @JsonProperty("image") 
    private String imageUrl; 
    
    private Double basePrice;
    private List<VariantRequest> variants;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public List<VariantRequest> getVariants() { return variants; }
    public void setVariants(List<VariantRequest> variants) { this.variants = variants; }
}