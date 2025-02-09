package org.auth.service;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.auth.repository.UserRepository;
import org.auth.util.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtService extends OncePerRequestFilter {
    private final Jwt jwt;
    private final UserRepository userRepository;

    @Autowired
    public JwtService(Jwt jwt, UserRepository userRepository) {
        this.jwt = jwt;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String password = null;
        String jwt = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            Claims claims = this.jwt.extractAllClaims(jwt);
            username = claims.getSubject();
            password = claims.get("password", String.class);
        }
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isPresent() && this.jwt.validateToken(jwt, optionalUser.get())) {
                UserDetails userDetails = User
                        .withUsername(username)
                        .password(optionalUser.get().getPassword())
                        .roles(optionalUser.get().getRole())
                        .build();
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }
}
