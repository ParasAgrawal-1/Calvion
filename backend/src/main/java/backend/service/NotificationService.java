package backend.service;

import backend.dto.NotificationResponse;
import backend.entity.AssetPermission;
import backend.entity.AssetShare;
import backend.entity.DigitalAsset;
import backend.entity.Notification;
import backend.entity.User;

import backend.repository.NotificationRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

        private final NotificationRepository notificationRepository;

        private final UserRepository userRepository;

        public NotificationService(
                        NotificationRepository notificationRepository,
                        UserRepository userRepository) {
                this.notificationRepository = notificationRepository;

                this.userRepository = userRepository;
        }

        // =========================================================
        // GET ALL NOTIFICATIONS
        // =========================================================

        public List<NotificationResponse> getNotifications(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                return notificationRepository
                                .findByUserOrderByCreatedAtDesc(user)
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =========================================================
        // GET UNREAD COUNT
        // =========================================================

        public long getUnreadCount(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                return notificationRepository
                                .countByUserAndReadFalse(user);
        }

        // =========================================================
        // MARK ONE AS READ
        // =========================================================

        @Transactional
        public void markAsRead(
                        Long notificationId,
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                Notification notification = notificationRepository
                                .findById(notificationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Notification not found"));

                // Security check
                if (!notification.getUser()
                                .getId()
                                .equals(user.getId())) {
                        throw new RuntimeException(
                                        "You do not have access to this notification");
                }

                notification.setRead(true);

                notificationRepository.save(
                                notification);
        }

        // =========================================================
        // MARK ALL AS READ
        // =========================================================

        @Transactional
        public void markAllAsRead(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new RuntimeException(
                                                "User not found"));

                List<Notification> notifications = notificationRepository
                                .findByUserOrderByCreatedAtDesc(user);

                for (Notification notification : notifications) {
                        notification.setRead(true);
                }

                notificationRepository.saveAll(
                                notifications);
        }

        // =========================================================
        // CREATE SHARE NOTIFICATION
        // =========================================================

        public void createShareNotification(
                        User owner,
                        User sharedUser,
                        DigitalAsset asset,
                        AssetPermission permission) {

                String permissionText = permission == AssetPermission.EDIT
                                ? "edit"
                                : "view";

                Notification notification = Notification.builder()

                                .user(sharedUser)

                                .title("Asset shared with you")

                                .message(
                                                owner.getName()
                                                                + " shared \""
                                                                + asset.getTitle()
                                                                + "\" with you with "
                                                                + permissionText
                                                                + " permission.")

                                .asset(asset)

                                .read(false)

                                .build();

                notificationRepository.save(
                                notification);
        }

        // =========================================================
        // CREATE PERMISSION UPDATE NOTIFICATION
        // =========================================================

        public void createPermissionUpdateNotification(
                        User owner,
                        User sharedUser,
                        DigitalAsset asset,
                        AssetPermission permission) {

                String permissionText = permission == AssetPermission.EDIT
                                ? "EDIT"
                                : "VIEW";

                Notification notification = Notification.builder()

                                .user(sharedUser)

                                .title("Asset permission updated")

                                .message(
                                                owner.getName()
                                                                + " changed your permission for \""
                                                                + asset.getTitle()
                                                                + "\" to "
                                                                + permissionText
                                                                + ".")

                                .asset(asset)

                                .read(false)

                                .build();

                notificationRepository.save(
                                notification);
        }

        // =========================================================
        // CREATE ACCESS REMOVED NOTIFICATION
        // =========================================================

        public void createAccessRemovedNotification(
                        User owner,
                        User sharedUser,
                        DigitalAsset asset) {

                Notification notification = Notification.builder()

                                .user(sharedUser)

                                .title("Asset access removed")

                                .message(
                                                owner.getName()
                                                                + " removed your access to \""
                                                                + asset.getTitle()
                                                                + "\".")

                                .asset(null)

                                .read(false)

                                .build();

                notificationRepository.save(
                                notification);
        }

        // =========================================================
        // MAP ENTITY → RESPONSE
        // =========================================================

        private NotificationResponse mapToResponse(
                        Notification notification) {

                DigitalAsset asset = notification.getAsset();

                return new NotificationResponse(

                                notification.getId(),

                                notification.getTitle(),

                                notification.getMessage(),

                                asset != null
                                                ? asset.getId()
                                                : null,

                                asset != null
                                                ? asset.getTitle()
                                                : null,

                                notification.isRead(),

                                notification.getCreatedAt());
        }

        @Transactional
        public void detachNotificationsFromAsset(Long assetId) {

                notificationRepository.detachNotificationsFromAsset(assetId);
        }
}