package backend.dto.developer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CodeRunRequest {

    private String language;
    private String sourceCode;
    private String stdin;
    private Integer timeoutSeconds;
}
