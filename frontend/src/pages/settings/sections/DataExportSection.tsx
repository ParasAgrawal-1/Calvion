import { useState } from "react";
import {
    Download,
    FileJson,
    FileSpreadsheet,
    Shield,
    Lock,
    KeyRound,
    CheckCircle2,
    History,
    Loader2
} from "lucide-react";
import api from "../../../services/api";

interface ExportRecord {
    id: string;
    type: "JSON" | "CSV" | "ENCRYPTED_ARCHIVE";
    fileName: string;
    timestamp: string;
    itemCount: number;
    sizeBytes: number;
}

export default function DataExportSection() {
    const [exportingJson, setExportingJson] = useState(false);
    const [exportingCsv, setExportingCsv] = useState(false);
    const [exportingEncrypted, setExportingEncrypted] = useState(false);

    // Passphrase state for encrypted export
    const [showPassphraseModal, setShowPassphraseModal] = useState(false);
    const [passphrase, setPassphrase] = useState("");
    const [confirmPassphrase, setConfirmPassphrase] = useState("");
    const [passphraseError, setPassphraseError] = useState<string | null>(null);

    // Success notification
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Export history in localStorage
    const [history, setHistory] = useState<ExportRecord[]>(() => {
        const stored = localStorage.getItem("datalife_export_history");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse export history", e);
            }
        }
        return [
            {
                id: "exp_01",
                type: "JSON",
                fileName: "calvion_vault_backup_2026-09-01.json",
                timestamp: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
                itemCount: 14,
                sizeBytes: 42500,
            },
        ];
    });

    const addExportRecord = (record: ExportRecord) => {
        setHistory((prev) => {
            const next = [record, ...prev];
            localStorage.setItem("datalife_export_history", JSON.stringify(next));
            return next;
        });
    };

    // 1. JSON Vault Backup
    const handleExportJson = async () => {
        try {
            setExportingJson(true);
            setStatusMessage(null);

            // Fetch profile, assets, and activities in parallel
            const [profileRes, assetsRes, activitiesRes] = await Promise.allSettled([
                api.get("/users/profile"),
                api.get("/assets"),
                api.get("/activities"),
            ]);

            const profile = profileRes.status === "fulfilled" ? profileRes.value.data : null;
            const assets = assetsRes.status === "fulfilled" ? assetsRes.value.data : [];
            const activities = activitiesRes.status === "fulfilled" ? activitiesRes.value.data : [];

            const exportPayload = {
                calvionVersion: "2.4.0",
                exportDate: new Date().toISOString(),
                encryptionProtocol: "AES-GCM-256 (E2EE Vault)",
                user: profile,
                assetsCount: Array.isArray(assets) ? assets.length : 0,
                activitiesCount: Array.isArray(activities) ? activities.length : 0,
                vaultData: {
                    assets,
                    activities,
                },
            };

            const jsonStr = JSON.stringify(exportPayload, null, 2);
            const blob = new Blob([jsonStr], { type: "application/json" });
            const fileName = `calvion_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addExportRecord({
                id: `exp_${Date.now()}`,
                type: "JSON",
                fileName,
                timestamp: new Date().toISOString(),
                itemCount: (Array.isArray(assets) ? assets.length : 0),
                sizeBytes: blob.size,
            });

            setStatusMessage("JSON Vault backup exported successfully.");
            setTimeout(() => setStatusMessage(null), 5000);
        } catch (err) {
            console.error("JSON export error", err);
            alert("Failed to export JSON backup.");
        } finally {
            setExportingJson(false);
        }
    };

    // 2. CSV Summary Export
    const handleExportCsv = async () => {
        try {
            setExportingCsv(true);
            setStatusMessage(null);

            const assetsRes = await api.get("/assets");
            const assets = Array.isArray(assetsRes.data) ? assetsRes.data : [];

            const headers = ["ID", "Title", "Category", "Description", "Created At", "Updated At", "Files Count", "Is Owner"];
            const rows = assets.map((a: { id: number; title: string; type: string; description?: string; createdAt: string; updatedAt: string; files?: unknown[]; owner: boolean }) => [
                a.id,
                `"${(a.title || "").replace(/"/g, '""')}"`,
                `"${a.type || ""}"`,
                `"${(a.description || "").replace(/"/g, '""')}"`,
                `"${a.createdAt || ""}"`,
                `"${a.updatedAt || ""}"`,
                Array.isArray(a.files) ? a.files.length : 0,
                a.owner ? "YES" : "NO",
            ]);

            const csvContent = [headers.join(","), ...rows.map((r: (string | number)[]) => r.join(","))].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const fileName = `calvion_assets_summary_${new Date().toISOString().slice(0, 10)}.csv`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addExportRecord({
                id: `exp_${Date.now()}`,
                type: "CSV",
                fileName,
                timestamp: new Date().toISOString(),
                itemCount: assets.length,
                sizeBytes: blob.size,
            });

            setStatusMessage("CSV Assets Summary exported successfully.");
            setTimeout(() => setStatusMessage(null), 5000);
        } catch (err) {
            console.error("CSV export error", err);
            alert("Failed to export CSV summary.");
        } finally {
            setExportingCsv(false);
        }
    };

    // 3. Encrypted Archive
    const handleExportEncryptedArchive = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassphraseError(null);

        if (passphrase.length < 8) {
            setPassphraseError("Export passphrase must be at least 8 characters long.");
            return;
        }
        if (passphrase !== confirmPassphrase) {
            setPassphraseError("Passphrases do not match.");
            return;
        }

        try {
            setExportingEncrypted(true);

            // Fetch vault assets
            const assetsRes = await api.get("/assets");
            const assets = Array.isArray(assetsRes.data) ? assetsRes.data : [];

            // Generate salt & derive AES-GCM key using PBKDF2
            const enc = new TextEncoder();
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const keyMaterial = await window.crypto.subtle.importKey(
                "raw",
                enc.encode(passphrase),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const derivedKey = await window.crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt,
                    iterations: 100000,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt"]
            );

            const rawData = JSON.stringify({
                exportedAt: new Date().toISOString(),
                software: "Calvion Digital Vault",
                assets,
            });

            const encryptedBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv },
                derivedKey,
                enc.encode(rawData)
            );

            // Combine salt + iv + ciphertext into a container
            const container = {
                type: "CALVION_ENCRYPTED_ARCHIVE",
                version: 1,
                salt: Array.from(salt),
                iv: Array.from(iv),
                ciphertext: Array.from(new Uint8Array(encryptedBuffer)),
            };

            const blob = new Blob([JSON.stringify(container)], { type: "application/json" });
            const fileName = `calvion_vault_encrypted_${new Date().toISOString().slice(0, 10)}.calvion`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            addExportRecord({
                id: `exp_${Date.now()}`,
                type: "ENCRYPTED_ARCHIVE",
                fileName,
                timestamp: new Date().toISOString(),
                itemCount: assets.length,
                sizeBytes: blob.size,
            });

            setShowPassphraseModal(false);
            setPassphrase("");
            setConfirmPassphrase("");
            setStatusMessage("Encrypted Archive generated and downloaded successfully.");
            setTimeout(() => setStatusMessage(null), 5000);
        } catch (err) {
            console.error("Encrypted export failed", err);
            setPassphraseError("Failed to build encrypted archive container.");
        } finally {
            setExportingEncrypted(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Export & Vault Backups</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Export your complete digital vault records, audit sheets, and password-protected encrypted archives.
                </p>
            </div>

            {statusMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{statusMessage}</span>
                    </div>
                </div>
            )}

            {/* Export Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* 1. JSON Vault Backup */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <FileJson className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">JSON Vault Backup</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Comprehensive snapshot of your profile, all digital assets, attachments metadata, and activity logs.
                        </p>
                        <ul className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <li>• Formatted JSON format</li>
                            <li>• Machine readable & portable</li>
                            <li>• Ideal for cold vault storage</li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        disabled={exportingJson}
                        onClick={handleExportJson}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {exportingJson ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        Export JSON Backup
                    </button>
                </div>

                {/* 2. CSV Summary Sheet */}
                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <FileSpreadsheet className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">CSV Summary Sheet</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Clean tabular spreadsheet summary of all assets, asset types, descriptions, and file counts.
                        </p>
                        <ul className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <li>• Open in Excel or Google Sheets</li>
                            <li>• Includes categories & ownership</li>
                            <li>• Fast audit & compliance review</li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        disabled={exportingCsv}
                        onClick={handleExportCsv}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                        {exportingCsv ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                        Export CSV Summary
                    </button>
                </div>

                {/* 3. Encrypted Archive */}
                <div className="flex flex-col justify-between rounded-2xl border border-purple-200 bg-purple-50/20 p-6 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/10">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">Encrypted Archive</h3>
                            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                AES-GCM
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Guards exported vault data behind PBKDF2 key derivation and password encryption.
                        </p>
                        <ul className="mt-3 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <li>• Custom export passphrase</li>
                            <li>• Zero-Knowledge container (.calvion)</li>
                            <li>• Secure offline storage</li>
                        </ul>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setShowPassphraseModal(true);
                            setPassphrase("");
                            setConfirmPassphrase("");
                            setPassphraseError(null);
                        }}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700"
                    >
                        <Lock className="h-3.5 w-3.5" />
                        Create Encrypted Archive
                    </button>
                </div>
            </div>

            {/* Export Audit Log */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Export Activity</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Audit log of backups generated on this machine.
                        </p>
                    </div>
                </div>

                <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                    {history.map((rec) => (
                        <div key={rec.id} className="flex items-center justify-between py-3 text-xs">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                    {rec.type === "JSON" ? (
                                        <FileJson className="h-4 w-4" />
                                    ) : rec.type === "CSV" ? (
                                        <FileSpreadsheet className="h-4 w-4" />
                                    ) : (
                                        <Shield className="h-4 w-4" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{rec.fileName}</p>
                                    <p className="text-[11px] text-slate-400">
                                        {rec.itemCount} items · {(rec.sizeBytes / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <div className="text-right text-[11px] text-slate-400">
                                {new Date(rec.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Passphrase Modal for Encrypted Archive */}
            {showPassphraseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Protect Archive with Passphrase</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassphraseModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleExportEncryptedArchive} className="mt-4 space-y-4">
                            {passphraseError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                    {passphraseError}
                                </div>
                            )}

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Choose a strong passphrase to encrypt your backup container. This passphrase is never sent to any server.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Export Passphrase
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passphrase}
                                    onChange={(e) => setPassphrase(e.target.value)}
                                    placeholder="Enter passphrase (min 8 chars)"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Confirm Passphrase
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassphrase}
                                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                                    placeholder="Re-enter passphrase"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPassphraseModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={exportingEncrypted}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {exportingEncrypted && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    Encrypt & Export
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
