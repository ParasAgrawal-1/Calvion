package backend.dto.developer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeRunResponse {

    private String status; // "SUCCESS", "COMPILATION_ERROR", "RUNTIME_ERROR", "TIMEOUT", "SYSTEM_ERROR"
    private String stdout;
    private String stderr;
    private Integer exitCode;
    private Long executionTimeMs;
    private Long memoryKb;
    private String message;
}
