package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsDto {
    private String autoLockDuration;
    private String defaultSharePermission;
    private Boolean allowFileDownload;
    private Boolean requirePassphrase;
    private Boolean notify30Days;
    private Boolean notify14Days;
    private Boolean notify7Days;
    private Boolean notify1Day;
    private Boolean emailChannel;
    private Boolean inAppChannel;
    private Boolean discoverableByEmail;
    private Boolean showDigitalIdentityPublicly;
    private Boolean collectTelemetry;
    private Boolean logAuditHistory;
}
