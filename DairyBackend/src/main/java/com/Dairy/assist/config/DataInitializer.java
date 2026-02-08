package com.Dairy.assist.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.Dairy.assist.entity.*;
import com.Dairy.assist.enums.*; 
import com.Dairy.assist.repository.*;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByRole(Role.ADMIN)) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@dairy.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setStatus(AccountStatus.ACTIVE);
            userRepository.save(admin);
            System.out.println("✅ Default ADMIN user created: admin@dairy.com");
        }
    }
}