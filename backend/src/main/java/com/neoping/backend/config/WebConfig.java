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
                                "http://172.20.10.2:8081",
                                "http://172.20.10.2:19000",
                                "http://172.20.10.2:19006",
                                "exp://172.20.10.2:8081",
                                "exp://172.20.10.2:19000",
                                "http://192.168.200.160:8081", // <-- add this for web on LAN
                                "http://192.168.200.160:8082", // <-- add this for direct API calls
                                "exp://192.168.200.160:8081", // <-- add this for Expo Go
                                "http://192.168.200.160:19000", // <-- add this for Expo dev tools
                                "http://192.168.200.160:19006" // <-- add this for Expo dev tools
                )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
