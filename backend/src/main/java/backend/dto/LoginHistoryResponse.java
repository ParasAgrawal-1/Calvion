package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistoryResponse {
    private Long id;
    private String device;
    private String browser;
    private String os;
    private String ipAddress;
    private String location;
    private String status;
    private Boolean isCurrent;
    private LocalDateTime timestamp;
}
