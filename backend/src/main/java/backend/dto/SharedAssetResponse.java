package backend.dto;

import backend.entity.AssetPermission;
import backend.entity.AssetType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class SharedAssetResponse {

    private Long id;

    private String title;

    private String description;

    private AssetType type;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<UploadedFileResponse> files;

    // Owner information
    private String ownerName;

    private String ownerEmail;

    // Permission given to logged-in user
    private AssetPermission permission;

    // When asset was shared
    private LocalDateTime sharedAt;
}