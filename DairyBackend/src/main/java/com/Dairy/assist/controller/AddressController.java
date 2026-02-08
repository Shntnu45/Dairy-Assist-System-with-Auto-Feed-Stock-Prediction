package com.Dairy.assist.controller;

import com.Dairy.assist.dto.AddressRequest;
import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping({"/api/user/address", "/api/address"})
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ApiResponse addAddress(Principal principal, @RequestBody AddressRequest request) {
        return addressService.addAddress(principal.getName(), request);
    }

    @GetMapping
    public ApiResponse getAddresses(Principal principal) {
        return addressService.getAddresses(principal.getName());
    }

    @GetMapping("/{id}")
    public ApiResponse getAddressById(Principal principal, @PathVariable Long id) {
        return addressService.getAddressById(principal.getName(), id);
    }

    @PutMapping("/{id}")
    public ApiResponse updateAddress(
            Principal principal,
            @PathVariable Long id,
            @RequestBody AddressRequest request
    ) {
        return addressService.updateAddress(principal.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteAddress(Principal principal, @PathVariable Long id) {
        return addressService.deleteAddress(principal.getName(), id);
    }
}
