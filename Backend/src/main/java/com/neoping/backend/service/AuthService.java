package com.neoping.backend.service;

import java.time.Instant;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neoping.backend.dto.AuthenticationResponse;
import com.neoping.backend.dto.LoginRequest;
import com.neoping.backend.dto.RegisterRequest;
import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.NotBlank;
import com.neoping.backend.model.NotificationEmail;
import com.neoping.backend.model.User;
import com.neoping.backend.model.VerificationToken;
import com.neoping.backend.repository.UserRepository;
import com.neoping.backend.repository.VerificationTokenRepository;
import com.neoping.backend.security.JwtProvider;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    @Transactional
    public void signup(RegisterRequest registerRequest) {
        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .created(Instant.now())
                .enabled(true)
                .build();
        userRepository.save(user);

        String token = generateVerificationToken(user);
        mailService.sendMail(new NotificationEmail(
                "Please Activate your Account",
                user.getEmail(),
                "Thank you for signing up to NeoPing, " +
                        "please click on the below url to activate your account: " +
                        "http://localhost:8082/api/auth/accountVerification/" + token));
    }

    @Transactional
    public void verifyAccount(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new SpringRedditException("Invalid Token"));

        // fetchUserAndEnable(verificationToken.get());
        fetchUserAndEnable(verificationToken);

    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        logger.info("Attempting to authenticate user: {}", loginRequest.getUsername());
        try {
            Authentication authenticate = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));
            logger.info("Authentication successful for user: {}", loginRequest.getUsername());
            SecurityContextHolder.getContext().setAuthentication(authenticate);
            String token = jwtProvider.generateToken(authenticate);
            logger.info("Generated JWT token for user: {}", loginRequest.getUsername());
            AuthenticationResponse response = new AuthenticationResponse();
            response.setToken(token);
            response.setUsername(loginRequest.getUsername());
            logger.info("Returning authentication response for user: {}", loginRequest.getUsername());
            return response;
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new SpringRedditException("Authentication failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public User getCurrentUser() {
        org.springframework.security.core.Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new SpringRedditException("User not found with username: " + username));
    }

    private String generateVerificationToken(User user) {
        String verificationToken = UUID.randomUUID().toString();
        VerificationToken verificationTokenEntity = new VerificationToken();
        verificationTokenEntity.setToken(verificationToken);
        verificationTokenEntity.setUser(user);

        verificationTokenRepository.save(verificationTokenEntity);
        return verificationToken;
    }

    private void fetchUserAndEnable(VerificationToken verificationToken) {
        @NotBlank(message = "Username is Required")
        String username = verificationToken.getUser().getUsername();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new SpringRedditException("User not found with username: " + username));

        user.setEnabled(true);

    }

}
