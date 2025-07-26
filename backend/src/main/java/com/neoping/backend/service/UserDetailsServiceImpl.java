package com.neoping.backend.service;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.neoping.backend.model.User;
import com.neoping.backend.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = findUserByFlexibleUsername(username);
        User user = userOptional
                .orElseThrow(() -> new UsernameNotFoundException("No user " +
                        "Found with username : " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                getAuthorities("USER") // or whatever role you want
        );
    }

    private Optional<User> findUserByFlexibleUsername(String username) {
        // First try exact match
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            System.out.println("Found exact match for: " + username);
            return user;
        }

        // Try with "u/" prefix
        user = userRepository.findByUsername("u/" + username);
        if (user.isPresent()) {
            System.out.println("Found with u/ prefix for: " + username + " -> u/" + username);
            return user;
        }

        // Try case-insensitive search for partial matches
        // This handles cases like "Ohene" matching "Ohene Updated"
        List<User> allUsers = userRepository.findAll();
        System.out.println("Searching among " + allUsers.size() + " users for: " + username);

        for (User u : allUsers) {
            System.out.println("Checking user: " + u.getUsername() + " against: " + username);

            // More precise matching: username should start with the search term
            if (u.getUsername().toLowerCase().startsWith(username.toLowerCase())) {
                System.out.println("Found startsWith match: " + u.getUsername() + " for: " + username);
                return Optional.of(u);
            }

            // Also check if the search term (without u/) matches the stored username
            String usernameWithoutPrefix = u.getUsername().startsWith("u/") ? u.getUsername().substring(2)
                    : u.getUsername();
            if (usernameWithoutPrefix.toLowerCase().startsWith(username.toLowerCase())) {
                System.out.println("Found match without u/ prefix: " + u.getUsername() + " for: " + username);
                return Optional.of(u);
            }
        }

        System.out.println("No match found for: " + username);
        return Optional.empty();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }
}
