
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    LayoutDashboard,
    Folder,
    LogOut,
    Plus,
    FileText,
    Award,
    Link as LinkIcon,

    StickyNote,

    Users,
    Files,
    RefreshCw,
    Search, SlidersHorizontal, ChevronDown, ExternalLink, ArrowLeft, Database, Key,

} from "lucide-react";

import api from "../services/api";

/* =========================================================
   TYPES
========================================================= */

type AssetType =
    | "DOCUMENT"
    | "CERTIFICATE"
    | "NOTE"
    | "LINK"
    | "CREDENTIAL"
    | "OTHER";

interface UploadedFile {
    id: number;
    originalFileName: string;
    fileType?: string | null;
    fileSize?: number | null;
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

type SortOption =
    | "updated-desc"
    | "updated-asc"
    | "title-asc"
    | "title-desc";

/* =========================================================
   HELPERS
========================================================= */

function getAssetIcon(type: AssetType) {
    switch (type) {
        case "DOCUMENT":
            return FileText;

        case "CERTIFICATE":
            return Award;

        case "LINK":
            return LinkIcon;

        case "CREDENTIAL":
            return Key;

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
    if (!date) {
        return "Recently";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatRelativeDate(date?: string | null) {
    if (!date) {
        return "Recently updated";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Recently updated";
    }

    const now = new Date();

    const difference =
        now.getTime() - parsedDate.getTime();

    const minutes = Math.floor(
        difference / (1000 * 60)
    );

    const hours = Math.floor(
        difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    if (hours < 24) {
        return `${hours}h ago`;
    }

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDate(date);
}

function getFileCount(asset: Asset) {
    return asset.files?.length || 0;
}

function getInitials(name?: string) {
    if (!name) {
        return "U";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) =>
            part.charAt(0).toUpperCase()
        )
        .join("");
}

/* =========================================================
   ERROR HANDLER
========================================================= */

function getErrorMessage(error: unknown) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message === "string"
        ) {
            return data.message;
        }

        if (status === 401) {
            return "Your session has expired. Please login again.";
        }

        if (status === 403) {
            return "You do not have permission to access your assets.";
        }

        if (status === 404) {
            return "Assets endpoint was not found. Please check the backend API configuration.";
        }

        if (status && status >= 500) {
            return "Server error. Please try again later.";
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Failed to load your assets.";
}

/* =========================================================
   ASSET TYPE STYLES
========================================================= */

function getTypeStyles(type: AssetType) {
    switch (type) {
        case "DOCUMENT":
            return {
                icon:
                    "bg-blue-50 text-blue-700 ring-blue-100",
                badge:
                    "border-blue-100 bg-blue-50 text-blue-700",
                hover:
                    "group-hover:text-blue-700",
            };

        case "CERTIFICATE":
            return {
                icon:
                    "bg-amber-50 text-amber-700 ring-amber-100",
                badge:
                    "border-amber-100 bg-amber-50 text-amber-700",
                hover:
                    "group-hover:text-amber-700",
            };

        case "CREDENTIAL":
            return {
                icon:
                    "bg-violet-50 text-violet-700 ring-violet-100",
                badge:
                    "border-violet-100 bg-violet-50 text-violet-700",
                hover:
                    "group-hover:text-violet-700",
            };

        case "LINK":
            return {
                icon:
                    "bg-cyan-50 text-cyan-700 ring-cyan-100",
                badge:
                    "border-cyan-100 bg-cyan-50 text-cyan-700",
                hover:
                    "group-hover:text-cyan-700",
            };

        case "NOTE":
            return {
                icon:
                    "bg-sky-50 text-sky-700 ring-sky-100",
                badge:
                    "border-sky-100 bg-sky-50 text-sky-700",
                hover:
                    "group-hover:text-sky-700",
            };

        default:
            return {
                icon:
                    "bg-slate-100 text-slate-700 ring-slate-200",
                badge:
                    "border-slate-200 bg-slate-100 text-slate-700",
                hover:
                    "group-hover:text-slate-700",
            };
    }
}

/* =========================================================
   COMPONENT
========================================================= */

const MyAssets = () => {
    const navigate = useNavigate();
    const hasLoaded = useRef(false);

    /* =====================================================
       STATE
    ===================================================== */

    const [assets, setAssets] =
        useState<Asset[]>([]);

    const [totalAssets, setTotalAssets] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [searchQuery, setSearchQuery] =
        useState("");

    const [filterType, setFilterType] =
        useState<FilterType>("ALL");

    const [sortOption, setSortOption] =
        useState<SortOption>("updated-desc");

    const [refreshing, setRefreshing] =
        useState(false);

    /* =====================================================
       USER
    ===================================================== */

    const userName =
        localStorage.getItem("name") ||
        localStorage
            .getItem("email")
            ?.split("@")[0] ||
        "User";

    /* =====================================================
       LOAD ASSETS
    ===================================================== */

    const loadAssets = async (
        showFullLoader = true
    ) => {
        try {
            if (showFullLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setMessage("");

            const token =
                localStorage.getItem("token");

            console.log(
                "========================================"
            );

            console.log(
                "MY ASSETS REQUEST"
            );

            console.log(
                "Token exists:",
                Boolean(token)
            );

            if (!token) {
                navigate("/login");
                return;
            }

            /*
             * api.ts baseURL:
             *
             * http://localhost:8080/api
             *
             * Therefore endpoint is:
             *
             * /assets
             *
             * NOT:
             *
             * /api/assets
             */

            const response =
                await api.get<AssetPage>(
                    "/assets",
                    {
                        params: {
                            page: 0,
                            size: 50,
                            sortBy: "updatedAt",
                            direction: "desc",
                        },
                    }
                );

            console.log(
                "My Assets API Status:",
                response.status
            );

            console.log(
                "My Assets API Response:",
                response.data
            );

            const responseData =
                response.data;

            const receivedAssets =
                Array.isArray(
                    responseData?.content
                )
                    ? [...responseData.content]
                    : [];

            const receivedTotal =
                Number(
                    responseData?.totalElements
                ) || receivedAssets.length;

            console.log(
                "My Assets Count:",
                receivedAssets.length
            );

            console.log(
                "Total Assets:",
                receivedTotal
            );

            setAssets(
                receivedAssets
            );

            setTotalAssets(
                receivedTotal
            );

            console.log(
                "========================================"
            );
        } catch (error: unknown) {
            console.error(
                "Failed to load assets:",
                error
            );

            if (
                axios.isAxiosError(error)
            ) {
                console.error(
                    "HTTP STATUS:",
                    error.response?.status
                );

                console.error(
                    "SERVER RESPONSE:",
                    error.response?.data
                );

                if (
                    error.response?.status ===
                    401
                ) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "email"
                    );

                    localStorage.removeItem(
                        "name"
                    );

                    navigate("/login");

                    return;
                }
            }

            setMessage(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        if (hasLoaded.current) {
            return;
        }

        hasLoaded.current = true;

        loadAssets();
    }, []);

    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");

        navigate("/login");
    };

    /* =====================================================
       FILTER + SEARCH + SORT
    ===================================================== */

    const filteredAssets =
        useMemo(() => {
            let result = [...assets];

            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (query) {
                result =
                    result.filter(
                        (asset) =>
                            asset.title
                                ?.toLowerCase()
                                .includes(query) ||

                            asset.description
                                ?.toLowerCase()
                                .includes(query) ||

                            formatType(
                                asset.type
                            )
                                .toLowerCase()
                                .includes(query)
                    );
            }

            if (
                filterType !==
                "ALL"
            ) {
                result =
                    result.filter(
                        (asset) =>
                            asset.type ===
                            filterType
                    );
            }

            result.sort(
                (a, b) => {
                    if (
                        sortOption ===
                        "title-asc"
                    ) {
                        return (
                            a.title || ""
                        ).localeCompare(
                            b.title || ""
                        );
                    }

                    if (
                        sortOption ===
                        "title-desc"
                    ) {
                        return (
                            b.title || ""
                        ).localeCompare(
                            a.title || ""
                        );
                    }

                    const dateA =
                        new Date(
                            a.updatedAt ||
                            a.createdAt ||
                            0
                        ).getTime();

                    const dateB =
                        new Date(
                            b.updatedAt ||
                            b.createdAt ||
                            0
                        ).getTime();

                    return sortOption ===
                    "updated-desc"
                        ? dateB - dateA
                        : dateA - dateB;
                }
            );

            return result;
        }, [
            assets,
            searchQuery,
            filterType,
            sortOption,
        ]);

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {
        setSearchQuery("");
        setFilterType("ALL");
    };



    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* =================================================
    HEADER
================================================= */}

            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* =================================================
            LOGO
        ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="group flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">

                            <Files
                                size={20}
                            />

                        </div>


                        <div className="text-left">

                            <div className="text-lg font-bold tracking-tight text-slate-900">
                                DataLife
                            </div>

                            <div className="hidden text-[11px] font-medium text-slate-400 sm:block">
                                Digital Asset Manager
                            </div>

                        </div>

                    </button>


                    {/* =================================================
            NAVIGATION + USER
        ================================================= */}

                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* NAVIGATION */}

                        <div className="hidden items-center gap-1 md:flex">


                            {/* =================================================
                    DASHBOARD
                ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >

                                <LayoutDashboard
                                    size={16}
                                />

                                Dashboard

                            </button>


                            {/* =================================================
                    MY ASSETS - ACTIVE
                ================================================= */}

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700"
                            >

                                <Folder
                                    size={16}
                                />

                                My Assets

                            </button>


                            {/* =================================================
                    SHARED WITH ME
                ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/shared-assets")
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                            >

                                <Users
                                    size={16}
                                />

                                Shared With Me

                            </button>

                        </div>


                        {/* =================================================
                USER
            ================================================= */}

                        <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">

                                {getInitials(
                                    userName
                                )}

                            </div>


                            <span className="max-w-28 truncate text-sm font-medium text-slate-700">

                    {userName}

                </span>

                        </div>


                        {/* =================================================
                LOGOUT
            ================================================= */}

                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            title="Logout"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >

                            <LogOut
                                size={18}
                            />

                        </button>

                    </div>

                </div>

            </header>
            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:py-11">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                    className="group mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >

                    <ArrowLeft
                        size={17}
                        className="transition-transform duration-200 group-hover:-translate-x-1"
                    />

                    Back to Dashboard

                </button>

                {/* PAGE HEADER */}

                <section className="mb-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                    <div>

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-700">

                            <Database
                                size={13}
                            />

                            Your digital workspace

                        </div>

                        <h1 className="text-[42px] font-bold leading-tight tracking-[-1.5px] text-slate-950 sm:text-5xl">
                            My Assets
                        </h1>

                        <p className="mt-3 text-[15px] leading-6 text-slate-500">

                            {totalAssets}{" "}

                            {totalAssets === 1
                                ? "asset"
                                : "assets"}

                            {" "}stored securely in your workspace.

                        </p>

                    </div>

                    {/* ADD ASSET */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/add-asset"
                            )
                        }
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    >

                        <Plus
                            size={19}
                            strokeWidth={2.2}
                        />

                        Add Asset

                    </button>

                </section>

                {/* ERROR */}

                {message && (

                    <div
                        role="alert"
                        className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >

                        <div>

                            <p className="font-semibold text-red-800">
                                Unable to load your assets
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                {message}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadAssets()
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
                        >

                            <RefreshCw
                                size={16}
                            />

                            Try Again

                        </button>

                    </div>

                )}

                {/* SEARCH / FILTER */}

                {!message && (

                    <section className="mb-9 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">

                        <div className="flex flex-col gap-3 lg:flex-row">

                            {/* SEARCH */}

                            <div className="relative min-w-0 flex-1">

                                <Search
                                    size={19}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search your assets..."
                                    aria-label="Search assets"
                                    className="h-12 w-full rounded-xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />

                            </div>

                            {/* TYPE */}

                            <div className="relative">

                                <SlidersHorizontal
                                    size={17}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(
                                            e.target.value as FilterType
                                        )
                                    }
                                    aria-label="Filter by asset type"
                                    className="h-12 w-full min-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                                >

                                    <option value="ALL">
                                        All Types
                                    </option>

                                    <option value="DOCUMENT">
                                        Documents
                                    </option>

                                    <option value="CERTIFICATE">
                                        Certificates
                                    </option>

                                    <option value="NOTE">
                                        Notes
                                    </option>

                                    <option value="LINK">
                                        Links
                                    </option>

                                    <option value="CREDENTIAL">
                                        Credentials
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                            </div>

                            {/* SORT */}

                            <div className="relative">

                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(
                                            e.target.value as SortOption
                                        )
                                    }
                                    aria-label="Sort assets"
                                    className="h-12 w-full min-w-[190px] appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                                >

                                    <option value="updated-desc">
                                        Recently Updated
                                    </option>

                                    <option value="updated-asc">
                                        Oldest Updated
                                    </option>

                                    <option value="title-asc">
                                        Title A–Z
                                    </option>

                                    <option value="title-desc">
                                        Title Z–A
                                    </option>

                                </select>

                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                            </div>

                            {/* REFRESH */}

                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    if (!refreshing && !loading) {
                                        void loadAssets(false);
                                    }
                                }}
                                disabled={
                                    refreshing || loading
                                }
                                title="Refresh assets"
                                aria-label="Refresh assets"
                                className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                <RefreshCw
                                    size={18}
                                    className={
                                        refreshing
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                <span className="ml-2 lg:hidden">
                                    Refresh
                                </span>

                            </button>

                        </div>

                        {/* FILTER RESULT */}

                        {(searchQuery ||
                            filterType !==
                            "ALL") && (

                            <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3">

                                <p className="text-xs text-slate-500">

                                    Showing{" "}

                                    <span className="font-semibold text-slate-700">
                                        {
                                            filteredAssets.length
                                        }
                                    </span>

                                    {" "}matching{" "}

                                    {
                                        filteredAssets.length ===
                                        1
                                            ? "asset"
                                            : "assets"
                                    }

                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                                >

                                    Clear filters

                                </button>

                            </div>

                        )}

                    </section>

                )}

                {/* EMPTY */}

                {!message &&
                    assets.length ===
                    0 && (

                        <div className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center shadow-sm">

                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                                <Folder
                                    size={36}
                                    strokeWidth={1.8}
                                />

                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Your workspace is empty
                            </h2>

                            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                                Start building your DataLife workspace by
                                adding documents, certificates, notes,
                                links, credentials, and other important
                                digital assets.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/add-asset"
                                    )
                                }
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                            >

                                <Plus
                                    size={18}
                                />

                                Add Your First Asset

                            </button>

                        </div>

                    )}

                {/* NO SEARCH RESULTS */}

                {!message &&
                    assets.length >
                    0 &&
                    filteredAssets.length ===
                    0 && (

                        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-center shadow-sm">

                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

                                <Search
                                    size={28}
                                />

                            </div>

                            <h2 className="text-xl font-bold text-slate-900">
                                No matching assets
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try a different search term or change
                                the asset type filter.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >

                                Clear filters

                            </button>

                        </div>

                    )}

                {/* COLLECTION */}

                {!message &&
                    filteredAssets.length >
                    0 && (

                        <section>

                            {/* SECTION HEADER */}

                            <div className="mb-5 flex items-end justify-between">

                                <div>

                                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                        Your collection
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Select an asset to view its details.
                                    </p>

                                </div>

                                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200">

                                    {
                                        filteredAssets.length
                                    }{" "}
                                    shown

                                </span>

                            </div>

                            {/* GRID */}

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {filteredAssets.map(
                                    (asset) => {

                                        const styles =
                                            getTypeStyles(
                                                asset.type
                                            );

                                        const fileCount =
                                            getFileCount(
                                                asset
                                            );

                                        // @ts-ignore
                                        return (

                                            <article
                                                key={
                                                    asset.id
                                                }
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Open ${asset.title}`}
                                                onClick={() =>
                                                    navigate(
                                                        `/assets/${asset.id}`
                                                    )
                                                }
                                                onKeyDown={(
                                                    e
                                                ) => {

                                                    if (
                                                        e.key ===
                                                        "Enter" ||
                                                        e.key ===
                                                        " "
                                                    ) {

                                                        e.preventDefault();

                                                        navigate(
                                                            `/assets/${asset.id}`
                                                        );

                                                    }

                                                }}
                                                className="group relative flex min-h-[310px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                                            >

                                                {/* TOP */}

                                                <div className="flex items-start justify-between">

                                                    {/* ICON */}

                                                    <div
                                                        className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition duration-300 group-hover:scale-105 ${styles.icon}`}
                                                    >

                                                        {(() => {
                                                            const Icon =
                                                                getAssetIcon(
                                                                    asset.type
                                                                );

                                                            return (
                                                                <Icon
                                                                    size={
                                                                        22
                                                                    }
                                                                />
                                                            );
                                                        })()}

                                                    </div>

                                                    {/* OPEN ICON */}

                                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">

                                                        <ExternalLink
                                                            size={17}
                                                        />

                                                    </div>

                                                </div>

                                                {/* TYPE */}

                                                <div className="mt-5">

                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${styles.badge}`}
                                                    >

                                                        {formatType(
                                                            asset.type
                                                        )}

                                                    </span>

                                                </div>

                                                {/* TITLE */}

                                                <h3
                                                    className={`mt-4 line-clamp-2 text-[20px] font-bold leading-snug tracking-[-0.35px] text-slate-900 transition duration-200 ${styles.hover}`}
                                                >

                                                    {asset.title ||
                                                        "Untitled Asset"}

                                                </h3>

                                                {/* DESCRIPTION */}

                                                <p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-6 text-slate-500">

                                                    {asset.description ||
                                                        "No description provided."}

                                                </p>

                                                <div className="flex-1" />

                                                {/* FOOTER */}

                                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">

                                                    {/* UPDATED */}

                                                    <div className="flex min-w-0 items-center gap-1.5">

                                                        <span className="text-xs text-slate-400">
                                                            Updated
                                                        </span>

                                                        <span className="truncate text-xs font-semibold text-slate-600">

                                                            {formatRelativeDate(
                                                                asset.updatedAt
                                                            )}

                                                        </span>

                                                    </div>

                                                    {/* FILE COUNT */}

                                                    {fileCount >
                                                        0 && (

                                                            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-500">

                                                                <Files size={13}/>

                                                                {
                                                                    fileCount
                                                                }

                                                                <span className="hidden sm:inline">

                                                                {fileCount ===
                                                                1
                                                                    ? "file"
                                                                    : "files"}

                                                            </span>

                                                            </div>

                                                        )}

                                                </div>

                                                {/* BOTTOM ACCENT */}

                                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 group-hover:w-full" />

                                            </article>

                                        );
                                    }
                                )}

                            </div>

                        </section>

                    )}

            </main>

        </div>
    );
};

export default MyAssets;
