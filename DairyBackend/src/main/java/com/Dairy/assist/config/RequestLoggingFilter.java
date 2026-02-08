package com.Dairy.assist.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        
        // Skip logging for static resources and actuator
        if (!uri.contains("/swagger") && !uri.contains("/v3/api-docs") && 
            !uri.contains("/webjars") && !uri.contains("/actuator")) {
            
            System.out.println("🌐 [" + timestamp + "] " + method + " " + uri);
        }
        
        filterChain.doFilter(request, response);
        
        // Log response status for API calls
        if (uri.startsWith("/api/")) {
            int status = response.getStatus();
            String statusIcon = status < 400 ? "✅" : "❌";
            System.out.println("   " + statusIcon + " Response: " + status);
        }
    }
}