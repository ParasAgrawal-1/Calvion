package backend.repository;

import backend.entity.Activity;
import backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository
                extends JpaRepository<Activity, Long> {

        List<Activity> findByUserOrderByCreatedAtDesc(
                        User user);

        List<Activity> findTop20ByUserOrderByCreatedAtDesc(
                        User user);

        List<Activity> findByAssetOrderByCreatedAtDesc(
                        Long assetId);

        // =========================================================
        // DETACH ACTIVITIES FROM ASSET
        // =========================================================

        @Modifying
        @Query("""
                        UPDATE Activity a
                        SET a.asset = NULL
                        WHERE a.asset.id = :assetId
                        """)
        void detachActivitiesFromAsset(
                        @Param("assetId") Long assetId);
}