package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Product;
import com.Dairy.assist.entity.ProductVariant;
import com.Dairy.assist.service.impl.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
// REMOVED: @CrossOrigin(origins = "*", allowedHeaders = "*") <--- CAUSES CONFLICT
@Tag(name = "Products", description = "Product browsing APIs")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products")
    public ApiResponse<List<Product>> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get product details")
    public ApiResponse<Product> getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }

    @GetMapping("/{productId}/variants")
    @Operation(summary = "Get product variants")
    public ApiResponse<List<ProductVariant>> getProductVariants(@PathVariable Long productId) {
        return productService.getProductVariants(productId);
    }

    @GetMapping("/variant/{variantId}")
    @Operation(summary = "Get variant details")
    public ApiResponse<ProductVariant> getVariantById(@PathVariable Long variantId) {
        return productService.getVariantById(variantId);
    }
}