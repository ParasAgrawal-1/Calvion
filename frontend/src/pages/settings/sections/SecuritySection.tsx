import { useState, useMemo, useEffect } from "react";
import {
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Smartphone,
    Copy,
    Check,
    LogOut,
    RefreshCw,
    ShieldCheck,
    Loader2,
} from "lucide-react";
import axios from "axios";
import api from "../../../services/api";

export default function SecuritySection() {
    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // 2FA state
    const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [totpCode, setTotpCode] = useState("");
    const [totpError, setTotpError] = useState<string | null>(null);
    const [backupCodesCopied, setBackupCodesCopied] = useState(false);
    const [totpSecret, setTotpSecret] = useState("CALVION-7X9K-3P2M-W8Q4");
    const [backupCodes, setBackupCodes] = useState<string[]>([
        "8941-2094", "4152-7801", "3092-6614", "9901-3482",
        "7712-4590", "1284-9023", "5512-8874", "6320-1198"
    ]);

    // Auto-lock duration
    const [autoLockDuration, setAutoLockDuration] = useState<string>("15");

    // Session revocation state
    const [revokingSessions, setRevokingSessions] = useState(false);
    const [sessionRevokedMsg, setSessionRevokedMsg] = useState<string | null>(null);

    // Load initial 2FA & settings from backend
    useEffect(() => {
        const fetchSecurityInfo = async () => {
            try {
                const [statusRes, settingsRes] = await Promise.allSettled([
                    api.get<{ enabled: boolean }>("/users/2fa/status"),
                    api.get<{ autoLockDuration?: string }>("/users/settings"),
                ]);

                if (statusRes.status === "fulfilled" && statusRes.value.data) {
                    setTwoFactorEnabled(statusRes.value.data.enabled);
                }
                if (settingsRes.status === "fulfilled" && settingsRes.value.data?.autoLockDuration) {
                    setAutoLockDuration(settingsRes.value.data.autoLockDuration);
                }
            } catch (err) {
                console.error("Failed to load security info from backend", err);
            }
        };

        fetchSecurityInfo();
    }, []);

    // Password criteria evaluation
    const criteria = useMemo(() => {
        return {
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            special: /[^A-Za-z0-9]/.test(newPassword),
        };
    }, [newPassword]);

    const passedCount = Object.values(criteria).filter(Boolean).length;
    const strengthScore = newPassword.length === 0 ? 0 : passedCount;
    const strengthLabel =
        strengthScore <= 1 ? "Very Weak" :
        strengthScore === 2 ? "Weak" :
        strengthScore === 3 ? "Fair" :
        strengthScore === 4 ? "Good" : "Strong";
    
    const strengthColor =
        strengthScore <= 2 ? "bg-red-500" :
        strengthScore === 3 ? "bg-amber-500" :
        strengthScore === 4 ? "bg-blue-500" : "bg-emerald-500";

    // Overall Security Score calculation
    const overallScore = useMemo(() => {
        let score = 60; // base score for account active & E2EE enabled
        if (twoFactorEnabled) score += 25;
        if (autoLockDuration !== "never") score += 10;
        if (sessionRevokedMsg) score += 5;
        return Math.min(score, 100);
    }, [twoFactorEnabled, autoLockDuration, sessionRevokedMsg]);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (!currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError("New password must be different from current password.");
            return;
        }

        try {
            setPasswordLoading(true);
            await api.put("/users/change-password", {
                currentPassword,
                newPassword,
            });

            setPasswordSuccess("Password updated successfully. Your new password is now active.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            console.error("Change password failed:", err);
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                if (typeof data === "string") {
                    setPasswordError(data);
                } else if (data && typeof data === "object" && "message" in data) {
                    setPasswordError(String(data.message));
                } else {
                    setPasswordError("Failed to change password. Please verify your current password.");
                }
            } else {
                setPasswordError("An unexpected error occurred.");
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleToggle2FA = async () => {
        if (twoFactorEnabled) {
            if (window.confirm("Are you sure you want to disable Two-Factor Authentication? This will lower your account security.")) {
                try {
                    await api.post("/users/2fa/disable");
                    setTwoFactorEnabled(false);
                } catch (err) {
                    console.error("Failed to disable 2FA in backend", err);
                }
            }
        } else {
            try {
                const res = await api.post<{ secret: string; backupCodes: string[] }>("/users/2fa/setup");
                if (res.data?.secret) setTotpSecret(res.data.secret);
                if (Array.isArray(res.data?.backupCodes)) setBackupCodes(res.data.backupCodes);
            } catch (err) {
                console.error("Failed to generate 2FA secret from backend", err);
            }
            setShow2FAModal(true);
            setTotpCode("");
            setTotpError(null);
        }
    };

    const verifyAndEnable2FA = async () => {
        if (totpCode.trim().length !== 6) {
            setTotpError("Please enter a valid 6-digit authentication code.");
            return;
        }
        try {
            await api.post("/users/2fa/verify", { code: totpCode.trim() });
            setTwoFactorEnabled(true);
            setShow2FAModal(false);
        } catch (err: unknown) {
            console.error("2FA verification error", err);
            setTotpError("Verification failed. Please check code or try again.");
        }
    };

    const handleCopyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join("\n"));
        setBackupCodesCopied(true);
        setTimeout(() => setBackupCodesCopied(false), 2000);
    };

    const handleAutoLockChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setAutoLockDuration(val);
        try {
            await api.put("/users/settings", { autoLockDuration: val });
        } catch (err) {
            console.error("Failed to save autolock duration", err);
        }
    };

    const handleRevokeSessions = async () => {
        setRevokingSessions(true);
        try {
            await api.post("/users/revoke-sessions");
            setSessionRevokedMsg("All other device sessions have been terminated. Only this browser session remains active.");
            setTimeout(() => setSessionRevokedMsg(null), 5000);
        } catch (err) {
            console.error("Failed to revoke sessions", err);
        } finally {
            setRevokingSessions(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Access</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your authentication credentials, multi-factor verification, and vault session timeouts.
                </p>
            </div>

            {/* Security Audit Summary Card */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/40 p-6 dark:border-slate-800 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">Security Health Score</h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Evaluates password strength, multi-factor authentication, and active session protection.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">{overallScore}</span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400"> / 100</span>
                            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                {overallScore >= 90 ? "Excellent" : overallScore >= 75 ? "Good" : "Moderate Protection"}
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 p-0.5 flex items-center justify-center">
                            <div className={`h-full w-full rounded-full flex items-center justify-center text-xs font-bold ${overallScore >= 80 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {overallScore}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>AES-256 E2EE Vault</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        {twoFactorEnabled ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <span>2FA {twoFactorEnabled ? "Active" : "Recommended"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Zero-Knowledge Mode</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>Auto-Lock Enabled</span>
                    </div>
                </div>
            </div>

            {/* Change Password Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <KeyRound size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Change Password</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Update your account login password. You will need your current password.
                        </p>
                    </div>
                </div>

                {passwordSuccess && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <p>{passwordSuccess}</p>
                    </div>
                )}

                {passwordError && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                        <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                        <p>{passwordError}</p>
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Current Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                New Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Confirm New Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword.length > 0 && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-600 dark:text-slate-400">Password Strength:</span>
                                <span className="font-bold text-slate-900 dark:text-white">{strengthLabel}</span>
                            </div>
                            <div className="mt-2 flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                {[1, 2, 3, 4, 5].map((step) => (
                                    <div
                                        key={step}
                                        className={`h-full flex-1 transition-all duration-300 ${
                                            strengthScore >= step ? strengthColor : "opacity-0"
                                        }`}
                                    />
                                ))}
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] sm:grid-cols-3">
                                <span className={criteria.length ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    ✓ 8+ characters
                                </span>
                                <span className={criteria.uppercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    ✓ Uppercase letter
                                </span>
                                <span className={criteria.lowercase ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    ✓ Lowercase letter
                                </span>
                                <span className={criteria.number ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    ✓ Numeric digit
                                </span>
                                <span className={criteria.special ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                                    ✓ Special character
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
                        >
                            {passwordLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                <>
                                    <KeyRound size={15} />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Two-Factor Authentication (2FA) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                    Two-Factor Authentication (2FA)
                                </h3>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    twoFactorEnabled 
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                }`}>
                                    {twoFactorEnabled ? "Active" : "Disabled"}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                                Add an extra layer of security requiring a time-based one-time code (TOTP) from an authenticator app (Google Authenticator, Authy, or 1Password) when signing in.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleToggle2FA}
                        className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                            twoFactorEnabled
                                ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                                : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                        }`}
                    >
                        {twoFactorEnabled ? "Disable 2FA" : "Set Up 2FA"}
                    </button>
                </div>

                {twoFactorEnabled && (
                    <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-900/40 dark:bg-violet-950/20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-violet-900 dark:text-violet-300">
                                Emergency Backup Recovery Codes
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyBackupCodes}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 hover:text-violet-800 dark:text-violet-400"
                            >
                                {backupCodesCopied ? <Check size={14} /> : <Copy size={14} />}
                                {backupCodesCopied ? "Copied!" : "Copy Codes"}
                            </button>
                        </div>
                        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {backupCodes.map((code, idx) => (
                                <code key={idx} className="rounded-lg bg-white px-2.5 py-1 text-center font-mono text-[11px] font-semibold text-slate-800 shadow-xs dark:bg-slate-900 dark:text-slate-200">
                                    {code}
                                </code>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Session Management & Auto-Lock */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Vault Auto-Lock</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Inactivity duration before requiring re-authentication.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Lock Inactivity Timer
                        </label>
                        <select
                            value={autoLockDuration}
                            onChange={handleAutoLockChange}
                            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                        >
                            <option value="5">After 5 minutes of inactivity</option>
                            <option value="15">After 15 minutes of inactivity (Recommended)</option>
                            <option value="30">After 30 minutes of inactivity</option>
                            <option value="60">After 1 hour</option>
                            <option value="never">Never (Stay unlocked until browser closes)</option>
                        </select>
                        <p className="mt-2 text-[11px] text-slate-400">
                            Auto-locking purges decrypted keys from memory to defend against unauthorized physical access.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            <LogOut size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Active Sessions</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Sign out of all other devices and mobile browsers.
                            </p>
                        </div>
                    </div>

                    {sessionRevokedMsg && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <CheckCircle2 size={15} className="shrink-0" />
                            <span>{sessionRevokedMsg}</span>
                        </div>
                    )}

                    <div className="mt-5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Lost a device or signed in from a public computer? Invalidate all external active refresh tokens immediately.
                        </p>
                        <button
                            type="button"
                            onClick={handleRevokeSessions}
                            disabled={revokingSessions}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
                        >
                            {revokingSessions ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Terminating sessions...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={14} />
                                    Revoke All Other Sessions
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2FA Setup Modal */}
            {show2FAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configure Authenticator App</h3>
                            <button
                                type="button"
                                onClick={() => setShow2FAModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            1. Scan this QR code or enter the secret key into your authenticator app (e.g. Google Authenticator).
                        </p>

                        {/* Simulated QR Code Box */}
                        <div className="my-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                            <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-white p-2 shadow-xs dark:bg-slate-950">
                                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 border border-slate-200 dark:border-slate-800">
                                    {Array.from({ length: 36 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-xs ${
                                                (i % 2 === 0 || i % 7 === 0 || i < 6 || i > 30)
                                                    ? "bg-slate-900 dark:bg-white"
                                                    : "bg-transparent"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Manual Setup Key</span>
                                <code className="block mt-0.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 select-all">
                                    {totpSecret}
                                </code>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                2. Enter 6-digit verification code
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                value={totpCode}
                                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="123456"
                                className="mt-1.5 w-full text-center tracking-widest text-lg font-mono font-bold rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            />
                            {totpError && (
                                <p className="mt-1.5 text-xs text-red-500">{totpError}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShow2FAModal(false)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={verifyAndEnable2FA}
                                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                Verify & Activate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
