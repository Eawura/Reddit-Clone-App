package com.neoping.backend.security;

import java.io.IOException;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils; // Add this import
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    // Track tokens that have been used for GET /api/posts
    private static final java.util.Set<String> usedJwtTokensForGetPosts = java.util.Collections
            .synchronizedSet(new java.util.HashSet<>());

    private final JwtProvider jwtProvider;


    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        log.debug("[JWT FILTER] Path: {} Method: {}", path, request.getMethod());

        // ✅ Allow public access ONLY to auth endpoints, health, and status
        if (path.equals("/api/auth/login") ||
                path.equals("/api/auth/signup") ||
                path.equals("/api/auth/refresh/token") ||
                path.equals("/api/auth/logout") ||
                path.startsWith("/api/auth/accountVerification/") ||
                path.startsWith("/api/auth/debug/") ||
                path.equals("/api/health") ||
                path.equals("/api/status")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ ALL other endpoints now require authentication
        String jwt = getJwtFromRequest(request);
        log.debug("[JWT FILTER] Raw JWT: {}", jwt);

        if (StringUtils.hasText(jwt)) {
            boolean valid = false;
            try {
                valid = jwtProvider.validateToken(jwt);
                log.debug("[JWT FILTER] Token valid: {}", valid);
            } catch (Exception e) {
                log.error("[JWT FILTER] Exception during token validation: {}", e.getMessage(), e);
            }
            if (valid) {
                String username = jwtProvider.getUsernameFromJwt(jwt);
                log.debug("[JWT FILTER] Username from JWT: {}", username);
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    log.debug("[JWT FILTER] UserDetails loaded: {}",
                            userDetails != null ? userDetails.getUsername() : null);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    log.error("[JWT FILTER] Exception loading UserDetails: {}", e.getMessage(), e);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Authentication required (user not found)\"}");
                    return;
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Authentication required (invalid token)\"}");
                return;
            }
        } else {
            // ✅ Return 401 for missing/invalid JWT
            log.warn("[JWT FILTER] No JWT found in request");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Authentication required (no token)\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }
}
