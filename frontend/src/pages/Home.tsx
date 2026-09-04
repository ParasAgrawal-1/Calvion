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
} from "lucide-react";


// =========================================
// STATIC DATA
// =========================================

const categories = [
    {
        title: "Documents",
        icon: FileText,
        className: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
        title: "Certificates",
        icon: Award,
        className: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
        title: "Notes",
        icon: StickyNote,
        className: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
        title: "Links",
        icon: LinkIcon,
        className: "bg-sky-50 text-sky-600 border-sky-100",
    },
    {
        title: "Credentials",
        icon: KeyRound,
        className: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
        title: "Passwords",
        icon: LockKeyhole,
        className: "bg-slate-100 text-slate-600 border-slate-200",
    },
];


const features = [
    {
        title: "Secure Storage",
        description:
            "Keep important digital information protected in one centralized workspace.",
        icon: ShieldCheck,
        className: "bg-blue-50 text-blue-600",
    },
    {
        title: "Smart Organization",
        description:
            "Organize documents, certificates, notes, links and credentials together.",
        icon: FolderOpen,
        className: "bg-indigo-50 text-indigo-600",
    },
    {
        title: "Quick Access",
        description:
            "Find and access your digital assets whenever you need them.",
        icon: Search,
        className: "bg-sky-50 text-sky-600",
    },
    {
        title: "OTP Verification",
        description:
            "Additional verification helps protect account registration and recovery.",
        icon: LockKeyhole,
        className: "bg-violet-50 text-violet-600",
    },
    {
        title: "Responsive",
        description:
            "Use Calvion comfortably across desktop, tablet and mobile devices.",
        icon: Smartphone,
        className: "bg-cyan-50 text-cyan-600",
    },
    {
        title: "Centralized Workspace",
        description:
            "Keep your digital information organized and accessible from one place.",
        icon: Database,
        className: "bg-blue-50 text-blue-600",
    },
];


// =========================================
// HOME
// =========================================

function Home() {

    const navigate = useNavigate();

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

        <div className="min-h-screen bg-[#f8fafc] text-slate-900">


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header
                className="
                    sticky
                    top-0
                    z-50
                    border-b
                    border-slate-200/80
                    bg-white/95
                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-[72px]
                        w-full
                        max-w-[1400px]
                        items-center
                        justify-between
                        px-5
                        sm:px-8
                        lg:px-10
                    "
                >


                    {/* ================= LOGO ================= */}

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        aria-label="Go to Calvion home"
                        className="
                            group
                            flex
                            shrink-0
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-blue-500
                                to-indigo-600
                                text-white
                                shadow-md
                                shadow-blue-500/20
                                transition
                                duration-200
                                group-hover:-translate-y-0.5
                                group-hover:shadow-lg
                            "
                        >
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 group-hover:scale-105">
                                <img
                                    src="/calvion-icon.png"
                                    alt="Calvion"
                                    className="h-8 w-8 object-contain"
                                />
                            </div>

                        </div>


                        <span
                            className="
                                text-xl
                                font-bold
                                tracking-tight
                                text-slate-900
                                sm:text-2xl
                            "
                        >
                            Calvion
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
                                transition
                                hover:bg-blue-50
                                hover:text-blue-600
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
                                transition
                                hover:bg-blue-50
                                hover:text-blue-600
                                md:block
                            "
                        >
                            Security
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
                                transition
                                hover:bg-blue-50
                                hover:text-blue-600
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
                                px-4
                                text-sm
                                font-semibold
                                text-white
                                shadow-md
                                shadow-blue-500/20
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:from-blue-700
                                hover:to-indigo-700
                                hover:shadow-lg
                                focus:outline-none
                                focus:ring-4
                                focus:ring-blue-100
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
                        bg-white
                    "
                >


                    {/* BACKGROUND GLOW */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-40
                            -top-40
                            h-[500px]
                            w-[500px]
                            rounded-full
                            bg-blue-100/70
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
                            bg-indigo-100/60
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            mx-auto
                            grid
                            w-full
                            max-w-[1400px]
                            items-center
                            gap-12
                            px-5
                            py-14
                            sm:px-8
                            sm:py-20
                            lg:grid-cols-[1.05fr_0.95fr]
                            lg:gap-20
                            lg:px-10
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
                                    bg-blue-50
                                    px-3.5
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-blue-600
                                "
                            >

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-blue-600
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
                                        px-6
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-md
                                        shadow-blue-500/20
                                        transition
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:from-blue-700
                                        hover:to-indigo-700
                                        hover:shadow-lg
                                        focus:outline-none
                                        focus:ring-4
                                        focus:ring-blue-100
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
                                        bg-white
                                        px-6
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        shadow-sm
                                        transition
                                        hover:border-blue-200
                                        hover:bg-blue-50
                                        hover:text-blue-600
                                    "
                                >

                                    <LogIn size={18} />

                                    Sign In

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
                                        "
                                    >

                                        <CheckCircle2
                                            size={16}
                                            className="text-blue-600"
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
                                    bg-white
                                    p-5
                                    shadow-[0_25px_70px_rgba(37,99,235,0.10)]
                                    sm:p-7
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
                                            text-blue-600
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
                                                    bg-slate-50/70
                                                    p-3.5
                                                    transition
                                                    duration-200
                                                    hover:-translate-y-0.5
                                                    hover:border-blue-100
                                                    hover:bg-white
                                                    hover:shadow-md
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
                                            className="text-blue-600"
                                        />

                                        <span
                                            className="
                                                text-xs
                                                font-semibold
                                                text-blue-600
                                            "
                                        >
                                            One secure workspace
                                        </span>

                                    </div>


                                    <ArrowRight
                                        size={16}
                                        className="text-blue-600"
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
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                        lg:py-24
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-[1400px]
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
                                "
                            >
                                A simple workspace for managing
                                the digital information that matters.
                            </p>

                        </div>


                        {/* FEATURES */}

                        <div
                            className="
                                mt-10
                                grid
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {features.map(
                                ({
                                     title,
                                     description,
                                     icon: Icon,
                                     className,
                                 }) => (

                                    <article
                                        key={title}
                                        className="
                                            group
                                            rounded-2xl
                                            border
                                            border-slate-200
                                            bg-white
                                            p-6
                                            shadow-sm
                                            transition
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-blue-200
                                            hover:shadow-xl
                                            hover:shadow-blue-100/40
                                        "
                                    >

                                        <div
                                            className={`
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center
                                                rounded-xl
                                                ${className}
                                                transition
                                                duration-300
                                                group-hover:scale-105
                                            `}
                                        >

                                            <Icon size={21} />

                                        </div>


                                        <h3
                                            className="
                                                mt-5
                                                text-lg
                                                font-bold
                                                text-slate-900
                                                transition
                                                group-hover:text-blue-600
                                            "
                                        >
                                            {title}
                                        </h3>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                leading-6
                                                text-slate-500
                                            "
                                        >
                                            {description}
                                        </p>

                                    </article>

                                )
                            )}

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
                        bg-white
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-4xl
                            text-center
                        "
                    >

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
                                text-blue-600
                                ring-1
                                ring-blue-100
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
                            "
                        >
                            Authentication, OTP verification and
                            controlled access help keep your Calvion
                            workspace protected.
                        </p>


                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                justify-center
                                gap-3
                            "
                        >

                            {[
                                "OTP Verification",
                                "Authenticated Access",
                                "Private Workspace",
                            ].map((item) => (

                                <span
                                    key={item}
                                    className="
                                        rounded-full
                                        border
                                        border-blue-100
                                        bg-blue-50
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    {item}
                                </span>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CTA
                ===================================================== */}

                <section
                    className="
                        px-5
                        py-16
                        sm:px-8
                        sm:py-20
                        lg:px-10
                    "
                >

                    <div
                        className="
                            relative
                            mx-auto
                            max-w-[1400px]
                            overflow-hidden
                            rounded-3xl
                            border
                            border-blue-100
                            bg-gradient-to-br
                            from-blue-50
                            via-white
                            to-indigo-50
                            px-6
                            py-14
                            text-center
                            shadow-xl
                            shadow-blue-100/50
                            sm:px-12
                            sm:py-16
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
                                    text-blue-600
                                    shadow-sm
                                    ring-1
                                    ring-blue-100
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
                                    px-6
                                    text-sm
                                    font-semibold
                                    text-white
                                    shadow-md
                                    shadow-blue-500/20
                                    transition
                                    hover:-translate-y-0.5
                                    hover:from-blue-700
                                    hover:to-indigo-700
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
                    bg-white
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[84px]
                        w-full
                        max-w-[1400px]
                        flex-col
                        gap-4
                        px-5
                        py-6
                        sm:px-8
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        lg:px-10
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
                                text-white
                            "
                        >

                            <ShieldCheck size={18} />

                        </div>


                        <span
                            className="
                                font-bold
                                text-slate-900
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