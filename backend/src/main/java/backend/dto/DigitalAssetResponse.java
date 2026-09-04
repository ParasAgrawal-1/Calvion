package backend.dto;

import backend.entity.AssetPermission;
import backend.entity.AssetType;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
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
}