import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ShieldCheck,
    FileText,
    Award,
    StickyNote,
    Link as LinkIcon,
    KeyRound,
    LockKeyhole,
    FolderOpen,
    Search,
    Smartphone,
    Database,
    CheckCircle2,
    ArrowRight,
    LogIn,
    UserPlus,
    Folder,
    Code2,
    Terminal,
    Trophy,
    Sparkles,
    Sun,
    Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";


// =========================================
// STATIC DATA
// =========================================

const categories = [
    {
        title: "Documents",
        icon: FileText,
        className: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
    },
    {
        title: "Certificates",
        icon: Award,
        className: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    {
        title: "Notes",
        icon: StickyNote,
        className: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
    {
        title: "Links",
        icon: LinkIcon,
        className: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
    },
    {
        title: "Credentials",
        icon: KeyRound,
        className: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    },
    {
        title: "Passwords",
        icon: LockKeyhole,
        className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
];


const features = [
    {
        title: "Secure Storage",
        description:
            "Keep important digital information protected in one centralized workspace with encrypted backups.",
        icon: ShieldCheck,
        iconBg: "bg-cyan-500/10",
        iconText: "text-cyan-600 dark:text-cyan-400",
        iconBorder: "border-cyan-500/20",
        hoverBorder: "hover:border-cyan-500/40",
        actionText: "text-cyan-600 dark:text-cyan-400",
        action: "Explore Secure Storage",
    },
    {
        title: "Smart Organization",
        description:
            "Organize documents, certificates, notes, links and credentials together seamlessly.",
        icon: FolderOpen,
        iconBg: "bg-blue-500/10",
        iconText: "text-blue-600 dark:text-blue-400",
        iconBorder: "border-blue-500/20",
        hoverBorder: "hover:border-blue-500/40",
        actionText: "text-blue-600 dark:text-blue-400",
        action: "Explore Organization",
    },
    {
        title: "Quick Access & Search",
        description:
            "Find and access your digital assets whenever you need them with instantaneous keyword search.",
        icon: Search,
        iconBg: "bg-sky-500/10",
        iconText: "text-sky-600 dark:text-sky-400",
        iconBorder: "border-sky-500/20",
        hoverBorder: "hover:border-sky-500/40",
        actionText: "text-sky-600 dark:text-sky-400",
        action: "Instant Search",
    },
    {
        title: "OTP Verification",
        description:
            "Multi-factor verification safeguards account registration, login sessions, and password recovery.",
        icon: LockKeyhole,
        iconBg: "bg-purple-500/10",
        iconText: "text-purple-600 dark:text-purple-400",
        iconBorder: "border-purple-500/20",
        hoverBorder: "hover:border-purple-500/40",
        actionText: "text-purple-600 dark:text-purple-400",
        action: "Learn Security",
    },
    {
        title: "Responsive Across Devices",
        description:
            "Use Calvion comfortably across desktop, tablet and mobile screens with adaptive layouts.",
        icon: Smartphone,
        iconBg: "bg-amber-500/10",
        iconText: "text-amber-600 dark:text-amber-400",
        iconBorder: "border-amber-500/20",
        hoverBorder: "hover:border-amber-500/40",
        actionText: "text-amber-600 dark:text-amber-400",
        action: "Cross-Platform Sync",
    },
    {
        title: "Centralized Workspace",
        description:
            "Keep your digital information organized and accessible from one unified cloud vault.",
        icon: Database,
        iconBg: "bg-emerald-500/10",
        iconText: "text-emerald-600 dark:text-emerald-400",
        iconBorder: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/40",
        actionText: "text-emerald-600 dark:text-emerald-400",
        action: "Open Unified Vault",
    },
];


// =========================================
// HOME
// =========================================

function Home() {

    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const fullText = "Your Digital Life, Organized.";

    const [typedText, setTypedText] = useState("");


    // =========================================
    // TYPEWRITER
    // =========================================

    useEffect(() => {

        let index = 0;

        const timer = window.setInterval(() => {

            index += 1;

            setTypedText(
                fullText.slice(0, index)
            );

            if (index >= fullText.length) {
                window.clearInterval(timer);
            }

        }, 55);


        return () => {
            window.clearInterval(timer);
        };

    }, []);


    // =========================================
    // SCROLL
    // =========================================

    const scrollTo = (
        id: string
    ) => {

        document
            .getElementById(id)
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

    };


    return (

        <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#06070a] dark:text-neutral-100 transition-colors duration-200">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#07090e] shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200">
                <div className="mx-auto flex h-16 w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">

                    {/* ================= LOGO ================= */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        aria-label="Go to Calvion home"
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

                        <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                            Calvion
                            <span className="ml-1.5 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent text-xs uppercase tracking-wider">
                                Cloud
                            </span>
                        </span>

                    </button>


                    {/* ================= NAVIGATION ================= */}

                    <nav
                        className="
                            flex
                            items-center
                            gap-1
                            sm:gap-2
                        "
                    >

                        {/* FEATURES */}

                        <button
                            type="button"
                            onClick={() =>
                                scrollTo("features")
                            }
                            className="
                                hidden
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                dark:text-neutral-300
                                transition
                                hover:bg-blue-50
                                dark:hover:bg-neutral-800/80
                                hover:text-blue-600
                                dark:hover:text-cyan-400
                                md:block
                            "
                        >
                            Features
                        </button>


                        {/* SECURITY */}

                        <button
                            type="button"
                            onClick={() =>
                                scrollTo("security")
                            }
                            className="
                                hidden
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                dark:text-neutral-300
                                transition
                                hover:bg-blue-50
                                dark:hover:bg-neutral-800/80
                                hover:text-blue-600
                                dark:hover:text-cyan-400
                                md:block
                            "
                        >
                            Security
                        </button>

                        {/* DEVELOPER HUB */}
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
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

                        {/* THEME TOGGLE (Sun / Moon) */}

                        <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="
                                group
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200/80
                                dark:border-neutral-800
                                bg-white
                                dark:bg-[#0c0c0e]
                                text-slate-600
                                dark:text-neutral-300
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-cyan-500/50
                                hover:text-cyan-500
                                dark:hover:border-cyan-500/50
                                dark:hover:text-cyan-400
                            "
                            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <Sun size={17} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                            ) : (
                                <Moon size={17} className="text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
                            )}
                        </button>


                        {/* SIGN IN */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                dark:text-neutral-300
                                transition
                                hover:bg-blue-50
                                dark:hover:bg-neutral-800/80
                                hover:text-blue-600
                                dark:hover:text-white
                                sm:px-4
                            "
                        >

                            <LogIn size={17} />

                            <span>
                                Sign In
                            </span>

                        </button>


                        {/* GET STARTED */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-gradient-to-r
                                from-blue-600
                                to-indigo-600
                                dark:from-cyan-500
                                dark:to-blue-600
                                px-4
                                text-sm
                                font-semibold
                                text-white
                                shadow-md
                                shadow-blue-500/20
                                dark:shadow-cyan-500/20
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:from-blue-700
                                hover:to-indigo-700
                                dark:hover:from-cyan-600
                                dark:hover:to-blue-700
                                hover:shadow-lg
                                focus:outline-none
                                focus:ring-4
                                focus:ring-blue-100
                                dark:focus:ring-cyan-950
                                sm:px-5
                            "
                        >

                            <UserPlus size={17} />

                            <span>
                                Get Started
                            </span>

                        </button>

                    </nav>

                </div>

            </header>


            {/* =====================================================
                HERO
            ===================================================== */}

            <main>


                <section
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-slate-200/70
                        dark:border-neutral-800
                        bg-white
                        dark:bg-[#06070a]
                        transition-colors
                        duration-200
                    "
                >


                    {/* BACKGROUND GLOW (Dark mode only) */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-40
                            -top-40
                            h-[500px]
                            w-[500px]
                            rounded-full
                            hidden
                            dark:block
                            dark:bg-cyan-600/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-40
                            -left-40
                            h-[450px]
                            w-[450px]
                            rounded-full
                            hidden
                            dark:block
                            dark:bg-blue-600/10
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            mx-auto
                            grid
                            w-full
                            max-w-[1720px]
                            items-center
                            gap-12
                            px-5
                            py-14
                            sm:px-8
                            sm:py-20
                            lg:grid-cols-[1.05fr_0.95fr]
                            lg:gap-20
                            lg:px-10
                            xl:px-12
                            lg:py-24
                        "
                    >


                        {/* ================= HERO CONTENT ================= */}

                        <div className="max-w-2xl">


                            {/* BADGE */}

                            <div
                                className="
                                    mb-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-blue-100
                                    dark:border-cyan-500/30
                                    bg-blue-50
                                    dark:bg-cyan-500/10
                                    px-3.5
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-blue-600
                                    dark:text-cyan-400
                                "
                            >

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-blue-600
                                        dark:bg-cyan-400
                                    "
                                />

                                Secure Digital Workspace

                            </div>


                            {/* HEADING */}

                            <h1
                                className="
                                    min-h-[105px]
                                    text-4xl
                                    font-bold
                                    leading-[1.08]
                                    tracking-tight
                                    text-slate-950
                                    dark:text-white
                                    sm:min-h-[125px]
                                    sm:text-5xl
                                    lg:text-6xl
                                "
                            >

                                {typedText.includes(
                                    "Organized"
                                ) ? (

                                    <>
                                        {
                                            typedText.slice(
                                                0,
                                                typedText.indexOf(
                                                    "Organized"
                                                )
                                            )
                                        }

                                        <span
                                            className="
                                                bg-gradient-to-r
                                                from-blue-600
                                                via-indigo-600
                                                to-violet-600
                                                dark:from-cyan-400
                                                dark:via-blue-400
                                                dark:to-indigo-400
                                                bg-clip-text
                                                text-transparent
                                            "
                                        >

                                            {
                                                typedText.slice(
                                                    typedText.indexOf(
                                                        "Organized"
                                                    )
                                                )
                                            }

                                        </span>

                                    </>

                                ) : (

                                    typedText

                                )}

                                <span
                                    className="
                                        ml-1
                                        animate-pulse
                                        text-blue-600
                                        dark:text-cyan-400
                                    "
                                >
                                    |
                                </span>

                            </h1>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mt-5
                                    max-w-xl
                                    text-base
                                    leading-7
                                    text-slate-500
                                    dark:text-neutral-400
                                    sm:text-lg
                                    sm:leading-8
                                "
                            >

                                Keep documents, certificates, notes,
                                credentials and links organized in one
                                secure digital workspace.

                            </p>


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="
                                        inline-flex
                                        h-12
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-indigo-600
                                        dark:from-cyan-500
                                        dark:to-blue-600
                                        px-6
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-md
                                        shadow-blue-500/20
                                        dark:shadow-cyan-500/25
                                        transition
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:from-blue-700
                                        hover:to-indigo-700
                                        dark:hover:from-cyan-600
                                        dark:hover:to-blue-700
                                        hover:shadow-lg
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-blue-100
                                        dark:focus:ring-cyan-950
                                    "
                                >

                                    Create Free Account

                                    <ArrowRight size={18} />

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="
                                        inline-flex
                                        h-12
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-200
                                        dark:border-neutral-700
                                        bg-white
                                        dark:bg-neutral-900/80
                                        px-6
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        dark:text-neutral-200
                                        shadow-sm
                                        transition
                                        hover:border-blue-200
                                        dark:hover:border-neutral-600
                                        hover:bg-blue-50
                                        dark:hover:bg-neutral-800
                                        hover:text-blue-600
                                        dark:hover:text-white
                                    "
                                >

                                    <LogIn size={18} />

                                    Sign In

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/developer")
                                    }
                                    className="
                                        inline-flex
                                        h-12
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-cyan-500/30
                                        bg-cyan-500/10
                                        dark:bg-cyan-500/15
                                        px-5
                                        text-sm
                                        font-bold
                                        text-cyan-700
                                        dark:text-cyan-300
                                        shadow-sm
                                        transition
                                        hover:bg-cyan-500/20
                                        dark:hover:bg-cyan-500/25
                                        hover:border-cyan-500/50
                                    "
                                >
                                    <Code2 size={18} className="text-cyan-600 dark:text-cyan-400" />
                                    <span>Developer Hub</span>
                                </button>

                            </div>


                            {/* TRUST POINTS */}

                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    gap-x-6
                                    gap-y-3
                                "
                            >

                                {[
                                    "Secure workspace",
                                    "OTP verification",
                                    "Easy organization",
                                ].map((item) => (

                                    <div
                                        key={item}
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-slate-500
                                            dark:text-neutral-400
                                        "
                                    >

                                        <CheckCircle2
                                            size={16}
                                            className="text-blue-600 dark:text-cyan-400"
                                        />

                                        {item}

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* ================= PREVIEW ================= */}

                        <div className="relative">


                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    dark:border-neutral-800
                                    bg-white
                                    dark:bg-[#0c0c0e]
                                    p-5
                                    shadow-[0_25px_70px_rgba(37,99,235,0.10)]
                                    dark:shadow-none
                                    sm:p-7
                                    transition-colors
                                    duration-200
                                "
                            >


                                {/* PREVIEW HEADER */}

                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-center
                                        justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-slate-400
                                                dark:text-neutral-500
                                            "
                                        >
                                            Your workspace
                                        </p>

                                        <h2
                                            className="
                                                mt-1
                                                text-lg
                                                font-bold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            Digital Assets
                                        </h2>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-50
                                            dark:bg-cyan-500/10
                                            border
                                            border-transparent
                                            dark:border-cyan-500/20
                                            text-blue-600
                                            dark:text-cyan-400
                                        "
                                    >

                                        <Folder size={20} />

                                    </div>

                                </div>


                                {/* CATEGORY GRID */}

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    {categories.map(
                                        ({
                                            title,
                                            icon: Icon,
                                            className,
                                        }) => (

                                            <div
                                                key={title}
                                                className="
                                                    group
                                                    flex
                                                    items-center
                                                    gap-3
                                                    rounded-2xl
                                                    border
                                                    border-slate-100
                                                    dark:border-neutral-800
                                                    bg-slate-50/70
                                                    dark:bg-[#121318]
                                                    p-3.5
                                                    transition
                                                    duration-200
                                                    hover:-translate-y-0.5
                                                    hover:border-blue-100
                                                    dark:hover:border-cyan-500/30
                                                    hover:bg-white
                                                    dark:hover:bg-[#181a22]
                                                    hover:shadow-md
                                                    dark:hover:shadow-none
                                                "
                                            >

                                                <div
                                                    className={`
                                                        flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        border
                                                        dark:border-transparent
                                                        ${className}
                                                    `}
                                                >

                                                    <Icon
                                                        size={19}
                                                    />

                                                </div>


                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-slate-700
                                                        dark:text-neutral-200
                                                    "
                                                >
                                                    {title}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* PREVIEW FOOTER */}

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-blue-50
                                        to-indigo-50
                                        dark:from-[#121318]
                                        dark:to-[#121318]
                                        border
                                        border-transparent
                                        dark:border-neutral-800
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <ShieldCheck
                                            size={17}
                                            className="text-blue-600 dark:text-cyan-400"
                                        />

                                        <span
                                            className="
                                                text-xs
                                                font-semibold
                                                text-blue-600
                                                dark:text-cyan-400
                                            "
                                        >
                                            One secure workspace
                                        </span>

                                    </div>


                                    <ArrowRight
                                        size={16}
                                        className="text-blue-600 dark:text-cyan-400"
                                    />

                                </div>

                            </div>


                            {/* DECORATIVE BACK CARD */}

                            <div
                                className="
                                    absolute
                                    -bottom-4
                                    -left-4
                                    -z-10
                                    h-full
                                    w-full
                                    rounded-3xl
                                    bg-gradient-to-br
                                    from-blue-100
                                    to-indigo-100
                                    dark:from-cyan-950/20
                                    dark:to-blue-950/20
                                "
                            />

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    FEATURES
                ===================================================== */}

                <section
                    id="features"
                    className="
                        scroll-mt-20
                        bg-[#f8fafc]
                        dark:bg-[#06070a]
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                        lg:py-24
                        transition-colors
                        duration-200
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-[1720px]
                        "
                    >


                        {/* HEADING */}

                        <div
                            className="
                                mx-auto
                                max-w-2xl
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-blue-600
                                    dark:text-cyan-400
                                "
                            >
                                Why Calvion
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                    dark:text-white
                                    sm:text-4xl
                                "
                            >
                                Everything you need
                            </h2>


                            <p
                                className="
                                    mt-4
                                    text-base
                                    leading-7
                                    text-slate-500
                                    dark:text-neutral-400
                                "
                            >
                                A simple workspace for managing
                                the digital information that matters.
                            </p>

                        </div>


                        {/* FEATURES */}

                        <div
                            className="
                                mt-12
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >

                            {features.map(
                                ({
                                    title,
                                    description,
                                    icon: Icon,
                                    iconBg,
                                    iconText,
                                    iconBorder,
                                    hoverBorder,
                                    actionText,
                                    action,
                                }) => (

                                    <div
                                        key={title}
                                        onClick={() => navigate("/register")}
                                        className={`
                                            cursor-pointer
                                            rounded-3xl
                                            border
                                            border-slate-200/80
                                            dark:border-neutral-800
                                            bg-white
                                            dark:bg-[#0c0c0e]
                                            p-6
                                            sm:p-8
                                            flex
                                            flex-col
                                            justify-between
                                            ${hoverBorder}
                                            hover:shadow-md
                                            dark:hover:shadow-none
                                            transition
                                            group
                                            shadow-sm
                                            dark:shadow-none
                                        `}
                                    >

                                        <div>

                                            <div
                                                className={`
                                                    flex
                                                    h-12
                                                    w-12
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    ${iconBg}
                                                    ${iconText}
                                                    border
                                                    ${iconBorder}
                                                    mb-5
                                                `}
                                            >
                                                <Icon size={24} />
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {title}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                                {description}
                                            </p>

                                        </div>

                                        <div
                                            className={`
                                                mt-6
                                                pt-4
                                                border-t
                                                border-slate-100
                                                dark:border-neutral-800/80
                                                flex
                                                items-center
                                                justify-between
                                                text-xs
                                                ${actionText}
                                                font-bold
                                                group-hover:translate-x-1
                                                transition-transform
                                            `}
                                        >
                                            <span>{action}</span>
                                            <ArrowRight size={14} />
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    DEVELOPER PORTAL SHOWCASE
                ===================================================== */}

                <section
                    id="developer"
                    className="
                        scroll-mt-20
                        border-t
                        border-slate-200/80
                        dark:border-white/[0.08]
                        bg-gradient-to-b
                        from-slate-50
                        via-white
                        to-slate-100/70
                        dark:from-slate-950
                        dark:via-black
                        dark:to-slate-950
                        text-slate-900
                        dark:text-white
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                        transition-colors
                        duration-200
                    "
                >

                    <div className="mx-auto max-w-[1720px]">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">

                            <div>

                                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-700 dark:text-cyan-400 mb-3">

                                    <Terminal size={14} />

                                    <span>Built for Developers &amp; Competitive Programmers</span>

                                </div>

                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                                    Code. Practice. Conquer Tests.
                                </h2>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-neutral-400">
                                    Take your engineering skills to the next level with our in-browser multi-language code editor, direct launchpad to LeetCode, Codeforces, and HackerRank, plus curated DSA test preparation sheets.
                                </p>

                            </div>


                            <div className="flex flex-wrap items-center gap-3">

                                <button
                                    type="button"
                                    onClick={() => navigate("/developer")}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700 transition"
                                >
                                    <Code2 size={18} />
                                    <span>Open Developer Hub</span>
                                    <ArrowRight size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 px-6 text-sm font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-800 transition shadow-sm"
                                >
                                    <UserPlus size={16} />
                                    <span>Register as Developer</span>
                                </button>

                            </div>

                        </div>


                        {/* 3 FEATURE SHOWCASE CARDS */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* CARD 1: CODE PLAYGROUND */}

                            <div
                                onClick={() => navigate("/developer")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-5">
                                        <Code2 size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        In-Browser Code Editor
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        Write and test code in Python, C++, Java, JavaScript, and Go with custom stdin test inputs, execution console, and instant encrypted backup to your vault.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Launch Code Playground</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>


                            {/* CARD 2: COMPETITIVE PLATFORMS */}

                            <div
                                onClick={() => navigate("/developer")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-5">
                                        <Trophy size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Competitive Platforms Hub
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        One-click access to LeetCode, Codeforces, CodeChef, HackerRank, GeeksforGeeks, and AtCoder with live contest trackers and problem archives.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Explore Coding Platforms</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>


                            {/* CARD 3: DSA PREPARATION */}

                            <div
                                onClick={() => navigate("/developer")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-5">
                                        <Sparkles size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Coding Test &amp; DSA Prep
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        Prepare for technical interviews with Blind 75, NeetCode 150, and SDE Sheet questions. Filter by topic, company tag, and solve directly in the browser.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Start DSA Practice</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    SECURITY
                ===================================================== */}

                <section
                    id="security"
                    className="
                        scroll-mt-20
                        border-y
                        border-slate-200
                        dark:border-neutral-800
                        bg-white
                        dark:bg-[#06070a]
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                        transition-colors
                        duration-200
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-[1720px]
                        "
                    >

                        <div className="max-w-3xl mx-auto text-center">

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-50
                                    dark:bg-cyan-500/10
                                    text-blue-600
                                    dark:text-cyan-400
                                    ring-1
                                    ring-blue-100
                                    dark:ring-cyan-500/20
                                "
                            >

                                <ShieldCheck size={27} />

                            </div>


                            <p
                                className="
                                    mt-5
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-blue-600
                                    dark:text-cyan-400
                                "
                            >
                                Security First
                            </p>


                            <h2
                                className="
                                    mt-3
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                    dark:text-white
                                    sm:text-4xl
                                "
                            >
                                Built with security in mind
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-4
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-slate-500
                                    dark:text-neutral-400
                                "
                            >
                                Authentication, OTP verification, and controlled access help keep your Calvion workspace protected at every level.
                            </p>

                        </div>


                        {/* 3 SECURITY SHOWCASE CARDS */}

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* CARD 1: OTP AUTHENTICATION */}

                            <div
                                onClick={() => navigate("/login")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-5">
                                        <LockKeyhole size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Time-Based OTP Auth
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        Multi-factor email OTP validation blocks unauthorized access during signup, signin, and password recovery workflows.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Explore Secure Login</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>


                            {/* CARD 2: ZERO-EXPOSURE VAULT */}

                            <div
                                onClick={() => navigate("/register")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-5">
                                        <ShieldCheck size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Zero-Exposure Private Vault
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        Personal documents, notes, credentials, and code files are kept private, isolated, and accessible strictly by your verified session.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Create Secure Account</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>


                            {/* CARD 3: GRANULAR ACCESS & SHARING */}

                            <div
                                onClick={() => navigate("/register")}
                                className="cursor-pointer rounded-3xl border border-slate-200/80 dark:border-neutral-800 bg-white dark:bg-[#0c0c0e] p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-md dark:hover:shadow-none transition group shadow-sm dark:shadow-none"
                            >

                                <div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-5">
                                        <KeyRound size={24} />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        Granular Access & Sharing
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                                        Share specific assets with trusted collaborators with granular VIEW or EDIT permissions and immediately revocable access.
                                    </p>

                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>Manage Access Controls</span>
                                    <ArrowRight size={14} />
                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CTA
                ===================================================== */}

                <section
                    className="
                        bg-slate-50
                        dark:bg-[#06070a]
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                        transition-colors
                        duration-200
                    "
                >

                    <div
                        className="
                            relative
                            mx-auto
                            max-w-[1720px]
                            overflow-hidden
                            rounded-3xl
                            border
                            border-blue-100
                            dark:border-neutral-800
                            bg-gradient-to-br
                            from-blue-50
                            via-white
                            to-indigo-50
                            dark:from-[#0c0c0e]
                            dark:via-[#0c0c0e]
                            dark:to-[#0c0c0e]
                            px-6
                            py-14
                            text-center
                            shadow-xl
                            shadow-blue-100/50
                            dark:shadow-none
                            sm:px-12
                            sm:py-16
                            transition-colors
                            duration-200
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-24
                                -top-24
                                h-64
                                w-64
                                rounded-full
                                bg-blue-100/80
                                dark:bg-cyan-600/10
                                blur-3xl
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-24
                                -left-24
                                h-64
                                w-64
                                rounded-full
                                bg-indigo-100/70
                                dark:bg-blue-600/10
                                blur-3xl
                            "
                        />


                        <div className="relative">


                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-white
                                    dark:bg-[#121318]
                                    text-blue-600
                                    dark:text-cyan-400
                                    shadow-sm
                                    dark:shadow-none
                                    ring-1
                                    ring-blue-100
                                    dark:ring-neutral-800
                                "
                            >

                                <ShieldCheck size={24} />

                            </div>


                            <h2
                                className="
                                    mt-5
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-950
                                    dark:text-white
                                    sm:text-4xl
                                "
                            >
                                Ready to organize
                                your digital life?
                            </h2>


                            <p
                                className="
                                    mx-auto
                                    mt-4
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                    dark:text-neutral-400
                                    sm:text-base
                                "
                            >
                                Create your Calvion workspace and
                                keep your important digital assets
                                organized in one place.
                            </p>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="
                                    mt-7
                                    inline-flex
                                    h-12
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-indigo-600
                                    dark:from-cyan-500
                                    dark:to-blue-600
                                    px-6
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-md
                                    shadow-blue-500/20
                                    dark:shadow-cyan-500/25
                                    transition
                                    hover:-translate-y-0.5
                                    hover:from-blue-700
                                    hover:to-indigo-700
                                    dark:hover:from-cyan-600
                                    dark:hover:to-blue-700
                                    hover:shadow-lg
                                "
                            >

                                Create Free Account

                                <ArrowRight size={18} />

                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className="
                    border-t
                    border-slate-200
                    dark:border-neutral-800
                    bg-white
                    dark:bg-[#06070a]
                    transition-colors
                    duration-200
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[84px]
                        w-full
                        max-w-[1720px]
                        flex-col
                        gap-4
                        px-5
                        py-6
                        sm:px-8
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        lg:px-10
                        xl:px-12
                    "
                >


                    {/* LEFT */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="
                            flex
                            items-center
                            gap-2.5
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-gradient-to-br
                                from-blue-600
                                to-indigo-600
                                dark:from-cyan-500
                                dark:to-blue-600
                                text-white
                            "
                        >

                            <ShieldCheck size={18} />

                        </div>


                        <span
                            className="
                                font-bold
                                text-slate-900
                                dark:text-white
                            "
                        >
                            Calvion
                        </span>

                    </button>


                    {/* RIGHT */}

                    <div
                        className="
                            text-left
                            text-xs
                            leading-5
                            text-slate-400
                            dark:text-neutral-500
                            lg:text-right
                        "
                    >

                        <p>
                            Secure Digital Asset Management System
                        </p>

                        <p className="mt-0.5">
                            React + TypeScript + Spring Boot
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}


export default Home;