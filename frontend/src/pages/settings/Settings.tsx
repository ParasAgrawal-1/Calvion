import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    User,
    Shield,
    Bell,
    Users,
    HardDrive,
    History,
    Clock3,
    Download,
    LockKeyhole,
    HelpCircle,
    Info,
    ChevronRight,
    Settings as SettingsIcon,
    Share2,
    ShieldAlert,
    Trash2,
    RefreshCw,
    Activity as ActivityIcon,
    Upload,
    FileEdit,
    FolderPlus,
    UserPlus,
    UserMinus,
    FileDown,
    Eye,
    AlertCircle,
    Sun,
    Moon,
    Code2,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

import ProfileSettings from "./ProfileSettings";
import SecuritySection from "./sections/SecuritySection";
import SharingSection from "./sections/SharingSection";
import StorageSection from "./sections/StorageSection";
import LoginHistorySection from "./sections/LoginHistorySection";
import ExpirySection from "./sections/ExpirySection";
import DataExportSection from "./sections/DataExportSection";
import PrivacySection from "./sections/PrivacySection";
import HelpSection from "./sections/HelpSection";
import AboutSection from "./sections/AboutSection";


/* =========================================================
   TYPES
========================================================= */

type SettingSection =
    | "profile"
    | "security"
    | "notifications"
    | "sharing"
    | "storage"
    | "activity"
    | "login-history"
    | "expiry"
    | "data-export"
    | "privacy"
    | "help"
    | "about";


interface SettingItem {

    id: SettingSection;

    label: string;

    description: string;

    icon: React.ElementType;
}


/* =========================================================
   ACTIVITY TYPE
========================================================= */

interface Activity {

    id: number;

    action: string;

    description: string;

    assetId?: number | null;

    assetTitle?: string | null;

    createdAt: string;
}


/* =========================================================
   SETTINGS MENU
========================================================= */

const settingsMenu: SettingItem[] = [

    /* ================= GENERAL ================= */

    {
        id: "profile",
        label: "Profile",
        description: "Personal information",
        icon: User,
    },

    {
        id: "notifications",
        label: "Notifications",
        description: "Notification preferences",
        icon: Bell,
    },

    {
        id: "expiry",
        label: "Expiry & Reminders",
        description: "Manage asset reminders",
        icon: Clock3,
    },


    /* ================= SECURITY ================= */

    {
        id: "security",
        label: "Security",
        description: "Password and security",
        icon: Shield,
    },

    {
        id: "login-history",
        label: "Login History",
        description: "Account access history",
        icon: History,
    },

    {
        id: "privacy",
        label: "Privacy",
        description: "Privacy controls",
        icon: LockKeyhole,
    },


    /* ================= DIGITAL ASSETS ================= */

    {
        id: "activity",
        label: "Activity History",
        description: "View your asset activity",
        icon: History,
    },

    {
        id: "sharing",
        label: "Sharing & Permissions",
        description: "Manage asset access",
        icon: Users,
    },

    {
        id: "storage",
        label: "Data & Storage",
        description: "Storage and files",
        icon: HardDrive,
    },

    {
        id: "data-export",
        label: "Data Export",
        description: "Export your data",
        icon: Download,
    },


    /* ================= SUPPORT ================= */

    {
        id: "help",
        label: "Help & Support",
        description: "Get help",
        icon: HelpCircle,
    },

    {
        id: "about",
        label: "About",
        description: "About Calvion",
        icon: Info,
    },
];


/* =========================================================
   MENU GROUPS
========================================================= */

const generalSections: SettingSection[] = [
    "profile",
    "notifications",
    "expiry",
];


const securitySections: SettingSection[] = [
    "security",
    "login-history",
    "privacy",
];


const assetSections: SettingSection[] = [
    "activity",
    "sharing",
    "storage",
    "data-export",
];


const supportSections: SettingSection[] = [
    "help",
    "about",
];




/* =========================================================
   ACTIVITY DATE
========================================================= */

function formatActivityDate(
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
   ACTIVITY ICON
========================================================= */

function getActivityIcon(
    action?: string
) {

    switch (
        action?.toUpperCase()
        ) {

        case "CREATE_ASSET":

            return FolderPlus;

        case "UPDATE_ASSET":

            return FileEdit;

        case "UPLOAD_FILE":

            return Upload;

        case "SHARE_ASSET":

            return UserPlus;

        case "PERMISSION_CHANGED":

        case "UPDATE_PERMISSION":

            return ShieldAlert;

        case "ACCESS_REMOVED":

        case "REMOVE_ACCESS":

            return UserMinus;

        case "DELETE_ASSET":

            return Trash2;

        case "FILE_DOWNLOADED":

            return FileDown;

        case "VIEW_ASSET":

            return Eye;

        default:

            return ActivityIcon;
    }
}


/* =========================================================
   ACTIVITY STYLE
========================================================= */

function getActivityStyle(
    action?: string
) {

    switch (
        action?.toUpperCase()
        ) {

        case "CREATE_ASSET":

            return {
                icon:
                    "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",

                badge:
                    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
            };


        case "UPDATE_ASSET":

            return {
                icon:
                    "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",

                badge:
                    "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
            };


        case "UPLOAD_FILE":

            return {
                icon:
                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",

                badge:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            };


        case "SHARE_ASSET":

            return {
                icon:
                    "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",

                badge:
                    "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
            };


        case "PERMISSION_CHANGED":

        case "UPDATE_PERMISSION":

            return {
                icon:
                    "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",

                badge:
                    "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
            };


        case "ACCESS_REMOVED":

        case "REMOVE_ACCESS":

            return {
                icon:
                    "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",

                badge:
                    "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
            };


        case "DELETE_ASSET":

            return {
                icon:
                    "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",

                badge:
                    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
            };


        case "FILE_DOWNLOADED":

            return {
                icon:
                    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",

                badge:
                    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            };


        default:

            return {
                icon:
                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",

                badge:
                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
            };
    }
}


/* =========================================================
   ACTIVITY HISTORY SECTION
========================================================= */

function ActivityHistorySection() {

    const navigate =
        useNavigate();


    const [
        activities,
        setActivities,
    ] =
        useState<Activity[]>(
            []
        );


    const [
        loading,
        setLoading,
    ] =
        useState(true);


    const [
        refreshing,
        setRefreshing,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState("");


    /* =====================================================
       FETCH ACTIVITIES
    ===================================================== */

    const fetchActivities =
        async (
            isRefresh = false
        ) => {

            try {

                setError("");


                if (
                    isRefresh
                ) {

                    setRefreshing(
                        true
                    );

                } else {

                    setLoading(
                        true
                    );
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
                    await api.get<Activity[]>(
                        "/activities/recent"
                    );


                if (
                    Array.isArray(
                        response.data
                    )
                ) {

                    setActivities(
                        response.data
                    );

                } else {

                    setActivities(
                        []
                    );
                }


            } catch (
                error
                ) {

                console.error(
                    "Failed to load activity history:",
                    error
                );


                if (
                    axios.isAxiosError(
                        error
                    )
                ) {

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


                        navigate(
                            "/login"
                        );

                        return;
                    }


                    if (
                        error.response?.status ===
                        403
                    ) {

                        setError(
                            "You do not have permission to view your activity history."
                        );

                    } else if (
                        error.response?.status ===
                        404
                    ) {

                        setError(
                            "Activity history endpoint was not found."
                        );

                    } else if (
                        error.response?.data &&
                        typeof error.response.data === "string"
                    ) {

                        setError(
                            error.response.data
                        );

                    } else {

                        setError(
                            "Unable to load activity history."
                        );
                    }

                } else {

                    setError(
                        "Unable to load activity history."
                    );
                }


            } finally {

                setLoading(
                    false
                );

                setRefreshing(
                    false
                );
            }
        };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        fetchActivities();

    }, []);


    return (

        <div className="space-y-6">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                {/* LEFT */}

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">

                            <History
                                size={19}
                            />

                        </div>


                        <div>

                            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                                Activity History
                            </h2>


                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Review your recent activity across digital assets.
                            </p>

                        </div>

                    </div>

                </div>


                {/* REFRESH */}

                <button
                    type="button"
                    onClick={() =>
                        fetchActivities(
                            true
                        )
                    }
                    disabled={
                        loading ||
                        refreshing
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                >

                    <RefreshCw
                        size={15}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">

                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">

                            <AlertCircle
                                size={19}
                            />

                        </div>


                        <div className="flex-1">

                            <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                                Unable to load activity
                            </h3>


                            <p className="mt-1 text-xs leading-5 text-red-700 dark:text-red-400">
                                {error}
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    fetchActivities()
                                }
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                            >

                                Try Again

                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* =================================================
                ACTIVITY CARD
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">


                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Recent Activity
                            </h3>


                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Your latest asset and workspace actions.
                            </p>

                        </div>


                        {!loading &&
                            !error &&
                            activities.length >
                            0 && (

                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">

                                    {activities.length}

                                </span>

                            )}

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">

                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                        ].map(
                            (
                                item
                            ) => (

                                <div
                                    key={
                                        item
                                    }
                                    className="flex animate-pulse items-center gap-4 px-5 py-5 sm:px-6"
                                >

                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800" />


                                    <div className="min-w-0 flex-1">

                                        <div className="h-3.5 w-2/5 rounded bg-slate-200 dark:bg-slate-800" />

                                        <div className="mt-2 h-3 w-4/5 rounded bg-slate-100 dark:bg-slate-800/70" />

                                        <div className="mt-2 h-2.5 w-1/5 rounded bg-slate-100 dark:bg-slate-800/70" />

                                    </div>

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
                    activities.length ===
                    0 && (

                        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">

                                <History
                                    size={28}
                                    strokeWidth={1.8}
                                />

                            </div>


                            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                                No activity yet
                            </h3>


                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">

                                Your asset creation, updates, uploads, sharing, permission changes, and other activity will appear here.

                            </p>

                        </div>
                    )}


                {/* =================================================
                    ACTIVITY LIST
                ================================================= */}

                {!loading &&
                    !error &&
                    activities.length >
                    0 && (

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">

                            {activities.map(
                                (
                                    activity
                                ) => {

                                    const Icon =
                                        getActivityIcon(
                                            activity.action
                                        );


                                    const style =
                                        getActivityStyle(
                                            activity.action
                                        );


                                    const canOpenAsset =
                                        Boolean(
                                            activity.assetId
                                        );


                                    return (

                                        <div
                                            key={
                                                activity.id
                                            }

                                            /* ===================================
                                               CLICKABLE ROW
                                            =================================== */

                                            onClick={() => {

                                                if (
                                                    activity.assetId
                                                ) {

                                                    navigate(
                                                        `/assets/${activity.assetId}`
                                                    );
                                                }

                                            }}

                                            className={`group flex items-start gap-4 px-5 py-5 transition-all duration-200 sm:px-6 ${
                                                canOpenAsset
                                                    ? "cursor-pointer hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                                                    : ""
                                            }`}
                                        >


                                            {/* ===================================
                                               ACTIVITY ICON
                                            =================================== */}

                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon} transition-transform duration-200 ${
                                                    canOpenAsset
                                                        ? "group-hover:scale-105"
                                                        : ""
                                                }`}
                                            >

                                                <Icon
                                                    size={
                                                        19
                                                    }
                                                    strokeWidth={
                                                        2
                                                    }
                                                />

                                            </div>


                                            {/* ===================================
                                               ACTIVITY CONTENT
                                            =================================== */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                                    {/* TITLE */}

                                                    <p
                                                        className={`truncate text-sm font-semibold transition-colors duration-200 ${
                                                            canOpenAsset
                                                                ? "text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400"
                                                                : "text-slate-900 dark:text-white"
                                                        }`}
                                                    >

                                                        {
                                                            activity.description ||
                                                            "Activity"
                                                        }

                                                    </p>


                                                    {/* TIME */}

                                                    <span className="shrink-0 text-[10px] font-medium text-slate-400 dark:text-slate-500">

                                                        {
                                                            formatActivityDate(
                                                                activity.createdAt
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                {/* =================================
                                                   BADGE + ASSET
                                                ================================= */}

                                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${style.badge}`}
                                                    >

                                                        {
                                                            activity.action?.replace(
                                                                /_/g,
                                                                " "
                                                            ) ||
                                                            "ACTIVITY"
                                                        }

                                                    </span>


                                                    {activity.assetTitle && (

                                                        <>

                                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                                                Asset:
                                                            </span>


                                                            <span
                                                                className={`truncate text-xs font-semibold transition-colors ${
                                                                    canOpenAsset
                                                                        ? "text-slate-700 group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400"
                                                                        : "text-slate-700 dark:text-slate-300"
                                                                }`}
                                                            >

                                                                {
                                                                    activity.assetTitle
                                                                }

                                                            </span>

                                                        </>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ===================================
                                               CLICK ARROW
                                            =================================== */}

                                            {canOpenAsset && (

                                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-blue-100 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400">

                                                    <ChevronRight
                                                        size={
                                                            17
                                                        }
                                                    />

                                                </div>

                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

            </div>


            {/* =================================================
                INFO
            ================================================= */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">

                <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">

                        <ActivityIcon
                            size={17}
                        />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                            Activity tracking
                        </p>


                        <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-400">

                            Select an activity linked to an asset to open that asset.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   NOTIFICATION TOGGLE
========================================================= */

function NotificationToggle({
                                icon: Icon,
                                iconClass,
                                title,
                                description,
                                enabled,
                                onChange,
                            }: {
    icon: React.ElementType;
    iconClass: string;
    title: string;
    description: string;
    enabled: boolean;
    onChange: (value: boolean) => void;
}) {

    return (

        <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6">

            <div className="flex min-w-0 flex-1 items-start gap-3">

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >

                    <Icon
                        size={18}
                    />

                </div>


                <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {title}
                    </p>


                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {description}
                    </p>

                </div>

            </div>


            <div className="flex shrink-0 items-center gap-2">

                <button
                    type="button"
                    role="switch"
                    aria-checked={
                        enabled
                    }
                    aria-label={`${title}: ${
                        enabled
                            ? "On"
                            : "Off"
                    }`}
                    onClick={() =>
                        onChange(
                            !enabled
                        )
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                        enabled
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
                    }`}
                >

                    <span
                        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-200 ${
                            enabled
                                ? "left-[23px]"
                                : "left-[3px]"
                        }`}
                    />

                </button>


                <span
                    className={`w-8 text-center text-xs font-bold ${
                        enabled
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-400 dark:text-slate-500"
                    }`}
                >

                    {enabled
                        ? "ON"
                        : "OFF"}

                </span>

            </div>

        </div>
    );
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationsSection() {

    const navigate =
        useNavigate();


    const getSavedBoolean = (
        key: string,
        defaultValue = true
    ) => {

        const saved =
            localStorage.getItem(
                key
            );


        if (
            saved === null
        ) {

            return defaultValue;
        }


        return saved === "true";
    };


    const [
        inApp,
        setInApp,
    ] =
        useState(
            getSavedBoolean(
                "notification_in_app"
            )
        );


    const [
        sharingAlerts,
        setSharingAlerts,
    ] =
        useState(
            getSavedBoolean(
                "notification_sharing"
            )
        );


    const [
        permissionAlerts,
        setPermissionAlerts,
    ] =
        useState(
            getSavedBoolean(
                "notification_permission"
            )
        );


    const [
        accessRemovedAlerts,
        setAccessRemovedAlerts,
    ] =
        useState(
            getSavedBoolean(
                "notification_access_removed"
            )
        );


    const updatePreference =
        (
            key: string,
            value: boolean
        ) => {

            localStorage.setItem(
                key,
                String(value)
            );


            window.dispatchEvent(
                new Event(
                    "notification-preferences-changed"
                )
            );
        };


    const handleMasterToggle = (
        value: boolean
    ) => {

        setInApp(
            value
        );

        setSharingAlerts(
            value
        );

        setPermissionAlerts(
            value
        );

        setAccessRemovedAlerts(
            value
        );


        updatePreference(
            "notification_in_app",
            value
        );

        updatePreference(
            "notification_sharing",
            value
        );

        updatePreference(
            "notification_permission",
            value
        );

        updatePreference(
            "notification_access_removed",
            value
        );
    };


    const openNotificationCenter =
        () => {

            localStorage.setItem(
                "openNotificationCenter",
                "true"
            );


            navigate(
                "/dashboard"
            );
        };


    return (

        <div className="space-y-6">


            {/* HEADER */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">

                        <Bell
                            size={19}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                            Notifications
                        </h2>


                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Control how notifications and alerts work in Calvion.
                        </p>

                    </div>

                </div>

            </div>


            {/* MASTER */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="flex items-center justify-between gap-5 p-5 sm:p-6">

                    <div className="flex min-w-0 flex-1 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">

                            <Bell
                                size={20}
                            />

                        </div>


                        <div className="min-w-0">

                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Notifications
                            </p>


                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Turn all in-app notification alerts on or off.
                            </p>

                        </div>

                    </div>


                    <div className="flex shrink-0 items-center gap-2">

                        <button
                            type="button"
                            role="switch"
                            aria-checked={
                                inApp
                            }
                            onClick={() =>
                                handleMasterToggle(
                                    !inApp
                                )
                            }
                            className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 ${
                                inApp
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
                            }`}
                        >

                            <span
                                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-200 ${
                                    inApp
                                        ? "left-[23px]"
                                        : "left-[3px]"
                                }`}
                            />

                        </button>


                        <span
                            className={`w-8 text-center text-xs font-bold ${
                                inApp
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-400 dark:text-slate-500"
                            }`}
                        >

                            {inApp
                                ? "ON"
                                : "OFF"}

                        </span>

                    </div>

                </div>

            </div>


            {/* TYPES */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Notification Types
                    </h3>


                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Control individual notification categories.
                    </p>

                </div>


                <div className="divide-y divide-slate-100 dark:divide-slate-800">

                    <NotificationToggle
                        icon={
                            Share2
                        }
                        iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400"
                        title="Asset sharing alerts"
                        description="Notify you when someone shares a digital asset with you."
                        enabled={
                            sharingAlerts
                        }
                        onChange={(
                            value
                        ) => {

                            setSharingAlerts(
                                value
                            );

                            updatePreference(
                                "notification_sharing",
                                value
                            );

                        }}
                    />


                    <NotificationToggle
                        icon={
                            ShieldAlert
                        }
                        iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                        title="Permission change alerts"
                        description="Notify you when the permission of a shared asset changes."
                        enabled={
                            permissionAlerts
                        }
                        onChange={(
                            value
                        ) => {

                            setPermissionAlerts(
                                value
                            );

                            updatePreference(
                                "notification_permission",
                                value
                            );

                        }}
                    />


                    <NotificationToggle
                        icon={
                            Trash2
                        }
                        iconClass="bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400"
                        title="Access removed alerts"
                        description="Notify you when access to a shared asset is removed."
                        enabled={
                            accessRemovedAlerts
                        }
                        onChange={(
                            value
                        ) => {

                            setAccessRemovedAlerts(
                                value
                            );

                            updatePreference(
                                "notification_access_removed",
                                value
                            );

                        }}
                    />

                </div>

            </div>


            {/* NOTIFICATION CENTER */}

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm dark:border-blue-900/50 dark:from-blue-950/30 dark:to-cyan-950/20 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">

                            <Bell
                                size={19}
                            />

                        </div>


                        <div>

                            <h3 className="text-sm font-bold text-blue-950 dark:text-blue-200">
                                Notification Center
                            </h3>


                            <p className="mt-1 max-w-lg text-xs leading-5 text-blue-700 dark:text-blue-400">
                                View your asset sharing, permission, and access notifications.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            openNotificationCenter
                        }
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
                    >

                        <Bell
                            size={16}
                        />

                        Open Notification Center

                    </button>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   SETTINGS COMPONENT
========================================================= */

export default function Settings() {

    const navigate =
        useNavigate();

    const { theme, setTheme } =
        useTheme();


    const [
        activeSection,
        setActiveSection,
    ] =
        useState<SettingSection>(
            "profile"
        );


    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] =
        useState(false);


    /* =====================================================
       SELECT
    ===================================================== */

    const handleSelect =
        (
            id: SettingSection
        ) => {

            setActiveSection(
                id
            );

            setMobileMenuOpen(
                false
            );
        };


    /* =====================================================
       MENU GROUP
    ===================================================== */

    const renderMenuGroup = (
        title: string,
        itemIds: SettingSection[]
    ) => {

        return (

            <div className="mb-6">

                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                    {title}
                </p>


                <div className="space-y-1">

                    {settingsMenu
                        .filter(
                            (item) =>
                                itemIds.includes(
                                    item.id
                                )
                        )
                        .map(
                            (item) => {

                                const Icon =
                                    item.icon;


                                const active =
                                    activeSection ===
                                    item.id;


                                return (

                                    <button
                                        key={
                                            item.id
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleSelect(
                                                item.id
                                            )
                                        }
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                                            active
                                                ? "bg-blue-50 text-blue-700 dark:bg-neutral-900 dark:text-cyan-400"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-900/60 dark:hover:text-white"
                                        }`}
                                    >

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                active
                                                    ? "bg-blue-100 text-blue-600 dark:bg-cyan-950/40 dark:text-cyan-400"
                                                    : "bg-slate-100 text-slate-500 dark:bg-neutral-900 dark:text-neutral-400"
                                            }`}
                                        >

                                            <Icon
                                                size={
                                                    17
                                                }
                                            />

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <p
                                                className={`truncate text-sm font-semibold ${
                                                    active
                                                        ? "text-blue-700 dark:text-cyan-400"
                                                        : "text-slate-700 dark:text-neutral-200"
                                                }`}
                                            >

                                                {
                                                    item.label
                                                }

                                            </p>


                                            <p className="truncate text-[10px] text-slate-400 dark:text-neutral-500">

                                                {
                                                    item.description
                                                }

                                            </p>

                                        </div>


                                        {active && (

                                            <ChevronRight
                                                size={
                                                    15
                                                }
                                                className="shrink-0 text-blue-500 dark:text-cyan-400"
                                            />

                                        )}

                                    </button>
                                );
                            }
                        )}

                </div>

            </div>
        );
    };


    /* =====================================================
       CONTENT
    ===================================================== */

    const renderContent =
        () => {

            switch (
                activeSection
                ) {

                case "profile":

                    return (
                        <ProfileSettings />
                    );


                case "notifications":

                    return (
                        <NotificationsSection />
                    );


                case "activity":

                    return (
                        <ActivityHistorySection />
                    );


                case "security":
                    return <SecuritySection />;

                case "sharing":
                    return <SharingSection />;

                case "storage":
                    return <StorageSection />;

                case "login-history":
                    return <LoginHistorySection />;

                case "expiry":
                    return <ExpirySection />;

                case "data-export":
                    return <DataExportSection />;

                case "privacy":
                    return <PrivacySection />;

                case "help":
                    return <HelpSection />;

                case "about":
                    return <AboutSection />;


                default:

                    return (
                        <ProfileSettings />
                    );
            }
        };


    /* =====================================================
       ACTIVE ITEM
    ===================================================== */

    const activeItem =
        settingsMenu.find(
            (item) =>
                item.id ===
                activeSection
        );


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-slate-100">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#07090e]/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                {/* Micro accent gradient line on very top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-blue-600/0" />

                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">


                    {/* LEFT */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            className="group flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                        >

                            <ArrowLeft
                                size={14}
                                className="text-slate-400 dark:text-neutral-400 group-hover:text-cyan-500 group-hover:-translate-x-0.5 transition-all duration-200"
                            />

                            <span className="hidden sm:inline">
                                Dashboard
                            </span>

                        </button>


                        <div className="h-5 w-px bg-slate-200/80 dark:bg-neutral-800" />


                        <div className="flex items-center gap-2.5">

                            <div className="relative group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-sm shadow-cyan-500/25">
                                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#0c0e14] overflow-hidden p-1 text-cyan-600 dark:text-cyan-400 transition duration-200">
                                    <SettingsIcon
                                        size={18}
                                    />
                                </div>
                            </div>


                            <div>

                                <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                                    Settings
                                    <span className="ml-1.5 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent text-xs uppercase tracking-wider">
                                        Preferences
                                    </span>
                                </h1>


                                <p className="hidden text-[10.5px] font-medium text-slate-400 dark:text-neutral-500 sm:block -mt-0.5">
                                    Manage your account, workspace, and security
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* RIGHT: DEVELOPER HUB, THEME TOGGLE, MOBILE */}

                    <div className="flex items-center gap-2 sm:gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/developer")}
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300 transition hover:bg-cyan-500/20 dark:hover:bg-cyan-500/25 hover:border-cyan-500/50"
                        >
                            <Code2 size={14} className="text-cyan-600 dark:text-cyan-400" />
                            <span>Developer Hub</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] text-slate-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm transition-all duration-200"
                            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <Sun size={16} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                            ) : (
                                <Moon size={16} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 md:hidden"
                        >

                            {mobileMenuOpen
                                ? "Close"
                                : "Settings Menu"}

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto w-full max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">


                {/* MOBILE MENU */}

                {mobileMenuOpen && (

                    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#0c0c0e] md:hidden">

                        {renderMenuGroup(
                            "General",
                            generalSections
                        )}


                        {renderMenuGroup(
                            "Security & Privacy",
                            securitySections
                        )}


                        {renderMenuGroup(
                            "Digital Assets",
                            assetSections
                        )}


                        {renderMenuGroup(
                            "Support",
                            supportSections
                        )}

                    </div>
                )}


                {/* DESKTOP */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_minmax(0,1fr)]">


                    {/* =================================================
                        SIDEBAR
                    ================================================= */}

                    <aside className="hidden md:block">

                        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-[#0c0c0e]">


                            {/* SIDEBAR HEADER */}

                            <div className="mb-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/70 p-4 dark:border dark:border-neutral-800/80 dark:from-neutral-900 dark:to-[#0c0c0e]">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:border dark:border-neutral-800 dark:bg-black dark:text-cyan-400">

                                        <SettingsIcon
                                            size={19}
                                        />

                                    </div>


                                    <div>

                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            Settings
                                        </p>


                                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-neutral-500">
                                            Control center
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {renderMenuGroup(
                                "General",
                                generalSections
                            )}


                            {renderMenuGroup(
                                "Security & Privacy",
                                securitySections
                            )}


                            {renderMenuGroup(
                                "Digital Assets",
                                assetSections
                            )}


                            {renderMenuGroup(
                                "Support",
                                supportSections
                            )}

                        </div>

                    </aside>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <section className="min-w-0">

                        {activeItem && (

                            <div className="mb-5 hidden md:block">

                                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-600 dark:text-cyan-400">
                                    Settings
                                </p>


                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">

                                    {
                                        activeItem.label
                                    }

                                </h2>


                                <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">

                                    {
                                        activeItem.description
                                    }

                                </p>

                            </div>

                        )}


                        {renderContent()}

                    </section>

                </div>

            </main>

        </div>
    );
}