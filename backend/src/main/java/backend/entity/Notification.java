package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who receives the notification
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Notification title
    @Column(nullable = false)
    private String title;

    // Notification message
    @Column(nullable = false, length = 1000)
    private String message;

    // Related asset
    @ManyToOne
    @JoinColumn(name = "asset_id")
    private DigitalAsset asset;

    // Whether notification has been read
    @Column(nullable = false)
    private boolean read;

    // Notification creation time
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}