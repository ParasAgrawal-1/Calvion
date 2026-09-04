package backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UploadedFileResponse {

    private Long id;

    private String originalFileName;

    private String fileType;

    private Long fileSize;
}