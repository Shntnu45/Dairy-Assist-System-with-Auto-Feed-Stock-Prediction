package com.Dairy.assist.repository;

import com.Dairy.assist.entity.OtpStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpStorageRepository extends JpaRepository<OtpStorage, Long> {
    Optional<OtpStorage> findByEmail(String email);
    
    @Modifying
    @Transactional
    void deleteByEmail(String email);
    
    @Modifying
    @Transactional
    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}