package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.DeliveryResponse;
import com.Dairy.assist.entity.Delivery;
import com.Dairy.assist.entity.DeliveryStatus;
import com.Dairy.assist.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Transactional(readOnly = true)
    public ApiResponse<List<DeliveryResponse>> getAllDeliveries() {
        List<Delivery> deliveries = deliveryRepository.findAll();
        
        List<DeliveryResponse> response = deliveries.stream().map(d -> {
            String addressStr = "No Address";
            if (d.getOrder() != null && d.getOrder().getDeliveryAddress() != null) {
                // Fixed: Use getAddressLine() as defined in your Address entity
                addressStr = d.getOrder().getDeliveryAddress().getAddressLine();
            }

            return new DeliveryResponse(
                d.getDeliveryId(),
                d.getOrder() != null ? d.getOrder().getOrderId() : null,
                (d.getOrder() != null && d.getOrder().getUser() != null) ? d.getOrder().getUser().getName() : "N/A",
                (d.getOrder() != null && d.getOrder().getUser() != null) ? d.getOrder().getUser().getPhone() : "N/A",
                addressStr,
                d.getStatus(),
                d.getAssignedAt() // Fixed: Use getAssignedAt() from your Delivery entity
            );
        }).collect(Collectors.toList());

        return ApiResponse.success("All deliveries fetched successfully", response);
    }

    @Transactional(readOnly = true)
    public ApiResponse<Delivery> getDelivery(Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElse(null);
        if (delivery == null) return ApiResponse.error("Delivery not found");
        return ApiResponse.success("Delivery details", delivery);
    }

    @Transactional
    public ApiResponse<String> updateStatus(Long deliveryId, DeliveryStatus status, String driverName, String contactNumber) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElse(null);
        if (delivery == null) return ApiResponse.error("Delivery not found");
        
        if (driverName != null) delivery.setAssignedDriverName(driverName);
        if (contactNumber != null) delivery.setContactNumber(contactNumber);
        delivery.setStatus(status);
        
        deliveryRepository.save(delivery);
        return ApiResponse.success("Delivery updated successfully", null);
    }
}