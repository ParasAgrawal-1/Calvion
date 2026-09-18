package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String digitalIdentity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Password reset token
    @Column
    private String resetOtp;

    // Token expiry time
    @Column
    private LocalDateTime resetOtpExpiry;

    // Two-factor authentication
    @Column(name = "two_factor_enabled")
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @Column(name = "two_factor_backup_codes", length = 1000)
    private String twoFactorBackupCodes;

    public Boolean getTwoFactorEnabled() {
        return twoFactorEnabled != null && twoFactorEnabled;
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();

        if (role == null) {
            role = UserRole.USER;
        }

        if (twoFactorEnabled == null) {
            twoFactorEnabled = false;
        }
    }

}