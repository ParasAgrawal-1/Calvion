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
    Search,
    Command,
    ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

interface AppNavbarProps {
    activePage: "dashboard" | "assets" | "shared";
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

type PaletteItem = {
    id: string;
    label: string;
    detail: string;
    icon: LucideIcon;
    run: () => void;
};

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-[#000000]";

const btnGhost =
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10";

const iconTile =
    "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300";

function getInitials(name?: string): string {
    if (!name) return "U";
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function formatNotificationDate(date?: string): string {
    if (!date) return "Unknown";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Unknown";

    const diff = Date.now() - parsed.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return "Just now";
    if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
    if (diff < day) return `${Math.floor(diff / hour)}h ago`;
    if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function CommandPalette({
    items,
    onClose,
}: {
    items: PaletteItem[];
    onClose: () => void;
}) {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLElement | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((item) =>
            `${item.label} ${item.detail}`.toLowerCase().includes(q)
        );
    }, [items, query]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        inputRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    const choose = (item: PaletteItem | undefined) => {
        if (!item) return;
        onClose();
        item.run();
    };

    const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
        if (event.key === "Escape") {
            event.preventDefault();
            onClose();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) =>
                filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
            );
        } else if (event.key === "Enter") {
            event.preventDefault();
            choose(filtered[active]);
        } else if (event.key === "Tab") {
            const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
                "button:not([tabindex='-1']), input"
            );
            if (!focusables || focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/50 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Search Calvion"
                onKeyDown={onKeyDown}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#000000]"
            >
                <div className="flex items-center gap-2.5 border-b border-slate-200 px-3.5 dark:border-white/10 sm:gap-3 sm:px-4">
                    <Search
                        size={18}
                        aria-hidden
                        className="shrink-0 text-slate-400"
                    />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search pages and actions"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="app-palette-list"
                        aria-activedescendant={
                            filtered[active]
                                ? `app-palette-${filtered[active].id}`
                                : undefined
                        }
                        className="h-12 min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white sm:h-14 sm:text-sm"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close search"
                        className={`shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5 ${focusRing}`}
                    >
                        Esc
                    </button>
                </div>

                <div
                    id="app-palette-list"
                    role="listbox"
                    aria-label="Results"
                    className="max-h-[60dvh] overflow-y-auto p-1.5 sm:max-h-[55vh] sm:p-2"
                >
                    {filtered.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-neutral-400">
                            No results. Try a different word.
                        </p>
                    )}
                    {filtered.map((item, index) => {
                        const ItemIcon = item.icon;
                        const isActive = index === active;
                        return (
                            <button
                                key={item.id}
                                id={`app-palette-${item.id}`}
                                role="option"
                                aria-selected={isActive}
                                type="button"
                                tabIndex={-1}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => choose(item)}
                                className={`flex w-full touch-manipulation items-center gap-3 rounded-xl px-2.5 py-2.5 text-left sm:px-3 ${
                                    isActive
                                        ? "bg-slate-100 dark:bg-white/[0.06]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconTile}`}
                                >
                                    <ItemIcon size={17} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium text-slate-800 dark:text-neutral-100">
                                        {item.label}
                                    </span>
                                    <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-neutral-400">
                                        {item.detail}
                                    </span>
                                </span>
                                <ArrowRight
                                    size={15}
                                    aria-hidden
                                    className="shrink-0 text-slate-400"
                                />
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default function AppNavbar({ activePage }: AppNavbarProps) {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const userName =
        localStorage.getItem("name") ||
        localStorage.getItem("email")?.split("@")[0] ||
        "User";

    const toggleTheme = useCallback(
        () => setTheme(theme === "dark" ? "light" : "dark"),
        [theme, setTheme]
    );

    const fetchNotifications = useCallback(async () => {
        try {
            setNotificationLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await api.get<Notification[]>("/notifications");
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setNotificationLoading(false);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await api.get<number>("/notifications/unread-count");
            setUnreadCount(Number(response.data) || 0);
        } catch (error) {
            console.error("Failed to load unread count:", error);
        }
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        void fetchUnreadCount();
    }, [fetchUnreadCount]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            void fetchUnreadCount();
            if (showNotifications) {
                void fetchNotifications();
            }
        }, 30000);

        return () => window.clearInterval(interval);
    }, [showNotifications, fetchUnreadCount, fetchNotifications]);

    useEffect(() => {
        if (showNotifications) {
            void fetchNotifications();
            void fetchUnreadCount();
        }
    }, [showNotifications, fetchNotifications, fetchUnreadCount]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setMenuOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(target)
            ) {
                setShowNotifications(false);
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                setSearchOpen(true);
                setMenuOpen(false);
                setShowNotifications(false);
                setMobileMenuOpen(false);
            } else if (event.key === "Escape") {
                setMenuOpen(false);
                setShowNotifications(false);
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const goTo = useCallback(
        (path: string) => {
            setMenuOpen(false);
            setMobileMenuOpen(false);
            setShowNotifications(false);
            navigate(path);
        },
        [navigate]
    );

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        setMenuOpen(false);
        setMobileMenuOpen(false);
        navigate("/login");
    }, [navigate]);

    const markNotificationAsRead = async (notification: Notification) => {
        try {
            if (!notification.read) {
                await api.put(`/notifications/${notification.id}/read`);
                setNotifications((prev) =>
                    prev.map((item) =>
                        item.id === notification.id
                            ? { ...item, read: true }
                            : item
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

            if (notification.assetId) {
                setShowNotifications(false);
                navigate(`/assets/${notification.assetId}`);
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const paletteItems = useMemo<PaletteItem[]>(
        () => [
            {
                id: "dashboard",
                label: "Dashboard",
                detail: "Workspace overview and recent activity",
                icon: LayoutDashboard,
                run: () => goTo("/dashboard"),
            },
            {
                id: "assets",
                label: "My Assets",
                detail: "View and manage your encrypted vault items",
                icon: Folder,
                run: () => goTo("/assets"),
            },
            {
                id: "new-asset",
                label: "New Asset",
                detail: "Add a document, credential, note, or link",
                icon: Plus,
                run: () => goTo("/add-asset"),
            },
            {
                id: "shared",
                label: "Shared With Me",
                detail: "Items shared with your account",
                icon: Users,
                run: () => goTo("/shared-assets"),
            },
            {
                id: "developer",
                label: "Developer Hub",
                detail: "Code editor and DSA practice",
                icon: Code2,
                run: () => goTo("/developer"),
            },
            {
                id: "settings",
                label: "Settings",
                detail: "Profile, security, and preferences",
                icon: Settings,
                run: () => goTo("/settings"),
            },
            {
                id: "theme",
                label: "Toggle theme",
                detail: "Switch between light and dark",
                icon: theme === "dark" ? Sun : Moon,
                run: toggleTheme,
            },
            {
                id: "logout",
                label: "Sign out",
                detail: "Log out of your Calvion session",
                icon: LogOut,
                run: handleLogout,
            },
        ],
        [goTo, theme, toggleTheme, handleLogout]
    );

    const getNavClass = (page: "dashboard" | "assets" | "shared") =>
        page === activePage
            ? `whitespace-nowrap rounded-lg bg-indigo-50 px-2.5 py-2 text-xs font-medium text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200 lg:px-3 lg:text-sm ${focusRing}`
            : `whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white lg:px-3 lg:text-sm ${focusRing}`;

    const navLink = `whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white lg:px-3 lg:text-sm ${focusRing}`;
    const iconButton = `flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5 ${focusRing}`;

    const notificationPopover = showNotifications && (
        <div className="fixed inset-x-3 top-[60px] z-[100] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#000000] dark:shadow-none sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+10px)] sm:w-[360px]">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-white/10">
                <div>
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                        Notifications
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
                        {unreadCount > 0
                            ? `${unreadCount} unread`
                            : "You're all caught up"}
                    </p>
                </div>

                <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-400/10 ${focusRing}`}
                        >
                            <CheckCheck size={14} />
                            <span>Mark all</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        aria-label="Close notifications"
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white ${focusRing}`}
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            <div className="max-h-[60dvh] overflow-y-auto sm:max-h-[400px]">
                {notificationLoading ? (
                    <div className="space-y-3 p-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex animate-pulse gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10" />
                                <div className="flex-1">
                                    <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
                                    <div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconTile}`}
                        >
                            <Bell size={20} />
                        </div>
                        <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                            No notifications
                        </h4>
                        <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-500 dark:text-neutral-400">
                            Asset sharing and permission updates will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {notifications.map((notification) => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() =>
                                    markNotificationAsRead(notification)
                                }
                                className={`flex w-full gap-3 px-4 py-3.5 text-left transition-colors ${
                                    notification.read
                                        ? "bg-white hover:bg-slate-50 dark:bg-[#000000] dark:hover:bg-white/[0.03]"
                                        : "bg-indigo-50/50 hover:bg-indigo-50/80 dark:bg-indigo-400/[0.06] dark:hover:bg-indigo-400/10"
                                }`}
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                        notification.read
                                            ? "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-neutral-400"
                                            : iconTile
                                    }`}
                                >
                                    <Bell size={15} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                            {notification.title}
                                        </p>
                                        {!notification.read && (
                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-300" />
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-neutral-400">
                                        {notification.message}
                                    </p>
                                    <p className="mt-1.5 text-[11px] text-slate-400 dark:text-neutral-500">
                                        {formatNotificationDate(
                                            notification.createdAt
                                        )}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <header
                className={`sticky top-0 z-50 border-b transition-colors ${
                    scrolled
                        ? "border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#000000]/90"
                        : "border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#000000]"
                }`}
            >
                <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-2 px-3.5 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
                    {/* BRAND */}
                    <Link
                        to="/"
                        aria-label="Calvion home"
                        className={`flex shrink-0 items-center gap-2 rounded-lg sm:gap-2.5 ${focusRing}`}
                    >
                        <img
                            src="/calvion-icon.png"
                            alt=""
                            width={32}
                            height={32}
                            decoding="async"
                            className="h-7 w-7 rounded-lg object-contain sm:h-8 sm:w-8"
                        />
                        <span className="cv-display text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-lg">
                            Calvion
                        </span>
                    </Link>

                    {/* TABLET & DESKTOP NAVIGATION + ACTIONS */}
                    <div className="hidden min-w-0 items-center gap-1 md:flex">
                        <nav
                            aria-label="Primary navigation"
                            className="flex items-center gap-0.5 lg:gap-1"
                        >
                            <button
                                type="button"
                                onClick={() => goTo("/dashboard")}
                                className={getNavClass("dashboard")}
                            >
                                Dashboard
                            </button>

                            <button
                                type="button"
                                onClick={() => goTo("/assets")}
                                className={getNavClass("assets")}
                            >
                                My Assets
                            </button>

                            <button
                                type="button"
                                onClick={() => goTo("/shared-assets")}
                                className={getNavClass("shared")}
                            >
                                <span className="lg:hidden">Shared</span>
                                <span className="hidden lg:inline">
                                    Shared With Me
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => goTo("/developer")}
                                className={navLink}
                            >
                                <span className="lg:hidden">Dev Hub</span>
                                <span className="hidden lg:inline">
                                    Developer Hub
                                </span>
                            </button>
                        </nav>

                        {/* COMMAND SEARCH (COMPACT ON MD, FULL ON XL) */}
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search (Ctrl+K)"
                            title="Search (Ctrl+K)"
                            className={`ml-1.5 flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-neutral-400 dark:hover:bg-white/5 xl:ml-2 ${focusRing}`}
                        >
                            <Search size={14} aria-hidden />
                            <span className="hidden pr-1.5 xl:inline">
                                Search
                            </span>
                            <kbd className="hidden h-5 items-center gap-0.5 rounded border border-slate-200 px-1 dark:border-white/10 xl:flex">
                                <Command size={10} aria-hidden />K
                            </kbd>
                        </button>

                        {/* NEW ASSET CTA */}
                        <button
                            type="button"
                            onClick={() => goTo("/add-asset")}
                            className={`ml-1 inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-xs font-semibold transition-colors lg:px-3.5 lg:text-sm ${btnGhost} ${focusRing}`}
                        >
                            <Plus size={15} aria-hidden />
                            <span className="lg:hidden">New</span>
                            <span className="hidden lg:inline">New Asset</span>
                        </button>

                        {/* THEME TOGGLE */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${
                                theme === "dark" ? "light" : "dark"
                            } mode`}
                            className={`ml-1 ${iconButton}`}
                        >
                            {theme === "dark" ? (
                                <Sun size={16} aria-hidden />
                            ) : (
                                <Moon size={16} aria-hidden />
                            )}
                        </button>

                        {/* DESKTOP NOTIFICATIONS */}
                        <div ref={notificationRef} className="relative ml-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNotifications((prev) => !prev);
                                    setMenuOpen(false);
                                }}
                                aria-label="Notifications"
                                aria-haspopup="dialog"
                                aria-expanded={showNotifications}
                                className={`relative ${iconButton} ${
                                    showNotifications
                                        ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                                        : ""
                                }`}
                            >
                                <Bell size={16} aria-hidden />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:bg-indigo-400 dark:text-slate-950 dark:ring-[#000000]">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationPopover}
                        </div>

                        {/* USER DROPDOWN */}
                        <div ref={menuRef} className="relative ml-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen((prev) => !prev);
                                    setShowNotifications(false);
                                }}
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                className={`flex h-9 items-center gap-1.5 rounded-lg border px-2 text-xs transition-colors lg:gap-2 lg:text-sm ${focusRing} ${
                                    menuOpen
                                        ? "border-slate-300 bg-slate-100 dark:border-white/20 dark:bg-white/10"
                                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:hover:bg-white/5"
                                }`}
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-[11px] font-semibold text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200">
                                    {getInitials(userName)}
                                </span>
                                <span className="max-w-[76px] truncate font-medium text-slate-800 dark:text-neutral-100 lg:max-w-[120px] xl:max-w-[160px]">
                                    {userName}
                                </span>
                                <ChevronDown
                                    size={14}
                                    aria-hidden
                                    className={`shrink-0 text-slate-400 transition-transform ${
                                        menuOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {menuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-[calc(100%+10px)] z-[100] w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#000000] dark:shadow-none"
                                >
                                    <div className="mb-1 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                                            {userName}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-neutral-400">
                                            Personal workspace
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => goTo("/settings")}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-white/5 ${focusRing}`}
                                    >
                                        <User
                                            size={15}
                                            className="text-slate-500 dark:text-neutral-400"
                                        />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => goTo("/settings")}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-neutral-200 dark:hover:bg-white/5 ${focusRing}`}
                                    >
                                        <Settings
                                            size={15}
                                            className="text-slate-500 dark:text-neutral-400"
                                        />
                                        <span>Settings</span>
                                    </button>

                                    <div className="my-1 border-t border-slate-200 dark:border-white/10" />

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={handleLogout}
                                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 ${focusRing}`}
                                    >
                                        <LogOut size={15} />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE ACTIONS (<768px) */}
                    <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search"
                            className={iconButton}
                        >
                            <Search size={16} aria-hidden />
                        </button>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${
                                theme === "dark" ? "light" : "dark"
                            } mode`}
                            className={iconButton}
                        >
                            {theme === "dark" ? (
                                <Sun size={16} aria-hidden />
                            ) : (
                                <Moon size={16} aria-hidden />
                            )}
                        </button>

                        {/* MOBILE NOTIFICATIONS */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNotifications((prev) => !prev);
                                    setMobileMenuOpen(false);
                                }}
                                aria-label="Notifications"
                                aria-haspopup="dialog"
                                aria-expanded={showNotifications}
                                className={`relative ${iconButton} ${
                                    showNotifications
                                        ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                                        : ""
                                }`}
                            >
                                <Bell size={16} aria-hidden />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:bg-indigo-400 dark:text-slate-950 dark:ring-[#000000]">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationPopover}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen((open) => !open);
                                setShowNotifications(false);
                                setMenuOpen(false);
                            }}
                            aria-label={
                                mobileMenuOpen ? "Close menu" : "Open menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-controls="app-mobile-menu"
                            className={iconButton}
                        >
                            {mobileMenuOpen ? (
                                <X size={18} aria-hidden />
                            ) : (
                                <Menu size={18} aria-hidden />
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE DRAWER */}
                {mobileMenuOpen && (
                    <div
                        id="app-mobile-menu"
                        className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#000000] md:hidden"
                    >
                        <nav
                            className="mx-auto w-full max-w-[1400px] space-y-1 px-3.5 py-4 sm:px-6"
                            aria-label="Mobile navigation"
                        >
                            <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${iconTile}`}
                                >
                                    {getInitials(userName)}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                                        Personal workspace
                                    </p>
                                </div>
                            </div>

                            {[
                                {
                                    label: "Dashboard",
                                    icon: LayoutDashboard,
                                    active: activePage === "dashboard",
                                    onClick: () => goTo("/dashboard"),
                                },
                                {
                                    label: "My Assets",
                                    icon: Folder,
                                    active: activePage === "assets",
                                    onClick: () => goTo("/assets"),
                                },
                                {
                                    label: "Shared With Me",
                                    icon: Users,
                                    active: activePage === "shared",
                                    onClick: () => goTo("/shared-assets"),
                                },
                                {
                                    label: "Developer Hub",
                                    icon: Code2,
                                    active: false,
                                    onClick: () => goTo("/developer"),
                                },
                                {
                                    label: "Settings",
                                    icon: Settings,
                                    active: false,
                                    onClick: () => goTo("/settings"),
                                },
                            ].map(({ label, icon: Icon, active, onClick }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={onClick}
                                    className={`flex w-full touch-manipulation items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${focusRing} ${
                                        active
                                            ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200"
                                            : "text-slate-700 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <Icon
                                        size={17}
                                        aria-hidden
                                        className={
                                            active
                                                ? "text-indigo-700 dark:text-indigo-300"
                                                : "text-slate-500 dark:text-neutral-400"
                                        }
                                    />
                                    {label}
                                </button>
                            ))}

                            <div className="grid grid-cols-2 gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => goTo("/add-asset")}
                                    className={`inline-flex h-10 touch-manipulation items-center justify-center gap-2 rounded-lg text-sm font-semibold ${btnGhost} ${focusRing}`}
                                >
                                    <Plus size={15} aria-hidden />
                                    New Asset
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className={`inline-flex h-10 touch-manipulation items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 text-sm font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-950/30 dark:text-rose-300 ${focusRing}`}
                                >
                                    <LogOut size={15} aria-hidden />
                                    Sign out
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {searchOpen && (
                <CommandPalette
                    items={paletteItems}
                    onClose={() => setSearchOpen(false)}
                />
            )}

            {/* MOBILE BOTTOM NAVIGATION BAR */}
            <nav
                aria-label="Mobile Bottom Navigation"
                className="fixed bottom-0 left-0 right-0 z-40 flex min-h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-white/10 dark:bg-[#000000]/95 md:hidden"
            >
                <button
                    type="button"
                    onClick={() => goTo("/dashboard")}
                    className={`flex min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-1 py-1.5 transition-colors ${
                        activePage === "dashboard"
                            ? "font-semibold text-indigo-700 dark:text-indigo-300"
                            : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                >
                    <LayoutDashboard size={19} />
                    <span className="truncate text-[10px]">Dashboard</span>
                </button>

                <button
                    type="button"
                    onClick={() => goTo("/assets")}
                    className={`flex min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-1 py-1.5 transition-colors ${
                        activePage === "assets"
                            ? "font-semibold text-indigo-700 dark:text-indigo-300"
                            : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                >
                    <Folder size={19} />
                    <span className="truncate text-[10px]">Assets</span>
                </button>

                <button
                    type="button"
                    onClick={() => goTo("/add-asset")}
                    aria-label="Add new asset"
                    className="-mt-4 flex min-w-0 flex-1 touch-manipulation flex-col items-center justify-center"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-slate-950 text-white shadow-sm transition active:scale-95 dark:border-white/20 dark:bg-white dark:text-slate-950">
                        <Plus size={20} strokeWidth={2.25} />
                    </div>
                    <span className="mt-1 text-[10px] font-semibold text-slate-700 dark:text-neutral-300">
                        Add
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => goTo("/shared-assets")}
                    className={`flex min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-1 py-1.5 transition-colors ${
                        activePage === "shared"
                            ? "font-semibold text-indigo-700 dark:text-indigo-300"
                            : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                >
                    <Users size={19} />
                    <span className="truncate text-[10px]">Shared</span>
                </button>

                <button
                    type="button"
                    onClick={() => goTo("/developer")}
                    className="flex min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-1 py-1.5 text-slate-500 transition-colors hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                >
                    <Code2 size={19} />
                    <span className="truncate text-[10px]">Dev Hub</span>
                </button>
            </nav>
        </>
    );
}