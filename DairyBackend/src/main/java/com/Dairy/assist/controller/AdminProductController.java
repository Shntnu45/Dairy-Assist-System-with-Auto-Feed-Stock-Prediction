package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.ProductRequest;
import com.Dairy.assist.dto.VariantRequest;
import com.Dairy.assist.entity.Product;
import com.Dairy.assist.entity.ProductStatus;
import com.Dairy.assist.entity.ProductVariant;
import com.Dairy.assist.service.impl.AdminProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@Tag(name = "Admin - Products", description = "Admin product & variant management APIs")
public class AdminProductController {

    @Autowired
    private AdminProductService adminProductService;

    @Value("${server.port:8080}")
    private int serverPort;

    @PostMapping("/upload-image")
    @Operation(summary = "Upload product image")
    public ApiResponse<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ApiResponse.error("No file provided");
        }
        try {
            String originalFilename = file.getOriginalFilename();
            String ext = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";
            String filename = "product-" + UUID.randomUUID().toString() + ext;

            // Ensure directory exists
            File uploadDir = new File("uploads");
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            Path filePath = Paths.get(uploadDir.getAbsolutePath(), filename);
            Files.copy(file.getInputStream(), filePath);

            // FIX: Return RELATIVE path. The frontend will prepend 'http://localhost:8080'
            String imageUrl = "/uploads/" + filename;
            
            return ApiResponse.success("Image uploaded", imageUrl);
        } catch (IOException e) {
            return ApiResponse.error("Failed to upload image: " + e.getMessage());
        }
    }

    // --- Products ---

    @GetMapping
    @Operation(summary = "Get all products (admin)")
    public ApiResponse<List<Product>> getAllProducts() {
        return adminProductService.getAllProducts();
    }

    @GetMapping("/{productId}")
    @Operation(summary = "Get product details (admin)")
    public ApiResponse<Product> getProduct(@PathVariable Long productId) {
        return adminProductService.getProduct(productId);
    }

    @PostMapping
    @Operation(summary = "Create new product")
    public ApiResponse<Product> createProduct(@RequestBody ProductRequest request) {
        return adminProductService.createProduct(request);
    }

    @PutMapping("/{productId}")
    @Operation(summary = "Update product details")
    public ApiResponse<Product> updateProduct(@PathVariable Long productId,
                                              @RequestBody ProductRequest request) {
        return adminProductService.updateProduct(productId, request);
    }

    @PatchMapping("/{productId}/status")
    @Operation(summary = "Enable/Disable product")
    public ApiResponse<String> updateProductStatus(@PathVariable Long productId,
                                                   @RequestParam ProductStatus status) {
        return adminProductService.updateProductStatus(productId, status);
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Delete product")
    public ApiResponse<String> deleteProduct(@PathVariable Long productId) {
        return adminProductService.deleteProduct(productId);
    }

    // --- Variants ---

    @GetMapping("/{productId}/variants")
    @Operation(summary = "Get product variants (admin)")
    public ApiResponse<List<ProductVariant>> getVariants(@PathVariable Long productId) {
        return adminProductService.getVariants(productId);
    }

    @PostMapping("/{productId}/variants")
    @Operation(summary = "Add variant to product")
    public ApiResponse<ProductVariant> addVariant(@PathVariable Long productId,
                                                  @RequestBody VariantRequest request) {
        return adminProductService.addVariant(productId, request);
    }

    @PutMapping("/variants/{variantId}")
    @Operation(summary = "Update variant")
    public ApiResponse<ProductVariant> updateVariant(@PathVariable Long variantId,
                                                     @RequestBody VariantRequest request) {
        return adminProductService.updateVariant(variantId, request);
    }

    @PatchMapping("/variants/{variantId}/status")
    @Operation(summary = "Enable/Disable variant")
    public ApiResponse<String> updateVariantStatus(@PathVariable Long variantId,
                                                   @RequestParam boolean active) {
        return adminProductService.updateVariantStatus(variantId, active);
    }

    @DeleteMapping("/variants/{variantId}")
    @Operation(summary = "Delete variant")
    public ApiResponse<String> deleteVariant(@PathVariable Long variantId) {
        return adminProductService.deleteVariant(variantId);
    }
}