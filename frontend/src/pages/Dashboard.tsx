import { useEffect, useMemo, useState } from "react";

import {
    LayoutDashboard,
    Folder,
    LogOut,
    Plus,
    FileText,
    KeyRound,
    Award,
    Link as LinkIcon,
    User,
    StickyNote,
    ArrowRight,
    Clock3,
    Users,
    Files,
    RefreshCw,
    Search,
    Eye,
    AlertCircle,
    Bell,
    CheckCheck,
    X,
    ChevronDown,
    Settings,
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


interface Notification {
    id: number;
    title: string;
    message: string;
    assetId?: number | null;
    assetTitle?: string | null;
    read: boolean;
    createdAt: string;
}


/* =========================================================
   ASSET ICON
========================================================= */

function getAssetIcon(type: AssetType) {

    switch (type) {

        case "DOCUMENT":
            return FileText;

        case "CERTIFICATE":
            return Award;

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
                icon:
                    "bg-blue-50 text-blue-600",

                badge:
                    "bg-blue-50 text-blue-700",
            };


        case "CERTIFICATE":

            return {
                icon:
                    "bg-amber-50 text-amber-600",

                badge:
                    "bg-amber-50 text-amber-700",
            };


        case "NOTE":

            return {
                icon:
                    "bg-yellow-50 text-yellow-600",

                badge:
                    "bg-yellow-50 text-yellow-700",
            };


        case "LINK":

            return {
                icon:
                    "bg-cyan-50 text-cyan-600",

                badge:
                    "bg-cyan-50 text-cyan-700",
            };


        case "CREDENTIAL":

            return {
                icon:
                    "bg-violet-50 text-violet-600",

                badge:
                    "bg-violet-50 text-violet-700",
            };


        case "SOCIAL_PROFILE":

            return {
                icon:
                    "bg-pink-50 text-pink-600",

                badge:
                    "bg-pink-50 text-pink-700",
            };


        default:

            return {
                icon:
                    "bg-slate-100 text-slate-600",

                badge:
                    "bg-slate-100 text-slate-700",
            };
    }
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date?: string) {

    if (!date) {
        return "Unknown";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
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
   RELATIVE DATE
========================================================= */

function formatNotificationDate(
    date?: string
) {

    if (!date) {
        return "Unknown";
    }


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "Unknown";
    }


    const now =
        new Date();


    const diff =
        now.getTime() -
        parsed.getTime();


    const minute =
        60 * 1000;

    const hour =
        60 * minute;

    const day =
        24 * hour;


    if (diff < minute) {

        return "Just now";
    }


    if (diff < hour) {

        const minutes =
            Math.floor(
                diff / minute
            );

        return `${minutes}m ago`;
    }


    if (diff < day) {

        const hours =
            Math.floor(
                diff / hour
            );

        return `${hours}h ago`;
    }


    if (diff < 7 * day) {

        const days =
            Math.floor(
                diff / day
            );

        return `${days}d ago`;
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

function getInitials(
    name?: string
) {

    if (!name) {
        return "U";
    }


    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            (part) =>
                part
                    .charAt(0)
                    .toUpperCase()
        )
        .join("");
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(
    error: unknown
) {

    if (
        axios.isAxiosError(error)
    ) {

        const status =
            error.response?.status;

        const data =
            error.response?.data;


        if (
            typeof data ===
            "string"
        ) {

            return data;
        }


        if (
            data &&
            typeof data ===
            "object" &&
            "message" in data &&
            typeof data.message ===
            "string"
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

            return "Assets service was not found. Please check the backend.";
        }


        if (
            status &&
            status >= 500
        ) {

            return "Server error. Please try again later.";
        }
    }


    if (
        error instanceof Error
    ) {

        return error.message;
    }


    return "Unable to load dashboard.";
}


/* =========================================================
   COMPONENT
========================================================= */

export default function Dashboard() {

    const navigate =
        useNavigate();


    /* =====================================================
       ASSETS
    ===================================================== */

    const [assets, setAssets] =
        useState<Asset[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [refreshing, setRefreshing] =
        useState(false);


    const [error, setError] =
        useState("");


    const [search, setSearch] =
        useState("");


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const [
        notifications,
        setNotifications,
    ] =
        useState<Notification[]>([]);


    const [
        unreadCount,
        setUnreadCount,
    ] =
        useState(0);


    const [
        showNotifications,
        setShowNotifications,
    ] =
        useState(false);


    const [
        notificationLoading,
        setNotificationLoading,
    ] =
        useState(false);


    /* =====================================================
       PROFILE MENU
    ===================================================== */

    const [
        showProfileMenu,
        setShowProfileMenu,
    ] =
        useState(false);


    /* =====================================================
       USER
    ===================================================== */

    const userName =
        localStorage.getItem(
            "name"
        ) ||
        localStorage
            .getItem("email")
            ?.split("@")[0] ||
        "User";


    const userEmail =
        localStorage.getItem(
            "email"
        ) || "";


    /* =====================================================
       FETCH ASSETS
    ===================================================== */

    const fetchAssets = async (
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
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                navigate(
                    "/login"
                );

                return;
            }


            const response =
                await api.get<
                    Asset[] |
                    AssetsResponse
                >(
                    "/assets",
                    {
                        params: {
                            page: 0,
                            size: 20,
                            sortBy:
                                "updatedAt",
                            direction:
                                "desc",
                        },
                    }
                );


            let receivedAssets:
                Asset[] = [];


            if (
                Array.isArray(
                    response.data
                )
            ) {

                receivedAssets =
                    response.data;

            } else if (
                response.data &&
                Array.isArray(
                    response.data.content
                )
            ) {

                receivedAssets =
                    response.data.content;
            }


            setAssets(
                receivedAssets
            );


        } catch (
            err: unknown
            ) {

            console.error(
                "Failed to load dashboard:",
                err
            );


            if (
                axios.isAxiosError(err) &&
                err.response?.status ===
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


                navigate(
                    "/login"
                );

                return;
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
       FETCH NOTIFICATIONS
    ===================================================== */

    const fetchNotifications =
        async () => {

            try {

                setNotificationLoading(
                    true
                );


                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {
                    return;
                }


                const response =
                    await api.get<
                        Notification[]
                    >(
                        "/notifications"
                    );


                setNotifications(
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : []
                );


            } catch (error) {

                console.error(
                    "Failed to load notifications:",
                    error
                );


            } finally {

                setNotificationLoading(
                    false
                );
            }
        };


    /* =====================================================
       FETCH UNREAD COUNT
    ===================================================== */

    const fetchUnreadCount =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {
                    return;
                }


                const response =
                    await api.get<number>(
                        "/notifications/unread-count"
                    );


                setUnreadCount(
                    Number(
                        response.data
                    ) || 0
                );


            } catch (error) {

                console.error(
                    "Failed to load unread notification count:",
                    error
                );
            }
        };


    /* =====================================================
       MARK NOTIFICATION READ
    ===================================================== */

    const markNotificationAsRead =
        async (
            notification: Notification
        ) => {

            try {

                if (
                    !notification.read
                ) {

                    await api.put(
                        `/notifications/${notification.id}/read`
                    );


                    setNotifications(
                        (previous) =>
                            previous.map(
                                (item) =>
                                    item.id ===
                                    notification.id
                                        ? {
                                            ...item,
                                            read: true,
                                        }
                                        : item
                            )
                    );


                    setUnreadCount(
                        (previous) =>
                            Math.max(
                                0,
                                previous - 1
                            )
                    );
                }


                if (
                    notification.assetId
                ) {

                    setShowNotifications(
                        false
                    );


                    navigate(
                        `/assets/${notification.assetId}`
                    );
                }


            } catch (error) {

                console.error(
                    "Failed to mark notification as read:",
                    error
                );
            }
        };


    /* =====================================================
       MARK ALL NOTIFICATIONS READ
    ===================================================== */

    const markAllNotificationsAsRead =
        async () => {

            try {

                await api.put(
                    "/notifications/read-all"
                );


                setNotifications(
                    (previous) =>
                        previous.map(
                            (notification) => ({
                                ...notification,
                                read: true,
                            })
                        )
                );


                setUnreadCount(0);


            } catch (error) {

                console.error(
                    "Failed to mark all notifications as read:",
                    error
                );
            }
        };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        fetchAssets();

        fetchNotifications();

        fetchUnreadCount();

    }, []);

    /* =====================================================
   OPEN NOTIFICATION CENTER FROM SETTINGS
===================================================== */

    useEffect(() => {

        const shouldOpen =
            localStorage.getItem(
                "openNotificationCenter"
            );


        if (
            shouldOpen === "true"
        ) {

            /*
             * Remove the flag immediately.
             *
             * Otherwise the notification panel
             * could open again unnecessarily.
             */

            localStorage.removeItem(
                "openNotificationCenter"
            );


            /*
             * Open notification dropdown.
             */

            setShowNotifications(
                true
            );


            /*
             * Refresh notification data.
             */

            fetchNotifications();

            fetchUnreadCount();
        }

    }, []);
    /* =====================================================
       NOTIFICATION REFRESH
    ===================================================== */

    useEffect(() => {

        const interval =
            window.setInterval(
                () => {

                    fetchUnreadCount();


                    if (
                        showNotifications
                    ) {

                        fetchNotifications();
                    }

                },
                30000
            );


        return () => {

            window.clearInterval(
                interval
            );
        };

    }, [
        showNotifications,
    ]);


    /* =====================================================
       OPEN NOTIFICATION PANEL
    ===================================================== */

    useEffect(() => {

        if (
            showNotifications
        ) {

            fetchNotifications();

            fetchUnreadCount();
        }

    }, [
        showNotifications,
    ]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredAssets =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                return assets;
            }


            return assets.filter(
                (asset) =>

                    asset.title
                        ?.toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    asset.description
                        ?.toLowerCase()
                        .includes(
                            keyword
                        ) ||

                    asset.type
                        ?.toLowerCase()
                        .includes(
                            keyword
                        )
            );

        }, [
            assets,
            search,
        ]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalAssets =
        assets.length;


    const documentCount =
        assets.filter(
            (asset) =>
                asset.type ===
                "DOCUMENT"
        ).length;


    const certificateCount =
        assets.filter(
            (asset) =>
                asset.type ===
                "CERTIFICATE"
        ).length;


    const noteCount =
        assets.filter(
            (asset) =>
                asset.type ===
                "NOTE"
        ).length;


    /* =====================================================
       RECENT ASSETS
    ===================================================== */

    const recentAssets =
        filteredAssets.slice(
            0,
            3
        );


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        setShowProfileMenu(false);


        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "email"
        );

        localStorage.removeItem(
            "name"
        );


        navigate(
            "/login"
        );
    };


    /* =====================================================
       GO TO SETTINGS
    ===================================================== */

    const handleSettings = () => {

        setShowProfileMenu(false);

        navigate(
            "/settings"
        );
    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/"
                            )
                        }
                        className="group flex shrink-0 items-center gap-3"
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
                        RIGHT SIDE
                    ================================================= */}

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">


                        {/* =================================================
                            NAVIGATION
                        ================================================= */}

                        <div className="hidden items-center gap-1 md:flex">


                            {/* DASHBOARD */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/dashboard"
                                    )
                                }
                                className="flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700"
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

                                <Folder
                                    size={16}
                                />

                                My Assets

                            </button>


                            {/* SHARED WITH ME */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/shared-assets"
                                    )
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
                            NOTIFICATIONS
                        ================================================= */}

                        <div className="relative shrink-0">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNotifications(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                title="Notifications"
                                aria-label="Notifications"
                                className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                                    showNotifications
                                        ? "border-cyan-200 bg-cyan-50 text-cyan-600 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                                }`}
                            >

                                <Bell
                                    size={20}
                                    strokeWidth={2}
                                />


                                {unreadCount >
                                    0 && (

                                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">

                                        {unreadCount >
                                        9
                                            ? "9+"
                                            : unreadCount}

                                    </span>

                                    )}

                            </button>


                            {/* =================================================
                                NOTIFICATION DROPDOWN
                            ================================================= */}

                            {showNotifications && (

                                <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">


                                    {/* HEADER */}

                                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">

                                                    <Bell
                                                        size={16}
                                                    />

                                                </div>


                                                <h3 className="text-sm font-bold text-slate-900">
                                                    Notifications
                                                </h3>

                                            </div>


                                            <p className="mt-1 pl-10 text-[11px] text-slate-400">

                                                {unreadCount >
                                                0
                                                    ? `${unreadCount} unread notification${
                                                        unreadCount >
                                                        1
                                                            ? "s"
                                                            : ""
                                                    }`
                                                    : "You're all caught up"}

                                            </p>

                                        </div>


                                        <div className="flex items-center gap-1">

                                            {unreadCount >
                                                0 && (

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            markAllNotificationsAsRead
                                                        }
                                                        title="Mark all as read"
                                                        className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-cyan-600 transition hover:bg-cyan-50"
                                                    >

                                                        <CheckCheck
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        <span className="hidden sm:block">
                                                        Mark all
                                                    </span>

                                                    </button>

                                                )}


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNotifications(
                                                        false
                                                    )
                                                }
                                                title="Close"
                                                aria-label="Close notifications"
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                            >

                                                <X
                                                    size={
                                                        16
                                                    }
                                                />

                                            </button>

                                        </div>

                                    </div>


                                    {/* CONTENT */}

                                    <div className="max-h-[420px] overflow-y-auto">

                                        {notificationLoading ? (

                                            <div className="space-y-3 p-4">

                                                {[1, 2, 3].map(
                                                    (
                                                        item
                                                    ) => (

                                                        <div
                                                            key={
                                                                item
                                                            }
                                                            className="flex animate-pulse gap-3"
                                                        >

                                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />

                                                            <div className="flex-1">

                                                                <div className="h-3.5 w-3/4 rounded bg-slate-200" />

                                                                <div className="mt-2 h-3 w-full rounded bg-slate-100" />

                                                                <div className="mt-2 h-2.5 w-1/3 rounded bg-slate-100" />

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        ) : notifications.length ===
                                        0 ? (

                                            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">

                                                    <Bell
                                                        size={
                                                            25
                                                        }
                                                    />

                                                </div>


                                                <h4 className="mt-4 text-sm font-bold text-slate-900">
                                                    No notifications
                                                </h4>


                                                <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400">
                                                    New asset sharing and permission activity will appear here.
                                                </p>

                                            </div>

                                        ) : (

                                            <div className="divide-y divide-slate-100">

                                                {notifications.map(
                                                    (
                                                        notification
                                                    ) => (

                                                        <button
                                                            key={
                                                                notification.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                markNotificationAsRead(
                                                                    notification
                                                                )
                                                            }
                                                            className={`flex w-full gap-3 px-4 py-4 text-left transition hover:bg-slate-50 ${
                                                                notification.read
                                                                    ? "bg-white"
                                                                    : "bg-cyan-50/50"
                                                            }`}
                                                        >

                                                            <div
                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                                    notification.read
                                                                        ? "bg-slate-100 text-slate-400"
                                                                        : "bg-cyan-100 text-cyan-600"
                                                                }`}
                                                            >

                                                                <Bell
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                            </div>


                                                            <div className="min-w-0 flex-1">

                                                                <div className="flex items-start justify-between gap-2">

                                                                    <p className="text-xs font-bold text-slate-900">

                                                                        {
                                                                            notification.title
                                                                        }

                                                                    </p>


                                                                    {!notification.read && (

                                                                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />

                                                                    )}

                                                                </div>


                                                                <p className="mt-1 text-[11px] leading-5 text-slate-500">

                                                                    {
                                                                        notification.message
                                                                    }

                                                                </p>


                                                                <p className="mt-2 text-[10px] font-medium text-slate-400">

                                                                    {formatNotificationDate(
                                                                        notification.createdAt
                                                                    )}

                                                                </p>

                                                            </div>

                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            PROFILE DROPDOWN
                        ================================================= */}

                        <div className="relative">

                            <button
                                type="button"
                                onClick={() => {

                                    setShowProfileMenu(
                                        (previous) =>
                                            !previous
                                    );

                                    setShowNotifications(
                                        false
                                    );
                                }}
                                aria-haspopup="menu"
                                aria-expanded={
                                    showProfileMenu
                                }
                                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                                    showProfileMenu
                                        ? "bg-slate-100"
                                        : "hover:bg-slate-50"
                                }`}
                            >

                                {/* AVATAR */}

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">

                                    {getInitials(
                                        userName
                                    )}

                                </div>


                                {/* NAME */}

                                <div className="hidden max-w-32 text-left sm:block">

                                    <p className="truncate text-sm font-semibold text-slate-700">

                                        {userName}

                                    </p>

                                </div>


                                <ChevronDown
                                    size={15}
                                    className={`hidden text-slate-400 transition-transform sm:block ${
                                        showProfileMenu
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />

                            </button>


                            {/* =================================================
                                PROFILE MENU
                            ================================================= */}

                            {showProfileMenu && (

                                <div
                                    className="absolute right-0 top-[calc(100%+10px)] z-[110] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
                                    role="menu"
                                >

                                    {/* PROFILE INFO */}

                                    <div className="border-b border-slate-100 px-4 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">

                                                {getInitials(
                                                    userName
                                                )}

                                            </div>


                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-bold text-slate-900">

                                                    {userName}

                                                </p>


                                                <p className="truncate text-xs text-slate-400">

                                                    {userEmail}

                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* MENU */}

                                    <div className="p-2">


                                        {/* SETTINGS */}

                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={
                                                handleSettings
                                            }
                                            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cyan-50"
                                        >

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-cyan-100 group-hover:text-cyan-600">

                                                <Settings
                                                    size={
                                                        18
                                                    }
                                                />

                                            </div>


                                            <div className="min-w-0 flex-1">

                                                <p className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700">
                                                    Settings
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                    Account and preferences
                                                </p>

                                            </div>


                                            <ArrowRight
                                                size={
                                                    15
                                                }
                                                className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-cyan-600"
                                            />

                                        </button>


                                        {/* LOGOUT */}

                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={
                                                handleLogout
                                            }
                                            className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                                        >

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition group-hover:bg-red-100">

                                                <LogOut
                                                    size={
                                                        18
                                                    }
                                                />

                                            </div>


                                            <div className="min-w-0 flex-1">

                                                <p className="text-sm font-semibold text-red-600">
                                                    Logout
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-red-400">
                                                    Sign out of your account
                                                </p>

                                            </div>


                                            <ArrowRight
                                                size={
                                                    15
                                                }
                                                className="text-red-200 transition group-hover:translate-x-0.5 group-hover:text-red-500"
                                            />

                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <div className="relative mb-8 overflow-hidden rounded-3xl border border-blue-100/80 bg-gradient-to-br from-white via-cyan-50/70 to-blue-100/80 px-6 py-8 shadow-[0_12px_35px_rgba(37,99,235,0.10)] sm:px-8">

                    {/* DECORATIVE BACKGROUND */}

                    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-cyan-200/25 blur-3xl" />


                    {/* CONTENT */}

                    <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">


                        {/* LEFT */}

                        <div>

                            {/* BADGE */}

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">

                                <User
                                    size={14}
                                    className="text-cyan-600"
                                />

                                Personal Workspace

                            </div>


                            {/* HEADING */}

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">

                                Welcome back,{" "}

                                <span className="text-blue-700">

                                    {userName}

                                </span>

                            </h1>


                            {/* DESCRIPTION */}

                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">

                                Manage your important digital assets securely from one place.

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
                            className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                        >

                            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />


                            <Plus
                                size={18}
                                className="relative z-10"
                            />


                            <span className="relative z-10">
                                Add Asset
                            </span>

                        </button>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-4">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">

                                <AlertCircle
                                    size={20}
                                />

                            </div>


                            <div className="flex-1">

                                <h3 className="font-semibold text-red-900">
                                    Unable to load dashboard
                                </h3>


                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        fetchAssets()
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
                    STATS
                ================================================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">


                    {/* TOTAL */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">

                                <Files
                                    size={21}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Total
                            </span>

                        </div>


                        <p className="mt-5 text-3xl font-bold text-slate-950">

                            {loading
                                ? "—"
                                : totalAssets}

                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Digital assets
                        </p>

                    </div>


                    {/* DOCUMENTS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                <FileText
                                    size={21}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Type
                            </span>

                        </div>


                        <p className="mt-5 text-3xl font-bold text-slate-950">

                            {loading
                                ? "—"
                                : documentCount}

                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Documents
                        </p>

                    </div>


                    {/* CERTIFICATES */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                <Award
                                    size={21}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Type
                            </span>

                        </div>


                        <p className="mt-5 text-3xl font-bold text-slate-950">

                            {loading
                                ? "—"
                                : certificateCount}

                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Certificates
                        </p>

                    </div>


                    {/* NOTES */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">

                                <StickyNote
                                    size={21}
                                />

                            </div>


                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Type
                            </span>

                        </div>


                        <p className="mt-5 text-3xl font-bold text-slate-950">

                            {loading
                                ? "—"
                                : noteCount}

                        </p>


                        <p className="mt-1 text-sm text-slate-500">
                            Notes
                        </p>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS + RECENT ASSETS
                ================================================= */}

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-1">

                        {/* HEADER */}

                        <div className="border-b border-slate-100 px-5 py-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-600">

                                    <Plus
                                        size={19}
                                        strokeWidth={2.2}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-lg font-bold tracking-tight text-slate-950">
                                        Quick Actions
                                    </h2>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Manage your workspace
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="space-y-3 p-5">


                            {/* ADD NEW ASSET */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/add-asset"
                                    )
                                }
                                className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/40 hover:shadow-sm"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-100">

                                    <Plus
                                        size={20}
                                    />

                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold text-slate-900">
                                        Add New Asset
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        Store a new digital asset
                                    </p>

                                </div>


                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-600"
                                />

                            </button>


                            {/* MY ASSETS */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/assets"
                                    )
                                }
                                className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100">

                                    <Folder
                                        size={20}
                                    />

                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold text-slate-900">
                                        My Assets
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        Browse all your assets
                                    </p>

                                </div>


                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
                                />

                            </button>


                            {/* SHARED WITH ME */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/shared-assets"
                                    )
                                }
                                className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/40 hover:shadow-sm"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100">

                                    <Users
                                        size={20}
                                    />

                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="text-sm font-semibold text-slate-900">
                                        Shared With Me
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        View assets shared with you
                                    </p>

                                </div>


                                <ArrowRight
                                    size={16}
                                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600"
                                />

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        RECENT ASSETS
                    ================================================= */}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

                        {/* HEADER */}

                        <div className="border-b border-slate-100 px-5 py-5">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 text-blue-600">

                                        <Clock3
                                            size={19}
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-bold tracking-tight text-slate-950">
                                            Recent Assets
                                        </h2>


                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Your recently updated digital assets
                                        </p>

                                    </div>

                                </div>


                                <div className="flex items-center gap-2">


                                    {/* SEARCH */}

                                    <div className="relative">

                                        <Search
                                            size={16}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />


                                        <input
                                            type="text"
                                            value={
                                                search
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setSearch(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Search..."
                                            aria-label="Search recent assets"
                                            className="h-10 w-40 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:w-48"
                                        />

                                    </div>


                                    {/* REFRESH */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fetchAssets(
                                                true
                                            )
                                        }
                                        disabled={
                                            loading ||
                                            refreshing
                                        }
                                        title="Refresh assets"
                                        aria-label="Refresh assets"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <RefreshCw
                                            size={16}
                                            className={
                                                refreshing
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />

                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* CONTENT */}

                        <div className="p-4 sm:p-5">


                            {/* LOADING */}

                            {loading && (

                                <div className="space-y-3">

                                    {Array.from({
                                        length: 4,
                                    }).map(
                                        (
                                            _,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    index
                                                }
                                                className="flex animate-pulse items-center gap-3 rounded-xl border border-slate-100 p-3.5"
                                            >

                                                <div className="h-11 w-11 rounded-xl bg-slate-200" />


                                                <div className="flex-1">

                                                    <div className="h-4 w-2/5 rounded bg-slate-200" />

                                                    <div className="mt-2 h-3 w-1/4 rounded bg-slate-100" />

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                            {/* EMPTY */}

                            {!loading &&
                                !error &&
                                recentAssets.length ===
                                0 && (

                                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 text-slate-400">

                                            <Files
                                                size={28}
                                            />

                                        </div>


                                        <h3 className="mt-4 text-base font-bold text-slate-900">
                                            No assets yet
                                        </h3>


                                        <p className="mt-1 max-w-xs text-sm leading-5 text-slate-500">
                                            Start building your digital asset collection.
                                        </p>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/add-asset"
                                                )
                                            }
                                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                                        >

                                            <Plus
                                                size={15}
                                            />

                                            Add Asset

                                        </button>

                                    </div>

                                )}


                            {/* ASSETS */}

                            {!loading &&
                                !error &&
                                recentAssets.length >
                                0 && (

                                    <div className="space-y-2.5">

                                        {recentAssets.map(
                                            (
                                                asset
                                            ) => {

                                                const Icon =
                                                    getAssetIcon(
                                                        asset.type
                                                    );


                                                const style =
                                                    getAssetStyle(
                                                        asset.type
                                                    );


                                                return (

                                                    <div
                                                        key={
                                                            asset.id
                                                        }
                                                        className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:bg-slate-50/70 hover:shadow-sm"
                                                    >

                                                        {/* ICON */}

                                                        <div
                                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                                                        >

                                                            <Icon
                                                                size={
                                                                    19
                                                                }
                                                            />

                                                        </div>


                                                        {/* DETAILS */}

                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-blue-700">

                                                                {
                                                                    asset.title ||
                                                                    "Untitled Asset"
                                                                }

                                                            </p>


                                                            <div className="mt-1.5 flex items-center gap-2">

                                                                <span
                                                                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${style.badge}`}
                                                                >

                                                                    {asset.type.replace(
                                                                        "_",
                                                                        " "
                                                                    )}

                                                                </span>


                                                                <span className="text-[11px] text-slate-400">

                                                                    {formatDate(
                                                                        asset.updatedAt ||
                                                                        asset.createdAt
                                                                    )}

                                                                </span>

                                                            </div>

                                                        </div>


                                                        {/* FILE COUNT */}

                                                        <div className="hidden items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-400 sm:flex">

                                                            <Files
                                                                size={
                                                                    13
                                                                }
                                                            />


                                                            {
                                                                asset.files?.length ||
                                                                0
                                                            }

                                                        </div>


                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/assets/${asset.id}`
                                                                )
                                                            }
                                                            title="View asset"
                                                            aria-label={`View ${asset.title}`}
                                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-400 transition-all hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                                                        >

                                                            <Eye
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </button>

                                                    </div>

                                                );
                                            }
                                        )}

                                    </div>

                                )}

                        </div>


                        {/* FOOTER */}

                        {!loading &&
                            !error &&
                            recentAssets.length >
                            0 && (

                                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

                                    <p className="text-xs text-slate-400">

                                        Showing your latest{" "}

                                        {
                                            recentAssets.length
                                        }

                                        {" "}assets

                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/assets"
                                            )
                                        }
                                        className="group inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                                    >

                                        View all assets

                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-1"
                                        />

                                    </button>

                                </div>

                            )}

                    </section>

                </div>

            </main>

        </div>
    );
}