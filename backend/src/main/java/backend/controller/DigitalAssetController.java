package backend.controller;

import backend.dto.AssetShareResponse;
import backend.dto.DigitalAssetResponse;
import backend.dto.ShareAssetRequest;
import backend.dto.SharedAssetResponse;
import backend.dto.UploadedFileResponse;

import backend.entity.AssetPermission;
import backend.entity.AssetShare;
import backend.entity.AssetType;
import backend.entity.DigitalAsset;
import backend.entity.UploadedFile;
import backend.entity.User;
import backend.service.ActivityService;
import backend.repository.AssetShareRepository;
import backend.repository.DigitalAssetRepository;
import backend.repository.UserRepository;

import backend.service.DigitalAssetService;
import backend.service.NotificationService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class DigitalAssetController {

    private final DigitalAssetRepository digitalAssetRepository;

    private final UserRepository userRepository;

    private final AssetShareRepository assetShareRepository;

    private final DigitalAssetService digitalAssetService;

    private final NotificationService notificationService;

    private final ActivityService activityService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DigitalAssetController(
            DigitalAssetRepository digitalAssetRepository,
            UserRepository userRepository,
            AssetShareRepository assetShareRepository,
            DigitalAssetService digitalAssetService,
            NotificationService notificationService,
            ActivityService activityService
    ) {

        this.digitalAssetRepository =
                digitalAssetRepository;

        this.userRepository =
                userRepository;

        this.assetShareRepository =
                assetShareRepository;

        this.digitalAssetService =
                digitalAssetService;

        this.notificationService =
                notificationService;

        this.activityService =
                activityService;
    }


    // =========================================================
    // CREATE DIGITAL ASSET
    //
    // POST /api/assets
    // =========================================================

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> createAsset(

            @RequestParam("title")
            String title,

            @RequestParam(
                    value = "description",
                    required = false
            )
            String description,

            @RequestParam("type")
            String type,

            @RequestParam(
                    value = "content",
                    required = false
            )
            String content,

            @RequestPart(
                    value = "files",
                    required = false
            )
            List<MultipartFile> files,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            DigitalAsset savedAsset =
                    digitalAssetService.createAsset(
                            title,
                            description,
                            type,
                            content,
                            files,
                            email
                    );

            return ResponseEntity.ok(
                    mapToResponse(savedAsset)
            );

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // GET ALL MY ASSETS
    //
    // GET /api/assets?page=0&size=5
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getMyAssets(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "5")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        Sort sort =
                direction.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending()
                        : Sort.by(sortBy).ascending();

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        sort
                );

        Page<DigitalAssetResponse> assets =
                digitalAssetRepository
                        .findByUser(
                                user,
                                pageable
                        )
                        .map(
                                this::mapToResponse
                        );

        return ResponseEntity.ok(
                assets
        );
    }


    // =========================================================
    // GET SINGLE ACCESSIBLE ASSET
    //
    // OWNER + VIEW + EDIT
    //
    // GET /api/assets/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(

            @PathVariable Long id,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            DigitalAsset asset =
                    digitalAssetService.getAccessibleAsset(
                            id,
                            email
                    );

            AssetPermission permission =
                    digitalAssetService.getAssetPermission(
                            id,
                            email
                    );

            boolean owner =
                    permission == null;

            List<UploadedFileResponse> files =
                    asset.getFiles()
                            .stream()
                            .map(
                                    file ->
                                            new UploadedFileResponse(

                                                    file.getId(),

                                                    file.getOriginalFileName(),

                                                    file.getFileType(),

                                                    file.getFileSize()
                                            )
                            )
                            .toList();

            DigitalAssetResponse response =
                    new DigitalAssetResponse(

                            asset.getId(),

                            asset.getTitle(),

                            asset.getDescription(),

                            asset.getType(),

                            asset.getContent(),

                            asset.getCreatedAt(),

                            asset.getUpdatedAt(),

                            files,

                            owner,

                            permission
                    );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(403)
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // UPDATE DIGITAL ASSET
    //
    // OWNER + EDIT USERS
    //
    // PUT /api/assets/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAsset(

            @PathVariable Long id,

            @RequestBody DigitalAsset updatedAsset,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            DigitalAsset asset =
                    digitalAssetService.updateAsset(
                            id,
                            updatedAsset,
                            email
                    );

            return ResponseEntity.ok(
                    mapToResponse(asset)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // DELETE DIGITAL ASSET
    //
    // ONLY OWNER
    //
    // DELETE /api/assets/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(

            @PathVariable Long id,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            DigitalAsset asset =
                    digitalAssetService.getAssetById(
                            id,
                            email
                    );

            DigitalAssetResponse response =
                    mapToResponse(asset);

            digitalAssetService.deleteAsset(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =========================================================
    // FILTER ASSETS BY TYPE
    //
    // GET /api/assets/filter?type=DOCUMENT
    // =========================================================

    @GetMapping("/filter")
    public ResponseEntity<?> filterAssetsByType(

            @RequestParam AssetType type,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        List<DigitalAssetResponse> assets =
                digitalAssetRepository
                        .findByUserAndType(
                                user,
                                type
                        )
                        .stream()
                        .map(
                                this::mapToResponse
                        )
                        .toList();

        return ResponseEntity.ok(
                assets
        );
    }


    // =========================================================
    // SEARCH ASSETS
    //
    // GET /api/assets/search?keyword=document
    // =========================================================

    @GetMapping("/search")
    public ResponseEntity<?> searchAssets(

            @RequestParam String keyword,

            Authentication authentication
    ) {

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        List<DigitalAssetResponse> assets =
                digitalAssetRepository
                        .findByUserAndTitleContainingIgnoreCase(
                                user,
                                keyword
                        )
                        .stream()
                        .map(
                                this::mapToResponse
                        )
                        .toList();

        return ResponseEntity.ok(
                assets
        );
    }


    // =========================================================
    // SHARE ASSET
    //
    // OWNER ONLY
    //
    // POST /api/assets/{id}/share
    // =========================================================

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareAsset(

            @PathVariable Long id,

            @RequestBody ShareAssetRequest request,

            Authentication authentication
    ) {

        try {

            String ownerEmail =
                    authentication.getName();

            User owner =
                    userRepository
                            .findByEmail(ownerEmail)
                            .orElse(null);

            if (owner == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Owner not found");
            }


            // ---------------------------------------------
            // CHECK OWNERSHIP
            // ---------------------------------------------

            DigitalAsset asset =
                    digitalAssetRepository
                            .findByIdAndUser(
                                    id,
                                    owner
                            )
                            .orElse(null);

            if (asset == null) {

                return ResponseEntity
                        .status(403)
                        .body(
                                "You do not own this asset"
                        );
            }


            // ---------------------------------------------
            // VALIDATE EMAIL
            // ---------------------------------------------

            if (
                    request.getEmail() == null ||
                            request.getEmail().isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Email is required"
                        );
            }


            // ---------------------------------------------
            // VALIDATE PERMISSION
            // ---------------------------------------------

            if (
                    request.getPermission() == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Permission is required"
                        );
            }


            // ---------------------------------------------
            // FIND RECIPIENT
            // ---------------------------------------------

            User sharedUser =
                    userRepository
                            .findByEmail(
                                    request.getEmail()
                                            .trim()
                            )
                            .orElse(null);

            if (sharedUser == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "User with this email does not exist"
                        );
            }


            // ---------------------------------------------
            // PREVENT SHARING WITH YOURSELF
            // ---------------------------------------------

            if (
                    owner.getId()
                            .equals(
                                    sharedUser.getId()
                            )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "You cannot share an asset with yourself"
                        );
            }


            // ---------------------------------------------
            // CHECK EXISTING SHARE
            // ---------------------------------------------

            AssetShare assetShare =
                    assetShareRepository
                            .findByAssetAndSharedWith(
                                    asset,
                                    sharedUser
                            )
                            .orElse(null);


            // =================================================
            // EXISTING SHARE
            // UPDATE PERMISSION
            // =================================================

            if (assetShare != null) {

                AssetPermission oldPermission =
                        assetShare.getPermission();

                assetShare.setPermission(
                        request.getPermission()
                );

                assetShareRepository.save(
                        assetShare
                );


                // ---------------------------------------------
                // CREATE NOTIFICATION ONLY IF CHANGED
                // ---------------------------------------------

                if (
                        oldPermission
                                != request.getPermission()
                ) {

                    notificationService
                            .createPermissionUpdateNotification(
                                    owner,
                                    sharedUser,
                                    asset,
                                    request.getPermission()
                            );
                    activityService.createActivity(
                            owner,
                            asset,
                            "SHARE_ASSET",
                            "You shared the asset \""
                                    + asset.getTitle()
                                    + "\" with "
                                    + sharedUser.getName()
                                    + " with "
                                    + request.getPermission()
                                    + " permission."
                    );
                }

                return ResponseEntity.ok(
                        "Asset sharing permission updated successfully"
                );
            }


            // =================================================
            // NEW SHARE
            // =================================================

            AssetShare newShare =
                    AssetShare.builder()

                            .asset(asset)

                            .sharedWith(sharedUser)

                            .permission(
                                    request.getPermission()
                            )

                            .sharedAt(
                                    LocalDateTime.now()
                            )

                            .build();

            assetShareRepository.save(
                    newShare
            );


            // ---------------------------------------------
            // CREATE SHARE NOTIFICATION
            // ---------------------------------------------

            notificationService
                    .createShareNotification(
                            owner,
                            sharedUser,
                            asset,
                            request.getPermission()
                    );


            return ResponseEntity.ok(
                    "Asset shared successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // GET USERS WITH ACCESS TO ASSET
    //
    // ONLY OWNER
    //
    // GET /api/assets/{id}/shares
    // =========================================================

    @GetMapping("/{id}/shares")
    public ResponseEntity<?> getAssetShares(

            @PathVariable Long id,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            List<AssetShareResponse> response =
                    digitalAssetService
                            .getAssetShares(
                                    id,
                                    email
                            )
                            .stream()
                            .map(
                                    share ->
                                            new AssetShareResponse(

                                                    share.getId(),

                                                    share.getSharedWith()
                                                            .getName(),

                                                    share.getSharedWith()
                                                            .getEmail(),

                                                    share.getPermission(),

                                                    share.getSharedAt()
                                            )
                            )
                            .toList();

            return ResponseEntity.ok(
                    response
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // UPDATE SHARE PERMISSION
    //
    // ONLY OWNER
    //
    // PUT /api/assets/{assetId}/shares/{shareId}
    // =========================================================

    @PutMapping("/{assetId}/shares/{shareId}")
    public ResponseEntity<?> updateSharePermission(

            @PathVariable Long assetId,

            @PathVariable Long shareId,

            @RequestBody ShareAssetRequest request,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            if (
                    request.getPermission() == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Permission is required"
                        );
            }

            digitalAssetService
                    .updateSharePermission(
                            assetId,
                            shareId,
                            request.getPermission(),
                            email
                    );

            return ResponseEntity.ok(
                    "Permission updated successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // REMOVE USER ACCESS
    //
    // ONLY OWNER
    //
    // DELETE /api/assets/{assetId}/shares/{shareId}
    // =========================================================

    @DeleteMapping(
            "/{assetId}/shares/{shareId}"
    )
    public ResponseEntity<?> removeAssetShare(

            @PathVariable Long assetId,

            @PathVariable Long shareId,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            digitalAssetService
                    .removeAssetShare(
                            assetId,
                            shareId,
                            email
                    );

            return ResponseEntity.ok(
                    "Access removed successfully"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // GET SHARED ASSETS
    //
    // GET /api/assets/shared
    // =========================================================

    @GetMapping("/shared")
    public ResponseEntity<?> getSharedAssets(

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            List<SharedAssetResponse> sharedAssets =
                    digitalAssetService
                            .getSharedAssets(email)
                            .stream()
                            .map(
                                    this::mapToSharedResponse
                            )
                            .toList();

            return ResponseEntity.ok(
                    sharedAssets
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =========================================================
    // VIEW FILE
    //
    // GET /api/assets/{assetId}/files/{fileId}/view
    // =========================================================

    @GetMapping(
            "/{assetId}/files/{fileId}/view"
    )
    public ResponseEntity<?> viewFile(

            @PathVariable Long assetId,

            @PathVariable Long fileId,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            UploadedFile file =
                    digitalAssetService
                            .getAccessibleFile(
                                    assetId,
                                    fileId,
                                    email
                            );

            Path path =
                    Paths.get(
                            file.getFilePath()
                    ).normalize();

            if (
                    !Files.exists(path) ||
                            !Files.isRegularFile(path)
            ) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            Resource resource =
                    new UrlResource(
                            path.toUri()
                    );

            String contentType =
                    file.getFileType();

            if (
                    contentType == null ||
                            contentType.isBlank()
            ) {

                contentType =
                        Files.probeContentType(
                                path
                        );
            }

            if (contentType == null) {

                contentType =
                        MediaType
                                .APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()

                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,

                            ContentDisposition
                                    .inline()
                                    .filename(
                                            file.getOriginalFileName()
                                    )
                                    .build()
                                    .toString()
                    )

                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to view file"
                    );
        }
    }


    // =========================================================
    // DOWNLOAD FILE
    //
    // GET /api/assets/{assetId}/files/{fileId}/download
    // =========================================================

    @GetMapping(
            "/{assetId}/files/{fileId}/download"
    )
    public ResponseEntity<?> downloadFile(

            @PathVariable Long assetId,

            @PathVariable Long fileId,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            UploadedFile file =
                    digitalAssetService
                            .getAccessibleFile(
                                    assetId,
                                    fileId,
                                    email
                            );

            Path path =
                    Paths.get(
                            file.getFilePath()
                    ).normalize();

            if (
                    !Files.exists(path) ||
                            !Files.isRegularFile(path)
            ) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            Resource resource =
                    new UrlResource(
                            path.toUri()
                    );

            String contentType =
                    file.getFileType();

            if (
                    contentType == null ||
                            contentType.isBlank()
            ) {

                contentType =
                        Files.probeContentType(
                                path
                        );
            }

            if (contentType == null) {

                contentType =
                        MediaType
                                .APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()

                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )

                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,

                            ContentDisposition
                                    .attachment()
                                    .filename(
                                            file.getOriginalFileName()
                                    )
                                    .build()
                                    .toString()
                    )

                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to download file"
                    );
        }
    }


    // =========================================================
    // MAP NORMAL ASSET
    // =========================================================

    private DigitalAssetResponse mapToResponse(
            DigitalAsset asset
    ) {

        List<UploadedFileResponse> files =
                asset.getFiles()
                        .stream()
                        .map(
                                file ->
                                        new UploadedFileResponse(

                                                file.getId(),

                                                file.getOriginalFileName(),

                                                file.getFileType(),

                                                file.getFileSize()
                                        )
                        )
                        .toList();

        return new DigitalAssetResponse(

                asset.getId(),

                asset.getTitle(),

                asset.getDescription(),

                asset.getType(),

                asset.getContent(),

                asset.getCreatedAt(),

                asset.getUpdatedAt(),

                files,

                true,

                null
        );
    }


    // =========================================================
    // MAP SHARED ASSET
    // =========================================================

    private SharedAssetResponse mapToSharedResponse(
            AssetShare assetShare
    ) {

        DigitalAsset asset =
                assetShare.getAsset();

        List<UploadedFileResponse> files =
                asset.getFiles()
                        .stream()
                        .map(
                                file ->
                                        new UploadedFileResponse(

                                                file.getId(),

                                                file.getOriginalFileName(),

                                                file.getFileType(),

                                                file.getFileSize()
                                        )
                        )
                        .toList();

        User owner =
                asset.getUser();

        return new SharedAssetResponse(

                asset.getId(),

                asset.getTitle(),

                asset.getDescription(),

                asset.getType(),

                asset.getContent(),

                asset.getCreatedAt(),

                asset.getUpdatedAt(),

                files,

                owner.getName(),

                owner.getEmail(),

                assetShare.getPermission(),

                assetShare.getSharedAt()
        );
    }
}