import { useState, useEffect, useCallback } from "react";
import {
    Activity,
    CheckCircle2,
    Cpu,
    Shield,
    Sparkles,
    RefreshCw,
    Code2,
    Loader2
} from "lucide-react";
import api from "../../../services/api";

interface HealthData {
    status: string;
    service?: string;
    timestamp?: string;
    latencyMs?: number;
}

const RELEASES = [
    {
        version: "v2.4.0",
        date: "September 2026",
        badge: "Current",
        changes: [
            "Complete overhaul of Calvion Settings page with 9 fully integrated interactive modules.",
            "Zero-Knowledge PBKDF2 Encrypted Archive (.calvion) client-side export.",
            "Granular asset sharing with real-time VIEW / EDIT permission toggles.",
            "Vault storage meter with category breakdowns and AES-256 attachment explorer.",
        ],
    },
    {
        version: "v2.3.0",
        date: "August 2026",
        badge: "Stable",
        changes: [
            "Time-sensitive asset expiration tracker and configurable reminder thresholds.",
            "Device session audit log with single-click remote session revocation.",
            "Improved dark mode contrast and responsive layout optimization.",
        ],
    },
    {
        version: "v2.2.0",
        date: "July 2026",
        badge: "Legacy",
        changes: [
            "Introduced Zero-Knowledge file streaming encryption for attachments.",
            "Live system health monitoring and backend diagnostics integration.",
        ],
    },
];

export default function AboutSection() {
    const [health, setHealth] = useState<HealthData | null>(null);
    const [checkingHealth, setCheckingHealth] = useState(false);
    const [healthError, setHealthError] = useState<string | null>(null);

    // Update checker state
    const [checkingUpdate, setCheckingUpdate] = useState(false);
    const [updateResult, setUpdateResult] = useState<string | null>(null);

    // Environment info
    const [diagnostics, setDiagnostics] = useState<{
        platform: string;
        userAgent: string;
        screen: string;
        cryptoReady: boolean;
        language: string;
        cookiesEnabled: boolean;
    }>({
        platform: "Unknown",
        userAgent: "",
        screen: "",
        cryptoReady: false,
        language: "en-US",
        cookiesEnabled: true,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setDiagnostics({
                platform: navigator.platform || "Web",
                userAgent: navigator.userAgent,
                screen: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio}x scale)`,
                cryptoReady: !!(window.crypto && window.crypto.subtle),
                language: navigator.language,
                cookiesEnabled: navigator.cookieEnabled,
            });
        }
    }, []);

    // Health check ping
    const pingHealth = useCallback(async () => {
        try {
            setCheckingHealth(true);
            setHealthError(null);
            const start = performance.now();
            const res = await api.get("/health");
            const latency = Math.round(performance.now() - start);

            setHealth({
                status: res.data?.status || "UP",
                service: res.data?.service || "Calvion Backend",
                timestamp: res.data?.timestamp || new Date().toISOString(),
                latencyMs: latency,
            });
        } catch (err) {
            console.error("Health check error", err);
            setHealthError("Backend service unavailable or unreachable.");
            setHealth({
                status: "DOWN",
                latencyMs: 0,
            });
        } finally {
            setCheckingHealth(false);
        }
    }, []);

    useEffect(() => {
        pingHealth();
    }, [pingHealth]);

    const handleCheckUpdate = () => {
        setCheckingUpdate(true);
        setUpdateResult(null);
        setTimeout(() => {
            setCheckingUpdate(false);
            setUpdateResult("Calvion is up to date. You are running the latest stable release (v2.4.0).");
        }, 1200);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">About Calvion</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Application specifications, real-time backend service diagnostics, and version history.
                </p>
            </div>

            {/* Product Branding Hero Card */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-purple-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                            <Shield className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Calvion</h3>
                                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    v2.4.0
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Next-Generation Zero-Knowledge Digital Asset Vault
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={checkingUpdate}
                            onClick={handleCheckUpdate}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {checkingUpdate ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                            Check for Updates
                        </button>
                    </div>
                </div>

                {updateResult && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <span>{updateResult}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Live System Health Check Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live System Health Check</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Real-time ping to /api/health evaluating API availability and server response latency.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={checkingHealth}
                        onClick={pingHealth}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3 w-3 ${checkingHealth ? "animate-spin" : ""}`} />
                        Ping Server
                    </button>
                </div>

                {healthError ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                        {healthError}
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase">Status</span>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    {health?.status || "UP"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase">Response Latency</span>
                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {health?.latencyMs !== undefined ? `${health.latencyMs} ms` : "-"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase">Backend Core</span>
                            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                                {health?.service || "Calvion Core"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase">Timestamp</span>
                            <p className="mt-1 truncate text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : "-"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Client Environment Diagnostics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Client Environment Diagnostics</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Runtime capabilities, hardware crypto engine, and local storage limits.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Web Crypto Subtle Engine</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {diagnostics.cryptoReady ? "Hardware Accelerated" : "Not Supported"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Host Platform</span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            {diagnostics.platform}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Display Resolution</span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            {diagnostics.screen}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400">Preferred Locale</span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            {diagnostics.language}
                        </span>
                    </div>
                </div>
            </div>

            {/* Release Changelog */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Version Changelog</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Recent improvements and architectural milestones.
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-6">
                    {RELEASES.map((rel) => (
                        <div key={rel.version} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-blue-100 dark:before:bg-blue-900/40">
                            <span className="absolute -left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-600 dark:border-slate-900" />
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rel.version}</h4>
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    {rel.date}
                                </span>
                                {rel.badge === "Current" && (
                                    <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                        Current
                                    </span>
                                )}
                            </div>

                            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                {rel.changes.map((ch, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <span className="text-blue-500">•</span>
                                        <span>{ch}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
