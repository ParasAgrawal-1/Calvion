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


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private DigitalAsset asset;
}