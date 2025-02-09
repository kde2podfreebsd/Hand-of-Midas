package org.auth.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.auth.model.User;
import org.auth.repository.UserRepository;
import org.auth.util.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthorizationController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Jwt jwt;

    @Autowired
    AuthorizationController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            Jwt jwt) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthorizationInfo authorizationInfo) {
        String username = authorizationInfo.username();
        String password = authorizationInfo.password();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(authorizationInfo.username()));
        if (!new BCryptPasswordEncoder().matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return jwt.generateToken(username, password);
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refresh(
            @CookieValue(name = "jwt", required = false) String jwtToken,
            @CookieValue(name = "password", required = false) String password
    ) {
        if (jwtToken == null || jwtToken.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing JWT token or password");
        }
        try {
            String login = jwt.extractLoginFromToken(jwtToken);
            String newToken = jwt.generateToken(login, password);
            return ResponseEntity.ok(newToken);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid JWT token");
        }
    }

    @PostMapping("/verify")
    public boolean verify(@RequestBody User user, String token) {
        return this.jwt.validateToken(token, user);
    }


}
