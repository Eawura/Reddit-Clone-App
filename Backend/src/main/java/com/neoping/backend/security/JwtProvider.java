package com.neoping.backend.security;

import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.neoping.backend.exception.SpringRedditException;

import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.JwtParserBuilder;
import io.jsonwebtoken.Jwts;
import jakarta.annotation.PostConstruct;

@Service
public class JwtProvider {

    private KeyStore keyStore;

    @PostConstruct

    public void init() {
        try {
            keyStore = KeyStore.getInstance("JKS");
            InputStream resourceAStream = getClass().getResourceAsStream("/springblog.jks");
            keyStore.load(resourceAStream, "secret".toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | java.security.cert.CertificateException
                | java.io.IOException e) {
            throw new SpringRedditException("Failed to initialize JWT provider", e);
        }
    }

    public String generateToken(Authentication authentication) {
        authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(authentication.getName())
                .signWith(getPrivateKey())
                .compact();
    }

    public boolean validateToken(String jwt) {
        Jwts.parserBuilder()
                .setSigningKey(getPublicKey())
                .build()
                .parseClaimsJws(jwt);
        return true;
    }

    private PrivateKey getPrivateKey() {
        try {
            return (PrivateKey) keyStore.getKey("springblog", "password".toCharArray());
        } catch (KeyStoreException | NoSuchAlgorithmException | UnrecoverableKeyException e) {
            throw new SpringRedditException("Failed to retrieve private key", e);
        }
    }

    private PublicKey getPublicKey() {
        try {
            return (PublicKey) keyStore.getCertificate("springblog").getPublicKey();
        } catch (KeyStoreException e) {
            throw new SpringRedditException("Failed to retrieve public key", e);
        }
    }

    public String getUsernameFromJwt(String Token){
        Claims claims = Jwts.parserBuilder()
        .setSigningKey(getPublicKey())
        .build()
        .parseClaimsJws(Token)
        .getBody();

        return claims.getSubject();
    }

}
