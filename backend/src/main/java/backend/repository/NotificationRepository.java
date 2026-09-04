package backend.repository;

import backend.entity.Notification;
import backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // All notifications of a user
    List<Notification> findByUserOrderByCreatedAtDesc(
            User user
    );

    // Only unread notifications
    List<Notification> findByUserAndReadFalseOrderByCreatedAtDesc(
            User user
    );

    // Count unread notifications
    long countByUserAndReadFalse(
            User user
    );
}