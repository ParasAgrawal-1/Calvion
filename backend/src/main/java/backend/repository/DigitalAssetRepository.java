package backend.repository;

import backend.entity.AssetType;
import backend.entity.DigitalAsset;
import backend.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DigitalAssetRepository
        extends JpaRepository<DigitalAsset, Long> {

    // ==========================================
    // GET ALL ASSETS OF USER
    // ==========================================

    List<DigitalAsset> findByUser(
            User user
    );


    // ==========================================
    // GET ASSET BY ID + OWNER
    // ==========================================

    Optional<DigitalAsset> findByIdAndUser(
            Long id,
            User user
    );


    // ==========================================
    // FILTER BY TYPE
    // ==========================================

    List<DigitalAsset> findByUserAndType(
            User user,
            AssetType type
    );


    // ==========================================
    // SEARCH BY TITLE
    // ==========================================

    List<DigitalAsset>
    findByUserAndTitleContainingIgnoreCase(
            User user,
            String keyword
    );


    // ==========================================
    // PAGINATION
    // ==========================================

    Page<DigitalAsset> findByUser(
            User user,
            Pageable pageable
    );
}