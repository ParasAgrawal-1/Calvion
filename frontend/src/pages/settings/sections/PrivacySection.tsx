import { useState, useEffect } from "react";
import {
    LockKeyhole,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    AlertTriangle,
    Key,
    Database,
    Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

interface PrivacySettings {
    discoverableByEmail: boolean;
    showDigitalIdentityPublicly: boolean;
    collectTelemetry: boolean;
    logAuditHistory: boolean;
}

export default function PrivacySection() {
    const navigate = useNavigate();

    // Privacy toggles
    const [settings, setSettings] = useState<PrivacySettings>({
        discoverableByEmail: true,
        showDigitalIdentityPublicly: false,
        collectTelemetry: false,
        logAuditHistory: true,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get<PrivacySettings>("/users/settings");
                if (res.data) {
                    setSettings((prev) => ({ ...prev, ...res.data }));
                }
            } catch (err) {
                console.error("Failed to load privacy settings from backend", err);
            }
        };
        fetchSettings();
    }, []);

    const updateSettings = async (patch: Partial<PrivacySettings>) => {
        setSettings((prev) => ({ ...prev, ...patch }));
        try {
            await api.put("/users/settings", patch);
        } catch (err) {
            console.error("Failed to persist privacy settings to backend", err);
        }
    };

    // Client crypto diagnostics
    const [cryptoSupported, setCryptoSupported] = useState<boolean>(true);
    useEffect(() => {
        if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
            setCryptoSupported(true);
        } else {
            setCryptoSupported(false);
        }
    }, []);

    // Keys Purge action
    const [keysPurged, setKeysPurged] = useState(false);
    const handlePurgeKeys = () => {
        if (!window.confirm("Purge local encryption keys from this browser? You will need to re-authenticate to unlock your encrypted vault items.")) {
            return;
        }
        localStorage.removeItem("datalife_master_key");
        localStorage.removeItem("datalife_temp_vault_keys");
        sessionStorage.clear();
        setKeysPurged(true);
        setTimeout(() => setKeysPurged(false), 3000);
    };

    // Delete Account Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteError(null);

        if (deleteConfirmation.trim() !== "DELETE") {
            setDeleteError('Please type "DELETE" exactly to confirm.');
            return;
        }

        try {
            setDeleteLoading(true);
            await api.delete("/users/profile");

            // Clean storage and tokens
            localStorage.clear();
            sessionStorage.clear();

            alert("Your Calvion vault account has been permanently deleted.");
            navigate("/login");
        } catch (err: unknown) {
            console.error("Account deletion failed", err);
            setDeleteError("Failed to delete account. Please verify your credentials or network.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Privacy & Identity Controls</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Control how your digital identity is discovered, manage telemetry, and review Zero-Knowledge protection.
                </p>
            </div>

            {/* Zero-Knowledge Architecture Status Card */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-purple-50/40 p-6 shadow-sm dark:border-blue-900/50 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Zero-Knowledge Architecture</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Client-Side End-to-End Cryptography</p>
                        </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Active & Enforced
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="rounded-xl bg-white/70 p-3 text-xs dark:bg-slate-800/60">
                        <p className="font-semibold text-slate-900 dark:text-white">Hardware Web Crypto API</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {cryptoSupported ? "Verified Native Support" : "Fallback Polyfill"}
                        </p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-3 text-xs dark:bg-slate-800/60">
                        <p className="font-semibold text-slate-900 dark:text-white">Payload Encryption</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">AES-256-GCM / PBKDF2</p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-3 text-xs dark:bg-slate-800/60">
                        <p className="font-semibold text-slate-900 dark:text-white">Server Visibility</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">0% plaintext visibility</p>
                    </div>
                </div>
            </div>

            {/* Identity & Discovery Controls */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <LockKeyhole className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Digital Identity Discovery</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Control how other Calvion users can locate your digital identity for asset sharing.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Discoverable by Email Address</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Allow other vault owners to share assets directly to your registered email.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={settings.discoverableByEmail}
                                onChange={(e) => updateSettings({ discoverableByEmail: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Public Digital Identity Card</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Display verified DID badge on shared digital assets.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={settings.showDigitalIdentityPublicly}
                                onChange={(e) => updateSettings({ showDigitalIdentityPublicly: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Telemetry & Activity Preferences */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Diagnostics & Activity Telemetry</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure anonymous usage statistics and audit trail logging.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Record Asset Audit History</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Log create, edit, share, and delete actions in your personal activity history.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={settings.logAuditHistory}
                                onChange={(e) => updateSettings({ logAuditHistory: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Anonymous Error Telemetry</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Submit anonymous client error reports to improve Calvion performance.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={settings.collectTelemetry}
                                onChange={(e) => updateSettings({ collectTelemetry: e.target.checked })}
                                className="peer sr-only"
                            />
                            <div className="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600 dark:bg-slate-800 dark:peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-sm dark:border-red-900/50 dark:bg-red-950/10">
                <div className="flex items-center gap-2.5 border-b border-red-200 pb-4 dark:border-red-900/50">
                    <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80">
                            Irreversible operations regarding your local cryptography keys and Calvion vault account.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-4">
                    {/* Clear encryption keys */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Purge Local Encryption Session</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Clears in-memory keys and decrypt buffers from this browser instance.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handlePurgeKeys}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <Key className="h-3.5 w-3.5" />
                            Purge Browser Keys
                        </button>
                    </div>

                    {keysPurged && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Browser encryption session cleared.
                        </p>
                    )}

                    {/* Delete account */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-red-100 pt-4 dark:border-red-900/30">
                        <div>
                            <p className="text-xs font-bold text-red-700 dark:text-red-400">Delete Vault Account</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Permanently delete your Calvion profile, digital assets, uploaded files, and all share authorizations.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setShowDeleteModal(true);
                                setDeleteConfirmation("");
                                setDeleteError(null);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-red-300 bg-white p-6 shadow-2xl dark:border-red-900 dark:bg-slate-900">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Permanently Delete Account</h3>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="mt-4 space-y-4">
                            {deleteError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                    {deleteError}
                                </div>
                            )}

                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Warning: This action is <b>permanent</b>. All your encrypted digital assets, files, and sharing authorizations will be immediately purged.
                            </p>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Type <span className="font-mono text-red-600 font-bold">DELETE</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="DELETE"
                                    className="mt-1.5 w-full rounded-xl border border-red-300 bg-red-50/20 px-3.5 py-2 text-xs text-slate-900 focus:border-red-500 focus:outline-none dark:border-red-900/50 dark:bg-red-950/20 dark:text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
                                >
                                    {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                    Confirm Account Deletion
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
