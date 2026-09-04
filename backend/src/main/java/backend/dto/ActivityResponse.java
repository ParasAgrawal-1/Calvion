package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ActivityResponse {

    private Long id;

    private String action;

    private String description;

    private Long assetId;

    private String assetTitle;

    private LocalDateTime createdAt;
}