package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "asset_shares",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"asset_id", "shared_with_user_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The asset being shared
    @ManyToOne
    @JoinColumn(
            name = "asset_id",
            nullable = false
    )
    private DigitalAsset asset;

    // User who receives access
    @ManyToOne
    @JoinColumn(
            name = "shared_with_user_id",
            nullable = false
    )
    private User sharedWith;

    // VIEW or EDIT permission
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetPermission permission;

    private LocalDateTime sharedAt;
}