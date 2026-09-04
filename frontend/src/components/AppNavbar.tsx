import {
    Bell,
    ChevronDown,
    CheckCheck,
    Files,
    Folder,
    LayoutDashboard,
    LogOut,
    Settings,
    User,
    Users,
    X,
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


    /* =====================================================
       USER MENU
    ===================================================== */

    const [
        menuOpen,
        setMenuOpen,
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

            ? "inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-700"

            : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
    };


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


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

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 transition duration-200 group-hover:scale-105">

                        <Files
                            size={20}
                            strokeWidth={2}
                        />

                    </div>


                    <div className="text-left">

                        <div className="text-lg font-bold tracking-tight text-slate-900">

                            Calvion

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

                    </nav>


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

                                    ? "border-cyan-200 bg-cyan-50 text-cyan-600"

                                    : "border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
                            }`}
                        >

                            <Bell
                                size={19}
                            />


                            {unreadCount >
                                0 && (

                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">

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
                                                    className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-[11px] font-semibold text-cyan-600 transition hover:bg-cyan-50"
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
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
                                                    size={25}
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

                                    ? "border-cyan-200 bg-cyan-50"

                                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
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

                                <p className="truncate text-sm font-semibold text-slate-800">

                                    {
                                        userName
                                    }

                                </p>


                                <p className="text-[10px] font-medium text-slate-400">

                                    Personal workspace

                                </p>

                            </div>


                            <ChevronDown
                                size={16}
                                className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                                    menuOpen
                                        ? "rotate-180 text-cyan-600"
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
                                className="absolute right-0 top-[calc(100%+10px)] z-[100] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10"
                            >

                                {/* ACCOUNT */}

                                <div className="mb-1 rounded-xl bg-gradient-to-br from-slate-50 to-cyan-50/60 px-3 py-3">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">

                                            {
                                                getInitials(
                                                    userName
                                                )
                                            }

                                        </div>


                                        <div className="min-w-0">

                                            <p className="truncate text-sm font-bold text-slate-800">

                                                {
                                                    userName
                                                }

                                            </p>


                                            <p className="text-[10px] font-medium text-slate-400">

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
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">

                                        <User
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">

                                            Profile

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400">

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
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-cyan-50"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-100">

                                        <Settings
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700">

                                            Settings

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400">

                                            Manage preferences

                                        </p>

                                    </div>

                                </button>


                                {/* DIVIDER */}

                                <div className="my-1 border-t border-slate-100" />


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={
                                        handleLogout
                                    }
                                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500 transition group-hover:bg-red-100">

                                        <LogOut
                                            size={17}
                                        />

                                    </div>


                                    <div className="min-w-0">

                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-red-600">

                                            Logout

                                        </p>


                                        <p className="truncate text-[10px] text-slate-400">

                                            Sign out of Calvion

                                        </p>

                                    </div>

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </header>
    );
}