package backend.service.developer;

import backend.dto.developer.CodeRunRequest;
import backend.dto.developer.CodeRunResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class CodeExecutionService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionService.class);
    private static final int DEFAULT_TIMEOUT_SECONDS = 7;

    public CodeRunResponse executeCode(CodeRunRequest request) {
        if (request == null || request.getSourceCode() == null || request.getSourceCode().trim().isEmpty()) {
            return CodeRunResponse.builder()
                    .status("SYSTEM_ERROR")
                    .stderr("No source code provided.")
                    .build();
        }

        String lang = (request.getLanguage() != null ? request.getLanguage().toLowerCase().trim() : "python");
        String code = request.getSourceCode();
        String stdin = (request.getStdin() != null ? request.getStdin() : "");
        int timeoutSec = (request.getTimeoutSeconds() != null && request.getTimeoutSeconds() > 0 && request.getTimeoutSeconds() <= 15)
                ? request.getTimeoutSeconds()
                : DEFAULT_TIMEOUT_SECONDS;

        // Try local process execution first
        try {
            CodeRunResponse localResult = executeLocally(lang, code, stdin, timeoutSec);
            if (localResult != null) {
                return localResult;
            }
        } catch (Exception e) {
            log.warn("Local code execution for {} failed ({}), falling back to remote sandbox: {}", lang, e.getClass().getSimpleName(), e.getMessage());
        }

        // Remote fallback via Judge0 sandbox
        return executeRemoteJudge0(lang, code, stdin);
    }

    private CodeRunResponse executeLocally(String lang, String code, String stdin, int timeoutSec) throws Exception {
        Path tempDir = Files.createTempDirectory("calvion_code_");
        long startTime = System.currentTimeMillis();

        try {
            switch (lang) {
                case "python":
                case "py":
                    return runPython(tempDir, code, stdin, timeoutSec, startTime);
                case "javascript":
                case "js":
                case "node":
                    return runNodeJs(tempDir, code, stdin, timeoutSec, startTime);
                case "cpp":
                case "c++":
                    return runCpp(tempDir, code, stdin, timeoutSec, startTime);
                case "java":
                    return runJava(tempDir, code, stdin, timeoutSec, startTime);
                default:
                    return null; // Fallback to remote for other languages like Go/TypeScript
            }
        } finally {
            deleteDirectoryQuietly(tempDir.toFile());
        }
    }

    private CodeRunResponse runPython(Path tempDir, String code, String stdin, int timeoutSec, long startTime) throws Exception {
        File scriptFile = new File(tempDir.toFile(), "solution.py");
        Files.writeString(scriptFile.toPath(), code, StandardCharsets.UTF_8);

        ProcessBuilder pb = new ProcessBuilder("python", scriptFile.getAbsolutePath());
        pb.directory(tempDir.toFile());
        return runProcess(pb, stdin, timeoutSec, startTime);
    }

    private CodeRunResponse runNodeJs(Path tempDir, String code, String stdin, int timeoutSec, long startTime) throws Exception {
        File scriptFile = new File(tempDir.toFile(), "solution.js");
        Files.writeString(scriptFile.toPath(), code, StandardCharsets.UTF_8);

        ProcessBuilder pb = new ProcessBuilder("node", scriptFile.getAbsolutePath());
        pb.directory(tempDir.toFile());
        return runProcess(pb, stdin, timeoutSec, startTime);
    }

    private CodeRunResponse runCpp(Path tempDir, String code, String stdin, int timeoutSec, long startTime) throws Exception {
        File srcFile = new File(tempDir.toFile(), "solution.cpp");
        File exeFile = new File(tempDir.toFile(), System.getProperty("os.name").toLowerCase().contains("win") ? "solution.exe" : "solution.out");
        Files.writeString(srcFile.toPath(), code, StandardCharsets.UTF_8);

        // Compile
        ProcessBuilder compilePb = new ProcessBuilder("g++", "-O2", srcFile.getAbsolutePath(), "-o", exeFile.getAbsolutePath());
        compilePb.directory(tempDir.toFile());
        Process compileProcess = compilePb.start();
        String compileErr = readStream(compileProcess.getErrorStream());
        boolean compileSuccess = compileProcess.waitFor(10, TimeUnit.SECONDS);

        if (!compileSuccess || compileProcess.exitValue() != 0 || !exeFile.exists()) {
            return CodeRunResponse.builder()
                    .status("COMPILATION_ERROR")
                    .stderr(compileErr)
                    .exitCode(compileProcess.exitValue())
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }

        // Run compiled executable
        ProcessBuilder runPb = new ProcessBuilder(exeFile.getAbsolutePath());
        runPb.directory(tempDir.toFile());
        return runProcess(runPb, stdin, timeoutSec, startTime);
    }

    private CodeRunResponse runJava(Path tempDir, String code, String stdin, int timeoutSec, long startTime) throws Exception {
        // Detect class name or default to Solution / Main
        String className = "Solution";
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("public\\s+class\\s+([A-Za-z0-9_]+)").matcher(code);
        if (m.find()) {
            className = m.group(1);
        }

        File srcFile = new File(tempDir.toFile(), className + ".java");
        Files.writeString(srcFile.toPath(), code, StandardCharsets.UTF_8);

        // Compile
        ProcessBuilder compilePb = new ProcessBuilder("javac", srcFile.getAbsolutePath());
        compilePb.directory(tempDir.toFile());
        Process compileProcess = compilePb.start();
        String compileErr = readStream(compileProcess.getErrorStream());
        boolean compileDone = compileProcess.waitFor(10, TimeUnit.SECONDS);

        if (!compileDone || compileProcess.exitValue() != 0) {
            return CodeRunResponse.builder()
                    .status("COMPILATION_ERROR")
                    .stderr(compileErr)
                    .exitCode(compileProcess.exitValue())
                    .executionTimeMs(System.currentTimeMillis() - startTime)
                    .build();
        }

        // Run
        ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toAbsolutePath().toString(), className);
        runPb.directory(tempDir.toFile());
        return runProcess(runPb, stdin, timeoutSec, startTime);
    }

    private CodeRunResponse runProcess(ProcessBuilder pb, String stdin, int timeoutSec, long startTime) throws Exception {
        Process process = pb.start();

        // Write standard input
        if (stdin != null && !stdin.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(stdin.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }
        } else {
            process.getOutputStream().close();
        }

        boolean finished = process.waitFor(timeoutSec, TimeUnit.SECONDS);
        long execTime = System.currentTimeMillis() - startTime;

        if (!finished) {
            process.destroyForcibly();
            return CodeRunResponse.builder()
                    .status("TIMEOUT")
                    .stderr("Time Limit Exceeded (" + timeoutSec + "s max execution window).")
                    .executionTimeMs(execTime)
                    .exitCode(-1)
                    .build();
        }

        String stdout = readStream(process.getInputStream());
        String stderr = readStream(process.getErrorStream());
        int exitCode = process.exitValue();

        String status = (exitCode == 0 && stderr.isEmpty()) ? "SUCCESS" : (exitCode != 0 ? "RUNTIME_ERROR" : "SUCCESS");

        return CodeRunResponse.builder()
                .status(status)
                .stdout(stdout)
                .stderr(stderr)
                .exitCode(exitCode)
                .executionTimeMs(execTime)
                .build();
    }

    private String readStream(InputStream is) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[1024];
        int nRead;
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
            if (buffer.size() > 512 * 1024) { // 512KB output cap
                buffer.write("\n... [Output truncated at 512KB]".getBytes(StandardCharsets.UTF_8));
                break;
            }
        }
        return buffer.toString(StandardCharsets.UTF_8);
    }

    private void deleteDirectoryQuietly(File dir) {
        if (dir == null || !dir.exists()) return;
        File[] files = dir.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) {
                    deleteDirectoryQuietly(f);
                } else {
                    f.delete();
                }
            }
        }
        dir.delete();
    }

    private CodeRunResponse executeRemoteJudge0(String lang, String code, String stdin) {
        long startTime = System.currentTimeMillis();
        int langId = mapLanguageToJudge0(lang);

        try {
            URL url = new URL("https://ce.judge0.com/submissions?base64_encoded=false&wait=true");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(15000);

            // Escape JSON manually to avoid extra library dependencies
            String escapedCode = escapeJson(code);
            String escapedStdin = escapeJson(stdin);

            String jsonPayload = String.format("{\"source_code\":\"%s\",\"language_id\":%d,\"stdin\":\"%s\"}",
                    escapedCode, langId, escapedStdin);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            InputStream is = (responseCode >= 200 && responseCode < 300) ? conn.getInputStream() : conn.getErrorStream();
            String responseStr = readStream(is);

            long execTime = System.currentTimeMillis() - startTime;

            // Simple parse of Judge0 response fields
            String stdout = extractJsonField(responseStr, "stdout");
            String stderr = extractJsonField(responseStr, "stderr");
            String compileOutput = extractJsonField(responseStr, "compile_output");
            String statusDesc = extractJsonNestedField(responseStr, "status", "description");
            String statusIdStr = extractJsonNestedField(responseStr, "status", "id");

            int statusId = 3;
            try {
                if (statusIdStr != null) statusId = Integer.parseInt(statusIdStr);
            } catch (Exception ignored) {}

            boolean isSuccess = statusId == 3;
            boolean isCompileErr = statusId == 6;
            String effectiveErr = (compileOutput != null && !compileOutput.isEmpty()) ? compileOutput : stderr;

            String status = isSuccess ? "SUCCESS" : isCompileErr ? "COMPILATION_ERROR" : "RUNTIME_ERROR";

            return CodeRunResponse.builder()
                    .status(status)
                    .stdout(stdout != null ? stdout : "")
                    .stderr(effectiveErr != null ? effectiveErr : "")
                    .executionTimeMs(execTime)
                    .message(statusDesc)
                    .build();

        } catch (Exception e) {
            log.error("Remote Judge0 execution failed", e);
            return CodeRunResponse.builder()
                    .status("SYSTEM_ERROR")
                    .stderr("Execution engine unreachable: " + e.getMessage())
                    .build();
        }
    }

    private int mapLanguageToJudge0(String lang) {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
                return 92; // Python 3.11.2
            case "cpp":
            case "c++":
                return 105; // C++ GCC 14.1
            case "java":
                return 91; // Java 17
            case "javascript":
            case "js":
                return 93; // Node.js 18
            case "typescript":
            case "ts":
                return 94; // TypeScript 5
            case "go":
                return 95; // Go 1.18
            default:
                return 92;
        }
    }

    private String escapeJson(String raw) {
        if (raw == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < raw.length(); i++) {
            char c = raw.charAt(i);
            switch (c) {
                case '\\': sb.append("\\\\"); break;
                case '"': sb.append("\\\""); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < ' ') {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                    break;
            }
        }
        return sb.toString();
    }

    private String extractJsonField(String json, String field) {
        String pattern = "\"" + field + "\"\\s*:\\s*\"([^\"]*)\"";
        java.util.regex.Matcher m = java.util.regex.Pattern.compile(pattern).matcher(json);
        if (m.find()) {
            return unescapeJson(m.group(1));
        }
        return null;
    }

    private String extractJsonNestedField(String json, String parent, String child) {
        String pattern = "\"" + parent + "\"\\s*:\\s*\\{[^}]*\"" + child + "\"\\s*:\\s*\"?([^\",\\}]*)\"?";
        java.util.regex.Matcher m = java.util.regex.Pattern.compile(pattern).matcher(json);
        if (m.find()) {
            return m.group(1).trim();
        }
        return null;
    }

    private String unescapeJson(String input) {
        if (input == null) return null;
        return input.replace("\\n", "\n")
                .replace("\\r", "\r")
                .replace("\\t", "\t")
                .replace("\\\"", "\"")
                .replace("\\\\", "\\");
    }
}
