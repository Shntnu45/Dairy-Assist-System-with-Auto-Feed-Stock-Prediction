package com.Dairy.assist.controller;

import com.Dairy.assist.dto.*;
import com.Dairy.assist.service.impl.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart Management", description = "Shopping cart APIs")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    @Operation(summary = "Add product to cart")
    public ApiResponse<String> addToCart(Authentication auth, @Valid @RequestBody CartRequest request) {
        return cartService.addToCart(auth.getName(), request);
    }

    @PostMapping("/add-custom")
    @Operation(summary = "Add custom product variant to cart")
    public ApiResponse<String> addCustomToCart(Authentication auth, @RequestBody Map<String, Object> request) {
        return cartService.addCustomToCart(auth.getName(), request);
    }

    @PutMapping("/update")
    @Operation(summary = "Update cart item quantity")
    public ApiResponse<String> updateCart(Authentication auth, 
                                        @RequestParam Long cartId, 
                                        @RequestParam Integer quantity) {
        return cartService.updateCart(auth.getName(), cartId, quantity);
    }

    @DeleteMapping("/remove/{cartItemId}")
    @Operation(summary = "Remove item from cart")
    public ApiResponse<String> removeFromCart(Authentication auth, @PathVariable Long cartItemId) {
        return cartService.removeFromCart(auth.getName(), cartItemId);
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear entire cart")
    public ApiResponse<String> clearCart(Authentication auth) {
        return cartService.clearCart(auth.getName());
    }

    @GetMapping
    @Operation(summary = "View cart with totals")
    public ApiResponse<Map<String, Object>> getCart(Authentication auth) {
        return cartService.getCart(auth.getName());
    }
}