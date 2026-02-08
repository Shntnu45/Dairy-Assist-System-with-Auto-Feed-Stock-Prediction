package com.Dairy.assist.service.impl;

import com.Dairy.assist.dto.*;
import com.Dairy.assist.entity.*;
import com.Dairy.assist.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class CartService {
    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductVariantRepository variantRepository;

    public ApiResponse<String> addToCart(String email, CartRequest request) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        ProductVariant variant = variantRepository.findById(request.getVariantId()).orElse(null);
        if (variant == null) return ApiResponse.error("Product variant not found");
        if (!variant.isActive()) return ApiResponse.error("Product variant not available");
        if (variant.getStockQuantity() < request.getQuantity()) {
            return ApiResponse.error("Insufficient stock");
        }

        Optional<Cart> existingCart = cartRepository.findByUserUserIdAndVariantVariantId(
                user.getUserId(), request.getVariantId());

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            int newQuantity = cart.getQuantity() + request.getQuantity();
            if (variant.getStockQuantity() < newQuantity) {
                return ApiResponse.error("Insufficient stock for total quantity");
            }
            cart.setQuantity(newQuantity);
            cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            cart.setVariant(variant);
            cart.setQuantity(request.getQuantity());
            cartRepository.save(cart);
        }

        return ApiResponse.success("Added to cart", null);
    }

    public ApiResponse<String> updateCart(String email, Long cartId, Integer quantity) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null || !cart.getUser().getUserId().equals(user.getUserId())) {
            return ApiResponse.error("Cart item not found");
        }

        cart.setQuantity(quantity);
        cartRepository.save(cart);
        return ApiResponse.success("Cart updated", null);
    }

    public ApiResponse<String> removeFromCart(String email, Long cartId) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        Cart cart = cartRepository.findById(cartId).orElse(null);
        if (cart == null || !cart.getUser().getUserId().equals(user.getUserId())) {
            return ApiResponse.error("Cart item not found");
        }

        cartRepository.delete(cart);
        return ApiResponse.success("Item removed from cart", null);
    }

    @Transactional
    public ApiResponse<String> clearCart(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        cartRepository.deleteByUserUserId(user.getUserId());
        return ApiResponse.success("Cart cleared", null);
    }

    public ApiResponse<Map<String, Object>> getCart(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        List<Cart> cartItems = cartRepository.findByUserUserId(user.getUserId());
        
        // Recalculate totals from backend (never trust frontend)
        double subtotal = 0.0;
        int totalItems = 0;
        
        for (Cart item : cartItems) {
            double itemTotal = item.getVariant().getPrice() * item.getQuantity();
            subtotal += itemTotal;
            totalItems += item.getQuantity();
        }

        Map<String, Object> cartData = new HashMap<>();
        cartData.put("items", cartItems);
        cartData.put("subtotal", Math.round(subtotal * 100.0) / 100.0); // Round to 2 decimals
        cartData.put("totalItems", totalItems);
        cartData.put("finalAmount", Math.round(subtotal * 100.0) / 100.0);

        return ApiResponse.success("Cart data", cartData);
    }

    public ApiResponse<String> addCustomToCart(String email, Map<String, Object> request) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ApiResponse.error("User not found");

        Long productId = Long.valueOf(request.get("productId").toString());
        String size = request.get("size").toString();
        Double price = Double.valueOf(request.get("price").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        // Create or find a temporary variant for custom size
        ProductVariant customVariant = new ProductVariant();
        customVariant.setSize(size);
        customVariant.setPrice(price);
        customVariant.setStockQuantity(999); // High stock for custom variants
        customVariant.setActive(true);
        
        // Find the product
        Product product = new Product();
        product.setProductId(productId);
        customVariant.setProduct(product);
        
        // Save the custom variant
        customVariant = variantRepository.save(customVariant);

        // Add to cart
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setVariant(customVariant);
        cart.setQuantity(quantity);
        cartRepository.save(cart);

        return ApiResponse.success("Custom variant added to cart", null);
    }
}