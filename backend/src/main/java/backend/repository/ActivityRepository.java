package backend.repository;

import backend.entity.Activity;
import backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository
        extends JpaRepository<Activity, Long> {

    List<Activity> findByUserOrderByCreatedAtDesc(
            User user
    );

    List<Activity> findTop20ByUserOrderByCreatedAtDesc(
            User user
    );

    List<Activity> findByAssetOrderByCreatedAtDesc(
            Long assetId
    );
}