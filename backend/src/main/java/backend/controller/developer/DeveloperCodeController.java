package backend.controller.developer;

import backend.dto.developer.CodeRunRequest;
import backend.dto.developer.CodeRunResponse;
import backend.service.developer.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/developer")
@CrossOrigin(origins = "*")
public class DeveloperCodeController {

    private final CodeExecutionService codeExecutionService;

    public DeveloperCodeController(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    @PostMapping("/code/run")
    public ResponseEntity<CodeRunResponse> runCode(@RequestBody CodeRunRequest request) {
        CodeRunResponse response = codeExecutionService.executeCode(request);
        return ResponseEntity.ok(response);
    }
}
