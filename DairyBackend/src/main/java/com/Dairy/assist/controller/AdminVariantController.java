package com.Dairy.assist.controller;

import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.dto.VariantRequest;
import com.Dairy.assist.entity.ProductVariant;
import com.Dairy.assist.service.impl.AdminProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/admin/variants", "/admin/variants"})
@Tag(name = "Admin - Variants", description = "Admin product variant management APIs (flat endpoints)")
public class AdminVariantController {

    @Autowired
    private AdminProductService adminProductService;

    @PutMapping("/{variantId}")
    @Operation(summary = "Update variant")
    public ApiResponse<ProductVariant> updateVariant(@PathVariable Long variantId,
                                                     @RequestBody VariantRequest request) {
        return adminProductService.updateVariant(variantId, request);
    }

    @PatchMapping("/{variantId}/status")
    @Operation(summary = "Enable/Disable variant")
    public ApiResponse<String> updateVariantStatus(@PathVariable Long variantId,
                                                   @RequestParam boolean active) {
        return adminProductService.updateVariantStatus(variantId, active);
    }

    @DeleteMapping("/{variantId}")
    @Operation(summary = "Delete variant")
    public ApiResponse<String> deleteVariant(@PathVariable Long variantId) {
        return adminProductService.deleteVariant(variantId);
    }
}


