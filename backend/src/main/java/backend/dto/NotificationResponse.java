package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponse {

    private Long id;

    private String title;

    private String message;

    private Long assetId;

    private String assetTitle;

    private boolean read;

    private LocalDateTime createdAt;
}