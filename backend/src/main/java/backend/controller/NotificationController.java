package backend.controller;

import backend.dto.NotificationResponse;
import backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService =
                notificationService;
    }

    // =========================================================
    // GET ALL NOTIFICATIONS
    //
    // GET /api/notifications
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getNotifications(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            List<NotificationResponse> notifications =
                    notificationService
                            .getNotifications(email);

            return ResponseEntity.ok(
                    notifications
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // GET UNREAD COUNT
    //
    // GET /api/notifications/unread-count
    // =========================================================

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            long count =
                    notificationService
                            .getUnreadCount(email);

            return ResponseEntity.ok(
                    count
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // MARK ONE AS READ
    //
    // PUT /api/notifications/{id}/read
    // =========================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(

            @PathVariable Long id,

            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            notificationService.markAsRead(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    "Notification marked as read"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // MARK ALL AS READ
    //
    // PUT /api/notifications/read-all
    // =========================================================

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            Authentication authentication
    ) {

        try {

            String email =
                    authentication.getName();

            notificationService.markAllAsRead(
                    email
            );

            return ResponseEntity.ok(
                    "All notifications marked as read"
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}