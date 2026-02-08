package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.OrderResponse;
import com.Dairy.assist.entity.Order;
import com.Dairy.assist.service.impl.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Orders & Checkout")
public class OrderController {

    @Autowired private OrderService orderService;

    @PostMapping("/checkout/preview")
    public ApiResponse<Map<String, Object>> previewCheckout(Authentication auth) {
        return orderService.previewCheckout(auth.getName());
    }

    @PostMapping("/order/place")
    public ApiResponse<String> placeOrder(Authentication auth, 
                                          @RequestParam Long addressId, 
                                          @RequestParam String razorpayTxnId) {
        return orderService.placeOrder(auth.getName(), addressId, razorpayTxnId);
    }

    @GetMapping("/user/orders")
    public ApiResponse<List<OrderResponse>> getUserOrders(Authentication auth) {
        return orderService.getUserOrders(auth.getName());
    }

     @GetMapping("/user/orders/{orderId}")
    public ApiResponse<Order> getOrderById(Authentication auth, @PathVariable Long orderId) {
        return orderService.getOrderById(auth.getName(), orderId);
    }
}