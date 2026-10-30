import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    CheckCircle2,
    ArrowRight,
    ArrowDown,
    LogIn,
    UserPlus,
    Code2,
    Terminal,
    Trophy,
    Sparkles,
    Sun,
    Moon,
    Menu,
    X,
    Command,
    ChevronDown,
    Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";


/* =========================================================
   DESIGN TOKENS
   One accent (deep teal), solid buttons, no gradients/glows.
   Fonts: Bricolage Grotesque (headlines) + Inter (body).
   If your CSP blocks Google Fonts it falls back to system fonts.
   ========================================================= */

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
.cv-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
.cv-display { font-family: 'Bricolage Grotesque', 'Inter', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
.cv-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
`;

const wrap = "mx-auto w-full max-w-[1280px] px-5 sm:px-8";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-[#000000]";

const btnPrimary =
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
const btnGhost =
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-neutral-100 dark:hover:bg-white/10";

const surface = "border border-slate-200 bg-white dark:border-white/10 dark:bg-[#000000]";
const iconTile = "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300";
const bodyText = "text-slate-600 dark:text-neutral-400";

/* =========================================================
   DATA
   ========================================================= */

type CatId = "documents" | "certificates" | "credentials" | "notes" | "links";

const CATEGORIES: Array<{ id: CatId; label: string; icon: LucideIcon }> = [
    { id: "documents", label: "Documents", icon: FileText },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "credentials", label: "Credentials", icon: KeyRound },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "links", label: "Links", icon: LinkIcon },
];

type VaultItem = {
    id: string;
    cat: Exclude<CatId, "all">;
    title: string;
    meta: string;
    icon: LucideIcon;
    fields: Array<[string, string]>;
};

const VAULT_ITEMS: VaultItem[] = [
    {
        id: "passport",
        cat: "documents",
        title: "Passport scan.pdf",
        meta: "PDF · 2.4 MB",
        icon: FileText,
        fields: [
            ["Type", "Identity document"],
            ["Checksum", "SHA-256 · 9f2c…a41e"],
            ["Storage", "Encrypted before upload"],
        ],
    },
    {
        id: "rent",
        cat: "documents",
        title: "Rent agreement.pdf",
        meta: "PDF · 860 KB",
        icon: FileText,
        fields: [
            ["Type", "Agreement"],
            ["Checksum", "SHA-256 · 71be…03d9"],
            ["Storage", "Encrypted before upload"],
        ],
    },
    {
        id: "aws-cert",
        cat: "certificates",
        title: "AWS Cloud Practitioner",
        meta: "Valid till 2028",
        icon: Award,
        fields: [
            ["Issuer", "Amazon Web Services"],
            ["Valid till", "2028"],
            ["Checksum", "SHA-256 · c40a…77f1"],
        ],
    },
    {
        id: "degree",
        cat: "certificates",
        title: "B.Tech degree",
        meta: "Issued 2025",
        icon: Award,
        fields: [
            ["Issuer", "Your university"],
            ["Issued", "2025"],
            ["Checksum", "SHA-256 · 5d18…be20"],
        ],
    },
    {
        id: "github",
        cat: "credentials",
        title: "GitHub",
        meta: "you@example.com",
        icon: KeyRound,
        fields: [
            ["Username", "you@example.com"],
            ["Password", "••••••••••••"],
            ["Website", "github.com"],
        ],
    },
    {
        id: "aws-console",
        cat: "credentials",
        title: "AWS console",
        meta: "IAM user",
        icon: KeyRound,
        fields: [
            ["Username", "iam-user"],
            ["Password", "••••••••••••"],
            ["Website", "console.aws.amazon.com"],
        ],
    },
    {
        id: "interview",
        cat: "notes",
        title: "Interview prep",
        meta: "Edited today",
        icon: StickyNote,
        fields: [
            ["Preview", "Graphs: BFS, DFS, Dijkstra. Revisit DP patterns."],
            ["Storage", "Encrypted before upload"],
        ],
    },
    {
        id: "design",
        cat: "links",
        title: "System design reading list",
        meta: "example.com",
        icon: LinkIcon,
        fields: [
            ["URL", "example.com/system-design"],
            ["Saved", "Last week"],
        ],
    },
];

const FAQS = [
    {
        q: "Can Calvion employees read my stored documents or passwords?",
        a: "No. Calvion uses zero-knowledge client-side encryption. Your data is encrypted in your browser before it is sent, using keys derived from your master password.",
    },
    {
        q: "Can I host Calvion on my own server?",
        a: "Yes. Calvion can be self-hosted with Docker, so you can run your vault on AWS, DigitalOcean, or your own hardware.",
    },
    {
        q: "How does the Developer Hub code playground work?",
        a: "Code runs inside sandboxed runtimes or isolated execution workers, and the output comes back to you right away.",
    },
    {
        q: "What happens if I lose my master password?",
        a: "Because of the zero-knowledge design, admins cannot recover it. You can use the Emergency Recovery Key generated for your account.",
    },
];

type CodeToken = [string, "kw" | "fn" | "p"];
const CODE_LINES: CodeToken[][] = [
    [["def ", "kw"], ["two_sum", "fn"], ["(nums, target):", "p"]],
    [["    seen = {}", "p"]],
    [["    ", "p"], ["for", "kw"], [" i, n ", "p"], ["in", "kw"], [" enumerate(nums):", "p"]],
    [["        ", "p"], ["if", "kw"], [" target - n ", "p"], ["in", "kw"], [" seen:", "p"]],
    [["            ", "p"], ["return", "kw"], [" [seen[target - n], i]", "p"]],
    [["        seen[n] = i", "p"]],
];
const CODE_COLORS: Record<CodeToken[1], string> = {
    kw: "text-indigo-300",
    fn: "text-amber-300",
    p: "text-slate-200",
};

/* =========================================================
   SMALL SHARED PIECES
   ========================================================= */

function SectionIntro({ title, description }: { title: string; description?: string }) {
    return (
        <div className="max-w-2xl">
            <h2 className="cv-display text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">{title}</h2>
            {description && <p className={`mt-3 text-base leading-7 ${bodyText}`}>{description}</p>}
        </div>
    );
}

/* =========================================================
   HERO: interactive vault preview
   ========================================================= */

function VaultPreview() {
    const [cat, setCat] = useState<CatId | null>(null);
    const [selectedId, setSelectedId] = useState<string>(VAULT_ITEMS[0].id);

    const visible = useMemo(
        () => (cat === null ? VAULT_ITEMS : VAULT_ITEMS.filter((item) => item.cat === cat)),
        [cat]
    );
    const selected = visible.find((item) => item.id === selectedId) ?? visible[0];

    const pickCat = (next: CatId) => {
        setCat(next);
        const first = VAULT_ITEMS.find((item) => item.cat === next);
        if (first) setSelectedId(first.id);
    };

    return (
        <div
            className={`overflow-hidden rounded-2xl shadow-xl shadow-slate-900/5 dark:shadow-none ${surface}`}
            aria-label="Calvion vault preview"
        >
            {/* window bar */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex gap-1.5" aria-hidden>
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200 dark:bg-white/5 dark:text-neutral-400 dark:ring-white/10">
                    <Lock size={12} aria-hidden className="text-indigo-700 dark:text-indigo-300" />
                    My vault
                </div>
                <span className="w-10" aria-hidden />
            </div>

            {/* mobile category chips */}
            <div className="flex gap-2 overflow-x-auto border-b border-slate-200 px-3 py-2 dark:border-white/10 sm:hidden">
                {CATEGORIES.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => pickCat(id)}
                        aria-pressed={cat === id}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${focusRing} ${
                            cat === id
                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                : "bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-neutral-300"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid sm:grid-cols-[160px_1fr]">
                {/* sidebar */}
                <nav aria-label="Vault categories" className="hidden border-r border-slate-200 p-3 dark:border-white/10 sm:block">
                    <ul className="space-y-1">
                        {CATEGORIES.map(({ id, label, icon: Icon }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => pickCat(id)}
                                    aria-pressed={cat === id}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors ${focusRing} ${
                                        cat === id
                                            ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200"
                                            : "text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-white/5"
                                    }`}
                                >
                                    <Icon size={16} aria-hidden />
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* list + detail */}
                <div className="min-w-0">
                    <div className="h-[220px] overflow-y-auto overscroll-contain">
                    <ul className="divide-y divide-slate-100 dark:divide-white/5">
                        {visible.map((item) => {
                            const Icon = item.icon;
                            const active = item.id === selected?.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedId(item.id)}
                                        aria-current={active ? "true" : undefined}
                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${focusRing} ${
                                            active ? "bg-slate-50 dark:bg-white/[0.04]" : "hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                                        }`}
                                    >
                                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconTile}`}>
                                            <Icon size={16} aria-hidden />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-slate-900 dark:text-neutral-100">{item.title}</span>
                                            <span className="block truncate text-xs text-slate-500 dark:text-neutral-500">{item.meta}</span>
                                        </span>
                                        <Lock size={13} aria-hidden className="shrink-0 text-slate-400 dark:text-neutral-600" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    </div>

                    {selected && (
                        <div className="border-t border-slate-200 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">{selected.title}</h3>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200">
                                    <ShieldCheck size={11} aria-hidden />
                                    Encrypted
                                </span>
                            </div>
                            <dl className="mt-3 grid grid-cols-[84px_1fr] gap-x-3 gap-y-1.5 text-xs">
                                {selected.fields.map(([label, value]) => (
                                    <div key={label} className="contents">
                                        <dt className="text-slate-500 dark:text-neutral-500">{label}</dt>
                                        <dd className="cv-mono truncate text-slate-800 dark:text-neutral-200">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   DEVELOPER: code editor mockup
   ========================================================= */

function EditorPreview() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#000000] shadow-xl shadow-slate-900/10 dark:border-white/10 dark:shadow-none" aria-label="Code editor preview">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Code2 size={14} aria-hidden className="text-indigo-300" />
                    <span className="cv-mono">two_sum.py</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Lock size={11} aria-hidden />
                    Backed up to your vault
                </span>
            </div>
            <pre className="cv-mono overflow-x-auto px-4 py-4 text-[13px] leading-6">
                {CODE_LINES.map((line, i) => (
                    <div key={i} className="flex">
                        <span aria-hidden className="mr-4 w-4 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
                        <code className="whitespace-pre">
                            {line.map(([text, kind], j) => (
                                <span key={j} className={CODE_COLORS[kind]}>{text}</span>
                            ))}
                        </code>
                    </div>
                ))}
            </pre>
            <div className="grid grid-cols-2 gap-px border-t border-white/10 bg-white/10 text-xs">
                <div className="bg-[#000000] px-4 py-3">
                    <p className="text-slate-500">stdin</p>
                    <p className="cv-mono mt-1 text-slate-500">[2, 7, 11, 15]</p>
                    <p className="cv-mono text-slate-500">9</p>
                </div>
                <div className="bg-[#000000] px-4 py-3">
                    <p className="text-slate-500">output</p>
                    <p className="cv-mono mt-1 text-indigo-500">[0, 1]</p>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   COMMAND PALETTE
   ========================================================= */

type PaletteItem = { id: string; label: string; detail: string; icon: LucideIcon; run: () => void };

function CommandPalette({ items, onClose }: { items: PaletteItem[]; onClose: () => void }) {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLElement | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(q));
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
            setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
        } else if (event.key === "Enter") {
            event.preventDefault();
            choose(filtered[active]);
        } else if (event.key === "Tab") {
            const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([tabindex='-1']), input");
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
            className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/50 px-4 pt-[12vh] backdrop-blur-sm"
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
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-white/10">
                    <Search size={18} aria-hidden className="shrink-0 text-slate-400" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search pages and actions"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="palette-list"
                        aria-activedescendant={filtered[active] ? `palette-${filtered[active].id}` : undefined}
                        className="h-14 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close search"
                        className={`rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5 ${focusRing}`}
                    >
                        Esc
                    </button>
                </div>

                <div id="palette-list" role="listbox" aria-label="Results" className="max-h-[55vh] overflow-y-auto p-2">
                    {filtered.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-neutral-400">No results. Try a different word.</p>
                    )}
                    {filtered.map((item, index) => {
                        const ItemIcon = item.icon;
                        const isActive = index === active;
                        return (
                            <button
                                key={item.id}
                                id={`palette-${item.id}`}
                                role="option"
                                aria-selected={isActive}
                                type="button"
                                tabIndex={-1}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => choose(item)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${
                                    isActive ? "bg-slate-100 dark:bg-white/[0.06]" : ""
                                }`}
                            >
                                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconTile}`}>
                                    <ItemIcon size={17} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-medium text-slate-800 dark:text-neutral-100">{item.label}</span>
                                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-neutral-400">{item.detail}</span>
                                </span>
                                <ArrowRight size={15} aria-hidden className="text-slate-400" />
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

/* =========================================================
   PAGE
   ========================================================= */

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

    const reducedMotion = () =>
        typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* document title + description */
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Calvion Cloud: your digital life, organized";
        let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        const created = !meta;
        if (!meta) {
            meta = document.createElement("meta");
            meta.name = "description";
            document.head.appendChild(meta);
        }
        const previousDescription = meta.content;
        meta.content =
            "Keep documents, certificates, credentials, notes and links in one encrypted, self-hostable workspace.";
        return () => {
            document.title = previousTitle;
            if (created) meta?.remove();
            else if (meta) meta.content = previousDescription;
        };
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setMobileMenuOpen(false), [location.pathname]);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [mobileMenuOpen]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    /* scroll after navigating back to "/" */
    useEffect(() => {
        const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
        if (!target) return;
        const frame = requestAnimationFrame(() => {
            document.getElementById(target)?.scrollIntoView({
                behavior: reducedMotion() ? "auto" : "smooth",
                block: "start",
            });
        });
        return () => cancelAnimationFrame(frame);
    }, [location.state]);

    const scrollTo = useCallback(
        (id: string) => {
            setMobileMenuOpen(false);
            if (location.pathname !== "/") {
                navigate("/", { state: { scrollTo: id } });
                return;
            }
            document.getElementById(id)?.scrollIntoView({
                behavior: reducedMotion() ? "auto" : "smooth",
                block: "start",
            });
        },
        [location.pathname, navigate]
    );

    const paletteItems = useMemo<PaletteItem[]>(
        () => [
            { id: "home", label: "Home", detail: "Go to the homepage", icon: FolderOpen, run: () => navigate("/") },
            { id: "features", label: "Features", detail: "What you can store and how", icon: Sparkles, run: () => scrollTo("features") },
            { id: "security", label: "Security", detail: "How your data is protected", icon: ShieldCheck, run: () => scrollTo("security") },
            { id: "faq", label: "FAQ", detail: "Common questions", icon: ChevronDown, run: () => scrollTo("faq") },
            { id: "developer", label: "Developer Hub", detail: "Code editor and DSA practice", icon: Code2, run: () => navigate("/developer") },
            { id: "login", label: "Sign in", detail: "Open your account", icon: LogIn, run: () => navigate("/login") },
            { id: "register", label: "Create account", detail: "Start for free", icon: UserPlus, run: () => navigate("/register") },
            { id: "theme", label: "Toggle theme", detail: "Switch between light and dark", icon: theme === "dark" ? Sun : Moon, run: toggleTheme },
        ],
        [navigate, scrollTo, theme, toggleTheme]
    );

    const navLink = `rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white ${focusRing}`;
    const iconButton = `flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5 ${focusRing}`;

    return (
        <div className="cv-root min-h-screen bg-white text-slate-900 dark:bg-[#000000] dark:text-neutral-100">
            <style>{FONT_CSS}</style>

            <a
                href="#main"
                className="sr-only z-[200] rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to content
            </a>

            {/* ================= HEADER ================= */}
            <header
                className={`sticky top-0 z-50 border-b transition-colors ${
                    scrolled
                        ? "border-slate-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#000000]/90"
                        : "border-transparent bg-white dark:bg-[#000000]"
                }`}
            >
                <div className={`${wrap} flex h-16 items-center justify-between gap-4`}>
                    <Link to="/" aria-label="Calvion home" className={`flex shrink-0 items-center gap-2.5 rounded-lg ${focusRing}`}>
                        <img src="/calvion-icon.png" alt="" width={32} height={32} decoding="async" className="h-8 w-8 rounded-lg object-contain" />
                        <span className="cv-display text-lg font-bold text-slate-950 dark:text-white">Calvion</span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                        <button type="button" onClick={() => scrollTo("features")} className={navLink}>Features</button>
                        <button type="button" onClick={() => scrollTo("security")} className={navLink}>Security</button>
                        <Link to="/developer" className={navLink}>Developer Hub</Link>
                        <button type="button" onClick={() => scrollTo("faq")} className={navLink}>FAQ</button>

                        <button
                            type="button"
                            onClick={() => setSearchOpen(true)}
                            aria-label="Search (Ctrl+K)"
                            className={`ml-2 flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-500 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-neutral-400 dark:hover:bg-white/5 ${focusRing}`}
                        >
                            <Search size={14} aria-hidden />
                            <span className="pr-3">Search</span>
                            <kbd className="flex h-5 items-center gap-0.5 rounded border border-slate-200 px-1 dark:border-white/10">
                                <Command size={10} aria-hidden />K
                            </kbd>
                        </button>

                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            className={`ml-1 ${iconButton}`}
                        >
                            {theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                        </button>

                        <Link to="/login" className={`ml-2 ${navLink}`}>Sign in</Link>
                        <Link to="/register" className={`inline-flex h-9 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`}>
                            Get started
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2 md:hidden">
                        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} className={iconButton}>
                            {theme === "dark" ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                            className={iconButton}
                        >
                            {mobileMenuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div id="mobile-menu" className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#000000] md:hidden">
                        <nav className={`${wrap} space-y-1 py-4`} aria-label="Mobile navigation">
                            {[
                                { label: "Features", icon: Sparkles, onClick: () => scrollTo("features") },
                                { label: "Security", icon: ShieldCheck, onClick: () => scrollTo("security") },
                                { label: "Developer Hub", icon: Terminal, onClick: () => navigate("/developer") },
                                { label: "FAQ", icon: ChevronDown, onClick: () => scrollTo("faq") },
                                {
                                    label: "Search",
                                    icon: Search,
                                    onClick: () => {
                                        setMobileMenuOpen(false);
                                        setSearchOpen(true);
                                    },
                                },
                            ].map(({ label, icon: Icon, onClick }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={onClick}
                                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-white/5 ${focusRing}`}
                                >
                                    <Icon size={17} aria-hidden className="text-slate-500 dark:text-neutral-400" />
                                    {label}
                                </button>
                            ))}
                            <div className="grid grid-cols-2 gap-2 pt-3">
                                <Link to="/login" className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium ${btnGhost} ${focusRing}`}>
                                    <LogIn size={15} aria-hidden />
                                    Sign in
                                </Link>
                                <Link to="/register" className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${btnGhost} ${focusRing}`}>
                                    <UserPlus size={15} aria-hidden />
                                    Get started
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {searchOpen && <CommandPalette items={paletteItems} onClose={() => setSearchOpen(false)} />}

            <main id="main">
                {/* ================= HERO ================= */}
                <section className="border-b border-slate-200 dark:border-white/10">
                    <div className={`${wrap} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-24`}>
                        <div className="max-w-xl">
                            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-400/10 dark:text-indigo-200">
                                <ShieldCheck size={15} aria-hidden />
                                Zero-knowledge encrypted workspace
                            </p>
                            <h1 className="cv-display mt-5 text-4xl font-bold leading-[1.05] text-slate-950 dark:text-white sm:text-5xl lg:text-[3.5rem]">
                                Your digital life, organized.
                            </h1>
                            <p className={`mt-5 text-lg leading-8 ${bodyText}`}>
                                Keep documents, certificates, credentials, notes and links in one encrypted place. Open it from any device and share only what you choose.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link to="/register" className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`}>
                                    Create free account
                                    <ArrowRight size={17} aria-hidden />
                                </Link>
                                <Link to="/login" className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`}>
                                    Sign in
                                </Link>
                            </div>

                            <ul className="mt-8 space-y-2.5 text-sm text-slate-700 dark:text-neutral-300">
                                {[
                                    "Encrypted in your browser with AES-256-GCM",
                                    "Email OTP for sign-up, sign-in and recovery",
                                    "Self-host it with Docker if you prefer",
                                ].map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={17} aria-hidden className="mt-0.5 shrink-0 text-indigo-700 dark:text-indigo-300" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <VaultPreview />
                    </div>
                </section>

                {/* ================= FEATURES ================= */}
                <section id="features" className="scroll-mt-20 bg-slate-50 py-16 dark:bg-[#070707] sm:py-24">
                    <div className={wrap}>
                        <SectionIntro
                            title="Everything important, in one vault"
                            description="Stop searching across drives, chats and sticky notes. Put it all in one place that is organized, searchable and private."
                        />

                        <div className="mt-12 grid gap-4 md:grid-cols-6">
                            <article className={`rounded-2xl p-6 md:col-span-3 ${surface}`}>
                                <h3 className="cv-display text-xl font-bold text-slate-950 dark:text-white">Organized by type</h3>
                                <p className={`mt-2 text-sm leading-6 ${bodyText}`}>
                                    Documents, certificates, credentials, notes and links live together in one workspace, each with the fields that make sense for it.
                                </p>
                                <ul className="mt-5 flex flex-wrap gap-2">
                                    {CATEGORIES.map(({ id, label, icon: Icon }) => (
                                        <li key={id} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-white/5 dark:text-neutral-300">
                                            <Icon size={13} aria-hidden className="text-indigo-700 dark:text-indigo-300" />
                                            {label}
                                        </li>
                                    ))}
                                </ul>
                            </article>

                            <article className={`rounded-2xl p-6 md:col-span-3 ${surface}`}>
                                <h3 className="cv-display text-xl font-bold text-slate-950 dark:text-white">Find anything fast</h3>
                                <p className={`mt-2 text-sm leading-6 ${bodyText}`}>
                                    Type a word and jump straight to the right certificate, login or note.
                                </p>
                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]" aria-hidden>
                                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200 dark:bg-white/5 dark:text-neutral-100 dark:ring-white/10">
                                        <Search size={14} className="text-slate-400" />
                                        aws
                                    </div>
                                    <div className="mt-2 space-y-1 text-sm">
                                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 dark:text-neutral-300">
                                            <Award size={14} className="text-indigo-700 dark:text-indigo-300" /> AWS Cloud Practitioner
                                        </div>
                                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 dark:text-neutral-300">
                                            <KeyRound size={14} className="text-indigo-700 dark:text-indigo-300" /> AWS console
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Private by design",
                                    text: "Everything is encrypted in your browser before it is stored, so only you can read it.",
                                },
                                {
                                    icon: LockKeyhole,
                                    title: "Email OTP verification",
                                    text: "A time-limited code protects sign-up, sign-in and password recovery.",
                                },
                                {
                                    icon: Smartphone,
                                    title: "Works on every screen",
                                    text: "The layout adapts to desktop, tablet and phone, so your vault is always within reach.",
                                },
                            ].map(({ icon: Icon, title, text }) => (
                                <article key={title} className={`rounded-2xl p-6 md:col-span-2 ${surface}`}>
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconTile}`}>
                                        <Icon size={20} aria-hidden />
                                    </span>
                                    <h3 className="cv-display mt-4 text-lg font-bold text-slate-950 dark:text-white">{title}</h3>
                                    <p className={`mt-2 text-sm leading-6 ${bodyText}`}>{text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ================= HOW IT WORKS (a real sequence) ================= */}
                <section className="py-16 sm:py-24">
                    <div className={wrap}>
                        <SectionIntro title="Set up in a few minutes" />
                        <ol className="mt-12 grid gap-8 md:grid-cols-3">
                            {[
                                { title: "Create your account", text: "Sign up with your email and confirm it with a one-time code." },
                                { title: "Add what matters", text: "Upload documents, save logins, write notes and keep your important links." },
                                { title: "Open it anywhere", text: "Sign in from any device, and share single items with VIEW or EDIT access." },
                            ].map((step, i) => (
                                <li key={step.title} className="border-t-2 border-slate-900 pt-5 dark:border-white">
                                    <span className="cv-display text-3xl font-bold text-indigo-700 dark:text-indigo-300">{i + 1}</span>
                                    <h3 className="cv-display mt-2 text-xl font-bold text-slate-950 dark:text-white">{step.title}</h3>
                                    <p className={`mt-2 text-sm leading-6 ${bodyText}`}>{step.text}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* ================= DEVELOPER ================= */}
                <section id="developer" className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#070707] sm:py-24">
                    <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
                        <div>
                            <h2 className="cv-display max-w-lg text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
                                Practice and ship code from the same place
                            </h2>
                            <p className={`mt-3 max-w-lg text-base leading-7 ${bodyText}`}>
                                The Developer Hub gives you an in-browser editor, quick access to coding platforms and curated interview sheets.
                            </p>

                            <ul className="mt-8 space-y-5">
                                {[
                                    { icon: Code2, title: "In-browser code editor", text: "Run Python, C++, Java, JavaScript and Go with custom input, and back your code up to the vault." },
                                    { icon: Trophy, title: "Coding platforms hub", text: "Jump to LeetCode, Codeforces, CodeChef, HackerRank, GeeksforGeeks and AtCoder." },
                                    { icon: Sparkles, title: "DSA interview prep", text: "Work through Blind 75, NeetCode 150 and SDE Sheet questions, filtered by topic." },
                                ].map(({ icon: Icon, title, text }) => (
                                    <li key={title} className="flex gap-4">
                                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconTile}`}>
                                            <Icon size={20} aria-hidden />
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                                            <p className={`mt-1 text-sm leading-6 ${bodyText}`}>{text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link to="/developer" className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`}>
                                    Open Developer Hub
                                    <ArrowRight size={16} aria-hidden />
                                </Link>
                                <Link to="/register" className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`}>
                                    Create account
                                </Link>
                            </div>
                        </div>

                        <EditorPreview />
                    </div>
                </section>

                {/* ================= SECURITY ================= */}
                <section id="security" className="scroll-mt-20 py-16 sm:py-24">
                    <div className={`${wrap} grid items-start gap-12 lg:grid-cols-2 lg:gap-16`}>
                        <div>
                            <h2 className="cv-display max-w-lg text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
                                Encrypted before it leaves your browser
                            </h2>
                            <p className={`mt-3 max-w-lg text-base leading-7 ${bodyText}`}>
                                Calvion is built so the server never needs to see your data in readable form.
                            </p>

                            <ul className="mt-8 space-y-5">
                                {[
                                    { icon: LockKeyhole, title: "Email OTP", text: "Time-limited codes verify sign-up, sign-in and password recovery." },
                                    { icon: ShieldCheck, title: "Private vault", text: "Your documents, notes, credentials and code are only available inside your verified session." },
                                    { icon: KeyRound, title: "Sharing you control", text: "Share a single item with VIEW or EDIT permission and revoke access whenever you like." },
                                ].map(({ icon: Icon, title, text }) => (
                                    <li key={title} className="flex gap-4">
                                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconTile}`}>
                                            <Icon size={20} aria-hidden />
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
                                            <p className={`mt-1 text-sm leading-6 ${bodyText}`}>{text}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`rounded-2xl p-6 sm:p-8 ${surface}`}>
                            <h3 className="cv-display text-lg font-bold text-slate-950 dark:text-white">What happens when you save a file</h3>
                            <ol className="mt-6">
                                {[
                                    { title: "Your browser", text: "Encrypts the file with AES-256-GCM using a key from your master password." },
                                    { title: "Calvion server", text: "Stores only the encrypted data and its SHA-256 checksum." },
                                    { title: "Your next session", text: "Downloads the data, checks the checksum and decrypts it on your device." },
                                ].map((step, i, all) => (
                                    <li key={step.title}>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{step.title}</p>
                                            <p className={`mt-1 text-sm leading-6 ${bodyText}`}>{step.text}</p>
                                        </div>
                                        {i < all.length - 1 && (
                                            <div className="flex justify-center py-1.5 text-indigo-700 dark:text-indigo-300" aria-hidden>
                                                <ArrowDown size={18} />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* ================= FAQ ================= */}
                <section id="faq" className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#070707] sm:py-24">
                    <div className={`${wrap} grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16`}>
                        <SectionIntro title="Questions people ask" description="Short answers about privacy, hosting and recovery." />
                        <div className="space-y-3">
                            {FAQS.map((faq, index) => {
                                const open = openFaq === index;
                                return (
                                    <div key={faq.q} className={`overflow-hidden rounded-xl ${surface}`}>
                                        <h3>
                                            <button
                                                type="button"
                                                id={`faq-btn-${index}`}
                                                aria-expanded={open}
                                                aria-controls={`faq-panel-${index}`}
                                                onClick={() => setOpenFaq(open ? null : index)}
                                                className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-neutral-100 ${focusRing}`}
                                            >
                                                <span>{faq.q}</span>
                                                <ChevronDown size={16} aria-hidden className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
                                            </button>
                                        </h3>
                                        {open && (
                                            <div
                                                id={`faq-panel-${index}`}
                                                role="region"
                                                aria-labelledby={`faq-btn-${index}`}
                                                className={`px-5 pb-5 text-sm leading-6 ${bodyText}`}
                                            >
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ================= CTA ================= */}
                <section className="py-16 sm:py-24">
                    <div className={wrap}>
                        <div className="rounded-3xl bg-white px-6 py-14 text-center dark:border dark:border-white/10 dark:bg-[#000000] sm:px-12 sm:py-16">
                            <h2 className="cv-display mx-auto max-w-2xl text-3xl font-bold text-slate sm:text-4xl">
                                Put your important things in one safe place
                            </h2>
                            <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-slate-700">
                                Create your Calvion workspace in under two minutes.
                            </p>
                            <Link
                                to="/register"
                                className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 m-4 text-sm font-semibold transition-colors ${btnGhost} ${focusRing}`} 
                            >
                                Create free account
                                <ArrowRight size={17} aria-hidden />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="border-t border-slate-200 dark:border-white/10">
                <div className={`${wrap} grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]`}>
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2.5">
                            <img src="/calvion-icon.png" alt="" width={28} height={28} loading="lazy" decoding="async" className="h-7 w-7 rounded-md object-contain" />
                            <span className="cv-display text-lg font-bold text-slate-950 dark:text-white">Calvion</span>
                        </div>
                        <p className={`mt-3 text-sm leading-6 ${bodyText}`}>An encrypted workspace for your documents, credentials, notes and code.</p>
                    </div>

                    {[
                        {
                            heading: "Product",
                            links: [
                                { label: "Features", onClick: () => scrollTo("features") },
                                { label: "Security", onClick: () => scrollTo("security") },
                                { label: "FAQ", onClick: () => scrollTo("faq") },
                            ],
                        },
                        {
                            heading: "Account",
                            links: [
                                { label: "Sign in", to: "/login" },
                                { label: "Create account", to: "/register" },
                                { label: "Developer Hub", to: "/developer" },
                            ],
                        },
                        {
                            heading: "Legal",
                            // Make sure these routes exist in your router
                            links: [
                                { label: "Privacy", to: "/privacy" },
                                { label: "Terms", to: "/terms" },
                            ],
                        },
                    ].map((col) => (
                        <nav key={col.heading} aria-label={col.heading}>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{col.heading}</h3>
                            <ul className="mt-3 space-y-2">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {"to" in link && link.to ? (
                                            <Link to={link.to} className={`rounded text-sm hover:text-slate-950 dark:hover:text-white ${bodyText} ${focusRing}`}>
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={"onClick" in link ? link.onClick : undefined}
                                                className={`rounded text-sm hover:text-slate-950 dark:hover:text-white ${bodyText} ${focusRing}`}
                                            >
                                                {link.label}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>
            </footer>
        </div>
    );
}

export default Home;