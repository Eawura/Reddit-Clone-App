package com.neoping.backend.service;

import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.sql.Date;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neoping.backend.dto.AuthenticationResponse;
import com.neoping.backend.dto.LoginRequest;
import com.neoping.backend.dto.RefreshTokenRequest;
import com.neoping.backend.dto.RegisterRequest;
import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.NotBlank;
import com.neoping.backend.model.NotificationEmail;
import com.neoping.backend.model.RefreshToken;
import com.neoping.backend.model.User;
import com.neoping.backend.model.VerificationToken;
import com.neoping.backend.repository.UserRepository;
import com.neoping.backend.repository.VerificationTokenRepository;
import com.neoping.backend.security.JwtProvider;

import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Value("${jwt.keystore.path}")
    private String keystorePath;

    @Value("${jwt.keystore.password}")
    private String keystorePassword;

    @Value("${jwt.key.alias}")
    private String keyAlias;

    @Value("${jwt.key.password}")
    private String keyPassword;

    @Value("${jwt.keystore.type}")
    private String keystoreType;

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final MailService mailService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;
    private KeyStore keyStore;

    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository,
            VerificationTokenRepository verificationTokenRepository, MailService mailService,
            AuthenticationManager authenticationManager, JwtProvider jwtProvider,
            RefreshTokenService refreshTokenService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.mailService = mailService;
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        this.refreshTokenService = refreshTokenService;
    }

    @PostConstruct
    public void init() {
        initializeKeyStore();
    }

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

        // Check if user exists before attempting authentication
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());
        if (!userOptional.isPresent()) {
            // Try with u/ prefix
            userOptional = userRepository.findByUsername("u/" + loginRequest.getUsername());
            if (!userOptional.isPresent()) {
                // Try partial match
                userOptional = userRepository.findAll().stream()
                        .filter(u -> u.getUsername().toLowerCase().contains(loginRequest.getUsername().toLowerCase()) ||
                                loginRequest.getUsername().toLowerCase().contains(u.getUsername().toLowerCase()))
                        .findFirst();
                if (userOptional.isPresent()) {
                    logger.info("Found user with partial match: {} for input: {}",
                            userOptional.get().getUsername(), loginRequest.getUsername());
                }
            } else {
                logger.info("Found user with u/ prefix: {} for input: {}",
                        userOptional.get().getUsername(), loginRequest.getUsername());
            }
        } else {
            logger.info("Found user with exact match: {}", loginRequest.getUsername());
        }

        if (!userOptional.isPresent()) {
            logger.warn("No user found for username: {}", loginRequest.getUsername());
            throw new SpringRedditException("User not found with username: " + loginRequest.getUsername());
        }

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
            response.setExpiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()));
            // Generate and store refresh token in DB
            RefreshToken refreshToken = refreshTokenService.generateRefreshToken();
            response.setRefreshToken(refreshToken.getTokenValue());
            logger.info("[LOGIN] Issued refresh token: {} for user: {}", refreshToken.getTokenValue(),
                    loginRequest.getUsername());
            logger.info("Returning authentication response for user: {}", loginRequest.getUsername());
            return response;
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new SpringRedditException("Authentication failed: " + e.getMessage(), e);
        }
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        logger.info("[REFRESH] Received refresh token: {} for username: {}", refreshToken,
                refreshTokenRequest.getUsername());
        String username = refreshTokenRequest.getUsername();
        try {
            // Only validate the refresh token using the database (UUID-based)
            refreshTokenService.validateRefreshToken(refreshToken);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new SpringRedditException("User not found with username: " + username));

            Authentication authenticate = new UsernamePasswordAuthenticationToken(
                    user.getUsername(),
                    user.getPassword());

            SecurityContextHolder.getContext().setAuthentication(authenticate);
            String token = jwtProvider.generateToken(authenticate);

            AuthenticationResponse response = new AuthenticationResponse();
            response.setToken(token);
            response.setUsername(username);
            response.setExpiresAt(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis()));
            response.setRefreshToken(refreshToken);

            return response;
        } catch (com.neoping.backend.exception.RefreshTokenExpiredException
                | com.neoping.backend.exception.SpringRedditException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
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

    public String generateRefreshTokenwithUserName(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusMillis(jwtProvider.getJwtExpirationInMillis())))
                .signWith(getPrivateKey())
                .compact();
    }

    private void initializeKeyStore() {
        try {
            keyStore = KeyStore.getInstance(keystoreType);
            try (java.io.InputStream is = getClass().getClassLoader().getResourceAsStream(keystorePath)) {
                if (is == null) {
                    throw new SpringRedditException("Keystore file not found in resources");
                }
                keyStore.load(is, keystorePassword.toCharArray());
            }
        } catch (KeyStoreException | CertificateException | NoSuchAlgorithmException | IOException e) {
            throw new SpringRedditException("Failed to initialize keystore", e);
        }
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

    private PrivateKey getPrivateKey() {
        try {
            return (PrivateKey) keyStore.getKey(keyAlias, keyPassword.toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            throw new SpringRedditException("Exception occurred while retrieving private key from keystore", e);
        }
    }

}