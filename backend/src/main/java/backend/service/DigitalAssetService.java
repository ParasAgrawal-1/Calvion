package backend.service;

import backend.entity.AssetPermission;
import backend.entity.AssetShare;
import backend.entity.AssetType;
import backend.entity.DigitalAsset;
import backend.entity.UploadedFile;
import backend.entity.User;

import backend.repository.AssetShareRepository;
import backend.repository.DigitalAssetRepository;
import backend.repository.UploadedFileRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DigitalAssetService {

    private final DigitalAssetRepository digitalAssetRepository;

    private final UserRepository userRepository;

    private final AssetShareRepository assetShareRepository;

    private final UploadedFileRepository uploadedFileRepository;

    private final NotificationService notificationService;

    private final ActivityService activityService;


    // =========================================================
    // UPLOAD DIRECTORY
    // =========================================================

    private final Path uploadDirectory =
            Paths.get("uploads")
                    .toAbsolutePath()
                    .normalize();


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public DigitalAssetService(
            DigitalAssetRepository digitalAssetRepository,
            UserRepository userRepository,
            AssetShareRepository assetShareRepository,
            UploadedFileRepository uploadedFileRepository,
            NotificationService notificationService,
            ActivityService activityService
    ) {

        this.digitalAssetRepository =
                digitalAssetRepository;

        this.userRepository =
                userRepository;

        this.assetShareRepository =
                assetShareRepository;

        this.uploadedFileRepository =
                uploadedFileRepository;

        this.notificationService =
                notificationService;

        this.activityService =
                activityService;


        try {

            Files.createDirectories(
                    uploadDirectory
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }
    }


    // =========================================================
    // GET ALL ASSETS OF LOGGED-IN USER
    // =========================================================

    public List<DigitalAsset> getUserAssets(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return digitalAssetRepository
                .findByUser(user);
    }


    // =========================================================
    // GET SINGLE ASSET OWNED BY USER
    // =========================================================

    public DigitalAsset getAssetById(
            Long id,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return digitalAssetRepository
                .findByIdAndUser(
                        id,
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found"
                        )
                );
    }


    // =========================================================
    // CREATE ASSET + UPLOAD FILES
    // =========================================================

    @Transactional
    public DigitalAsset createAsset(
            String title,
            String description,
            String type,
            String content,
            List<MultipartFile> files,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        AssetType assetType;

        try {

            assetType =
                    AssetType.valueOf(type);

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid asset type: " + type
            );
        }


        LocalDateTime now =
                LocalDateTime.now();


        DigitalAsset asset =
                DigitalAsset.builder()

                        .title(title)

                        .description(description)

                        .type(assetType)

                        .content(content)

                        .createdAt(now)

                        .updatedAt(now)

                        .user(user)

                        .build();


        DigitalAsset savedAsset =
                digitalAssetRepository
                        .save(asset);


        // =====================================================
        // ACTIVITY: CREATE ASSET
        // =====================================================

        activityService.createActivity(
                user,
                savedAsset,
                "CREATE_ASSET",
                "You created the asset \""
                        + savedAsset.getTitle()
                        + "\"."
        );


        // =====================================================
        // UPLOAD FILES
        // =====================================================

        if (
                files != null &&
                        !files.isEmpty()
        ) {

            for (
                    MultipartFile file :
                    files
            ) {

                if (
                        file == null ||
                                file.isEmpty()
                ) {

                    continue;
                }


                saveUploadedFile(
                        file,
                        savedAsset,
                        user
                );
            }


            savedAsset =
                    digitalAssetRepository
                            .save(savedAsset);
        }


        return savedAsset;
    }


    // =========================================================
    // SAVE ONE UPLOADED FILE
    // =========================================================

    private void saveUploadedFile(
            MultipartFile file,
            DigitalAsset asset,
            User user
    ) {

        try {

            String originalFileName =
                    file.getOriginalFilename();


            if (
                    originalFileName == null ||
                            originalFileName.isBlank()
            ) {

                originalFileName =
                        "unknown-file";
            }


            originalFileName =
                    Paths.get(
                                    originalFileName
                            )
                            .getFileName()
                            .toString();


            String storedFileName =
                    UUID.randomUUID()
                            .toString()
                            + "_"
                            + originalFileName;


            Path targetLocation =
                    uploadDirectory
                            .resolve(storedFileName)
                            .normalize();


            if (
                    !targetLocation
                            .startsWith(
                                    uploadDirectory
                            )
            ) {

                throw new RuntimeException(
                        "Invalid file path"
                );
            }


            Files.copy(
                    file.getInputStream(),
                    targetLocation,
                    StandardCopyOption
                            .REPLACE_EXISTING
            );


            UploadedFile uploadedFile =
                    UploadedFile.builder()

                            .originalFileName(
                                    originalFileName
                            )

                            .storedFileName(
                                    storedFileName
                            )

                            .filePath(
                                    targetLocation
                                            .toString()
                            )

                            .fileType(
                                    file.getContentType()
                            )

                            .fileSize(
                                    file.getSize()
                            )

                            .asset(asset)

                            .build();


            asset.getFiles()
                    .add(uploadedFile);


            // =================================================
            // ACTIVITY: UPLOAD FILE
            // =================================================

            activityService.createActivity(
                    user,
                    asset,
                    "UPLOAD_FILE",
                    "You uploaded \""
                            + originalFileName
                            + "\" to \""
                            + asset.getTitle()
                            + "\"."
            );


        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to save file: "
                            + file.getOriginalFilename(),
                    e
            );
        }
    }


    // =========================================================
    // GET SHARED ASSETS
    // =========================================================

    public List<AssetShare> getSharedAssets(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return assetShareRepository
                .findBySharedWith(user);
    }


    // =========================================================
    // GET SHARES OF AN ASSET
    // ONLY OWNER
    // =========================================================

    public List<AssetShare> getAssetShares(
            Long assetId,
            String email
    ) {

        User owner =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findByIdAndUser(
                                assetId,
                                owner
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You do not own this asset"
                                )
                        );


        return assetShareRepository
                .findByAsset(asset);
    }


    // =========================================================
    // UPDATE SHARE PERMISSION
    // ONLY OWNER
    // =========================================================

    @Transactional
    public void updateSharePermission(
            Long assetId,
            Long shareId,
            AssetPermission permission,
            String email
    ) {

        User owner =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findByIdAndUser(
                                assetId,
                                owner
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You do not own this asset"
                                )
                        );


        AssetShare share =
                assetShareRepository
                        .findById(shareId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Share not found"
                                )
                        );


        // =====================================================
        // SECURITY CHECK
        // =====================================================

        if (
                !share.getAsset()
                        .getId()
                        .equals(asset.getId())
        ) {

            throw new RuntimeException(
                    "Share does not belong to this asset"
            );
        }


        // =====================================================
        // SAVE OLD PERMISSION
        // =====================================================

        AssetPermission oldPermission =
                share.getPermission();


        // =====================================================
        // UPDATE PERMISSION
        // =====================================================

        share.setPermission(
                permission
        );


        assetShareRepository.save(
                share
        );


        // =====================================================
        // NOTIFICATION
        // =====================================================

        if (
                oldPermission != permission
        ) {

            notificationService
                    .createPermissionUpdateNotification(
                            owner,
                            share.getSharedWith(),
                            asset,
                            permission
                    );


            // =================================================
            // ACTIVITY
            //
            // This activity belongs to the OWNER because
            // the owner performed the permission change.
            // =================================================

            activityService.createActivity(
                    owner,
                    asset,
                    "PERMISSION_CHANGED",
                    "You changed "
                            + share.getSharedWith().getName()
                            + "'s permission for \""
                            + asset.getTitle()
                            + "\" from "
                            + oldPermission
                            + " to "
                            + permission
                            + "."
            );
        }
    }


    // =========================================================
    // REMOVE SHARE
    // ONLY OWNER
    // =========================================================

    @Transactional
    public void removeAssetShare(
            Long assetId,
            Long shareId,
            String email
    ) {

        User owner =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findByIdAndUser(
                                assetId,
                                owner
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You do not own this asset"
                                )
                        );


        AssetShare share =
                assetShareRepository
                        .findById(shareId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Share not found"
                                )
                        );


        // =====================================================
        // SECURITY CHECK
        // =====================================================

        if (
                !share.getAsset()
                        .getId()
                        .equals(asset.getId())
        ) {

            throw new RuntimeException(
                    "Share does not belong to this asset"
            );
        }


        // =====================================================
        // SAVE USER BEFORE DELETE
        // =====================================================

        User sharedUser =
                share.getSharedWith();


        // =====================================================
        // DELETE SHARE
        // =====================================================

        assetShareRepository.delete(
                share
        );


        // =====================================================
        // NOTIFICATION
        // =====================================================

        notificationService
                .createAccessRemovedNotification(
                        owner,
                        sharedUser,
                        asset
                );


        // =====================================================
        // ACTIVITY
        // =====================================================

        activityService.createActivity(
                owner,
                asset,
                "ACCESS_REMOVED",
                "You removed "
                        + sharedUser.getName()
                        + "'s access to \""
                        + asset.getTitle()
                        + "\"."
        );
    }


    // =========================================================
    // GET ASSET IF USER HAS ACCESS
    // OWNER + SHARED USER
    // =========================================================

    public DigitalAsset getAccessibleAsset(
            Long id,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Asset not found"
                                )
                        );


        // =====================================================
        // OWNER
        // =====================================================

        if (
                asset.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            return asset;
        }


        // =====================================================
        // SHARED USER
        // =====================================================

        assetShareRepository
                .findByAssetAndSharedWith(
                        asset,
                        user
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Access denied"
                        )
                );


        return asset;
    }


    // =========================================================
    // GET EDITABLE ASSET
    // OWNER + EDIT USER
    // =========================================================

    public DigitalAsset getEditableAsset(
            Long id,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Asset not found"
                                )
                        );


        // =====================================================
        // OWNER
        // =====================================================

        if (
                asset.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            return asset;
        }


        // =====================================================
        // SHARED USER
        // =====================================================

        AssetShare assetShare =
                assetShareRepository
                        .findByAssetAndSharedWith(
                                asset,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Access denied"
                                )
                        );


        if (
                assetShare.getPermission()
                        != AssetPermission.EDIT
        ) {

            throw new RuntimeException(
                    "You do not have permission to edit this asset"
            );
        }


        return asset;
    }


    // =========================================================
    // UPDATE ASSET
    // OWNER + EDIT USER
    // =========================================================

    @Transactional
    public DigitalAsset updateAsset(
            Long id,
            DigitalAsset updatedAsset,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findByIdAndUser(
                                id,
                                user
                        )
                        .orElse(null);


        // =====================================================
        // SHARED USER
        // =====================================================

        if (asset == null) {

            asset =
                    digitalAssetRepository
                            .findById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Asset not found"
                                    )
                            );


            AssetShare share =
                    assetShareRepository
                            .findByAssetAndSharedWith(
                                    asset,
                                    user
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "You do not have access to this asset"
                                    )
                            );


            if (
                    share.getPermission()
                            != AssetPermission.EDIT
            ) {

                throw new RuntimeException(
                        "You only have VIEW permission"
                );
            }
        }


        // =====================================================
        // UPDATE FIELDS
        // =====================================================

        asset.setTitle(
                updatedAsset.getTitle()
        );

        asset.setDescription(
                updatedAsset.getDescription()
        );

        asset.setType(
                updatedAsset.getType()
        );

        asset.setContent(
                updatedAsset.getContent()
        );

        asset.setUpdatedAt(
                LocalDateTime.now()
        );


        DigitalAsset savedAsset =
                digitalAssetRepository
                        .save(asset);


        // =====================================================
        // ACTIVITY
        // =====================================================

        activityService.createActivity(
                user,
                savedAsset,
                "UPDATE_ASSET",
                "You updated the asset \""
                        + savedAsset.getTitle()
                        + "\"."
        );


        return savedAsset;
    }


    // =========================================================
    // GET FILE WITH ACCESS CHECK
    // =========================================================

    public UploadedFile getAccessibleFile(
            Long assetId,
            Long fileId,
            String email
    ) {

        DigitalAsset asset =
                getAccessibleAsset(
                        assetId,
                        email
                );


        return uploadedFileRepository
                .findByIdAndAsset(
                        fileId,
                        asset
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "File not found"
                        )
                );
    }


    // =========================================================
    // DELETE ASSET
    // ONLY OWNER
    // =========================================================

    @Transactional
    public void deleteAsset(
            Long id,
            String email
    ) {

        DigitalAsset asset =
                getAssetById(
                        id,
                        email
                );


        User owner =
                asset.getUser();


        String assetTitle =
                asset.getTitle();


        // =====================================================
        // ACTIVITY
        //
        // IMPORTANT:
        // We use null for the asset reference because the
        // asset is about to be deleted.
        // =====================================================

        activityService.createActivity(
                owner,
                null,
                "DELETE_ASSET",
                "You deleted the asset \""
                        + assetTitle
                        + "\"."
        );


        // =====================================================
        // DELETE PHYSICAL FILES
        // =====================================================

        if (
                asset.getFiles() != null
        ) {

            for (
                    UploadedFile file :
                    asset.getFiles()
            ) {

                try {

                    if (
                            file.getFilePath() != null
                    ) {

                        Files.deleteIfExists(
                                Paths.get(
                                        file.getFilePath()
                                )
                        );
                    }

                } catch (IOException e) {

                    System.err.println(
                            "Could not delete physical file: "
                                    + file.getFilePath()
                    );
                }
            }
        }


        // =====================================================
        // DELETE SHARES FIRST
        // =====================================================

        assetShareRepository.deleteByAsset(
                asset
        );


        // =====================================================
        // DELETE ASSET
        // =====================================================

        digitalAssetRepository.delete(
                asset
        );
    }


    // =========================================================
    // GET ASSET PERMISSION
    // =========================================================

    public AssetPermission getAssetPermission(
            Long assetId,
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        DigitalAsset asset =
                digitalAssetRepository
                        .findById(assetId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Asset not found"
                                )
                        );


        // =====================================================
        // OWNER
        // =====================================================

        if (
                asset.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            return null;
        }


        // =====================================================
        // SHARED USER
        // =====================================================

        AssetShare share =
                assetShareRepository
                        .findByAssetAndSharedWith(
                                asset,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You don't have permission to access this asset"
                                )
                        );


        return share.getPermission();
    }
}