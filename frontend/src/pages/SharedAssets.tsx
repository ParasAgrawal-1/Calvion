import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    FileText,
    FileBadge,
    KeyRound,
    Link as LinkIcon,
    StickyNote,
    Files,
    Search,
    RefreshCw,
    Eye,
    Pencil,
    UserRound,
    ExternalLink,
    Inbox,
    LogOut,
    LayoutDashboard,
    FolderOpen,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    | "SOCIAL_PROFILE"
    | "OTHER";

type AssetPermission =
    | "VIEW"
    | "EDIT";


interface SharedFile {
    id: number;
    originalFileName: string;
    fileType?: string;
    fileSize?: number;
}


interface SharedAsset {
    id: number;
    title: string;
    description?: string;
    type: AssetType;
    content?: string;
    createdAt: string;
    updatedAt: string;
    files: SharedFile[];

    ownerName: string;
    ownerEmail: string;

    permission: AssetPermission;
    sharedAt: string;
}


/* =========================================================
   ASSET ICON
========================================================= */

function getAssetIcon(type: AssetType) {

    switch (type) {

        case "DOCUMENT":
            return FileText;

        case "CERTIFICATE":
            return FileBadge;

        case "NOTE":
            return StickyNote;

        case "LINK":
            return LinkIcon;

        case "CREDENTIAL":
            return KeyRound;

        default:
            return Files;
    }
}


/* =========================================================
   ASSET STYLE
========================================================= */

function getAssetStyle(type: AssetType) {

    switch (type) {

        case "DOCUMENT":
            return {
                icon: "bg-blue-50 text-blue-600",
                badge: "bg-blue-50 text-blue-700",
            };

        case "CERTIFICATE":
            return {
                icon: "bg-amber-50 text-amber-600",
                badge: "bg-amber-50 text-amber-700",
            };

        case "NOTE":
            return {
                icon: "bg-yellow-50 text-yellow-600",
                badge: "bg-yellow-50 text-yellow-700",
            };

        case "LINK":
            return {
                icon: "bg-cyan-50 text-cyan-600",
                badge: "bg-cyan-50 text-cyan-700",
            };

        case "CREDENTIAL":
            return {
                icon: "bg-violet-50 text-violet-600",
                badge: "bg-violet-50 text-violet-700",
            };

        case "SOCIAL_PROFILE":
            return {
                icon: "bg-pink-50 text-pink-600",
                badge: "bg-pink-50 text-pink-700",
            };

        default:
            return {
                icon: "bg-slate-100 text-slate-600",
                badge: "bg-slate-100 text-slate-700",
            };
    }
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date?: string) {

    if (!date) {
        return "Unknown";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Unknown";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name?: string) {

    if (!name) {
        return "U";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            (part) =>
                part.charAt(0).toUpperCase()
        )
        .join("");
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(error: unknown) {

    if (axios.isAxiosError(error)) {

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


        if (error.response?.status === 401) {

            return "Your session has expired. Please login again.";
        }


        if (error.response?.status === 403) {

            return "You do not have permission to access this resource.";
        }


        if (error.response?.status === 404) {

            return "Shared assets endpoint was not found.";
        }


        if (
            error.response?.status &&
            error.response.status >= 500
        ) {

            return "Server error while loading shared assets.";
        }
    }


    if (error instanceof Error) {

        return error.message;
    }


    return "Something went wrong while loading shared assets.";
}


/* =========================================================
   COMPONENT
========================================================= */

export default function SharedAssets() {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [assets, setAssets] =
        useState<SharedAsset[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [refreshing, setRefreshing] =
        useState(false);


    const [search, setSearch] =
        useState("");


    const [typeFilter, setTypeFilter] =
        useState<
            "ALL" | AssetType
        >("ALL");


    const [permissionFilter, setPermissionFilter] =
        useState<
            "ALL" | AssetPermission
        >("ALL");


    const [error, setError] =
        useState("");


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
       FETCH SHARED ASSETS
    ===================================================== */

    const fetchSharedAssets = async (
        isRefresh = false
    ) => {

        try {

            setError("");


            if (isRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);
            }


            const token =
                localStorage.getItem("token");


            console.log(
                "========================================"
            );

            console.log(
                "SHARED ASSETS REQUEST"
            );

            console.log(
                "Token exists:",
                Boolean(token)
            );


            /* ---------------------------------------------
               CHECK LOGIN
            --------------------------------------------- */

            if (!token) {

                console.warn(
                    "No authentication token found."
                );

                navigate("/login");

                return;
            }


            /* ---------------------------------------------
               API REQUEST

               Your api.ts should automatically attach:
               Authorization: Bearer <token>
            --------------------------------------------- */

            const response =
                await api.get<SharedAsset[]>(
                    "/assets/shared"
                );


            console.log(
                "Shared Assets API Status:",
                response.status
            );


            console.log(
                "Shared Assets API Response:",
                response.data
            );


            console.log(
                "Shared Assets Count:",
                Array.isArray(response.data)
                    ? response.data.length
                    : "NOT AN ARRAY"
            );


            /* ---------------------------------------------
               STORE RESPONSE
            --------------------------------------------- */

            if (
                Array.isArray(response.data)
            ) {

                setAssets(
                    response.data
                );

            } else {

                console.error(
                    "Expected array but received:",
                    response.data
                );

                setAssets([]);
            }


            console.log(
                "========================================"
            );

        } catch (err) {

            console.error(
                "FAILED TO LOAD SHARED ASSETS:",
                err
            );


            if (
                axios.isAxiosError(err)
            ) {

                console.error(
                    "HTTP STATUS:",
                    err.response?.status
                );


                console.error(
                    "SERVER RESPONSE:",
                    err.response?.data
                );


                /* -----------------------------------------
                   SESSION EXPIRED
                ----------------------------------------- */

                if (
                    err.response?.status === 401
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


            setError(
                getErrorMessage(err)
            );

        } finally {

            setLoading(false);

            setRefreshing(false);
        }
    };


    /* =====================================================
       LOAD PAGE
    ===================================================== */

    useEffect(() => {

        fetchSharedAssets();

    }, []);


    /* =====================================================
       FILTER ASSETS
    ===================================================== */

    const filteredAssets =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            return assets.filter(
                (asset) => {

                    const matchesSearch =
                        !keyword ||
                        asset.title
                            ?.toLowerCase()
                            .includes(keyword) ||
                        asset.description
                            ?.toLowerCase()
                            .includes(keyword) ||
                        asset.ownerName
                            ?.toLowerCase()
                            .includes(keyword) ||
                        asset.ownerEmail
                            ?.toLowerCase()
                            .includes(keyword);


                    const matchesType =
                        typeFilter === "ALL" ||
                        asset.type === typeFilter;


                    const matchesPermission =
                        permissionFilter === "ALL" ||
                        asset.permission ===
                        permissionFilter;


                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesPermission
                    );
                }
            );

        }, [
            assets,
            search,
            typeFilter,
            permissionFilter,
        ]);


    /* =====================================================
       VIEW ASSET
    ===================================================== */

    const viewAsset = (
        id: number
    ) => {

        navigate(
            `/assets/${id}`
        );
    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

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
    };


    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalShared =
        assets.length;


    const viewCount =
        assets.filter(
            (asset) =>
                asset.permission ===
                "VIEW"
        ).length;


    const editCount =
        assets.filter(
            (asset) =>
                asset.permission ===
                "EDIT"
        ).length;


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {

        setSearch("");

        setTypeFilter("ALL");

        setPermissionFilter("ALL");
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


                    {/* ================= LEFT LOGO ================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                        className="group flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">

                            <Files size={20} />

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


                    {/* ================= RIGHT NAV ================= */}

                    <div className="flex items-center gap-2 sm:gap-3">


                        {/* NAVIGATION */}

                        <div className="hidden items-center gap-1 md:flex">


                            {/* DASHBOARD */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/dashboard"
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >

                                <LayoutDashboard
                                    size={16}
                                />

                                Dashboard

                            </button>


                            {/* MY ASSETS */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/assets"
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >

                                <FolderOpen
                                    size={16}
                                />

                                My Assets

                            </button>


                            {/* SHARED */}

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700"
                            >

                                <UserRound
                                    size={16}
                                />

                                Shared With Me

                            </button>

                        </div>


                        {/* USER */}

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


                        {/* LOGOUT */}

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

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >

                    <ArrowLeft
                        size={16}
                    />

                    Back to Dashboard

                </button>


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">


                    <div>

                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">

                            <UserRound
                                size={13}
                            />

                            Shared Workspace

                        </div>


                        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                            Shared With Me
                        </h1>


                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">

                            Assets that other DataLife users have shared with you.

                        </p>

                    </div>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={() =>
                            fetchSharedAssets(
                                true
                            )
                        }
                        disabled={
                            refreshing ||
                            loading
                        }
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <RefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}

                    </button>

                </div>


                {/* =================================================
                    STAT CARDS
                ================================================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">


                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">

                                <Inbox
                                    size={20}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Total
                            </span>

                        </div>


                        <p className="text-2xl font-bold text-slate-950">
                            {totalShared}
                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Shared assets
                        </p>

                    </div>


                    {/* VIEW */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <Eye
                                    size={20}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Access
                            </span>

                        </div>


                        <p className="text-2xl font-bold text-slate-950">
                            {viewCount}
                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            View permission
                        </p>

                    </div>


                    {/* EDIT */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">

                                <Pencil
                                    size={20}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Access
                            </span>

                        </div>


                        <p className="text-2xl font-bold text-slate-950">
                            {editCount}
                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Edit permission
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SEARCH + FILTERS
                ================================================= */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-3 lg:flex-row">


                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />


                            <input
                                type="text"
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by title, description, or owner..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                            />

                        </div>


                        {/* TYPE */}

                        <div className="relative">

                            <select
                                value={
                                    typeFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTypeFilter(
                                        event
                                            .target
                                            .value as
                                            | "ALL"
                                            | AssetType
                                    )
                                }
                                className="h-11 min-w-44 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
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

                                <option value="SOCIAL_PROFILE">
                                    Social Profiles
                                </option>

                                <option value="OTHER">
                                    Other
                                </option>

                            </select>


                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                        </div>


                        {/* PERMISSION */}

                        <div className="relative">

                            <select
                                value={
                                    permissionFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setPermissionFilter(
                                        event
                                            .target
                                            .value as
                                            | "ALL"
                                            | AssetPermission
                                    )
                                }
                                className="h-11 min-w-40 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                            >

                                <option value="ALL">
                                    All Permissions
                                </option>

                                <option value="VIEW">
                                    View Only
                                </option>

                                <option value="EDIT">
                                    Can Edit
                                </option>

                            </select>


                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RESULTS COUNT
                ================================================= */}

                {!loading &&
                    !error && (

                        <div className="mb-4 flex items-center justify-between">

                            <p className="text-sm font-medium text-slate-500">

                                {filteredAssets.length}{" "}

                                {filteredAssets.length === 1
                                    ? "asset"
                                    : "assets"}{" "}

                                found

                            </p>


                            {(search ||
                                typeFilter !==
                                "ALL" ||
                                permissionFilter !==
                                "ALL") && (

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                                >
                                    Clear filters
                                </button>

                            )}

                        </div>
                    )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                        <div className="flex items-start gap-4">


                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

                                <Inbox
                                    size={20}
                                />

                            </div>


                            <div className="flex-1">

                                <h3 className="font-semibold text-red-900">
                                    Unable to load shared assets
                                </h3>


                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchSharedAssets()
                                    }
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                                >

                                    <RefreshCw
                                        size={15}
                                    />

                                    Try Again

                                </button>

                            </div>

                        </div>

                    </div>
                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading &&
                    !error && (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (

                                    <div
                                        key={
                                            index
                                        }
                                        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >

                                        <div className="mb-5 flex justify-between">

                                            <div className="h-11 w-11 rounded-xl bg-slate-200" />

                                            <div className="h-6 w-16 rounded-full bg-slate-200" />

                                        </div>


                                        <div className="h-5 w-3/4 rounded bg-slate-200" />


                                        <div className="mt-3 h-4 w-full rounded bg-slate-100" />


                                        <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />


                                        <div className="mt-6 h-px bg-slate-100" />


                                        <div className="mt-4 h-10 rounded-xl bg-slate-100" />

                                    </div>

                                )
                            )}

                        </div>
                    )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    assets.length === 0 && (

                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">


                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">

                                <Inbox
                                    size={30}
                                />

                            </div>


                            <h2 className="mt-6 text-xl font-bold text-slate-950">
                                Nothing shared with you yet
                            </h2>


                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                                When another DataLife user shares an asset with you,
                                it will appear here.

                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/assets"
                                    )
                                }
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >

                                <FolderOpen
                                    size={16}
                                />

                                View My Assets

                            </button>

                        </div>
                    )}


                {/* =================================================
                    NO SEARCH RESULTS
                ================================================= */}

                {!loading &&
                    !error &&
                    assets.length > 0 &&
                    filteredAssets.length === 0 && (

                        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">


                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

                                <Search
                                    size={26}
                                />

                            </div>


                            <h2 className="mt-5 text-lg font-bold text-slate-950">
                                No matching assets
                            </h2>


                            <p className="mt-2 text-sm text-slate-500">
                                Try changing your search or filters.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="mt-5 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                            >
                                Clear filters
                            </button>

                        </div>
                    )}


                {/* =================================================
                    ASSET GRID
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredAssets.length > 0 && (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {filteredAssets.map(
                                (asset) => {

                                    const Icon =
                                        getAssetIcon(
                                            asset.type
                                        );


                                    const style =
                                        getAssetStyle(
                                            asset.type
                                        );


                                    const permissionIsEdit =
                                        asset.permission ===
                                        "EDIT";


                                    return (

                                        <article
                                            key={
                                                asset.id
                                            }
                                            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/50"
                                        >


                                            {/* ================= CARD TOP ================= */}

                                            <div className="p-5">


                                                {/* ICON + TYPE */}

                                                <div className="mb-5 flex items-start justify-between gap-3">


                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.icon}`}
                                                    >

                                                        <Icon
                                                            size={
                                                                21
                                                            }
                                                        />

                                                    </div>


                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}
                                                    >

                                                        {asset.type}

                                                    </span>

                                                </div>


                                                {/* TITLE */}

                                                <h2 className="line-clamp-1 text-lg font-bold text-slate-950">

                                                    {asset.title ||
                                                        "Untitled Asset"}

                                                </h2>


                                                {/* DESCRIPTION */}

                                                <p className="mt-2 min-h-10 line-clamp-2 text-sm leading-5 text-slate-500">

                                                    {asset.description ||
                                                        "No description provided."}

                                                </p>


                                                {/* OWNER */}

                                                <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">


                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">

                                                        {getInitials(
                                                            asset.ownerName
                                                        )}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate text-sm font-semibold text-slate-800">

                                                            {asset.ownerName ||
                                                                "Unknown owner"}

                                                        </p>


                                                        <p className="truncate text-xs text-slate-500">

                                                            {asset.ownerEmail ||
                                                                "Unknown email"}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <div className="mt-4 space-y-2.5">


                                                    {/* SHARED DATE + PERMISSION */}

                                                    <div className="flex items-center justify-between gap-3 text-xs">


                                                        <div className="flex min-w-0 items-center gap-2 text-slate-500">

                                                            <CalendarDays
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            <span className="truncate">

                                                                Shared{" "}

                                                                {formatDate(
                                                                    asset.sharedAt
                                                                )}

                                                            </span>

                                                        </div>


                                                        {/* PERMISSION */}

                                                        <span
                                                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-semibold ${
                                                                permissionIsEdit
                                                                    ? "bg-violet-50 text-violet-700"
                                                                    : "bg-blue-50 text-blue-700"
                                                            }`}
                                                        >

                                                            {permissionIsEdit ? (
                                                                <Pencil
                                                                    size={
                                                                        12
                                                                    }
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={
                                                                        12
                                                                    }
                                                                />
                                                            )}


                                                            {permissionIsEdit
                                                                ? "Can Edit"
                                                                : "View Only"}

                                                        </span>

                                                    </div>


                                                    {/* FILE COUNT */}

                                                    <div className="flex items-center gap-2 text-xs text-slate-500">

                                                        <Files
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {asset.files?.length ||
                                                            0}{" "}

                                                        {asset.files?.length ===
                                                        1
                                                            ? "file"
                                                            : "files"}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ================= CARD ACTION ================= */}

                                            <div className="mt-auto border-t border-slate-100 bg-slate-50/70 p-4">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        viewAsset(
                                                            asset.id
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                                                >

                                                    <ExternalLink
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    Open Asset

                                                </button>

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>
                    )}

            </main>

        </div>
    );
}