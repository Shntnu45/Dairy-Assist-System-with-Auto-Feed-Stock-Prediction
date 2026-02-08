package com.Dairy.assist.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_reorders")
public class FeedReorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reorderId;

    // Standardized field name for both services and frontend
    private Double quantityRequested;

    private LocalDateTime requestDate;
    
    @Enumerated(EnumType.STRING)
    private ReorderStatus status;

    private LocalDateTime adminActionDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Fields for Frontend Mapping
    private String priority = "MEDIUM";
    private String reason = "Stock below threshold";

    // --- Standard Getters and Setters ---

    public Long getReorderId() { return reorderId; }
    public void setReorderId(Long reorderId) { this.reorderId = reorderId; }

    public Double getQuantityRequested() { return quantityRequested; }
    public void setQuantityRequested(Double quantityRequested) { this.quantityRequested = quantityRequested; }

    // Aliases to support AdminFeedService without errors
    public void setQuantityToOrder(Double qty) { this.quantityRequested = qty; }
    public Double getQuantityToOrder() { return quantityRequested; }

    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }

    public ReorderStatus getStatus() { return status; }
    public void setStatus(ReorderStatus status) { this.status = status; }

    public LocalDateTime getAdminActionDate() { return adminActionDate; }
    public void setAdminActionDate(LocalDateTime adminActionDate) { this.adminActionDate = adminActionDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}