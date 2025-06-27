package com.neoping.backend.service;

import java.time.Instant;
import java.util.UUID;

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

@AllArgsConstructor
@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    @Transactional
    public void signup(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setCreated(Instant.now());
        user.setEnabled(false);
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
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authenticate);
        String token = jwtProvider.generateToken(authenticate);
        return new AuthenticationResponse(token, loginRequest.getUsername());
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
