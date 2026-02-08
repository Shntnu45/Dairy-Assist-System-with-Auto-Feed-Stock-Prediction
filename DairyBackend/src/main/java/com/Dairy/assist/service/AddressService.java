package com.Dairy.assist.service;

import com.Dairy.assist.dto.AddressRequest;
import com.Dairy.assist.dto.ApiResponse;
import com.Dairy.assist.entity.Address;
import com.Dairy.assist.entity.User;
import com.Dairy.assist.repository.AddressRepository;
import com.Dairy.assist.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public ApiResponse addAddress(String email, AddressRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.isDefault()) {
            List<Address> addresses = addressRepository.findByUser(user);
            for (Address a : addresses) {
                a.setDefault(false);
            }
            addressRepository.saveAll(addresses);
        }

        Address address = new Address();
        address.setUser(user);
        address.setAddressLine(request.getAddressLine());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
        address.setDefault(request.isDefault());

        addressRepository.save(address);

        return ApiResponse.success("Address added successfully", null);
    }

    public ApiResponse getAddresses(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ApiResponse.success("Addresses fetched successfully", addressRepository.findByUser(user));
    }

    public ApiResponse getAddressById(String email, Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return ApiResponse.success("Address fetched", address);
    }

    public ApiResponse updateAddress(String email, Long addressId, AddressRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access");
        }

        address.setAddressLine(request.getAddressLine());
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
        address.setDefault(request.isDefault());

        addressRepository.save(address);

        return ApiResponse.success("Address updated successfully", null);
    }

    public ApiResponse deleteAddress(String email, Long addressId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access");
        }

        addressRepository.delete(address);

        return ApiResponse.success("Address deleted successfully", null);
    }
}
