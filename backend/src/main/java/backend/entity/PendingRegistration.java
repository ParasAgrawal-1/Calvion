package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(nullable = false)
    private String digitalIdentity;

    private String otp;

    private LocalDateTime otpExpiry;

    @Column(name = "verification_token", unique = true)
    private String verificationToken;

    @Column(name = "token_expiry")
    private LocalDateTime tokenExpiry;
}