package com.neoping.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:8081",
                                "http://localhost:8082",
                                "http://192.168.100.6:8081", // Your IP
                                "http://192.168.100.6:19000", // Expo dev server
                                "http://192.168.100.6:19006", // Alternative Expo port
                                "exp://192.168.100.6:8081", // Expo protocol
                                "exp://192.168.100.6:19000" // Expo protocol alternative
                )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
