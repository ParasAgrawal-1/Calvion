package backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class CryptoServiceTest {

    private CryptoService cryptoService;

    @BeforeEach
    void setUp() {
        cryptoService = new CryptoService();
        ReflectionTestUtils.setField(cryptoService, "secretKeyString", "test-secret-key-32-chars-long-12345");
        cryptoService.init();
    }

    @Test
    void testTextEncryptionAndDecryption() {
        String originalSecret = "SuperSecretPassword123!#$";

        String encrypted = cryptoService.encryptText(originalSecret);
        assertNotNull(encrypted);
        assertTrue(encrypted.startsWith("ENC:"));
        assertNotEquals(originalSecret, encrypted);

        String decrypted = cryptoService.decryptText(encrypted);
        assertEquals(originalSecret, decrypted);
    }

    @Test
    void testLegacyUnencryptedTextFallback() {
        String legacyPlaintext = "Plain unencrypted legacy note";
        String decrypted = cryptoService.decryptText(legacyPlaintext);
        assertEquals(legacyPlaintext, decrypted);
    }

    @Test
    void testFileEncryptionDecryptionAndSha256(@TempDir Path tempDir) throws IOException {
        String content = "Confidential financial document data: Revenue=$1,000,000";
        byte[] originalBytes = content.getBytes(StandardCharsets.UTF_8);
        Path targetEncryptedFile = tempDir.resolve("test_doc.bin");

        CryptoService.FileEncryptionResult result = cryptoService.encryptAndSave(
                new ByteArrayInputStream(originalBytes),
                targetEncryptedFile
        );

        assertNotNull(result);
        assertEquals(originalBytes.length, result.originalSize());
        assertTrue(Files.exists(targetEncryptedFile));

        // The file on disk must be encrypted and not match the raw plaintext bytes
        byte[] rawDiskBytes = Files.readAllBytes(targetEncryptedFile);
        assertFalse(new String(rawDiskBytes, StandardCharsets.UTF_8).contains("Confidential financial document"));

        // Verify SHA-256 checksum matches
        String computedSha256 = cryptoService.computeSha256(originalBytes);
        assertEquals(computedSha256, result.sha256Checksum());

        // Decrypt file and verify content
        byte[] decryptedBytes = cryptoService.decryptFileToBytes(targetEncryptedFile);
        assertArrayEquals(originalBytes, decryptedBytes);
        assertEquals(content, new String(decryptedBytes, StandardCharsets.UTF_8));
    }

    @Test
    void testTamperDetectionThrowsException(@TempDir Path tempDir) throws IOException {
        String content = "Crucial contract terms cannot be tampered with.";
        byte[] originalBytes = content.getBytes(StandardCharsets.UTF_8);
        Path targetEncryptedFile = tempDir.resolve("contract.bin");

        cryptoService.encryptAndSave(
                new ByteArrayInputStream(originalBytes),
                targetEncryptedFile
        );

        byte[] rawEncryptedBytes = Files.readAllBytes(targetEncryptedFile);
        // Tamper with one byte in the ciphertext portion
        rawEncryptedBytes[rawEncryptedBytes.length - 1] ^= 0xFF;
        Files.write(targetEncryptedFile, rawEncryptedBytes);

        // Attempting to decrypt tampered data must fail authentication
        assertThrows(RuntimeException.class, () -> {
            cryptoService.decryptFileToBytes(targetEncryptedFile);
        });
    }

    @Test
    void testNullSafeHandling() {
        assertNull(cryptoService.encryptText(null));
        assertNull(cryptoService.decryptText(null));
        assertNull(cryptoService.encryptBytes(null));
        assertNull(cryptoService.decryptBytes(null));
        assertNull(cryptoService.computeSha256(null));
    }
}
