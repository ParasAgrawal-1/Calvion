package backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private String autoLockDuration = "15";

    @Column(nullable = false)
    @Builder.Default
    private String defaultSharePermission = "VIEW";

    @Column(nullable = false)
    @Builder.Default
    private Boolean allowFileDownload = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean requirePassphrase = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notify30Days = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notify14Days = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notify7Days = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean notify1Day = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailChannel = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean inAppChannel = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean discoverableByEmail = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean showDigitalIdentityPublicly = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean collectTelemetry = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean logAuditHistory = true;
}
