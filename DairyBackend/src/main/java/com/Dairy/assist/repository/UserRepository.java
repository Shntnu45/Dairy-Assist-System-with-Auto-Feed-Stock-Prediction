package com.Dairy.assist.repository;

import com.Dairy.assist.entity.User;
import com.Dairy.assist.entity.Role; 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByRole(Role role);

    Page<User> findByDeletedFalse(Pageable pageable);

    Optional<User> findByUserIdAndDeletedFalse(Long userId);

    long countByDeletedFalse();
}