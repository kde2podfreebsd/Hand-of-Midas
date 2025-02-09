package org.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.auth.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class Jwt {
    private final static String SECRET_KEY = "key";
    private final Date expiration;

    public Jwt(@Value("${expiration.date}") String expiration) {
        this.expiration = new Date(Long.parseLong(expiration));
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return this.extractAllClaims(token).getExpiration().before(new Date());
    }

    public String generateToken(String username, String password) {
        return Jwts.builder()
                .setSubject(username)
                .claim("password", password)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration.getTime()))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token, User user) {
        try {
            Claims claims = this.extractAllClaims(token);
            String username = claims.getSubject();
            String password = claims.get("password", String.class);
            return username.equals(user.getUsername()) && password.equals(user.getPassword());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractLoginFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
}
