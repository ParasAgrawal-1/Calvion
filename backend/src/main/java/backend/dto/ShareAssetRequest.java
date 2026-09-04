package backend.dto;

import backend.entity.AssetPermission;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShareAssetRequest {

    private String email;

    private AssetPermission permission;
}