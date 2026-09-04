package backend.dto;

import backend.entity.AssetPermission;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AssetShareResponse {

    private Long id;

    private String name;

    private String email;

    private AssetPermission permission;

    private LocalDateTime sharedAt;
}