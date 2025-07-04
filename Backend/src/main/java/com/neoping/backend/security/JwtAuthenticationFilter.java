package com.neoping.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils; // Add this import
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    // Track tokens that have been used for GET /api/posts
    private static final java.util.Set<String> usedJwtTokensForGetPosts = java.util.Collections.synchronizedSet(new java.util.HashSet<>());

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // Exclude login and all /api/auth/** from JWT filtering
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = getJwtFromRequest(request);
        try {
            if (StringUtils.hasText(jwt) && jwtProvider.validateToken(jwt)) {
                // Only expire the token after it is used for GET /api/posts
                if ("GET".equals(request.getMethod()) && "/api/posts".equals(request.getRequestURI())) {
                    synchronized (usedJwtTokensForGetPosts) {
                        if (usedJwtTokensForGetPosts.contains(jwt)) {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json;charset=UTF-8");
                            String message = "JWT token has expired";
                            long timestamp = System.currentTimeMillis();
                            String jsonResponse = String.format(
                                "{\"timestamp\": %d, \"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\", \"path\": \"%s\"}",
                                timestamp, HttpServletResponse.SC_UNAUTHORIZED, message, path
                            );
                            response.getWriter().write(jsonResponse);
                            return;
                        } else {
                            usedJwtTokensForGetPosts.add(jwt);
                        }
                    }
                }
                String username = jwtProvider.getUsernameFromJwt(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
                        null, userDetails.getAuthorities());
                authentication
                        .setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                                .buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
                return;
            } else {
                // JWT is missing or invalid
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                String message = "Invalid or missing token";
                long timestamp = System.currentTimeMillis();
                String jsonResponse = String.format(
                    "{\"timestamp\": %d, \"status\": %d, \"error\": \"Unauthorized\", \"message\": \"%s\"}",
                    timestamp, HttpServletResponse.SC_UNAUTHORIZED, message
                );
                response.getWriter().write(jsonResponse);
                return;
            }
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");

            String message = "Token has expired";
            long timestamp = System.currentTimeMillis();
            String expiration = e.getClaims() != null && e.getClaims().getExpiration() != null ? e.getClaims().getExpiration().toString() : "unknown";

            String jsonResponse = String.format(
                "{" +
                    "\"status\": %d," +
                    "\"message\": \"%s\"," +
                    "\"timestamp\": %d," +
                    "\"expiration\": \"%s\"" +
                "}",
                401,
                message,
                timestamp,
                expiration
            );
            response.getWriter().write(jsonResponse);
            return;
        }
        
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }
}
