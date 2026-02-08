package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.ProductRequest;
import com.Dairy.assist.dto.VariantRequest;
import com.Dairy.assist.entity.Product;
import com.Dairy.assist.entity.ProductStatus;
import com.Dairy.assist.entity.ProductVariant;
import com.Dairy.assist.repository.ProductRepository;
import com.Dairy.assist.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success("All products", productRepository.findAll());
    }

    public ApiResponse<Product> getProduct(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }
        return ApiResponse.success("Product details", product);
    }

    public ApiResponse<Product> createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        
        // FIX: Use setImageUrl to map correctly to the DB column 'image_url'
        product.setImageUrl(request.getImageUrl());
        
        product.setStatus(ProductStatus.ACTIVE);
        
        product = productRepository.save(product);
        
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (VariantRequest variantReq : request.getVariants()) {
                if (variantReq.getSize() != null && !variantReq.getSize().isEmpty() && 
                    variantReq.getPrice() != null && variantReq.getPrice() > 0) {
                    
                    ProductVariant variant = new ProductVariant();
                    variant.setProduct(product);
                    variant.setSize(variantReq.getSize());
                    variant.setPrice(variantReq.getPrice());
                    variant.setStockQuantity(variantReq.getStock() != null ? variantReq.getStock() : 100);
                    variant.setActive(true);
                    variantRepository.save(variant);
                }
            }
        }
        
        return ApiResponse.success("Product created", product);
    }

    public ApiResponse<Product> updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        
        // FIX: Update image URL here too
        if (request.getImageUrl() != null && !request.getImageUrl().isEmpty()) {
            product.setImageUrl(request.getImageUrl());
        }
        
        productRepository.save(product);
        return ApiResponse.success("Product updated", product);
    }

    public ApiResponse<String> updateProductStatus(Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }
        product.setStatus(status);
        productRepository.save(product);
        return ApiResponse.success("Product status updated", null);
    }

    public ApiResponse<String> deleteProduct(Long productId) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }
        
        // Soft delete
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
        
        return ApiResponse.success("Product Archived (Soft Deleted)", null);
    }

    public ApiResponse<List<ProductVariant>> getVariants(Long productId) {
        List<ProductVariant> variants = variantRepository.findByProductProductId(productId);
        return ApiResponse.success("Product variants", variants);
    }

    public ApiResponse<ProductVariant> addVariant(Long productId, VariantRequest request) {
        Product product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return ApiResponse.error("Product not found");
        }
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSize(request.getSize());
        variant.setPrice(request.getPrice());
        variant.setStockQuantity(request.getStock() != null ? request.getStock() : 100);
        variant.setActive(true);
        variantRepository.save(variant);
        return ApiResponse.success("Variant added", variant);
    }

    public ApiResponse<ProductVariant> updateVariant(Long variantId, VariantRequest request) {
        ProductVariant variant = variantRepository.findById(variantId).orElse(null);
        if (variant == null) {
            return ApiResponse.error("Variant not found");
        }
        if (request.getSize() != null) variant.setSize(request.getSize());
        if (request.getPrice() != null) variant.setPrice(request.getPrice());
        if (request.getStock() != null) variant.setStockQuantity(request.getStock());
        variantRepository.save(variant);
        return ApiResponse.success("Variant updated", variant);
    }

    public ApiResponse<String> updateVariantStatus(Long variantId, boolean active) {
        ProductVariant variant = variantRepository.findById(variantId).orElse(null);
        if (variant == null) {
            return ApiResponse.error("Variant not found");
        }
        variant.setActive(active);
        variantRepository.save(variant);
        return ApiResponse.success("Variant status updated", null);
    }

    public ApiResponse<String> deleteVariant(Long variantId) {
        ProductVariant variant = variantRepository.findById(variantId).orElse(null);
        if (variant == null) {
            return ApiResponse.error("Variant not found");
        }
        
        // Just mark as inactive/out of stock
        variant.setActive(false);
        variantRepository.save(variant);
        
        return ApiResponse.success("Variant Archived (Soft Deleted)", null);
    }
}