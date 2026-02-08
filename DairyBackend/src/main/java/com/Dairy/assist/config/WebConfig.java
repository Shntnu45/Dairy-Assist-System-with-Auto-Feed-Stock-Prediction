package com.Dairy.assist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Define the folder name
        String folderName = "uploads";
        Path uploadDir = Paths.get(folderName);

        // 1. Create the folder if it doesn't exist (CRITICAL FIX)
        // This ensures the path actually exists on the disk so Spring can read it.
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                System.out.println("📁 Created 'uploads' directory at: " + uploadDir.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("❌ Could not create uploads directory: " + e.getMessage());
        }

        // 2. Get the absolute path safely (Handles spaces in 'Newww project' using URI)
        String uploadPath = uploadDir.toAbsolutePath().toUri().toString();
        
        // 3. Print it to the console so we can debug exactly where it is looking
        System.out.println("--------------------------------------------------");
        System.out.println("SERVING IMAGES FROM: " + uploadPath);
        System.out.println("--------------------------------------------------");

        // 4. Map the URL /uploads/** to the file system path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);

        // 5. (Optional) Map /assets/** to the internal classpath for static app images
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");
    }
}