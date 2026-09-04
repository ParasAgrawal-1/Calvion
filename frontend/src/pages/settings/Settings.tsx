import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    User,
    Palette,
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
    Check,
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
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
    useTheme,
} from "../../context/ThemeContext";

import api from "../../services/api";

import ProfileSettings from "./ProfileSettings";


/* =========================================================
   TYPES
========================================================= */

type SettingSection =
    | "profile"
    | "appearance"
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
        id: "appearance",
        label: "Appearance",
        description: "Theme and interface",
        icon: Palette,
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
    "appearance",
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
   PLACEHOLDER
========================================================= */

function PlaceholderSection({
                                title,
                                description,
                                icon: Icon,
                            }: {
    title: string;
    description: string;
    icon: React.ElementType;
}) {

    return (

        <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">

                <Icon
                    size={28}
                    strokeWidth={1.8}
                />

            </div>


            <h2 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                {title}
            </h2>


            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
            </p>


            <span className="mt-5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
                Coming soon
            </span>

        </div>
    );
}


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
   APPEARANCE
========================================================= */

function AppearanceSection() {

    const {
        theme,
        setTheme,
    } = useTheme();


    return (

        <div className="space-y-6">


            {/* HEADER */}

            <div>

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">

                        <Palette
                            size={19}
                        />

                    </div>


                    <div>

                        <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                            Appearance
                        </h2>


                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Customize how Calvion looks and feels.
                        </p>

                    </div>

                </div>

            </div>


            {/* THEME */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-6">

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Theme
                    </h3>


                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Choose how your workspace should appear.
                    </p>

                </div>


                <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">


                    {/* LIGHT */}

                    <button
                        type="button"
                        onClick={() =>
                            setTheme(
                                "light"
                            )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                            theme === "light"
                                ? "border-blue-400 bg-blue-50 ring-4 ring-blue-50 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-950/40"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                        }`}
                    >

                        <div className="mb-4 h-24 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

                            <div className="h-2 w-2/5 rounded bg-slate-200" />

                            <div className="mt-3 h-8 rounded-lg bg-slate-50" />

                            <div className="mt-2 h-8 rounded-lg bg-blue-50" />

                        </div>


                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    Light
                                </p>


                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Bright and clean
                                </p>

                            </div>


                            {theme ===
                                "light" && (

                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">

                                        <Check
                                            size={13}
                                        />

                                    </div>

                                )}

                        </div>

                    </button>


                    {/* DARK */}

                    <button
                        type="button"
                        onClick={() =>
                            setTheme(
                                "dark"
                            )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                            theme === "dark"
                                ? "border-blue-400 bg-blue-50 ring-4 ring-blue-50 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-950/40"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                        }`}
                    >

                        <div className="mb-4 h-24 rounded-xl border border-slate-700 bg-slate-900 p-3">

                            <div className="h-2 w-2/5 rounded bg-slate-600" />

                            <div className="mt-3 h-8 rounded-lg bg-slate-800" />

                            <div className="mt-2 h-8 rounded-lg bg-blue-900/60" />

                        </div>


                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    Dark
                                </p>


                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Comfortable in low light
                                </p>

                            </div>


                            {theme ===
                                "dark" && (

                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">

                                        <Check
                                            size={13}
                                        />

                                    </div>

                                )}

                        </div>

                    </button>


                    {/* SYSTEM */}

                    <button
                        type="button"
                        onClick={() =>
                            setTheme(
                                "system"
                            )
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                            theme === "system"
                                ? "border-blue-400 bg-blue-50 ring-4 ring-blue-50 dark:border-blue-500 dark:bg-blue-950/30 dark:ring-blue-950/40"
                                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                        }`}
                    >

                        <div className="mb-4 flex h-24 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">

                            <div className="w-1/2 bg-white p-3">

                                <div className="h-2 w-3/5 rounded bg-slate-200" />

                                <div className="mt-3 h-8 rounded-lg bg-slate-50" />

                            </div>


                            <div className="w-1/2 bg-slate-900 p-3">

                                <div className="h-2 w-3/5 rounded bg-slate-600" />

                                <div className="mt-3 h-8 rounded-lg bg-slate-800" />

                            </div>

                        </div>


                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    System
                                </p>


                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Follow your device
                                </p>

                            </div>


                            {theme ===
                                "system" && (

                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">

                                        <Check
                                            size={13}
                                        />

                                    </div>

                                )}

                        </div>

                    </button>

                </div>

            </div>


            {/* CURRENT THEME */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">

                <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">

                        <Palette
                            size={17}
                        />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">

                            Current theme:{" "}

                            <span className="capitalize">
                                {theme}
                            </span>

                        </p>


                        <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-400">

                            Your theme preference is saved automatically.

                        </p>

                    </div>

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
                                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
                                        }`}
                                    >

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                                active
                                                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
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
                                                        ? "text-blue-700 dark:text-blue-300"
                                                        : "text-slate-700 dark:text-slate-300"
                                                }`}
                                            >

                                                {
                                                    item.label
                                                }

                                            </p>


                                            <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">

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
                                                className="shrink-0 text-blue-500 dark:text-blue-400"
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


                case "appearance":

                    return (
                        <AppearanceSection />
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

                    return (
                        <PlaceholderSection
                            title="Security"
                            description="Manage your password, authentication methods, and account security controls."
                            icon={
                                Shield
                            }
                        />
                    );


                case "sharing":

                    return (
                        <PlaceholderSection
                            title="Sharing & Permissions"
                            description="Manage asset access and sharing permissions from one centralized place."
                            icon={
                                Users
                            }
                        />
                    );


                case "storage":

                    return (
                        <PlaceholderSection
                            title="Data & Storage"
                            description="Review storage usage and manage uploaded files and asset data."
                            icon={
                                HardDrive
                            }
                        />
                    );


                case "login-history":

                    return (
                        <PlaceholderSection
                            title="Login History"
                            description="Review recent account login and access information."
                            icon={
                                Clock3
                            }
                        />
                    );


                case "expiry":

                    return (
                        <PlaceholderSection
                            title="Expiry & Reminders"
                            description="Manage reminders for certificates, documents, licenses, subscriptions, and other time-sensitive assets."
                            icon={
                                Clock3
                            }
                        />
                    );


                case "data-export":

                    return (
                        <PlaceholderSection
                            title="Data Export"
                            description="Export your Calvion account information."
                            icon={
                                Download
                            }
                        />
                    );


                case "privacy":

                    return (
                        <PlaceholderSection
                            title="Privacy"
                            description="Manage privacy controls and digital identity visibility."
                            icon={
                                LockKeyhole
                            }
                        />
                    );


                case "help":

                    return (
                        <PlaceholderSection
                            title="Help & Support"
                            description="Find help and support resources for using Calvion."
                            icon={
                                HelpCircle
                            }
                        />
                    );


                case "about":

                    return (
                        <PlaceholderSection
                            title="About Calvion"
                            description="Application version and project information."
                            icon={
                                Info
                            }
                        />
                    );


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

        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


                    {/* LEFT */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/dashboard"
                                )
                            }
                            className="group flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
                        >

                            <ArrowLeft
                                size={17}
                                className="transition-transform group-hover:-translate-x-0.5"
                            />

                            <span className="hidden sm:inline">
                                Dashboard
                            </span>

                        </button>


                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />


                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm">

                                <SettingsIcon
                                    size={18}
                                />

                            </div>


                            <div>

                                <h1 className="text-base font-bold text-slate-900 dark:text-white">
                                    Settings
                                </h1>


                                <p className="hidden text-[10px] text-slate-400 sm:block">
                                    Manage your account and preferences
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* MOBILE */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:hidden"
                    >

                        {mobileMenuOpen
                            ? "Close"
                            : "Settings Menu"}

                    </button>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">


                {/* MOBILE MENU */}

                {mobileMenuOpen && (

                    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:hidden">

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

                        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">


                            {/* SIDEBAR HEADER */}

                            <div className="mb-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/70 p-4 dark:from-slate-800 dark:to-blue-950/30">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400">

                                        <SettingsIcon
                                            size={19}
                                        />

                                    </div>


                                    <div>

                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            Settings
                                        </p>


                                        <p className="mt-0.5 text-[10px] text-slate-400">
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

                                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400">
                                    Settings
                                </p>


                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">

                                    {
                                        activeItem.label
                                    }

                                </h2>


                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

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