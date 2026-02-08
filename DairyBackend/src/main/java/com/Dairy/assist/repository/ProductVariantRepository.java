package com.Dairy.assist.repository;

import com.Dairy.assist.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductProductIdAndIsActiveTrue(Long productId);
    List<ProductVariant> findByProductProductId(Long productId);
}