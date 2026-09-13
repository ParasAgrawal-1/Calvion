package backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class CryptoService {

    private static final String AES_ALGORITHM = "AES";
    private static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12; // 96 bits recommended for GCM
    private static final int GCM_TAG_LENGTH = 128; // 128 bit auth tag
    private static final String ENC_PREFIX = "ENC:";

    private static CryptoService instance;

    @Value("${crypto.secret-key:calvion-aes256-gcm-master-encryption-key-2026}")
    private String secretKeyString;

    private SecretKey secretKey;
    private final SecureRandom secureRandom = new SecureRandom();

    @PostConstruct
    public void init() {
        try {
            MessageDigest sha = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha.digest(secretKeyString.getBytes(StandardCharsets.UTF_8));
            this.secretKey = new SecretKeySpec(keyBytes, AES_ALGORITHM);
            instance = this;
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Failed to initialize cryptographic provider", e);
        }
    }

    public static CryptoService getInstance() {
        return instance;
    }

    /**
     * Encrypts plaintext bytes using AES-256-GCM.
     * Output format: [12 bytes IV] + [Ciphertext + 16 bytes GCM Auth Tag]
     */
    public byte[] encryptBytes(byte[] plaintext) {
        if (plaintext == null) {
            return null;
        }
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

            byte[] cipherText = cipher.doFinal(plaintext);

            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + cipherText.length);
            byteBuffer.put(iv);
            byteBuffer.put(cipherText);
            return byteBuffer.array();
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed: " + e.getMessage(), e);
        }
    }

    /**
     * Decrypts ciphertext bytes encrypted with AES-256-GCM.
     * Automatically verifies the 128-bit authentication tag.
     */
    public byte[] decryptBytes(byte[] encryptedBytes) {
        if (encryptedBytes == null) {
            return null;
        }
        if (encryptedBytes.length < GCM_IV_LENGTH + (GCM_TAG_LENGTH / 8)) {
            throw new IllegalArgumentException("Encrypted data is too short to be valid AES-GCM ciphertext");
        }
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            System.arraycopy(encryptedBytes, 0, iv, 0, GCM_IV_LENGTH);

            int cipherTextLength = encryptedBytes.length - GCM_IV_LENGTH;
            byte[] cipherText = new byte[cipherTextLength];
            System.arraycopy(encryptedBytes, GCM_IV_LENGTH, cipherText, 0, cipherTextLength);

            Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

            return cipher.doFinal(cipherText);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed or data has been tampered with: " + e.getMessage(), e);
        }
    }

    /**
     * Encrypts a text string and returns "ENC:" + Base64(IV + Ciphertext + Tag).
     */
    public String encryptText(String plainText) {
        if (plainText == null) {
            return null;
        }
        byte[] encrypted = encryptBytes(plainText.getBytes(StandardCharsets.UTF_8));
        return ENC_PREFIX + Base64.getEncoder().encodeToString(encrypted);
    }

    /**
     * Decrypts text. If not prefixed with "ENC:", returns the original text (backward compatible).
     */
    public String decryptText(String cipherText) {
        if (cipherText == null) {
            return null;
        }
        if (!cipherText.startsWith(ENC_PREFIX)) {
            return cipherText;
        }
        try {
            String base64 = cipherText.substring(ENC_PREFIX.length());
            byte[] encrypted = Base64.getDecoder().decode(base64);
            byte[] decrypted = decryptBytes(encrypted);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt text: " + e.getMessage(), e);
        }
    }

    /**
     * Computes the SHA-256 hash of a byte array and returns as lowercase hex string.
     */
    public String computeSha256(byte[] data) {
        if (data == null) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Result of encrypting a file.
     */
    public record FileEncryptionResult(
            String sha256Checksum,
            long originalSize,
            long encryptedSize
    ) {}

    /**
     * Reads input stream, computes SHA-256, encrypts with AES-256-GCM, and writes to target path.
     */
    public FileEncryptionResult encryptAndSave(InputStream inputStream, Path targetPath) throws IOException {
        byte[] plainBytes = inputStream.readAllBytes();
        String sha256 = computeSha256(plainBytes);
        byte[] encryptedBytes = encryptBytes(plainBytes);

        if (targetPath.getParent() != null) {
            Files.createDirectories(targetPath.getParent());
        }

        Files.write(targetPath, encryptedBytes, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

        return new FileEncryptionResult(sha256, plainBytes.length, encryptedBytes.length);
    }

    /**
     * Reads encrypted file from path and decrypts it into plaintext bytes.
     */
    public byte[] decryptFileToBytes(Path filePath) throws IOException {
        byte[] encryptedBytes = Files.readAllBytes(filePath);
        return decryptBytes(encryptedBytes);
    }
}
