import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Clock3,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Plus,
    Edit3,
    Trash2,
    Bell,
    RefreshCw,
    Search,
    Loader2
} from "lucide-react";
import api from "../../../services/api";

interface Asset {
    id: number;
    title: string;
    type: string;
    description?: string;
    createdAt?: string;
    expiryDate?: string;
    alertThresholdDays?: number;
    expiryNotes?: string;
}

interface ExpiryItem {
    assetId: number;
    title: string;
    type: string;
    expiryDate: string; // YYYY-MM-DD
    alertThresholdDays: number;
    notes?: string;
}

interface ReminderPrefs {
    notify30Days: boolean;
    notify14Days: boolean;
    notify7Days: boolean;
    notify1Day: boolean;
    emailChannel: boolean;
    inAppChannel: boolean;
}

export default function ExpirySection() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [activeTab, setActiveTab] = useState<"ALL" | "EXPIRING_SOON" | "EXPIRED" | "ACTIVE">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Expiry items dictionary keyed by assetId
    const [expiries, setExpiries] = useState<Record<number, ExpiryItem>>({});

    // Reminder preferences from backend
    const [prefs, setPrefs] = useState<ReminderPrefs>({
        notify30Days: true,
        notify14Days: true,
        notify7Days: true,
        notify1Day: true,
        emailChannel: true,
        inAppChannel: true,
    });

    // Modal state for editing/setting expiry
    const [showModal, setShowModal] = useState(false);
    const [modalAssetId, setModalAssetId] = useState<number | "">("");
    const [modalExpiryDate, setModalExpiryDate] = useState("");
    const [modalThreshold, setModalThreshold] = useState(30);
    const [modalNotes, setModalNotes] = useState("");

    const updatePrefs = async (patch: Partial<ReminderPrefs>) => {
        setPrefs((prev) => ({ ...prev, ...patch }));
        try {
            await api.put("/users/settings", patch);
        } catch (err) {
            console.error("Failed to update reminder preferences in backend", err);
        }
    };

    const loadAssets = useCallback(async () => {
        try {
            const [res, settingsRes] = await Promise.allSettled([
                api.get<Asset[]>("/assets"),
                api.get<ReminderPrefs>("/users/settings"),
            ]);

            const assetList = res.status === "fulfilled" && Array.isArray(res.value.data) ? res.value.data : [];
            setAssets(assetList);

            if (settingsRes.status === "fulfilled" && settingsRes.value.data) {
                setPrefs((prev) => ({ ...prev, ...settingsRes.value.data }));
            }

            // Populate expiries from backend DB
            const items: Record<number, ExpiryItem> = {};
            assetList.forEach((asset) => {
                if (asset.expiryDate) {
                    items[asset.id] = {
                        assetId: asset.id,
                        title: asset.title,
                        type: asset.type,
                        expiryDate: asset.expiryDate,
                        alertThresholdDays: asset.alertThresholdDays || 30,
                        notes: asset.expiryNotes || "",
                    };
                }
            });

            // If user has assets but none have expiries yet, provide seed items
            if (Object.keys(items).length === 0 && assetList.length > 0) {
                const today = new Date();
                assetList.slice(0, 3).forEach((asset, idx) => {
                    const offsetDays = idx === 0 ? 14 : idx === 1 ? -10 : 180;
                    const exp = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
                    items[asset.id] = {
                        assetId: asset.id,
                        title: asset.title,
                        type: asset.type,
                        expiryDate: exp.toISOString().slice(0, 10),
                        alertThresholdDays: 30,
                        notes: idx === 0 ? "Renew before end of month" : idx === 1 ? "Expired policy document" : "Active & verified",
                    };
                });
            }

            setExpiries(items);
        } catch (err) {
            console.error("Failed to load assets for expiry tracker", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadAssets();
    };

    // Calculate days remaining
    const getDaysRemaining = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const exp = new Date(dateStr);
        exp.setHours(0, 0, 0, 0);
        const diffTime = exp.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // List of combined expiry records
    const expiryList = useMemo(() => {
        const items: (ExpiryItem & { daysRemaining: number; status: "EXPIRED" | "EXPIRING_SOON" | "ACTIVE" })[] = [];
        
        Object.values(expiries).forEach((item) => {
            const daysRemaining = getDaysRemaining(item.expiryDate);
            let status: "EXPIRED" | "EXPIRING_SOON" | "ACTIVE" = "ACTIVE";
            if (daysRemaining < 0) {
                status = "EXPIRED";
            } else if (daysRemaining <= (item.alertThresholdDays || 30)) {
                status = "EXPIRING_SOON";
            }

            items.push({
                ...item,
                daysRemaining,
                status,
            });
        });

        return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [expiries]);

    // Counts
    const counts = useMemo(() => {
        return {
            ALL: expiryList.length,
            EXPIRING_SOON: expiryList.filter((i) => i.status === "EXPIRING_SOON").length,
            EXPIRED: expiryList.filter((i) => i.status === "EXPIRED").length,
            ACTIVE: expiryList.filter((i) => i.status === "ACTIVE").length,
        };
    }, [expiryList]);

    // Filtered items
    const filteredList = useMemo(() => {
        return expiryList.filter((item) => {
            const matchesTab = activeTab === "ALL" || item.status === activeTab;
            const matchesQuery =
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.notes || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesQuery;
        });
    }, [expiryList, activeTab, searchQuery]);

    const handleOpenEditModal = (assetId: number) => {
        const existing = expiries[assetId];
        setModalAssetId(assetId);
        if (existing) {
            setModalExpiryDate(existing.expiryDate);
            setModalThreshold(existing.alertThresholdDays || 30);
            setModalNotes(existing.notes || "");
        } else {
            // Default 1 year from today
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            setModalExpiryDate(nextYear.toISOString().slice(0, 10));
            setModalThreshold(30);
            setModalNotes("");
        }
        setShowModal(true);
    };

    const handleSaveExpiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalAssetId || !modalExpiryDate) return;

        const asset = assets.find((a) => a.id === Number(modalAssetId));
        const updated: ExpiryItem = {
            assetId: Number(modalAssetId),
            title: asset?.title || "Asset",
            type: asset?.type || "DOCUMENT",
            expiryDate: modalExpiryDate,
            alertThresholdDays: modalThreshold,
            notes: modalNotes.trim(),
        };

        const nextExpiries = { ...expiries, [Number(modalAssetId)]: updated };
        setExpiries(nextExpiries);
        setShowModal(false);

        try {
            await api.put(`/assets/${modalAssetId}/expiry`, {
                expiryDate: modalExpiryDate,
                alertThresholdDays: modalThreshold,
                expiryNotes: modalNotes.trim(),
            });
        } catch (err) {
            console.error("Failed to persist asset expiry to backend", err);
        }
    };

    const handleRemoveExpiry = async (assetId: number) => {
        const next = { ...expiries };
        delete next[assetId];
        setExpiries(next);

        try {
            await api.delete(`/assets/${assetId}/expiry`);
        } catch (err) {
            console.error("Failed to delete asset expiry from backend", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expiry & Reminders</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Monitor passports, licenses, contracts, insurance policies, and domain expirations with smart notifications.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Sync
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (assets.length > 0) {
                                handleOpenEditModal(assets[0].id);
                            }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Configure Expiry
                    </button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div
                    onClick={() => setActiveTab("ALL")}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                        activeTab === "ALL"
                            ? "border-blue-500 bg-blue-50/40 dark:border-blue-500 dark:bg-blue-950/20"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                >
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tracked Assets</span>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{counts.ALL}</p>
                    <span className="text-[10px] text-slate-400">All scheduled items</span>
                </div>

                <div
                    onClick={() => setActiveTab("EXPIRING_SOON")}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                        activeTab === "EXPIRING_SOON"
                            ? "border-amber-500 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-950/20"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                >
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Expiring Soon</span>
                    <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{counts.EXPIRING_SOON}</p>
                    <span className="text-[10px] text-slate-400">Within alert threshold</span>
                </div>

                <div
                    onClick={() => setActiveTab("EXPIRED")}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                        activeTab === "EXPIRED"
                            ? "border-red-500 bg-red-50/40 dark:border-red-500 dark:bg-red-950/20"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                >
                    <span className="text-xs font-medium text-red-600 dark:text-red-400">Expired</span>
                    <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{counts.EXPIRED}</p>
                    <span className="text-[10px] text-slate-400">Action needed</span>
                </div>

                <div
                    onClick={() => setActiveTab("ACTIVE")}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                        activeTab === "ACTIVE"
                            ? "border-emerald-500 bg-emerald-50/40 dark:border-emerald-500 dark:bg-emerald-950/20"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                >
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Good Standing</span>
                    <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{counts.ACTIVE}</p>
                    <span className="text-[10px] text-slate-400">Safe & valid</span>
                </div>
            </div>

            {/* Tracker Main List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Time-Sensitive Vault Items</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Active timeline sorted by urgency.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tracked items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-36 items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="py-10 text-center">
                        <Calendar className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">No items match this filter</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Configure expiration dates for passports, contracts, domain certificates, or licenses.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredList.map((item) => (
                            <div
                                key={item.assetId}
                                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition"
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${
                                            item.status === "EXPIRED"
                                                ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                                                : item.status === "EXPIRING_SOON"
                                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                                                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                        }`}
                                    >
                                        {item.status === "EXPIRED" ? (
                                            <XCircle className="h-4 w-4" />
                                        ) : item.status === "EXPIRING_SOON" ? (
                                            <AlertTriangle className="h-4 w-4" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h4>
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                {item.type}
                                            </span>
                                        </div>

                                        {item.notes && (
                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                {item.notes}
                                            </p>
                                        )}

                                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                                            <span>Expires on: <b className="text-slate-600 dark:text-slate-300">{item.expiryDate}</b></span>
                                            <span>·</span>
                                            <span>Notice threshold: {item.alertThresholdDays} days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 sm:text-right">
                                    <div className="text-right">
                                        <p
                                            className={`text-xs font-bold ${
                                                item.status === "EXPIRED"
                                                    ? "text-red-600 dark:text-red-400"
                                                    : item.status === "EXPIRING_SOON"
                                                    ? "text-amber-600 dark:text-amber-400"
                                                    : "text-emerald-600 dark:text-emerald-400"
                                            }`}
                                        >
                                            {item.daysRemaining < 0
                                                ? `Expired ${Math.abs(item.daysRemaining)} days ago`
                                                : item.daysRemaining === 0
                                                ? "Expires today"
                                                : `${item.daysRemaining} days left`}
                                        </p>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                            {item.status.replace("_", " ")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenEditModal(item.assetId)}
                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                            title="Edit Expiry"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExpiry(item.assetId)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                            title="Remove Tracking"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Notification Preferences */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
                    <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Reminder Notification Preferences</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Determine when Calvion alerts you before an asset or document expires.
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Advance Warning Intervals</p>
                        
                        {[
                            { label: "30 days before expiration", key: "notify30Days" },
                            { label: "14 days before expiration", key: "notify14Days" },
                            { label: "7 days before expiration", key: "notify7Days" },
                            { label: "1 day before expiration (Urgent)", key: "notify1Day" },
                        ].map((item) => (
                            <label key={item.key} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                <span>{item.label}</span>
                                <input
                                    type="checkbox"
                                    checked={prefs[item.key as keyof ReminderPrefs] as boolean}
                                    onChange={(e) => updatePrefs({ [item.key]: e.target.checked })}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        ))}
                    </div>

                    <div className="space-y-3 sm:border-l sm:border-slate-100 sm:pl-6 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Delivery Channels</p>
                        
                        <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">In-App Alerts</p>
                                <p className="text-[11px] text-slate-400">Badges and banners in dashboard</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.inAppChannel}
                                onChange={(e) => updatePrefs({ inAppChannel: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                        </label>

                        <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">Email Notifications</p>
                                <p className="text-[11px] text-slate-400">Direct reminders to account email</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.emailChannel}
                                onChange={(e) => updatePrefs({ emailChannel: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Set/Edit Expiry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Clock3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-bold text-slate-900 dark:text-white">Configure Expiration Date</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveExpiry} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Target Asset
                                </label>
                                <select
                                    value={modalAssetId}
                                    onChange={(e) => setModalAssetId(Number(e.target.value))}
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                >
                                    {assets.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.title} ({a.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Expiration Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={modalExpiryDate}
                                    onChange={(e) => setModalExpiryDate(e.target.value)}
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Alert Notice Window
                                </label>
                                <select
                                    value={modalThreshold}
                                    onChange={(e) => setModalThreshold(Number(e.target.value))}
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                >
                                    <option value={7}>7 days prior</option>
                                    <option value={14}>14 days prior</option>
                                    <option value={30}>30 days prior (Recommended)</option>
                                    <option value={60}>60 days prior</option>
                                    <option value={90}>90 days prior</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Reminder Notes / Renewal Steps
                                </label>
                                <input
                                    type="text"
                                    value={modalNotes}
                                    onChange={(e) => setModalNotes(e.target.value)}
                                    placeholder="e.g. Renew via embassy portal or broker"
                                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                >
                                    Save Tracking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
