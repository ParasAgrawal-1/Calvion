package backend.dto;

import backend.entity.AssetType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDigitalAssetRequest {

    private String title;

    private String description;

    private AssetType type;

    private String content;
}