package com.Dairy.assist.repository;

import com.Dairy.assist.entity.Order;
import com.Dairy.assist.enums.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // FIX: Forces data to load immediately
    @Override
    @EntityGraph(attributePaths = {"orderItems", "user", "deliveryAddress"})
    List<Order> findAll();

    @EntityGraph(attributePaths = {"orderItems", "user"})
    List<Order> findByUserUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findByUserUserId(Long userId);
    long countByUserUserIdAndStatus(Long userId, OrderStatus status);
    long countByStatus(OrderStatus status);
}