package backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "uploaded_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String originalFileName;


    private String storedFileName;


    private String filePath;


    private String fileType;


    private Long fileSize;


    @Column(name = "file_hash", length = 64)
    private String fileHash;


    @Column(name = "is_encrypted")
    @Builder.Default
    private Boolean isEncrypted = false;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private DigitalAsset asset;
}