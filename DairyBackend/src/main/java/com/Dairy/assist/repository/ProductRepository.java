package com.Dairy.assist.repository;

import com.Dairy.assist.entity.Product;
import com.Dairy.assist.entity.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
}