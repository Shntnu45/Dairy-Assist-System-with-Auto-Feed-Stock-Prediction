package com.Dairy.assist.repository;

import com.Dairy.assist.entity.Address;
import com.Dairy.assist.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
}
