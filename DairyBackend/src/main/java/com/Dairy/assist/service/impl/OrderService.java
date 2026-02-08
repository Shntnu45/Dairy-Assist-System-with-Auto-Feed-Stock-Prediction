package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.AdminOrderResponse; 
import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.OrderResponse;
import com.Dairy.assist.entity.*;
import com.Dairy.assist.enums.OrderStatus;
import com.Dairy.assist.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private DeliveryRepository deliveryRepository;

    @Transactional(readOnly = true)
    public ApiResponse<Map<String, Object>> previewCheckout(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Cart> cartItems = cartRepository.findByUserUserId(user.getUserId());
        if (cartItems.isEmpty()) return ApiResponse.error("Cart is empty");
        double subtotal = cartItems.stream()
                .mapToDouble(item -> item.getVariant().getPrice() * item.getQuantity()).sum();
        Map<String, Object> data = new HashMap<>();
        data.put("items", cartItems);
        data.put("subtotal", subtotal);
        data.put("totalItems", cartItems.size());
        data.put("finalAmount", subtotal);
        return ApiResponse.success("Checkout preview", data);
    }

    @Transactional
    public ApiResponse<String> placeOrder(String email, Long addressId, String razorpayTxnId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Address address = addressRepository.findById(addressId).orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getUserId().equals(user.getUserId())) return ApiResponse.error("Unauthorized address");
        List<Cart> cartItems = cartRepository.findByUserUserId(user.getUserId());
        if (cartItems.isEmpty()) return ApiResponse.error("Cart is empty");

        double total = cartItems.stream().mapToDouble(item -> item.getVariant().getPrice() * item.getQuantity()).sum();
        Order order = new Order();
        order.setUser(user);
        order.setDeliveryAddress(address);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setOrderDate(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> items = cartItems.stream().map(ci -> {
            OrderItem oi = new OrderItem();
            oi.setOrder(savedOrder);
            oi.setVariant(ci.getVariant());
            oi.setQuantity(ci.getQuantity());
            oi.setPriceAtOrder(ci.getVariant().getPrice());
            return oi;
        }).collect(Collectors.toList());
        orderItemRepository.saveAll(items);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setRazorpayTxnId(razorpayTxnId);
        payment.setAmount(total);
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        Delivery delivery = new Delivery();
        delivery.setOrder(savedOrder);
        delivery.setAssignedDriverName("Pending Assignment");
        delivery.setContactNumber("N/A");
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        deliveryRepository.save(delivery);

        cartRepository.deleteByUserUserId(user.getUserId());
        return ApiResponse.success("Order placed successfully", "ORDER_ID=" + savedOrder.getOrderId());
    }

    @Transactional(readOnly = true)
    public ApiResponse<List<OrderResponse>> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByUserUserIdOrderByOrderDateDesc(user.getUserId());
        
        List<OrderResponse> response = orders.stream().map(order -> new OrderResponse(
                order.getOrderId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getOrderItems() != null ? order.getOrderItems().size() : 0
        )).collect(Collectors.toList());

        return ApiResponse.success("Orders fetched successfully", response);
    }

    @Transactional(readOnly = true)
    public ApiResponse<Order> getOrderById(String email, Long orderId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderRepository.findById(orderId).orElse(null);
        
        if (order == null || !order.getUser().getUserId().equals(user.getUserId())) {
            return ApiResponse.error("Order not found");
        }
        return ApiResponse.success("Order details fetched", order);
    }

    // *****************************************************************
    // FIX: Method for Admin Order Management
    // Updated to include the itemCount to match the 6-argument DTO
    // *****************************************************************
    @Transactional(readOnly = true)
    public ApiResponse<List<AdminOrderResponse>> getAllOrdersAdmin() {
        List<Order> orders = orderRepository.findAll();
        
        List<AdminOrderResponse> response = orders.stream().map(order -> new AdminOrderResponse(
                order.getOrderId(),
                order.getUser() != null ? order.getUser().getName() : "Unknown Customer",
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getOrderItems() != null ? order.getOrderItems().size() : 0 // ADDED 6th ARGUMENT
        )).collect(Collectors.toList());

        return ApiResponse.success("All Admin Orders fetched", response);
    }
}