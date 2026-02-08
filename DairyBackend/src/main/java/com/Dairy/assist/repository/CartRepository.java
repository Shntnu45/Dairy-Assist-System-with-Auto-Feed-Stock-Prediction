package com.Dairy.assist.repository;

import com.Dairy.assist.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserUserId(Long userId);
    Optional<Cart> findByUserUserIdAndVariantVariantId(Long userId, Long variantId);
    void deleteByUserUserId(Long userId);
}