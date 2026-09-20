import {
    Bell,
    ChevronDown,
    CheckCheck,
    Folder,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    Users,
    X,
    Sun,
    Moon,
    Code2,
    Menu,
    Plus,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";


/* =========================================================
   TYPES
========================================================= */

interface AppNavbarProps {
    activePage:
        | "dashboard"
        | "assets"
        | "shared";
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
   NOTIFICATION DATE
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


    if (
        diff < minute
    ) {

        return "Just now";
    }


    if (
        diff < hour
    ) {

        return `${Math.floor(
            diff / minute
        )}m ago`;
    }


    if (
        diff < day
    ) {

        return `${Math.floor(
            diff / hour
        )}h ago`;
    }


    if (
        diff < 7 * day
    ) {

        return `${Math.floor(
            diff / day
        )}d ago`;
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
   COMPONENT
========================================================= */

export default function AppNavbar({
                                      activePage,
                                  }: AppNavbarProps) {

    const navigate =
        useNavigate();

    const { theme, setTheme } =
        useTheme();


    /* =====================================================
       USER MENU
    ===================================================== */

    const [
        menuOpen,
        setMenuOpen,
    ] =
        useState(false);

    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] =
        useState(false);

    const menuRef =
        useRef<HTMLDivElement>(
            null
        );


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const [
        notifications,
        setNotifications,
    ] =
        useState<Notification[]>(
            []
        );


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


    const notificationRef =
        useRef<HTMLDivElement>(
            null
        );


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


    /* =====================================================
       LOAD NOTIFICATIONS
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
       LOAD UNREAD COUNT
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
                    "Failed to load unread count:",
                    error
                );
            }
        };


    /* =====================================================
       INITIAL NOTIFICATION LOAD
    ===================================================== */

    useEffect(() => {

        fetchUnreadCount();

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
       OPEN NOTIFICATIONS
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
       CLOSE MENUS
    ===================================================== */

    useEffect(() => {

        const handleOutsideClick =
            (
                event: MouseEvent
            ) => {

                const target =
                    event.target as Node;


                if (
                    menuRef.current &&
                    !menuRef.current.contains(
                        target
                    )
                ) {

                    setMenuOpen(
                        false
                    );
                }


                if (
                    notificationRef.current &&
                    !notificationRef.current.contains(
                        target
                    )
                ) {

                    setShowNotifications(
                        false
                    );
                }

            };


        const handleEscape =
            (
                event: KeyboardEvent
            ) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    setMenuOpen(
                        false
                    );

                    setShowNotifications(
                        false
                    );
                }

            };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );


            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const goTo = (
        path: string
    ) => {

        setMenuOpen(
            false
        );

        setMobileMenuOpen(
            false
        );

        setShowNotifications(
            false
        );

        navigate(
            path
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


        setMenuOpen(
            false
        );


        navigate(
            "/login"
        );
    };


    /* =====================================================
       NOTIFICATION CLICK
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
                        (
                            previous
                        ) =>

                            previous.map(
                                (
                                    item
                                ) =>

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
                        (
                            previous
                        ) =>
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
       MARK ALL READ
    ===================================================== */

    const markAllNotificationsAsRead =
        async () => {

            try {

                await api.put(
                    "/notifications/read-all"
                );


                setNotifications(
                    (
                        previous
                    ) =>

                        previous.map(
                            (
                                notification
                            ) => ({

                                ...notification,

                                read: true,

                            })
                        )
                );


                setUnreadCount(
                    0
                );

            } catch (error) {

                console.error(
                    "Failed to mark all notifications as read:",
                    error
                );
            }
        };


    /* =====================================================
       ACTIVE NAV STYLE
    ===================================================== */

    const getNavClass = (
        page:
            | "dashboard"
            | "assets"
            | "shared"
    ) => {

        return page === activePage

            ? "inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700 dark:bg-neutral-800 dark:text-cyan-400 dark:border dark:border-neutral-700"

            : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white";
    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <>
        <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07090e] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
            <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">


                {/* =================================================
                    BRAND
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        goTo(
                            "/"
                        )
                    }
                    className="group flex shrink-0 items-center gap-3"
                >

                    <div className="relative group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-sm shadow-cyan-500/25 transition duration-200 group-hover:scale-105">
                        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#0c0e14] overflow-hidden p-1 transition duration-200">
                            <img
                                src="/calvion-icon.png"
                                alt="Calvion"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <div className="text-base font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                            Calvion
                            <span className="ml-1.5 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent text-xs uppercase tracking-wider">
                                Cloud
                            </span>
                        </div>

                        <div className="hidden text-[10.5px] font-medium text-slate-400 dark:text-neutral-500 sm:block -mt-0.5">
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

                    <nav
                        aria-label="Primary navigation"
                        className="hidden items-center gap-1 md:flex"
                    >

                        {/* DASHBOARD */}

                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/dashboard"
                                )
                            }
                            className={
                                getNavClass(
                                    "dashboard"
                                )
                            }
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
                                goTo(
                                    "/assets"
                                )
                            }
                            className={
                                getNavClass(
                                    "assets"
                                )
                            }
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
                                goTo(
                                    "/shared-assets"
                                )
                            }
                            className={
                                getNavClass(
                                    "shared"
                                )
                            }
                        >

                            <Users
                                size={16}
                            />

                            Shared With Me

                        </button>

                        {/* DEVELOPER HUB */}
                        <button
                            type="button"
                            onClick={() =>
                                goTo(
                                    "/developer"
                                )
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800/70 dark:hover:text-white"
                        >
                            <Code2
                                size={16}
                                className="text-cyan-500"
                            />
                            <span>Developer Hub</span>
                            <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.2 text-[9.5px] font-bold text-cyan-600 dark:text-cyan-400">
                                New
                            </span>
                        </button>

                    </nav>


                    {/* THEME TOGGLE (Sun / Moon) */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#12141c] text-slate-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm transition-all duration-200"
                        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                        aria-label="Toggle Theme"
                    >
                        {theme === "dark" ? (
                            <Sun size={17} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                        ) : (
                            <Moon size={17} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
                        )}
                    </button>


                    {/* =================================================
                        NOTIFICATION CENTER
                    ================================================= */}

                    <div
                        ref={
                            notificationRef
                        }
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={() => {

                                setShowNotifications(
                                    (
                                        previous
                                    ) =>
                                        !previous
                                );


                                setMenuOpen(
                                    false
                                );

                            }}
                            aria-label="Notifications"
                            aria-haspopup="dialog"
                            aria-expanded={
                                showNotifications
                            }
                            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${
                                showNotifications

                                    ? "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-500/50 dark:bg-neutral-800 dark:text-cyan-400"

                                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                            }`}
                        >

                            <Bell
                                size={19}
                            />


                            {unreadCount >
                                0 && (

                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-neutral-900">

                                    {
                                        unreadCount > 9
                                            ? "9+"
                                            : unreadCount
                                    }

                                </span>
                                )}

                        </button>


                        {/* =================================================
                            NOTIFICATION DROPDOWN
                        ================================================= */}

                        {showNotifications && (

                            <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-neutral-800 dark:bg-[#0c0c0e] dark:shadow-black">


                                {/* HEADER */}

                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-neutral-800">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-neutral-800 dark:text-cyan-400">

                                                <Bell
                                                    size={16}
                                                />

                                            </div>


                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">

                                                Notifications

                                            </h3>

                                        </div>


                                        <p className="mt-1 pl-10 text-[11px] text-slate-400 dark:text-neutral-400">

                                            {
                                                unreadCount >
                                                0

                                                    ? `${unreadCount} unread notification${
                                                        unreadCount >
                                                        1
                                                            ? "s"
                                                            : ""
                                                    }`

                                                    : "You're all caught up"
                                            }

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
                                                    className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-cyan-600 transition hover:bg-cyan-50 dark:text-cyan-400 dark:hover:bg-neutral-800"
                                                >

                                                    <CheckCheck
                                                        size={14}
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
                                            aria-label="Close notifications"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                                        >

                                            <X
                                                size={16}
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

                                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200 dark:bg-neutral-800" />


                                                        <div className="flex-1">

                                                            <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-neutral-800" />

                                                            <div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-neutral-900" />

                                                            <div className="mt-2 h-2.5 w-1/3 rounded bg-slate-100 dark:bg-neutral-900" />

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                    ) : notifications.length ===
                                    0 ? (

                                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 dark:bg-neutral-800 dark:text-cyan-400">

                                                <Bell
                                                    size={25}
                                                />

                                            </div>


                                            <h4 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">

                                                No notifications

                                            </h4>


                                            <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-400 dark:text-neutral-400">

                                                New asset sharing and permission activity will appear here.

                                            </p>

                                        </div>

                                    ) : (

                                        <div className="divide-y divide-slate-100 dark:divide-neutral-800">

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
                                                        className={`flex w-full gap-3 px-4 py-4 text-left transition ${
                                                            notification.read
                                                                ? "bg-white hover:bg-slate-50 dark:bg-[#0c0c0e] dark:hover:bg-neutral-900"
                                                                : "bg-cyan-50/50 hover:bg-cyan-50/80 dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
                                                        }`}
                                                    >

                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                                                notification.read
                                                                    ? "bg-slate-100 text-slate-400 dark:bg-neutral-800 dark:text-neutral-400"
                                                                    : "bg-cyan-100 text-cyan-600 dark:bg-neutral-800 dark:text-cyan-400"
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

                                                                <p className="text-xs font-bold text-slate-900 dark:text-white">

                                                                    {
                                                                        notification.title
                                                                    }

                                                                </p>


                                                                {!notification.read && (

                                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />

                                                                )}

                                                            </div>


                                                            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-neutral-300">

                                                                {
                                                                    notification.message
                                                                }

                                                            </p>


                                                            <p className="mt-2 text-[10px] font-medium text-slate-400 dark:text-neutral-500">

                                                                {
                                                                    formatNotificationDate(
                                                                        notification.createdAt
                                                                    )
                                                                }

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
                        USER DROPDOWN
                    ================================================= */}

                    <div
                        ref={
                            menuRef
                        }
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={() => {

                                setMenuOpen(
                                    (
                                        previous
                                    ) =>
                                        !previous
                                );


                                setShowNotifications(
                                    false
                                );

                            }}
                            aria-haspopup="menu"
                            aria-expanded={
                                menuOpen
                            }
                            className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/10 ${
                                menuOpen

                                    ? "border-cyan-200 bg-cyan-50 dark:border-neutral-700 dark:bg-neutral-800"

                                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50 dark:bg-transparent dark:text-white dark:hover:border-neutral-800 dark:hover:bg-neutral-900"
                            }`}
                        >

                            {/* AVATAR */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">

                                {
                                    getInitials(
                                        userName
                                    )
                                }

                            </div>


                            {/* USER */}

                            <div className="hidden max-w-36 text-left sm:block">

                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">

                                    {
                                        userName
                                    }

                                </p>


                                <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">

                                    Personal workspace

                                </p>

                            </div>


                            <ChevronDown
                                size={16}
                                className={`shrink-0 text-slate-400 dark:text-neutral-500 transition-transform duration-200 ${
                                    menuOpen
                                        ? "rotate-180 text-cyan-600 dark:text-cyan-400"
                                        : ""
                                }`}
                            />

                        </button>


                        {/* =================================================
                            USER MENU
                        ================================================= */}

                        {menuOpen && (

                            <div
                                role="menu"
                                className="absolute right-0 top-[calc(100%+10px)] z-[100] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-neutral-800 dark:bg-[#0c0c0e] dark:shadow-black"
                            >

                                {/* ACCOUNT */}

                                <div className="mb-1 rounded-xl bg-gradient-to-br from-slate-50 to-cyan-50/60 px-3 py-3 dark:from-neutral-900 dark:to-neutral-900 dark:border dark:border-neutral-800">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">

                                            {
                                                getInitials(
                                                    userName
                                                )
                                            }

                                        </div>


                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">

                                                {
                                                    userName
                                                }

                                            </p>


                                            <p className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">

                                                Personal workspace

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* PROFILE */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() =>
                                        goTo(
                                            "/settings"
                                        )
                                    }
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50 dark:hover:bg-neutral-900"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100 dark:bg-neutral-800 dark:text-blue-400 dark:group-hover:bg-neutral-700">

                                        <User
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 dark:text-neutral-200 dark:group-hover:text-white">

                                            Profile

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400 dark:text-neutral-500">

                                            View your profile

                                        </p>

                                    </div>

                                </button>


                                {/* SETTINGS */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() =>
                                        goTo(
                                            "/settings"
                                        )
                                    }
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cyan-50 dark:hover:bg-neutral-900"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100 dark:bg-neutral-800 dark:text-cyan-400 dark:group-hover:bg-neutral-700">

                                        <Settings
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700 dark:text-neutral-200 dark:group-hover:text-white">

                                            Settings

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400 dark:text-neutral-500">

                                            Manage preferences

                                        </p>

                                    </div>

                                </button>


                                {/* DIVIDER */}

                                <div className="my-1 border-t border-slate-100 dark:border-neutral-800" />


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={
                                        handleLogout
                                    }
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50 dark:hover:bg-red-950/30"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition group-hover:bg-red-100 dark:bg-neutral-800 dark:text-red-400 dark:group-hover:bg-red-950/50">

                                        <LogOut
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-red-600 dark:text-neutral-200 dark:group-hover:text-red-400">

                                            Logout

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400 dark:text-neutral-500">

                                            Sign out of Calvion

                                        </p>

                                    </div>

                                </button>

                            </div>

                        )}

                    </div>

                    {/* MOBILE HAMBURGER TOGGLE */}
                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(!mobileMenuOpen);
                            setShowNotifications(false);
                            setMenuOpen(false);
                        }}
                        className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#12141c] text-slate-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition shadow-sm"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
                    </button>

                </div>

            </div>

            {/* MOBILE SLIDE-DOWN DRAWER */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200/80 dark:border-neutral-800 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-md px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-neutral-900/80 mb-3 border border-slate-200/60 dark:border-neutral-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-sm">
                            {getInitials(userName)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                            <p className="text-[11px] text-slate-400 dark:text-neutral-500">Personal Workspace</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => goTo("/dashboard")}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            activePage === "dashboard"
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                : "text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                        }`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("/assets")}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            activePage === "assets"
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                : "text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                        }`}
                    >
                        <Folder size={18} />
                        <span>My Assets</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("/shared-assets")}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            activePage === "shared"
                                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                : "text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                        }`}
                    >
                        <Users size={18} />
                        <span>Shared With Me</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("/developer")}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
                    >
                        <div className="flex items-center gap-3">
                            <Code2 size={18} className="text-cyan-500" />
                            <span>Developer Hub</span>
                        </div>
                        <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                            New
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => goTo("/settings")}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>

                    <div className="pt-2 border-t border-slate-100 dark:border-neutral-800">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

        </header>

        {/* =================================================
            MOBILE BOTTOM NAVIGATION BAR
        ================================================= */}
        <nav
            aria-label="Mobile Bottom Navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-neutral-800 flex items-center justify-around h-16 px-2 shadow-lg"
        >
            <button
                type="button"
                onClick={() => goTo("/dashboard")}
                className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition ${
                    activePage === "dashboard"
                        ? "text-cyan-600 dark:text-cyan-400 font-bold"
                        : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
                <LayoutDashboard size={20} />
                <span className="text-[10px]">Dashboard</span>
            </button>

            <button
                type="button"
                onClick={() => goTo("/assets")}
                className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition ${
                    activePage === "assets"
                        ? "text-cyan-600 dark:text-cyan-400 font-bold"
                        : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
                <Folder size={20} />
                <span className="text-[10px]">Assets</span>
            </button>

            <button
                type="button"
                onClick={() => goTo("/add-asset")}
                className="flex flex-col items-center justify-center -mt-5"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 active:scale-95 transition">
                    <Plus size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-neutral-300 mt-1">Add</span>
            </button>

            <button
                type="button"
                onClick={() => goTo("/shared-assets")}
                className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition ${
                    activePage === "shared"
                        ? "text-cyan-600 dark:text-cyan-400 font-bold"
                        : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white"
                }`}
            >
                <Users size={20} />
                <span className="text-[10px]">Shared</span>
            </button>

            <button
                type="button"
                onClick={() => goTo("/developer")}
                className="flex flex-col items-center justify-center gap-1 w-16 py-1 text-slate-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition"
            >
                <Code2 size={20} />
                <span className="text-[10px]">Dev Hub</span>
            </button>
        </nav>
        </>
    );
}