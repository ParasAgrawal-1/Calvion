import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Plus,
    FileText,
    Award,
    Link as LinkIcon,
    StickyNote,
    ArrowRight,
    Users,
    Files,
    RefreshCw,
    Search,
    AlertCircle,
    KeyRound,
    Globe,
    ArrowUpRight,
    X,
    LayoutGrid,
    List,
    Paperclip,
    Copy,
    Check,
    ExternalLink,
    Palette,
    ChevronDown,
    FolderOpen,
} from "lucide-react";

import api from "../services/api";
import AppNavbar from "../components/AppNavbar";
import { useTheme } from "../context/ThemeContext";

type AssetType =
    | "DOCUMENT"
    | "CERTIFICATE"
    | "NOTE"
    | "LINK"
    | "CREDENTIAL"
    | "SOCIAL_PROFILE"
    | "OTHER";

type ColorThemeId = "cobalt" | "emerald" | "graphite" | "indigo" | "bronze";

interface AssetFile {
    id: number;
    originalFileName?: string;
    fileType?: string;
    fileSize?: number;
}

interface Asset {
    id: number;
    title: string;
    description?: string;
    type: AssetType;
    content?: string;
    createdAt?: string;
    updatedAt?: string;
    files?: AssetFile[];
}

interface AssetsResponse {
    content?: Asset[];
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
}

interface ColorThemeOption {
    id: ColorThemeId;
    name: string;
    swatch: string;
    varsLight: Record<string, string>;
    varsDark: Record<string, string>;
}

const COLOR_THEMES: ColorThemeOption[] = [
    {
        id: "cobalt",
        name: "Cobalt Blue (Default)",
        swatch: "#2563EB",
        varsLight: {
            "--accent": "#2563EB",
            "--accent-hover": "#1D4ED8",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "#EFF6FF",
            "--accent-soft-text": "#1D4ED8",
            "--accent-border": "#BFDBFE",
        },
        varsDark: {
            "--accent": "#3B82F6",
            "--accent-hover": "#60A5FA",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "rgba(59, 130, 246, 0.14)",
            "--accent-soft-text": "#93C5FD",
            "--accent-border": "rgba(59, 130, 246, 0.32)",
        },
    },
    {
        id: "emerald",
        name: "Forest Emerald",
        swatch: "#059669",
        varsLight: {
            "--accent": "#059669",
            "--accent-hover": "#047857",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "#ECFDF5",
            "--accent-soft-text": "#047857",
            "--accent-border": "#A7F3D0",
        },
        varsDark: {
            "--accent": "#10B981",
            "--accent-hover": "#34D399",
            "--accent-fg": "#052E16",
            "--accent-soft": "rgba(16, 185, 129, 0.14)",
            "--accent-soft-text": "#6EE7B7",
            "--accent-border": "rgba(16, 185, 129, 0.32)",
        },
    },
    {
        id: "graphite",
        name: "Minimal Graphite",
        swatch: "#18181B",
        varsLight: {
            "--accent": "#18181B",
            "--accent-hover": "#27272A",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "#F4F4F5",
            "--accent-soft-text": "#18181B",
            "--accent-border": "#D4D4D8",
        },
        varsDark: {
            "--accent": "#F4F4F5",
            "--accent-hover": "#E4E4E7",
            "--accent-fg": "#09090B",
            "--accent-soft": "rgba(244, 244, 245, 0.10)",
            "--accent-soft-text": "#F4F4F5",
            "--accent-border": "rgba(244, 244, 245, 0.24)",
        },
    },
    {
        id: "indigo",
        name: "Royal Indigo",
        swatch: "#4F46E5",
        varsLight: {
            "--accent": "#4F46E5",
            "--accent-hover": "#4338CA",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "#EEF2FF",
            "--accent-soft-text": "#4338CA",
            "--accent-border": "#C7D2FE",
        },
        varsDark: {
            "--accent": "#6366F1",
            "--accent-hover": "#818CF8",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "rgba(99, 102, 241, 0.15)",
            "--accent-soft-text": "#A5B4FC",
            "--accent-border": "rgba(99, 102, 241, 0.32)",
        },
    },
    {
        id: "bronze",
        name: "Warm Bronze",
        swatch: "#B45309",
        varsLight: {
            "--accent": "#B45309",
            "--accent-hover": "#92400E",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "#FFFBEB",
            "--accent-soft-text": "#92400E",
            "--accent-border": "#FDE68A",
        },
        varsDark: {
            "--accent": "#D97706",
            "--accent-hover": "#F59E0B",
            "--accent-fg": "#FFFFFF",
            "--accent-soft": "rgba(217, 119, 6, 0.15)",
            "--accent-soft-text": "#FCD34D",
            "--accent-border": "rgba(217, 119, 6, 0.32)",
        },
    },
];

const STORAGE_COLOR_KEY = "calvion_ui_color_theme";

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#090B0E]";

const ASSET_META: Record<
    AssetType,
    {
        label: string;
        plural: string;
        icon: typeof FileText;
        badgeClass: string;
        iconClass: string;
    }
> = {
    DOCUMENT: {
        label: "Document",
        plural: "Documents",
        icon: FileText,
        badgeClass:
            "text-slate-700 bg-slate-100 border-slate-200/80 dark:text-slate-300 dark:bg-white/[0.06] dark:border-white/10",
        iconClass:
            "bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-slate-200",
    },
    CERTIFICATE: {
        label: "Certificate",
        plural: "Certificates",
        icon: Award,
        badgeClass:
            "text-amber-800 bg-amber-50 border-amber-200/80 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20",
        iconClass:
            "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    },
    CREDENTIAL: {
        label: "Credential",
        plural: "Credentials",
        icon: KeyRound,
        badgeClass:
            "text-emerald-800 bg-emerald-50 border-emerald-200/80 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20",
        iconClass:
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    },
    NOTE: {
        label: "Note",
        plural: "Notes",
        icon: StickyNote,
        badgeClass:
            "text-zinc-700 bg-zinc-100 border-zinc-200/80 dark:text-zinc-300 dark:bg-white/[0.06] dark:border-white/10",
        iconClass:
            "bg-zinc-100 text-zinc-700 dark:bg-white/[0.08] dark:text-zinc-200",
    },
    LINK: {
        label: "Link",
        plural: "Links",
        icon: LinkIcon,
        badgeClass:
            "text-sky-800 bg-sky-50 border-sky-200/80 dark:text-sky-300 dark:bg-sky-500/10 dark:border-sky-500/20",
        iconClass:
            "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    },
    SOCIAL_PROFILE: {
        label: "Social Profile",
        plural: "Social Profiles",
        icon: Globe,
        badgeClass:
            "text-teal-800 bg-teal-50 border-teal-200/80 dark:text-teal-300 dark:bg-teal-500/10 dark:border-teal-500/20",
        iconClass:
            "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    },
    OTHER: {
        label: "Other",
        plural: "Other",
        icon: Files,
        badgeClass:
            "text-slate-700 bg-slate-100 border-slate-200/80 dark:text-slate-300 dark:bg-white/[0.06] dark:border-white/10",
        iconClass:
            "bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300",
    },
};

function formatDate(date?: string): string {
    if (!date) return "Recently";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Recently";

    const diffMs = Date.now() - parsed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function extractUrlInfo(raw?: string): { href: string; host: string } | null {
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    try {
        const normalized = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`;
        const url = new URL(normalized);
        if (!url.hostname.includes(".")) return null;
        return {
            href: url.toString(),
            host: url.hostname.replace(/^www\./, ""),
        };
    } catch {
        return null;
    }
}

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (typeof data === "string" && data.trim()) return data;
        if (
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message === "string"
        ) {
            return data.message;
        }
        if (status === 401) return "Your session has expired. Please sign in again.";
        if (status === 403) return "You do not have access to view these records.";
        if (status === 404) return "Vault service could not be reached.";
        if (status && status >= 500)
            return "Temporary server issue while loading your vault. Please try again.";
    }
    return error instanceof Error ? error.message : "Unable to load your dashboard.";
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const paletteMenuRef = useRef<HTMLDivElement | null>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState<AssetType | "ALL">("ALL");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [copiedId, setCopiedId] = useState<number | null>(null);

    const [colorThemeId, setColorThemeId] = useState<ColorThemeId>(() => {
        const saved = localStorage.getItem(STORAGE_COLOR_KEY) as ColorThemeId | null;
        return COLOR_THEMES.some((t) => t.id === saved) ? saved! : "cobalt";
    });
    const [paletteOpen, setPaletteOpen] = useState(false);

    const activeColorTheme = useMemo(
        () =>
            COLOR_THEMES.find((t) => t.id === colorThemeId) ?? COLOR_THEMES[0],
        [colorThemeId]
    );

    const handleSelectColorTheme = (id: ColorThemeId) => {
        setColorThemeId(id);
        localStorage.setItem(STORAGE_COLOR_KEY, id);
        setPaletteOpen(false);
    };

    const userName = useMemo(() => {
        const raw =
            localStorage.getItem("name")?.trim() ||
            localStorage.getItem("email")?.split("@")[0]?.trim() ||
            "there";
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }, []);

    const fetchAssets = useCallback(
        async (isRefresh = false, signal?: AbortSignal) => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                setError("");
                if (isRefresh) setRefreshing(true);
                else setLoading(true);

                const response = await api.get<Asset[] | AssetsResponse>("/assets", {
                    signal,
                    params: {
                        page: 0,
                        size: 50,
                        sortBy: "updatedAt",
                        direction: "desc",
                    },
                });

                if (Array.isArray(response.data)) {
                    setAssets(response.data);
                    setTotalCount(response.data.length);
                } else if (response.data && Array.isArray(response.data.content)) {
                    setAssets(response.data.content);
                    setTotalCount(
                        response.data.totalElements ?? response.data.content.length
                    );
                } else {
                    setAssets([]);
                    setTotalCount(0);
                }
            } catch (err: unknown) {
                if (axios.isCancel(err)) return;

                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                    localStorage.removeItem("name");
                    navigate("/login", { replace: true });
                    return;
                }

                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate]
    );

    useEffect(() => {
        const controller = new AbortController();
        void fetchAssets(false, controller.signal);
        return () => controller.abort();
    }, [fetchAssets]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
                const target = e.target as HTMLElement | null;
                if (
                    target?.tagName !== "INPUT" &&
                    target?.tagName !== "TEXTAREA" &&
                    !target?.isContentEditable
                ) {
                    e.preventDefault();
                    searchInputRef.current?.focus();
                }
            } else if (e.key === "Escape") {
                setPaletteOpen(false);
            }
        };
        const handleClickOutside = (e: MouseEvent) => {
            if (
                paletteMenuRef.current &&
                !paletteMenuRef.current.contains(e.target as Node)
            ) {
                setPaletteOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCopySecret = async (
        e: React.MouseEvent,
        assetId: number,
        secret?: string
    ) => {
        e.stopPropagation();
        if (!secret) return;
        try {
            await navigator.clipboard.writeText(secret);
            setCopiedId(assetId);
            window.setTimeout(() => {
                setCopiedId((prev) => (prev === assetId ? null : prev));
            }, 1800);
        } catch {
            navigate(`/assets/${assetId}`);
        }
    };

    const { counts, totalFiles } = useMemo(() => {
        const map: Record<AssetType, number> = {
            DOCUMENT: 0,
            CERTIFICATE: 0,
            CREDENTIAL: 0,
            NOTE: 0,
            LINK: 0,
            SOCIAL_PROFILE: 0,
            OTHER: 0,
        };
        let files = 0;
        for (const asset of assets) {
            map[asset.type] = (map[asset.type] ?? 0) + 1;
            files += asset.files?.length ?? 0;
        }
        return { counts: map, totalFiles: files };
    }, [assets]);

    const filteredAssets = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        return assets.filter((asset) => {
            if (activeType !== "ALL" && asset.type !== activeType) return false;
            if (!keyword) return true;
            return [asset.title, asset.description, asset.type].some((val) =>
                val?.toLowerCase().includes(keyword)
            );
        });
    }, [assets, search, activeType]);

    const visibleAssets = useMemo(
        () => filteredAssets.slice(0, 12),
        [filteredAssets]
    );

    const displayTotal = totalCount ?? assets.length;

    const overviewCards: Array<{
        key: AssetType | "ALL";
        label: string;
        value: number;
        subtitle: string;
        icon: typeof Files;
    }> = [
        {
            key: "ALL",
            label: "Total Records",
            value: displayTotal,
            subtitle: `${totalFiles} attached ${totalFiles === 1 ? "file" : "files"}`,
            icon: FolderOpen,
        },
        {
            key: "DOCUMENT",
            label: "Documents & Certs",
            value: counts.DOCUMENT + counts.CERTIFICATE,
            subtitle: `${counts.DOCUMENT} docs · ${counts.CERTIFICATE} certs`,
            icon: FileText,
        },
        {
            key: "CREDENTIAL",
            label: "Credentials",
            value: counts.CREDENTIAL,
            subtitle: "Passwords & API keys",
            icon: KeyRound,
        },
        {
            key: "LINK",
            label: "Links & Notes",
            value: counts.LINK + counts.NOTE + counts.SOCIAL_PROFILE,
            subtitle: `${counts.LINK + counts.SOCIAL_PROFILE} links · ${counts.NOTE} notes`,
            icon: LinkIcon,
        },
    ];

    const filterTabs: Array<{
        key: AssetType | "ALL";
        label: string;
        count: number;
    }> = [
        { key: "ALL", label: "All", count: displayTotal },
        { key: "DOCUMENT", label: "Documents", count: counts.DOCUMENT },
        { key: "CERTIFICATE", label: "Certificates", count: counts.CERTIFICATE },
        { key: "CREDENTIAL", label: "Credentials", count: counts.CREDENTIAL },
        { key: "NOTE", label: "Notes", count: counts.NOTE },
        { key: "LINK", label: "Links", count: counts.LINK },
    ];

    const themeVars = (
        theme === "dark" ? activeColorTheme.varsDark : activeColorTheme.varsLight
    ) as React.CSSProperties;

    return (
        <div
            style={themeVars}
            className={`min-h-dvh overflow-x-clip bg-[#F8FAFC] text-slate-900 antialiased dark:bg-[#090B0E] dark:text-slate-100 ${
                theme === "dark" ? "dark" : ""
            }`}
        >
            <AppNavbar activePage="dashboard" />

            <main className="mx-auto w-full max-w-[1400px] px-3.5 pb-24 pt-5 sm:px-6 sm:pt-8 md:pb-16 lg:px-8">
                {/* HEADER BAR */}
                <header className="mb-6 flex flex-col gap-4 border-b border-slate-200/90 pb-5 dark:border-white/[0.08] sm:mb-7 sm:pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <div className="min-w-0 flex-1">
                        <h1 className="break-words text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl lg:text-[26px] lg:leading-tight">
                            {getGreeting()}, {userName}
                        </h1>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                            Manage your documents, credentials, links, and private notes in one place.
                        </p>
                    </div>

                    {/* TOOLBAR: 2-ROW ON MOBILE, SINGLE HORIZONTAL ROW ON SM/MD/LG/XL */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-nowrap sm:items-center lg:w-auto lg:shrink-0">
                        {/* Search Input */}
                        <div className="relative w-full sm:min-w-[180px] sm:flex-1 lg:w-56 lg:flex-initial xl:w-64">
                            <Search
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search vault..."
                                aria-label="Search vault"
                                className={`h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] dark:border-white/10 dark:bg-[#111318] dark:text-slate-100 dark:placeholder:text-slate-500 sm:h-9 sm:text-xs ${FOCUS_RING}`}
                            />
                            {search ? (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 touch-manipulation p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                >
                                    <X size={14} />
                                </button>
                            ) : (
                                <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500 xl:inline-block">
                                    /
                                </kbd>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex w-full shrink-0 items-center gap-1.5 sm:w-auto sm:gap-2">
                            {/* ON-HAND COLOR THEME SELECTOR */}
                            <div ref={paletteMenuRef} className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setPaletteOpen((prev) => !prev)}
                                    aria-expanded={paletteOpen}
                                    aria-haspopup="listbox"
                                    aria-label="Change interface color theme"
                                    title="Change color theme"
                                    className={`inline-flex h-10 touch-manipulation items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#111318] dark:text-slate-200 dark:hover:bg-white/[0.04] sm:h-9 sm:gap-2 sm:px-3 ${FOCUS_RING}`}
                                >
                                    <span
                                        className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                                        style={{
                                            backgroundColor: activeColorTheme.swatch,
                                        }}
                                    />
                                    <Palette
                                        size={14}
                                        className="hidden text-slate-400 sm:inline"
                                    />
                                    <span className="hidden md:inline">Theme</span>
                                    <ChevronDown
                                        size={13}
                                        className={`text-slate-400 transition-transform ${
                                            paletteOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {paletteOpen && (
                                    <div
                                        role="listbox"
                                        aria-label="Select accent color"
                                        className="absolute left-0 z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10 dark:border-white/12 dark:bg-[#151821] dark:shadow-black/50 sm:left-auto sm:right-0"
                                    >
                                        <div className="px-2.5 py-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                            Interface Color
                                        </div>
                                        {COLOR_THEMES.map((option) => {
                                            const isSelected =
                                                option.id === colorThemeId;
                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() =>
                                                        handleSelectColorTheme(
                                                            option.id
                                                        )
                                                    }
                                                    className={`flex w-full touch-manipulation items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                                        isSelected
                                                            ? "bg-slate-100 font-semibold text-slate-950 dark:bg-white/[0.08] dark:text-white"
                                                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <span
                                                            className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                                                            style={{
                                                                backgroundColor:
                                                                    option.swatch,
                                                            }}
                                                        />
                                                        <span>{option.name}</span>
                                                    </span>
                                                    {isSelected && (
                                                        <Check
                                                            size={14}
                                                            className="text-slate-900 dark:text-white"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => void fetchAssets(true)}
                                disabled={loading || refreshing}
                                aria-label="Refresh records"
                                title="Refresh"
                                className={`flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 dark:border-white/10 dark:bg-[#111318] dark:text-slate-300 dark:hover:bg-white/[0.04] sm:h-9 sm:w-9 ${FOCUS_RING}`}
                            >
                                <RefreshCw
                                    size={14}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/shared-assets")}
                                className={`inline-flex h-10 shrink-0 touch-manipulation items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-[#111318] dark:text-slate-200 dark:hover:bg-white/[0.04] sm:h-9 sm:px-3 ${FOCUS_RING}`}
                            >
                                <Users size={14} className="text-slate-400" />
                                <span>Shared</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/add-asset")}
                                className={`inline-flex h-10 flex-1 shrink-0 touch-manipulation items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent-fg)] shadow-2xs transition hover:bg-[var(--accent-hover)] sm:h-9 sm:flex-initial sm:px-3.5 ${FOCUS_RING}`}
                            >
                                <Plus size={15} />
                                <span>Add Asset</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* OVERVIEW SUMMARY CARDS */}
                <section
                    aria-label="Vault summary"
                    className="mb-6 grid grid-cols-2 gap-2.5 sm:mb-7 sm:gap-3.5 lg:grid-cols-4"
                >
                    {overviewCards.map((card) => {
                        const Icon = card.icon;
                        const isSelected = activeType === card.key;
                        return (
                            <button
                                key={card.key}
                                type="button"
                                onClick={() =>
                                    setActiveType(
                                        isSelected && card.key !== "ALL"
                                            ? "ALL"
                                            : card.key
                                    )
                                }
                                className={`flex min-w-0 touch-manipulation flex-col justify-between rounded-xl border p-3.5 text-left transition sm:p-4 ${
                                    isSelected
                                        ? "border-[var(--accent-border)] bg-[var(--accent-soft)]"
                                        : "border-slate-200/90 bg-white hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#111318] dark:hover:border-white/20"
                                } ${FOCUS_RING}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                                        {card.label}
                                    </span>
                                    <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7 ${
                                            isSelected
                                                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                                                : "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300"
                                        }`}
                                    >
                                        <Icon size={13} className="sm:h-3.5 sm:w-3.5" />
                                    </span>
                                </div>

                                <div className="mt-2.5 sm:mt-3">
                                    <div className="text-xl font-semibold tabular-nums text-slate-950 dark:text-white sm:text-2xl">
                                        {loading ? "—" : card.value}
                                    </div>
                                    <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
                                        {card.subtitle}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </section>

                {/* ERROR ALERT */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <div className="flex items-start gap-2.5 sm:items-center">
                            <AlertCircle
                                size={16}
                                className="mt-0.5 shrink-0 text-red-600 dark:text-red-400 sm:mt-0"
                            />
                            <p className="text-xs font-medium text-red-900 dark:text-red-200">
                                {error}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => void fetchAssets()}
                            className={`self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/25 dark:bg-transparent dark:text-red-200 sm:shrink-0 sm:self-auto sm:py-1 ${FOCUS_RING}`}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* FILTER TABS & VIEW CONTROLS */}
                <section aria-label="Saved assets">
                    <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-5 sm:flex-row sm:items-center">
                        <nav
                            aria-label="Filter by asset category"
                            className="-mx-3.5 flex items-center gap-1.5 overflow-x-auto px-3.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:pb-0"
                        >
                            {filterTabs.map(({ key, label, count }) => {
                                const isActive = activeType === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveType(key)}
                                        className={`inline-flex shrink-0 touch-manipulation items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                            isActive
                                                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#111318] dark:text-slate-300 dark:hover:border-white/20"
                                        } ${FOCUS_RING}`}
                                    >
                                        <span>{label}</span>
                                        <span
                                            className={`tabular-nums text-[11px] ${
                                                isActive
                                                    ? "opacity-85"
                                                    : "text-slate-400 dark:text-slate-500"
                                            }`}
                                        >
                                            {loading ? "–" : count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            {search || activeType !== "ALL" ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setActiveType("ALL");
                                    }}
                                    className="touch-manipulation text-xs font-medium text-[var(--accent-soft-text)] hover:underline"
                                >
                                    Clear filters
                                </button>
                            ) : (
                                <span className="text-xs text-slate-400 dark:text-slate-500 sm:hidden">
                                    {loading
                                        ? "Loading..."
                                        : `${filteredAssets.length} ${
                                              filteredAssets.length === 1
                                                  ? "record"
                                                  : "records"
                                          }`}
                                </span>
                            )}

                            <div
                                role="group"
                                aria-label="View layout"
                                className="ml-auto inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#111318] sm:ml-0"
                            >
                                <button
                                    type="button"
                                    onClick={() => setViewMode("grid")}
                                    aria-label="Grid view"
                                    aria-pressed={viewMode === "grid"}
                                    className={`flex h-7 w-7 touch-manipulation items-center justify-center rounded-md transition ${
                                        viewMode === "grid"
                                            ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                                            : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
                                    } ${FOCUS_RING}`}
                                >
                                    <LayoutGrid size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("list")}
                                    aria-label="List view"
                                    aria-pressed={viewMode === "list"}
                                    className={`flex h-7 w-7 touch-manipulation items-center justify-center rounded-md transition ${
                                        viewMode === "list"
                                            ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                                            : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
                                    } ${FOCUS_RING}`}
                                >
                                    <List size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* LOADING STATE */}
                    {loading && (
                        <div
                            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
                            aria-label="Loading records"
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex h-44 animate-pulse flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-white/[0.08] dark:bg-[#111318] sm:p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="h-6 w-24 rounded-md bg-slate-100 dark:bg-white/5" />
                                        <div className="h-4 w-14 rounded bg-slate-100 dark:bg-white/5" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-white/5" />
                                        <div className="h-3 w-full rounded bg-slate-50 dark:bg-white/[0.03]" />
                                    </div>
                                    <div className="h-8 w-full rounded-lg bg-slate-50 dark:bg-white/[0.03]" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {!loading && !error && visibleAssets.length === 0 && (
                        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center dark:border-white/12 dark:bg-[#111318] sm:min-h-[280px] sm:px-6">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                                <Files size={20} />
                            </div>
                            <h2 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                                {search
                                    ? `No results found for "${search}"`
                                    : activeType !== "ALL"
                                      ? `No ${ASSET_META[activeType].plural.toLowerCase()} yet`
                                      : "No records in your vault yet"}
                            </h2>
                            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                {search
                                    ? "Try adjusting your search terms or clearing active filters."
                                    : "Start by adding a document, certificate, password, link, or note."}
                            </p>
                            <div className="mt-5 flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row">
                                {(search || activeType !== "ALL") && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setActiveType("ALL");
                                        }}
                                        className={`inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:h-9 sm:w-auto sm:px-3.5 ${FOCUS_RING}`}
                                    >
                                        Reset filters
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            activeType !== "ALL"
                                                ? `/add-asset?type=${activeType}`
                                                : "/add-asset"
                                        )
                                    }
                                    className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 text-xs font-semibold text-[var(--accent-fg)] transition hover:bg-[var(--accent-hover)] sm:h-9 sm:w-auto ${FOCUS_RING}`}
                                >
                                    <Plus size={14} />
                                    <span>Add New Asset</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* GRID VIEW */}
                    {!loading &&
                        !error &&
                        visibleAssets.length > 0 &&
                        viewMode === "grid" && (
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                {visibleAssets.map((asset) => {
                                    const meta =
                                        ASSET_META[asset.type] ??
                                        ASSET_META.OTHER;
                                    const Icon = meta.icon;
                                    const firstFile = asset.files?.[0];
                                    const extraFiles =
                                        (asset.files?.length ?? 0) - 1;
                                    const urlInfo =
                                        asset.type === "LINK" ||
                                        asset.type === "SOCIAL_PROFILE"
                                            ? extractUrlInfo(asset.content)
                                            : null;
                                    const isCopied = copiedId === asset.id;

                                    return (
                                        <div
                                            key={asset.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                                navigate(
                                                    `/assets/${asset.id}`
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                ) {
                                                    e.preventDefault();
                                                    navigate(
                                                        `/assets/${asset.id}`
                                                    );
                                                }
                                            }}
                                            className={`group flex min-w-0 cursor-pointer touch-manipulation flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-white/[0.08] dark:bg-[#111318] dark:hover:border-white/20 sm:p-5 ${FOCUS_RING}`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.badgeClass}`}
                                                    >
                                                        <Icon size={12} />
                                                        <span>{meta.label}</span>
                                                    </span>

                                                    <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                                                        {formatDate(
                                                            asset.updatedAt ||
                                                                asset.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="mt-3.5">
                                                    <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-950 transition-colors group-hover:text-[var(--accent-soft-text)] dark:text-white">
                                                        {asset.title ||
                                                            "Untitled record"}
                                                    </h3>
                                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                        {asset.description?.trim() ||
                                                            (asset.type ===
                                                                "NOTE" &&
                                                            asset.content?.trim()
                                                                ? asset.content.trim()
                                                                : "No description provided")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* PRACTICAL ACTION BAR */}
                                            <div className="mt-4 flex min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                                {asset.type === "CREDENTIAL" &&
                                                asset.content ? (
                                                    <>
                                                        <span className="truncate font-mono text-xs tracking-widest text-slate-400 dark:text-slate-500">
                                                            ••••••••••••
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) =>
                                                                void handleCopySecret(
                                                                    e,
                                                                    asset.id,
                                                                    asset.content
                                                                )
                                                            }
                                                            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 sm:py-0.5"
                                                        >
                                                            {isCopied ? (
                                                                <>
                                                                    <Check
                                                                        size={
                                                                            11
                                                                        }
                                                                        className="text-emerald-600 dark:text-emerald-400"
                                                                    />
                                                                    <span>
                                                                        Copied
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Copy
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </>
                                                ) : urlInfo ? (
                                                    <>
                                                        <span className="min-w-0 truncate text-xs text-slate-600 dark:text-slate-300">
                                                            {urlInfo.host}
                                                        </span>
                                                        <a
                                                            href={urlInfo.href}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 sm:py-0.5"
                                                        >
                                                            <span>Open</span>
                                                            <ExternalLink
                                                                size={10}
                                                            />
                                                        </a>
                                                    </>
                                                ) : firstFile ? (
                                                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                                                        <Paperclip
                                                            size={12}
                                                            className="shrink-0 text-slate-400"
                                                        />
                                                        <span className="truncate font-medium">
                                                            {firstFile.originalFileName ||
                                                                "Attached file"}
                                                        </span>
                                                        {extraFiles > 0 && (
                                                            <span className="shrink-0 rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                                                                +{extraFiles}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                                        View details
                                                    </span>
                                                )}

                                                <ArrowUpRight
                                                    size={13}
                                                    className="shrink-0 text-slate-300 transition-colors group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    {/* TABLE / LIST VIEW */}
                    {!loading &&
                        !error &&
                        visibleAssets.length > 0 &&
                        viewMode === "list" && (
                            <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white dark:border-white/[0.08] dark:bg-[#111318]">
                                <div className="hidden grid-cols-[minmax(0,1fr)_140px_190px_115px] items-center border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.02] dark:text-slate-400 md:grid">
                                    <span>Title</span>
                                    <span>Category</span>
                                    <span>Attachment / Action</span>
                                    <span className="text-right">Updated</span>
                                </div>

                                <div className="divide-y divide-slate-200/75 dark:divide-white/[0.07]">
                                    {visibleAssets.map((asset) => {
                                        const meta =
                                            ASSET_META[asset.type] ??
                                            ASSET_META.OTHER;
                                        const Icon = meta.icon;
                                        const fileCount =
                                            asset.files?.length ?? 0;
                                        const isCopied = copiedId === asset.id;
                                        const urlInfo =
                                            asset.type === "LINK" ||
                                            asset.type === "SOCIAL_PROFILE"
                                                ? extractUrlInfo(asset.content)
                                                : null;

                                        return (
                                            <div
                                                key={asset.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() =>
                                                    navigate(
                                                        `/assets/${asset.id}`
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === "Enter" ||
                                                        e.key === " "
                                                    ) {
                                                        e.preventDefault();
                                                        navigate(
                                                            `/assets/${asset.id}`
                                                        );
                                                    }
                                                }}
                                                className={`group flex cursor-pointer touch-manipulation flex-col gap-2.5 px-3.5 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03] sm:px-4 md:grid md:grid-cols-[minmax(0,1fr)_140px_190px_115px] md:items-center md:gap-4 md:py-3 ${FOCUS_RING}`}
                                            >
                                                <div className="flex min-w-0 items-center gap-3 md:pr-3">
                                                    <span
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.iconClass}`}
                                                    >
                                                        <Icon size={14} />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-slate-900 group-hover:text-[var(--accent-soft-text)] dark:text-slate-100">
                                                            {asset.title ||
                                                                "Untitled record"}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                            {asset.description?.trim() ||
                                                                "No description"}
                                                        </p>
                                                    </div>
                                                    <ArrowUpRight
                                                        size={14}
                                                        className="shrink-0 text-slate-300 md:hidden dark:text-slate-600"
                                                    />
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-2 pl-11 md:contents">
                                                    <div>
                                                        <span
                                                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${meta.badgeClass}`}
                                                        >
                                                            {meta.label}
                                                        </span>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2">
                                                        {asset.type ===
                                                            "CREDENTIAL" &&
                                                        asset.content ? (
                                                            <button
                                                                type="button"
                                                                onClick={(e) =>
                                                                    void handleCopySecret(
                                                                        e,
                                                                        asset.id,
                                                                        asset.content
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                                                            >
                                                                {isCopied ? (
                                                                    <Check
                                                                        size={11}
                                                                        className="text-emerald-600"
                                                                    />
                                                                ) : (
                                                                    <Copy
                                                                        size={11}
                                                                    />
                                                                )}
                                                                <span>
                                                                    {isCopied
                                                                        ? "Copied"
                                                                        : "Copy"}
                                                                </span>
                                                            </button>
                                                        ) : urlInfo ? (
                                                            <a
                                                                href={urlInfo.href}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[var(--accent-soft-text)] dark:text-slate-300"
                                                            >
                                                                <span className="max-w-[130px] truncate">
                                                                    {urlInfo.host}
                                                                </span>
                                                                <ExternalLink
                                                                    size={11}
                                                                />
                                                            </a>
                                                        ) : fileCount > 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                                <Paperclip
                                                                    size={12}
                                                                />
                                                                {fileCount}{" "}
                                                                {fileCount === 1
                                                                    ? "file"
                                                                    : "files"}
                                                            </span>
                                                        ) : (
                                                            <span className="hidden text-xs text-slate-400 md:inline">
                                                                —
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-end gap-1.5 text-right">
                                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 sm:text-xs">
                                                            {formatDate(
                                                                asset.updatedAt ||
                                                                    asset.createdAt
                                                            )}
                                                        </span>
                                                        <ArrowUpRight
                                                            size={13}
                                                            className="hidden text-slate-300 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300 md:inline"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    {/* FOOTER */}
                    {!loading && !error && filteredAssets.length > 0 && (
                        <div className="mt-5 flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing{" "}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {visibleAssets.length}
                                </strong>{" "}
                                of{" "}
                                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                                    {filteredAssets.length}
                                </strong>{" "}
                                {filteredAssets.length === 1 ? "record" : "records"}
                            </span>
                            <button
                                type="button"
                                onClick={() => navigate("/assets")}
                                className={`inline-flex touch-manipulation items-center gap-1.5 self-start font-semibold text-[var(--accent-soft-text)] hover:underline sm:self-auto ${FOCUS_RING}`}
                            >
                                <span>View all records</span>
                                <ArrowRight size={13} />
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}