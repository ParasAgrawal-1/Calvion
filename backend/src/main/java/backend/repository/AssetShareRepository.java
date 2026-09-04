package backend.repository;

import backend.entity.AssetShare;
import backend.entity.DigitalAsset;
import backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetShareRepository
        extends JpaRepository<AssetShare, Long> {

    Optional<AssetShare> findByAssetAndSharedWith(
            DigitalAsset asset,
            User sharedWith
    );

    List<AssetShare> findBySharedWith(
            User sharedWith
    );

    List<AssetShare> findByAsset(
            DigitalAsset asset
    );

    Optional<AssetShare> findByIdAndAssetAndSharedWith(
            Long id,
            DigitalAsset asset,
            User sharedWith
    );

    void deleteByAsset(
            DigitalAsset asset
    );
}