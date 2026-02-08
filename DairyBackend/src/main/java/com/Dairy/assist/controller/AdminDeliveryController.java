package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.DeliveryResponse;
import com.Dairy.assist.entity.DeliveryStatus;
import com.Dairy.assist.service.impl.AdminDeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/deliveries")
public class AdminDeliveryController {

    @Autowired
    private AdminDeliveryService adminDeliveryService;

    // FIX: Changed return type to List<DeliveryResponse>
    @GetMapping
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() {
        return adminDeliveryService.getAllDeliveries();
    }

    @PatchMapping("/{deliveryId}/status")
    public ApiResponse<String> updateStatus(
            @PathVariable Long deliveryId, 
            @RequestParam DeliveryStatus status,
            @RequestParam(required = false) String driverName,
            @RequestParam(required = false) String contactNumber) {
        return adminDeliveryService.updateStatus(deliveryId, status, driverName, contactNumber);
    }
}