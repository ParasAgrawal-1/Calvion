package backend.service;

import backend.entity.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String DEFAULT_SECRET =
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        String keyToUse = (secret != null && secret.trim().length() >= 32)
                ? secret.trim()
                : DEFAULT_SECRET;

        return Keys.hmacShaKeyFor(
                keyToUse.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Generate token with email + role
    public String generateToken(String email, UserRole role) {
        String roleName = (role != null) ? role.name() : UserRole.USER.name();

        return Jwts.builder()
                .subject(email)

                // Store role inside JWT
                .claim("role", roleName)

                .issuedAt(new Date())

                .expiration(
                        new Date(System.currentTimeMillis() + expiration)
                )

                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Extract role from JWT
    public String extractRole(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.get("role", String.class);
    }

    public boolean isTokenValid(String token, String email) {

        return extractEmail(token).equals(email)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getExpiration().before(new Date());
    }
}