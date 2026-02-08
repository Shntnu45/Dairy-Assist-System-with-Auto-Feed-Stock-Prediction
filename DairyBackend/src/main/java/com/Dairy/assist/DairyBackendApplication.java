package com.Dairy.assist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DairyBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DairyBackendApplication.class, args);
    }
}
