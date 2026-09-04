package backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "digital_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DigitalAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;


    @Column(length = 1000)
    private String description;


    @Enumerated(EnumType.STRING)
    private AssetType type;


    @Column(length = 2000)
    private String content;


    private LocalDateTime createdAt;


    private LocalDateTime updatedAt;


    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;


    @OneToMany(
            mappedBy = "asset",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<UploadedFile> files =
            new ArrayList<>();


    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {

            createdAt =
                    LocalDateTime.now();
        }

        if (updatedAt == null) {

            updatedAt =
                    LocalDateTime.now();
        }
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}