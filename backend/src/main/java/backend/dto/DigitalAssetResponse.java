package backend.dto;

import backend.entity.AssetPermission;
import backend.entity.AssetType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DigitalAssetResponse {

    private Long id;

    private String title;

    private String description;

    private AssetType type;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<UploadedFileResponse> files;

    // True when logged-in user owns the asset
    private boolean owner;

    // VIEW / EDIT for shared users
    // null for owner
    private AssetPermission permission;

    private String expiryDate;

    private Integer alertThresholdDays;

    private String expiryNotes;

    // Backward compatible constructor
    public DigitalAssetResponse(
            Long id,
            String title,
            String description,
            AssetType type,
            String content,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<UploadedFileResponse> files,
            boolean owner,
            AssetPermission permission
    ) {
        this(id, title, description, type, content, createdAt, updatedAt, files, owner, permission, null, null, null);
    }
}