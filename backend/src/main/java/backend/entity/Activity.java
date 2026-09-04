package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who performed the action
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Related asset
    @ManyToOne
    @JoinColumn(name = "asset_id")
    private DigitalAsset asset;

    // Action performed
    @Column(nullable = false)
    private String action;

    // Human-readable activity description
    @Column(nullable = false, length = 1000)
    private String description;

    // Time of activity
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}