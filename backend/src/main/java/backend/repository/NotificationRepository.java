package backend.repository;

import backend.entity.Notification;
import backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository
                extends JpaRepository<Notification, Long> {

        // All notifications of a user
        List<Notification> findByUserOrderByCreatedAtDesc(
                        User user);

        // Only unread notifications
        List<Notification> findByUserAndReadFalseOrderByCreatedAtDesc(
                        User user);

        // Count unread notifications
        long countByUserAndReadFalse(
                        User user);

        // Detach notifications from an asset before asset deletion
        @Modifying
        @Query("""
                        UPDATE Notification n
                        SET n.asset = NULL
                        WHERE n.asset.id = :assetId
                        """)
        void detachNotificationsFromAsset(
                        @Param("assetId") Long assetId);
}