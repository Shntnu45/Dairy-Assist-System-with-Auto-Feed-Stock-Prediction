package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Product;
import com.Dairy.assist.entity.ProductStatus; // Import this
import com.Dairy.assist.entity.ProductVariant;
import com.Dairy.assist.repository.ProductRepository;
import com.Dairy.assist.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    public ApiResponse<List<Product>> getAllProducts() {
        // FIX: Fetch ONLY 'ACTIVE' products for the user dashboard
        // Old code: return ApiResponse.success("...", productRepository.findAll());
        List<Product> activeProducts = productRepository.findByStatus(ProductStatus.ACTIVE);
        return ApiResponse.success("All active products", activeProducts);
    }

    public ApiResponse<Product> getProductById(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        // Optional: Block access if product is INACTIVE
        if (product == null || product.getStatus() == ProductStatus.INACTIVE) {
            return ApiResponse.error("Product not found or unavailable");
        }
        return ApiResponse.success("Product details", product);
    }

    public ApiResponse<List<ProductVariant>> getProductVariants(Long productId) {
        // Optional: Filter only active variants if needed
        List<ProductVariant> variants = variantRepository.findByProductProductId(productId);
        return ApiResponse.success("Product variants", variants);
    }

    public ApiResponse<ProductVariant> getVariantById(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId).orElse(null);
        if (variant == null) {
            return ApiResponse.error("Variant not found");
        }
        return ApiResponse.success("Variant details", variant);
    }
}