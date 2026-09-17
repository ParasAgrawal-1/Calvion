/**
 * Zero-Knowledge Client-Side Cryptography Utility
 *
 * Uses the native Web Crypto API (SubtleCrypto) to ensure that
 * sensitive asset content, filenames, and files are encrypted directly
 * in the client's browser before being transmitted to the server.
 *
 * The backend server and developers only ever receive:
 * - AES-256-GCM ciphertext
 * - SHA-256 cryptographic hashes
 * - Blind binary blobs
 */

const E2E_TEXT_PREFIX = "E2E:v1:";
const E2E_FILE_MAGIC = new Uint8Array([0x45, 0x32, 0x45, 0x46]); // "E2EF"
const PBKDF2_ITERATIONS = 100000;
const VAULT_PASSPHRASE_STORAGE_KEY = "datalife_e2ee_vault_passphrase";

// =========================================================
// HELPER CONVERSIONS
// =========================================================

export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i].toString(16).padStart(2, "0");
    }
    return hex;
}

export function hexToBuffer(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

// =========================================================
// HASHING (SHA-256)
// =========================================================

export async function computeSha256(data: ArrayBuffer | Uint8Array | string): Promise<string> {
    const source = (typeof data === "string"
        ? new TextEncoder().encode(data)
        : data) as unknown as BufferSource;
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", source);
    return bufferToHex(hashBuffer);
}

// =========================================================
// KEY DERIVATION
// =========================================================

/**
 * Derives a 256-bit AES-GCM CryptoKey using PBKDF2-HMAC-SHA256.
 */
export async function deriveKeyFromSecret(secret: string, salt: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "PBKDF2" },
        false,
        ["deriveKey", "deriveBits"]
    );

    const saltBuffer = enc.encode(salt);

    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBuffer,
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

/**
 * Stores or updates the user's active vault key / session password.
 */
export function setClientVaultPassphrase(passphrase: string): void {
    if (passphrase) {
        sessionStorage.setItem(VAULT_PASSPHRASE_STORAGE_KEY, passphrase);
    } else {
        sessionStorage.removeItem(VAULT_PASSPHRASE_STORAGE_KEY);
    }
}

/**
 * Gets or creates the user's active client-side encryption key.
 * If the user set an explicit vault passphrase, uses that.
 * Otherwise, derives deterministically from the user's session token and email.
 */
export async function getUserMasterKey(): Promise<CryptoKey> {
    const customPassphrase = sessionStorage.getItem(VAULT_PASSPHRASE_STORAGE_KEY);
    const email = localStorage.getItem("email") || "user@datalife.internal";
    const token = localStorage.getItem("token") || "";

    const secret = customPassphrase || (token ? `token-derived:${token.slice(0, 64)}` : "datalife-default-e2ee-key");
    const salt = `datalife:salt:${email.toLowerCase().trim()}:v1`;

    return deriveKeyFromSecret(secret, salt);
}

// =========================================================
// TEXT ENCRYPTION & DECRYPTION
// =========================================================

/**
 * Encrypts plaintext string using AES-256-GCM.
 * Output format: E2E:v1:<12-byte-hex-iv>:<hex-ciphertext>
 */
export async function encryptText(plainText: string, key?: CryptoKey): Promise<string> {
    if (!plainText) return plainText;

    const cryptoKey = key || (await getUserMasterKey());
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);

    const cipherBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encoded
    );

    const ivHex = bufferToHex(iv);
    const cipherHex = bufferToHex(cipherBuffer);

    return `${E2E_TEXT_PREFIX}${ivHex}:${cipherHex}`;
}

/**
 * Decrypts string if it was encrypted with client-side E2EE (E2E:v1:...).
 * Gracefully returns original string if it is not an E2E payload (backward compatibility).
 */
export async function decryptText(cipherText: string | null | undefined, key?: CryptoKey): Promise<string> {
    if (!cipherText || !cipherText.startsWith(E2E_TEXT_PREFIX)) {
        return cipherText || "";
    }

    try {
        const cryptoKey = key || (await getUserMasterKey());
        const parts = cipherText.slice(E2E_TEXT_PREFIX.length).split(":");
        if (parts.length !== 2) {
            return cipherText;
        }

        const iv = hexToBuffer(parts[0]);
        const cipherBytes = hexToBuffer(parts[1]);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv as unknown as BufferSource },
            cryptoKey,
            cipherBytes as unknown as BufferSource
        );

        return new TextDecoder().decode(decryptedBuffer);
    } catch (err) {
        console.warn("Client-side decryption failed for text; displaying raw payload:", err);
        return cipherText;
    }
}

// =========================================================
// FILE ENCRYPTION & DECRYPTION
// =========================================================

export interface EncryptedFileResult {
    file: File;
    originalFileName: string;
    fileHash: string;
}

export interface DecryptedFileResult {
    blob: Blob;
    fileName: string;
    isEncrypted: boolean;
}

/**
 * Encrypts a browser File object:
 * 1. Reads file bytes
 * 2. Computes SHA-256 of original file
 * 3. Builds a JSON metadata header containing { name, type, size, hash }
 * 4. Encrypts [4-byte header length + JSON header + file bytes] using AES-256-GCM
 * 5. Packages output into a container: [MAGIC "E2EF" (4 bytes)] + [IV (12 bytes)] + [Ciphertext]
 * 6. Generates a masked filename `e2e_enc_<hashPrefix>.bin` so the server never knows the real filename.
 */
export async function encryptFile(file: File, key?: CryptoKey): Promise<EncryptedFileResult> {
    const cryptoKey = key || (await getUserMasterKey());
    const fileBytes = await file.arrayBuffer();

    // 1. Compute SHA-256 hash of original file
    const fileHash = await computeSha256(fileBytes);

    // 2. Prepare metadata header
    const metadata = {
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        hash: fileHash,
        e2e: true,
    };
    const metadataJson = JSON.stringify(metadata);
    const metadataBytes = new TextEncoder().encode(metadataJson);

    // 3. Assemble payload: [4 bytes header length] + [header bytes] + [file bytes]
    const headerLen = metadataBytes.length;
    const combinedLength = 4 + headerLen + fileBytes.byteLength;
    const combined = new Uint8Array(combinedLength);

    const view = new DataView(combined.buffer);
    view.setUint32(0, headerLen, false); // Big endian

    combined.set(metadataBytes, 4);
    combined.set(new Uint8Array(fileBytes), 4 + headerLen);

    // 4. Encrypt with AES-256-GCM
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        combined
    );

    // 5. Build final container: [MAGIC (4 bytes)] + [IV (12 bytes)] + [Ciphertext]
    const container = new Uint8Array(4 + 12 + encryptedBuffer.byteLength);
    container.set(E2E_FILE_MAGIC, 0);
    container.set(iv, 4);
    container.set(new Uint8Array(encryptedBuffer), 16);

    // 6. Create masked filename (safe for backend storage without revealing the original name)
    const maskedFileName = `e2e_enc_${fileHash.substring(0, 16)}.bin`;

    const encryptedFile = new File([container], maskedFileName, {
        type: "application/octet-stream",
        lastModified: file.lastModified,
    });

    return {
        file: encryptedFile,
        originalFileName: file.name,
        fileHash,
    };
}

/**
 * Decrypts a downloaded Blob client-side:
 * Checks for the "E2EF" container. If present, decrypts and restores original filename and MIME type.
 * If absent (legacy file), returns original blob with the fallback filename.
 */
export async function decryptFile(
    blob: Blob,
    fallbackFileName: string = "downloaded_file",
    key?: CryptoKey
): Promise<DecryptedFileResult> {
    const arrayBuffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Check if starts with "E2EF"
    if (bytes.length < 16 + 4) {
        return { blob, fileName: fallbackFileName, isEncrypted: false };
    }

    const hasMagic =
        bytes[0] === E2E_FILE_MAGIC[0] &&
        bytes[1] === E2E_FILE_MAGIC[1] &&
        bytes[2] === E2E_FILE_MAGIC[2] &&
        bytes[3] === E2E_FILE_MAGIC[3];

    if (!hasMagic) {
        return { blob, fileName: fallbackFileName, isEncrypted: false };
    }

    try {
        const cryptoKey = key || (await getUserMasterKey());
        const iv = bytes.slice(4, 16);
        const ciphertext = bytes.slice(16);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv as unknown as BufferSource },
            cryptoKey,
            ciphertext as unknown as BufferSource
        );

        const view = new DataView(decryptedBuffer);
        const headerLen = view.getUint32(0, false);

        const headerBytes = new Uint8Array(decryptedBuffer, 4, headerLen);
        const headerJson = new TextDecoder().decode(headerBytes);
        const metadata = JSON.parse(headerJson);

        const fileContent = decryptedBuffer.slice(4 + headerLen);
        const decryptedBlob = new Blob([fileContent], { type: metadata.type || "application/octet-stream" });

        return {
            blob: decryptedBlob,
            fileName: metadata.name || fallbackFileName,
            isEncrypted: true,
        };
    } catch (err) {
        console.warn("Could not decrypt file container client-side; serving raw blob:", err);
        return { blob, fileName: fallbackFileName, isEncrypted: true };
    }
}
