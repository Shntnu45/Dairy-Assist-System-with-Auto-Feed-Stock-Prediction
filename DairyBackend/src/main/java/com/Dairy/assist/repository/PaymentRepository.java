package com.Dairy.assist.repository;

import com.Dairy.assist.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderUserUserIdOrderByPaymentDateDesc(Long userId);
    Optional<Payment> findByRazorpayTxnId(String razorpayTxnId);
}