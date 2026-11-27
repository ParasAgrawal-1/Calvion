import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Plus,
    FileText,
    Award,
    Link as LinkIcon,
    StickyNote,
    Files,
    RefreshCw,
    Search,
    SlidersHorizontal,
    ChevronDown,
    ArrowUpRight,
    ArrowLeft,
    ShieldCheck,
    KeyRound,
    Folder,
    X,
    LayoutGrid,
    List,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../services/api";
import AppNavbar from "../components/AppNavbar";
import { useTheme } from "../context/ThemeContext";
import { decryptText } from "../utils/crypto";

/* =========================================================
   DESIGN TOKENS
   Matched to Dashboard typography, surfaces, and sizing.
   ========================================================= */

const wrap = "mx-auto w-full max-w-[1400px] px-3.5 sm:px-6 lg:px-8";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC] dark:focus-visible:ring-offset-[#090B0E]";

const btnPrimary =
    "bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)]";

const btnGhost =
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#111318] dark:text-slate-200 dark:hover:bg-white/[0.04]";

const surface = "border border-slate-200/90 bg-white dark:border-white/[0.08] dark:bg-[#111318]";
const bodyText = "text-slate-500 dark:text-slate-400";

const COLOR_THEME_VARS: Record<string, { light: Record<string, string>; dark: Record<string, string> }> = {
    cobalt: {
        light: { "--accent": "#2563EB", "--accent-hover": "#1D4ED8", "--accent-fg": "#FFFFFF", "--accent-soft": "#EFF6FF", "--accent-soft-text": "#1D4ED8", "--accent-border": "#BFDBFE" },
        dark: { "--accent": "#3B82F6", "--accent-hover": "#60A5FA", "--accent-fg": "#FFFFFF", "--accent-soft": "rgba(59, 130, 246, 0.14)", "--accent-soft-text": "#93C5FD", "--accent-border": "rgba(59, 130, 246, 0.32)" },
    },
    emerald: {
        light: { "--accent": "#059669", "--accent-hover": "#047857", "--accent-fg": "#FFFFFF", "--accent-soft": "#ECFDF5", "--accent-soft-text": "#047857", "--accent-border": "#A7F3D0" },
        dark: { "--accent": "#10B981", "--accent-hover": "#34D399", "--accent-fg": "#052E16", "--accent-soft": "rgba(16, 185, 129, 0.14)", "--accent-soft-text": "#6EE7B7", "--accent-border": "rgba(16, 185, 129, 0.32)" },
    },
    graphite: {
        light: { "--accent": "#18181B", "--accent-hover": "#27272A", "--accent-fg": "#FFFFFF", "--accent-soft": "#F4F4F5", "--accent-soft-text": "#18181B", "--accent-border": "#D4D4D8" },
        dark: { "--accent": "#F4F4F5", "--accent-hover": "#E4E4E7", "--accent-fg": "#09090B", "--accent-soft": "rgba(244, 244, 245, 0.10)", "--accent-soft-text": "#F4F4F5", "--accent-border": "rgba(244, 244, 245, 0.24)" },
    },
    indigo: {
        light: { "--accent": "#4F46E5", "--accent-hover": "#4338CA", "--accent-fg": "#FFFFFF", "--accent-soft": "#EEF2FF", "--accent-soft-text": "#4338CA", "--accent-border": "#C7D2FE" },
        dark: { "--accent": "#6366F1", "--accent-hover": "#818CF8", "--accent-fg": "#FFFFFF", "--accent-soft": "rgba(99, 102, 241, 0.15)", "--accent-soft-text": "#A5B4FC", "--accent-border": "rgba(99, 102, 241, 0.32)" },
    },
    bronze: {
        light: { "--accent": "#B45309", "--accent-hover": "#92400E", "--accent-fg": "#FFFFFF", "--accent-soft": "#FFFBEB", "--accent-soft-text": "#92400E", "--accent-border": "#FDE68A" },
        dark: { "--accent": "#D97706", "--accent-hover": "#F59E0B", "--accent-fg": "#FFFFFF", "--accent-soft": "rgba(217, 119, 6, 0.15)", "--accent-soft-text": "#FCD34D", "--accent-border": "rgba(217, 119, 6, 0.32)" },
    },
};

/* =========================================================
   TYPES
   ========================================================= */

type AssetType = "DOCUMENT" | "CERTIFICATE" | "NOTE" | "LINK" | "CREDENTIAL" | "OTHER";

interface UploadedFile {
    id: number;
    originalFileName: string;
    fileType?: string | null;
    fileSize?: number | null;
    encrypted?: boolean | null;
    fileHash?: string | null;
}

interface Asset {
    id: number;
    title: string;
    description?: string | null;
    type: AssetType;
    content?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    files?: UploadedFile[];
}

interface AssetPage {
    content: Asset[];
    totalElements: number;
    totalPages: number;
    number: number;
}

type FilterType = "ALL" | AssetType;
type SortOption = "updated-desc" | "updated-asc" | "title-asc" | "title-desc";
type ViewMode = "grid" | "list";

/* =========================================================
   HELPERS & METADATA
   ========================================================= */

const FILTER_TABS: Array<{ id: FilterType; label: string; icon: LucideIcon }> = [
    { id: "ALL", label: "All", icon: Folder },
    { id: "DOCUMENT", label: "Documents", icon: FileText },
    { id: "CERTIFICATE", label: "Certificates", icon: Award },
    { id: "CREDENTIAL", label: "Credentials", icon: KeyRound },
    { id: "NOTE", label: "Notes", icon: StickyNote },
    { id: "LINK", label: "Links", icon: LinkIcon },
    { id: "OTHER", label: "Other", icon: Folder },
];

function getAssetIcon(type: AssetType): LucideIcon {
    switch (type) {
        case "DOCUMENT":
            return FileText;
        case "CERTIFICATE":
            return Award;
        case "LINK":
            return LinkIcon;
        case "CREDENTIAL":
            return KeyRound;
        case "NOTE":
            return StickyNote;
        default:
            return Folder;
    }
}

function formatType(type: AssetType) {
    return type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string | null) {
    if (!date) return "Recently";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Recently";
    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatRelativeDate(date?: string | null) {
    if (!date) return "Recently";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Recently";

    const diff = Date.now() - parsed.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(date);
}

function getFileCount(asset: Asset) {
    return asset.files?.length || 0;
}

function getTypeStyles(type: AssetType) {
    switch (type) {
        case "DOCUMENT":
            return {
                icon: "bg-[var(--accent-soft)] text-[var(--accent-soft-text)]",
                badge: "bg-indigo-50 text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200",
            };
        case "CERTIFICATE":
            return {
                icon: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
                badge: "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-200",
            };
        case "CREDENTIAL":
            return {
                icon: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300",
                badge: "bg-violet-50 text-violet-800 dark:bg-violet-400/10 dark:text-violet-200",
            };
        case "LINK":
            return {
                icon: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
                badge: "bg-sky-50 text-sky-800 dark:bg-sky-400/10 dark:text-sky-200",
            };
        case "NOTE":
            return {
                icon: "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300",
                badge: "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200",
            };
        default:
            return {
                icon: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
                badge: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
            };
    }
}

/* =========================================================
   ERROR HANDLER
   ========================================================= */

function getErrorMessage(error: unknown) {
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
        if (status === 403) return "You do not have permission to access these assets.";
        if (status === 404) return "Assets endpoint was not found.";
        if (status && status >= 500) return "Server error. Please try again in a moment.";
    }
    if (error instanceof Error) return error.message;
    return "Failed to load your assets.";
}

/* =========================================================
   SKELETON LOADER
   ========================================================= */

function AssetsSkeleton() {
    return (
        <div
            aria-busy="true"
            aria-label="Loading vault assets"
            className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className={`flex min-h-[212px] animate-pulse flex-col rounded-xl p-5 ${surface}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5" />
                        <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-white/5" />
                    </div>
                    <div className="mt-5 h-5 w-3/4 rounded-md bg-slate-100 dark:bg-white/5" />
                    <div className="mt-2.5 h-4 w-full rounded-md bg-slate-100 dark:bg-white/5" />
                    <div className="mt-1.5 h-4 w-2/3 rounded-md bg-slate-100 dark:bg-white/5" />
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                        <div className="h-3.5 w-24 rounded bg-slate-100 dark:bg-white/5" />
                        <div className="h-5 w-14 rounded-md bg-slate-100 dark:bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   COMPONENT
   ========================================================= */

const MyAssets = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const savedColorTheme = localStorage.getItem("calvion_ui_color_theme") || "cobalt";
    const selectedColorTheme = COLOR_THEME_VARS[savedColorTheme] ?? COLOR_THEME_VARS.cobalt;
    const themeVars = theme === "dark" ? selectedColorTheme.dark : selectedColorTheme.light;
    const hasLoaded = useRef(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const [assets, setAssets] = useState<Asset[]>([]);
    const [totalAssets, setTotalAssets] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("ALL");
    const [sortOption, setSortOption] = useState<SortOption>("updated-desc");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    /* =====================================================
       LOAD & CLIENT-SIDE DECRYPT
       ===================================================== */

    const loadAssets = useCallback(
        async (showFullLoader = true) => {
            try {
                if (showFullLoader) setLoading(true);
                else setRefreshing(true);

                setMessage("");

                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await api.get<AssetPage>("/assets", {
                    params: {
                        page: 0,
                        size: 50,
                        sortBy: "updatedAt",
                        direction: "desc",
                    },
                });

                const responseData = response.data;
                const receivedAssets = Array.isArray(responseData?.content)
                    ? [...responseData.content]
                    : [];

                const receivedTotal =
                    Number(responseData?.totalElements) || receivedAssets.length;

                const decryptedAssets = await Promise.all(
                    receivedAssets.map(async (asset: Asset) => ({
                        ...asset,
                        title: await decryptText(asset.title),
                        description: asset.description
                            ? await decryptText(asset.description)
                            : asset.description,
                    }))
                );

                setAssets(decryptedAssets);
                setTotalAssets(receivedTotal);
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("email");
                    localStorage.removeItem("name");
                    navigate("/login");
                    return;
                }
                setMessage(getErrorMessage(error));
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate]
    );

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;
        void loadAssets();
    }, [loadAssets]);

    /* '/' shortcut to focus search */
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === "/" &&
                document.activeElement?.tagName !== "INPUT" &&
                document.activeElement?.tagName !== "TEXTAREA" &&
                document.activeElement?.tagName !== "SELECT"
            ) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    /* =====================================================
       COUNTS + FILTER + SEARCH + SORT
       ===================================================== */

    const typeCounts = useMemo(() => {
        const counts: Record<FilterType, number> = {
            ALL: assets.length,
            DOCUMENT: 0,
            CERTIFICATE: 0,
            CREDENTIAL: 0,
            NOTE: 0,
            LINK: 0,
            OTHER: 0,
        };
        for (const item of assets) {
            counts[item.type] = (counts[item.type] || 0) + 1;
        }
        return counts;
    }, [assets]);

    const filteredAssets = useMemo(() => {
        let result = [...assets];
        const query = searchQuery.trim().toLowerCase();

        if (query) {
            result = result.filter(
                (asset) =>
                    asset.title?.toLowerCase().includes(query) ||
                    asset.description?.toLowerCase().includes(query) ||
                    formatType(asset.type).toLowerCase().includes(query) ||
                    asset.files?.some((f) =>
                        f.originalFileName?.toLowerCase().includes(query)
                    )
            );
        }

        if (filterType !== "ALL") {
            result = result.filter((asset) => asset.type === filterType);
        }

        result.sort((a, b) => {
            if (sortOption === "title-asc") {
                return (a.title || "").localeCompare(b.title || "");
            }
            if (sortOption === "title-desc") {
                return (b.title || "").localeCompare(a.title || "");
            }
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
            return sortOption === "updated-desc" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [assets, searchQuery, filterType, sortOption]);

    const hasActiveFilters = Boolean(searchQuery.trim()) || filterType !== "ALL";

    const clearFilters = () => {
        setSearchQuery("");
        setFilterType("ALL");
    };

    /* =====================================================
       PAGE
       ===================================================== */

    return (
        <div
            style={themeVars as React.CSSProperties}
            className="min-h-dvh overflow-x-clip bg-[#F8FAFC] text-slate-900 antialiased transition-colors duration-200 dark:bg-[#090B0E] dark:text-slate-100"
        >
            <AppNavbar activePage="assets" />

            <main className={`${wrap} pb-24 pt-5 sm:pt-8 md:pb-16`}>
                {/* BACK LINK */}
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`group mb-4 inline-flex touch-manipulation items-center gap-2 rounded-lg py-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white ${focusRing}`}
                >
                    <ArrowLeft
                        size={16}
                        aria-hidden="true"
                        className="transition-transform duration-150 group-hover:-translate-x-0.5"
                    />
                    <span>Back to Dashboard</span>
                </button>

                {/* PAGE HEADER */}
                <header className="mb-6 flex flex-col gap-4 border-b border-slate-200/90 pb-5 dark:border-white/[0.08] sm:mb-7 sm:pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <div>
                        <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            <ShieldCheck size={14} aria-hidden="true" className="shrink-0" />
                            <span>Zero-knowledge encrypted vault</span>
                        </div>

                        <h1 className="break-words text-xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-2xl lg:text-[26px] lg:leading-tight">
                            My Assets
                        </h1>

                        <p className={`mt-1 text-xs leading-relaxed sm:text-sm ${bodyText}`}>
                            {loading ? (
                                "Decrypting your vault items…"
                            ) : (
                                <>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {totalAssets}
                                    </span>{" "}
                                    {totalAssets === 1 ? "item" : "items"} encrypted locally with
                                    AES-256-GCM
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => {
                                if (!refreshing && !loading) void loadAssets(false);
                            }}
                            disabled={refreshing || loading}
                            title="Refresh assets"
                            aria-label="Refresh assets"
                            className={`inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${btnGhost} ${focusRing}`}
                        >
                            <RefreshCw
                                size={17}
                                aria-hidden="true"
                                className={refreshing ? "animate-spin" : ""}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/add-asset")}
                            className={`inline-flex h-10 flex-1 touch-manipulation items-center justify-center gap-2 rounded-lg px-3.5 text-xs font-semibold transition-colors sm:flex-initial ${btnPrimary} ${focusRing}`}
                        >
                            <Plus size={15} strokeWidth={2.25} aria-hidden="true" />
                            <span>Add Asset</span>
                        </button>
                    </div>
                </header>

                {/* ERROR BANNER */}
                {message && (
                    <div
                        role="alert"
                        className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/20 dark:bg-red-500/10 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <div>
                            <p className="text-xs font-medium text-red-900 dark:text-red-300">
                                Unable to load your assets
                            </p>
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                                {message}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadAssets()}
                            className={`inline-flex h-9 shrink-0 touch-manipulation items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-[#111318] dark:text-red-300 dark:hover:bg-red-950/40 ${focusRing}`}
                        >
                            <RefreshCw size={15} aria-hidden="true" />
                            <span>Try Again</span>
                        </button>
                    </div>
                )}

                {/* CATEGORY TABS + SEARCH / SORT TOOLBAR */}
                {!message && (loading || assets.length > 0) && (
                    <section aria-label="Filter and search assets" className="mb-6 space-y-3 sm:mb-7">
                        {/* Quick category chips */}
                        <div
                            role="tablist"
                            aria-label="Asset categories"
                            className="flex gap-1.5 overflow-x-auto pb-1"
                        >
                            {FILTER_TABS.map(({ id, label, icon: Icon }) => {
                                const count = typeCounts[id] ?? 0;
                                if (id !== "ALL" && id !== filterType && count === 0 && !loading) {
                                    return null;
                                }
                                const active = filterType === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setFilterType(id)}
                                        className={`inline-flex shrink-0 touch-manipulation items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${focusRing} ${
                                            active
                                                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#111318] dark:text-slate-300 dark:hover:border-white/20"
                                        }`}
                                    >
                                        <Icon size={13} aria-hidden="true" />
                                        <span>{label}</span>
                                        {!loading && (
                                            <span
                                                className={`rounded-full px-1.5 py-0.2 text-[11px] ${
                                                    active
                                                        ? "bg-white/20 text-white dark:bg-slate-900/15 dark:text-slate-950"
                                                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search, Sort & Layout Switcher */}
                        <div className={`rounded-xl p-2.5 sm:p-3 ${surface}`}>
                            <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
                                {/* Search */}
                                <div className="relative min-w-0 flex-1">
                                    <Search
                                        size={17}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                    />
                                    <input
                                        ref={searchInputRef}
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search titles, descriptions, or file names…"
                                        aria-label="Search assets"
                                        className={`h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--accent)] focus:bg-white dark:border-white/10 dark:bg-[#111318] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[var(--accent)] dark:focus:bg-[#111318] sm:text-xs ${focusRing}`}
                                    />
                                    {searchQuery ? (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            aria-label="Clear search"
                                            className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200 ${focusRing}`}
                                        >
                                            <X size={14} aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <kbd
                                            aria-hidden="true"
                                            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500 sm:inline-block"
                                        >
                                            /
                                        </kbd>
                                    )}
                                </div>

                                <div className="flex items-center gap-2.5">
                                    {/* Sort */}
                                    <div className="relative flex-1 md:flex-initial">
                                        <SlidersHorizontal
                                            size={15}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                        />
                                        <select
                                            value={sortOption}
                                            onChange={(e) =>
                                                setSortOption(e.target.value as SortOption)
                                            }
                                            aria-label="Sort assets"
                                            className={`h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-[#111318] dark:text-slate-200 dark:hover:border-white/20 md:w-[190px] ${focusRing}`}
                                        >
                                            <option value="updated-desc">Recently Updated</option>
                                            <option value="updated-asc">Oldest Updated</option>
                                            <option value="title-asc">Title A–Z</option>
                                            <option value="title-desc">Title Z–A</option>
                                        </select>
                                        <ChevronDown
                                            size={15}
                                            aria-hidden="true"
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                                        />
                                    </div>

                                    {/* Grid / List View Toggle */}
                                    <div
                                        role="group"
                                        aria-label="View layout"
                                        className="flex h-11 shrink-0 items-center h-8 rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#111318]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("grid")}
                                            aria-pressed={viewMode === "grid"}
                                            aria-label="Grid view"
                                            title="Grid view"
                                            className={`flex h-7 w-7 touch-manipulation items-center justify-center rounded-md transition-colors ${focusRing} ${
                                                viewMode === "grid"
                                                    ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                                            }`}
                                        >
                                            <LayoutGrid size={16} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode("list")}
                                            aria-pressed={viewMode === "list"}
                                            aria-label="List view"
                                            title="List view"
                                            className={`flex h-7 w-7 touch-manipulation items-center justify-center rounded-md transition-colors ${focusRing} ${
                                                viewMode === "list"
                                                    ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                                            }`}
                                        >
                                            <List size={16} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filter Summary Bar */}
                            {hasActiveFilters && !loading && (
                                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/75 px-1 pt-2.5 dark:border-white/[0.07]">
                                    <p className={`text-xs ${bodyText}`}>
                                        Showing{" "}
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {filteredAssets.length}
                                        </span>{" "}
                                        of {assets.length}{" "}
                                        {assets.length === 1 ? "asset" : "assets"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className={`rounded text-xs font-semibold text-[var(--accent-soft-text)] hover:underline ${focusRing}`}
                                    >
                                        Reset filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* LOADING SKELETON */}
                {!message && loading && <AssetsSkeleton />}

                {/* EMPTY WORKSPACE */}
                {!message && !loading && assets.length === 0 && (
                    <div
                        className={`flex min-h-[280px] flex-col items-center justify-center rounded-xl border-dashed px-5 py-8 text-center sm:px-6 ${surface}`}
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-soft-text)]">
                            <Folder size={28} strokeWidth={1.8} aria-hidden="true" />
                        </div>

                        <h2 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                            Your vault is empty
                        </h2>

                        <p className={`mt-1 max-w-sm text-xs leading-relaxed ${bodyText}`}>
                            Store documents, certificates, credentials, notes and links. Everything
                            is encrypted in your browser before it leaves your device.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/add-asset")}
                            className={`mt-6 inline-flex h-11 touch-manipulation items-center gap-2 rounded-lg px-3.5 text-xs font-semibold transition-colors ${btnPrimary} ${focusRing}`}
                        >
                            <Plus size={17} aria-hidden="true" />
                            <span>Add Your First Asset</span>
                        </button>
                    </div>
                )}

                {/* NO MATCHING RESULTS */}
                {!message && !loading && assets.length > 0 && filteredAssets.length === 0 && (
                    <div
                        className={`flex min-h-[260px] flex-col items-center justify-center rounded-xl px-5 py-8 text-center sm:px-6 ${surface}`}
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
                            <Search size={22} aria-hidden="true" />
                        </div>

                        <h2 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">
                            No matching assets
                        </h2>

                        <p className={`mt-1 max-w-sm text-xs leading-relaxed ${bodyText}`}>
                            No items matched your current search or category filter.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className={`mt-5 inline-flex h-9 touch-manipulation items-center rounded-lg px-3.5 text-xs font-medium transition-colors ${btnGhost} ${focusRing}`}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* ASSET COLLECTION */}
                {!message && !loading && filteredAssets.length > 0 && (
                    <section aria-label="Asset collection">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {filterType === "ALL"
                                    ? "All items"
                                    : `${formatType(filterType)}s`}
                            </h2>
                            <span className={`text-xs ${bodyText}`}>
                                {filteredAssets.length}{" "}
                                {filteredAssets.length === 1 ? "item" : "items"}
                            </span>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredAssets.map((asset) => {
                                    const styles = getTypeStyles(asset.type);
                                    const fileCount = getFileCount(asset);
                                    const Icon = getAssetIcon(asset.type);
                                    const displayTitle = asset.title || "Untitled Asset";

                                    return (
                                        <article
                                            key={asset.id}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Open ${displayTitle}`}
                                            onClick={() => navigate(`/assets/${asset.id}`)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    navigate(`/assets/${asset.id}`);
                                                }
                                            }}
                                            className={`group flex min-h-[220px] cursor-pointer touch-manipulation flex-col rounded-xl p-4 sm:p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-900/5 dark:hover:border-white/25 dark:hover:bg-[#070707] ${surface} ${focusRing}`}
                                        >
                                            {/* Card Top Row */}
                                            <div className="flex shrink-0 items-center justify-between gap-2">
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                                                    >
                                                        <Icon size={14} aria-hidden="true" />
                                                    </span>
                                                    <span
                                                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}
                                                    >
                                                        {formatType(asset.type)}
                                                    </span>
                                                </div>

                                                <span
                                                    aria-hidden="true"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors group-hover:bg-slate-100 group-hover:text-slate-900 dark:text-slate-500 dark:group-hover:bg-white/10 dark:group-hover:text-white"
                                                >
                                                    <ArrowUpRight size={16} />
                                                </span>
                                            </div>

                                            {/* Title & Description */}
                                            <h3 className="mt-3 shrink-0 break-words text-sm font-semibold leading-5 text-slate-950 transition-colors group-hover:text-[var(--accent-soft-text)] dark:text-white">
                                                {displayTitle}
                                            </h3>

                                            <p
                                                className={`mt-1 min-h-[36px] shrink-0 break-words text-xs leading-relaxed ${bodyText}`}
                                            >
                                                {asset.description || "No description provided."}
                                            </p>

                                            <div className="min-h-3 flex-1" />

                                            {/* Card Footer */}
                                            <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-t border-slate-200/75 pt-3 dark:border-white/[0.07]">
                                                <span className="truncate text-xs text-slate-500 dark:text-slate-500">
                                                    Updated{" "}
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {formatRelativeDate(asset.updatedAt)}
                                                    </span>
                                                </span>

                                                {fileCount > 0 && (
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300">
                                                        <Files size={12} aria-hidden="true" />
                                                        {fileCount}{" "}
                                                        {fileCount === 1 ? "file" : "files"}
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            /* COMPACT LIST VIEW */
                            <div className={`divide-y divide-slate-200/75 overflow-hidden rounded-xl dark:divide-white/[0.07] ${surface}`}>
                                {filteredAssets.map((asset) => {
                                    const styles = getTypeStyles(asset.type);
                                    const fileCount = getFileCount(asset);
                                    const Icon = getAssetIcon(asset.type);
                                    const displayTitle = asset.title || "Untitled Asset";

                                    return (
                                        <div
                                            key={asset.id}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Open ${displayTitle}`}
                                            onClick={() => navigate(`/assets/${asset.id}`)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    navigate(`/assets/${asset.id}`);
                                                }
                                            }}
                                            className={`group flex cursor-pointer touch-manipulation items-center gap-3 px-3.5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-[#070707] sm:px-4 ${focusRing}`}
                                        >
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                                            >
                                                <Icon size={18} aria-hidden="true" />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="truncate text-sm font-medium text-slate-900 transition-colors group-hover:text-[var(--accent-soft-text)] dark:text-white">
                                                        {displayTitle}
                                                    </h3>
                                                    <span
                                                        className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium sm:inline-flex ${styles.badge}`}
                                                    >
                                                        {formatType(asset.type)}
                                                    </span>
                                                </div>
                                                <p className={`truncate text-xs ${bodyText}`}>
                                                    {asset.description || "No description provided."}
                                                </p>
                                            </div>

                                            <div className="hidden shrink-0 items-center gap-3 sm:flex">
                                                {fileCount > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-white/5 dark:text-slate-300">
                                                        <Files size={12} aria-hidden="true" />
                                                        {fileCount}
                                                    </span>
                                                )}
                                                <span className="w-24 text-right text-xs text-slate-500 dark:text-slate-500">
                                                    {formatRelativeDate(asset.updatedAt)}
                                                </span>
                                            </div>

                                            <ArrowUpRight
                                                size={16}
                                                aria-hidden="true"
                                                className="shrink-0 text-slate-400 transition-colors group-hover:text-slate-900 dark:text-slate-500 dark:group-hover:text-white"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default MyAssets;