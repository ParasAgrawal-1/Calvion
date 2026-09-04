package backend.service;

import backend.entity.DigitalAsset;
import backend.entity.UploadedFile;
import backend.repository.UploadedFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final UploadedFileRepository uploadedFileRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public FileStorageService(
            UploadedFileRepository uploadedFileRepository
    ) {
        this.uploadedFileRepository =
                uploadedFileRepository;
    }


    public UploadedFile storeFile(
            MultipartFile file,
            DigitalAsset asset
    ) throws IOException {

        Path uploadPath =
                Paths.get(uploadDir)
                        .toAbsolutePath()
                        .normalize();

        Files.createDirectories(uploadPath);

        String originalFileName =
                file.getOriginalFilename();

        String storedFileName =
                UUID.randomUUID()
                        + "_"
                        + originalFileName;

        Path targetLocation =
                uploadPath.resolve(storedFileName);

        Files.copy(
                file.getInputStream(),
                targetLocation,
                StandardCopyOption.REPLACE_EXISTING
        );

        UploadedFile uploadedFile =
                UploadedFile.builder()
                        .originalFileName(originalFileName)
                        .storedFileName(storedFileName)
                        .filePath(
                                targetLocation.toString()
                        )
                        .fileType(
                                file.getContentType()
                        )
                        .fileSize(file.getSize())
                        .asset(asset)
                        .build();

        return uploadedFileRepository.save(
                uploadedFile
        );
    }
}