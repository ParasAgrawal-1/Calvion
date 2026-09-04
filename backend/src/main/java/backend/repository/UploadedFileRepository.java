package backend.repository;

import backend.entity.DigitalAsset;
import backend.entity.UploadedFile;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UploadedFileRepository
        extends JpaRepository<UploadedFile, Long> {

    List<UploadedFile> findByAsset(
            DigitalAsset asset
    );

    Optional<UploadedFile> findByIdAndAsset(
            Long id,
            DigitalAsset asset
    );
}